import urllib.request
import re

url = 'https://www.examveda.com/non-verbal-reasoning/practice-mcq-question-on-figure-formation-and-analysis/?page='
texts = set()

for i in range(1, 10):
    req = urllib.request.Request(url + str(i), headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        articles = re.findall(r'<article.*?</article>', html, re.DOTALL)
        for a in articles:
            q_main = re.search(r'<div class="question-main">(.*?)</div>', a, re.DOTALL)
            if q_main:
                text = re.sub(r'<[^>]+>', '', q_main.group(1)).strip()
                texts.add(text)
    except Exception as e:
        break

print("UNIQUE TEXTS:")
for t in texts:
    print('---')
    print(t)
