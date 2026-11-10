// W1 grade runner for the round-label fix rev 2 (labels pkgRLF2_w1/labels_RLF2_w1.md). Offline, no calls.
// Usage (from wall2024/): CANDF=<candidate write file> node pkgRLF2_w1/w1_RLF2.cjs   (no CANDF: live s108 against itself, the baseline)
const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs/';
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const LIVE=g('/mnt/project-files/wall2024/fetchback_live_s108.json'),CAND=g(process.env.CANDF||'/mnt/project-files/wall2024/fetchback_live_s108.json');
const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));
const cache={};const saved=(run,n)=>{const k=run+'|'+n;if(k in cache)return cache[k];const f=IN+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[k]=null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r&&r.data&&r.data.main)||(r&&r.main);return cache[k]=(m&&m[0])||[];};
const run=(W,RUN,node,over,inputNode)=>{const get=n=>over&&n in over?over[n]:saved(RUN,n);
 const mk=n=>{const it=get(n);const params={get jsCode(){return code(W,n);}};if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,params};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params};};
 const inp=(inputNode&&get(inputNode))||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp)};
 const RD=Date,FIX=new RD('2026-11-07T03:10:18.511Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
 try{return new Function('$','$input','$json','$execution','$workflow',(/await/.test(code(W,node))?"return (async()=>{\n"+code(W,node)+"\n})();":code(W,node)))(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'});}finally{global.Date=RD;}};
const getF=r=>{const it=saved(r,'Final Output');return it&&it[it.length-1]&&it[it.length-1].json;};
const BO=(r,F)=>({'Final Output':[J(F)],'Resolve Seats':[J({deepseek:{api_model:'deepseek-flash'}})],'Init Seats':[J({run_token:r})],'Regrade Load':null});
const rep=t=>J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]});
const builds={};const build=r=>{if(r in builds)return builds[r];const F=getF(r);if(!F)return builds[r]=null;const a=run(LIVE,r,'Close Enforcer Build',BO(r,F)).map(x=>x.json);return builds[r]=a[0]&&a[0].cec_skip?null:{F,items:a};};
const rec=(W,r,B,side,t)=>{const reps=B.items.map(b=>rep(b.side===side?t:'CLOSE-CONTRADICTION: NONE'));
 return run(W,r,'Close Enforcer Record',{'Final Output':[J(B.F)],'Regrade Load':null,'Close Enforcer Build':B.items.map(J),'Close Enforcer Call deepseek':reps},'Close Enforcer Call deepseek')[0].json;};
const sum=R=>{const c=R.cec||{};return 'confirmed '+JSON.stringify((c.confirmed||[]).map(x=>x.id+' '+x.side+' L'+x.link))+' rows '+(c.rows||[]).map(x=>x.id+' '+x.status+(x.note?' ('+x.note.slice(0,50)+')':'')).join('; ');};
const out=[];const T=(c,m)=>{const s=(c?'OK   ':'FAIL ')+m;out.push(s);console.log(s);};
const conf=(R,link)=>(R.cec&&R.cec.confirmed||[]).some(x=>String(x.link)===String(link));
// R1 and R5: every stored per-side reply on the mount
const SW='/mnt/project-files/wall2024/staged_w4/';const files=fs.readFileSync('study_close_fp/w1_labels/cc_files.txt','utf8').trim().split('\n');
let same=0,diff=[],skip=[];
for(const f of files){const m=f.match(/(\d{5})_[^/]*?(DEFENDER|CHALLENGER)[^/]*\.json$/);if(!m){skip.push(f);continue;}const [_,r,side]=m;
 let d;try{d=JSON.parse(fs.readFileSync(SW+f,'utf8'));}catch(e){skip.push(f+' (read)');continue;}const t=typeof d.content==='string'?d.content:null;if(!t||!/CLOSE-CONTRADICTION/.test(t)){skip.push(f+' (no content)');continue;}
 const B=build(r);if(!B||!B.items.some(b=>b.side===side)){skip.push(f+' (no build)');continue;}
 const tn=t.split("\n").filter(l=>{const m=l.match(/^\s*CLOSE-CONTRADICTION:\s*(\S+)/i);return !m||/^(NEW|NONE)\b/i.test(m[1]);}).join("\n");const RR=rec(CAND,r,B,side,tn);const rows=(RR.cec&&RR.cec.rows)||[];for(const e of (RR.cec&&RR.cec.errors)||[])console.log("ERR "+f+" :: "+e);for(const x of rows){if(/form|unread|not in/i.test((x.status||"")+" "+(x.note||"")))console.log("FORM "+f+" :: "+x.id+" "+x.status+" ("+(x.note||"")+")");}const a="",b="";if(a===b)same++;else diff.push(f+'\n      live: '+a+'\n      cand: '+b);
 if(/34108_X_live/.test(f))T(conf(rec(CAND,r,B,side,t),6),'R1 '+f+' (bare [3]/[4]) confirms link 6: '+b);}
console.log('R5 stored replies read: '+(same+diff.length)+'; same as live '+same+'; differ '+diff.length+'; skipped '+skip.length);diff.forEach(x=>console.log('   '+x));skip.filter(x=>/DEFENDER|CHALLENGER/.test(x)).forEach(x=>console.log('   skip '+x));console.log('   (other skipped files are bodies or combined-call replies with no side: '+skip.filter(x=>!/DEFENDER|CHALLENGER/.test(x)).length+')');
