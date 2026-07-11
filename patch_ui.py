import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace Fullscreen buttons
html = re.sub(
    r'<button id="(.*?)" class="btn-fullscreen">Switch Fullscreen</button>',
    r'<button id="\1" class="btn-fullscreen"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg><span class="btn-text">Switch Fullscreen</span></button>',
    html
)

# Replace Exit buttons
html = re.sub(
    r'<button id="(.*?)" class="btn-exit">Exit</button>',
    r'<button id="\1" class="btn-exit"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg><span class="btn-text">Exit</span></button>',
    html
)

# Add flex-wrap to options
html = html.replace(
    'style="display: flex; gap: 10px; justify-content: center; margin-top: 30px;"',
    'style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 30px;"'
)
html = html.replace(
    'style="display: flex; gap: 20px; justify-content: center; width: 100%;"',
    'style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; width: 100%;"'
)

# Fix reaction buttons padding to be a bit responsive
html = html.replace(
    'style="padding: 15px 25px;',
    'style="padding: 10px 15px;'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add mobile styles
mobile_css = '''
    .btn-fullscreen .btn-text, .btn-exit .btn-text { display: none; }
    .header-title { display: none; }
    .instructions-panel {
        position: relative !important;
        top: 0 !important;
        left: 0 !important;
        width: 90%;
        align-self: center;
        margin: 10px 0 20px 0;
    }
'''

# Find the max-width: 768px query and inject our rules
css = re.sub(
    r'(@media\s*\(\s*max-width:\s*768px\s*\)\s*\{)',
    r'\1' + mobile_css,
    css
)

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Success')
