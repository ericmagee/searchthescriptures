// Replay Judge Enforcer Build (pkgEP vs pkgEF) on a live run's saved inputs in /mnt/project-files/wall2024/inputs/<run>_<Node>.json. Run from wall2024/.
const fs=require('fs');const run=process.argv[2];
const I=n=>{const f='/mnt/project-files/wall2024/inputs/'+run+'_'+n+'.json';if(!fs.existsSync(f))return null;const j=JSON.parse(fs.readFileSync(f,'utf8'));return j[0].main[0].map(x=>x.json);};
const nodes={'Panel Cure Check':I('Panel_Cure_Check'),'Init Seats':I('Init_Seats')||[{run_token:'r'}],'Resolve Seats':[{deepseek:{api_model:'stub'}}]};
for(const k of [1,2,3]){const v=I('Panel_Cure_Normalize_'+k);if(v)nodes['Panel Cure Normalize '+k]=v;}
const go=pkg=>{const src=fs.readFileSync(pkg+'/patched/Judge_Enforcer_Build.js','utf8');const $=n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
 const o=new Function('$','$input','$json',src)($,{first:()=>({json:{}}),all:()=>[],item:{json:{}}},{});return {code:o[0].json.code_rows||[],ids:o.flatMap(x=>x.json.ids||[]),calls:o.length,body:o.map(x=>x.json.body?x.json.body.messages[1].content:'').join('\n')};};
const a=go('pkgEP'),b=go('pkgEF');
const k=x=>x.rule+' '+x.seat+' '+x.item;const ka=a.ids.map(k),kb=b.ids.map(k);
console.log('calls',a.calls,'->',b.calls,'| items',ka.length,'->',kb.length,'| body chars',a.body.length,'->',b.body.length);
console.log('removed',ka.filter(x=>!kb.includes(x)));console.log('added',kb.filter(x=>!ka.includes(x)));
console.log('code E-RES rows',a.code.filter(c=>c.rule==='E-RES').length,'->',b.code.filter(c=>c.rule==='E-RES').length);
console.log('E-COL notes',(b.body.match(/The FAILS words are found in/g)||[]).length,'| link-state blocks',(b.body.match(/THIS IS A LINK-STATE LINE/g)||[]).length,'| UNPROVEN labels',(b.body.match(/UNPROVEN press: no answering burden/g)||[]).length);
