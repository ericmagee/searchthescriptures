const fs=require('fs'),zlib=require('zlib');const W=JSON.parse(fs.readFileSync(process.env.TF,'utf8'));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const LIB=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),MAP=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
const rb=(m,L)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');const src=rb(MAP['Gate Build'],LIB);
const $=()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[]});
const f=new Function('$','$input','items','$json','$node','$execution','$workflow','require','return gateVnv2024;\n'+src)($,null,[],{},{},{},{},require);
const P=(a,b)=>"CHALLENGE STANDING: x -- "+a+"\nCHALLENGER CONCEDED LINKS: 0 -- "+b;
const C=[
['MUST plural and',P('Premises 4 and 5 are VOID and enter neither count.','Premise 5 spared, not VOID.'),1],
['MUST plural comma list',P('Premises 1, 2 and 5 are VOID.','Premise 2 is not VOID.'),1],
['range not VOID vs single VOID',P('Premise 3 is VOID.','Premises 1 through 6 are not VOID.'),1],
['range all VOID none not',P('Premises 1 to 3 are VOID.','Premise 4 is not VOID.'),0],
['"None of Premises 1 through 6 are VOID"',P('Premise 2 is VOID.','None of Premises 1 through 6 are VOID.'),'?'],
['plural spared no VOID',P('Premise 2 is VOID.','Premises 1 to 6 are supported.'),0],
['singular still',P('Premise 1 is VOID.','Premise 1 is not VOID.'),1],
['RULING card vs plural',"RULING -- challenger premise 2 -- VOID\nCHALLENGER CONCEDED LINKS: 0 -- Premises 2 and 3 are not VOID.",1],
];for(const [nm,t,w] of C){const r=f(t);console.log((w==='?'?'?? ':(r.length>0)===!!w?'ok ':'BAD'),nm,'|',r.map(x=>x.key).join(','));}
const J=JSON.parse(zlib.gunzipSync(fs.readFileSync(process.env.JG)));const jt=t=>{const i=String(t).indexOf('\n[AUDIT');return i>0?t.slice(0,i):t;};let h=0;for(const j of J){const r=f(jt(j.verdict_raw));if(r.length){h++;console.log(' hit',j.id,j.judge_seat,r.map(x=>x.key).join(','));}}console.log('judgments',J.length,'hits',h);
