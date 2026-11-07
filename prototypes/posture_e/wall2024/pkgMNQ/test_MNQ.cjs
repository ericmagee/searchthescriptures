// pkgMNQ test. Run from wall2024/: node pkgMNQ/test_MNQ.cjs
// 1. 33461 Send Back Record, base s49 vs patched, on the saved input: sol's 4 E-MNP rows UNCURED -> CURED, every other row unchanged.
// 2. Units on the cure's MEANS read: inner quotes, curly quotes, no quotes, and a MEANS that truly differs (stays UNCURED).
// 3. Replay: every saved run 33218+ x 4 Send Back nodes, base vs patched; every changed output listed.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s49.json';
const B0=f=>fs.readFileSync(__dirname+'/base_s49/'+f,'utf8'),P1=f=>fs.readFileSync(__dirname+'/patched/'+f,'utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
const fin=(RUN,nm)=>{const fe=feeder(BASEW,nm);return [...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));};
{const H=harness('33461');const i=fin('33461','Send Back Record');const a=H(B0('Send_Back_Record.js'),i)[0].json,b=H(P1('Send_Back_Record.js'),i)[0].json;
 const mn=o=>o.sb_rows.filter(r=>r.seat==='sol'&&r.rule==='E-MNP');const ua=mn(a).filter(r=>r.cure_status==='UNCURED'),ub=mn(b).filter(r=>r.cure_status==='UNCURED');
 T(ua.length===4,'33461 base: sol E-MNP UNCURED '+ua.length+' ('+ua.map(r=>r.item.replace(/ANSWER CHECK | \(MEANS NONE\)/g,'')).join('; ')+')');
 T(ub.length===0&&mn(b).length===mn(a).length,'33461 patched: sol E-MNP UNCURED '+ub.length+' of '+mn(b).length);
 T(mn(b).filter(r=>ua.some(x=>x.item===r.item)).every(r=>/graded MEETS on the real MEANS/.test(r.cure_reason||'')),'the 4 now read "graded MEETS on the real MEANS (...)": '+JSON.stringify((mn(b).find(r=>r.item===ua[0].item)||{}).cure_reason||'').slice(-140));
 const oth=o=>JSON.stringify(o.sb_rows.filter(r=>!(r.seat==='sol'&&r.rule==='E-MNP'&&ua.some(x=>x.item===r.item))).map(r=>[r.seat,r.rule,r.item,r.cure_status,r.cure_reason]));T(oth(a)===oth(b),'33461 every other Send Back row unchanged ('+(a.sb_rows.length-4)+')');
 const s=o=>JSON.stringify(o,(k,v)=>k==='at'||k==='sb_rows'?undefined:v);const sa=s(a),sb=s(b);let j=0;while(sa[j]===sb[j]&&j<sa.length)j++;log('   other fields first differ @'+j+(sa===sb?' (none)':': '+sa.slice(Math.max(0,j-120),j+120)+' || '+sb.slice(Math.max(0,j-120),j+160)));}
{const H=harness('33461');const i=fin('33461','Send Back Record');const du=o=>o[0].json.bodies.map(x=>{const j=JSON.parse(x);const q=j.payload||j;return q.judge_seat+':'+q.drv_uncured;}).join(' ');
 const a=du(H(B0('Send_Back_Record.js'),i)),b=du(H(P1('Send_Back_Record.js'),i));T(/sol:4/.test(a)&&/sol:0/.test(b),'drv_uncured per seat, base '+a+' -> patched '+b);}
// 2. units: pull cure() out of the patched node and run it
{const src=P1('Send_Back_Record.js');const re=/--\s*MEANS\s*:\s*([\s\S]*?)\s*--\s*ANSWER\s*:/;
 const rd=to=>{const mm=to.match(re)||to.match(/--\s*MEANS\s*:\s*([\s\S]*?)\s*--/);return mm?mm[1].trim().replace(/^["“]([\s\S]*)["”]$/,'$1'):'';};
 T(src.includes(String.raw`to.match(/--\s*MEANS\s*:\s*([\s\S]*?)\s*--\s*ANSWER\s*:/)`),'patched node carries the span read');
 for(const [to,want] of [['ANSWER CHECK: Ezra 2:61 -- [DR3] -- MEANS: "Scripture has a man called by his wife\'s father\'s name, so \\"of Heli\\" fits the woman\'s father." -- ANSWER: "x" -- MEETS','Scripture has a man called by his wife\'s father\'s name, so \\"of Heli\\" fits the woman\'s father.'],
  ['ANSWER CHECK: Luke 1:13 -- [CR4] -- MEANS: “the husband is named.” -- ANSWER: "y" -- MEETS','the husband is named.'],['ANSWER CHECK: Luke 1:13 -- [CR4] -- MEANS: the husband is named -- ANSWER: y -- MEETS','the husband is named']])
  T(rd(to)===want,'unit MEANS read '+JSON.stringify(to.slice(0,50))+' -> '+JSON.stringify(rd(to).slice(0,60)));}
// 3
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>+r>=33218).sort();const st=x=>JSON.stringify(x,(k,v)=>k==='at'||k==='created_at'?undefined:v);let n=0;const flips=[];
for(const RUN of runs){const H=harness(RUN);for(const nm of ['Send Back Build','Send Back Record','Alt Send Back Build','Alt Send Back Record']){if(!fs.existsSync(D+RUN+'_'+nm.replace(/ /g,'_')+'.json'))continue;const i=fin(RUN,nm);if(!i)continue;const f=nm.replace(/ /g,'_')+'.js';
 let a,b,e0=null,e1=null;try{a=H(B0(f),i);}catch(x){e0=String(x.message).slice(0,100);}try{b=H(P1(f),i);}catch(x){e1=String(x.message).slice(0,100);}
 if(e0||e1){T(e0===e1,RUN+' '+nm+' same error both ('+e0+')');continue;}n++;const sa=st(a),sb=st(b);if(sa===sb)continue;let j=0;while(sa[j]===sb[j])j++;flips.push(RUN+' '+nm+' @'+j+'\n   base:    '+sa.slice(Math.max(0,j-150),j+150)+'\n   patched: '+sb.slice(Math.max(0,j-150),j+200));}}
log('node runs compared: '+n+'; changed outputs: '+flips.length);for(const f of flips)log(f);log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_MNQ.txt',out.join('\n')+'\n');
