import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the Figure Formation Test Card placement.
# It should be part of `.test-selection-grid`.
# The embedded test card ends with:
"""
                    </div>
                </div>
            </div>
        </div>

                <!-- Figure Formation Test Card -->
"""
# So the closing divs for `.test-selection-grid` and `.landing-container` and `#landing-page` were placed BEFORE the Figure Formation Test Card.
# Let's remove those 3 closing divs from before the Figure Formation Test Card.
content = content.replace('''                    </div>
                </div>
            </div>
        </div>

                <!-- Figure Formation Test Card -->''', '''                    </div>
                </div>

                <!-- Figure Formation Test Card -->''')

# Now the Figure Formation Test Card is inside the grid, but we need to put the closing divs back AFTER the Figure Formation Test Card.
# The Figure Formation Test Card currently ends with:
"""
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================= -->
    <!-- PSYCHO TEST PAGE                              -->
"""
# That's actually correct! It has 5 closing divs now (3 that belonged to the landing page). 
# Wait, let's look at how the Formation Test card ends.
"""
                        <button id="start-formation-5" class="start-btn formation-btn" style="flex: 1 1 100%; padding: 10px; font-size: 0.9em;">Test 5</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
"""
# `test-card` div closes, then we need to close `test-selection-grid`, `landing-container`, `landing-page`.
# So that's 4 closing divs. In the file, there are 5. We need to reduce to 4.
content = content.replace('''                        <button id="start-formation-5" class="start-btn formation-btn" style="flex: 1 1 100%; padding: 10px; font-size: 0.9em;">Test 5</button>
                    </div>
                </div>
            </div>
        </div>
    </div>''', '''                        <button id="start-formation-5" class="start-btn formation-btn" style="flex: 1 1 100%; padding: 10px; font-size: 0.9em;">Test 5</button>
                    </div>
                </div>
            </div>
        </div>
    </div>''')
# Wait, let's just make it exact by using a manual replacement to be safe.

# 2. Fix the missing <ul> in instructions-panel
content = content.replace('''        <div class="instructions-panel">
                <li><span class="dot blue"></span> Press <strong>1</strong> for Option (a)</li>''', '''        <div class="instructions-panel">
            <ul>
                <li><span class="dot blue"></span> Press <strong>1</strong> for Option (a)</li>''')


# 3. Fix the blank Figure Formation test!
# Why did it not show up?
# Let's check `form-page` in CSS. No, `form-page` uses inline styling in index.html for its children.
# But wait, did I change `flex-direction: column` in `emb-page`?
# Let's check if the ID in JS matches HTML!
# JS looks for `form-question-figure`. HTML has `id="form-question-figure"`.
# JS looks for `form-option-1`. HTML has `id="form-option-1"`.
# Wait! In `formation.js`, the `start-formation-X` buttons have class `formation-btn`.
# Let's check `formation.js` button wiring!
# In `embedded.js`, it wired `start-embedded-X` by looking for elements.
# In `formation.js`, it should look for `start-formation-X`.

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
