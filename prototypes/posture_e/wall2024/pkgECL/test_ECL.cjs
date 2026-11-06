// pkgECL test. Run from wall2024/: node pkgECL/test_ECL.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(fs.readFileSync('pkgECL/plan_ECL.json','utf8'));const LIVE=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/prewrite_lib_66adcc25.json','utf8'));const W=LIVE.data||LIVE;
const baseOf=n=>n.base.startsWith('live')?W.nodes.find(z=>z.name===n.file.replace(/\.js$/,'').replace(/_/g,' ')).parameters.jsCode:fs.readFileSync(n.base+'/'+n.file,'utf8');
T('20 nodes; base and final shas match',plan.nodes.length===20&&plan.nodes.every(n=>sha(baseOf(n))===n.base_sha&&sha(fs.readFileSync('pkgECL/patched/'+n.file,'utf8'))===n.final_sha));
const L=require('./libload.cjs');const E=L.load();const keysOf=require('./keys.cjs');const D=L.data();
// (1) PART2: one text in all 15 nodes, 13 headings, the example passes its own check
const P2=f=>{const s=fs.readFileSync('pkgECL/patched/'+f,'utf8');const i=s.indexOf('"You are an adjudicator of a debate record');const k=s.indexOf('### Commitment 13.',i);if(i<0||k<0)return null;let j=k;while(!(s[j]==='"'&&s[j-1]!=='\\'))j++;return new Function('return '+s.slice(i,j+1))();};
const PF=plan.nodes.map(n=>n.file).filter(f=>!/Send_Back|Build_Independent/.test(f));const texts=PF.map(P2);
T('PART2 with Commitment 13 in '+PF.length+' nodes, byte-identical',PF.length===15&&texts.every(t=>t&&t===texts[0]));
const HEADS=[...texts[0].matchAll(/^### (Commitment \d+\. [^\n]+)$/gm)].map(m=>m[1]);T('13 headings; the last is Commitment 13',HEADS.length===13&&/^Commitment 13\. I give the layers/.test(HEADS[12]),HEADS[12]);
const ex=texts[0].split('\n').filter(l=>/^(?:D2 vs C1|FORCED: D2 vs C1)/.test(l));const exr=ex.map(l=>E.check(l,D));
T('both example lines pass the layer check ([L1] and [L2] counted)',ex.length===2&&exr.every(c=>c.applies&&!c.faults.length&&c.l1==='COUNTED'&&c.l2==='COUNTED'),exr.map(c=>c.why).join(' / '));
const P0=W.nodes.find(z=>z.name==='Panel Build').parameters.jsCode;const old=(()=>{const i=P0.indexOf('const PART2="');return new Function('return '+P0.slice(i+12,P0.indexOf('";',P0.indexOf('### Commitment 12.',i))+1))();})();
T('PART2 changes only by the appended Commitment 13',texts[0].startsWith(old)&&texts[0].slice(old.length).startsWith('\n\n### Commitment 13.'));
// (2) the layer check, units
const u=[['FORCED, no [L1]','FORCED: D3 vs C1 -- MEANS [CR3]: "the not-knowing runs to the birth" -- ANSWER [DR3]: "It fits the link." -- FAILS: "It fits the link."',1],
 ['FORCED with GROUND [L1] counted','FORCED: D3 vs C1 -- MEANS [CR3]: "the not-knowing runs to the birth" -- ANSWER [DR3]: "It fits the link." -- FAILS: "It fits the link." -- GROUND: [L1] Matthew 1:25 "knew her not till she had brought forth her firstborn son"',0],
 ['[L1] in the ANSWER only does not count','FORCED: D3 vs C1 -- MEANS [CR3]: "x y z w" -- ANSWER [DR3]: "[L1] Matthew 1:25 \\"knew her not till she had brought forth\\"" -- FAILS: "knew her not"',1],
 ['[L1] words not in the verse','D3 vs C1 (Matthew 1:25): CHALLENGER LINK BROKEN -- x -- GROUND: [L1] Matthew 1:25 "he knew her never at all before the birth"',1],
 ['form <ref> "<words>" [L1]','D2 vs C4 (Matthew 1:20): CHALLENGER LINK BROKEN -- Matthew 1:20 says "that which is conceived in her is of the Holy Ghost" [L1]; John 3:6 says "That which is born of the flesh is flesh" [L3].',0],
 ['meaning ground, no [L2]','D4 vs C5 (Luke 1:35): CHALLENGER LINK BROKEN -- the word therefore means a result -- GROUND: [L1] Luke 1:35 "therefore also that holy thing which shall be born of thee"',1],
 ['meaning ground, [L2] in another verse','D5 vs C4 (Luke 3:23): CHALLENGER LINK BROKEN -- x -- GROUND: [L1] Luke 3:23 "being (as was supposed) the son of Joseph" [L2] kaleo (G2564, to call)',1],
 ['meaning ground, [L2] counted','D5 vs C4 (Luke 3:23): CHALLENGER LINK BROKEN -- x -- GROUND: [L1] Luke 3:23 "being (as was supposed) the son of Joseph" [L2] nomizō (G3543, to suppose)',0],
 ['unanswered press: exempt','D5 vs C1 (Jeremiah 22:24): DEFENDER LINK BROKEN (Commitment 5) -- no later defender round answers Jeremiah 22:24',0],
 ['verse not read this run: UNVERIFIABLE, not raised','D1 vs C1 (Obadiah 1:3): CHALLENGER LINK BROKEN -- x -- GROUND: [L1] Obadiah 1:3 "The pride of thine heart hath deceived thee"',0],
 ['STANDS line: not checked','D1 vs C1 (Matthew 1:16): STANDS -- x',0]];
u.forEach(([n,l,f])=>{const c=E.check(l,D);T('unit: '+n+': '+(c.faults.length?'RAISED':'not raised'),(c.faults.length>0)===(f===1),c.why);});
// (3) the replay, 33040 to 33083: every E-COL line the enforcer Build would carry, with the verses the rounds cite
const feed=require('../pkgECF/replay_feed.cjs');const RS={};
for(const r of ['33040','33060','33083']){const ctx=L.data(keysOf(r).keys);RS[r]=feed(r).b.map(x=>({...x,c:E.check(x.line,ctx)}));}
const R83=RS['33083'];const gem=R83.filter(x=>x.seat==='gemini'&&/D[1-5] vs/.test(x.item));
T('33083 gemini D1 to D5 raised (each through its FORCED line)',['D1','D2','D3','D4','D5'].every(d=>gem.some(x=>x.item.includes(d+' vs')&&x.c.faults.length)),gem.filter(x=>x.c.faults.length).map(x=>x.item+' '+x.grade).join(', '));
const kept=[].concat(...Object.values(RS)).filter(x=>x.c.applies&&!x.c.faults.length);
T('no line that already carries counted layers is raised ('+kept.length+' lines carry them)',kept.every(x=>x.c.l1==='COUNTED'&&(!x.c.meaning||x.c.l2==='COUNTED')));
for(const [r,xs] of Object.entries(RS)){console.log('  == '+r+': '+xs.length+' E-COL lines, '+xs.filter(x=>x.c.faults.length).length+' raised');xs.forEach(x=>console.log('   '+(x.c.faults.length?'RAISED ':(x.c.applies?'layers ':'exempt '))+x.seat.padEnd(8)+x.grade.padEnd(12)+String(x.item).padEnd(22)+x.c.why.slice(0,200)));}
// (4) Send Back Build: a layer fault is sent even when the enforcer agreed; the cure rule is stated
const I=(run,n)=>{const f='/mnt/project-files/wall2024/inputs/'+run+'_'+n+'.json';return fs.existsSync(f)?JSON.parse(fs.readFileSync(f,'utf8'))[0].main[0].map(x=>x.json):null;};
const jebRun=run=>{const nodes={'Panel Cure Check':I(run,'Panel_Cure_Check'),'Init Seats':I(run,'Init_Seats')||[{run_token:'r'}],'Resolve Seats':[{deepseek:{api_model:'stub'}}]};for(const k of [1,2,3]){const v=I(run,'Panel_Cure_Normalize_'+k);if(v)nodes['Panel Cure Normalize '+k]=v;}
 const $=n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
 return {nodes,out:new Function('$','$input','$json',fs.readFileSync('pkgECL/patched/Judge_Enforcer_Build.js','utf8'))($,{first:()=>({json:{}}),all:()=>[],item:{json:{}}},{}).map(x=>x.json)};};
const sbRun=run=>{const J=jebRun(run);const ctx=L.data(keysOf(run).keys);const nodes={...J.nodes,'Judge Enforcer Build':J.out,'Panel Build':I(run,'Panel_Build'),'Cited Verses':ctx.rows,'L2 Words':ctx.ow,'L2 Lexicon':ctx.lex};
 const $=n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
 const PASS={enf428_rows:[],bodies:(nodes['Panel Cure Check']&&nodes['Panel Cure Check'][0].bodies)||[]};
 return new Function('$','$input','$json',fs.readFileSync('pkgECL/patched/Send_Back_Build.js','utf8'))($,{first:()=>({json:PASS}),all:()=>[{json:PASS}]},PASS).map(x=>x.json);};
for(const r of ['33040','33060','33083']){let o;try{o=sbRun(r);}catch(e){o=[{err:String(e.stack||e).slice(0,300)}];}
 const its=o.filter(x=>!x.sb_skip&&x.items).flatMap(x=>x.items.map(i=>({seat:x.seat,...i})));const want=RS[r].filter(x=>x.c.faults.length);
 const nsent=(o[0]&&o[0].sb_not_sent)||[];
 T('Send Back Build '+r+' (enforcer agreed on all): '+its.length+' layer items sent'+(nsent.length?', '+nsent.length+' recorded NOT SENT ('+[...new Set(nsent.map(x=>x.why))].join('; ')+')':''),its.length+nsent.length===want.length&&its.every(i=>i.ecl&&i.ecl.faults.length&&/LAYER CHECK/.test(i.reason))&&o.filter(x=>x.msg).every(x=>/THE LAYER CHECK \(E-COL, ENFORCED, pkgECL/.test(x.msg)&&/A KEEP does not cure this item/.test(x.msg)),o[0]&&o[0].err||its.map(i=>i.seat+' '+i.sid+' '+i.item).join(', '));}
// (5) Send Back Record: the cure of a layer item
const recLib=f=>{const s=fs.readFileSync(f,'utf8');const ctx=D;const $=n=>({isExecuted:true,all:()=>(n==='Cited Verses'?ctx.rows:n==='L2 Words'?ctx.ow:ctx.lex).map(j=>({json:j}))});
 return new Function('$',L.LIBSRC+s.slice(s.indexOf('function psGrades'),s.indexOf('let __RD=null;'))+'\nreturn enf428Cure;')($);};
const C=recLib('pkgECL/patched/Send_Back_Record.js'),CA=recLib('pkgECL/patched/Alt_Send_Back_Record.js');
const Rr=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/33083_Panel_Cure_Normalize_1.json','utf8'))[0].main[0][0].json.cure.rounds;
const d3=R83.find(x=>x.seat==='gemini'&&x.item==='COLLISION D3 vs C1'&&x.grade==='FORCED');const it={rule:'E-COL',item:d3.item,line:d3.line,reason:'LAYER CHECK',ecl:{...d3.c,ds:false}};
const fixed=d3.line.replace(/\\"/g,'"')+' -- GROUND: [L1] Matthew 1:25 "knew her not till she had brought forth her firstborn son" | [L2] ginōskō (G1097, to know)';
const cu=[['KEEP',{ans:'KEEP',why:'The answer says "The espousal-time stands before the taking (Deuteronomy 20:7)."'},'UNCURED'],['RETRACTED',{ans:'CHANGE',to:'RETRACTED: D3 vs C1',why:'x'},'CURED'],
 ['CHANGE TO the pair UNDERDETERMINED',{ans:'CHANGE',to:'D3 vs C1 (Matthew 1:25): UNDERDETERMINED',why:'x'},'CURED'],['CHANGE TO the FORCED line with counted layers',{ans:'CHANGE',to:fixed,why:'x'},'CURED'],
 ['CHANGE TO the FORCED line still without [L1]',{ans:'CHANGE',to:d3.line,why:'x'},'UNCURED'],['no answer',{ans:'NO ANSWER'},'UNCURED']];
cu.forEach(([n,a,w])=>{const r=C(it,a,Rr),ra=CA(it,a,Rr);T('cure: '+n+': '+r.status+' (Alt '+ra.status+')',r.status===w&&ra.status===w,r.why);});
const both={...it,ecl:{...d3.c,ds:true}};const rb=C(both,{ans:'CHANGE',to:fixed,why:'x'},Rr);T('enforcer also disagreed: past the layer check the pkgECF2 both-sides test decides: '+rb.status,/^CHANGE TO keeps the break and /.test(rb.why),rb.why);
const noecl=C({rule:'E-COL',item:d3.item,line:d3.line,reason:'r'},{ans:'RETRACTED'==='x'?'':'CHANGE',to:'RETRACTED: D3 vs C1',why:'x'},Rr);T('an E-COL item with no layer fault reads as in pkgECF2: '+noecl.status,noecl.status==='CURED');
// (6) enforcer Build: same E-COL items and texts as pkgECF on 33083; the FAILS note reads a FAILS quote followed by GROUND
const go=f=>{const J=jebRun('33083');return J.out;};const A=go();const strip=o=>JSON.stringify(o.map(c=>({ids:c.ids,u:c.body.messages[1].content.split('\n\n').slice(1)})));
const B=(()=>{const nodes=jebRun('33083').nodes;const $=n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};return new Function('$','$input','$json',fs.readFileSync('pkgECF/patched/Judge_Enforcer_Build.js','utf8'))($,{first:()=>({json:{}}),all:()=>[],item:{json:{}}},{}).map(x=>x.json);})();
T('enforcer Build 33083: same calls, ids and item texts as pkgECF (only the RULES sentence and PART2 differ)',strip(A)===strip(B)&&A.length===B.length);
const jb=fs.readFileSync('pkgECL/patched/Judge_Enforcer_Build.js','utf8');const fre=new Function('return '+jb.match(/const f=l\.match\((\/--\\s\*FAILS[^;]*?\/)\);/)[1])();
T('FAILS note reads a FAILS quote with or without a GROUND tail',fre.exec('X -- FAILS: "a b c" -- GROUND: [L1] Matthew 1:25 "knew her not"')[1]==='a b c'&&fre.exec('X -- FAILS: "a "b" c"')[1]==='a "b" c');
console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
