import requests
import json 

# dafuq is a CMS
glitch_api = 'https://google-photos-album-demo2.glitch.me/nomew23j6ruSy6zY9'
psco_path = 'static/psco/'
res = requests.get(glitch_api)
if res.status_code == 200:
    img_links = json.loads(res.content.decode('utf-8'))
    # print(img_links)
else:
    print("SOMETHING BLEW UP ON GLITCH API")
    exit(1)

# print(img_links)
for i, link in enumerate(img_links):
    # print(link)
    img_data = requests.get(link).content
    # print(img_data)
    with open(f'{psco_path}{i}.jpg', 'wb') as handler:
        handler.write(img_data)