const fs=require('fs');
function node(f){const w=JSON.parse(fs.readFileSync(f));return w.nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;}
function run(code,F){const $=nm=>({first:()=>({json:nm==='Init Seats'?{run_token:F.t}:nm==='Resolve Seats'?{deepseek:{api_model:'ds'}}:F}),isExecuted:false});
 return new Function('$',code)($);}
const A=node('/mnt/project-files/wall2024/fetchback_live_s156.json'),B=node(''+(process.env.P||'parent_s156_CRB2.json')+'');
const Fs=JSON.parse(fs.readFileSync('F.json'));let tot=0,found=0,add=0,eq=0;const show=process.argv[2];
for(const F of Fs){const a=run(A,F),b=run(B,F);
 for(let i=0;i<b.length;i++){const ua=a[i].json.body?a[i].json.body.messages[1].content:'',ub=b[i].json.body?b[i].json.body.messages[1].content:'';
  const cs=b[i].json.cands||[];tot+=cs.length;const nb=(ub.match(/CLOSING BLOCK \(/g)||[]).length;found+=nb;add+=ub.length-ua.length;
  // rest equal when blocks and prompt sentence removed?
  const strip=u=>u.replace(/\n   CLOSING BLOCK(?: \(the closing sentence[^]*?|: as under [^\n]*)(?=\n[A-Z]\d+ -- |\n\n######## )/g,'').replace(/Read each candidate's closing sentence together[^\n]*\n/,'');
  if(strip(ub)===ua)eq++;else console.log('DIFF',F.t,b[i].json.side);
  console.log(F.t.slice(5,10),b[i].json.side,'cands',cs.length,'blocks',nb,'+chars',ub.length-ua.length);
  if(show&&F.t.includes(show)){const m=ub.match(/CANDIDATES ALREADY NAMED[^]*?########/);console.log(m&&m[0].slice(0,6000));}}}
console.log({cands:tot,blocks:found,added_chars:add,unchanged_rest:eq});
