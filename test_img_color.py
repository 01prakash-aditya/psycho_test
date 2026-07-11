from PIL import Image
import sys

files = [
    'C:/Users/0adit/.gemini/antigravity/brain/2c866710-3c8a-4008-8349-88407e09ec96/media__1783732854726.png',
    'C:/Users/0adit/.gemini/antigravity/brain/2c866710-3c8a-4008-8349-88407e09ec96/media__1783732866505.png',
    'C:/Users/0adit/.gemini/antigravity/brain/2c866710-3c8a-4008-8349-88407e09ec96/media__1783732876808.png',
    'C:/Users/0adit/.gemini/antigravity/brain/2c866710-3c8a-4008-8349-88407e09ec96/media__1783732889975.png'
]

for f in files:
    try:
        img = Image.open(f)
        w, h = img.size
        rgb = img.getpixel((w//2, h//2))
        print(f.split('/')[-1] + ' : ' + str(rgb))
    except Exception as e:
        print('Error:', e)
