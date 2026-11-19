// ASK 455 part D (W2): rename the steps named "... deepseek" that no longer call DeepSeek (they call openrouter.ai, where the
// enforcer model runs, or collect such calls) to "... openrouter", the suffix the workflow already uses for openrouter steps.
// Steps whose request still goes to api.deepseek.com, and the DeepSeek panel slots, keep their names (a rename would make the name false).
// Every reference moves with the name: connections (keys and targets) and every quoted occurrence in every node's parameters.
// Usage (from wall2024/): node a455d_w2/build455d.cjs <engine.json> <child.json> <outdir>
const fs=require('fs'),crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const [E,C,OUT]=process.argv.slice(2);fs.mkdirSync(OUT,{recursive:true});let bad=0;const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
// The Shared Library text is common to both workflows and names steps of both, so one map (engine and child renames together) is applied to both.
// The Shared Library is packed (pkgLIB): lines L, MAP of parts with each stub's byte count n, header sha. Rename inside the lines and the inline
// MAP text, then recompute every n, the header sha and line count, as a434_w4/lib_apply.cjs does; MAP keys are renamed with the node names.
const LT=require('../tools/lib.cjs');const lsha=L=>crypto.createHash('sha256').update(JSON.stringify(L)).digest('hex').slice(0,16);
function relib(T,RX,hit){const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const hdr=T.slice(0,iL),tail=T.slice(iE);
 const sub=s=>{for(const [rx,t] of RX)s=s.replace(rx,()=>{hit();return t;});return s;};const L=JSON.parse(T.slice(iL+8,iM)).map(sub);const M0=JSON.parse(T.slice(iM+8,iE));const M={};
 for(const [k,e] of Object.entries(M0)){e.p=e.p.map(x=>Array.isArray(x)&&typeof x[0]==='string'?[sub(x[0]),...x.slice(1)]:x);e.n=LT.rb(L,e).length;M[REN(k)]=e;}
 const h2=hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha(L)+', '+L.length+' lines');if(h2===hdr&&lsha(L)!==(hdr.match(/library sha ([0-9a-f]{16})/)||[])[1])throw new Error('library header');
 return h2+'\n/*LIB*/'+JSON.stringify(L)+'\n/*MAP*/'+JSON.stringify(M)+tail;}
let REN=s=>s;
const pick=W=>W.nodes.filter(n=>/ deepseek$/.test(n.name)&&(String((n.parameters||{}).url||'').includes('openrouter.ai')||(n.type==='n8n-nodes-base.code'&&!/deepseek/i.test(n.parameters.jsCode.replace(/[A-Za-z ]+ Call deepseek/g,'')))))
  .map(n=>[n.name,n.name.replace(/ deepseek$/,' openrouter')]);
const WS=[[E,'engine'],[C,'child']].map(([f,tag])=>[JSON.parse(fs.readFileSync(f,'utf8')),tag]);
const R=WS.flatMap(([W])=>pick(W)).filter((x,i,a)=>a.findIndex(y=>y[0]===x[0])===i).sort((a,b)=>b[0].length-a[0].length);
const ALL=new Set(WS.flatMap(([W])=>W.nodes.map(n=>n.name)));for(const [o,t] of R)if(ALL.has(t)){console.log('CLASH',t);bad++;}
for(const [W,tag] of WS){const N=W.nodes;
 const M=new Map(R);const ren=s=>M.get(s)||s;REN=ren;
 // quoted occurrences: preceded by ' or " (raw or JSON-escaped) and followed by ' or " or \ ; longest names first so a longer name is never cut
 const RX=R.map(([o,t])=>[new RegExp('(?<=[\'"])'+esc(o)+'(?=[\'"\\\\])','g'),t]);let refs=0;
 for(const n of N){if(n.name==='Shared Library'){n.parameters.jsCode=relib(n.parameters.jsCode,RX,()=>refs++);continue;}let s=JSON.stringify(n.parameters||{});for(const [rx,t] of RX)s=s.replace(rx,()=>{refs++;return t;});n.parameters=JSON.parse(s);n.name=ren(n.name);}
 const CN={};for(const [k,v] of Object.entries(W.connections)){CN[ren(k)]=JSON.parse(JSON.stringify(v),(kk,vv)=>kk==='node'&&typeof vv==='string'?ren(vv):vv);}W.connections=CN;
 if(W.pinData)W.pinData=Object.fromEntries(Object.entries(W.pinData).map(([k,v])=>[ren(k),v]));
 const left=[];const all=JSON.stringify({n:W.nodes,c:W.connections,p:W.pinData});for(const [o] of R){const c=(all.match(new RegExp('(?<![\\w ])'+esc(o)+'(?![\\w])','g'))||[]).length;if(c)left.push(o+' x'+c);}
 const own=R.filter(([o,t])=>W.nodes.some(n=>n.name===t));console.log(tag,'| steps renamed',own.length,'| quoted references moved',refs,'| old names left anywhere:',left.length?left.join('; '):'none');
 own.slice().sort((a,b)=>a[0].localeCompare(b[0])).forEach(([o,t])=>console.log('  ',o,'->',t));
 const kept=N.filter(n=>/deepseek/i.test(n.name)).map(n=>n.name+' ['+(String((n.parameters||{}).url||'').replace(/^https:\/\/([^/]+).*/,'$1')||n.type.replace('n8n-nodes-base.',''))+']');
 console.log(tag,'| kept',kept.length,':',kept.join('; '));
 const o=OUT+'/'+tag+'_target.json';fs.writeFileSync(o,JSON.stringify(W));console.log(tag,'target md5',md5(fs.readFileSync(o,'utf8')).slice(0,12));}
process.exit(bad?1:0);
