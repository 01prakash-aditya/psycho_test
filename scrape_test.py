import urllib.request
import re

url = "https://www.examveda.com/non-verbal-reasoning/practice-mcq-question-on-spotting-out-the-embedded-figure/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    
    # Try to find the question elements
    # Examveda usually uses <article class="question single-question"> or similar
    articles = re.findall(r'<article.*?</article>', html, re.DOTALL)
    print(f"Found {len(articles)} articles.")
    if len(articles) > 0:
        print(articles[0][:1000])
except Exception as e:
    print("Error:", e)
