(function () {
  'use strict';

  /* =========================================================
   *  EMBEDDED FIGURES TEST MODULE
   *  25 questions · 15-minute time limit · Keys 1-2-3-4
   * ========================================================= */

  // ── SVG helpers ──────────────────────────────────────────
  const S = 'http://www.w3.org/2000/svg';
  const HEAD = '<svg xmlns="' + S + '" viewBox="0 0 120 120">';
  const STYLE = ' stroke="#1a1a2e" stroke-width="2.5" fill="none" ';
  const TAIL = '</svg>';
  function svg(body) { return HEAD + body + TAIL; }
  function L(x1, y1, x2, y2) { return '<line' + STYLE + 'x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>'; }
  function R(x, y, w, h) { return '<rect' + STYLE + 'x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/>'; }
  function C(cx, cy, r) { return '<circle' + STYLE + 'cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>'; }
  function P(pts) { return '<polygon' + STYLE + 'points="' + pts + '"/>'; }
  function PL(pts) { return '<polyline' + STYLE + 'points="' + pts + '"/>'; }
  function PA(d) { return '<path' + STYLE + 'd="' + d + '"/>'; }
  function EL(cx, cy, rx, ry) { return '<ellipse' + STYLE + 'cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"/>'; }

  // ── Question bank (25 questions) ─────────────────────────

  var scrapedPool = [
  {
    "id": 1,
    "image": "embedded_images/q_1.jpg",
    "correctIndex": 2
  },
  {
    "id": 2,
    "image": "embedded_images/q_2.jpg",
    "correctIndex": 2
  },
  {
    "id": 3,
    "image": "embedded_images/q_3.jpg",
    "correctIndex": 3
  },
  {
    "id": 4,
    "image": "embedded_images/q_4.jpg",
    "correctIndex": 0
  },
  {
    "id": 5,
    "image": "embedded_images/q_5.jpg",
    "correctIndex": 2
  },
  {
    "id": 6,
    "image": "embedded_images/q_6.jpg",
    "correctIndex": 3
  },
  {
    "id": 7,
    "image": "embedded_images/q_7.jpg",
    "correctIndex": 1
  },
  {
    "id": 8,
    "image": "embedded_images/q_8.jpg",
    "correctIndex": 3
  },
  {
    "id": 9,
    "image": "embedded_images/q_9.jpg",
    "correctIndex": 1
  },
  {
    "id": 10,
    "image": "embedded_images/q_10.jpg",
    "correctIndex": 3
  },
  {
    "id": 11,
    "image": "embedded_images/q_11.jpg",
    "correctIndex": 0
  },
  {
    "id": 12,
    "image": "embedded_images/q_12.jpg",
    "correctIndex": 2
  },
  {
    "id": 13,
    "image": "embedded_images/q_13.jpg",
    "correctIndex": 3
  },
  {
    "id": 14,
    "image": "embedded_images/q_14.jpg",
    "correctIndex": 1
  },
  {
    "id": 15,
    "image": "embedded_images/q_15.jpg",
    "correctIndex": 3
  },
  {
    "id": 16,
    "image": "embedded_images/q_16.jpg",
    "correctIndex": 3
  },
  {
    "id": 17,
    "image": "embedded_images/q_17.jpg",
    "correctIndex": 3
  },
  {
    "id": 18,
    "image": "embedded_images/q_18.jpg",
    "correctIndex": 1
  },
  {
    "id": 19,
    "image": "embedded_images/q_19.jpg",
    "correctIndex": 2
  },
  {
    "id": 20,
    "image": "embedded_images/q_20.jpg",
    "correctIndex": 3
  },
  {
    "id": 21,
    "image": "embedded_images/q_21.jpg",
    "correctIndex": 2
  },
  {
    "id": 22,
    "image": "embedded_images/q_22.jpg",
    "correctIndex": 2
  },
  {
    "id": 23,
    "image": "embedded_images/q_23.jpg",
    "correctIndex": 3
  },
  {
    "id": 24,
    "image": "embedded_images/q_24.jpg",
    "correctIndex": 1
  },
  {
    "id": 25,
    "image": "embedded_images/q_25.jpg",
    "correctIndex": 3
  },
  {
    "id": 26,
    "image": "embedded_images/q_26.jpg",
    "correctIndex": 0
  },
  {
    "id": 27,
    "image": "embedded_images/q_27.jpg",
    "correctIndex": 1
  },
  {
    "id": 28,
    "image": "embedded_images/q_28.jpg",
    "correctIndex": 3
  },
  {
    "id": 29,
    "image": "embedded_images/q_29.jpg",
    "correctIndex": 2
  },
  {
    "id": 30,
    "image": "embedded_images/q_30.jpg",
    "correctIndex": 1
  }
];
  var questions = [];
  function generateQuestions() {
    var qs = scrapedPool.slice(); // copy
    // Shuffle pool
    for(var j=qs.length-1; j>0; j--) {
       var rnd = Math.floor(Math.random() * (j+1));
       var t = qs[j]; qs[j] = qs[rnd]; qs[rnd] = t;
    }
    // Pick 25
    qs = qs.slice(0, 25);
    // Assign IDs for tracking
    for(var j=0; j<qs.length; j++) qs[j].id = j + 1;
    questions = qs;
  }
  // ── State variables ──────────────────────────────────────
  var currentQuestion = 0;
  var answers = [];          // { selected: 0-3|null, correct: bool, time: ms }
  var timerInterval = null;
  var remainingSeconds = 600; // 10 minutes
  var testStartTime = null;
  var questionStartTime = null;

  // ── DOM references (resolved lazily) ─────────────────────
  function $(id) { return document.getElementById(id); }

  // ── Public start hook ────────────────────────────────────
  function init() {
    for (var i = 1; i <= 5; i++) {
      var btn = $('start-embedded-' + i);
      if (btn) {
        btn.addEventListener('click', function() {
          generateQuestions();
          startTest();
        });
      }
    }
    var resetBtn = $('emb-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetTest);
    }
    // fullscreen / exit buttons
    wireButton('emb-fullscreen-btn', toggleFullscreen);
    wireButton('emb-exit-btn', exitTest);
    wireButton('emb-results-fullscreen-btn', toggleFullscreen);
    wireButton('emb-results-exit-btn', resetTest);

    // option clicks
    for (var i = 1; i <= 4; i++) {
      (function (idx) {
        var el = $('emb-option-' + idx);
        if (el) el.addEventListener('click', function () { selectAnswer(idx - 1); });
      })(i);
    }
  }

  function wireButton(id, fn) {
    var el = $(id);
    if (el) el.addEventListener('click', fn);
  }

  // ── Test lifecycle ───────────────────────────────────────
  function startTest() {
    currentQuestion = 0;
    answers = [];
    remainingSeconds = 600;
    testStartTime = Date.now();
    window._embeddedTestRunning = true;

    showPage('emb-page');

    showQuestion();
    startTimer();
    document.addEventListener('keydown', handleKey);
  }

  function resetTest() {
    window._embeddedTestRunning = false;
    showPage('landing-page');
  }

  function exitTest() {
    stopTimer();
    window._embeddedTestRunning = false;
    document.removeEventListener('keydown', handleKey);
    finishTest();
  }

  // ── Timer ────────────────────────────────────────────────
  function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(function () {
      remainingSeconds--;
      if (remainingSeconds <= 0) {
        remainingSeconds = 0;
        stopTimer();
        finishTest();
      }
      updateTimerDisplay();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  function updateTimerDisplay() {
    var m = Math.floor(remainingSeconds / 60);
    var s = remainingSeconds % 60;
    var display = $('emb-timer-display');
    if (display) display.textContent = '00:' + pad(m) + ':' + pad(s);
    var box = $('emb-timer-box');
    if (box) {
      if (remainingSeconds < 30) box.classList.add('warning');
      else box.classList.remove('warning');
    }
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  // ── Display question ─────────────────────────────────────
  function showQuestion() {
    if (currentQuestion >= questions.length) { finishTest(); return; }

    var q = questions[currentQuestion];

    // question number
    var qNum = $('emb-question-number');
    if (qNum) qNum.textContent = 'Question ' + (currentQuestion + 1) + ' / ' + questions.length;

    // question figure - NOW A SINGLE IMAGE
    var qFig = $('emb-question-figure');
    if (qFig) qFig.innerHTML = '<img src="' + q.image + '" style="max-width: 100%; max-height: 100%; object-fit: contain;">';

    // options - Generic A, B, C, D
    var labels = ['(A)', '(B)', '(C)', '(D)'];
    for (var i = 0; i < 4; i++) {
      var opt = $('emb-option-' + (i + 1));
      if (opt) {
        opt.innerHTML = '<span class="emb-option-label" style="font-size: 24px; font-weight: bold; margin: auto;">' + labels[i] + '</span>';
        opt.classList.remove('correct-flash', 'wrong-flash');
      }
    }

    // progress
    var bar = $('emb-progress-bar');
    if (bar) bar.style.width = ((currentQuestion / questions.length) * 100) + '%';

    // feedback
    var fb = $('emb-feedback');
    if (fb) fb.textContent = '';

    questionStartTime = Date.now();
  }

  // ── Answer selection ─────────────────────────────────────
  function selectAnswer(idx) {
    if (currentQuestion >= questions.length) return;

    var q = questions[currentQuestion];
    var correct = idx === q.correctIndex;
    var elapsed = Date.now() - questionStartTime;

    answers.push({ selected: idx, correct: correct, time: elapsed });

    // flash
    var optEl = $('emb-option-' + (idx + 1));
    if (optEl) {
      optEl.classList.add(correct ? 'correct-flash' : 'wrong-flash');
    }

    // feedback
    var fb = $('emb-feedback');
    if (fb) fb.textContent = correct ? '✓' : '✗';

    // advance after short delay
    setTimeout(function () {
      currentQuestion++;
      if (currentQuestion >= questions.length) {
        finishTest();
      } else {
        showQuestion();
      }
    }, 150);
  }

  // ── Keyboard handler ─────────────────────────────────────
  function handleKey(e) {
    if (!window._embeddedTestRunning) return;
    if (e.repeat) return;

    var map = {
      'Digit1': 0, 'Digit2': 1, 'Digit3': 2, 'Digit4': 3,
      'Numpad1': 0, 'Numpad2': 1, 'Numpad3': 2, 'Numpad4': 3
    };

    if (e.code in map) {
      e.preventDefault();
      selectAnswer(map[e.code]);
    }
  }

  // ── Finish & results ─────────────────────────────────────
  function finishTest() {
    stopTimer();
    window._embeddedTestRunning = false;
    document.removeEventListener('keydown', handleKey);

    var totalTime = Date.now() - testStartTime;
    var attempted = answers.length;
    var correctCount = 0;
    var wrongCount = 0;
    var skippedCount = questions.length - attempted;

    for (var i = 0; i < answers.length; i++) {
      if (answers[i].correct) correctCount++; else wrongCount++;
    }

    var accuracy = attempted > 0 ? Math.round((correctCount / attempted) * 100) : 0;
    var passed = correctCount >= 13;

    // progress bar full
    var bar = $('emb-progress-bar');
    if (bar) bar.style.width = '100%';

    // show results page
    showPage('emb-results-page');

    // label
    var label = $('emb-result-label');
    if (label) {
      label.textContent = passed ? 'Passed' : 'Failed';
      label.className = passed ? 'passed' : 'failed';
    }

    // time taken
    var totalMin = Math.floor(totalTime / 60000);
    var totalSec = Math.floor((totalTime % 60000) / 1000);
    var timeTaken = pad(totalMin) + ':' + pad(totalSec);

    // stat cards
    var stats = $('emb-results-stats');
    if (stats) {
      stats.innerHTML =
        statCard('Total', questions.length, 'blue') +
        statCard('Attempted', attempted, 'purple') +
        statCard('Correct', correctCount, 'green') +
        statCard('Wrong', wrongCount, 'red') +
        statCard('Skipped', skippedCount, 'yellow') +
        statCard('Accuracy', accuracy + '%', 'green') +
        statCard('Time Taken', timeTaken, 'blue');
    }

    // table
    var tbody = $('emb-results-tbody');
    if (tbody) {
      var rows = '';
      var labels = ['(a)', '(b)', '(c)', '(d)'];
      for (var j = 0; j < questions.length; j++) {
        var ans = answers[j];
        var result, cls, tq, yourAns, correctAns;
        correctAns = labels[questions[j].correctIndex];
        if (!ans) {
          result = 'Skipped'; cls = 'skipped'; tq = '-'; yourAns = '—';
        } else {
          result = ans.correct ? 'Right' : 'Wrong';
          cls = ans.correct ? 'right' : 'wrong';
          yourAns = labels[ans.selected];
          var secs = (ans.time / 1000).toFixed(1);
          tq = secs + 's';
        }
        rows += '<tr><td>' + (j + 1) + '</td><td>' + yourAns + '</td><td>' + correctAns + '</td><td class="' + cls + '">' + result + '</td><td>' + tq + '</td></tr>';
      }
      tbody.innerHTML = rows;
    }
  }

  function statCard(label, value, color) {
    return '<div class="stat-card ' + color + '"><div class="stat-value">' + value + '</div><div class="stat-label">' + label + '</div></div>';
  }

  // ── Helpers ──────────────────────────────────────────────
  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    var target = $(pageId);
    if (target) target.classList.add('active');
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen().catch(function () {});
    }
  }

  // ── Bootstrap ────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
