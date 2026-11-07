// pkgCSP tests. Run from wall2024/: node pkgCSP/test_CSP.cjs
// A: the real Alternate Merge and Build Save Body nodes, base vs patched, on the saved inputs of 33218 (and 33222 once saved; the only stored run whose Alternate Merge inputs are
//    saved): the only change is the added conceded_split key; it agrees with the stored count; 33218's split is the hand-read one.
// B: the library over the 201 stored panel judgments of pkgCLR/data/count_chunks.json: totals, and every row where granted+unexhibited differs
//    from the stated count is listed (record only).
const fs=require('fs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');let ok=0,bad=0;
const T=(n,c,x)=>{console.log((c?'OK   ':'FAIL ')+n);if(x)console.log('     '+x);c?ok++:bad++;};
function harness(RUN){const cache={};const saved=n=>{if(n in cache)return cache[n];const f=D+RUN+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[n]=null;const d=JSON.parse(rd(f));const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;return cache[n]=(m&&m[0])||[];};
 const cl=x=>JSON.parse(JSON.stringify(x));const mk=n=>{const it=saved(n);if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,get item(){return no();},params:{}};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},params:{}};};
 return (code,inputNode)=>{const inp=saved(inputNode)||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
  const RD=Date,FIX=new RD('2026-11-07T02:00:00Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
  try{return new Function('$','$input','$json','$execution','$workflow',code)(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'});}finally{global.Date=RD;}};}
const inputOf={'Alternate Merge':'Alt Gate Record','Build Save Body':null};
const LIVE=JSON.parse(rd('/mnt/project-files/wall2024/fetchback_live_s12.json'));const con=LIVE.connections;
const feeder=n=>Object.entries(con).filter(([k,v])=>JSON.stringify(v).includes('"'+n+'"')).map(([k])=>k);
const strip=o=>JSON.parse(JSON.stringify(o,(k,v)=>k==='conceded_split'?undefined:v));
const bodyObjs=j=>(j.bodies||[]).map(x=>typeof x==='string'?JSON.parse(x):x);
const HAND={'33218':{gemini:{d:[0,1,['premise 5']]},chatgpt:{d:[0,2,['premise 4','premise 5']]},sol:{d:[0,0,[]]}}};
for(const RUN of ['33218'].concat(fs.existsSync(D+'33222_Alternate_Merge_Seat.json')?['33222']:[])){const H=harness(RUN);
 // Alternate Merge
 const fa=feeder('Alternate Merge')[0];const b=H(rd('pkgCSP/base/Alternate_Merge.js'),fa),p=H(rd('pkgCSP/patched/Alternate_Merge.js'),fa);
 const bj=b[0].json,pj=p[0].json;const stored=JSON.parse(rd(D+RUN+'_Alternate_Merge.json'));const sj=((Array.isArray(stored)?stored[0]:stored).data||stored).main?.[0]?.[0]?.json;
 T(RUN+' Alternate Merge: base reproduces the saved output (bodies)',JSON.stringify(bodyObjs(bj))===JSON.stringify(bodyObjs(sj)));
 T(RUN+' Alternate Merge: patched equals base except conceded_split',JSON.stringify(strip({...pj,bodies:bodyObjs(pj)}))===JSON.stringify(strip({...bj,bodies:bodyObjs(bj)})));
 const PB=bodyObjs(pj);
 T(RUN+' Alternate Merge: every body carries conceded_split, stored values copied, no reader error',PB.length>0&&PB.every(o=>o.payload.conceded_split&&!o.payload.conceded_split.error&&o.payload.conceded_split.defender.stored===o.payload.conceded_links&&o.payload.conceded_split.challenger.stored===o.payload.challenger_conceded_links),
  PB.map(o=>o.payload.judge_seat+' D '+JSON.stringify(o.payload.conceded_split.defender)+' C '+JSON.stringify(o.payload.conceded_split.challenger)).join('\n     '));
 T(RUN+' Alternate Merge: granted+unexhibited equals the stored count on every body',PB.every(o=>{const s=o.payload.conceded_split;return ['defender','challenger'].every(k=>s[k].stored==null||s[k].granted+s[k].unexhibited===s[k].stored);}));
 if(HAND[RUN])T(RUN+' the hand-read split (Wall 2701 and the stored lines): gemini 0 granted + premise 5; chatgpt 0 granted + premises 4, 5; sol 0',PB.every(o=>{const h=HAND[RUN][o.payload.judge_seat];if(!h)return true;const s=o.payload.conceded_split.defender;return s.granted===h.d[0]&&s.unexhibited===h.d[1]&&JSON.stringify(s.unexhibited_items)===JSON.stringify(h.d[2]);}));
 // Build Save Body
 const fs2=feeder('Build Save Body')[0];const b2=H(rd('pkgCSP/base/Build_Save_Body.js'),fs2),p2=H(rd('pkgCSP/patched/Build_Save_Body.js'),fs2);
 T(RUN+' Build Save Body: patched equals base except saveBody.conceded_split',JSON.stringify(strip(p2[0].json))===JSON.stringify(strip(b2[0].json)));
 const ss=p2[0].json.saveBody.conceded_split;T(RUN+' Build Save Body: the single judge split is read, no error',ss&&!ss.error&&ss.defender.stored===p2[0].json.conceded_links,JSON.stringify(ss));}
// the edits on the graded-ahead outputs compile and add only the key
T('the edits also apply on pkgSGA2 (Alternate Merge) and pkgPMR (Build Save Body) outputs',JSON.parse(rd('pkgCSP/plan_CSP.json')).also_on.length===2);
// ---- B: the library over 201 stored judgments ----
const src=rd('pkgCSP/patched/Alternate_Merge.js');const i=src.indexOf('const __CSP=(()=>{');const j=src.indexOf('})();\n',src.indexOf('return (t,dc,cc)=>',i))+5;const CSP=new Function(src.slice(i,j)+';return __CSP;')();
const X=JSON.parse(rd('pkgCLR/data/count_chunks.json'));let n=0,st=0,g=0,u=0,un=0;const diff=[];
for(const v of X){const t=(v.chunks||[]).map(c=>String(c).replace(/\\n/g,'\n')).join('\n');const s=CSP(t,null,null);if(s.error){diff.push(v.run+' '+v.seat+' ERROR '+s.error);continue;}
 for(const k of ['defender','challenger']){const z=s[k];if(z.stated==null)continue;n++;st+=z.stated;g+=z.granted;u+=z.unexhibited;un+=z.unnamed;if(z.unnamed||z.granted+z.unexhibited>z.stated)diff.push(v.run.slice(5,10)+' '+v.seat+' '+k+' stated '+z.stated+' granted '+z.granted+' unexhibited '+z.unexhibited);}}
T('201 stored judgments: '+n+' count lines, stated total '+st+' = granted '+g+' + unexhibited '+u+' + not named '+un+'; reader errors 0',!diff.some(d=>/ERROR/.test(d)),'rows where the named items do not add to the stated count ('+diff.length+'): '+diff.slice(0,40).join('; '));
console.log(ok+' OK, '+bad+' FAIL');
