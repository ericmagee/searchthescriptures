// W1 pkgTWC plants: Close Enforcer Record (candidate) run on planted Build items and replies.
const fs=require('fs');const f=process.argv[2]||'/tmp/claude-0/twc173.json';const raw=JSON.parse(fs.readFileSync(f));const W=(raw.data||raw).workflow||(raw.data||raw);
const REC=W.nodes.find(n=>n.name==='Close Enforcer Record').parameters.jsCode;const BLD=W.nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const F={cr1:'DECLARED CHAIN\nD1. a\nD2. b',cr2:'x',cr3:'I drop the claim that the feminine pronoun by itself excludes a father.',cr4:'I keep D1 through D6 as declared. I narrow and concede nothing.',gr1:'x',gr2:'x',dr3:'I withdraw Galatians 4:4 as an exclusion witness here.',dr4:'Galatians 4:4 shows the exclusion of a father here.'};
const run=(BA,replies)=>{const $=n=>({all:()=>n==='Close Enforcer Build'?BA.map(j=>({json:j})):[],first:()=>({json:n==='Final Output'?F:BA[0]}),isExecuted:false});
 const fn=new Function('$','$input',REC);return fn($,{all:()=>replies.map(t=>({json:t==null?{error:{message:'timeout'}}:{choices:[{message:{content:t}}]}}))})[0].json.cec;};
const b=(side,copy)=>({cec_skip:false,side,links:{DEFENDER:[1,2,4],CHALLENGER:[1,2,3]},cands:[],model:'deepseek-flash',run_token:'T',copy,body:{messages:[{},{content:'P '+side}]}});
const D='CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 4 -- CONFIRMED -- EARLIER [CR3] "I drop the claim that the feminine pronoun by itself excludes a father." -- CLOSING [CR4] "I narrow and concede nothing." -- both cannot stand';
const Dn='CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 4 -- NOT A CONTRADICTION -- EARLIER [CR3] "I drop the claim that the feminine pronoun by itself excludes a father." -- CLOSING [CR4] "I narrow and concede nothing." -- can stand';
const C='CLOSE-CONTRADICTION: NEW -- CHALLENGER -- LINK 2 -- CONFIRMED -- EARLIER [DR3] "I withdraw Galatians 4:4 as an exclusion witness here." -- CLOSING [DR4] "Galatians 4:4 shows the exclusion of a father here." -- both cannot stand';
const NONE='CLOSE-CONTRADICTION: NONE';let ok=0,bad=0;const t=(nm,c,want)=>{const got=c.confirmed.map(x=>x.side[0]+x.link).sort().join(',');const p=got===want;p?ok++:bad++;console.log((p?'PASS ':'FAIL ')+nm+' -> ['+got+'] want ['+want+']'+(p?'':' rows '+JSON.stringify(c.rows.map(r=>[r.copy,r.status]))));};
const two=[b('DEFENDER',1),b('DEFENDER',2),b('CHALLENGER',1),b('CHALLENGER',2)];
t('T1 both checks confirm both sides',run(two,[D,D,C,C]),'C2,D4');
t('T2 second check says NOT A CONTRADICTION (defender)',run(two,[D,Dn,C,C]),'C2');
t('T3 second check finds nothing (defender NONE)',run(two,[D,NONE,C,C]),'C2');
t('T4 second check fails (no reply)',run(two,[D,null,C,null]),'');
t('T5 only the second check confirms',run(two,[NONE,D,NONE,C]),'');
t('T6 both NONE',run(two,[NONE,NONE,NONE,NONE]),'');
t('T7 old one-copy Build (no copy field): one confirmation as live',run([{...b('DEFENDER'),copy:undefined},{...b('CHALLENGER'),copy:undefined}],[D,C]),'C2,D4');
const c8=run(two,[D,Dn,NONE,NONE]);const r8=c8.rows.find(r=>r.copy===1&&r.side==='DEFENDER');t('T8 refused line is recorded with its reason',c8,'');console.log('   T8 status: '+r8.status+' | '+r8.note);
// Build emits two copies per side, the second at temperature 0.6
const m=BLD.match(/out\.push\(\{json:\{cec_skip:false[\s\S]*?pkgTWC/);console.log((m&&/copy:1/.test(m[0])&&/temperature:0\.6/.test(m[0])&&/copy:2/.test(m[0]))?(ok++,'PASS T9 Build emits copy 1 and copy 2 (temperature 0.6)'):(bad++,'FAIL T9'));
console.log(ok+' of '+(ok+bad)+' pass');
