
var lyr=document.getElementById('layers');
var slide = document.getElementById('slide');
var x = navbar.querySelectorAll('div');



x[0].addEventListener('click', ()=> {

   lyr.style.left='0px';
   lyr.style.opacity='1';
   navbar.style.display= 'none';
   close0.style.display='block';
   Elem_id('account-container').style.display = 'none';
   lyr.style.zIndex='5';
});

x[2].onclick=()=>{
  var sd = document.querySelector('#sidebar');
  sd.style.display = 'block';
  sd.style.opacity = '1';

  navbar.style.display='none';
  $('#head').html('Crime Prediction');
  document.querySelector('#pred').style.display='block';
 
  close1.style.display = 'block';
  Elem_id('account-container').style.display = 'none';
  graph.style.display='block';

  
  displaystats();



}


function nbarenter()
{
  navbar.style.width='200px';
  navbar.style.boxShadow= '100px 0 60px 30px rgba(0, 0, 0, 0.635)';
  navbar.style.backgroundImage='linear-gradient(to right, rgb(0, 0, 0.635) 20%, rgba(255, 255, 255, 0))';
}
function nbarleave()
{
  navbar.style.width='50px';
  navbar.style.boxShadow= '40px 0px 20px 30px rgba(0, 0, 0, 0.635)';
}


navbar.onmouseenter=()=>{
  nbarenter();
}
navbar.onmouseleave=()=>{
  nbarleave();
}




var img = lyr.querySelectorAll('img');
img.forEach(e => {
  e.addEventListener('click',()=>{
    img.forEach(f => {
      f.style.border='2px solid rgba(255, 255, 255, 0)';
      f.style.boxShadow='0 5px 10px rgba(255, 255, 255, 0)'
      f.onmouseenter=()=>{f.style.backgroundColor='rgba(255, 255, 255, 0.635)'; f.style.boxShadow='0 5px 10px rgba(255, 255, 255, 0.635)';};
      f.onmouseleave=()=>{f.style.backgroundColor='rgba(255, 255, 255, 0.635)'; f.style.boxShadow='0 5px 10px rgba(255, 255, 255, 0)'};
    });

  
    e.style.border='2px solid white';
    e.style.boxShadow='0 5px 10px rgba(255, 255, 255, 0.635)'
    e.onmouseenter=()=>{};
    e.onmouseleave=()=>{};
    map.setStyle(style+e.dataset.value);
  })
});



mapboxgl.accessToken = 'pk.eyJ1IjoiYWtzaGF0MjUxMiIsImEiOiJjbTE0NDI4N2YxY3I5MmpzZnNieWFwNXc0In0.JHhey50KWCJT-MgwUeeWVA';
var style = 'mapbox://styles/akshat2512/';


var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: style+'clmk935hf01tx01pf6grq4oev', // style URL
    // starting position [lng, lat]
    center: [178.005696,  40.8127492],
    zoom: 1, // starting zoom
});

map.on('load', function() {
  document.getElementById('map').style.opacity = '1';

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
        center: [-74.0059945, 40.7127492],
        zoom: 5,
        speed: 0.4,

        curve: 1,
        easing: (t) => t * (2 - t)
      });
swa
      
 
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
  
 async function filterfeatures(data)
  {
    const filteredFeatures = await data.features.filter((feature) => {
    const featureDate = new Date(feature.properties.date);
      return featureDate >= new Date(from.value) && featureDate <= new Date(to.value);
  });

   var geodata = {
    type: 'FeatureCollection',
    features: filteredFeatures
};

   return geodata;
  }
  
  async function fetchData()
  { 
    var geodata;
    await fetch('static/GeoJson/New_York.json').then(response => response.json())
    .then(async data => { 
    // Create a new GeoJSON object with the filtered features
       geodata = await filterfeatures(data);
  
    })
    return geodata;
  }


//  async function check(t)
//   {  if(t=='points' || t=='heat')
//        f = t;
    
//     var geodata = {"type": "FeatureCollection", "features": []} ;

//     var geodata = await fetchData();
//     console.log(geodata)

//     // fetch('static/GeoJson/New_York.json').then(response => response.json())
//     // .then(data => { 

//       setTimeout(
//       map.flyTo({
//         center: [-74.0059945, 40.7127492],
//         zoom: 10,
//        duration: 20000,
//         curve: 1.5,
//         easing: (t) => t * (2 - t)
//       }), 2000)
      
       
//     // // Create a new GeoJSON object with the filtered features
//     //    geodata = filterfeatures(data);
       
//     //   // document.querySelectorAll('#time-slide div span').forEach( element => {
//     //   //   if(element.checked == true)
//     //   //   {
//     //   //     state = Object.keys(data[element.value])

//     //   //     state.forEach( e => {
//     //   //       statedata = data[element.value][e];
//     //   //       geodata['features'] = [...geodata['features'] , ...data[element.value][e]['features']];
//     //   //     })
//     //   //   }
        
//     //   // }) 
//       console.log(geodata)
//       if(f=='points')
//         loadclusters(geodata)
//       else
//         loadheatmap(geodata)
        
  
   

//   }
  
  function prediction(e)
  { document.querySelector('#loading-page').style.display = 'table-cell';
    // fetch(`static/GeoJson/New_York.json`).then(response => response.json()).then(data => {
    //   document.querySelector('#loading-page').style.display = 'none';
    //   loadclusters(data)
    // })
    var i=0;
    fly_to(z);
    pred_crimes();
    pred_current();
     
  }
  

  function Removesource()
  {
   
    try{
      map.removeLayer('clusters');
      map.removeLayer('cluster-count');
      map.removeLayer('unclustered-point');
      map.removeLayer('crimes-heat');
      map.removeLayer('crimes-point');
      map.removeSource('crimes');
    }
    catch(error)
    {
      console.log(error)
    }

  }
 
var uncluster, popup;
var z=document.getElementById('pred').querySelector('select');

z.onchange=()=>{
 
  try{
    Removesource()
    popup.remove()
    map.off('click', 'unclustered-point', uncluster)
    
  }
  catch(error)
  {
    console.log(error)
  }

  if(z.value != 'None')
  {
    prediction(z.value)
    console.log(z.value)
  }
  
}

function fly_to(z){
  if(z.value == 'New_York')
    {map.flyTo({
     center: [-74.0059945, 40.7127492],
     zoom: 10,
     speed: 0.5,
     curve: 1,
     easing(t) {
       return t;
     }
   });
 }
 
 if(z.value == 'Chicago')
   {map.flyTo({
    center: [-87.615, 41.874],
    zoom: 10,
    speed: 0.5,
    curve: 1,
    easing(t) {
      return t;
    }
  });
 }
}


function loadclusters(geodata)
 {

  Removesource();

  map.addSource('crimes', {
    type: 'geojson',

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
    
   

    // check for cluster on click
    map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
    layers: ['clusters']
    });
    const clusterId = features[0].properties.cluster_id;
    map.getSource('crimes').getClusterExpansionZoom(
    clusterId,
    (err, zoom) => {
    if (err) return;
     
    map.flyTo({
    center: features[0].geometry.coordinates,
    zoom: zoom
    });
    }
    );
    });
    
    map.on('click', 'unclustered-point', (event) => {
        const e=event.features[0].properties;
        console.log(e)
        if (e.boro_nm)
          loc = e.boro_nm;
        else
          loc = e.block; 
       popup = new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`<strong>Location:</strong> ${loc}<br>
        <strong>Offense:</strong> ${e.ofns_desc}<br>
        <strong>Premises Type:</strong> ${e.prem_type}<br>
        <strong>Date:</strong> ${e.date}<br>
        <strong>Time:</strong> ${e.time}<br>  `)
        .addTo(map);
        });
    
    map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';});

    }


function loadheatmap(geodata)
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
       'maxzoom': 20,
       'paint': {
       // Increase the heatmap weight based on frequency and property magnitude
      //  'heatmap-weight': [
      //  'interpolate',
      //  ['linear'],
      //  ['zoom'],
      //  9,
      //  5,
      //  15,
      //  0
      //  ],
      //  // Increase the heatmap color weight weight by zoom level
      //  // heatmap-intensity is a multiplier on top of heatmap-weight
      //  'heatmap-intensity': [
      //  'interpolate',
      //  ['linear'],
      //  ['zoom'],
      //  0,
      //  0.1,
      //  9,
      //  3
      //  ],
      //  // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      //  // Begin color ramp at 0-stop with a 0-transparancy color
      //  // to create a blur-like effect.
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
      //  // Adjust the heatmap radius by zoom level
       'heatmap-radius': [
       'interpolate',
       ['linear'],
       ['zoom'],
       0,
       2,
       9,
       15
       ],
      
      //  // Transition from heatmap to circle layer by zoom level
       'heatmap-opacity': 0.5
      // "heatmap-color": ["interpolate",["linear"],["heatmap-density"],0,"rgba(0, 0, 255, 0)",0.1,"#ffffb2",0.3,"#feb24c",0.5,"#fd8d3c",0.7,"#fc4e2a",1,"#e31a1c"]
       },
    
       },
       'waterway-label'
       );


      //  map.addLayer({
      //   id: 'point-type',
      //   type: 'fill',
      //   source: 'crimes',
      //   paint: {
      //     'fill-color': [
      //       'match',
          //   ['get', 'ofns_type'],
          //   'SEX CRIMES', 'gray',
          //   'RAPE', 'white',
          //   'THEFT_FRAUD','yellow',
          //   'BURGLARY', 'blue',
          //   'orange'
          // ],
      //     'fill-opacity': 0.7 // Adjust opacity if needed
      //   }
      // });
       map.addLayer(
       {
       'id': 'crimes-point',
       'type': 'circle',
       'source': 'crimes',
       'minzoom': 13,
    //     filter: [
    //   'match',
    //   ['get', 'ofns_desc'],
    //   'SEX CRIMES', true, // Display 'SEX CRIMES'
    //   'RAPE', true, // Display 'RAPE'
    //   'THEFT_FRAUD', true, // Display 'THEFT_FRAUD'
    //   'BURGLARY', true, // Display 'BURGLARY'
    //    false // Hide other cases
    // ],
       'paint': {
        

      //  'circle-color': [
      //  'match',
      //  ['get', 'ofns_desc'],
      //       'SEX CRIMES', 'gray',
      //       'RAPE', 'white',
      //       'THEFT_FRAUD','yellow',
      //       'BURGLARY', 'blue',
      //        'orange'
      //     ],
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

       map.on('click', 'crimes-point', (event) => {
        const e=event.features[0].properties;
        console.log(e)
        if (e.boro_nm)
          loc = e.boro_nm;
        else
          loc = e.block; 
       popup = new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`<strong>Location:</strong> ${loc}<br>
        <strong>Offense:</strong> ${e.ofns_desc}<br>
        <strong>Premises Type:</strong> ${e.prem_type}<br>
        <strong>Date:</strong> ${e.date}<br>
        <strong>Time:</strong> ${e.time}<br>  `)
        .addTo(map);
        });

        

    }
    
function updateData(newGeoJSON) {
    console.log(newGeoJSON)
      map.getSource('crimes').setData(newGeoJSON);
      // Animate opacity transition
      map.setPaintProperty('crimes-heat', 'heatmap-opacity', 0.5); // New opacity value
  }