// pkgRTB family 3 ("unanswered": the PRESSED cure for K-G1 / K-G4; design DESIGN_UNANSWERED.md). Run from wall2024/:
//   node pkgRTB/build_RTB3.cjs [base strip=pkgLIB/strip_RTB2K] [dest strip=pkgLIB/strip_RTB3] [prompt target=/mnt/project-files/wall2024/fetchback_live_s66.json]
// Library: base strip -> dest strip. Prompt nodes (agreement tail, DeepSeek line): from the prompt target -> pkgRTB/patched3. Plan: pkgRTB/plan_RTB3.json.
// The rounds are read from the library's own CURE_PRESS (every node that holds it must agree) and bound into the table before any render.
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const {RX,PR,RXM}=require('./rule_table.cjs');
const SRC=(process.argv[2]||'pkgLIB/strip_RTB2K').replace(/\/$/,'')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_RTB3').replace(/\/$/,'')+'/patched/';
const TGT=process.argv[4]||'/mnt/project-files/wall2024/fetchback_live_s66.json';
const libFiles=fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort();
let cp=null;for(const f of libFiles){const m=fs.readFileSync(SRC+f,'utf8').match(/CURE_PRESS=(\{DEFENDER:\[[^\]]*\],CHALLENGER:\[[^\]]*\]\})/);if(!m)continue;const v=JSON.stringify(eval('('+m[1]+')'));if(cp&&cp!==v)throw new Error('CURE_PRESS differs across nodes');cp=v;}
if(!cp)throw new Error('CURE_PRESS not found');PR.bind(JSON.parse(cp));
const SUBS=require('./build_RTB3_subs.cjs')();
const sub=(s,a,b,tag,f,tally)=>{const n=s.split(a).length-1;if(!n)return s;tally[tag]=(tally[tag]||0)+n;f.push(tag+' x'+n);return s.split(a).join(b);};
const plan={table:'pkgRTB/rule_table.cjs',cure_press:JSON.parse(cp),library:{base:SRC,nodes:{}},prompt:{base:TGT,nodes:{}},tally:{}};
fs.rmSync(DST,{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});
for(const f of libFiles){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;const hit=[];
 for(const [tag,a,b] of SUBS.library)s=sub(s,a,b,tag,hit,plan.tally);
 if(hit.length){new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.library.nodes[f]={base:h(s0),patched:h(s),hits:hit};}
 fs.writeFileSync(DST+f,s);}
const W=JSON.parse(fs.readFileSync(TGT,'utf8'));const libNames=new Set(libFiles.map(f=>f.replace(/\.js$/,'').replace(/_/g,' ')));
fs.rmSync('pkgRTB/patched3',{recursive:true,force:true});fs.mkdirSync('pkgRTB/patched3',{recursive:true});
for(const n of W.nodes){const c=n.parameters&&n.parameters.jsCode;if(!c||libNames.has(n.name)||n.name==='Shared Library')continue;let s=c;const hit=[];
 for(const [tag,a,b] of SUBS.prompt)s=sub(s,a,b,tag,hit,plan.tally);
 if(hit.length){new Function('$','$input','return (async()=>{\n'+s+'\n})();');fs.writeFileSync('pkgRTB/patched3/'+n.name.replace(/ /g,'_')+'.js',s);plan.prompt.nodes[n.name]={before:h(c),after:h(s),hits:hit};}}
fs.writeFileSync('pkgRTB/plan_RTB3.json',JSON.stringify(plan,null,1)+'\n');
console.log('CURE_PRESS',cp,'| library nodes',Object.keys(plan.library.nodes).length,'| prompt nodes',Object.keys(plan.prompt.nodes).length,'|',JSON.stringify(plan.tally));
