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

  var questions = (function() {
    var qs = [];

    function eq(l1, l2) {
      var tol = 0.1;
      return (Math.abs(l1[0]-l2[0])<tol && Math.abs(l1[1]-l2[1])<tol && Math.abs(l1[2]-l2[2])<tol && Math.abs(l1[3]-l2[3])<tol) ||
             (Math.abs(l1[0]-l2[2])<tol && Math.abs(l1[1]-l2[3])<tol && Math.abs(l1[2]-l2[0])<tol && Math.abs(l1[3]-l2[1])<tol);
    }

    function splitLine(line) {
      var x1 = line[0], y1 = line[1], x2 = line[2], y2 = line[3];
      var segments = [];
      var midX = (x1 + x2) / 2;
      var midY = (y1 + y2) / 2;
      var dist = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
      if (dist > 65) { 
        segments.push([x1, y1, midX, midY]);
        segments.push([midX, midY, x2, y2]);
      } else {
        segments.push(line);
      }
      return segments;
    }

    function segmentize(lines) {
      var segs = [];
      lines.forEach(function(l) {
        var parts = splitLine(l);
        parts.forEach(function(p) {
          var parts2 = splitLine(p);
          parts2.forEach(function(p2) { segs.push(p2); });
        });
      });
      return segs;
    }

    var F_BORDER = [[20,20,100,20], [100,20,100,100], [100,100,20,100], [20,100,20,20]];
    var F_MIDVERT = [[60,20,60,100]];
    var F_MIDHORIZ = [[20,60,100,60]];
    var F_DIAG1 = [[20,20,100,100]];
    var F_DIAG2 = [[20,100,100,20]];
    var F_DIAMOND = [[60,20,100,60], [100,60,60,100], [60,100,20,60], [20,60,60,20]];
    var F_VTOP = [[20,20,60,60], [100,20,60,60]];
    var F_VBOT = [[20,100,60,60], [100,100,60,60]];
    var F_VLEFT = [[20,20,60,60], [20,100,60,60]];
    var F_VRIGHT = [[100,20,60,60], [100,100,60,60]];
    var F_SQUARE_TL = [[20,20,60,20], [60,20,60,60], [60,60,20,60], [20,60,20,20]];
    var F_SQUARE_BR = [[60,60,100,60], [100,60,100,100], [100,100,60,100], [60,100,60,60]];
    
    var allFeatures = [F_MIDVERT, F_MIDHORIZ, F_DIAG1, F_DIAG2, F_DIAMOND, F_VTOP, F_VBOT, F_VLEFT, F_VRIGHT, F_SQUARE_TL, F_SQUARE_BR];

    var targets = [
      [[20,60,60,60], [20,60,20,100], [20,100,60,60]], 
      [[20,100,100,100], [100,100,60,60], [60,60,20,100]], 
      [[20,20,60,20], [60,20,60,60], [60,60,20,60], [20,60,20,20]], 
      [[20,60,60,60], [60,60,100,20], [100,20,60,20], [60,20,20,60]], 
      [[60,60,100,100], [100,100,60,100], [60,100,20,60], [20,60,60,60]], 
      [[60,20,100,60], [100,60,60,100], [60,100,20,60], [20,60,60,20]], 
      [[20,60,60,60], [60,60,60,100], [60,100,100,100]], 
      [[60,20,60,60], [60,60,60,100], [20,60,60,60], [60,60,100,60]], 
      [[20,20,20,60], [20,60,60,60]], 
      [[20,20,20,60], [20,60,20,100], [20,100,60,100], [60,100,100,100], [100,100,60,60], [60,60,20,20]], 
      [[60,20,100,20], [100,20,100,60], [100,60,60,60], [60,60,60,20], [60,60,20,100], [20,100,100,100]], 
      [[60,20,60,60], [60,60,20,60], [20,20,100,100]] 
    ];

    function drawLines(lines) { return lines.map(function(l) { return L(l[0], l[1], l[2], l[3]); }).join(''); }
    function getContains(gridSegs, targetSegs) {
      return targetSegs.every(function(ts) {
        return gridSegs.some(function(gs) { return eq(gs, ts); });
      });
    }

    var allCombos = [];
    for(var i=0; i<allFeatures.length; i++) {
      for(var j=i+1; j<allFeatures.length; j++) {
        for(var k=j+1; k<allFeatures.length; k++) {
          allCombos.push([i, j, k]);
        }
      }
    }

    var usedCombos = {};

    for (var i = 0; i < 25; i++) {
      var target = targets[i % targets.length];
      var targetSegs = segmentize(target);
      
      var validCombos = allCombos.filter(function(c) {
        var grid = F_BORDER.concat(allFeatures[c[0]], allFeatures[c[1]], allFeatures[c[2]]);
        return getContains(segmentize(grid), targetSegs);
      });
      
      var selectedCombo = validCombos.length > 0 ? validCombos[0] : allCombos[0];
      for(var v=0; v<validCombos.length; v++) {
         var key = (i % targets.length) + '_' + validCombos[v].join('_');
         if (!usedCombos[key]) {
           selectedCombo = validCombos[v];
           usedCombos[key] = true;
           break;
         }
      }
      
      var correctGrid = F_BORDER.concat(allFeatures[selectedCombo[0]], allFeatures[selectedCombo[1]], allFeatures[selectedCombo[2]]);
      var correctSegs = segmentize(correctGrid);
      targetSegs.forEach(function(ts) {
        if (!correctSegs.some(function(gs) { return eq(gs, ts); })) {
          correctSegs.push(ts);
        }
      });
      
      var optionsData = [correctSegs];
      
      var featuresToSwap = [0, 1, 2];
      for(var swapI = 0; swapI < 3; swapI++) {
         var fRemove = selectedCombo[featuresToSwap[swapI]];
         var fA = selectedCombo[(swapI+1)%3];
         var fB = selectedCombo[(swapI+2)%3];
         
         for(var tryF = 0; tryF < allFeatures.length; tryF++) {
            if(tryF === fRemove || tryF === fA || tryF === fB) continue;
            var distGrid = F_BORDER.concat(allFeatures[fA], allFeatures[fB], allFeatures[tryF]);
            var distSegs = segmentize(distGrid);
            
            if (!getContains(distSegs, targetSegs)) {
               var isUnique = true;
               for(var k=0; k<optionsData.length; k++) {
                  if (optionsData[k].length === distSegs.length) {
                     var same = distSegs.every(function(ds) {
                        return optionsData[k].some(function(os) { return eq(os, ds); });
                     });
                     if (same) isUnique = false;
                  }
               }
               if (isUnique) {
                 optionsData.push(distSegs);
                 break; 
               }
            }
         }
      }
      
      var attempts = 0;
      while(optionsData.length < 4 && attempts < 200) {
         attempts++;
         var r1 = Math.floor(Math.random() * allFeatures.length);
         var r2 = Math.floor(Math.random() * allFeatures.length);
         var r3 = Math.floor(Math.random() * allFeatures.length);
         if (r1===r2 || r2===r3 || r1===r3) continue;
         
         var distGrid = F_BORDER.concat(allFeatures[r1], allFeatures[r2], allFeatures[r3]);
         var distSegs = segmentize(distGrid);
         if (!getContains(distSegs, targetSegs)) {
             var isUnique = true;
             for(var k=0; k<optionsData.length; k++) {
                if (optionsData[k].length === distSegs.length) {
                   var same = distSegs.every(function(ds) {
                      return optionsData[k].some(function(os) { return eq(os, ds); });
                   });
                   if (same) isUnique = false;
                }
             }
             if (isUnique) optionsData.push(distSegs);
         }
      }
      
      // Fallback to prevent crash if uniqueness couldn't be satisfied
      while(optionsData.length < 4) {
         var fallbackGrid = F_BORDER.concat(allFeatures[0], allFeatures[1], allFeatures[optionsData.length]);
         optionsData.push(segmentize(fallbackGrid));
      }
      
      var correctIndex = (i * 5) % 4;
      var temp = optionsData[correctIndex];
      optionsData[correctIndex] = optionsData[0];
      optionsData[0] = temp;
      
      var optionsSvg = optionsData.map(function(optLines) {
        return svg(drawLines(optLines));
      });
      
      qs.push({
        id: i + 1,
        questionSvg: svg(drawLines(targetSegs)),
        options: optionsSvg,
        correctIndex: correctIndex
      });
    }
    return qs;
  })();
  // ── State variables ──────────────────────────────────────
  var currentQuestion = 0;
  var answers = [];          // { selected: 0-3|null, correct: bool, time: ms }
  var timerInterval = null;
  var remainingSeconds = 300; // 5 minutes
  var testStartTime = null;
  var questionStartTime = null;

  // ── DOM references (resolved lazily) ─────────────────────
  function $(id) { return document.getElementById(id); }

  // ── Public start hook ────────────────────────────────────
  function init() {
    var btn = $('start-embedded-btn');
    if (btn) {
      btn.addEventListener('click', startTest);
    }
    var resetBtn = $('emb-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetTest);
    }
    // fullscreen / exit buttons
    wireButton('emb-fullscreen-btn', toggleFullscreen);
    wireButton('emb-exit-btn', exitTest);
    wireButton('emb-results-fullscreen-btn', toggleFullscreen);
    wireButton('emb-results-exit-btn', exitTest);

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
    remainingSeconds = 300;
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

    // question figure
    var qFig = $('emb-question-figure');
    if (qFig) qFig.innerHTML = q.questionSvg;

    // options
    var labels = ['(a)', '(b)', '(c)', '(d)'];
    for (var i = 0; i < 4; i++) {
      var opt = $('emb-option-' + (i + 1));
      if (opt) {
        opt.innerHTML = '<span class="emb-option-label">' + labels[i] + '</span><div class="emb-option-figure">' + q.options[i] + '</div>';
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
