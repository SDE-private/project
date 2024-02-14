import requests

url = 'http://localhost:5000/'
payload = {'id': 'test'}

r = requests.post(url, json=payload)
res = r.json()
print(res)
