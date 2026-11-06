// pkgECF2 test. Run from wall2024/: node pkgECF2/test_ECF2.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(fs.readFileSync('pkgECF2/plan_ECF2.json','utf8'));
T('4 nodes on pkgECF/patched (both Send Back Records and Builds); shas match',plan.nodes.length===4&&plan.nodes.every(n=>sha(fs.readFileSync(plan.base+'/'+n.file,'utf8'))===n.base_sha&&sha(fs.readFileSync('pkgECF2/patched/'+n.file,'utf8'))===n.final_sha));
const lib=f=>{const s=fs.readFileSync(f,'utf8');return new Function(s.slice(s.indexOf('function psGrades'),s.indexOf('let __RD=null;'))+'\nreturn enf428Cure;')();};
const C1=lib('pkgECF/patched/Send_Back_Record.js'),C2=lib('pkgECF2/patched/Send_Back_Record.js');
const R=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/33083_Panel_Cure_Normalize_1.json','utf8'))[0].main[0][0].json.cure.rounds;
const feed=require('../pkgECF/replay_feed.cjs');const G=feed('33083').b;const g=(s,p,gr)=>G.find(x=>x.seat===s&&x.item==='COLLISION '+p&&x.grade===gr).line;
const d1f=g('gemini','D1 vs C1','FORCED'),d1b=g('gemini','D1 vs C1','LINK BROKEN');const fails=d1f.match(/FAILS:\s*"(.+)"\s*$/)[1].replace(/\\"/g,'"');
const verse='"When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost" (Matthew 1:18)';
const cu=(C,line,a)=>C({rule:'E-COL',item:'COLLISION D1 vs C1',line},a,R);
const U=[['FAILS words only',d1f,{ans:'KEEP',why:'The answer says '+fails},'UNCURED'],
 ['FAILS words plus the verse words',d1f,{ans:'KEEP',why:'The answer says '+fails+' But the verse reads '+verse+'.'},'CURED'],
 ['verse words only',d1f,{ans:'KEEP',why:'The verse reads '+verse+'.'},'UNCURED'],
 ['RETRACTED',d1f,{ans:'CHANGE',to:'RETRACTED: D1 vs C1',why:'a rival reading'},'CURED'],
 ['CHANGE TO the pair UNDERDETERMINED',d1b,{ans:'CHANGE',to:'D1 vs C1 (Matthew 1:16): UNDERDETERMINED',why:'both footed'},'CURED'],
 ['CHANGE TO still BROKEN quoting the FAILS words only',d1b,{ans:'CHANGE',to:'D1 vs C1 (Matthew 1:16): CHALLENGER LINK BROKEN',why:fails},'UNCURED'],
 ['LINK BROKEN on an unanswered press, KEEP quoting the pressing sentence (ruling 392)',G.find(x=>x.seat==='sol'&&x.item==='COLLISION D5 vs C1').line,{ans:'KEEP',why:'The press "the plucked signet is set again on Zerubbabel" with Jeremiah 22:24 was left unanswered.'},'CURED'],
 ['LINK BROKEN on meaning (gemini), KEEP quoting a pressing sentence with no "unanswered"',d1b,{ans:'KEEP',why:'Matthew sets it: "the finding is placed before they came together, so no knowing precedes it."'},'UNCURED']];
U.forEach(([n,line,a,w])=>{const r=cu(C2,line,a),r1=cu(C1,line,a);T('unit: '+n+': '+r.status+' (pkgECF: '+r1.status+')',r.status===w,r.why);});
// the 36 logged E-COL answers (32905-33040), pkgECF vs pkgECF2
const SB=JSON.parse(fs.readFileSync('pkgECF/ecol_sendbacks.json','utf8'));const ans=r=>{const m=String(r.resp||'').match(/\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);return m?{ans:/^KEEP$/i.test(m[1].trim())?'KEEP':'CHANGE',to:(m[2]||'').trim(),why:(m[3]||'').trim()}:{ans:'NO ANSWER'};};
const rows=SB.filter(r=>+r.run>=32905).map(r=>{const x={rule:'E-COL',item:r.item,line:r.line};return {r,a:C1(x,ans(r),R),b:C2(x,ans(r),R)};});const ch=rows.filter(x=>x.a.status!==x.b.status);
T('logged E-COL answers (32905-33040): '+rows.length+' read; '+ch.length+' change between pkgECF and pkgECF2; pkgECF2 UNCURED '+rows.filter(x=>x.b.status==='UNCURED').length,rows.length===36,
 ch.map(x=>x.r.run+' '+x.r.seat+' '+ans(x.r).ans+' '+x.a.status+' -> '+x.b.status+' -- '+String(x.b.why).slice(0,150)).join('\n     ')||'(none)');
console.log(rows.filter(x=>x.b.status==='UNCURED').map(x=>'  UNCURED '+x.r.run+' '+x.r.seat+' '+ans(x.r).ans+' -- '+String(x.b.why).slice(0,140)).join('\n'));
// pkgECF's own test still passes on the unchanged nodes; the Record end to end on pkgECF2
const src=fs.readFileSync('pkgECF2/patched/Send_Back_Record.js','utf8');const alt=fs.readFileSync('pkgECF2/patched/Alt_Send_Back_Record.js','utf8');
T('Alt Record carries the same E-COL cure',alt.includes(src.slice(src.indexOf(" if(it.rule==='E-COL'){"),src.indexOf(" return res(false,'not an E-ANS, E-PREM or E-COL item');}"))));
const body=s=>JSON.stringify({payload:{judge_seat:s,drv_uncured:0,verdict_raw:'x'}});const PASS={bodies:[body('gemini')],enf428_rows:[]};
const items=[{sid:'S1',rule:'E-COL',item:'COLLISION D1 vs C1',line:d1f,reason:'rival reading'},{sid:'S2',rule:'E-COL',item:'COLLISION D1 vs C1',line:d1b,reason:'rival reading'}];
const reply='SENDBACK: S1 || KEEP || The answer says '+fails+'\nSENDBACK: S2 || KEEP || The answer says '+fails+' But the verse reads '+verse+'.';
const nodes={'Judge Enforcer Record':[PASS],'Send Back Build':[{seat:'gemini',api_model:'g',run_token:'t',items,msg:'m'}],'Panel Cure Normalize 1':[{cure:{rounds:R}}],'Panel Cure Check':[{bodies:PASS.bodies}]};
const $=n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
const o=new Function('$','$input','$json',src)($,{all:()=>[{json:{choices:[{message:{content:reply}}]}}],first:()=>({json:{}})},{})[0].json;const gp=JSON.parse(o.bodies[0]).payload;
T('Record end to end: S1 (FAILS words only) UNCURED and counted, S2 (FAILS plus verse) CURED: drv_uncured 1',gp.drv_uncured===1&&o.sb_rows.map(r=>r.cure_status).join(',')==='UNCURED,CURED',gp.verdict_raw.split('\n').filter(l=>/AUDIT v41/.test(l)).join(' ').slice(0,220));
T('Send Back Build and Alt state the two-sided cure',['Send_Back_Build.js','Alt_Send_Back_Build.js'].every(f=>/quotes both sides of the conflict/.test(fs.readFileSync('pkgECF2/patched/'+f,'utf8'))));
console.log(ok+' OK, '+bad+' FAIL');
