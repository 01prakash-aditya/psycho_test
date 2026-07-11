import urllib.request
import re
import json
import os
import shutil

# Clean the existing directory to remove bad images
if os.path.exists('formation_images_clean'):
    shutil.rmtree('formation_images_clean')
os.makedirs('formation_images_clean', exist_ok=True)

base_url = 'https://www.examveda.com/non-verbal-reasoning/practice-mcq-question-on-figure-formation-and-analysis/?page='
questions_data = []
q_id = 1

valid_keywords = [
    "pieces given in figure",
    "rearrangement of the parts",
    "make up the key figure",
    "components of the key figure"
]

for page in range(1, 15):
    if len(questions_data) >= 40:
        break
        
    print(f"Scraping page {page}...")
    url = base_url + str(page)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        articles = re.findall(r'<article.*?</article>', html, re.DOTALL)
        
        for article in articles:
            # Check question text
            q_main = re.search(r'<div class="question-main">(.*?)</div>', article, re.DOTALL)
            if not q_main:
                continue
            text = re.sub(r'<[^>]+>', '', q_main.group(1)).strip().lower()
            
            # Is it valid?
            is_valid = any(kw in text for kw in valid_keywords)
            
            # Check for bad keywords just in case
            if "folded" in text or "solid" in text or "pyramid" in text or "frustum" in text or "rotation" in text or "matchstics" in text:
                is_valid = False
                
            if not is_valid:
                continue
                
            # Extract image
            img_match = re.search(r'<img src="(.*?)"', article)
            if not img_match:
                continue
            img_src = img_match.group(1)
            if not img_src.startswith('http'):
                img_src = "https://www.examveda.com" + img_src
                
            # Extract answer
            ans_match = re.search(r'Answer:\s*(?:<[^>]+>)*\s*Option\s*([A-D])', article, re.IGNORECASE)
            if not ans_match:
                ans_match = re.search(r'<input type="hidden".*?value="([A-D])".*?>', article, re.IGNORECASE)
                if not ans_match:
                    ans_match = re.search(r'value="([A-D])".*?type="hidden"', article, re.IGNORECASE)
                    
            if ans_match:
                ans_char = ans_match.group(1).upper()
                ans_idx = ord(ans_char) - ord('A')
            else:
                ans_idx = 0
                
            # Download image
            filename = f"formation_images_clean/q_{q_id}.jpg"
            img_req = urllib.request.Request(img_src, headers={'User-Agent': 'Mozilla/5.0'})
            try:
                with open(filename, 'wb') as f:
                    f.write(urllib.request.urlopen(img_req).read())
            except Exception as e:
                print(f"Failed to download image {img_src}: {e}")
                continue
                
            questions_data.append({
                "id": q_id,
                "image": filename,
                "correctIndex": ans_idx
            })
            q_id += 1
            
            if len(questions_data) >= 40:
                break
                
    except Exception as e:
        print("Error on page", page, ":", e)

print(f"Scraped {len(questions_data)} valid questions.")

# Overwrite the scraped_formation.js file
with open('scraped_formation.js', 'w', encoding='utf-8') as f:
    f.write("var formationQuestions = " + json.dumps(questions_data, indent=2) + ";")
