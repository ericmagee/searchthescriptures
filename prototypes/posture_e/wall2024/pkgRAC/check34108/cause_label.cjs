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
const D='/mnt/project-files/wall2024/staged_w4/check34108_s108/';const r='34108',F=getF(r);
// cause of NOT CONFIRMED (form) on the two X replies: the same line with only the round labels changed, through the live s108 Record
for(const f of fs.readdirSync(D).filter(x=>/_X_.*_reply\.json$/.test(x)).sort()){const t0=JSON.parse(fs.readFileSync(D+f,'utf8')).content;
 for(const [nm,t] of [['as sent',t0],['labels [3] and [4] rewritten [CR3] and [CR4], nothing else',t0.replace('EARLIER [3]','EARLIER [CR3]').replace('CLOSING [4]','CLOSING [CR4]')],['labels rewritten [round 3] and [round 4]',t0.replace('EARLIER [3]','EARLIER [round 3]').replace('CLOSING [4]','CLOSING [round 4]')]]){
 const B=run(LIVE,r,'Close Enforcer Build',BO(r,F));const R=run(LIVE,r,'Close Enforcer Record',{'Final Output':[J(F)],'Regrade Load':null,'Close Enforcer Build':B,'Close Enforcer Call deepseek':B.map(b=>rep(b.json.side==='DEFENDER'?t:'CLOSE-CONTRADICTION: NONE'))},'Close Enforcer Call deepseek')[0].json;
 console.log(f+' | '+nm+' | confirmed: '+JSON.stringify(R.cec.confirmed.map(c=>c.id+' L'+c.link))+' | rows: '+R.cec.rows.map(x=>x.answer+' / '+x.status+(x.note?' ('+x.note.slice(0,120)+')':'')).join('; '));}}
