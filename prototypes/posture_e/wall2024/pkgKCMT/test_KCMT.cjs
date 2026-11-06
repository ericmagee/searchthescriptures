// pkgKCMT test (W3 queue item 5 part 2, K-CMT to LIVE). Run from wall2024/: node pkgKCMT/test_KCMT.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const {execSync}=require('child_process');let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgKCMT/plan_KCMT.json'));
T('22 nodes: base (pkgKV) and final shas match the plan',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd('pkgKV/patched/'+n.file))===n.base_sha&&sha(rd('pkgKCMT/patched/'+n.file))===n.final_sha));
T('no node keeps K-CMT TRIAL; every node has K-CMT LIVE',plan.nodes.every(n=>{const s=rd('pkgKCMT/patched/'+n.file);return s.includes("'K-CMT':'LIVE'")&&!s.includes("'K-CMT':'TRIAL'");}));
const t=execSync('node corpus/replay_cure.cjs pkgKV pkgKCMT',{encoding:'utf8',maxBuffer:1<<26});
const rows=p=>{const out=[];let h=null;for(const l of t.split('\n')){const m=l.match(/^(pkg\w+) (\d+) (\S+): cure items/);if(m){h=m[1]===p?m[2]+' '+m[3]:null;continue;}if(h&&/^     K-/.test(l))out.push(h+' '+l.trim());}return out;};
const A=rows('pkgKV'),B=rows('pkgKCMT');const st=s=>(s.match(/: (CURED|UNCURED)\b/)||[])[1];const key=s=>s.replace(/: (CURED|UNCURED)[\s\S]*$/,'');
const mA=new Map(A.map(r=>[key(r),st(r)]));const ch=B.filter(r=>mA.get(key(r))!==st(r));
console.log('   cure rows replayed: '+B.length+'; status changes pkgKV -> pkgKCMT: '+ch.length);ch.forEach(r=>console.log('     '+r.slice(0,230)));
T('the only status changes are the 4 K-CMT engine faults, UNCURED -> CURED (32998 chatgpt, 33021 chatgpt, 33025 grok, 33040 chatgpt)',ch.length===4&&ch.every(r=>/ K-CMT /.test(r)&&st(r)==='CURED'));
const k=B.filter(r=>/ K-CMT /.test(r));T('all '+k.length+' K-CMT cure rows replay CURED',k.length>=23&&k.every(r=>st(r)==='CURED'));
const lv=p=>t.split('\n').filter(l=>l.startsWith(p+' ')&&/LIVE uncured/.test(l)).map(l=>+(l.match(/LIVE uncured (\d+)/)||[])[1]);const la=lv('pkgKV'),lb=lv('pkgKCMT');
T('no seat\'s LIVE uncured count rises with K-CMT LIVE (log replay, '+lb.length+' seats)',la.length===lb.length&&lb.every((v,i)=>v<=la[i]));
const nr=p=>execSync('node corpus/replay_cure_node.cjs '+p,{encoding:'utf8',maxBuffer:1<<26}).split('\n').filter(l=>/LIVE uncured/.test(l)).map(l=>l.replace(/^pkg\w+ /,''));const r0=nr('pkgKV'),r1=nr('pkgKCMT');const rp=l=>+(l.match(/replay (\d+)/)||[])[1];
T('whole-node Panel Cure Check on saved inputs: every seat\'s replayed LIVE uncured count equals pkgKV\'s',r0.length===r1.length&&r1.every((l,i)=>rp(l)===rp(r0[i])));
// raise: kcmtLines2024 old (pkgKV) vs new on every judge verdict text of the corpus
const KL=p=>{const t=rd(p+'/patched/Panel_Cure_Check.js');const i=t.indexOf('function kcmtGrade2024'),j=t.indexOf('// WALL-2024 Commitment 11, K-RUL');return new Function(t.slice(i,j)+'\nreturn {kcmtLines2024,kcmtGrade2024};')();};
const KO=KL('pkgKV'),KN=KL('pkgKCMT');const C=rd('corpus/texts.jsonl').split('\n').filter(Boolean).map(l=>JSON.parse(l)).filter(o=>/^(verdict_gate|alt_verdict_gate|verdict_final)$/.test(o.src));
let nIt0=0,nIt1=0;const gone=[];const lostItems=[];
for(const o of C){const T=o.jtext!=null?o.jtext:o.text;const a=KO.kcmtLines2024(T).items.length,b=KN.kcmtLines2024(T).items.length;nIt0+=a;nIt1+=b;if(a&&!b)lostItems.push(o.run+' '+o.seat+' '+o.src);
 for(const l of String(T).split('\n').map(l=>l.trim()))if(l&&KO.kcmtGrade2024(l)&&!KN.kcmtGrade2024(l))gone.push(o.run+' '+o.seat+' '+o.src+': '+l);}
console.log('   K-CMT items on '+C.length+' verdict texts: pkgKV '+nIt0+', pkgKCMT '+nIt1+'; items that go: '+(lostItems.join('; ')||'none'));console.log('   lines no longer raised: '+gone.length);gone.forEach(g=>console.log('     '+g.slice(0,200)));
T('raise: the only lines that go are negated grades ("not graded DEFENDER LINK BROKEN") and engine lines (SUPERSEDED BY CURE, RESULT derived after the send-back)',gone.length>0&&gone.every(g=>/not graded (DEFENDER|CHALLENGER) LINK BROKEN|: SUPERSEDED BY CURE|: RESULT: .*derived after the send-back/.test(g)));
T('raise: 33021 grok\'s one-line false item goes',lostItems.some(x=>/^33021 grok verdict_gate/.test(x)));
T('raise unit: a real contested grade line is still raised; a negated one is not',KN.kcmtGrade2024('KEYSTONE: D5 -- BROKEN -- the press is unanswered.')&&!KN.kcmtGrade2024('KEYSTONE: D5 -- STANDS -- Not withdrawn, and not graded DEFENDER LINK BROKEN.'));
const s=rd('pkgKCMT/patched/Panel_Cure_Check.js');const L=new Function('$','$input',s.slice(0,s.indexOf("const PP=$('Panel Payloads')"))+'\nreturn {cureVerdicts};')(()=>{throw 0},null);
const it={rule:'K-CMT',side:'JUDGE',link:'contested grades without a commitment',line:'1 contested grade line name no commitment'};const cv=txt=>L.cureVerdicts([it],{ok:true,text:txt},{},{})[0].status;
T('unit: Commitment N on the STATEMENT with a RESPONSE written cures (32998 chatgpt form)',cv('STATEMENT: K-CMT contested grades without a commitment | The original top-line BROKEN grade applied Commitment 5; that grade is now retracted.\nRESPONSE: K-CMT contested grades without a commitment | Accepted. The corrected clause is HELD-1.')==='CURED');
T('unit: a bare-rule STATEMENT (grok 33025 form) cures with a RESPONSE written',cv('STATEMENT: K-CMT | (Commitment 5) CHALLENGER CONCEDED LINKS: 3.\nRESPONSE: K-CMT | I accept the mark.')==='CURED');
T('unit: a STATEMENT with no RESPONSE line stays UNCURED',cv('STATEMENT: K-CMT contested grades without a commitment | applied Commitment 5.')==='UNCURED');
T('unit: a RESPONSE and STATEMENT naming no Commitment N stay UNCURED',cv('STATEMENT: K-CMT contested grades without a commitment | answer each with its Commitment N.\nRESPONSE: K-CMT contested grades without a commitment | Accepted.')==='UNCURED');
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
