import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Fix the Figure Formation card location
# It should be inside <div class="test-selection-grid">
# Currently it's outside.
# Let's find the closing of the grid and the test-card.

grid_start_idx = html.find('<div class="test-selection-grid">')
if grid_start_idx != -1:
    # Find the end of Embedded Figures card.
    emb_card_idx = html.find('<!-- Figure Formation Test Card -->')
    if emb_card_idx != -1:
        # Before Figure Formation Test Card, there are some closing divs.
        # Let's remove the closing divs between Embedded Figures and Figure Formation.
        # Actually, let's just find the Figure Formation card and move it!
        form_card_start = html.find('<!-- Figure Formation Test Card -->')
        form_card_end = html.find('<!-- ============================================= -->', form_card_start)
        form_card_html = html[form_card_start:form_card_end]
        
        # Remove it from where it is
        html = html[:form_card_start] + html[form_card_end:]
        
        # Now find the end of the Embedded Figures card
        emb_card_start = html.find('<!-- Embedded Figures Test Card -->')
        emb_card_end = html.find('<div class="test-card">', emb_card_start + 1)
        if emb_card_end == -1: # if it's the last one
            # The Embedded figure card ends at `</div>\n                </div>\n            </div>\n        </div>`
            # Let's use regex to find where the grid ends.
            pass
        
        # It's easier to just rebuild the landing container contents.
        pass

# Let's do it cleanly using a simpler replace.
# The problem in index.html is:
"""
                    <div class="test-set-buttons" style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 15px;">
                        <button id="start-embedded-1" class="start-btn embedded-btn" style="flex: 1 1 45%; padding: 10px; font-size: 0.9em;">Test 1</button>
                        <button id="start-embedded-2" class="start-btn embedded-btn" style="flex: 1 1 45%; padding: 10px; font-size: 0.9em;">Test 2</button>
                        <button id="start-embedded-3" class="start-btn embedded-btn" style="flex: 1 1 45%; padding: 10px; font-size: 0.9em;">Test 3</button>
                        <button id="start-embedded-4" class="start-btn embedded-btn" style="flex: 1 1 45%; padding: 10px; font-size: 0.9em;">Test 4</button>
                        <button id="start-embedded-5" class="start-btn embedded-btn" style="flex: 1 1 100%; padding: 10px; font-size: 0.9em;">Test 5</button>
                    </div>
                </div>
            </div>
        </div>

                <!-- Figure Formation Test Card -->
"""
# I want to replace that `</div>\n            </div>\n        </div>\n\n                <!-- Figure Formation Test Card -->`
# with just `\n                <!-- Figure Formation Test Card -->`
# AND I need to add those closing divs AFTER the Figure Formation Test Card.
