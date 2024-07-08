
const owner = 'Akshat2512';
const repo = 'Crime-Prediction';
 // 'Authorization' : 'Bearer ' + token,
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/actions/workflows`;
var header = { 'Accept' : 'application/vnd.github.v3+json','Authorization' : 'Bearer ' + token,'X-GitHub-Api-Version' : '2022-11-28'};
document.querySelector('#btn1').onclick = async ()=>{



var response = await fetch(apiUrl, {
  method: 'GET',
//   headers: header
})
var data = await response.json();
console.log(data);
var workflowId = data.workflows[0].id

var response = await fetch(apiUrl+`/${workflowId}/dispatches`, {
    method: 'POST',
    headers: header,
    body: JSON.stringify({
      ref: 'master'
    })
  })
var data = await response.json() ;
var myOutput = data.outputs['my-output'];
console.log(myOutput); 

}