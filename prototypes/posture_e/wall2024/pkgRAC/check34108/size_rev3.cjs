process.chdir(__dirname+'/../..');const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs/';
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const LIVE=g('/mnt/project-files/wall2024/fetchback_live_s108.json'),CAND=g('pkgRAC/parent_s108_RAC.json');
const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));
const cache={};const saved=(run,n)=>{const k=run+'|'+n;if(k in cache)return cache[k];const f=IN+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[k]=null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r&&r.data&&r.data.main)||(r&&r.main);return cache[k]=(m&&m[0])||[];};
// run one node's code on a stored debate; over = node name -> items (or null for "not executed"); W gives params.jsCode of any node
const run=(W,RUN,node,over,inputNode)=>{const get=n=>over&&n in over?over[n]:saved(RUN,n);
 const mk=n=>{const it=get(n);const params={get jsCode(){return code(W,n);}};if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,params};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params};};
 const inp=(inputNode&&get(inputNode))||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp)};
 const RD=Date,FIX=new RD('2026-11-07T03:10:18.511Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
 try{return new Function('$','$input','$json','$execution','$workflow',(/await/.test(code(W,node))?"return (async()=>{\n"+code(W,node)+"\n})();":code(W,node)))(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'});}finally{global.Date=RD;}};
const getF=r=>{const it=saved(r,'Final Output');return it&&it[it.length-1]&&it[it.length-1].json;};
const BO=(r,F)=>({'Final Output':[J(F)],'Resolve Seats':[J({deepseek:{api_model:'deepseek-flash'}})],'Init Seats':[J({run_token:r})],'Regrade Load':null});
const rep=t=>J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]});
// rev 3 sizing: a pairs-only call per side that has a handed pair, beside the unchanged live search call
const runs=[...new Set(fs.readdirSync(IN).map(f=>(f.match(/^(\d+)_Final_Output\.json$/)||[])[1]).filter(Boolean))].sort();
const RK={CR1:'cr1',CR2:'cr2',CR3:'cr3',CR4:'cr4',DR1:'gr1',DR2:'gr2',DR3:'dr3',DR4:'dr4'};
let deb=0,debPair=0,sides=0,pairs=0,full=0,two=0,liveTot=0,calls=0,maxFull=0,maxTwo=0;
for(const r of runs){const F=getF(r);if(!F)continue;let B,BL;try{B=run(CAND,r,'Close Enforcer Build',BO(r,F));BL=run(LIVE,r,'Close Enforcer Build',BO(r,F));}catch(e){console.log('skip '+r+' '+e.message.slice(0,80));continue;}if(!B[0]||B[0].json.cec_skip)continue;deb++;
 for(const b of BL)if(b.json.body){liveTot+=JSON.stringify(b.json.body.messages).length;calls++;}
 let any=false;for(const b of B){const hp=(b.json.cands||[]).filter(c=>/^[AR]\d/.test(c.id));if(!hp.length)continue;any=true;sides++;pairs+=hp.length;
  const sys=b.json.body.messages[0].content.length,user=b.json.body.messages[1].content;const head=user.slice(0,user.indexOf('######## THE '));const own=(b.json.cands||[]).filter(c=>!/^[AR]\d/.test(c.id));
  // the instruction and candidate lines of the handed pairs only
  const lines=user.slice(user.indexOf('CANDIDATES ALREADY NAMED'),user.indexOf('######## THE ')).split('\n').filter(l=>/^[AR]\d+ -- /.test(l)).join('\n').length;
  const instr=user.indexOf('CANDIDATES ALREADY NAMED');const rounds=user.length-user.indexOf('######## THE ');
  const f=sys+instr+60+lines+rounds;full+=f;maxFull=Math.max(maxFull,f);
  const ks=[...new Set(hp.flatMap(c=>[c.earlier_round,c.closing_round]))];const t=sys+instr+60+lines+200+ks.reduce((a,k)=>a+String(F[RK[k]]||'').length+20,0);two+=t;maxTwo=Math.max(maxTwo,t);}
 if(any)debPair++;}
console.log('stored debates built: '+deb+'; live closing enforcer calls: '+calls+', characters sent '+liveTot+' (mean per debate '+Math.round(liveTot/deb)+')');
console.log('debates with a handed pair: '+debPair+'; sides with one: '+sides+'; pairs: '+pairs);
console.log('A1 pairs-only call with the side\'s four rounds: +'+sides+' calls, +'+full+' characters ('+(100*full/liveTot).toFixed(1)+'% of the live closing enforcer total; mean per debate '+Math.round(full/deb)+'; largest '+maxFull+')');
console.log('A2 pairs-only call with only the rounds the pairs name: +'+sides+' calls, +'+two+' characters ('+(100*two/liveTot).toFixed(1)+'%; mean per debate '+Math.round(two/deb)+'; largest '+maxTwo+')');
