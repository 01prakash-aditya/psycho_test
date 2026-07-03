import sys

with open('embedded.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if "var questions = (function()" in line:
        start_idx = i
        break

end_idx = -1
for i in range(start_idx, len(lines)):
    if "var currentQuestion = 0;" in lines[i]:
        end_idx = i - 1
        break

if start_idx != -1 and end_idx != -1:
    new_code = """  var questions = (function() {
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
      [[20,20,20,60], [20,60,20,100], [20,100,60,100], [60,100,100,100]], 
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
"""

    new_lines = lines[:start_idx] + [new_code] + lines[end_idx:]
    with open('embedded.js', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Successfully replaced array")
else:
    print(f"Indices not found: {start_idx}, {end_idx}")
