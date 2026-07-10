import sys

with open('embedded.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the IIFE assignment:
# var questions = (function() { ...
# with:
# var questions = [];
# function generateQuestions() { ...

content = content.replace('  var questions = (function() {\n    var qs = [];', 
"""  var questions = [];
  function generateQuestions() {
    var qs = [];""")

# The end of the IIFE is:
#     return qs;
#   })();
# We need to replace it with:
#     // Shuffle qs before returning
#     for(var j=qs.length-1; j>0; j--) {
#        var rnd = Math.floor(Math.random() * (j+1));
#        var t = qs[j]; qs[j] = qs[rnd]; qs[rnd] = t;
#     }
#     // reassign ids
#     for(var j=0; j<qs.length; j++) qs[j].id = j + 1;
#     questions = qs;
#   }

content = content.replace('    return qs;\n  })();', 
"""    for(var j=qs.length-1; j>0; j--) {
       var rnd = Math.floor(Math.random() * (j+1));
       var t = qs[j]; qs[j] = qs[rnd]; qs[rnd] = t;
    }
    for(var j=0; j<qs.length; j++) qs[j].id = j + 1;
    questions = qs;
  }""")

# Now update init() to loop over 5 buttons
init_old = """  function init() {
    var btn = $('start-embedded-btn');
    if (btn) {
      btn.addEventListener('click', startTest);
    }"""
    
init_new = """  function init() {
    for (var i = 1; i <= 5; i++) {
      var btn = $('start-embedded-' + i);
      if (btn) {
        btn.addEventListener('click', function() {
          generateQuestions();
          startTest();
        });
      }
    }"""

content = content.replace(init_old, init_new)

with open('embedded.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated embedded.js")
