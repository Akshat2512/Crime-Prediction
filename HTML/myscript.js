
const owner = 'Akshat2512';
const repo = 'Crime-Prediction';
const token = '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'; // 'Authorization' : 'Bearer ' + token,
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
var data = await response.text();
console.log(data);
}