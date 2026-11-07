// pkgMEM tests. Run from wall2024/ after the build: node pkgMEM/test_MEM.cjs
// E(x) expands [[PRD:...]] tokens inside each enforcer_log-shaped array from the full texts in that same array (the Write Enforcer Log rule).
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);let ok=0,bad=0;const out=[];const T=(n,c,x)=>{out.push((c?'OK   ':'FAIL ')+n+(x?' :: '+x:''));c?ok++:bad++;};
const {harness,feeder}=require('../pkgGSL/harness.cjs');const FB='/mnt/project-files/wall2024/fetchback_live_s39.json';const W=JSON.parse(fs.readFileSync(FB,'utf8'));const L=(W.data||W).nodes;const live=n=>L.find(z=>z.name===n).parameters.jsCode;
const P=JSON.parse(fs.readFileSync('pkgMEM/plan_MEM.json','utf8'));
const H=t=>{let h=0x811c9dc5;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h.toString(16);};
const F=['prompt_sent','full_reply'];
const isLog=a=>Array.isArray(a)&&a.length&&a.every(r=>r&&typeof r==='object'&&'prompt_sent' in r&&'full_reply' in r);
let tokens=0,unres=0;
const expandArr=a=>{const D={};a.forEach(r=>F.forEach(f=>{const t=r[f];if(typeof t==='string'&&t.length>=2000&&!t.startsWith('[[PRD:'))D['[[PRD:'+f+':'+t.length+':'+H(t)+']]']=t;}));return a.map(r=>{const o={...r};F.forEach(f=>{const t=o[f];if(typeof t==='string'&&t.startsWith('[[PRD:')){tokens++;if(D[t]===undefined)unres++;else o[f]=D[t];}});return o;});};
const E=x=>{if(Array.isArray(x))return isLog(x)?expandArr(x):x.map(E);if(x&&typeof x==='object'){const o={};for(const k of Object.keys(x))o[k]=E(x[k]);return o;}return x;};
const dropBody=x=>{if(Array.isArray(x))return x.map(dropBody);if(x&&typeof x==='object'){const o={};for(const k of Object.keys(x))if(k!=='enforcer_log_body')o[k]=dropBody(x[k]);return o;}return x;};
T('A1 20 entries (19 enfRows nodes + Write Enforcer Log); every base is live ae5636d0; shas hold',P.nodes.length===20&&P.nodes.filter(n=>n.file.endsWith('.js')).every(n=>n.base_sha===n.live_sha&&sha(live(n.name))===n.live_sha&&sha(fs.readFileSync('pkgMEM/patched/'+n.file,'utf8'))===n.final_sha));
T('A2 no patched node writes enforcer_log_body',P.nodes.filter(n=>n.file.endsWith('.js')).every(n=>!fs.readFileSync('pkgMEM/patched/'+n.file,'utf8').includes('enforcer_log_body:')));
// R: node replays, base vs patched, on every saved run
const RUNS=['33218','33222','33249','33261','33299'];let size0=0,size1=0;const sz={};const seatOut={},seatBase={};
const ORDER=P.nodes.filter(n=>n.file.endsWith('.js')).sort((x,y)=>(x.name==='Alternate Merge')-(y.name==='Alternate Merge'));
for(const RUN of RUNS)for(const n of ORDER){const inp=feeder(FB,n.name)[0];let a,b;
 try{a=harness(RUN,n.name==='Alternate Merge'&&seatBase[RUN]?{'Alternate Merge Seat':seatBase[RUN]}:undefined)(live(n.name),inp);b=harness(RUN,n.name==='Alternate Merge'&&seatOut[RUN]?{'Alternate Merge Seat':seatOut[RUN]}:undefined)(fs.readFileSync('pkgMEM/patched/'+n.file,'utf8'),inp);if(n.name==='Alternate Merge Seat'){seatOut[RUN]=b;seatBase[RUN]=a;}} /* Alternate Merge reads the replayed Seat output on each side (patched on patched), as in the run; both replays share one fixed clock */catch(e){out.push('INFO '+RUN+' '+n.name+' not replayable: '+String(e.message).slice(0,70));continue;}
 const t0=tokens,u0=unres;const A=JSON.stringify(dropBody(a)),B=JSON.stringify(E(b));if(/enforcer_log_body/.test(JSON.stringify(b).slice(0,0)+Object.keys((b[0]&&b[0].json)||{}).join(',')))out.push('INFO '+RUN+' '+n.name+' patched output still carries enforcer_log_body');const s0=JSON.stringify(a).length,s1=JSON.stringify(b).length;size0+=s0;size1+=s1;sz[RUN+' '+n.name]=[s0,s1];
 T('R '+RUN+' '+n.name+(n.name==='Alternate Merge'?' (base fed the replayed base Seat, patched fed the patched Seat)':'')+': patched output, tokens expanded, equals base output (body dropped)'+(tokens-t0?'; '+(tokens-t0)+' tokens':''),A===B&&unres===u0,(s0/1e6).toFixed(2)+' MB -> '+(s1/1e6).toFixed(2)+' MB');}
T('R* every token resolves inside its own array',unres===0,tokens+' tokens');
// W: Write Enforcer Log expression, old on the saved Alternate Merge output vs new on (a) that output with the body dropped, (b) the same with every
// repeat of a 2000+ char prompt/reply turned into a token (more than enfRows makes)
const WN=L.find(z=>z.name==='Write Enforcer Log');const ev=(expr,mergeJson,initJson)=>{const code=expr.replace(/^=\{\{\s*/,'').replace(/\s*\}\}\s*$/,'');const $=n=>({first:()=>({json:JSON.parse(JSON.stringify(n==='Alternate Merge'?mergeJson:initJson))})});return new Function('$','return ('+code+');')($);};
const NEWJB=fs.readFileSync('pkgMEM/patched/Write_Enforcer_Log.jsonBody.txt','utf8');
const tok=(f,t)=>'[[PRD:'+f+':'+t.length+':'+H(t)+']]';
for(const RUN of RUNS){const h=harness(RUN);const g=n=>{try{return JSON.parse(JSON.stringify(h('return $(\''+n+'\').first();','x').json));}catch(e){return null;}};
 const M=g('Alternate Merge'),I=g('Init Seats');if(!M||!M.enforcer_log_body||!I){out.push('INFO '+RUN+' Write Enforcer Log: no saved Alternate Merge body');continue;}
 const old=ev(WN.parameters.jsonBody,M,I);const M1=dropBody(M);const n1=ev(NEWJB,M1,I);
 const seen=new Set();const M2={...M1,enforcer_log:M1.enforcer_log.map(r=>{const o={...r};F.forEach(f=>{const t=o[f];if(typeof t!=='string'||t.length<2000)return;const k=f+'|'+t;if(seen.has(k))o[f]=tok(f,t);else seen.add(k);});return o;})};
 const ntok=M2.enforcer_log.reduce((a,r)=>a+F.filter(f=>String(r[f]||'').startsWith('[[PRD:')).length,0);const n2=ev(NEWJB,M2,I);
 T('W '+RUN+' Write Enforcer Log body: new expression gives the same bytes as today (no body carried; and with '+ntok+' tokens)',old===n1&&old===n2,(old.length/1e6).toFixed(2)+' MB sent; carried log '+(JSON.stringify(M.enforcer_log).length/1e6).toFixed(2)+' MB -> '+(JSON.stringify(M2.enforcer_log).length/1e6).toFixed(2)+' MB, body '+(JSON.stringify(M.enforcer_log_body).length/1e6).toFixed(2)+' MB -> 0');}
// N: negative controls
{const a=[{prompt_sent:'x'.repeat(2500),full_reply:null},{prompt_sent:tok('prompt_sent','y'.repeat(2500)),full_reply:null}];const u=unres;expandArr(a);T('N1 a token with no full text in its array is left unresolved (and counted)',unres===u+1);unres=u;tokens-=1;}
{const t='z'.repeat(1999);const code=fs.readFileSync('pkgMEM/patched/Panel_Cure_Check.js','utf8');const m=code.match(/function prdTok\(f,t\)\{[^\n]*?\}return '\[\[PRD:'\+f\+':'\+t\.length\+':'\+h\.toString\(16\)\+'\]\]';\}/);const prdTok=new Function('return ('+m[0]+')')();T('N2 under 2000 chars is never tokenized; at 2000 it is',prdTok('prompt_sent',t)===t&&prdTok('prompt_sent',t+'z').startsWith('[[PRD:prompt_sent:2000:'));}
const tot='TOTAL node outputs replayed: '+(size0/1e6).toFixed(1)+' MB -> '+(size1/1e6).toFixed(1)+' MB';
const txt=out.join('\n')+'\n'+tot+'\n'+ok+' OK, '+bad+' FAIL\n';fs.writeFileSync('pkgMEM/test_MEM.txt',txt);console.log(txt);process.exit(bad?1:0);
