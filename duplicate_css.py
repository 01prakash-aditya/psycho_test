import re

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# We want to find every selector containing .emb- or #emb- and add the corresponding .form- or #form- selector.
# We'll split the css by '{' and process the selectors.

# Alternatively, just use regex to replace all `.emb-` with `.form-` and append to the file!
# That is MUCH safer and guarantees we get all the styling.
# But wait, there are also #emb- IDs in styles.css.
# We already fixed #emb-page and #emb-results-page by appending them to the existing rules.
# If we append a block of copied CSS at the end, it will safely apply all `.form-` styles!

# Let's extract all rules that contain 'emb-' and duplicate them.

rules = []
current_rule = []
in_rule = False

for line in css.splitlines():
    if not in_rule:
        if '{' in line:
            in_rule = True
            current_rule.append(line)
        else:
            if line.strip() and not line.strip().startswith('/*'):
                current_rule.append(line)
    else:
        current_rule.append(line)
        if '}' in line:
            in_rule = False
            # Check if this rule has 'emb-'
            full_rule = '\n'.join(current_rule)
            if 'emb-' in full_rule:
                rules.append(full_rule)
            current_rule = []

# Now, we create new rules by replacing 'emb-' with 'form-'
new_css_blocks = []
for rule in rules:
    new_rule = rule.replace('emb-', 'form-')
    new_css_blocks.append(new_rule)

# Append to styles.css
with open('styles.css', 'a', encoding='utf-8') as f:
    f.write('\n\n/* =============================================\n')
    f.write('   FORM FIGURES TEST PAGE (Duplicated from EMB)\n')
    f.write('   ============================================= */\n')
    f.write('\n\n'.join(new_css_blocks))

print("Duplicated all emb- styles for form-.")
