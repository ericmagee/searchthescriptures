// pkgPMR test. Run from wall2024/: node pkgPMR/test_PMR.cjs   (reads the repo and /mnt/project-files/wall2024 only)
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');const cp=require('child_process');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgPMR/plan_PMR.json'));const LIVE=JSON.parse(rd('/mnt/project-files/wall2024/fetchback_live_s12.json'));
T('2 nodes; base = live d5375c6e; shas match',plan.nodes.length===2&&plan.nodes.every(n=>sha(LIVE.nodes.find(z=>z.name===n.name).parameters.jsCode)===n.base_sha&&sha(rd('pkgPMR/base/'+n.file))===n.base_sha&&sha(rd('pkgPMR/patched/'+n.file))===n.final_sha));
// ---- A. the scan replay: 2818 items, exactly one alt added (33175 CHALLENGER R3 "(2:4)") ----
const sc=cp.execFileSync('node',['pkgPMR/scan_PMR.cjs']).toString();
T('A1 scan replay: only 33175 CHALLENGER R3 2 Samuel 2:4 gains alt Luke 2:4; no other field of any item changes',/items scanned \(base\): 2818\n33175 \(R3 only\) CHALLENGER R3 2 Samuel 2:4 alt none -> Luke 2:4 \| "the house and lineage of David"\n?$/.test(sc),sc.trim().split('\n').slice(0,4).join(' / '));
// ---- B. Quote Compare + Quote Report on that item, with the verses as kjv_verses holds them (read 2026-11-07) ----
const V=[{book:'Luke',chapter:2,verse:4,text:'And Joseph also went up from Galilee, out of the city of Nazareth, into Judaea, unto the city of David, which is called Bethlehem; (because he was of the house and lineage of David:)'},
 {book:'2 Samuel',chapter:2,verse:4,text:'And the men of Judah came, and there they anointed David king over the house of Judah. And they told David, saying, [That] the men of Jabeshgilead [were they] that buried Saul.'}];
const scanF=(file,F)=>new Function('$','$input',rd(file))(n=>n==='Regrade Load'?{isExecuted:false,first:()=>({json:{}})}:{first:()=>({json:F})},null)[0].json;
const R75=JSON.parse(rd('pkgUNX/replay_rows.json')).find(r=>r.run.includes('33175'));const F75={cr3:R75.e3,dr3:R75.c3};
const node=n=>LIVE.nodes.find(z=>z.name===n).parameters.jsCode;
const pipe=scanFile=>{const S=scanF(scanFile,F75);const one={...S,items:S.items.filter(i=>i.ref==='2 Samuel 2:4')};
 const QC=new Function('$','$input',node('Quote Compare'))(n=>n==='Citation Scan'?{first:()=>({json:one})}:{all:()=>V.map(j=>({json:j})),first:()=>({json:V[0]})},null)[0].json;
 const QR=new Function('$','$input',node('Quote Report'))(n=>{if(n==='Quote Compare')return {first:()=>({json:QC})};if(n==='Find Words')return {all:()=>[]};if(n==='Citation Scan')return {first:()=>({json:one})};throw new Error('no '+n);},null)[0].json;return {QC,QR};};
const b=pipe('pkgPMR/base/Citation_Scan.js'),p=pipe('pkgPMR/patched/Citation_Scan.js');const bi=b.QR.items[0],pi=p.QR.items[0];
T('B1 base reproduces the stored 33175 row: CHALLENGER R3 2 Samuel 2:4 WORDING DIFFERS FROM 2 Samuel 2:4',bi&&bi.side==='CHALLENGER'&&bi.round==='R3'&&bi.ref==='2 Samuel 2:4'&&bi.status==='WORDING DIFFERS FROM 2 Samuel 2:4',JSON.stringify(bi&&{ref:bi.ref,status:bi.status}));
T('B2 pkgPMR: the quote is bound to Luke 2:4 and MATCHES, with rebound_from 2 Samuel 2:4',pi&&pi.ref==='Luke 2:4'&&pi.status==='MATCHES'&&pi.rebound_from==='2 Samuel 2:4',JSON.stringify(pi&&{ref:pi.ref,status:pi.status,rebound_from:pi.rebound_from}));
// ---- C. units of the alt reader ----
const unitF=(f,txt)=>scanF(f,{cr3:'DEFENDER ROUND 3\n\n'+txt+'\n',dr3:''}).items.map(i=>({ref:i.ref,alt:i.alt?i.alt.ref:null}));
const unit=txt=>unitF('pkgPMR/patched/Citation_Scan.js',txt);const same=txt=>{const a=JSON.stringify(unitF('pkgPMR/base/Citation_Scan.js',txt)),b=JSON.stringify(unit(txt));return a===b?'':'base '+a+' patched '+b;};
let u=unit('The seed is "which shall proceed out of thy bowels" (2 Samuel 7:12), carried in "the house and lineage of David" that Luke gives to Joseph (2:4).');
T('C1 the 33175 form: "(2:4)" keeps 2 Samuel and gains alt Luke 2:4',u.some(i=>i.ref==='2 Samuel 2:4'&&i.alt==='Luke 2:4'),JSON.stringify(u));
u=unit('Zacharias named him, as Luke 1:13 says, "and thou shalt call his name John" (1:13).');
{const t='Zacharias named him, as Luke 1:13 says, "and thou shalt call his name John" (1:13).';const d=same(t);T('C2 a person name (John) is not read as a book: patched alt list equals base',!d&&u.every(i=>i.alt!=='John 1:13'),d||JSON.stringify(u));}
u=unit('Matthew 1:20 says it: "that which is conceived in her is of the Holy Ghost" (1:20).');
{const d=same("Matthew 1:20 says it: \"that which is conceived in her is of the Holy Ghost\" (1:20).");T('C3 the same book as the bound one: pkgPMR adds no alt (patched equals base)',!d,d||'same');}
u=unit('Luke 1:27 names him; but Matthew 1:16 has "Joseph the husband of Mary" (1:16).');
{const d=same("Luke 1:27 names him; but Matthew 1:16 has \"Joseph the husband of Mary\" (1:16).");T('C4 a book written with its own chapter:verse is a reference, not a plain word: no alt from it: pkgPMR adds no alt (patched equals base)',!d,d||'same');}
u=unit('As Isaiah wrote. Then Luke 1:31 has "thou shalt conceive in thy womb" (1:31).');
{const d=same("As Isaiah wrote. Then Luke 1:31 has \"thou shalt conceive in thy womb\" (1:31).");T('C5 a book named in an earlier sentence is outside the clause: pkgPMR adds no alt (patched equals base)',!d,d||'same');}
// ---- D. Build Save Body: a stored row that is not a match carries its quote and alt; a match row is unchanged ----
const cc=f=>{const s=rd(f);const i=s.indexOf('const __CC=(()=>');const j=s.indexOf('})();',i)+5;return s.slice(i,j);};
const QRm={checked:3,matches:1,not_checked:1,mismatches:1,items:[{side:'CHALLENGER',round:'R3',ref:'2 Samuel 2:4',status:'WORDING DIFFERS FROM 2 Samuel 2:4',link:6,load_bearing:false,quote:'the house and lineage of David',alt:{ref:'Luke 2:4'}},{side:'DEFENDER',round:'R1',ref:'Matthew 1:18',status:'MATCHES',link:null,load_bearing:false,quote:'x y z'},{side:'DEFENDER',round:'R2',ref:'Luke 1:34',status:'NOT CHECKED',reason:'too short',quote:'therefore also'}]};
const run=f=>new Function('$',cc(f)+';return __CC;')(n=>({first:()=>({json:QRm})}));const B=run('pkgPMR/base/Build_Save_Body.js'),P=run('pkgPMR/patched/Build_Save_Body.js');
T('D1 base: the mismatch row has no quote (the 33175 stored row)',!('quote' in B.items[0]));
T('D2 pkgPMR: the mismatch row carries its quote and the alt it tried',P.items[0].quote==='the house and lineage of David'&&P.items[0].alt==='Luke 2:4');
T('D3 pkgPMR: the MATCHES row is unchanged; the NOT CHECKED row carries its quote',JSON.stringify(P.items[1])===JSON.stringify(B.items[1])&&P.items[2].quote==='therefore also');
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
