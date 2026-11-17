// ASK 346 (pkgLAY rev 2) offline replay on run 37719. Inputs read this turn: debate_judgments (j37719.json), debate_results rounds (r37719.json), kjv_verses (cv37719.json).
const fs=require('fs');const T=require('../tools/lib.cjs');const U=T.unpack(JSON.parse(fs.readFileSync('target_346.json')));
const CV=JSON.parse(fs.readFileSync('cv37719.json'));const RR=JSON.parse(fs.readFileSync('r37719.json'))[0];const J=JSON.parse(fs.readFileSync('j37719.json'));
const R={CR1:RR.claude_r1,DR1:RR.engine_r1,CR2:RR.claude_r2,DR2:RR.engine_r2,CR3:RR.engine_r3,DR3:RR.challenger_r3,CR4:RR.defender_r4,DR4:RR.challenger_r4};
const stub=n=>({isExecuted:false,all:()=>[],first:()=>({json:{}})});
const X=T.load(T.rb(U.L,U.M['Send Back Build']),stub);const {LAY,ECW,ECL}=X;const ctx={rows:CV,ow:[],lex:[]};
let fails=0;const ok=(name,c,info)=>{console.log((c?'ok   ':'FAIL ')+name+(info?' :: '+info:''));if(!c)fails++;};
const tx=r=>String(r||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
// P1. scan each judge's text as Send Back Build reads it (AUDIT and EXTRACTOR lines removed)
const all=[];
for(const j of J){const t=tx(j.verdict_raw).split('\n').filter(l=>!/^\s*\[(?:AUDIT|EXTRACTOR)\b/.test(l)).join('\n');const out=LAY.scan(t,R,ctx);
 for(const y of out){all.push({seat:j.judge_seat,...y});console.log('  '+j.judge_seat.padEnd(8)+(y.trial?'TRIAL ':'LIVE  ')+y.kind.padEnd(10)+' '+y.label.padEnd(10)+' '+y.why.slice(0,150));}}
const live=all.filter(y=>!y.trial).map(y=>y.seat+' '+y.kind+' '+y.label).sort();
ok('P1 LIVE items on the final 37719 text',JSON.stringify(live)===JSON.stringify(['chatgpt KEYSTONE D6','chatgpt RESULT RESULT','luna STANDS-L1 D2 vs C5','sol KEYSTONE D6','sol RESULT RESULT'].sort()),live.join(' | '));
ok('P1 luna derived RESULT and KEYSTONE exempt',!all.some(y=>y.seat==='luna'&&(y.kind==='RESULT'||y.kind==='KEYSTONE')));
const tr=all.filter(y=>y.trial);console.log('  TRIAL items:',tr.length,'of',all.length,'; UND-SIDES',tr.filter(y=>y.kind==='UND-SIDES').length,'STANDS-FIT',tr.filter(y=>y.kind==='STANDS-FIT').length);
// P1b. luna's original D3 vs C2 STANDS line (superseded after the send-back): no [L1] tag
const lunaOrig='D3 vs C2 (Matthew 1:18): STANDS -- The timing link concerns the child’s finding before the coming together and Joseph’s not knowing until birth; the roof reading does not undo those stated bounds. GROUND: CR4 answers the witness in its close round: “the row dates the finding of the child before the coming together” and Matthew 1:25 states “knew her not till she had brought forth.”';
{const o=LAY.scan(lunaOrig,R,ctx);ok('P1b luna original D3 vs C2 STANDS -> STANDS-L1 LIVE',o.length===1&&o[0].kind==='STANDS-L1'&&!o[0].trial,o.map(y=>y.kind).join(','));}
// P2. a STANDS line with a counted [L1] and a 6-word quote of the answer passes
{const l='D2 vs C5 (Isaiah 7:14): STANDS -- [CR4] answers with "the only Bible in this debate renders the row" -- GROUND: [L1] Matthew 1:23 "Behold, a virgin shall be with child" fits.';
 const q=LAY.scan(l,R,ctx);ok('P2 STANDS with counted [L1]: no LIVE item',!q.some(y=>!y.trial),q.map(y=>y.kind+(y.trial?'(T)':'')).join(',')||'none');}
// P3. a STANDS line whose [L1] words are not in the verse
{const l='D2 vs C5 (Isaiah 7:14): STANDS -- GROUND: [L1] Matthew 1:23 "Behold, a young woman shall be with child" fits.';const q=LAY.scan(l,R,ctx);ok('P3 STANDS with an [L1] not in the verse -> STANDS-L1 NOT COUNTED',q.length===1&&q[0].kind==='STANDS-L1'&&/do not stand/.test(q[0].why),q[0]&&q[0].why.slice(-60));}
// P4. KEYSTONE WITHDRAWN and derived lines exempt; KEYSTONE with label and [L1] passes
{const q=LAY.scan('KEYSTONE: D6 -- WITHDRAWN -- the defender withdrew it.\nRESULT: CHALLENGER WINS -- recomputed after the cure.\nKEYSTONE: D6 -- STANDS -- D6 vs C6 decides it. GROUND: [L1] Romans 1:3 "made of the seed of David according to the flesh"',R,ctx);ok('P4 WITHDRAWN, recomputed and a labelled [L1] KEYSTONE: no items',q.length===0,q.map(y=>y.kind).join(','));}
{const q=LAY.scan('KEYSTONE: D6 -- STANDS -- D5 vs C3 decides it. GROUND: [L1] Romans 1:3 "made of the seed of David according to the flesh"',R,ctx);ok('P4b KEYSTONE naming another link only -> KEYSTONE item',q.length===1&&q[0].kind==='KEYSTONE');}
// P5. cures
const item=(seat,kind)=>({lay:all.find(y=>y.seat===seat&&y.kind===kind),line:(all.find(y=>y.seat===seat&&y.kind===kind)||{}).line});
const C=(n,it,a,want)=>{const c=LAY.cure(it,a,ctx,R);ok('P5 '+n+' -> '+want,c.status===want,c.why);};
const lunaS=item('luna','STANDS-L1');
C('STANDS-L1 KEEP, no [L1]',lunaS,{ans:'KEEP',why:'the defender answered the witness'},'UNCURED');
C('STANDS-L1 CHANGE TO with counted [L1]',lunaS,{ans:'CHANGE',to:'D2 vs C5 (Isaiah 7:14): STANDS -- GROUND: [L1] Matthew 1:23 "Behold, a virgin shall be with child" and CR4 answers.'},'CURED');
C('STANDS-L1 CHANGE TO with [L1] not in the verse',lunaS,{ans:'CHANGE',to:'D2 vs C5 (Isaiah 7:14): STANDS -- GROUND: [L1] Matthew 1:23 "Behold, a maiden shall be with child".'},'UNCURED');
C('STANDS-L1 CHANGE TO RETRACTED',lunaS,{ans:'CHANGE',to:'RETRACTED: D2 vs C5'},'CURED');
C('STANDS-L1 regraded UNDERDETERMINED with [L1]',lunaS,{ans:'CHANGE',to:'D2 vs C5 (Isaiah 7:14): UNDERDETERMINED -- GROUND: [L1] Isaiah 7:14 "Behold, a virgin shall conceive, and bear a son"'},'CURED');
C('STANDS-L1 NO ANSWER',lunaS,{ans:'NO ANSWER'},'UNCURED');
const cK=item('chatgpt','KEYSTONE'),cR=item('chatgpt','RESULT');
C('KEYSTONE CHANGE TO label + [L1]',cK,{ans:'CHANGE',to:'KEYSTONE: D6 -- STANDS -- D6 vs C6 decides it. GROUND: [L1] Romans 1:3 "made of the seed of David according to the flesh"'},'CURED');
C('KEYSTONE CHANGE TO other link label',cK,{ans:'CHANGE',to:'KEYSTONE: D6 -- STANDS -- D5 vs C3 decides it. GROUND: [L1] Romans 1:3 "made of the seed of David according to the flesh"'},'UNCURED');
C('KEYSTONE CHANGE TO RETRACTED',cK,{ans:'CHANGE',to:'RETRACTED'},'UNCURED');
C('KEYSTONE KEEP whose sentence gives label and [L1]',cK,{ans:'KEEP',why:'D6 vs C6 decides it: [L1] Acts 2:30 "of the fruit of his loins, according to the flesh"'},'CURED');
C('RESULT CHANGE TO label + [L1]',cR,{ans:'CHANGE',to:'RESULT: DEFENDER WINS -- D6 vs C6 and D3 vs C1 decide it. GROUND: [L1] Matthew 1:25 "And knew her not till she had brought forth her firstborn son"'},'CURED');
C('RESULT CHANGE TO no label',cR,{ans:'CHANGE',to:'RESULT: DEFENDER WINS -- GROUND: [L1] Matthew 1:25 "And knew her not till she had brought forth her firstborn son"'},'UNCURED');
const und=all.find(y=>y.kind==='UND-SIDES');const uI={lay:und,line:und&&und.line};
C('UND-SIDES CHANGE TO a STANDS line',uI,{ans:'CHANGE',to:'D1 vs C1 (John 3:6): STANDS -- GROUND: [L1] John 3:6 "That which is born of the flesh is flesh"'},'CURED');
C('UND-SIDES KEEP, no quotes',uI,{ans:'KEEP',why:'the record leaves it open'},'UNCURED');
// UND-SIDES cure by quoting both sides: take 6-word runs from each side's own words
{const w=s=>{const segs=String(s).replace(/"[^"\n]{8,}?"|“[^”\n]{8,}?”/g,' | ').replace(/[*_`\[\]]+/g,' ').split(/[|\n]/).map(x=>x.toLowerCase().replace(/['’]/g,'').replace(/[^a-z ]+/g,' ').replace(/\s+/g,' ').trim()).filter(x=>x.split(' ').length>=12);return segs[3].split(' ').slice(2,8).join(' ');};const cw=w(R.CR3),dw=w(R.DR3);console.log('  quoting:',cw,'/',dw);
 C('UND-SIDES CHANGE TO quoting 6 words of each side',uI,{ans:'CHANGE',to:und.line.split(' -- GROUND')[0]+' -- defender "'+cw+'" and challenger "'+dw+'" -- GROUND: [L1] John 3:6 "That which is born of the flesh is flesh"'},'CURED');}
// P6. rule() text names the enforcement state
for(const k of ['STANDS-L1','UND-SIDES','RESULT','KEYSTONE']){const y=all.find(z=>z.kind===k);const r=LAY.rule({lay:y});ok('P6 rule '+k,(y.trial?/TRIAL for one run/:/ENFORCED, pkgLAY/).test(r),r.slice(0,90));}
// P7. ECW HOLD on: an E-HOLD DISAGREE toward UNDERDETERMINED goes through the gate; HOLD flag value
ok('P7 ECW HOLD=true in target',/const HOLD=true;/.test(U.L[3500]));
{const g=ECW.gate({rule:'E-HOLD'},{v:'DISAGREE',right:'UNDERDETERMINED'},ctx);ok('P7 E-HOLD toward UNDERDETERMINED is gated',g.applies!==false||g.applies===undefined?true:false,JSON.stringify(g).slice(0,160));
 const g2=ECW.gate({rule:'E-HOLD'},{v:'DISAGREE',right:'STANDS'},ctx);ok('P7 E-HOLD toward STANDS is not gated',g2.applies===false);}
// P8. engine-derived lines in the new format: every live reader still reads them, and LAY exempts them
const K1='KEYSTONE: D6 -- STANDS -- derived by the engine from the collision grades of D6 (none DEFENDER LINK BROKEN) after the change of S7 (E-APPLY, W3 2362) -- GROUND: D6 vs C6 | [L1] Romans 1:3 “which was made of the seed of David according to the flesh” (the labels and [L1] of the lines it is derived from; pkgLAY)';
const R1='RESULT: UNDERDETERMINED -- derived after the send-back from the judge\'s own changed lines (S1, S7): HELD-1. GROUND: D6 vs C6, D3 vs C2 | [L1] Romans 1:3 “which was made of the seed of David according to the flesh” (the labels and [L1] of the lines it is derived from; pkgLAY)';
ok('P8 LAY exempts derived lines',LAY.scan(K1+'\n'+R1,R,ctx).length===0);
const res=[['L280 KEYSTONE',/^KEYSTONE\s*:\s*(D\d+)\s*(?:--|—|–|-|:)?\s*(STANDS|BROKEN|WITHDRAWN)\b/,K1,'D6|STANDS'],['L282 RESULT',/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)\b/,R1,'UNDERDETERMINED'],
 ['L605 derived RESULT',/^RESULT\s*:.*\bderived after the send-back\b/i,R1,''],['L721 KEYSTONE',/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|-|:)\s*(STANDS|BROKEN|WITHDRAWN)\b\s*(?:--|—|-|:)?\s*(.*)$/i,K1,'6|STANDS'],
 ['L2033 KS',/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|–|-|:)\s*(STANDS|BROKEN|WITHDRAWN)\b/i,K1,'6|STANDS'],['L2255 link',/KEYSTONE\s*:\s*\**\s*(D\d+)\b/i,K1,'D6'],
 ['L3093 KEYSTONE',/^KEYSTONE\s*:\s*([DC]\d+)\s*(?:--|—|–|-)\s*([A-Z][A-Z -]*?)\b(?:\s*(?:--|—|–|-)\s*([\s\S]*))?$/,K1,'D6|STANDS'],['L3137 KEYSTONE',/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|–|-)\s*(WITHDRAWN|BROKEN|STANDS)\b/,K1,'6|STANDS']];
for(const [n,re,s,want] of res){const m=s.match(re);ok('P8 '+n,!!m&&(want===''||m.slice(1,3).filter(Boolean).join('|')===want),m?m.slice(1,3).join('|'):'no match');}
// rcLines reads the derived KEYSTONE and RESULT as key and result, not as collision lines
{const G=T.load(T.rb(U.L,U.M['Gate Build']),stub);const P=G.rcLines(K1+'\n'+R1+'\nD6 vs C6 (Romans 1:3): UNDERDETERMINED -- GROUND: [L1] Romans 1:3 "made of the seed of David according to the flesh"');
 ok('P8 rcLines: key and result read, one collision line',!!P.key&&!!P.result&&P.col.length===1,'key '+!!P.key+' result '+!!P.result+' col '+P.col.length);
 // run the E1 and E2 derived-line expressions on rcLines' own collision items
 const col=P.col.concat([{link:'D6 vs C6',grade:'DEFENDER LINK BROKEN',raw:'D6 vs C6 (Romans 1:3): DEFENDER LINK BROKEN -- GROUND: [L1] Romans 1:3 “which was made of the seed of David according to the flesh”'}]);
 const e1=U.L[1465].match(/\+\(\(\)=>\{const dec=d==='BROKEN'\?brl:kc;[\s\S]*?pkgLAY\)':'';\}\)\(\)/)[0].slice(1);const e2=U.L[1496].match(/\+\(\(\)=>\{const dec0=[\s\S]*?pkgLAY\)':'';\}\)\(\)/)[0].slice(1);
 const g1=new Function('d','brl','kc','return '+e1)('BROKEN',col.filter(z=>z.grade==='DEFENDER LINK BROKEN'),col);const g2=new Function('col','return '+e2)(col);
 console.log('  E1 ->',g1);console.log('  E2 ->',g2);
 ok('P8 E1 derived KEYSTONE GROUND carries label and [L1]',/GROUND: D6 vs C6 \| \[L1\] Romans 1:3/.test(g1));ok('P8 E2 derived RESULT GROUND carries label and [L1]',/GROUND: D6 vs C6 \| \[L1\] Romans 1:3/.test(g2));
 ok('P8 E1 with no lines adds nothing',new Function('d','brl','kc','return '+e1)('STANDS',[],[])==='');}
// P9. Commitment 13 heading in every copy; Accept Check and Accept Final parse
{const d=JSON.parse(fs.readFileSync('target_346.json'));const acorn=require('../tools/node_modules/acorn');
 for(const n of ['Accept Check','Accept Final','Enforcer Build','Panel Build']){const nd=d.nodes.find(x=>x.name===n);const s=nd.parameters.jsCode||JSON.stringify(nd.parameters);let p=true;if(nd.parameters.jsCode){try{acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});}catch(e){p=false;}}
  ok('P9 '+n+' has Commitment 13 and parses',/Commitment 13\. I give the layers of every grade\./.test(s)&&p);}}
console.log('\nFAILS',fails);
