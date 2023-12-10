import requests
from pprint import pprint
from urllib.parse import quote

library = "https://itunes.apple.com/search?term={}&media=music&entity=song&limit=1"
similar = "https://maroofy.com/api/trpc/songs.findSimilarSongs?batch=1&input={}"

# get user input
song_name = input("Enter a song name: ")
song_name = song_name.replace(" ", "%20")

# get the response from the website
response = requests.get(library.format(song_name))

# convert the response to json
response_json = response.json()

if response_json['resultCount'] > 0:
    element = response_json['results'][0]
    print()
    track_id = element['trackId']
    request = {"0":{"json":{"song_id":track_id,"fuzzySearchCount":0}}}
    request = str(request).replace("'", '"')
    # unicode
    request = quote(request)
    print(request)
    # print(similar.format(request))
    similar_songs = requests.get(similar.format(request))
    similar_songs = similar_songs.json()[0]['result']["data"]["json"]
    similar_songs = similar_songs[:10]
    
    for song in similar_songs:
        name = song['name']
        artist = song['artist_display_name']
        # limit score to 2 decimal places
        score = round(song['score'] * 100, 2)
        preview_url = song['preview_url']
        print(f"{name} by {artist} with {score}% match ({preview_url})")

