import urllib.request
import re
import json
import os

base_url = 'https://www.indiabix.com/non-verbal-reasoning/shape-construction/'

os.makedirs('formation_images_bix', exist_ok=True)
questions_data = []
q_id = 1

for page in range(1, 8):
    url = base_url + f"{page:03d}" if page > 1 else base_url
    print('Fetching', url)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        
        q_blocks = re.findall(r'<div class="bix-div-container.*?>(.*?)<div class="bix-ans-option', html, re.DOTALL)
        for block in q_blocks:
            imgs = re.findall(r'<img.*?src="(.*?)".*?>', block)
            ans_match = re.search(r'<input type="hidden" class="jq-hdnakq" id=".*?" value="(.*?)"', block)
            
            if len(imgs) >= 2 and ans_match:
                q_img_src = 'https://www.indiabix.com' + imgs[0]
                a_img_src = 'https://www.indiabix.com' + imgs[1]
                ans_val = ans_match.group(1).upper()
                ans_idx = ord(ans_val) - ord('A')
                
                # Download both images
                q_filename = f"formation_images_bix/q_{q_id}_q.png"
                a_filename = f"formation_images_bix/q_{q_id}_a.png"
                
                if not os.path.exists(q_filename):
                    with open(q_filename, 'wb') as f:
                        f.write(urllib.request.urlopen(urllib.request.Request(q_img_src, headers={'User-Agent': 'Mozilla/5.0'})).read())
                if not os.path.exists(a_filename):
                    with open(a_filename, 'wb') as f:
                        f.write(urllib.request.urlopen(urllib.request.Request(a_img_src, headers={'User-Agent': 'Mozilla/5.0'})).read())
                        
                questions_data.append({
                    "id": q_id,
                    "image": f"<div style='display:flex;flex-direction:column;align-items:center;gap:15px;'><img src='{q_filename}' alt='Question'><img src='{a_filename}' alt='Options'></div>",
                    "correctIndex": ans_idx
                })
                q_id += 1
                
    except Exception as e:
        print('Error on page', page, ':', e)
        
print(f"Scraped {len(questions_data)} questions.")
with open('scraped_formation.js', 'w', encoding='utf-8') as f:
    f.write("var formationQuestions = " + json.dumps(questions_data, indent=2) + ";")
