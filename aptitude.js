/**
 * ============================================================
 *  Aptitude (Calculation) Test Module
 * ============================================================
 *  Self-contained IIFE — shares an HTML page with the signal
 *  psycho test but operates on completely separate DOM elements.
 *
 *  Total questions : 112  (40 add + 20 mul + 40 sub + 12 three-add)
 *  Time limit      : 15 minutes (900 s)
 *  Input           : Numpad / regular keys 1-4
 * ============================================================
 */
(function () {
  'use strict';

  /* ──────────────────────────── constants ──────────────────────────── */

  const TOTAL_QUESTIONS    = 112;
  const TIME_LIMIT_SECONDS = 900;          // 15 minutes
  const PASS_PERCENT       = 60;
  const WARNING_THRESHOLD  = 30;           // seconds remaining
  const WRONG_OFFSET_MIN   = 1;
  const WRONG_OFFSET_MAX   = 15;

  /* ──────────────────────────── state ──────────────────────────────── */

  let questions       = [];   // Array of question objects
  let currentIndex    = 0;
  let correctCount    = 0;
  let wrongCount      = 0;
  let timerInterval   = null;
  let secondsLeft     = TIME_LIMIT_SECONDS;
  let questionStartTs = 0;    // timestamp when current question was shown
  let testActive      = false;

  /* ──────────────────────────── DOM refs ─────────────────────────── */

  const $ = (id) => document.getElementById(id);

  /* ──────────────────────────── utilities ────────────────────────── */

  /**
   * Return a random integer in [min, max] (inclusive).
   */
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Fisher-Yates shuffle (in place).
   */
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ──────────────────────── question generators ─────────────────── */

  /**
   * 2-digit + 2-digit addition.
   */
  function genAddition() {
    const a = randInt(10, 99);
    const b = randInt(10, 99);
    return {
      expression: `${a} + ${b} = ?`,
      answer: a + b
    };
  }

  /**
   * 2-digit × 1-digit multiplication (second operand 2-9).
   */
  function genMultiplication() {
    const a = randInt(10, 99);
    const b = randInt(2, 9);
    return {
      expression: `${a} \u00D7 ${b} = ?`,   // × symbol
      answer: a * b
    };
  }

  /**
   * 2-digit − 2-digit subtraction with NO borrowing.
   * Tens digit of first >= tens digit of second AND
   * units digit of first >= units digit of second.
   */
  function genSubtraction() {
    let a, b;
    do {
      a = randInt(10, 99);
      b = randInt(10, 99);
    } while (
      a <= b ||                                       // result must be positive
      Math.floor(a / 10) < Math.floor(b / 10) ||     // tens check
      (a % 10) < (b % 10)                            // units check
    );
    return {
      expression: `${a} \u2212 ${b} = ?`,   // − symbol
      answer: a - b
    };
  }

  /**
   * Three 2-digit numbers addition.
   */
  function genThreeAddition() {
    const a = randInt(10, 99);
    const b = randInt(10, 99);
    const c = randInt(10, 99);
    return {
      expression: `${a} + ${b} + ${c} = ?`,
      answer: a + b + c
    };
  }

  /* ────────────────────── MCQ option generation ─────────────────── */

  /**
   * Produce an array of 4 unique, positive options that includes
   * the correct answer.  Wrong options fall within ±[1,15] of correct.
   */
  function generateOptions(correctAnswer) {
    const options = new Set();
    options.add(correctAnswer);

    let attempts = 0;
    while (options.size < 4 && attempts < 200) {
      const offset = randInt(WRONG_OFFSET_MIN, WRONG_OFFSET_MAX) *
                     (Math.random() < 0.5 ? -1 : 1);
      const wrong = correctAnswer + offset;
      if (wrong > 0) {
        options.add(wrong);
      }
      attempts++;
    }

    // Fallback — if somehow we still don't have 4 unique values
    let fallback = 1;
    while (options.size < 4) {
      const candidate = correctAnswer + fallback;
      if (candidate > 0 && !options.has(candidate)) {
        options.add(candidate);
      }
      fallback++;
    }

    return shuffle([...options]);
  }

  /* ──────────────────── question pool creation ──────────────────── */

  /**
   * Build and shuffle the full set of 112 questions.
   * Each question object: { expression, answer, options, userAnswer, timeTaken }
   */
  function buildQuestions() {
    const pool = [];

    // 40 × addition
    for (let i = 0; i < 40; i++) pool.push(genAddition());
    // 20 × multiplication
    for (let i = 0; i < 20; i++) pool.push(genMultiplication());
    // 40 × subtraction (no borrow)
    for (let i = 0; i < 40; i++) pool.push(genSubtraction());
    // 12 × three-number addition
    for (let i = 0; i < 12; i++) pool.push(genThreeAddition());

    shuffle(pool);

    // Attach options + tracking fields
    pool.forEach((q) => {
      q.options    = generateOptions(q.answer);
      q.userAnswer = null;   // will hold the selected value (or null if skipped)
      q.timeTaken  = 0;      // seconds spent on this question
    });

    return pool;
  }

  /* ──────────────────────── page navigation ─────────────────────── */

  /**
   * Show the page with the given ID and hide all others.
   */
  function showPage(pageId) {
    document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
    const target = $(pageId);
    if (target) target.classList.add('active');
  }

  /* ──────────────────────── timer helpers ────────────────────────── */

  /**
   * Format seconds → "MM : SS".
   */
  function formatTime(totalSec) {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  /**
   * Start the countdown timer.
   */
  function startTimer() {
    secondsLeft = TIME_LIMIT_SECONDS;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      secondsLeft--;

      if (secondsLeft <= 0) {
        secondsLeft = 0;
        updateTimerDisplay();
        endTest();          // auto-end when time expires
        return;
      }

      updateTimerDisplay();

      // Warning flash when < 30 s remain
      const timerBox = $('apt-timer-box');
      if (timerBox) {
        if (secondsLeft < WARNING_THRESHOLD) {
          timerBox.classList.add('warning');
        } else {
          timerBox.classList.remove('warning');
        }
      }
    }, 1000);
  }

  /**
   * Refresh the on-screen timer text.
   */
  function updateTimerDisplay() {
    const el = $('apt-timer-display');
    if (el) el.textContent = formatTime(secondsLeft);
  }

  /**
   * Stop the interval timer.
   */
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  /* ──────────────────── question rendering ───────────────────────── */

  /**
   * Display the question at `currentIndex`.
   */
  function showQuestion() {
    if (currentIndex >= TOTAL_QUESTIONS) {
      endTest();
      return;
    }

    const q = questions[currentIndex];

    // Question number
    const qNum = $('apt-question-number');
    if (qNum) qNum.textContent = `Question ${currentIndex + 1} / ${TOTAL_QUESTIONS}`;

    // Question text
    const qText = $('apt-question-text');
    if (qText) qText.textContent = q.expression;

    // Options (buttons with key badge + value)
    for (let i = 0; i < 4; i++) {
      const btn = $(`apt-option-${i + 1}`);
      if (btn) {
        btn.innerHTML = `<span class="apt-option-key">${i + 1}</span><span class="apt-option-value">${q.options[i]}</span>`;
        btn.classList.remove('correct-flash', 'wrong-flash');
        btn.disabled = false;
      }
    }

    // Clear feedback
    const fb = $('apt-feedback');
    if (fb) {
      fb.textContent = '';
      fb.className = 'apt-feedback';
    }

    // Progress bar
    const bar = $('apt-progress-bar');
    if (bar) bar.style.width = `${((currentIndex) / TOTAL_QUESTIONS) * 100}%`;

    // Record timestamp for per-question timing
    questionStartTs = Date.now();
  }

  /* ────────────────────── answer handling ────────────────────────── */

  /**
   * Process the user's choice (1-4).
   */
  function handleAnswer(choiceIndex) {
    if (!testActive || currentIndex >= TOTAL_QUESTIONS) return;

    const q = questions[currentIndex];
    const selectedValue = q.options[choiceIndex];

    // Record answer & time
    q.userAnswer = selectedValue;
    q.timeTaken  = parseFloat(((Date.now() - questionStartTs) / 1000).toFixed(2));

    // Track correct / wrong
    if (selectedValue === q.answer) {
      correctCount++;
    } else {
      wrongCount++;
    }

    // Quick visual feedback (flash the selected button)
    const btn = $(`apt-option-${choiceIndex + 1}`);
    if (btn) {
      btn.classList.add(selectedValue === q.answer ? 'correct-flash' : 'wrong-flash');
    }

    // Advance to next question after a tiny delay so the flash is visible
    currentIndex++;

    // Use a minimal timeout so the DOM updates before moving on
    setTimeout(() => {
      showQuestion();
    }, 120);
  }

  /* ────────────────────── test lifecycle ─────────────────────────── */

  /**
   * Begin a new aptitude test.
   */
  function startTest() {
    // Build fresh question set
    questions    = buildQuestions();
    currentIndex = 0;
    correctCount = 0;
    wrongCount   = 0;
    testActive   = true;
    window._aptitudeTestRunning = true;

    showPage('aptitude-page');
    showQuestion();
    startTimer();
  }

  /**
   * End the test (called on timer expiry, exit button, or last question).
   */
  function endTest() {
    if (!testActive) return;   // guard against double-call

    testActive = false;
    window._aptitudeTestRunning = false;
    stopTimer();

    // Mark any remaining questions as skipped (userAnswer stays null)
    // timeTaken stays 0 for unanswered questions
    renderResults();
    showPage('aptitude-results-page');
  }

  /* ────────────────────── results rendering ──────────────────────── */

  /**
   * Build and insert the results page content.
   */
  function renderResults() {
    const attempted = questions.filter((q) => q.userAnswer !== null).length;
    const skipped   = TOTAL_QUESTIONS - attempted;
    const accuracy  = attempted > 0
      ? ((correctCount / attempted) * 100).toFixed(1)
      : '0.0';
    const passed    = (correctCount / TOTAL_QUESTIONS) * 100 >= PASS_PERCENT;

    // Pass / Fail label
    const label = $('apt-result-label');
    if (label) {
      label.textContent = passed ? 'Passed' : 'Failed';
      label.className   = passed ? 'passed' : 'failed';
    }

    // Stat cards
    const statsContainer = $('apt-results-stats');
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stat-card blue">
          <span class="stat-value">${TOTAL_QUESTIONS}</span>
          <span class="stat-label">Total Questions</span>
        </div>
        <div class="stat-card purple">
          <span class="stat-value">${attempted}</span>
          <span class="stat-label">Attempted</span>
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
          <span class="stat-value">${skipped}</span>
          <span class="stat-label">Skipped</span>
        </div>
        <div class="stat-card blue">
          <span class="stat-value">${accuracy}%</span>
          <span class="stat-label">Accuracy</span>
        </div>
      `;
    }

    // Detailed results table
    const tbody = $('apt-results-tbody');
    if (tbody) {
      tbody.innerHTML = questions.map((q, idx) => {
        let result, resultClass, userAns;

        if (q.userAnswer === null) {
          result      = 'Skipped';
          resultClass = 'skipped';
          userAns     = '—';
        } else if (q.userAnswer === q.answer) {
          result      = 'Right';
          resultClass = 'right';
          userAns     = q.userAnswer;
        } else {
          result      = 'Wrong';
          resultClass = 'wrong';
          userAns     = q.userAnswer;
        }

        return `
          <tr>
            <td>${idx + 1}</td>
            <td>${q.expression}</td>
            <td>${userAns}</td>
            <td>${q.answer}</td>
            <td class="${resultClass}">${result}</td>
            <td>${q.timeTaken}s</td>
          </tr>
        `;
      }).join('');
    }
  }

  /* ────────────────────── fullscreen helpers ─────────────────────── */

  /**
   * Toggle browser fullscreen mode.
   */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // Silently ignore if fullscreen is blocked
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  /* ──────────────────── keyboard handler ─────────────────────────── */

  /**
   * Listen for keys 1-4 (regular + numpad).
   */
  function onKeyDown(e) {
    if (!testActive) return;

    // Map key to 0-based choice index
    let choiceIndex = -1;

    switch (e.key) {
      case '1': case 'Numpad1': choiceIndex = 0; break;
      case '2': case 'Numpad2': choiceIndex = 1; break;
      case '3': case 'Numpad3': choiceIndex = 2; break;
      case '4': case 'Numpad4': choiceIndex = 3; break;
      default: return;  // ignore other keys
    }

    // Also handle by code for numpad reliability
    if (choiceIndex === -1) {
      switch (e.code) {
        case 'Numpad1': choiceIndex = 0; break;
        case 'Numpad2': choiceIndex = 1; break;
        case 'Numpad3': choiceIndex = 2; break;
        case 'Numpad4': choiceIndex = 3; break;
        default: return;
      }
    }

    if (choiceIndex >= 0 && choiceIndex <= 3) {
      e.preventDefault();
      handleAnswer(choiceIndex);
    }
  }

  /* ──────────────────── initialisation ───────────────────────────── */

  /**
   * Wire up all event listeners once the DOM is ready.
   */
  function init() {
    // Global flag so the signal test can check if aptitude is active
    window._aptitudeTestRunning = false;

    // Start button on landing page
    const startBtn = $('start-aptitude-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        startTest();
      });
    }

    // Keyboard input (1-4)
    document.addEventListener('keydown', onKeyDown);

    // Option buttons (click / touch fallback)
    for (let i = 1; i <= 4; i++) {
      const btn = $(`apt-option-${i}`);
      if (btn) {
        btn.addEventListener('click', () => {
          if (testActive) handleAnswer(i - 1);
        });
      }
    }

    // Exit button — ends the test early
    const exitBtn = $('apt-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        endTest();
      });
    }

    // Fullscreen buttons
    const fsBtn = $('apt-fullscreen-btn');
    if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);

    const rfsBtn = $('apt-results-fullscreen-btn');
    if (rfsBtn) rfsBtn.addEventListener('click', toggleFullscreen);

    // Results-page exit button — same as reset, go back to landing
    const resExitBtn = $('apt-results-exit-btn');
    if (resExitBtn) {
      resExitBtn.addEventListener('click', () => {
        showPage('landing-page');
      });
    }

    // Reset button — return to landing page
    const resetBtn = $('apt-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        showPage('landing-page');
      });
    }
  }

  /* ──────────────────── boot ─────────────────────────────────────── */

  // Run init when the DOM is fully parsed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready (script loaded with defer / at end of body)
    init();
  }

})();
