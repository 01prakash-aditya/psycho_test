import sys
import json

# 1. Read scraped questions
with open('scraped_questions.js', 'r', encoding='utf-8') as f:
    sq_js = f.read()

# sq_js is "var questions = [...];"
# We want just the array string
start_idx = sq_js.find('[')
end_idx = sq_js.rfind(']') + 1
scraped_array_str = sq_js[start_idx:end_idx]

# 2. Modify embedded.js
with open('embedded.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find generateQuestions
start_gen = -1
end_gen = -1
for i, line in enumerate(lines):
    if "var questions = [];" in line:
        start_gen = i
    if "  function generateQuestions() {" in line:
        pass
    if "questions = qs;" in line:
        end_gen = i + 2 # include closing brace
        break

if start_gen != -1 and end_gen != -1:
    new_gen = f"""  var scrapedPool = {scraped_array_str};
  var questions = [];
  function generateQuestions() {{
    var qs = scrapedPool.slice(); // copy
    // Shuffle pool
    for(var j=qs.length-1; j>0; j--) {{
       var rnd = Math.floor(Math.random() * (j+1));
       var t = qs[j]; qs[j] = qs[rnd]; qs[rnd] = t;
    }}
    // Pick 25
    qs = qs.slice(0, 25);
    // Assign IDs for tracking
    for(var j=0; j<qs.length; j++) qs[j].id = j + 1;
    questions = qs;
  }}
"""
    lines = lines[:start_gen] + [new_gen] + lines[end_gen:]

content = "".join(lines)

# 3. Modify showQuestion
# Find function showQuestion() {
start_sq = content.find('  function showQuestion() {')
end_sq = content.find('  // ── Answer selection ──')
if start_sq != -1 and end_sq != -1:
    sq_old = content[start_sq:end_sq]
    sq_new = """  function showQuestion() {
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

"""
    content = content[:start_sq] + sq_new + content[end_sq:]

# Write back
with open('embedded.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully replaced procedural engine with scraped images.")
