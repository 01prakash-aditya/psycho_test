/* =============================================
   DMRC/LMRC/NMRC Machine Psycho Test — App Logic
   ============================================= */

(function () {
    'use strict';

    // ===== CONFIGURATION =====
    const TEST_DURATION = 60; // seconds
    const AUTO_CHANGE_TIMEOUT = 5000; // ms — if no answer, auto-change signal after 5s
    const SIGNAL_COLORS = ['R', 'Y', 'G', 'B'];

    const COLOR_NAMES = {
        R: 'Red',
        Y: 'Yellow',
        G: 'Green',
        B: 'Blue'
    };

    const COLOR_HEX = {
        R: '#ef4444', // Red
        Y: '#eab308', // Yellow
        G: '#22c55e', // Green
        B: '#3b82f6'  // Blue
    };

    // ===== STATE =====
    let testState = {
        isRunning: false,
        timeRemaining: TEST_DURATION,
        timerInterval: null,
        currentSignal: null,         // current signal object { color, imagePath }
        signalShownAt: 0,            // timestamp when current signal was shown
        previousAnswerTime: 0,       // timestamp of the last answer
        responses: [],               // array of { input, required, correct, diffusionTime, comebackTime }
        signalQueue: [],             // pre-generated queue of signals
        queueIndex: 0,
        waitingForAnswer: false,     // true when a signal is on screen awaiting R/Y/G
        answered: false,             // true after user answered current signal (waiting for L)
        autoChangeTimer: null,       // per-signal auto-change timeout
        signalVisible: false,        // is a signal currently showing?
        lLocked: false,              // true after L shows a signal — unlocked by answer or auto-change
    };

    // ===== DOM ELEMENTS =====
    const $ = (id) => document.getElementById(id);

    const elements = {
        landingPage: $('landing-page'),
        testPage: $('test-page'),
        resultsPage: $('results-page'),
        startBtn: $('start-test-btn'),
        timerBox: $('timer-box'),
        timerDisplay: $('timer-display'),
        signalBox: $('signal-box'),
        signalContainer: $('signal-container'),
        signalDisplayArea: $('signal-display-area'),
        feedbackIndicator: $('feedback-indicator'),
        answerBar: $('answer-bar'),
        answerText: $('answer-text'),
        fullscreenBtn: $('fullscreen-btn'),
        fullscreenBtnResults: $('fullscreen-btn-results'),
        exitBtn: $('exit-btn'),
        exitBtnResults: $('exit-btn-results'),
        resetBtn: $('reset-btn'),
        resultStatus: $('result-status'),
        resultLabel: $('result-label'),
        resultsStats: $('results-stats'),
        resultsTbody: $('results-tbody'),
        instructionsPanel: $('instructions-panel'),
        statusText: $('status-text'),
    };

    // ===== SIGNAL QUEUE GENERATION =====
    function generateSignalQueue(count) {
        const queue = [];
        let lastColor = null;
        for (let i = 0; i < count; i++) {
            let color;
            // Avoid too many same colors in a row (max 2)
            do {
                color = SIGNAL_COLORS[Math.floor(Math.random() * SIGNAL_COLORS.length)];
            } while (color === lastColor && Math.random() < 0.6);

            queue.push({
                color: color
            });
            lastColor = color;
        }
        return queue;
    }

    // ===== PAGE NAVIGATION =====
    function showPage(pageName) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        switch (pageName) {
            case 'landing':
                elements.landingPage.classList.add('active');
                break;
            case 'test':
                elements.testPage.classList.add('active');
                break;
            case 'results':
                elements.resultsPage.classList.add('active');
                break;
        }
    }

    // ===== TIMER =====
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function startTimer() {
        testState.timeRemaining = TEST_DURATION;
        updateTimerDisplay();

        testState.timerInterval = setInterval(() => {
            testState.timeRemaining--;
            updateTimerDisplay();

            // Warning state when time < 10 seconds
            if (testState.timeRemaining <= 10) {
                elements.timerBox.classList.add('warning');
            }

            if (testState.timeRemaining <= 0) {
                endTest();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        elements.timerDisplay.textContent = formatTime(testState.timeRemaining);
    }

    function stopTimer() {
        if (testState.timerInterval) {
            clearInterval(testState.timerInterval);
            testState.timerInterval = null;
        }
    }

    // ===== AUTO-CHANGE TIMER =====
    function startAutoChangeTimer() {
        clearAutoChangeTimer();
        testState.autoChangeTimer = setTimeout(() => {
            if (!testState.isRunning) return;
            if (testState.waitingForAnswer && testState.currentSignal) {
                // Time expired without answering — record as missed
                const now = performance.now();
                const diffusionTime = (now - testState.signalShownAt) / 1000;
                let comebackTime = 0;
                if (testState.previousAnswerTime > 0) {
                    comebackTime = (now - testState.previousAnswerTime) / 1000;
                } else {
                    comebackTime = diffusionTime;
                }

                testState.responses.push({
                    input: '-',
                    required: testState.currentSignal.color,
                    correct: false,
                    diffusionTime: diffusionTime,
                    comebackTime: comebackTime,
                    missed: true
                });

                testState.previousAnswerTime = now;
                testState.waitingForAnswer = false;
                testState.answered = false;
                testState.lLocked = false;  // Unlock L after auto-change

                // Show missed feedback
                showFeedback(false, true);

                // Auto-advance to next signal
                showNextSignal();
            }
        }, AUTO_CHANGE_TIMEOUT);
    }

    function clearAutoChangeTimer() {
        if (testState.autoChangeTimer) {
            clearTimeout(testState.autoChangeTimer);
            testState.autoChangeTimer = null;
        }
    }

    // ===== SIGNAL DISPLAY =====
    function showNextSignal() {
        if (!testState.isRunning) return;

        clearAutoChangeTimer();

        const now = performance.now();

        // Generate more if needed
        if (testState.queueIndex >= testState.signalQueue.length) {
            testState.signalQueue = testState.signalQueue.concat(generateSignalQueue(50));
        }

        const signal = testState.signalQueue[testState.queueIndex];
        testState.currentSignal = signal;
        testState.waitingForAnswer = true;
        testState.answered = false;
        testState.signalVisible = true;
        testState.lLocked = true;   // Lock L until answer or auto-change
        testState.queueIndex++;

        // INSTANTLY hide old image to prevent flash
        elements.signalBox.style.backgroundColor = COLOR_HEX[signal.color];
        elements.signalBox.style.display = 'block';

        testState.signalShownAt = performance.now();

        // Clear feedback
        hideFeedback();
        hideAnswerIndicator();

        // Update status
        updateStatus('Identify the signal color! Press R, Y, G, or B');

        // Start auto-change countdown
        startAutoChangeTimer();
    }

    function hideSignal() {
        elements.signalBox.style.display = 'none';
        testState.signalVisible = false;
    }

    // ===== ANSWER PROCESSING =====
    function processAnswer(inputKey) {
        if (!testState.isRunning || !testState.waitingForAnswer || !testState.currentSignal) return;

        clearAutoChangeTimer();

        const now = performance.now();
        const signal = testState.currentSignal;
        const isCorrect = inputKey === signal.color;

        // Diffusion time: time between signal shown and answer given
        const diffusionTime = (now - testState.signalShownAt) / 1000;

        // Comeback time: time between previous answer and current answer
        let comebackTime = 0;
        if (testState.previousAnswerTime > 0) {
            comebackTime = (now - testState.previousAnswerTime) / 1000;
        } else {
            comebackTime = diffusionTime; // first answer
        }

        testState.responses.push({
            input: inputKey,
            required: signal.color,
            correct: isCorrect,
            diffusionTime: diffusionTime,
            comebackTime: comebackTime,
            missed: false
        });

        testState.previousAnswerTime = now;
        testState.waitingForAnswer = false;
        testState.answered = true;
        testState.lLocked = false;  // Unlock L so user can advance to next signal

        // Show feedback
        showFeedback(isCorrect, false);

        // Show answer indicator
        showAnswerIndicator(inputKey, isCorrect);

        // Update status — press L for next
        updateStatus('Press L for next signal');
    }

    // ===== FEEDBACK =====
    function showFeedback(isCorrect, isMissed) {
        const fb = elements.feedbackIndicator;
        if (isMissed) {
            fb.textContent = '⏱ Time Up — Missed!';
            fb.className = 'feedback-indicator show wrong';
        } else {
            fb.textContent = isCorrect ? '✓ Correct' : '✗ Wrong';
            fb.className = 'feedback-indicator show ' + (isCorrect ? 'correct' : 'wrong');
        }

        // Keep feedback visible longer so user can see it
        clearTimeout(testState._feedbackTimeout);
        testState._feedbackTimeout = setTimeout(() => {
            fb.classList.remove('show');
        }, 1200);
    }

    function hideFeedback() {
        clearTimeout(testState._feedbackTimeout);
        elements.feedbackIndicator.classList.remove('show');
    }

    function showAnswerIndicator(key, isCorrect) {
        elements.answerText.textContent = `You pressed: ${key} (${COLOR_NAMES[key]}) — ${isCorrect ? 'Right' : 'Wrong'}`;
        elements.answerBar.classList.add('show');
    }

    function hideAnswerIndicator() {
        elements.answerBar.classList.remove('show');
    }

    function updateStatus(text) {
        if (elements.statusText) {
            elements.statusText.textContent = text;
        }
    }

    // ===== TEST LIFECYCLE =====
    function startTest() {
        // Reset state
        testState = {
            isRunning: true,
            timeRemaining: TEST_DURATION,
            timerInterval: null,
            currentSignal: null,
            signalShownAt: 0,
            previousAnswerTime: 0,
            responses: [],
            signalQueue: generateSignalQueue(100),
            queueIndex: 0,
            waitingForAnswer: false,
            answered: false,
            autoChangeTimer: null,
            signalVisible: false,
            _feedbackTimeout: null,
        };

        // Hide signal initially — user must press L to start
        elements.signalBox.style.display = 'none';
        elements.signalBox.style.backgroundColor = 'transparent';

        elements.timerBox.classList.remove('warning');
        showPage('test');
        startTimer();

        // Show initial prompt
        updateStatus('Press L to see the first signal');
    }

    function endTest() {
        testState.isRunning = false;
        clearAutoChangeTimer();
        stopTimer();
        showResults();
    }

    // ===== RESULTS =====
    function showResults() {
        showPage('results');

        const responses = testState.responses;
        const totalAnswered = responses.length;
        const correctCount = responses.filter(r => r.correct).length;
        const wrongCount = totalAnswered - correctCount;
        const missedCount = responses.filter(r => r.missed).length;
        const accuracy = totalAnswered > 0 ? ((correctCount / totalAnswered) * 100).toFixed(1) : 0;
        const avgDiffusion = totalAnswered > 0
            ? (responses.reduce((sum, r) => sum + r.diffusionTime, 0) / totalAnswered).toFixed(3)
            : 0;

        // Determine pass/fail — criteria: ≥80% accuracy and avg diffusion time < 3 seconds
        const passed = parseFloat(accuracy) >= 80 && parseFloat(avgDiffusion) < 3;

        // Result status
        elements.resultLabel.textContent = passed ? 'Passed' : 'Failed';
        elements.resultLabel.className = passed ? 'passed' : 'failed';

        // Stats cards
        elements.resultsStats.innerHTML = `
            <div class="stat-card blue">
                <span class="stat-value">${totalAnswered}</span>
                <span class="stat-label">Total Signals</span>
            </div>
            <div class="stat-card green">
                <span class="stat-value">${correctCount}</span>
                <span class="stat-label">Correct</span>
            </div>
            <div class="stat-card red">
                <span class="stat-value">${wrongCount}</span>
                <span class="stat-label">Wrong</span>
            </div>
            <div class="stat-card yellow">
                <span class="stat-value">${missedCount}</span>
                <span class="stat-label">Missed</span>
            </div>
            <div class="stat-card blue">
                <span class="stat-value">${accuracy}%</span>
                <span class="stat-label">Accuracy</span>
            </div>
            <div class="stat-card yellow">
                <span class="stat-value">${avgDiffusion}s</span>
                <span class="stat-label">Avg Reaction</span>
            </div>
        `;

        // Build table
        elements.resultsTbody.innerHTML = '';
        responses.forEach((r, i) => {
            const tr = document.createElement('tr');
            let resultClass, resultText;
            if (r.missed) {
                resultClass = 'wrong';
                resultText = 'Missed';
            } else {
                resultClass = r.correct ? 'right' : 'wrong';
                resultText = r.correct ? 'Right' : 'Wrong';
            }
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${r.input}</td>
                <td>${r.required}</td>
                <td class="${resultClass}">${resultText}</td>
                <td>${r.diffusionTime.toFixed(3)}</td>
                <td>${r.comebackTime.toFixed(3)}</td>
            `;
            // Stagger animation
            tr.style.animationDelay = `${i * 0.04}s`;
            elements.resultsTbody.appendChild(tr);
        });
    }

    function resetTest() {
        showPage('landing');
    }

    // ===== FULLSCREEN =====
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen request denied:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // ===== KEYBOARD INPUT =====
    function handleKeyDown(e) {
        if (!testState.isRunning) return;
        // Skip if another test is active — avoid keyboard conflicts
        if (window._aptitudeTestRunning || window._embeddedTestRunning) return;

        // Ignore held-down key repeats entirely
        if (e.repeat) {
            e.preventDefault();
            return;
        }

        const key = e.key.toUpperCase();

        switch (key) {
            case 'L':
                e.preventDefault();
                // If L is locked (signal showing, waiting for answer), ignore
                if (testState.lLocked) return;
                // Show next signal (L is unlocked — either first press, or after answer/auto-change)
                showNextSignal();
                break;
            case 'R':
                e.preventDefault();
                processAnswer('R');
                break;
            case 'Y':
                e.preventDefault();
                processAnswer('Y');
                break;
            case 'G':
                e.preventDefault();
                processAnswer('G');
                break;
            case 'B':
                e.preventDefault();
                processAnswer('B');
                break;
        }
    }

    // ===== EVENT LISTENERS =====
    function init() {
        // Start button
        elements.startBtn.addEventListener('click', startTest);

        // Keyboard
        document.addEventListener('keydown', handleKeyDown);

        // On-screen buttons
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                // Ignore if held down or something, mostly for keyboard mapping
                if (!testState.isRunning) return;
                
                const key = this.getAttribute('data-key');
                if (key === 'L') {
                    if (testState.lLocked) return;
                    showNextSignal();
                } else {
                    processAnswer(key);
                }
                
                // Remove focus so hitting spacebar doesn't re-trigger button
                this.blur();
            });
        });

        // Fullscreen
        elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
        elements.fullscreenBtnResults.addEventListener('click', toggleFullscreen);

        // Exit buttons
        elements.exitBtn.addEventListener('click', () => {
            if (testState.isRunning) {
                endTest();
            } else {
                showPage('landing');
            }
        });

        elements.exitBtnResults.addEventListener('click', () => {
            showPage('landing');
        });

        // Reset
        elements.resetBtn.addEventListener('click', resetTest);
    }

    // Bootstrap
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
