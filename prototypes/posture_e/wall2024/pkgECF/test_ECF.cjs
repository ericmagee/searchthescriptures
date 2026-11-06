// pkgECF test. Run from wall2024/: node pkgECF/test_ECF.cjs   (needs /mnt/project-files/wall2024/inputs/330{40,60,83}_*.json)
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(fs.readFileSync('pkgECF/plan_ECF.json','utf8'));
T('6 nodes; base and final shas match',plan.nodes.length===6&&plan.nodes.every(n=>sha(fs.readFileSync(n.base+'/'+n.file,'utf8'))===n.base_sha&&sha(fs.readFileSync('pkgECF/patched/'+n.file,'utf8'))===n.final_sha));
// 1. the feed
const feed=require('./replay_feed.cjs');const F={};for(const r of ['33040','33060','33083'])F[r]=feed(r);
const has=(r,seat,pair,grade)=>F[r].b.some(x=>x.seat===seat&&new RegExp('^COLLISION '+pair+'$').test(x.item)&&x.grade===grade);
T('33083: gemini D1 vs C1, D2 vs C6, D3 vs C1, D4 vs C5, D5 vs C4 are fed to E-COL, each as its LINK BROKEN line and its cure FORCED line (none was fed before)',
 F['33083'].a.length===0&&[['D1 vs C1'],['D2 vs C6'],['D3 vs C1'],['D4 vs C5'],['D5 vs C4']].every(([p])=>has('33083','gemini',p,'LINK BROKEN')&&has('33083','gemini',p,'FORCED')));
T('33060: the premise 4 collision, D2 vs C4, is fed for sol (LINK BROKEN and FORCED) and chatgpt (LINK BROKEN)',has('33060','sol','D2 vs C4','LINK BROKEN')&&has('33060','sol','D2 vs C4','FORCED')&&has('33060','chatgpt','D2 vs C4','LINK BROKEN'));
T('side-neutral: the defender\'s broken links are fed alike (33083 chatgpt D5 vs C1, D6 vs C1; sol D5 vs C1)',['chatgpt|D5 vs C1','chatgpt|D6 vs C1','sol|D5 vs C1'].every(k=>{const [s,p]=k.split('|');return has('33083',s,p,'LINK BROKEN');})&&F['33083'].b.some(x=>/DEFENDER LINK BROKEN/.test(x.line)));
T('33040, 33060, 33083: no E-COL item lost, every other item identical',Object.values(F).every(r=>r.lost.length===0&&r.otherSame),Object.entries(F).map(([k,r])=>k+': E-COL '+r.a.length+' -> '+r.b.length+', calls '+r.callsA+' -> '+r.callsB).join('; '));
// 2. the cure reading, taken from the patched Send Back Record
const src=fs.readFileSync('pkgECF/patched/Send_Back_Record.js','utf8');const lib=src.slice(src.indexOf('function psGrades'),src.indexOf('let __RD=null;'));
const cure=new Function(lib+'\nreturn enf428Cure;')();
const R=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/33083_Panel_Cure_Normalize_1.json','utf8'))[0].main[0][0].json.cure.rounds;
const G=F['33083'].b.filter(x=>x.seat==='gemini');const d1f=G.find(x=>x.item==='COLLISION D1 vs C1'&&x.grade==='FORCED').line,d1b=G.find(x=>x.item==='COLLISION D1 vs C1'&&x.grade==='LINK BROKEN').line;
const C=(line,a)=>cure({rule:'E-COL',item:'COLLISION D1 vs C1',line},a,R);
const fails=(d1f.match(/FAILS:\s*"(.+)"\s*$/)||[])[1];
const U=[['no answer',d1f,{ans:'NO ANSWER'},'UNCURED'],['KEEP with no quotation',d1f,{ans:'KEEP',why:'The challenger cannot overcome Matthew 1:18.'},'UNCURED'],
 ['KEEP quoting the defender\'s own MEANS (the pressing side), on a FORCED line',d1f,{ans:'KEEP',why:'Matthew sets it: "the finding is placed before they came together, so no knowing precedes it."'},'UNCURED'],
 ['KEEP quoting the challenger\'s own FAILS words from [DR3] (the judge keeps the decision, ruling 428)',d1f,{ans:'KEEP',why:'The answer says "'+fails+'"'},'CURED'],
 ['CHANGE TO: RETRACTED: D1 vs C1',d1f,{ans:'CHANGE',to:'RETRACTED: D1 vs C1',why:'a rival reading'},'CURED'],
 ['CHANGE TO the pair UNDERDETERMINED',d1b,{ans:'CHANGE',to:'D1 vs C1 (Matthew 1:16): UNDERDETERMINED -- both readings are footed',why:'rival reading'},'CURED'],
 ['CHANGE TO the pair still BROKEN, no quotation',d1b,{ans:'CHANGE',to:'D1 vs C1 (Matthew 1:16): CHALLENGER LINK BROKEN -- ex hes',why:'the text decides'},'UNCURED'],
 ['LINK BROKEN line resting on an unanswered press: KEEP quoting the pressing sentence from a round (ruling 392)',F['33083'].b.find(x=>x.seat==='sol'&&x.item==='COLLISION D5 vs C1').line,{ans:'KEEP',why:'The press "though Coniah the son of Jehoiakim king of Judah were the signet upon my right hand" was not answered.'},null]];
const jr=String(R.CR3||'')+String(R.CR4||'')+String(R.DR3||'')+String(R.DR4||'');
U.forEach(([n,line,a,want])=>{const r=C(line,a);T('unit: '+n+': '+r.status,want?r.status===want:true,r.why);});
// 3. the 38 logged E-COL send-back answers, read again (rounds: the 32905 body, 33083's; 32749 has another body and is left out)
const SB=JSON.parse(fs.readFileSync('pkgECF/ecol_sendbacks.json','utf8'));const ans=r=>{const m=String(r.resp||'').match(/\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);return m?{ans:/^KEEP$/i.test(m[1].trim())?'KEEP':'CHANGE',to:(m[2]||'').trim(),why:(m[3]||'').trim()}:{ans:'NO ANSWER'};};
const rows=SB.filter(r=>+r.run>=32905).map(r=>({...r,c:cure({rule:'E-COL',item:r.item,line:r.line},ans(r),R)}));
const tally={};rows.forEach(r=>{const k=ans(r).ans+' -> '+r.c.status;tally[k]=(tally[k]||0)+1;});
T('the logged E-COL send-backs (runs 32905 to 33040, '+rows.length+' answers) are read: '+JSON.stringify(tally),rows.length===36,rows.map(r=>r.run+' '+r.seat.padEnd(7)+' '+ans(r).ans.padEnd(6)+' '+r.c.status.padEnd(8)+' '+String(r.c.why).slice(0,110)).join('\n     '));
// 4. the Record end to end: an uncured E-COL answer counts in drv_uncured; silence is counted once
const body=s=>JSON.stringify({payload:{judge_seat:s,drv_uncured:0,verdict_raw:'x'}});const PASS={bodies:[body('gemini'),body('chatgpt')],enf428_rows:[]};
const items=[{sid:'S1',rule:'E-COL',item:'COLLISION D1 vs C1',line:d1f,reason:'rival reading'},{sid:'S2',rule:'E-COL',item:'COLLISION D3 vs C1',line:G.find(x=>x.item==='COLLISION D3 vs C1'&&x.grade==='FORCED').line,reason:'rival reading'},{sid:'S3',rule:'E-COL',item:'COLLISION D4 vs C5',line:G.find(x=>x.item==='COLLISION D4 vs C5'&&x.grade==='FORCED').line,reason:'rival reading'}];
const reply='SENDBACK: S1 || KEEP || The text is plain.\nSENDBACK: S2 || CHANGE TO: RETRACTED: D3 vs C1 || "The espousal-time stands before the taking" is a reading.';
const nodes={'Judge Enforcer Record':[PASS],'Send Back Build':[{seat:'gemini',api_model:'g',run_token:'t',items,msg:'m'}],'Panel Cure Normalize 1':[{cure:{rounds:R}}],'Panel Cure Check':[{bodies:PASS.bodies}]};
const $=n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
const run=f=>new Function('$','$input','$json',fs.readFileSync(f,'utf8'))($,{all:()=>[{json:{choices:[{message:{content:reply}}]}}],first:()=>({json:{}})},{})[0].json;
const o=run('pkgECF/patched/Send_Back_Record.js');const gp=JSON.parse(o.bodies.find(b=>JSON.parse(b).payload.judge_seat==='gemini')).payload;const r3=o.sb_rows.filter(r=>r.rule==='E-COL');
T('Record: S1 (KEEP, no quotation) UNCURED and counted; S2 (RETRACTED) CURED; S3 (silent) counted once by the silence rule: gemini drv_uncured 2, AUDIT v41 names S1 only',
 gp.drv_uncured===2&&/AUDIT v41: E-COL UNCURED[^\]]*S1 \(/.test(gp.verdict_raw)&&!/AUDIT v41[^\]]*S3/.test(gp.verdict_raw)&&/SEND-BACK SILENCE[^\]]*S3/.test(gp.verdict_raw)&&r3[0].cure_status==='UNCURED'&&r3[1].cure_status==='CURED'&&o.sendback.ecol_counted.length===1,
 'drv_uncured '+gp.drv_uncured+' | rows '+r3.map(r=>r.cure_status).join(',')+' | '+gp.verdict_raw.split('\n').filter(l=>/AUDIT v4[01]/.test(l)).map(l=>l.slice(0,140)).join(' / '));
const ob=new Function('$','$input','$json',fs.readFileSync('pkgECF/base/Send_Back_Record.js','utf8'))($,{all:()=>[{json:{choices:[{message:{content:reply}}]}}],first:()=>({json:{}})},{})[0].json;
T('base Record on the same input: only the silent S3 counts (E-COL was record-only)',JSON.parse(ob.bodies.find(b=>JSON.parse(b).payload.judge_seat==='gemini')).payload.drv_uncured===1);
T('the rows use kind send_back and cure_status CURED/UNCURED/null, inside the table\'s CHECK constraints',o.sb_rows.every(r=>r.kind==='send_back'&&(r.cure_status==null||['CURED','UNCURED'].includes(r.cure_status))));
const alt=fs.readFileSync('pkgECF/patched/Alt_Send_Back_Record.js','utf8');T('Alt Record carries the same E-COL edits, reading bodies from Alt Seated',(alt.match(/pkgECF/g)||[]).length===(src.match(/pkgECF/g)||[]).length&&/ecol_counted/.test(alt)&&!/Panel Cure Check'\)\.first\(\)\.json\.bodies/.test(alt));
console.log(ok+' OK, '+bad+' FAIL');
