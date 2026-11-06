// pkgKS3 test (W3 queue item 5, K-S3 to LIVE). Run from wall2024/: node pkgKS3/test_KS3.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const {execSync}=require('child_process');let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgKS3/plan_KS3.json'));
T('22 nodes: base (pkgKC2) and final shas match the plan',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd('pkgKC2/patched/'+n.file))===n.base_sha&&sha(rd('pkgKS3/patched/'+n.file))===n.final_sha));
T('no node keeps K-S3 TRIAL; every node has K-S3 LIVE',plan.nodes.every(n=>{const s=rd('pkgKS3/patched/'+n.file);return s.includes("'K-S3':'LIVE'")&&!s.includes("'K-S3':'TRIAL'");}));
// 1. log replay over every cure row of the 7 corpus runs (panel and alternate seats; W2's corpus/replay_cure.cjs)
const t=execSync('node corpus/replay_cure.cjs pkgKC2 pkgKS3',{encoding:'utf8',maxBuffer:1<<26});
const rows=p=>{const out=[];let h=null;for(const l of t.split('\n')){const m=l.match(/^(pkg\w+) (\d+) (\S+): cure items/);if(m){h=m[1]===p?m[2]+' '+m[3]:null;continue;}if(h&&/^     K-/.test(l))out.push(h+' '+l.trim());}return out;};
const A=rows('pkgKC2'),B=rows('pkgKS3');const st=s=>(s.match(/: (CURED|UNCURED)\b/)||[])[1];const key=s=>s.replace(/: (CURED|UNCURED)[\s\S]*$/,'');
const mA=new Map(A.map(r=>[key(r),st(r)]));const ch=B.filter(r=>mA.get(key(r))!==st(r));
console.log('   cure rows replayed: '+B.length+'; status changes pkgKC2 -> pkgKS3: '+ch.length);ch.forEach(r=>console.log('     '+r.slice(0,230)));
T('every status change is a K-S3 item UNCURED -> CURED',ch.length>0&&ch.every(r=>/ K-S3 /.test(r)&&st(r)==='CURED'));
const ks=B.filter(r=>/ K-S3 /.test(r));const ku=ks.filter(r=>st(r)!=='CURED');console.log('   K-S3 rows: '+ks.length+'; UNCURED under the 6-word bar: '+ku.length);ku.forEach(r=>console.log('     U '+r.slice(0,260)));T('K-S3 rows replayed (57 log items; 33040 single counted once more)',ks.length>=57);
const lv=p=>t.split('\n').filter(l=>l.startsWith(p+' ')&&/LIVE uncured/.test(l)).map(l=>+(l.match(/LIVE uncured (\d+)/)||[])[1]);const la=lv('pkgKC2'),lb=lv('pkgKS3');
T('no seat\'s LIVE uncured count rises with K-S3 LIVE (per seat, log replay)',la.length===lb.length&&lb.every((v,i)=>v<=la[i]));
// 2. whole-node Panel Cure Check replay on saved inputs
const nr=p=>execSync('node corpus/replay_cure_node.cjs '+p,{encoding:'utf8',maxBuffer:1<<26}).split('\n').filter(l=>/LIVE uncured/.test(l)).map(l=>l.replace(/^pkg\w+ /,''));const r0=nr('pkgKC2'),r1=nr('pkgKS3');
r1.forEach((l,i)=>console.log('   pkgKC2 '+r0[i].replace(/^.*LIVE/,'LIVE')+' | pkgKS3 '+l));const rp=l=>+(l.match(/replay (\d+)/)||[])[1];
T('whole-node Panel Cure Check on saved inputs: every seat\'s replayed LIVE uncured count equals pkgKC2\'s (K-S3 LIVE adds none)',r0.length===r1.length&&r1.every((l,i)=>rp(l)===rp(r0[i])));
// 3. units
const s=rd('pkgKS3/patched/Panel_Cure_Check.js');const L=new Function('$','$input',s.slice(0,s.indexOf("const PP=$('Panel Payloads')"))+'\nreturn {cureVerdicts};')(()=>{throw 0},null);
const it={rule:'K-S3',side:'DEFENDER',link:'S3 DEFENDER CR4: #1',line:'DEFENDER CR4: I grant the form.'};const cv=txt=>L.cureVerdicts([it],{ok:true,text:txt},{},{})[0].status;
T('unit: STATEMENT TOUCHES NO LINK with a reason cures when a RESPONSE line is written (33021 chatgpt form)',cv('STATEMENT: K-S3 S3 DEFENDER CR4: #1 | TOUCHES NO LINK: granting the verb form surrenders no declared link.\nRESPONSE: K-S3 S3 DEFENDER CR4: #1 | Accepted as a grant of the form, not a surrender of the link.')==='CURED');
T('unit: a STATEMENT with no RESPONSE line stays UNCURED (the general rule: every item needs its RESPONSE)',cv('STATEMENT: K-S3 S3 DEFENDER CR4: #1 | TOUCHES NO LINK: granting the verb form surrenders no declared link.')==='UNCURED');
T('unit: RESPONSE NOT HELD with a reason that quotes the flagged sentence (all of it, under 6 words) cures',cv('RESPONSE: K-S3 S3 DEFENDER CR4: #1 | NOT HELD: [CR4] says "I grant the form" and keeps the claim.')==='CURED');
T('unit: RESPONSE NOT HELD with a reason but no quote of the flagged sentence does not cure (W3 6-word bar)',cv('RESPONSE: K-S3 S3 DEFENDER CR4: #1 | NOT HELD: [CR4] keeps the claim and grants only the form.')==='UNCURED');
{const it2={rule:'K-S3',side:'DEFENDER',link:'S3 DEFENDER CR4: #1',line:'DEFENDER CR4: I do not claim that the pattern by itself denies a father.'};const c2=txt=>L.cureVerdicts([it2],{ok:true,text:txt},{},{})[0].status;
 T('unit: 6 words in a row of a longer flagged sentence cure; 5 do not',c2('RESPONSE: K-S3 S3 DEFENDER CR4: #1 | NOT HELD: [CR4] says "the pattern by itself denies a" yet keeps D2.')==='CURED'&&c2('RESPONSE: K-S3 S3 DEFENDER CR4: #1 | NOT HELD: [CR4] says "the pattern by itself denies" yet keeps D2.')==='UNCURED');}
T('unit: a bare NOT HELD does not cure',cv('RESPONSE: K-S3 S3 DEFENDER CR4: #1 | NOT HELD')==='UNCURED');
T('unit: no answer does not cure',cv('RESPONSE: K-W x | CONCEDED')==='UNCURED');
T('unit: TOUCHES NO LINK with under 5 words does not cure',cv('STATEMENT: K-S3 S3 DEFENDER CR4: #1 | TOUCHES NO LINK: no link.')==='UNCURED');
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
