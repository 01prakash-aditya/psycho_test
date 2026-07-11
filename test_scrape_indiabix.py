import urllib.request
import re
import json

base_url = 'https://www.indiabix.com/non-verbal-reasoning/shape-construction/'

try:
    req = urllib.request.Request(base_url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    
    # print a sample of the html where images are
    matches = re.findall(r'<img.*?src="(.*?)".*?>', html)
    print("Found images:", len(matches))
    for m in matches[:5]:
        print(m)
        
    # See if we can find the answer logic
    ans_matches = re.findall(r'<input type="hidden" class="jq-hdnakq" id=".*?" value="(.*?)"', html)
    print("Found answers:", len(ans_matches))
    print(ans_matches[:5])
    
except Exception as e:
    print('Error:', e)
