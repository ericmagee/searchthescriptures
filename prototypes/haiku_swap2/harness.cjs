// Runs Init Seats (new) with a body that seats haiku as challenger; n8n globals mocked.
const fs=require('fs');const code=fs.readFileSync('new/Init Seats.js','utf8');
const body={topic:'Did Christ have a biological father?',defender:{engine:'claude',profile:'plain'},challenger:{engine:'haiku',profile:'oracle'}};
const item={json:{body}};
const $input={first:()=>item,all:()=>[item],item};
const $=()=>({first:()=>item,all:()=>[item],item});
const $execution={id:'99999',customData:{set(){},get(){}}};
const $node={name:'Init Seats'};
const f=new Function('$','$input','$execution','$node','$json','$now','return (async()=>{'+code+'})()');
f($,$input,$execution,$node,item.json,new Date()).then(r=>{const j=(r&&r[0]&&r[0].json)||r;console.log(JSON.stringify({challenger:j.challenger,defender:j.defender,panel:j.panel_order,alt:j.alt_order,err:j.error},null,0).slice(0,800));}).catch(e=>console.log('ERR',e.message.slice(0,300)));
