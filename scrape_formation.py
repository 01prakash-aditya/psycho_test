import urllib.request
import re
import json
import os

base_url = "https://www.examveda.com/non-verbal-reasoning/practice-mcq-question-on-figure-formation-and-analysis/?page="

os.makedirs('formation_images', exist_ok=True)
questions_data = []
q_id = 1

for page in range(1, 4):  # Let's scrape 3 pages for now
    url = base_url + str(page)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        articles = re.findall(r'<article.*?</article>', html, re.DOTALL)
        
        for article in articles:
            img_match = re.search(r'<img src="(.*?)"', article)
            if not img_match:
                continue
            img_src = img_match.group(1)
            if not img_src.startswith('http'):
                img_src = "https://www.examveda.com" + img_src
                
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
                
            filename = f"formation_images/q_{q_id}.jpg"
            if not os.path.exists(filename):
                img_req = urllib.request.Request(img_src, headers={'User-Agent': 'Mozilla/5.0'})
                with open(filename, 'wb') as f:
                    f.write(urllib.request.urlopen(img_req).read())
                    
            questions_data.append({
                "id": q_id,
                "image": filename,
                "correctIndex": ans_idx
            })
            q_id += 1
            
    except Exception as e:
        print("Error on page", page, ":", e)

print(f"Scraped {len(questions_data)} questions.")
with open('scraped_formation.js', 'w', encoding='utf-8') as f:
    f.write("var formationQuestions = " + json.dumps(questions_data, indent=2) + ";")
