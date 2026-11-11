// pkgNBR replay: Format Markdown and Build Save Body, base (argv[2]) vs NBR (argv[3]), on every stored export.
// Checks: every base line/flag kept in order; every added item contains an inner bracket; labels of added K-W flags.
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const un=p=>{let j=JSON.parse(fs.readFileSync(p));j=j.data||j;return j.workflow||j};const cd=(p,n)=>un(p).nodes.find(x=>x.name===n).parameters.jsCode;
const A=process.argv[2]||'/tmp/claude-0/cmx/rvf.json',B=process.argv[3]||'/tmp/claude-0/cmx/nbr.json';
const sub=(a,b)=>{let i=0,add=[];for(const y of b){if(i<a.length&&a[i]===y)i++;else add.push(y);}return i===a.length?add:null;};
const inner=s=>/AUDIT v\d+|EXTRACTOR v\d+/.test(s)&&/[^\[]\[[^\]\[\n]*\]/.test(s.replace(/^\[/,""));
(async()=>{const T={};for(const e of fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;
 for(const nm of ['Format Markdown','Build Save Body']){if(!rd[nm]){continue;}
  const a=await run(cd(A,nm),nm,rd),b=await run(cd(B,nm),nm,rd);if(a.err||b.err){console.log(e,nm,'ERR',a.err,'|',b.err);continue;}
  let la,lb;if(nm==='Format Markdown'){const md=o=>JSON.stringify(o).replace(/\\n/g,'\n');const st=s=>s.replace(/"chars":\d+/,'"chars":N');la=md(a).split('\n').map(st);lb=md(b).split('\n').map(st);}
  else{const g=o=>{const j=JSON.parse(JSON.stringify(o));const x=(Array.isArray(j)?j[0]:j);const s=x&&(x.json||x);const rn=(s.saveBody||{}).review_notes||'';return {rn,rest:JSON.stringify({...s,saveBody:{...s.saveBody,review_notes:null}})};};
   const ga=g(a),gb=g(b);if(ga.rest!==gb.rest)console.log(e,nm,'OTHER FIELDS DIFFER');la=(ga.rn.match(/\[[^\[\]]*(?:\[[^\[\]]*\][^\[\]]*)*\]/g)||[]);lb=(gb.rn.match(/\[[^\[\]]*(?:\[[^\[\]]*\][^\[\]]*)*\]/g)||[]);}
  const add=sub(la,lb);if(!add){console.log(e,nm,'BASE ITEM LOST OR REORDERED');continue;}
  const bad=add.filter(x=>!inner(x));const kw=add.filter(x=>/\(K-W; ruling/.test(x));
  const k=nm+': added '+add.length+' (K-W '+kw.length+', cured '+kw.filter(x=>/CURED by/.test(x)).length+'), added without inner bracket '+bad.length;
  console.log(e,k);bad.slice(0,3).forEach(x=>console.log('   BAD',x.slice(0,200)));kw.slice(0,2).forEach(x=>console.log('   KW',x.slice(0,220)));
  T[nm]=(T[nm]||0)+add.length;}}console.log('TOTAL added',JSON.stringify(T));})();
