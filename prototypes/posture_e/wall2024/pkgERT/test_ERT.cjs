// pkgERT test. Run from wall2024/: node pkgERT/test_ERT.cjs
// 1. 33482: the Retry Build resends the aborted call (same body).  2. Record with a good retry reply: NO VERDICT -> 0, enf421.ert noted.
// 3. Record with a failed retry: rows as base, ert notes both errors.  4. Replay: every saved run 33218+ (Retry Build = no retry where the reply
// is good; Record identical to base when the retry did not run).  5. Wiring: every connection names a node that exists or is added.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s50.json','utf8'));const base=W.nodes.find(n=>n.name==='Enforcer Record').parameters.jsCode;
const P=f=>fs.readFileSync(__dirname+'/patched/'+f,'utf8');const RB=P('Enforcer_Retry_Build.js'),REC=P('Enforcer_Record.js');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
const sd=(run,n)=>{const f=D+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return null;const r=JSON.parse(fs.readFileSync(f,'utf8'))[0];return r&&r.data&&r.data.main?r.data.main[0]:null;};
const nv=o=>o[0].json.enf421_rows.filter(r=>/^ENFORCER NO VERDICT/.test(r.cure_reason)).length;
// 1
{const H=harness('33482');const r=H(RB,'Enforcer Call deepseek');const B=sd('33482','Enforcer Build')[0].json;
 T(r.length===1&&r[0].json.esr_retry===true&&/^error: aborted/.test(r[0].json.esr_why)&&JSON.stringify(r[0].json.body)===JSON.stringify(B.body),'33482 Retry Build resends the call: '+r[0].json.esr_why+', body the same ('+JSON.stringify(B.body).length+' chars)');
// 2
 const ids=B.ids.map(x=>x.id);const good=[{json:{choices:[{finish_reason:'stop',message:{content:ids.map(i=>'ENFORCER: '+i+' -- AGREE -- "x" stands.').join('\n')}}]}}];
 const a=H(base,'Enforcer Call deepseek');const b=harness('33482',{'Enforcer Retry Call deepseek':good,'Enforcer Retry Build':r})(REC,'Enforcer Call deepseek');
 T(nv(a)===ids.length&&nv(b)===0,'33482 Record: NO VERDICT base '+nv(a)+' of '+ids.length+' -> with a good retry reply '+nv(b));
 T(b[0].json.enf421.ert&&b[0].json.enf421.ert.retried&&b[0].json.enf421.ert.answered&&/aborted/.test(b[0].json.enf421.ert.first),'enf421.ert = '+JSON.stringify(b[0].json.enf421.ert));
 const strip=o=>JSON.stringify(o[0].json,(k,v)=>k==='enf421'||k==='enf421_rows'||k==='at'?undefined:v);T(strip(a)===strip(b),'every other output field unchanged');
// 3
 const c=harness('33482',{'Enforcer Retry Call deepseek':[{json:{error:'aborted'}}],'Enforcer Retry Build':r})(REC,'Enforcer Call deepseek');
 const rows=o=>JSON.stringify(o[0].json.enf421_rows.map(x=>[x.seat,x.rule,x.item,x.cure_reason,x.reply_error]));
 T(rows(a)===rows(c)&&c[0].json.enf421.ert.answered===false&&c[0].json.enf421.ert.retry_error==='aborted','a failed retry: rows the same as base ('+nv(c)+' NO VERDICT), ert '+JSON.stringify(c[0].json.enf421.ert));}
// 4
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>+r>=33218).sort();const st=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);let n=0,same=0;const rt=[];
for(const RUN of runs){if(!sd(RUN,'Enforcer Record'))continue;const H=harness(RUN);
 if(sd(RUN,'Enforcer Call deepseek')){const r=H(RB,'Enforcer Call deepseek');if(r[0].json.esr_retry)rt.push(RUN+' ('+r[0].json.esr_why+')');}
 const inp=sd(RUN,'Enforcer Call deepseek')?'Enforcer Call deepseek':'Enforcer Needed?';let a,b,e0=null,e1=null;try{a=H(base,inp);}catch(x){e0=String(x.message).slice(0,80);}try{b=H(REC,inp);}catch(x){e1=String(x.message).slice(0,80);}
 n++;if(e0||e1){if(e0===e1)same++;else log('   '+RUN+' errors differ: '+e0+' | '+e1);continue;}if(st(a)===st(b))same++;else log('   '+RUN+' Record differs');}
T(same===n,'replay: Enforcer Record identical to base on '+same+' of '+n+' saved runs (no retry ran)');
T(rt.length===1&&/^33482/.test(rt[0]),'replay: the Retry Build resends only on '+JSON.stringify(rt));
// 5
{const w=JSON.parse(fs.readFileSync(__dirname+'/patched.wiring.json','utf8'));const names=new Set([...W.nodes.map(n=>n.name),...w.add.map(n=>n.name)]);
 const refs=Object.entries(w.connections_set).flatMap(([k,v])=>[k,...v.main.flat().map(x=>x.node)]);T(refs.every(r=>names.has(r))&&w.add.length===3&&!W.nodes.some(n=>w.add.some(a=>a.name===n.name||a.id===n.id)),'wiring: 3 new nodes (names and ids unused in s50), every connection names a node');
 const rc=w.add.find(a=>a.name==='Enforcer Retry Call deepseek'),ec=W.nodes.find(n=>n.name==='Enforcer Call deepseek');T(JSON.stringify(rc.parameters)===JSON.stringify(ec.parameters)&&JSON.stringify(rc.credentials)===JSON.stringify(ec.credentials),'the Retry Call has the same request settings and credentials as Enforcer Call deepseek');}
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_ERT.txt',out.join('\n')+'\n');
