// Offline test of ACXB vs baseline s120 on Panel Build / Build Independent Verdict. stdout only.
const fs=require('fs'),crypto=require('crypto');const run=require('../pkgKSR/run_node.cjs');const D='/mnt/project-files/wall2024/';
const J=f=>JSON.parse(fs.readFileSync(D+f,'utf8'));
console.log('sha256 candidate:',crypto.createHash('sha256').update(fs.readFileSync(D+'parent_s120_ACXB2.json')).digest('hex'));
const B=J('fetchback_live_s120.json'),C=J('parent_s120_ACXB2.json');
const PH=' (this note by itself breaks no link; only a pair listed under CONFIRMED CLOSING CONTRADICTIONS is confirmed)';
const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const NODES=['Panel Build','Build Independent Verdict'];
const find=o=>{if(o&&typeof o==='object'){if(o.runData)return o.runData;for(const k in o){const r=find(o[k]);if(r)return r;}}return null;};
const cl=x=>JSON.parse(JSON.stringify(x));
const sk=o=>Array.isArray(o)?o.map(sk):(o&&typeof o==='object')?Object.fromEntries(Object.keys(o).sort().map(k=>[k,sk(o[k])])):o;
const ss=o=>JSON.stringify(sk(o));
function strs(o,a){if(typeof o==='string')a.push(o);else if(o&&typeof o==='object')for(const k in o)strs(o[k],a);return a;}
const cnt=(s,p)=>s.split(p).length-1;
function B0(){
 console.log('\n## B0');
 const nb=Object.fromEntries(B.nodes.map(n=>[n.name,n])),nc=Object.fromEntries(C.nodes.map(n=>[n.name,n]));
 console.log('node counts',B.nodes.length,C.nodes.length,'name sets equal',ss(Object.keys(nb).sort())===ss(Object.keys(nc).sort()));
 const diff=[];for(const n in nb){if(!nc[n]){diff.push([n,'missing in cand']);continue;}if(ss(nb[n].parameters)!==ss(nc[n].parameters))diff.push([n,'params differ']);}
 for(const n in nc)if(!nb[n])diff.push([n,'added in cand']);
 console.log('differing nodes:',JSON.stringify(diff));
 console.log('connections equal:',ss(B.connections)===ss(C.connections));
 const jd=[];
 for(const [n] of diff){const a=nb[n]?.parameters,b=nc[n]?.parameters;const ks=new Set([...Object.keys(a||{}),...Object.keys(b||{})]);
   const dk=[...ks].filter(k=>ss(a[k])!==ss(b[k]));console.log(' ',n,'differing param keys:',dk.join(','),'| jsCode len',a.jsCode.length,'->',b.jsCode.length,'delta',b.jsCode.length-a.jsCode.length);
   // non-jsCode other keys equal?
   // diff region
   let i=0;while(a.jsCode[i]===b.jsCode[i])i++;let ea=a.jsCode.length,eb=b.jsCode.length;while(ea>i&&eb>i&&a.jsCode[ea-1]===b.jsCode[eb-1]){ea--;eb--;}
   jd.push({n,i,removed:a.jsCode.slice(i,ea),added:b.jsCode.slice(i,eb),ctxL:b.jsCode.slice(Math.max(0,i-150),i),ctxR:b.jsCode.slice(eb,eb+150)});}
 jd.forEach((d,k)=>{console.log('\n['+d.n+'] diff at offset',d.i,'removed',JSON.stringify(d.removed),'\n ADDED:',JSON.stringify(d.added),'\n context-left (150):',JSON.stringify(d.ctxL),'\n context-right (150):',JSON.stringify(d.ctxR));});
 if(jd.length==2)console.log('\nchange identical in both nodes (added text, removed text, left ctx, right ctx):',jd[0].added===jd[1].added&&jd[0].removed===jd[1].removed&&jd[0].ctxL===jd[1].ctxL&&jd[0].ctxR===jd[1].ctxR,'; added==PH:',jd.map(d=>d.added===PH));
}
const MASK=/^(transcript_chars|.*_chars|.*len(gth)?)$/i;
function strip(o){return JSON.parse(JSON.stringify(o).split(PH).join(''));}
function firstDiff(a,b){let i=0;while(a[i]===b[i]&&i<a.length)i++;return i;}
async function both(rd,label){
 console.log('\n## '+label);const R={};
 for(const n of NODES){
  if(!rd[n]){console.log(' '+n+': NOT RUN (node absent in runData)');continue;}
  let ob,oc;try{ob=await run(code(B,n),n,cl(rd));oc=await run(code(C,n),n,cl(rd));}catch(e){console.log(' '+n+': THROW',e.message);continue;}
  if(ob.err||oc.err){console.log(' '+n+': err base',ob.err,'cand',oc.err);continue;}
  const sb=strs(ob,[]),sc=strs(oc,[]);
  const nb=sb.filter(s=>s.includes('[ANTI-CHEAT CHECK')),nc=sc.filter(s=>s.includes('[ANTI-CHEAT CHECK'));
  const allb=sb.join('\n'),allc=sc.join('\n');
  const strictEq=JSON.stringify(ob)===JSON.stringify(oc);
  let stripped=JSON.stringify(strip(oc));let eq=stripped===JSON.stringify(ob);let masked=[];
  if(!eq){ // try masking numeric length fields
    const mk=(o,path,acc)=>{if(Array.isArray(o))o.forEach((v,i)=>mk(v,path+'['+i+']',acc));else if(o&&typeof o==='object')for(const k in o){if(typeof o[k]==='number'&&MASK.test(k))acc.push([path+'.'+k,o[k]]);else mk(o[k],path+'.'+k,acc);}return acc;};
    const sbs=strip(oc);const A=mk(ob,'',[]),Bc=mk(sbs,'',[]);
    const m=(o)=>{const c=cl(o);const w=(x)=>{if(Array.isArray(x))x.forEach(w);else if(x&&typeof x==='object')for(const k in x){if(typeof x[k]==='number'&&MASK.test(k))x[k]=0;else w(x[k]);}};w(c);return c;};
    const diffs=A.map((a,i)=>[a[0],a[1],Bc[i]&&Bc[i][1]]).filter(t=>t[1]!==t[2]);masked=diffs;
    eq=JSON.stringify(m(sbs))===JSON.stringify(m(ob));
    if(!eq){const x=JSON.stringify(sbs),y=JSON.stringify(ob),i=firstDiff(x,y);console.log('   FIRST DIFF at',i,'cand-stripped:',JSON.stringify(x.slice(i-60,i+100)),'base:',JSON.stringify(y.slice(i-60,i+100)));}
  }
  // phrase outside note
  let outside=0;for(const s of sc){const t=s.replace(/\[ANTI-CHEAT CHECK[\s\S]*?against the verse\.\]/g,'');outside+=cnt(t,PH);}
  console.log(' '+n+'\n   base notes='+cnt(allb,'[ANTI-CHEAT CHECK')+' phrase='+cnt(allb,PH)+' | prompts-with-note='+nb.length+'\n   cand notes='+cnt(allc,'[ANTI-CHEAT CHECK')+' phrase='+cnt(allc,PH)+' | prompts-with-note='+nc.length+' | per-prompt notes '+nc.map(s=>cnt(s,'[ANTI-CHEAT CHECK')+'/'+cnt(s,PH)).join(',')+'\n   phrase outside an anti-cheat note (cand)='+outside+'\n   raw equal='+strictEq+' ; equal after phrase removed (JSON.stringify)='+(JSON.stringify(strip(oc))===JSON.stringify(ob))+' ; equal after masking numeric length fields too='+eq+(masked.length?' masked: '+JSON.stringify(masked):' masked: none'));
  {const CB='[CONFIRMED CLOSING CONTRADICTIONS';const ps=sc;ps.forEach((p,i)=>{if(!p.includes('[ANTI-CHEAT CHECK'))return;const hasB=p.includes(CB);const firstNote=p.indexOf('[ANTI-CHEAT CHECK'),lastNote=p.lastIndexOf('[ANTI-CHEAT CHECK');console.log('   C3/C4 prompt#'+i+' len '+p.length+' notes='+cnt(p,'[ANTI-CHEAT CHECK')+' CCCblock='+cnt(p,CB)+' firstNote@'+firstNote+' lastNote@'+lastNote+' CCC@'+p.indexOf(CB)+(hasB?'':' <<< NOTE_WITHOUT_BLOCK'));if(!hasB){global.NB=global.NB||[];global.NB.push([label,n,i,p]);}});}
  R[n]={ob,oc};
 }
 return R;}
(async()=>{
 B0();process.on('exit',()=>{console.log('\n## C4 summary');(global.NB||[]).forEach(x=>console.log(x[0],'|',x[1],'| prompt',x[2]));if(global.NB&&global.NB[0]){const p=global.NB[0][3];const m=p.match(/\[ANTI-CHEAT CHECK[\s\S]*?against the verse\.\]/);console.log('VERBATIM NOTE ('+global.NB[0].slice(0,3).join(' | ')+'):\n'+(m?m[0]:'(regex no match)'));}});
 const RD=find(J('ex34852_full.json'));
 console.log('\n# B1');const R=await both(RD,'B1 ex34852 stored');
 console.log('\n# B3');
 const last=(rd,n)=>rd[n][rd[n].length-1].data.main;
 const m=cl(RD);const a=last(m,'Anticheat Record')[0][0].json.acx;console.log('acx.reversed keys',Object.keys(a.reversed),'D/C lens before',a.reversed.D&&a.reversed.D.length,a.reversed.C&&a.reversed.C.length);a.reversed.D=[];a.reversed.C=[];
 await both(m,'B3a Anticheat Record reversed D=[] and C=[]');
 const m2=cl(RD);delete m2['Anticheat Record'];await both(m2,'B3b Anticheat Record key deleted');
 console.log('\n# B4');
 for(const f of ['ex34726_full.json','ex34780_full.json']){const rd=find(J(f));console.log('nodes present:',NODES.concat(['Anticheat Record']).map(n=>n+'='+!!rd[n]).join(' '));await both(rd,'B4 '+f);}
 console.log('\n# B5 (candidate, ex34852)');
 for(const n of NODES){
  const oc=R[n].oc;const S=strs(oc,[]);const p=S.find(s=>s.includes('[ANTI-CHEAT CHECK'));
  console.log('\n=== '+n+': prompt length',p.length);
  const re=/\[ANTI-CHEAT CHECK[\s\S]*?against the verse\.\]/g;let mm;const hits=[];
  while((mm=re.exec(p))){console.log('--- ANTI-CHEAT NOTE at offset',mm.index,'(len '+mm[0].length+')\n'+mm[0]);hits.push(mm.index);}
  const pats=['CONFIRMED CLOSING CONTRADICTION','CLOSING CONTRADICTION','close enforcer','BROKEN BY'];
  const seen=[];const out=[];
  for(const pt of pats){let i=-1;while((i=p.indexOf(pt,i+1))>=0){const s=Math.max(0,i-600),e=Math.min(p.length,i+pt.length+600);
    // dedupe by overlapping windows
    if(seen.some(([a,b])=>s<b&&e>a)){continue;}seen.push([s,e]);out.push({pt,i,s,e});}}
  out.sort((x,y)=>x.i-y.i);
  console.log('\n--- search hits (de-duplicated by overlapping 600-char window); total raw hits per pattern:',pats.map(pt=>pt+'='+cnt(p,pt)).join(', '));
  out.forEach(h=>console.log('\n>> pattern "'+h.pt+'" at offset',h.i,'(window',h.s+'-'+h.e+')\n'+p.slice(h.s,h.e)));
  console.log('\nfirst anti-cheat note offset:',hits[0],'; first CONFIRMED CLOSING CONTRADICTION offset:',p.indexOf('CONFIRMED CLOSING CONTRADICTION'),'; first of any pattern:',out.length?out[0].i+' ('+out[0].pt+')':'none');
 }
})();
