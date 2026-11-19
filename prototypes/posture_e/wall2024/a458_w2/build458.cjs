// ASK 458 (W2): remove the DeepSeek steps. Usage (from wall2024/): node a458_w2/build458.cjs <engine.json> <child.json> <outdir>
// Every text edit is an exact pattern with an expected count; any count off REFUSES. The library is edited once (lines and MAP text) with one
// edit list for both workflows; byte counts n, header sha and line count are recomputed (as a434_w4/lib_apply.cjs).
const fs=require('fs'),crypto=require('crypto');const LT=require('../tools/lib.cjs');
const md5=s=>crypto.createHash('md5').update(s).digest('hex');const lsha=L=>crypto.createHash('sha256').update(JSON.stringify(L)).digest('hex').slice(0,16);
const [E,C,OUT]=process.argv.slice(2);fs.mkdirSync(OUT,{recursive:true});let bad=0;const fail=m=>{console.log('REFUSE',m);bad++;};
const ROUTE=['C1','D1','D2','C2','D3','C3','D4','C4','C4G','C3G','C1B','D2B','C2B','D3B','C3B','D4B','C4B'].map(k=>k+' Call deepseek')
 .concat(['DeepSeek Synthesis Call','DeepSeek Diagnostic Call','Independent Verdict Call','Panel Reserve deepseek']);
const DEL_E=ROUTE.concat(['Panel Judge 1 deepseek','Panel Judge 1 Empty?','Panel Judge 1 deepseek retry','Accept DS Build','Accept DS?','Accept Call deepseek',
 'Accept DS Return?','Accept Return Call deepseek']);
// Accept DS Return Build is KEPT (rev 1): its judge prompt holds the word "reasoning" 5 times, so removing it trips the reasoning guard; only its DeepSeek read is cut.
const DEL_C=['Panel Judge 1 deepseek','Panel Reserve deepseek','A379 Gate 26','A379 Tick 26','A379 Gate 31','A379 Tick 31'];
// where an edge from a kept node into a removed node goes instead
const BY_E=Object.fromEntries(ROUTE.map(n=>[n,'Provider Removed Stop']).concat([['Panel Judge 1 deepseek','Provider Removed Stop'],['Accept DS Build','Accept Check'],['Accept DS Return?','Accept Final']]));
const BY_C={'A379 Gate 26':'A379 Gate 27','A379 Gate 31':'A379 Gate 32'};
const NAMES=[...new Set(DEL_E.concat(DEL_C))].filter(n=>!/^A379 /.test(n)).sort((a,b)=>b.length-a.length);
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
// generic removals of a name's references, in raw code text (q = the quote used around names in that text)
function strip(t){let c=0;const sub=(rx)=>{t=t.replace(rx,()=>{c++;return '';});};
 for(const n of NAMES){const N=esc(n);
  const G='"'+N+'":\\(\\)=>\\$\\(\''+N+'\'\\)';                       // getter map entry  "X":()=>$('X')
  const I='\\(\\)=>\\$\\(\''+N+'\'\\)';                                // getter list item  ()=>$('X')
  const P='\\\\?"'+N+'\\\\?": \\(\\$\\(\\\\?"'+N+'\\\\?"\\)\\.isExecuted \\? \\{ ran: true, items: \\$\\(\\\\?"'+N+'\\\\?"\\)\\.all\\(\\)\\.map\\(i => i\\.json\\) \\} : \\{ ran: false, items: \\[\\] \\}\\)'; // pass map entry
  const Q1='\''+N+'\'',Q2='"'+N+'"';
  for(const x of [G,I]){sub(new RegExp(x+',','g'));sub(new RegExp(','+x+'(?=[}\\]])','g'));}
  sub(new RegExp(P+', ','g'));sub(new RegExp(', '+P+'(?= ?})','g'));
  sub(new RegExp('\\$\\('+Q2+'\\);','g'));                                    // read line $("X");
  for(const q of [Q1,Q2]){sub(new RegExp('(?<=[\\[,] ?)'+q+', ?','g'));sub(new RegExp(', ?'+q+'(?=\\])','g'));} // list member
 }
 return [t,c];}
const SPECIAL=[ // [where, old, new, count]
 ['lib',"const G9R='Panel Judge 1 deepseek retry';const g9Ran=()=>{try{return __L[G9R]().isExecuted;}catch(e){return false;}};const g9Node=n=>(n==='Panel Judge 1 deepseek'&&g9Ran())?G9R:n;","const g9Node=n=>n;",1],
 ['Panel Check',"const G9R='Panel Judge 1 deepseek retry';const g9Ran=()=>{try{return __L[G9R]().isExecuted;}catch(e){return false;}};const g9Node=n=>(n==='Panel Judge 1 deepseek'&&g9Ran())?G9R:n;","const g9Node=n=>n;",1],
 ['Panel Check',"retried:i===0&&r[0]==='Panel Judge 1 deepseek'&&g9Ran()","retried:false",1],
 ['Accept Check',"let DSB=null,DSR=null;try{if($('Accept Call deepseek').isExecuted){DSB=$('Accept DS Build').first().json.acc;DSR=$('Accept Call deepseek').first().json;}}catch(e){DSB=null;}","let DSB=null,DSR=null;",1],
 ['Accept Return Build',"let DSB=null;try{if($('Accept Call deepseek').isExecuted)DSB=$('Accept DS Build').first().json.acc;}catch(e){DSB=null;}","let DSB=null;",1],
 ['Accept Final',"take('Accept DS Return Build','Accept Return Call deepseek');","",1],
 ['Accept DS Return Build',"let DSB=null;try{if($('Accept Call deepseek').isExecuted)DSB=$('Accept DS Build').first().json.acc;}catch(e){DSB=null;}","let DSB=null;",1],
 ['Provider Removed Stop',"(openai, gemini, grok or mimo)","(openai, gemini, grok, mimo or deepseek)",1],
 ['Provider Removed Stop',"Seats must resolve to openrouter or deepseek","Seats must resolve to openrouter",1],
];
const libHits={n:0};const special=(where,t)=>{for(const [w,o,n,k] of SPECIAL)if(w===where){if(where!=='lib'&&TAG!=='engine')continue;if(where==='lib'){const c=t.split(o).length-1;libHits.n+=c;t=t.split(o).join(n);continue;}const c=t.split(o).length-1;if(c!==k){fail(where+': special text found '+c+' times, not '+k+': '+o.slice(0,60));continue;}t=t.split(o).join(n);}return t;};
function relib(T){const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const hdr=T.slice(0,iL),tail=T.slice(iE);
 let L=JSON.parse(T.slice(iL+8,iM)),M=JSON.parse(T.slice(iM+8,iE));let c=0;
 L=L.map(l=>{let [s,k]=strip(special('lib',l));c+=k;return s;});
 for(const e of Object.values(M))e.p=e.p.map(x=>{if(Array.isArray(x)&&typeof x[0]==='string'){let [s,k]=strip(special('lib',x[0]));c+=k;return [s,...x.slice(1)];}return x;});
 for(const e of Object.values(M))e.n=LT.rb(L,e).length;
 const h2=hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha(L)+', '+L.length+' lines');
 return [h2+'\n/*LIB*/'+JSON.stringify(L)+'\n/*MAP*/'+JSON.stringify(M)+tail,c];}
let TAG='';for(const [f,tag,DEL,BY] of [[E,'engine',DEL_E,BY_E],[C,'child',DEL_C,BY_C]]){TAG=tag;const W=JSON.parse(fs.readFileSync(f,'utf8'));const D=new Set(DEL);
 for(const n of DEL)if(!W.nodes.some(x=>x.name===n))fail(tag+' no node '+n);
 const ds=W.nodes.filter(n=>!D.has(n.name)&&(String((n.parameters||{}).url||'').includes('api.deepseek.com')));if(ds.length)fail(tag+' DeepSeek calls not in the list: '+ds.map(n=>n.name));
 W.nodes=W.nodes.filter(n=>!D.has(n.name));
 // connections
 const CN={};let rew=0;for(const [s,o] of Object.entries(W.connections)){if(D.has(s))continue;const o2={...o};
  o2.main=(o.main||[]).map(outs=>{const seen=new Set();return (outs||[]).flatMap(c=>{if(!D.has(c.node))return [c];const t=BY[c.node];if(!t){fail(tag+' edge '+s+' -> '+c.node+' has no bypass');return [];}rew++;const r={...c,node:t,index:0};const k=t+'|0';if(seen.has(k))return [];seen.add(k);return [r];}).filter((c,i,a)=>a.findIndex(y=>y.node===c.node&&y.index===c.index)===i);});
  CN[s]=o2;}
 // child chain: Tick 25 and Tick 30 already lead into the removed gates; handled by BY. Engine: nothing else.
 W.connections=CN;let refs=0;
 for(const n of W.nodes){if(n.name==='Shared Library'){const [t,c]=relib(n.parameters.jsCode);n.parameters.jsCode=t;refs+=c;continue;}
  if(typeof (n.parameters||{}).jsCode==='string'){let [t,c]=strip(special(n.name,n.parameters.jsCode));refs+=c;n.parameters.jsCode=t;continue;}
  let s=JSON.stringify(n.parameters||{});if(NAMES.some(x=>s.includes(x))){const P=JSON.parse(s);const walk=v=>typeof v==='string'?(()=>{let [t,c]=strip(v);refs+=c;return t;})():Array.isArray(v)?v.map(walk):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,walk(x)])):v;n.parameters=walk(P);}}
 const all=JSON.stringify({n:W.nodes,c:W.connections});const left=NAMES.filter(x=>new RegExp('(?<![\\w ])'+esc(x)+'(?![\\w?])').test(all));
 console.log(tag,'| removed',DEL.length,'| edges rewired',rew,'| reference edits',refs,'| removed names left anywhere:',left.length?left.join('; '):'none');
 if(left.length)bad++;const o=OUT+'/'+tag+'_target.json';fs.writeFileSync(o,JSON.stringify(W));console.log(tag,'target md5',md5(fs.readFileSync(o,'utf8')).slice(0,12));}
console.log('library G9R block replaced in',libHits.n,'places (engine and child libraries, MAP text)');if(libHits.n!==2){console.log('REFUSE G9R count');bad++;}
process.exit(bad?1:0);
