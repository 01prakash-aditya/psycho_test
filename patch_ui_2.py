import re

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

kbd_html = '''
            <div class="mobile-keyboard-toggle" style="position: absolute; bottom: 20px; right: 20px; z-index: 100;">
                <button id="toggle-keyboard-btn" style="padding: 10px; border-radius: 50%; background: #0052A5; color: white; border: none; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; width: 50px; height: 50px;">
                    <svg id="icon-kbd" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 3h2v2h-2V7zm0 3h2v2h-2v-2zM8 7h2v2H8V7zm0 3h2v2H8v-2zm-3 0h2v2H5v-2zm0-3h2v2H5V7zm3 9h8v-2H8v2zm9-3h-2v-2h2v2zm0-3h-2V7h2v2z"/></svg>
                    <svg id="icon-close-kbd" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <input type="text" id="mobile-keyboard-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="opacity: 0; position: absolute; bottom: 0; left: 0; width: 1px; height: 1px; z-index: -1;">
            <div class="feedback-indicator" id="feedback-indicator"></div>
'''

html = html.replace('<div class="feedback-indicator" id="feedback-indicator"></div>', kbd_html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)


# 2. Update app.js
with open('app.js', 'r', encoding='utf-8') as f:
    appjs = f.read()

# Disable answer text
appjs = appjs.replace(
    'elements.answerText.textContent = `You pressed: ${key} (${COLOR_NAMES[key]}) — ${isCorrect ? \'Right\' : \'Wrong\'}`;',
    '// elements.answerText.textContent removed'
)
appjs = appjs.replace(
    "elements.answerBar.classList.add('show');",
    "// elements.answerBar.classList.add('show');"
)

# Add keyboard toggle logic at the very end of app.js just before closing IIFE `})();`
# We'll search for `})();` and replace with our code + `})();`

kbd_js = '''
    // Keyboard Toggle Logic
    const toggleKeyboardBtn = $('toggle-keyboard-btn');
    const mobileKeyboardInput = $('mobile-keyboard-input');
    const reactionButtonsContainer = document.querySelector('.reaction-buttons-container');
    const iconKbd = $('icon-kbd');
    const iconCloseKbd = $('icon-close-kbd');
    
    let keyboardActive = false;
    if (toggleKeyboardBtn && mobileKeyboardInput) {
        toggleKeyboardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            keyboardActive = !keyboardActive;
            if (keyboardActive) {
                reactionButtonsContainer.style.display = 'none';
                iconKbd.style.display = 'none';
                iconCloseKbd.style.display = 'block';
                mobileKeyboardInput.focus();
            } else {
                reactionButtonsContainer.style.display = 'flex';
                iconKbd.style.display = 'block';
                iconCloseKbd.style.display = 'none';
                mobileKeyboardInput.blur();
            }
        });

        // Ensure we maintain focus if active
        document.addEventListener('click', (e) => {
            if (keyboardActive && e.target !== toggleKeyboardBtn && !toggleKeyboardBtn.contains(e.target)) {
                mobileKeyboardInput.focus();
            }
        });

        mobileKeyboardInput.addEventListener('input', (e) => {
            const val = mobileKeyboardInput.value.toUpperCase();
            if (val.length > 0) {
                const char = val.charAt(val.length - 1);
                const keyEvent = new KeyboardEvent('keydown', { key: char });
                document.dispatchEvent(keyEvent);
                mobileKeyboardInput.value = ''; // clear input
            }
        });
    }
})();
'''

# Use simple string replacement for the very last '})();'
if appjs.endswith('})();\n'):
    appjs = appjs[:-6] + kbd_js + '\n'
elif appjs.endswith('})();'):
    appjs = appjs[:-5] + kbd_js
else:
    # fallback
    appjs = appjs.replace('})();', kbd_js)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(appjs)


# 3. Update styles.css
with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add mobile styles for header timer and keyboard toggle visibility
mobile_css2 = '''
    .timer-box span:first-child { display: none; }
    .header-center { position: static; transform: none; display: flex; align-items: center; justify-content: center; flex: 1; }
    .header-left, .header-right { flex: 1; display: flex; align-items: center; }
    .header-left { justify-content: flex-start; }
    .header-right { justify-content: flex-end; }
'''

# Find the max-width: 768px query and inject our rules.
css = re.sub(
    r'(@media\s*\(\s*max-width:\s*768px\s*\)\s*\{)',
    r'\\1' + mobile_css2,
    css
)

desktop_css = '''
@media (min-width: 1025px) {
    .mobile-keyboard-toggle {
        display: none !important;
    }
}
'''
css += desktop_css

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Success')
