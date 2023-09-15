var navbar = document.getElementById('navbar');
var nav = document.getElementById('nav');
var lyr=document.getElementById('layers');

var x =   navbar.querySelectorAll('div')[0];

x.addEventListener('click', ()=> {
   lyr.style.left='150px';
   lyr.style.opacity='1';
   nav.style.width='1000px';
   x.onmouseenter=()=>{};
   x.onmouseleave=()=>{};
   navbar.onmouseleave=()=>{};
   lyr.onmouseleave=(event)=>{
    nav.style.width='150px';
    navbar.style.width='152px';
    console.log(event.target);
    if(navbar.onmouseleave || lyr.onmouseleave){
      x.style.transform = 'scale(1)';
      x.style.opacity = '0.5';
      x.querySelector('span').style.opacity = '0';
      x.querySelector('span').style.left = '5px';
      x.querySelector('i').style.marginLeft = '0px';
    };

    navbar.onmouseenter=()=>{
      
      nav.style.width='450px';
      nav.style.backgroundImage='linear-gradient(to right, rgb(0, 0, 0)10%, rgba(255, 255, 255, 0) )';
      lyr.onmouseleave=()=>{};
      x.style.transform = 'scale(1)';
      x.style.opacity = '0.5';
      x.querySelector('span').style.opacity = '1';
      x.querySelector('span').style.left = '20px';
      x.querySelector('i').style.marginLeft = '0px'; 
      x.onmouseenter=()=>
       { x.style.transform = 'scale(1.1)';
        x.style.opacity = '1';
       x.querySelector('span').style.left = '40px';
       x.querySelector('span').style.opacity = '1';
       x.querySelector('i').style.marginLeft = '10px';
    
       }
       x.onmouseleave=()=>
       { x.style.transform = 'scale(1)';
        x.style.opacity = '0.5';
       x.querySelector('span').style.left = '20px';
       x.querySelector('i').style.marginLeft = '0px';
       }
       navbar.onmouseleave=()=>{
        nav.style.width='150px';
        
        x.querySelector('i').style.marginLeft = '0px';
       x.querySelector('span').style.opacity = '0';
       x.querySelector('span').style.left = '0px';
        }
       
    }
    
   
   };
   x.style.transform = 'scale(1.1)';
   x.style.opacity = '1';
   x.querySelector('span').style.opacity = '1';
   x.querySelector('span').style.left = '40px';
   x.querySelector('i').style.marginLeft = '10px';
  
   setTimeout(()=>{lyr.style.zIndex='4';}, 600);
});


document.getElementById('layers').addEventListener('mouseleave', ()=> {
  lyr.style.left='0px';
  lyr.style.opacity='0';
  lyr.style.zIndex='2';

});

navbar.onmouseenter=()=>{

  nav.style.width='250px';
  nav.style.backgroundImage='linear-gradient(to right, rgb(0, 0, 0) 30%, rgba(255, 255, 255, 0) )';
}
navbar.onmouseleave=()=>{
  nav.style.width='150px';
  navbar.style.width='152px'
}
var img = lyr.querySelectorAll('img');
img.forEach(e => {
  e.addEventListener('click',()=>{
    img.forEach(f => {
      f.style.border='2px solid rgba(255, 255, 255, 0)';
      f.style.boxShadow='0 5px 10px rgba(255, 255, 255, 0)'
      f.onmouseenter=()=>{f.style.border='2px solid white'; f.style.boxShadow='0 5px 10px rgba(255, 255, 255, 0.635)';};
      f.onmouseleave=()=>{f.style.border='2px solid rgba(255, 255, 255, 0)'; f.style.boxShadow='0 5px 10px rgba(255, 255, 255, 0)'};
    });

  
    e.style.border='2px solid white';
    e.style.boxShadow='0 5px 10px rgba(255, 255, 255, 0.635)'
    e.onmouseenter=()=>{};
    e.onmouseleave=()=>{};
    map.setStyle(style+e.dataset.value);
  })
});







mapboxgl.accessToken = 'pk.eyJ1IjoiYWtzaGF0MjUxMiIsImEiOiJjbG01OXVoaXEzeGwyM3FsaW96NGt6aWZxIn0.SHICUGF0uP3IDVnpkCfBTw';
var style = 'mapbox://styles/akshat2512/';


var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: style+'clmk935hf01tx01pf6grq4oev', // style URL
    // starting position [lng, lat]
    center: [-122.486052, 37.830348],
    zoom: 2, // starting zoom
});


map.on('load', function() {
   
    map.addLayer({
        id: 'terrain-data',
        type: 'fill',
        source: 'custom-style',
        'source-layer': 'layer-name',
        paint: {
            'fill-color': '#ff0000'
        }
    });
    map.flyTo({
        center: [79.005696, 22.478039],
        zoom: 3.5,
        speed: 0.5,
        curve: 1,
        easing(t) {
          return t;
        }
      });
 
    
      map.on('click', function(e) {
        var coordinates = e.lngLat;
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML('Longitude: ' + coordinates.lng + '<br />Latitude: ' + coordinates.lat)
            .addTo(map);
      });
      

   
    });


const geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
  enableHighAccuracy: true
  },
  trackUserLocation: true,
  showUserHeading: true
  });
 
  map.addControl(geolocate);
 
  geolocate.on('error', () => {
  console.log('An error event has occurred.');
  });

  // fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/Eiffel%20Tower.json?access_token=pk.eyJ1IjoiYWtzaGF0MjUxMiIsImEiOiJjbG01OXVoaXEzeGwyM3FsaW96NGt6aWZxIn0.SHICUGF0uP3IDVnpkCfBTw')
  // .then(response => response.json())
  // .then(data => {
  //   // data is an object that contains information about the geocoding results
  //   console.log(data);
  //   // get the first result's coordinates
  //   let coordinates = data.features[0].geometry.coordinates;
  //   console.log(coordinates);
  // });

 function showcrime()
 {
  map.addSource('earthquakes', {
    type: 'geojson',
    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
     
    map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'earthquakes',
    filter: ['has', 'point_count'],
    paint: {
    // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
    // with three steps to implement three types of circles:
    //   * Blue, 20px circles when point count is less than 100
    //   * Yellow, 30px circles when point count is between 100 and 750
    //   * Pink, 40px circles when point count is greater than or equal to 750
    'circle-color': [
    'step',
    ['get', 'point_count'],
    '#51bbd6',
    100,
    '#f1f075',
    750,
    '#f28cb1'
    ],
    'circle-radius': [
    'step',
    ['get', 'point_count'],
    20,
    100,
    30,
    750,
    40
    ]
    }
    });
     
    map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'earthquakes',
    filter: ['has', 'point_count'],
    layout: {
    'text-field': ['get', 'point_count_abbreviated'],
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
    }
    });
     
    map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'earthquakes',
    filter: ['!', ['has', 'point_count']],
    paint: {
    'circle-color': '#11b4da',
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
    }
    });
     
    // inspect a cluster on click
    map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
    layers: ['clusters']
    });
    const clusterId = features[0].properties.cluster_id;
    map.getSource('earthquakes').getClusterExpansionZoom(
    clusterId,
    (err, zoom) => {
    if (err) return;
     
    map.easeTo({
    center: features[0].geometry.coordinates,
    zoom: zoom
    });
    }
    );
    });
     
    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const mag = e.features[0].properties.mag;
    const tsunami =
    e.features[0].properties.tsunami === 1 ? 'yes' : 'no';
     
    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
     
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(
    `magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`
    )
    .addTo(map);
    });
     
    map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';});
 }

