// pkgJGR rev 3 test (mimo in qwen_flash's place; Eric 07:14Z 11-09). Run from wall2024/: node pkgJGR/test_JGR_mimo.cjs
// Base live s71 (fetch-back) vs pkgJGR/mimo/patched. Every saved run with Init Seats input:
//  Init Seats -> panel chatgpt, sol, mimo (mimo left out only where mimo debates); single chatgpt; no reserve; no alternates; gemini and grok nowhere.
//  Resolve Seats (patched Init Seats fed in) -> judges terra, sol, xiaomi/mimo-v2.6-pro, all openrouter.
//  Panel Build (patched Resolve Seats fed in) -> the mimo body: model xiaomi/mimo-v2.6-pro, reasoning effort low; terra and sol bodies carry no reasoning.
//  Accept Build -> asks chatgpt, sol, mimo (minus debaters); mimo posture body carries effort low.
// Plus: __orc rule unit check; library Alternate/R2 Alternate Build differ from strip_KWI by the one rule line.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const B='/mnt/project-files/wall2024/fetchback_live_s71.json';const W=JSON.parse(fs.readFileSync(B));
const D='/mnt/project-files/wall2024/inputs/';const has=(R,n)=>fs.existsSync(D+R+'_'+n.replace(/ /g,'_')+'.json');const fin=(R,n)=>feeder(B,n).find(x=>has(R,x));
const NB='',NO='pkgJGR/mimo/patched';
const live=n=>{const f=NB?NB+'/'+n.replace(/ /g,'_')+'.js':'';return (f&&fs.existsSync(f))?fs.readFileSync(f,'utf8'):W.nodes.find(z=>z.name===n).parameters.jsCode;};const pat=n=>{const f=NO+'/'+n.replace(/ /g,'_')+'.js';return fs.existsSync(f)?fs.readFileSync(f,'utf8'):live(n);};
const rows=(R,n)=>{const d=JSON.parse(fs.readFileSync(D+R+'_'+n.replace(/ /g,'_')+'.json'));const r=Array.isArray(d)?d[0]:d;return ((r.data&&r.data.main)||r.main)[0];};
const MM={json:{seat:'mimo',provider:'xiaomi',role:'engine',api_model:'xiaomi/mimo-v2.6-pro',max_tokens:64000,family:'xiaomi',active:true,jfl_move:false,jfl_block:'',jfl_counts:null}};
let ok=0,bad=0;const out=[];const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;out.push('FAIL '+m);}console.log((c?'OK ':'FAIL ')+m);};const S=a=>JSON.stringify(a);
const runs=fs.readdirSync(D).filter(f=>/_Init_Seats\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>has(r,'Fetch Models')).sort();
let two=0;const PB=[];
for(const R of runs){const add=a=>a.some(x=>x.json&&x.json.seat==='mimo')?a:a.concat([MM]);const FM=add(rows(R,'Fetch Models'));const AM=has(R,'Accept Models')?add(rows(R,'Accept Models')):FM;
 const f=fin(R,'Init Seats');const IN=JSON.parse(JSON.stringify(f));
 const it=Array.isArray(IN)?IN:[IN];for(const x of it){const j=x.json||x;if(j&&j.acc&&Array.isArray(j.acc.seats)&&!j.acc.seats.some(s=>s.seat==='mimo'))j.acc.seats.push({seat:'mimo',placed:true});}
 const ov={'Fetch Models':FM,'Accept Models':AM};let a,b,e0=null,e1=null;
 try{a=harness(R,ov)(live('Init Seats'),f)[0].json;}catch(e){e0=e.message.slice(0,120);}try{b=harness(R,ov)(pat('Init Seats'),IN)[0].json;}catch(e){e1=e.message.slice(0,160);}
 if(e1){T(!!e0,R+' patched Init Seats refuses ('+e1+'); base '+(e0?'refuses too: '+e0:'did not'));continue;}
 const deb=[b.defender.engine,b.challenger.engine];const want=['chatgpt','mimo','sol'].filter(s=>deb.indexOf(s)<0&&!(deb.some(d=>/^(chatgpt|sol)$/.test(d))&&/^(chatgpt|sol)$/.test(s)));if(want.length<3)two++;
 const pass=S(b.panel_order.slice().sort())===S(want)&&(b.single_judge===(want.includes('chatgpt')?'chatgpt':b.single_judge))&&!b.panel_reserve&&S(b.alt_order)==='[]';
 T(pass&&!/gemini|grok|qwen_flash/.test(S([b.panel_order,b.single_judge,b.panel_reserve,b.alt_order])),R+' ('+deb.join(' v ')+') panel '+S(a&&a.panel_order)+' -> '+S(b.panel_order)+'; single '+(a&&a.single_judge)+' -> '+b.single_judge+'; reserve '+(a&&a.panel_reserve)+' -> '+b.panel_reserve+'; alt '+S(a&&a.alt_order)+' -> '+S(b.alt_order));
 let r=null;if(has(R,'Resolve Seats')){try{r=harness(R,{...ov,'Init Seats':[{json:b}]})(pat('Resolve Seats'),fin(R,'Resolve Seats'))[0].json;}catch(e){T(false,R+' Resolve Seats threw '+e.message.slice(0,140));continue;}
  const M={chatgpt:'chatgpt=openai/gpt-6.1-terra/openrouter',mimo:'mimo=xiaomi/mimo-v2.6-pro/openrouter',sol:'sol=openai/gpt-6.1-sol/openrouter'};
  T(S(r.judges.map(x=>x.seat+'='+x.api_model+'/'+x.fam).sort())===S(want.map(s=>M[s]).sort())&&!r.reserve&&(!r.alternates||!r.alternates.length),R+' Resolve Seats judges '+S(r.judges.map(x=>x.seat+'='+x.api_model+'/'+x.fam))+' reserve '+S(r.reserve)+' alternates '+S(r.alternates||[]));}
 if(r&&has(R,'Anticheat Only?')&&(R>='33800'||R==='33530')){let p;try{p=await0(harness(R,{...ov,'Init Seats':[{json:b}],'Resolve Seats':[{json:r}]})('return (async()=>{'+pat('Panel Build')+'\n})();',fin(R,'Panel Build')));}catch(e){p={ERR:e.message.slice(0,140)};}
  PB.push([R,p,want]);}
 if(has(R,'Accept Build')){let q;try{q=harness(R,{...ov})(pat('Accept Build'),fin(R,'Accept Build'));}catch(e){T(false,R+' Accept Build threw '+e.message.slice(0,140));continue;}
  const asked=q.map(x=>x.json.acc&&x.json.acc.seat).filter(Boolean);const mb=q.map(x=>x.json.acc).find(x=>x&&x.seat==='mimo');
  T(S(asked)===S(['chatgpt','sol','mimo'].filter(s=>deb.indexOf(s)<0))&&(!asked.includes('mimo')||(mb&&mb.body&&mb.body.model==='xiaomi/mimo-v2.6-pro')),R+' Accept Build asks '+S(asked)+'; mimo body model '+(mb&&mb.body&&mb.body.model)+' reasoning '+S(mb&&mb.body&&mb.body.reasoning));}}
function await0(x){return x;}

(async()=>{
 const bodies=x=>{const o=[];const w=v=>{if(v&&typeof v==='object'){if(typeof v.model==='string'&&Array.isArray(v.messages))o.push(v);for(const k of Object.keys(v))w(v[k]);}};w(x);return o;};
 for(const [R,p0,want] of PB){const p=await p0;if(p&&p.ERR){T(false,R+' Panel Build threw '+p.ERR);continue;}const bs=bodies(p);const mm=bs.filter(z=>z.model==='xiaomi/mimo-v2.6-pro'),ot=bs.filter(z=>z.model!=='xiaomi/mimo-v2.6-pro');if(mm.length)fs.writeFileSync('pkgJGR/mimo/check_body_'+R+'.json',JSON.stringify(mm[0]));
  T((want.includes('mimo')?mm.length>0:mm.length===0)&&mm.every(z=>S(z.reasoning)==='{"effort":"low"}'&&z.max_tokens===65536)&&ot.every(z=>!z.reasoning),R+' Panel Build: '+mm.length+' mimo body(ies) '+S(mm.map(z=>({max_tokens:z.max_tokens,reasoning:z.reasoning})))+'; other bodies '+S(ot.map(z=>z.model+(z.reasoning?' '+S(z.reasoning):''))));}
 // __orc unit
 {const c=pat('Panel Build');const i=c.indexOf('const __orc=');const j=c.indexOf('\n',i);const orc=new Function(c.slice(i,j)+'\nreturn __orc;')();const m=[{role:'user',content:'x'}];
  const x=orc({model:'xiaomi/mimo-v2.6-pro',messages:m},'openrouter','xiaomi/mimo-v2.6-pro','k'),q=orc({model:'qwen/qwen3.8-flash',messages:m},'openrouter','qwen/qwen3.8-flash','k'),t=orc({model:'openai/gpt-6.1-terra',messages:m},'openrouter','openai/gpt-6.1-terra','k'),xk=orc({model:'xiaomi/mimo-v2.6-pro',messages:m,reasoning:{effort:'high'}},'openrouter','xiaomi/mimo-v2.6-pro','k');
  T(S(x.reasoning)==='{"effort":"low"}'&&!q.reasoning&&!t.reasoning&&S(xk.reasoning)==='{"effort":"high"}','__orc: xiaomi/mimo-v2.6-pro gets effort low; qwen flash and terra get nothing; a set reasoning is kept');}
 const QM="if(!o.reasoning&&/^xiaomi\\/mimo-v2\\.6-pro$/.test(String(model)))o.reasoning={effort:'low'}; /* pkgJGR rev 3 (pkgPNL3 rule, mimo only): mimo spent its whole 65,536-token limit as a reserve judge (32471, 32482); low effort leaves room for the verdict */";
 for(const n of ['Panel Build','Reserve Build']){const a=live(n),b=pat(n);T(b.replace(QM,'')===a&&b.split(QM).length===2,n+': only the mimo rule is added, once');}
 for(const f of ['Alternate_Build.js','R2_Alternate_Build.js']){const a=fs.readFileSync('pkgLIB/strip_KWI/patched/'+f,'utf8'),b=fs.readFileSync('pkgLIB/strip_JGR_MIMO/patched/'+f,'utf8');T(b.replace(QM,'')===a&&b.split(QM).length===2,'library '+f+': only the mimo rule line is added, once');}
 out.push('runs where mimo debates (panel of 2): '+two);out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.slice(-2).join('\n'));fs.writeFileSync('pkgJGR/mimo/test_JGR_mimo.txt',out.join('\n')+'\n');})();
