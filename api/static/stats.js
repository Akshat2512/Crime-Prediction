var graph = document.getElementById('graphs');
var st = document.getElementById('stats');


var xValues, yValues;  // The X values
var y_pred, y_test;

var models = ['XGBoost', 'Decision_Tree', 'Light_GBM', 'Random_Forest', 'Linear']

var Charts = []
function predcharts(i)
{
  var charts = document.getElementById(`myChart${i}`).getContext('2d');
var myChart = new Chart(charts, {
  type: "line", // The type of the chart
  data: {
    labels: xValues, // The labels for the X axis
    datasets: [{
      label: "Actual", // The label for the dataset
      data: yValues, // The data for the dataset
      fill: true, // Whether to fill the area under the line
      backgroundColor:"rgba(40, 211, 211, 0.292)",
      borderColor: "blue", // The color of the line
      pointBackgroundColor: "red", // The color of the points
      pointRadius: 0, // The radius of the points
      
    },
    {
      label: "Test", // The label for the dataset
      data: y_test, // The data for the dataset
      fill: false, // Whether to fill the area under the line
      borderColor: "rgb(64 95 222 / 60%)", // The color of the line
      pointBackgroundColor: "red", // The color of the points
      pointRadius: 0, // The radius of the points
     
    },
    {
      label: "Predicted", // The label for the dataset
      data: y_pred, // The data for the dataset
      fill: false, // Whether to fill the area under the line
      borderColor: "green", // The color of the line
      pointBackgroundColor: "orange", // The color of the points
      pointRadius: 0, // The radius of the points
     
    }]
    
  },
  options: {
    responsive: false, // Whether to resize the chart according to the container size
    plugins: {
      crosshair: {
          line: {
              color: 'red', // Customize the crosshair line color
              width: 1, // Customize the crosshair line width
          },
      },
  },
    tooltips:{
        mode: 'index'
    },
    title: {
      display: true, // Whether to display the title
      text: "Crime Rate Prediction" // The text of the title
    },
    scales: {
          xAxes: [{
            ticks: {
              autoSkip: true, 
              // maxTicksLimit: 4, 
            },
          }],

          yAxes: [{
            ticks: {
              display:true,
              beginAtZero: false, // Whether to start the Y axis at zero
              // max: 50
            },
            }],
         
    
    }
  }
 });
 
 Charts.push(myChart);
}

function pred_graphs()
{ 
  var b = Elem_id("graphs");
 
  var i = 0;
  b.innerHTML = ''
  while(i < models.length)
    {
   
      b.innerHTML = b.innerHTML + `<div class="charts" data-value=${i}>
      <i class="fa-solid fa-left-long" style="color: #d8dadf;"></i>
      <i class="fa-solid fa-right-long" style="color: #d8dadf;"></i>
      <button>+</button>
      <button>-</button>
      <button>Reset</button>
      <canvas id="myChart${i}" style="width: 530px;height: 300px;"></canvas>
      <div></div>
      <div></div>
      <div class = "loading-page"> <img src="static/Data/icons/Loading.png" height="70" width="70" style="padding: 40px"> </div>
       </div>`
       i = i+1; 
    }

  i = 0;
  var g = setInterval(()=>{
      predcharts(i)
      i = i+1;
      if(i>models.length-1)
      {clearInterval(g)}
    }, 1000)
  
}

pred_graphs();

function updateCharts(jsn, myChart, i, model)
{
  model = model.replace('_', ' ')
  var x = document.querySelectorAll(`#graphs .charts>:nth-child(7)`)[i]

  x.innerHTML = `
                  <b>${model} Regression</b>
                  <div>R-squared Score: ${jsn['RSQ']}</div>
                  <div>Root Mean Square Error: ${jsn['RMS']}</div>
                  <div>Mean Absolute Error: ${jsn['MAE']}</div>
  `

 
  xValues = jsn.Actual['X'].concat(jsn.Predicted['X_Pred']);
  yValues = jsn.Actual['y'].map(s => parseInt(s));
  y_pred = jsn.Actual['y'].map(() => null);
  y_pred = y_pred.concat(jsn.Predicted['y_pred'].map(s => parseInt(s)));
  y_test = jsn.Actual['X'].map(() => null);
  y_test = y_test.concat(jsn.Test['y_test'].map(s => parseInt(s)));
    
    myChart.data.labels = xValues;
    myChart.data.datasets[0].data = yValues;
    myChart.data.datasets[1].data = y_test;
    myChart.data.datasets[2].data = y_pred;
    myChart.options.title.text = `Crimes Prediction( ${z.value} ) using ${model} Regression`;
    myChart.options.scales.xAxes[0].ticks.min = jsn.Actual['X'][jsn.Actual['X'].length-50] 
    myChart.options.scales.xAxes[0].ticks.max = jsn.Predicted['X_Pred'][150]
   
    graphevents(myChart, xValues, yValues.concat(jsn.Test['y_test']), i);
    
    var loading = document.querySelectorAll(`#graphs .charts>:nth-child(9)`)[i]

    setTimeout(()=>{console.log(myChart); myChart.update(); loading.style.display = 'none'}, 700);
}



function graphevents(myChart, e, f, i)
{
  var b = document.querySelectorAll(`#graphs .charts`)[i].querySelectorAll(`i, button`);
var start = myChart.options.scales.xAxes[0].ticks.min 
var end =  myChart.options.scales.xAxes[0].ticks.max 
var c_max = myChart.options.scales.yAxes[0].ticks.max
var min, max;
var i_min = e.indexOf(start);
var i_max = e.indexOf(end);


c_max = Math.max(...f.slice(i_min, i_max))

myChart.options.scales.yAxes[0].ticks.max = c_max + 10;

b[0].onclick = () => {
    i_min = i_min-10;
    i_max = i_max-10;
      min = e[i_min];
      max = e[i_max];
      myChart.options.scales.xAxes[0].ticks.min = min;
      myChart.options.scales.xAxes[0].ticks.max = max;

      c_max = Math.max(...f.slice(i_min, i_max))
      if(c_max != -Infinity)
        myChart.options.scales.yAxes[0].ticks.max = c_max + 10;
 
      setTimeout(()=>{myChart.update();}, 20);
     
   }

  b[1].onclick =()=>{
     i_min = i_min+10;
     i_max = i_max+10;
      min = e[i_min];
      max = e[i_max];
      myChart.options.scales.xAxes[0].ticks.min = min;
      myChart.options.scales.xAxes[0].ticks.max = max;

      c_max = Math.max(...f.slice(i_min, i_max))
      if(c_max != -Infinity)
        myChart.options.scales.yAxes[0].ticks.max = c_max+10;

      setTimeout(()=>{myChart.update();}, 20);
    
  }
  b[2].onclick =()=>{
     
    i_min = i_min+10;
    i_max = i_max-10;
    min = e[i_min];
    max = e[i_max];
    myChart.options.scales.xAxes[0].ticks.min = min;
    myChart.options.scales.xAxes[0].ticks.max = max;
 
    c_max = Math.max(...f.slice(i_min, i_max))
    if(c_max != -Infinity)
      myChart.options.scales.yAxes[0].ticks.max = c_max+10;

    setTimeout(()=>{myChart.update();}, 20);

  }
  b[3].onclick =()=>{
    i_min = i_min-10;
    i_max = i_max+10;
    min = e[i_min];
    max = e[i_max];
    myChart.options.scales.xAxes[0].ticks.min = min;
    myChart.options.scales.xAxes[0].ticks.max = max;

    c_max = Math.max(...f.slice(i_min, i_max))
    if(c_max != -Infinity)
      myChart.options.scales.yAxes[0].ticks.max = c_max+10;

    setTimeout(()=>{myChart.update();}, 20);

  }
  b[4].onclick =()=>{
    i_min = e.indexOf(start);
    i_max = e.indexOf(end);
    min = e[i_min];
    max = e[i_max];
    myChart.options.scales.xAxes[0].ticks.min = min;
    myChart.options.scales.xAxes[0].ticks.max = max;
    
     c_max = Math.max(...f.slice(i_min, i_max))
     if(c_max != -Infinity)
       myChart.options.scales.yAxes[0].ticks.max = c_max+10;

    setTimeout(()=>{myChart.update();}, 20);
  }
}



async function pred_crimes(){
  var jsn;


  var l = document.querySelectorAll('#graphs .charts>:nth-child(9)');
  l.forEach(e => {
    e.style.display = "flex"
  })


 var  i = 0;
 
 while(i < models.length){
 const crm = JSON.stringify({"city": z.value, "model": models[i] });
  var response = await fetch('/run_1',{
    method: "POST",
    headers:{"Content-Type" :"application/json"},
    body: crm
  })
  
  var str = await response.text();
  document.querySelector('#loading-page').style.display = 'none';
  jsn = JSON.parse(str);
    
  console.log(jsn);
  
  updateCharts(jsn, Charts[i], i, models[i]);
  i++;
    }
}

var tg;
async function pred_current(){
 
    clearInterval(tg);
     var coordinates;
      if(z.value=='New_York')
         coordinates = [-74.0059945, 40.7127492];
      if(z.value=="Chicago")
        coordinates = [-87.615, 41.874];

      var curr_date = new Date().toLocaleDateString(); 
      var jsn = {'city': z.value, 'model': 'XGBoost', 'date': curr_date}
  
      var data = JSON.stringify(jsn);

      var response = await fetch(`/live`, {
        method: "POST",
        headers:{"Content-Type" :"application/json"},
        body: data
      })

      var data = await response.json();

      try{
      popup.remove();
      }
      catch(e){ }

      popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`<div id="prediction-graph">
                                   <div></div>
                                   <div><canvas id="Pred-Chart" style="width:250px; height: 145px"></canvas></div>
                                   <div></div>
                                   <button><</button>
                                   <button>></button>
                                   <button><i class="fa-solid fa-circle fa-fade" style="color: #ff0000;"></i> Live</button>
                                   <div>
                                     <div></div>
                                     <div></div>
                                   </div>
                      </div>`)
            .addTo(map);
      
      var charts = document.getElementById(`Pred-Chart`).getContext('2d');
      var myChart = new Chart(charts, {
              type: "bar",
      });

      var set_time = document.querySelector('#prediction-graph div:nth-child(3)');
      var set_date = document.querySelector('#prediction-graph div:nth-child(1)');

      var ch_hr = NaN;
      var hr = new Date().getHours();

      if(hr<10)
            hr = String('0'+hr);
     
      var curr_index = `${new Date().toLocaleDateString().split('/').reverse().join('-')} ${hr}:00:00`;
      curr_index = data.dates.indexOf(curr_index)-1;

      var time;
      var r = 0;
      function start_timer(){

          set_date.innerHTML = new Date().toDateString();
          set_time.innerHTML = new Date().toLocaleTimeString();
    
           hr = new Date().getHours();
          if(hr<10)
            hr = String('0'+hr);
      
          if(hr != ch_hr)
          {
            ch_hr = hr;
            curr_index++;
            updatecurrentchart(myChart, data, curr_index, r);
            update_crime_stats(data, curr_index);
          }
       
      }
      tg = setInterval(start_timer, 1000);
    
      var x = document.querySelectorAll('#prediction-graph button');
      
      
     
      x[0].onclick = () => {
        clearInterval(tg);
        time =  new Date(set_date.innerHTML+" "+set_time.innerHTML);
        time.setHours(time.getHours()-1);
        time.setMinutes(0);
        time.setSeconds(0);
        set_time.innerHTML = time.toLocaleTimeString();
        set_date.innerHTML = time.toDateString();
   
        curr_index--;
        r++;
        updatecurrentchart(myChart, data, curr_index, r);
        update_crime_stats(data, curr_index);
        x[2].innerHTML = '<i class="fa-solid fa-circle"></i> Live';
      }

      x[1].onclick = ()=>{
        clearInterval(tg);
        
        time =  new Date(set_date.innerHTML+" "+set_time.innerHTML);
        time.setHours(time.getHours()+1);
        time.setMinutes(0);
        time.setSeconds(0);
        set_time.innerHTML = time.toLocaleTimeString();
        set_date.innerHTML = time.toDateString();

        curr_index++;
        r--;
        updatecurrentchart(myChart, data, curr_index, r);
        update_crime_stats(data, curr_index);
        x[2].innerHTML = '<i class="fa-solid fa-circle"></i> Live';
      }

      x[2].onclick = ()=>{
        
        clearInterval(tg);
        tg = setInterval(start_timer, 1000);
        r=0;
        curr_index = `${new Date().toLocaleDateString().split('/').reverse().join('-')} ${hr}:00:00`;
        curr_index = data.dates.indexOf(curr_index);

        updatecurrentchart(myChart, data, curr_index, r);
        update_crime_stats(data, curr_index);

        x[2].innerHTML = '<i class="fa-solid fa-circle fa-fade" style="color: #ff0000;"></i> Live';
      }
}

function updatecurrentchart(myChart, data, index, r){

var max = data.dates[index+3];
var min = data.dates[index-3];

var max_ht = Math.max(...data.predictions.slice(index-3, index+4))+10;

const u_data = {
  labels: data.dates, // The labels for the X axis
  datasets: [
  {
    data: data.predictions, // The data for the dataset
    // fill: false, // Whether to fill the area under the line
    borderColor: "green", // The color of the line
    backgroundColor: data.predictions.map((value, i) => 
      (i === index+r) ? 'rgba(255, 94, 0, 0.5)' : 'rgba(54, 162, 235, 0.2)'
    ), // The color of the bars
   
  }]
}
const options = {
  responsive: true, // Whether to resize the chart according to the container size
    legend: {
      display: false
    },
  tooltips:{
      mode: 'index'
  },

  scales: {
        xAxes: [{
          gridLines: {
            display: false // Hide X-axis grid lines
        },
          ticks: {
            min: min,
            max: max,
            display: false
         
          },
        }],

        yAxes: [{
          gridLines: {
            display: false // Hide X-axis grid lines
          },
          ticks: {
            padding: 15,
            display: true,
            beginAtZero: false, // Whether to start the Y axis at zero
            min: 0,
            max: max_ht - max_ht%10,
          }
          }],
       
        }
}


myChart.data = u_data;
myChart.options = options;
myChart.update();

}

function update_crime_stats(data, index){

  function perc_change(t){

    var curr_val = data.predictions[index];
    var ft_val = data.predictions[index+t];
    return Math.round(((ft_val - curr_val)/curr_val) * 100);

  }

  function crime_rates(f){
  
    var sum=0, k=0;
    if(f=='d'){
     data.dates.forEach((e,i) => {
       if(new Date(data.dates[index]).toLocaleDateString() == new Date(e).toLocaleDateString())
        { 
          sum += data.predictions[i];
          k++;
        }
     })
    }
     
    return (sum/24).toFixed(1);
    
  }
  document.querySelector("#prediction-graph > div:nth-child(7) > div:nth-child(1)").innerHTML = `<div>Daily crime rate per hour: ${crime_rates('d')}</div>`;
  
  function set_color(val){
    var color;
    var dir;
    if (val < 0)
     { color = '#17a303'; 
       dir = 'down';
     }
    else if(val > 0)
     { color='#fa0707'; 
      dir = 'up';
     }
    
    return `<span style="color:${color}"><i class="fa-solid fa-${dir}-long"></i> `+Math.abs(val)+'%</span>';
  }
 
  var arr = [perc_change(1), perc_change(2), perc_change(3)];
  var max_3h = Math.max(... arr);
  var i = arr.indexOf(max_3h);
  var max_3h = set_color(max_3h);
  var max_6h = set_color()
  var per_12h = set_color(perc_change(12));
  var per_24h = set_color(perc_change(24));
  var per_week = set_color(perc_change(24*7));
  
  document.querySelector("#prediction-graph > div:nth-child(7) > div:nth-child(2)").innerHTML = `<div>${i+1}h</div><div>${max_3h}</div><div>12h</div><div>${per_12h}</div><div>24h</div><div>${per_24h}</div><div>1w</div><div>${per_week}</div>`;
  

}



function inputstatsdata(crimes, counts, perc)
{
  var e = document.querySelector('#statsdata1');
  
  var str = `<table><tr><th>Crime Type</th><th>No. of crimes</th><th>Percentage</th></tr>`;
  var j=0;
  crimes.forEach((e) => {
   str = str + `<tr><td>${e}</td><td>${counts[j]}</td><td>${perc[j]} %</td></tr>`;
   j++;
  })
  str = str + '</table>';
  e.innerHTML = str;
}

function displaystats(){
   var y = document.querySelector('#hide');
   y.style.display = 'block';

   y.onclick = ()=>{
    
     if(y.innerHTML=='<i class="fa-solid fa-angles-left" style="color: #a4a5a8;" aria-hidden="true"></i>')
     {
      y.innerHTML = '<i class="fa-solid fa-angles-right fa-shake" style="color: #a4a5a8;"></i>';
      minimizestats();
     }
     else{
      y.innerHTML = '<i class="fa-solid fa-angles-left" style="color: #a4a5a8;"></i>';
      maximizestats();
     }
   }
}
var g;
function maximizestats(){
  var sd = document.querySelector('#sidebar');
   sd.style.overflow = 'visible';
    sd.style.width = '600px';
    st.style.opacity = '1';
    graph.style.opacity = '1';
    clearTimeout(g);
    document.getElementById('map').style.cssText = "width:80%;right: 0px;opacity: 1";

  }

function minimizestats(){
  
  var sd = document.querySelector('#sidebar');
  sd.style.width = '0px';
  st.style.opacity = '0';
  graph.style.opacity = '0';
  
  document.getElementById('map').style.cssText = "width:100%; right: 0px; opacity: 1";
  g = setTimeout(()=>{
    sd.style.overflow = 'hidden';
   }, 700);

   
}
async function statistics(z, data)
{
  var sd = document.querySelector('#sidebar');
  sd.style.display = 'block';
  sd.style.opacity = '1';
  $('#myBarChart').replaceWith('<canvas id="myBarChart"></canvas>');
  $('#myPieChart').replaceWith('<canvas id="myPieChart"></canvas>');
  console.log(data)
   var crimes = Object.keys(data['counts']);
   var count = Object.values(data['counts']);

   count.forEach((j, k) => {                              //   sort the crime types according to crime counts
    const arr = count.slice(-(count.length-k));
    const max = Math.max(...arr);
    const i = count.lastIndexOf(max);
    [count[k], count[i]] = [count[i], count[k]];
    [crimes[k], crimes[i]] = [crimes[i], crimes[k]];
   });
   
   var set_clr = [];
   var map_clr = ['match', ['get', 'ofns_desc']];
   var k = 0;
   const max = Math.max(...count);
   var sum = 0;
    count.forEach((e)=>{
      sum = sum+e;
    });

   var perc = []
   count.forEach(e => { 
      const alpha = e / max;
      const p = e / sum;
      map_clr.push(crimes[k]);
      set_clr.push(`rgba(10, 146, 174, ${alpha})`);
      map_clr.push(set_clr[k]);
      perc.push(Math.round(p*100*100)/100);
      k++;
    })
    var k =0
    perc.forEach((e)=>{
       k = k+e;
    })
    console.log(k)
    map_clr.push('rgba(0, 0, 0, 0)');
    // console.log(map_clr)
    
   inputstatsdata(crimes, count, perc);


   const d1 = {
      labels: crimes,
      datasets: [{
        label: `Number of Crimes (${z[i].innerHTML})`,
        data: count,
        backgroundColor: set_clr,
        borderColor: 'rgba(75, 192, 192, 1)', // Border color
        borderWidth: 1, // Border width

      }],
  
    };
    const options = {
      scales: {
          xAxes: [{
              ticks: {
                  display: false,
              }
          }]
      },
      onClick: function (event, activeElements, chart) {
        // Example: Log the active elements to the console
      try{
        console.log('Active elements:',activeElements[0]);
        var filterdata = ['match',
            ['get', 'ofns_desc'],
            activeElements[0]._view.label, true, 
            false];
        map.setPaintProperty('crimes-point', 'circle-color', map_clr);
        map.setLayerZoomRange('crimes-point', 0, 20);
        map.setFilter('crimes-point', filterdata);

      }
      catch(error){
        
      }
       }
  };
  const bctx = document.getElementById('myBarChart').getContext('2d');
const myBarChart = new Chart(bctx, {
  type: 'bar',
  data: d1,
  options: options
});

const d2 = {
  labels: crimes,
  datasets: [{
    label: `Number of Crimes (${z[i].innerHTML})`,
    data: perc,
    backgroundColor: set_clr,
    borderColor: 'rgba(75, 192, 192, 1)', // Border color
    borderWidth: 1, // Border width

  }],

};

const pctx =  document.getElementById('myPieChart').getContext('2d');
const myPieChart = new Chart(pctx, {
  type: 'doughnut',
  data: d2,
  options: {
    cutout: '50%',
    plugins: {
      legend: false, // Hide the legend
      tooltip: false, // Disable tooltips
  },
  tooltips: {
    callbacks: {
      label: function(tooltipItem, data) {
        let label = data.labels[tooltipItem.index] || '';
        if (label) {
          label += ': ';
        }
        label += data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%';
        return label;
      }
    }
  }
}});


}

