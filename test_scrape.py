import urllib.request
import re

url = 'https://www.examveda.com/non-verbal-reasoning/practice-mcq-question-on-shape-construction/?page=1'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    articles = re.findall(r'<article.*?</article>', html, re.DOTALL)
    print(f'Found {len(articles)} articles')
    if len(articles) > 0:
        img_match = re.search(r'<img src="(.*?)"', articles[0])
        print(f'First image: {img_match.group(1) if img_match else "None"}')
except Exception as e:
    print('Error:', e)
