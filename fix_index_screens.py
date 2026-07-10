import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Duplicate emb-page
emb_page_match = re.search(r'<div id="emb-page" class="page">.*?<div class="emb-feedback" id="emb-feedback"></div>\s*</div>\s*</div>', content, re.DOTALL)
if emb_page_match and 'id="form-page"' not in content:
    emb_page = emb_page_match.group(0)
    form_page = emb_page.replace('emb-', 'form-')
    form_page = form_page.replace('Embedded Figures Test', 'Figure Formation Test')
    content = content.replace(emb_page, emb_page + "\n\n    <!-- FORMATION PAGE -->\n    " + form_page)

# Duplicate emb-results-page
emb_results_match = re.search(r'<div id="emb-results-page" class="page">.*?</div>\s*</div>', content, re.DOTALL)
if emb_results_match and 'id="form-results-page"' not in content:
    emb_results = emb_results_match.group(0)
    form_results = emb_results.replace('emb-', 'form-')
    form_results = form_results.replace('Embedded Figures', 'Figure Formation')
    content = content.replace(emb_results, emb_results + "\n\n    <!-- FORMATION RESULTS PAGE -->\n    " + form_results)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added form-page and form-results-page")
