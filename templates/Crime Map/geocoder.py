# import requests library
from mapbox import Geocoder

geocoder = Geocoder(access_token='pk.eyJ1IjoiYWtzaGF0MjUxMiIsImEiOiJjbG01OXVoaXEzeGwyM3FsaW96NGt6aWZxIn0.SHICUGF0uP3IDVnpkCfBTw')

response = geocoder.forward('cuddapah, Andhra Pradesh, India')
data = response.json()

first_feature = data['features'][0]
place_name = first_feature['place_name']
coordinates = first_feature['geometry']['coordinates']
print(place_name)
print(coordinates)

