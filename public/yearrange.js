var navbar = document.getElementById('navbar');
var s = document.getElementById("year")
var y=s.innerHTML;
var g;
min = '2001-01-01'
max = '2023-12-31'

y=y+`<table><tr><th><label>From: </label></th><th><input type="date" id="fr_Date" name="myDate" min=${min} max=${max} value="2023-12-20"></th>`+'<th></th><th></th></tr>'+
    `<tr><th><label>To: </label></th><th><input type="date" id="to_Date" name="myDate" min=${min} max=${max} value="${max}"></th>`+'<th id="iconn"><button class="iconn"><i class="fa-solid fa-circle-up"></i></button><button class="iconn"><i class="fa-solid fa-circle-down"></i></button></th>'+
     '<th><button>Apply</button></th><th><button><i class="fa-solid fa-circle-play"></i></button></th></tr><tr><th><label>City: </label></th><th><select id="select-city-1"><option value="None">-None-</option><option value="New_York">New York</option><option value="Chicago">Chicago</option></select></th><th><label>Type: </label></th><th><select id="mtype"><option>Heatmap</option><option>Clusters</option></select></th></tr></table><button class="close"><i class="fa-solid fa-circle-xmark" style="color: #d06767;"></i></button>';
s.innerHTML = y;


from = document.getElementById('fr_Date')
to = document.getElementById('to_Date')

start = new Date(from.value);
end = new Date(to.value);

var b = s.querySelectorAll('button');


var listdata = [] 
var p,o;
var i=0;

function datedifference(start, end)
{
  const day = 1000 * 60 * 60 * 24; // One day in milliseconds
  const diff = Math.abs(start - end);
  return Math.round(diff/day);

}

function resetSlider(){
  i=0;

}
from.onchange = () => {
  if(o != new Date(from.value).toDateString() || p != new Date(to.value).toDateString() )
            listdata = []
    start = new Date(from.value)
    end = new Date(to.value)
    st = start.toISOString().split('T')[0]
    console.log(st)
   if(start>end){
    to.value = st; 
   }
   if(datedifference(start, end)>30)
   {
    end = start;
    end.setDate(end.getDate()+30)
    to.value = end.toISOString().split('T')[0];
   }
   resetSlider();
   
   b[2].disabled=false;

}
to.onchange = () => {
  if(o != new Date(from.value).toDateString() || p != new Date(to.value).toDateString() )
            listdata = []

    start = new Date(from.value)
    end = new Date(to.value)
    en = end.toISOString().split('T')[0]
    console.log(en)
  if(start>end){
    from.value = en;
  }
   if(datedifference(start, end)>30)
   {
    start = end
    start.setDate(start.getDate()-30)
    from.value = start.toISOString().split('T')[0];
   }
   resetSlider();
   b[2].disabled=false;
}

b[0].onclick = () => {
    if(start > new Date('2001-01-01'))
    {
      if(o != new Date(from.value).toDateString() || p != new Date(to.value).toDateString())
         listdata = [];
      start = new Date(from.value);
      end = new Date(to.value);
      end.setDate(new Date(to.value).getDate()-1);
      start.setDate(new Date(from.value).getDate()-1);
      from.value = start.toISOString().split('T')[0];
      to.value = end.toISOString().split('T')[0];
      b[2].disabled=false;
      resetSlider();
    }
 
   }
  
b[1].onclick = () => {
    if(end < new Date('2023-12-31'))
    {   if(o != new Date(from.value).toDateString() || p != new Date(to.value).toDateString())
            listdata = []
        start = new Date(from.value)
        end = new Date(to.value)
        end.setDate(new Date(to.value).getDate()+1)
        start.setDate(new Date(from.value).getDate()+1)
        from.value = start.toISOString().split('T')[0]
        to.value = end.toISOString().split('T')[0]
        b[2].disabled=false;
        resetSlider();
    }
   }   

  b[2].onclick = () => { 
    st.style.display='block';
    b[2].disabled=true;
     o = new Date(from.value).toDateString();
     p = new Date(to.value).toDateString();
     console.log(o, p)
     var city = select_city();
     if(city == 'None')
      {
        popupWarning('Please Select a City !!!')
        b[2].disabled = false;
      }
     else
       datacollection(city)
     
    }

   
    
function playtimer(data, keys){
  var hi = document.getElementById('hide');

  b[3].onclick = () => {
 
  if(b[3].innerHTML == '<i class="fa-solid fa-circle-play" aria-hidden="true"></i>') 
    { 
      s.querySelectorAll('input').forEach((e)=>{e.disabled = true;})
      s.querySelectorAll('button').forEach((e)=>{if(e != b[4]) e.disabled = true;})
        hi.style.display = 'none';
        minimizestats();
        hi.innerHTML = '<i class="fa-solid fa-angles-right fa-shake" style="color: #a4a5a8;"></i>';
        b[3].disabled = false;
        b[3].innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
       var z = document.querySelectorAll('#time-slide span'); 
       g = setInterval(()=>{
        updateData(data[keys[i]]);
        anislide(z)
       },1000)
    }
    else
     {
      s.querySelectorAll('input').forEach((e)=>{e.disabled = false;})
      s.querySelectorAll('button').forEach((e)=>{if(e != b[2]) e.disabled = false;})
      clearInterval(g)
      b[3].innerHTML = '<i class="fa-solid fa-circle-play"></i>';

     }
   
   }
  }


  function clslay(){
    lyr.style.left='-200px';
    lyr.style.opacity='0';
    lyr.style.zIndex='2';
    navbar.style.display= 'block';
    nbarleave();
  }

  function closeAnly()
  { 
    navbar.style.display= 'block';
    navbar.style.width= '50px';
   Removesource();
   document.getElementById('time-slide').style.display = 'none';
   var hi = document.getElementById('hide');
   minimizestats();
   setTimeout(()=>{
    document.getElementById('sidebar').style.display = 'none';
    hi.innerHTML = '<i class="fa-solid fa-angles-right fa-shake" style="color: #a4a5a8;"></i>';
    hi.style.display = 'none';
    st.style.display = 'none';
    

   }, 700);
  
     
    slide.style.cssText = `width:0px; transition:ease-in-out 0.7s;
    opacity:0;`;

  }
   


  var close0 = document.getElementsByClassName('close')[0];
 
  close0.onclick = () => { 
    clslay();
    close0.style.display = 'none';
    Elem_id('account-container').style.display = 'block';
   }
   

  var close1 = document.getElementsByClassName('close')[1];

  close1.onclick = () => { 
    $('#head').html('');
    document.querySelector('#pred').style.display='none';
    navbar.style.display='block';
    graph.style.display = 'none';
    close1.style.display = 'none';
    var hi = document.getElementById('hide');
    Removesource();
    minimizestats();
    setTimeout(()=>{
      document.getElementById('sidebar').style.display = 'none';
      hi.innerHTML = '<i class="fa-solid fa-angles-right fa-shake" style="color: #a4a5a8;"></i>';
      hi.style.display = 'none';
      st.style.display = 'none';
    
     }, 700);
     Elem_id('account-container').style.display = 'block';
    

  }
  
   
  var close2 = document.getElementsByClassName('close')[2];
   close2.onclick = () => { 
    closeAnly();
    $('#head').html('');
    close2.style.display = 'none';
    Elem_id('account-container').style.display = 'block';

    }


function showdate()
{   $('#head').html('Crime Analysis');
    navbar.style.display ='none';
    slide.style.cssText = `width:400px;
                        transition:ease-in-out 0.7s;
                        opacity:1;`;
    close2.style.display = 'block';
    Elem_id('account-container').style.display = 'none';
}
// ...........................................................

function slider(data){
 clearInterval(g)

 var keys = Object.keys(data);
 console.log(keys);
 var y = document.querySelector('#time-slide div');
 var x = '';
 var k = 0;
 i=0;
 while(k<keys.length)
 {
    x = x + '<span>'+keys[k]+'</span><br>';
    k++;
 }

y.innerHTML = x;

var z = document.querySelectorAll('#time-slide span'); 

console.log(z[0])

  selectslide(y,data)
  statistics(z,data[keys[i]])
  playtimer(data, keys)
  z[i].style.cssText="border:2px solid white; font-size: 21px;"
  z[i+1].style.cssText="font-size: 18px;"

}

async function selectslide(y,data)
{
  
  var z = document.querySelectorAll('#time-slide span'); 
  displaystats()
  y.onclick = async (event) => {
        clearInterval(g)
        
         document.querySelector('#time-slide').style.cssText = "height: 150px; right:0px; display: block"
         s.querySelectorAll('input').forEach((e)=>{e.disabled = false;})
         s.querySelectorAll('button').forEach((e)=>{e.disabled = false;})
        document.querySelector('#hide').style.display='block';
         
         b[3].innerHTML = '<i class="fa-solid fa-circle-play"></i>';
          var k = 0;
          while(k<z.length){
          console.log(event.target.innerHTML, z[k].innerHTML)

          if(event.target.innerHTML == z[k].innerHTML)
            break;
          k++;
         }
         i = k;
         
         updateData(data[z[k].innerHTML])
         statistics(z,data[z[i].innerHTML])
         anislide(z)
       
        }

}

function anislide(z)
{
  
  var f = 0;

  while(f<z.length)
  {
    z[f].style.cssText="font-size: 15px; border:rgba(255, 255, 255, 0);"
    f++;
  }

  z[i].scrollIntoView({ behavior: 'smooth', block: 'center' })
  console.log(z[i])
  z[i].style.cssText= "border:2px solid white;"+
                     "font-size: 21px;"+
                     "box-shadow: 0 50px 100px rgba(0, 0, 0, 1);"
  
  
  if(i>0 && i<z.length-1)
  {
    z[i-1].style.cssText="font-size: 18px;"
    z[i+1].style.cssText="font-size: 18px;"
  }

  if(i==0)
  { z[i+1].style.cssText="font-size: 18px;" }
  

  i=i+1

  if((i-1)==z.length-1)
  { z[i-2].style.cssText="font-size: 18px;"
    i=0; }


}

async function getdata(crm)
{
  
  var jsn;
    await fetch('/api/run_2',{
      method: "POST",
      headers:{"Content-Type" :"application/json"},
      body: crm
    }).then(response => response.text()).then(str =>{
      
      // console.log(str)
      // str = str.replaceAll("['", "[");
      // str = str.replaceAll("']", "]");
      // str = str.replaceAll("'", "\"");
      // str = str.replace(/""/g,"\"")
      str = str.replaceAll('BURGLAR"S TOOLS', 'BURGLARS TOOLS');
      
  
      // str = str.replace(/array\(/g, "");
      // str = str.replace(/\)/g, "");
      // str = str.replace(/(\-\d+\.?\d*)/g, "\"$1\"");
      console.log(str)
      jsn = JSON.parse(str)
    //  console.log(jsn)
    })
    return jsn
    
}


function maptype(m, geodata)
{
  
  if(m.value == 'Heatmap')
    loadheatmap(geodata)
  else
    loadclusters(geodata)
        resetSlider();
}

function select_city(){
  var m_city = Elem_id('select-city-1');
 
   return m_city.value
}

Elem_id('select-city-1').onchange = ()=>{
  b[2].disabled = false;
  
}

async function datacollection(city)
{ 
     
      document.querySelector('#loading-page').style.display = 'table-cell';
       

       var mtype = document.querySelector('#year #mtype');
    // Create a new GeoJSON object with the filtered features
       const crm = JSON.stringify({'city': city, 'from': from.value, 'to': to.value, 'Ext_type':'heat-map'});
        data = await getdata(crm)

       var geodata = data[from.value];

      var mtype = document.querySelector('#year #mtype');
  
      mtype.onchange=()=>{
        maptype(mtype, geodata);
      };
      maptype(mtype, geodata);

      slider(data);

      setTimeout(()=>
        map.flyTo({
          center: [-74.0059945, 40.7127492],
          zoom: 10,
         duration: 20000,
          curve: 1.5,
          easing: (t) => t * (2 - t)
        }), 2000)
      
        document.querySelector('#loading-page').style.display = 'none';
        document.querySelector('#time-slide').style.cssText = "height: 100px;right:0px; display: block";
    }

var degree = 0;
function aniLoad(){
 degree = degree + 30;
 document.querySelector(`#loading-page img`).style.transform=`rotate(${degree}deg)`;
}
 var rotate = setInterval(aniLoad, 500)
