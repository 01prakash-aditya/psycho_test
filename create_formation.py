import os

with open('embedded.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace UI prefixes
content = content.replace("'emb-", "'form-")
content = content.replace('"emb-', '"form-')
content = content.replace("emb-btn", "form-btn")
content = content.replace("emb-timer", "form-timer")
content = content.replace("start-embedded-", "start-formation-")
content = content.replace("_embeddedTestRunning", "_formationTestRunning")

# Instead of `var scrapedPool = ...`, it should read `formationQuestions` which is defined in `scraped_formation.js`.
# In embedded.js we did:
#   var scrapedPool = [...];
# So we need to replace that whole line with `var scrapedPool = formationQuestions;`

import re
content = re.sub(r'var scrapedPool = \[.*?\];', 'var scrapedPool = formationQuestions;', content, flags=re.DOTALL)

with open('formation.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Created formation.js")
