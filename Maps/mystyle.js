var navbar = document.getElementById('navbar');
var nav = document.getElementById('nav');
var lyr=document.getElementById('layers');
var slide = document.getElementById('slide');
var x =   navbar.querySelectorAll('div')[0];


x.addEventListener('click', ()=> {
  slide.style.width = '0%';
  // slide.style.transition = 'ease-in-out 2s';
  slide.style.opacity = '0';
   lyr.style.left='150px';
   lyr.style.opacity='1';
   nav.style.width='1000px';
   x.onmouseenter=()=>{};
   x.onmouseleave=()=>{};
   navbar.onmouseleave=()=>{};
   lyr.onmouseleave=(event)=>{
    nav.style.width='150px';
    navbar.style.width='152px';
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
  
   setTimeout(()=>{lyr.style.zIndex='4'; }, 100);
});


document.getElementById('layers').addEventListener('mouseleave', ()=> {
  lyr.style.left='-50px';
  lyr.style.opacity='0';
  lyr.style.zIndex='2';

});

navbar.onmouseenter=()=>{

  nav.style.width='250px';
  nav.style.backgroundImage='linear-gradient(to right, rgb(0, 0, 0) 30%, rgba(255, 255, 255, 0) )';
}
navbar.onmouseleave=()=>{
  nav.style.width='150px';
  navbar.style.width='152px';
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
 
    
      // map.on('click', function(e) {
      //   var coordinates = e.lngLat;
      //   new mapboxgl.Popup()
      //       .setLngLat(coordinates)
      //       .setHTML('Longitude: ' + coordinates.lng + '<br />Latitude: ' + coordinates.lat)
      //       .addTo(map);
      // });
      
      document.querySelectorAll('#slider > span > span').forEach( element => {
        element.addEventListener('click', () => {
        check()
        })
       }) 
 
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

  map.addControl(new mapboxgl.NavigationControl());
  
  var f;
  function check(t)
  {  if(t=='points' || t=='heat')
       f = t;
    slide.style.width = '100%';
    slide.style.transition = 'ease-in-out 2s';
    slide.style.opacity = '1';

    var geodata = {"type": "FeatureCollection", "features": []} ;
    fetch('crimes.json').then(response => response.json())
    .then(data => {
      

      slide.querySelectorAll('input').forEach( element => {
        if(element.checked == true)
        {
          state = Object.keys(data[element.value])
        
          state.forEach( e => {
            statedata = data[element.value][e];
            geodata['features'] = [...geodata['features'] , ...data[element.value][e]['features']];
          })
        }
        
      }) 
      if(f=='points')
        showcrime(geodata)
      else
        showheatmap(geodata)
    })
   

  }
  function Removesource()
  {
    map.removeLayer('clusters');
    map.removeLayer('cluster-count');
    map.removeLayer('unclustered-point');
    map.removeLayer('crimes-heat');
    map.removeLayer('crimes-point');
    try{
      map.removeSource('crimes');
    }
    catch(error)
    {
      console.log(error)
    }
  }

 function showcrime(geodata)
 {

  Removesource();

  map.addSource('crimes', {
    type: 'geojson',
    // Point to GeoJSON data. This example visualizes all M1.0+ crimes
    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    data: geodata,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
     
    map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'crimes',
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
    source: 'crimes',
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
    source: 'crimes',
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
    map.getSource('crimes').getClusterExpansionZoom(
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
    // console.log(e.features[0].properties.id, coordinates[1]);
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

 function showheatmap(geodata)
 {

  Removesource();

  map.addSource('crimes', {
    'type': 'geojson',
    'data': geodata
    });
     
    map.addLayer(
    {
    'id': 'crimes-heat',
    'type': 'heatmap',
    'source': 'crimes',
    'maxzoom': 9,
    'paint': {
    // Increase the heatmap weight based on frequency and property magnitude
    'heatmap-weight': [
    'interpolate',
    ['linear'],
    ['get', 'mag'],
    0,
    0,
    6,
    1
    ],
    // Increase the heatmap color weight weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    'heatmap-intensity': [
    'interpolate',
    ['linear'],
    ['zoom'],
    0,
    1,
    9,
    3
    ],
    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    // Begin color ramp at 0-stop with a 0-transparancy color
    // to create a blur-like effect.
    'heatmap-color': [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    'rgba(33,102,172,0)',
    0.2,
    'rgb(103,169,207)',
    0.4,
    'rgb(209,229,240)',
    0.6,
    'rgb(253,219,199)',
    0.8,
    'rgb(239,138,98)',
    1,
    'rgb(178,24,43)'
    ],
    // Adjust the heatmap radius by zoom level
    'heatmap-radius': [
    'interpolate',
    ['linear'],
    ['zoom'],
    0,
    2,
    9,
    20
    ],
    // Transition from heatmap to circle layer by zoom level
    'heatmap-opacity': [
    'interpolate',
    ['linear'],
    ['zoom'],
    7,
    1,
    9,
    0
    ]
    }
    },
    'waterway-label'
    );
     
    map.addLayer(
    {
    'id': 'crimes-point',
    'type': 'circle',
    'source': 'crimes',
    'minzoom': 7,
    'paint': {
    // Size circle radius by earthquake magnitude and zoom level
    'circle-radius': [
    'interpolate',
    ['linear'],
    ['zoom'],
    7,
    ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
    16,
    ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
    ],
    // Color circle by earthquake magnitude
    'circle-color': [
    'interpolate',
    ['linear'],
    ['get', 'mag'],
    1,
    'rgba(33,102,172,0)',
    2,
    'rgb(103,169,207)',
    3,
    'rgb(209,229,240)',
    4,
    'rgb(253,219,199)',
    5,
    'rgb(239,138,98)',
    6,
    'rgb(178,24,43)'
    ],
    'circle-stroke-color': 'white',
    'circle-stroke-width': 1,
    // Transition from heatmap to circle layer by zoom level
    'circle-opacity': [
    'interpolate',
    ['linear'],
    ['zoom'],
    7,
    0,
    8,
    1
    ]
    }
    },
    'waterway-label'
    );
 }
