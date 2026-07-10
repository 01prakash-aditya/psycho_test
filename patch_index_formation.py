import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Scripts
if 'formation.js' not in content:
    content = content.replace('</body>', '    <script src="scraped_formation.js"></script>\n    <script src="formation.js"></script>\n</body>')

# 2. Add Test Card
# We'll duplicate the Embedded Figures test card
emb_card_regex = re.search(r'<!-- Embedded Figures Test Card -->.*?</div>\s*</div>\s*</div>\s*</div>', content, re.DOTALL)
if emb_card_regex and 'Figure Formation' not in content:
    emb_card_html = emb_card_regex.group(0)
    
    form_card_html = emb_card_html.replace('Embedded Figures Test Card', 'Figure Formation Test Card')
    form_card_html = form_card_html.replace('Embedded Figures', 'Figure Formation')
    form_card_html = form_card_html.replace('Visual Pattern Recognition', 'Association & Joining Figures')
    form_card_html = form_card_html.replace('Find hidden simple shapes in complex figures', 'Find which option is formed by joining the given pieces')
    form_card_html = form_card_html.replace('start-embedded-', 'start-formation-')
    form_card_html = form_card_html.replace('embedded-btn', 'formation-btn')
    
    # insert after the emb card
    content = content.replace(emb_card_html, emb_card_html + "\n\n                " + form_card_html)

# 3. Add Test Screen
# Duplicate the embedded figures test screen
emb_screen_regex = re.search(r'<!-- ============================================= -->\s*<!-- 4\. EMBEDDED FIGURES TEST SCREEN -->.*?</div>\s*</div>\s*</div>', content, re.DOTALL)
if emb_screen_regex and 'FORMATION TEST SCREEN' not in content:
    emb_screen_html = emb_screen_regex.group(0)
    
    form_screen_html = emb_screen_html.replace('EMBEDDED FIGURES TEST SCREEN', 'FORMATION TEST SCREEN')
    form_screen_html = form_screen_html.replace('embedded-test-screen', 'formation-test-screen')
    form_screen_html = form_screen_html.replace('Embedded Figures Test', 'Figure Formation Test')
    form_screen_html = form_screen_html.replace('emb-', 'form-')
    
    content = content.replace(emb_screen_html, emb_screen_html + "\n\n    " + form_screen_html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html")
