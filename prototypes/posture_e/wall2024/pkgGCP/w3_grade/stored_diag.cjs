// W3: why a stored cure count does or does not come off. usage: node stored_diag.cjs <export> <workflow> <seat>
const fs=require('fs');const L=require('./lib.cjs');const X=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const rd=(X.data||X).resultData.runData;const seat=process.argv[4];
const stored=k=>rd[k]?(rd[k][rd[k].length-1].data||{}).main:null;const G=L(process.argv[3],stored);
const SB=stored('Send Back Record')[0][0].json,GR=stored('Gate Record')[0][0].json,PB0=stored('Panel Build')[0][0].json;
const p=JSON.parse(SB.bodies.find(b=>JSON.parse(b).payload.judge_seat===seat)).payload;const its=(GR.sb_items||SB.sb_items||[]).filter(x=>x.seat===seat);
console.log('items',its.map(x=>x.sid+':'+x.rule+':'+x.ans+':'+String(x.item).slice(0,26)).join(' | '));
const j=PB0.judges.find(q=>q.seat===seat);const PT=G.gatePromptText2024(j.body);const ctx={R:G.ciRounds(PT),DL:G.drvLinks(PT),ask:PT.includes('CITATION CHECK')};const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
const R=G.sbApply2024(seat,p.verdict_raw,F,its,ctx.R);const K=G.gateNewK2024(G.cureJText(p.verdict_raw,true),R.text,F,R.fields,ctx);const k=x=>x.rule+'|'+(x.link||(x.side+' STANDING'));
console.log('applied',JSON.stringify(R.applied));console.log('before',(K.a||[]).map(k).join(' ; '));console.log('after ',(K.b||[]).map(k).join(' ; '));
const want=new RegExp(process.argv[5]||'D\\d+ vs C\\d+');R.rp.forEach(([o,n])=>{if(want.test(o))console.log('RP  '+String(o).slice(0,700)+'\n -> '+String(n).slice(0,900)+'\n');});
(p.verdict_raw.match(/\[AUDIT v21: DEBATE RULE VIOLATION REPORT[^\n]*RESULT: UNCURED[^\n]*/g)||[]).filter(l=>!/TRIAL rule/.test(l)).forEach(l=>console.log('CURE '+l.slice(0,1200)+'\n'));
