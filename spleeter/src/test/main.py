import requests

url = 'http://localhost:5000/'
files = {'file': open('test.mp3', 'rb')}

r = requests.post(url, files=files)
res = r.json()
print(res.keys())