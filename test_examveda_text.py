import urllib.request
import re

url = 'https://www.examveda.com/non-verbal-reasoning/practice-mcq-question-on-figure-formation-and-analysis/?page=1'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')
articles = re.findall(r'<article.*?</article>', html, re.DOTALL)
for a in articles:
    q_main = re.search(r'<div class="question-main">(.*?)</div>', a, re.DOTALL)
    if q_main:
        text = re.sub(r'<[^>]+>', '', q_main.group(1)).strip()
        print(text[:100])
