// pkgKFF tests. Run from wall2024/: node pkgKFF/test_KFF.cjs
const fs=require('fs');const E=require('./env.cjs');const {harness}=require('../pkgGSL/harness.cjs');
let ok=0,bad=0;const t=(n,c,x)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n,x||'');}};
const P=n=>fs.readFileSync('pkgKFF/patched/'+n.replace(/ /g,'_')+'.js','utf8'),B=n=>fs.readFileSync('pkgKFF/base/'+n.replace(/ /g,'_')+'.js','utf8');
// A: the replay over every saved run (replay_KFF.cjs)
const RP=require('./replay_KFF.cjs');const hits=RP.filter(o=>o.items&&o.items.length);const keyset=[...new Set(hits.map(o=>o.run+' '+o.link))].sort();
t('A1 replay: items only on 33197 D1 vs C1, 33197 D4 vs C5, 33249 D5 vs C1 ('+RP.filter(o=>o.items).length+' FORCED lines read)',JSON.stringify(keyset)===JSON.stringify(['33197 D1 vs C1','33197 D4 vs C5','33249 D5 vs C1']),keyset);
t('A2 33197 D1 vs C1 names Deuteronomy 20:7',hits.some(o=>o.run==='33197'&&o.link==='D1 vs C1'&&/Deuteronomy 20:7/.test(o.items[0])));
// B: hand cases 962 and 974 (fixture from debate_results and kjv_verses)
const FX=JSON.parse(fs.readFileSync('pkgKFF/fixture_962_974.json','utf8'));const L=E.load(FX.rows);
for(const c of FX.cases){const r=L.kffLines(c.line,{DR3:c.DR3},FX.rows);t('B '+c.jid+' '+c.line.slice(8,18)+': one K-FF item naming '+c.ref,r.items.length===1&&r.items[0].ref===c.ref,JSON.stringify(r));}
// C: controls
const c0=FX.cases[0];const own=c0.line.replace('FAILS: "was minded to put her away privily"','FAILS: "So the row is a husband\'s intent, corrected and replaced by the taking"');
t('C1 control: FAILS of the answer\'s own sentence: no item',L.kffLines(own,{DR3:c0.DR3},FX.rows).items.length===0);
const mix='FORCED: D2 vs C3 -- MEANS (CR3): "x y z" -- ANSWER (DR3): "He was minded to put her away privily, as a just man would." -- FAILS: "He was minded to put her away privily, as a just man would."';
t('C2 control 1: own sentence embedding verse words plus own words: no item',L.kffLines(mix,{DR3:'Matthew 1:19: "was minded to put her away privily." He was minded to put her away privily, as a just man would.'},FX.rows).items.length===0);
const nov='FORCED: D2 vs C3 -- MEANS (CR3): "x y z" -- ANSWER (DR3): "Joseph was minded to put her away privily that night" -- FAILS: "was minded to put her away privily"';
t('C3 control 2: a 4+ word verse phrase the round does not quote as a verse: no item',L.kffLines(nov,{DR3:'Joseph was minded to put her away privily that night, and the row says so.'},FX.rows).items.length===0);
const sh='FORCED: D5 vs C6 -- MEANS (CR3): "x" -- ANSWER (DR3): "the son of Joseph" -- FAILS: "the son of Joseph"';
t('C4 rule (c): fewer than 4 words: no item',L.kffLines(sh,{DR3:'Luke 3:23: "the son of Joseph"'},FX.rows).items.length===0);
t('C5 verse not read: NOT CHECKED, no item',(()=>{const r=L.kffLines(c0.line,{DR3:c0.DR3},[]);return r.items.length===0&&r.report.length===1;})());
// D: parity and in-node runs
for(const RUN of ['33218','33222']){const b=harness(RUN)(B('Panel Payloads'),'Reserve Needed?'),p=harness(RUN)(P('Panel Payloads'),'Reserve Needed?');t('D parity '+RUN+' Panel Payloads: patched output equals base',JSON.stringify(b)===JSON.stringify(p));}
{const RUN='33218';const b=harness(RUN)(B('Panel Cure Check'),'Panel Cure Normalize 3'),p=harness(RUN)(P('Panel Cure Check'),'Panel Cure Normalize 3');t('D parity 33218 Panel Cure Check: patched output equals base',JSON.stringify(b)===JSON.stringify(p));}
const RUN='33249';const pp=harness(RUN)(P('Panel Payloads'),'Reserve Needed?');const it=pp[0].json.summary[1].drv.find(x=>x.rule==='K-FF');
t('E1 33249 Panel Payloads (patched): chatgpt gets one K-FF item, D5 vs C1, Matthew 1:25',!!it&&it.link==='D5 vs C1'&&it.ref==='Matthew 1:25'&&pp[0].json.summary[1].drv.filter(x=>x.rule==='K-FF').length===1);
const cb=harness(RUN,{'Panel Payloads':pp})(P('Panel Cure Build 2'),'Panel Cure Normalize 1');const cs=JSON.stringify(cb);
t('E2 cure prompt built for chatgpt carries the K-FF item with its ask',/K-FF D5 vs C1: FORCED line for D5 vs C1: its FAILS quotation/.test(cs)&&/the answer's own words in \[DR3\] that fail to show the fit/.test(cs));
fs.writeFileSync('pkgKFF/cure_prompt_33249_chatgpt.txt',(()=>{const m=(cb[0].json.cure&&cb[0].json.cure.body&&cb[0].json.cure.body.messages)||[];const u=m.filter(x=>x.role==='user').map(x=>typeof x.content==='string'?x.content:JSON.stringify(x.content)).join('\n');const i=u.indexOf('K-FF D5 vs C1');return i>=0?u.slice(Math.max(0,i-400),i+1400):cs.slice(cs.indexOf('K-FF D5')-400,cs.indexOf('K-FF D5')+1400);})());
// F: the cure block, on chatgpt's saved reply with one line added
const N2=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/33249_Panel_Cure_Normalize_2.json','utf8'));const n2=(N2[0].data||N2[0]).main[0];
const withLine=l=>{const c=JSON.parse(JSON.stringify(n2));c[0].json.reply.text='RESPONSE: K-FF D5 vs C1 | the FAILS line is written again below.\n'+l; /* the reply holds only this answer: the saved reply already carries chatgpt's own rewritten FORCED line for D5 vs C1 (its K-FC cure) */return c;};
const FL='FORCED: D5 vs C1 -- MEANS [CR3]: "Joseph\'s knowing of Mary is stated as not occurring until after the birth" -- ANSWER [DR3]: "The \\"till\\" bounds the not-knowing to the span from the taking to the birth." -- FAILS: ';
const stat=o=>{const s=JSON.stringify(o);const m=s.match(/RULE: K-FF; RESULT: (\w+); WHY: ([^\]]{0,400})/);if(m&&process.env.KFF_DBG)console.log('   ',m[0]);return m?m[1]:null;};
const run=l=>harness(RUN,{'Panel Payloads':pp,'Panel Cure Normalize 2':withLine(l)})(P('Panel Cure Check'),'Panel Cure Normalize 3');
t('F1 cure: FORCED line whose FAILS quotes the answer\'s own words: CURED',stat(run(FL+'"bounds the not-knowing to the span from the taking to the birth"'))==='CURED');
t('F2 cure: FORCED line whose FAILS is still Matthew 1:25: UNCURED',stat(run(FL+'"And knew her not till she had brought forth her firstborn son."'))==='UNCURED');
t('F3 cure: RETRACTED: D5 vs C1: CURED',stat(run('RETRACTED: D5 vs C1 -- [DR3] "bounds the not-knowing to the span from the taking to the birth" fits the link; the break quoted only the verse.\nCORRECTED RESULT: HELD-1'))==='CURED');
// G: identity: base + edits = patched, and every base is the s28 node
const plan=JSON.parse(fs.readFileSync('pkgKFF/plan_KFF.json','utf8'));const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
t('G1 '+plan.nodes.length+' bases equal live s28',plan.nodes.every(n=>sha(E.code(n.name))===n.base_sha&&sha(B(n.name))===n.base_sha));
t('G2 finals match plan shas',plan.nodes.every(n=>sha(P(n.name))===n.final_sha));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
