import re

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

mobile_css = '''
    .reaction-buttons-container {
        flex-wrap: nowrap !important;
        width: 100%;
        gap: 4px !important;
    }
    
    .reaction-btn {
        flex: 1;
        padding: 12px 2px !important;
        font-size: 11px !important;
        min-width: 0;
        white-space: nowrap;
    }

    .apt-options-grid {
        display: flex !important;
        flex-wrap: nowrap !important;
        justify-content: center;
        gap: 6px !important;
        max-width: 100% !important;
    }
    
    .apt-option {
        flex: 1;
        padding: 10px 4px !important;
        font-size: 14px !important;
        min-width: 0;
        text-align: center;
        justify-content: center;
    }

    .form-options-grid {
        display: flex !important;
        flex-wrap: nowrap !important;
        justify-content: center;
        gap: 6px !important;
        max-width: 100% !important;
    }

    .form-option {
        flex: 1;
        padding: 10px 4px !important;
        min-width: 0;
        justify-content: center;
    }

    .form-option-figure {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 1;
    }
'''

# Find the @media (max-width: 768px) and insert our mobile_css inside it.
# Actually, I can insert it into the @media (max-width: 1024px) block or just add a new @media (max-width: 768px) at the end.
# It's safest to just append a new @media (max-width: 768px) block at the end of styles.css to ensure it overrides everything.

new_css = css + '\n\n@media (max-width: 768px) {' + mobile_css + '}\n'

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(new_css)

print("CSS updated")
