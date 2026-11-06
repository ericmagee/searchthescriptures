// pkgCR test (W3 2325). Run from wall2024/ after pkgCR/build_CR.py: node pkgCR/test_CR.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const plan=JSON.parse(rd('pkgCR/plan_CR.json'));
T('19 nodes: base and final shas match the plan',plan.nodes.length===19&&plan.nodes.every(n=>sha(rd(n.base+'/patched/'+n.file))===n.base_sha&&sha(rd('pkgCR/patched/'+n.file))===n.final_sha));
T('every node parses as an n8n Code node body',plan.nodes.every(n=>{try{new Function('$','$input',rd('pkgCR/patched/'+n.file));return true;}catch(e){console.log('   '+n.file+': '+e.message);return false;}}));
T('each node differs from its base only by the reader line and the label',plan.nodes.every(n=>{const a=rd(n.base+'/patched/'+n.file).split('\n'),b=rd('pkgCR/patched/'+n.file).split('\n');return a.length===b.length&&a.filter((l,i)=>l!==b[i]).length===2;}));
const lib=dir=>{const s=rd(dir+'Panel_Cure_Check.js');const i=s.indexOf("const PP=$('Panel Payloads')");return new Function('$','$input',s.slice(0,i)+'\nreturn {cureLines,cureVerdicts,g4Label2024};')(()=>{throw new Error('offline');},null);};
const base=plan.nodes.find(n=>n.file==='Panel_Cure_Check.js').base+'/patched/';const B=lib(base),N=lib('pkgCR/patched/');
// 1. the reader
for(const [l,tag] of [['CORRECTED RESULT: HELD-1','HELD-1'],['CORRECTED RESULT: HELD-1 -- [DR3] names Matthew 1:21.','HELD-1'],['CORRECTED RESULT: BROKEN-1 -- The retracted lines do not remove the forced D6 collision.','BROKEN-1'],['CORRECTED RESULT: PARTIAL-2 (two links)','PARTIAL-2'],['CORRECTED RESULT: held-1 -- x','HELD-1']])
 {const r=N.cureLines(l).result;T('reads "'+l.slice(0,60)+'" as '+tag,r.length===1&&r[0].tag===tag,JSON.stringify(r));}
for(const l of ['CORRECTED RESULT: HELD-10','CORRECTED RESULT: HELD-1x','CORRECTED RESULT: the defender holds','CORRECTED RESULT: HELD'])T('does not read "'+l+'"',N.cureLines(l).result.length===0);
// 2. the label
{const x={rule:'K-G4',line:'D2 vs C2 (Matthew 1:21): CHALLENGER LINK BROKEN -- GROUND: the press was left unanswered.'};T('UNANSWERED-WITNESS label names RETRACTED and its one CORRECTED RESULT line',/RETRACTED: D<n> vs C<m> and exactly one CORRECTED RESULT line/.test(N.g4Label2024(x))&&!/CORRECTED RESULT/.test(B.g4Label2024(x)));
 const y={rule:'K-G4',line:'D2 vs C2 (Matthew 1:21): CHALLENGER LINK BROKEN -- GROUND: the link cannot take that meaning.'};T('MEANING label unchanged',N.g4Label2024(y)===B.g4Label2024(y));}
// 3. replay: every chatgpt cure item of 32905 and 33014, from the stored log rows (fixture_chatgpt_32905_33014.json)
const FX=JSON.parse(rd('pkgCR/fixture_chatgpt_32905_33014.json'));const side=l=>(String(l||'').match(/\b(DEFENDER|CHALLENGER) LINK BROKEN\b/)||[])[1]||null;
const runs=[...new Set(FX.map(r=>r.run))];let changed=[];
for(const run of runs){const rows=FX.filter(r=>r.run===run);const reply={ok:true,text:rows[0].reply};
 const items=rows.map(r=>({rule:r.rule,link:/ vs /.test(r.item)?r.item:r.item,side:side(r.line),line:r.line}));
 const vb=B.cureVerdicts(items,reply,{},{}),vn=N.cureVerdicts(items,reply,{},{});
 console.log('   '+run+': CORRECTED RESULT lines read, base '+B.cureLines(rows[0].reply).result.length+', pkgCR '+N.cureLines(rows[0].reply).result.length);
 rows.forEach((r,i)=>{const b=vb[i],n=vn[i];if(b.status!==n.status||b.why!==n.why){changed.push(run.slice(5,10)+' '+r.rule+' '+r.item+': '+b.status+' -> '+n.status+' ('+n.why+')');}});}
console.log('   changed:\n     '+changed.join('\n     '));
const want=['32905 K-G4 D3 vs C6','32905 K-B D6 vs C5','33014 K-G4 D2 vs C2','33014 K-G4 D4 vs C1','33014 K-G4 D6 vs C1'];
T('the 5 retraction items on an answered witness change UNCURED to CURED',want.every(w=>changed.some(c=>c.startsWith(w+': UNCURED -> CURED'))),changed.join(' | '));
T('32905 K-G4 D6 vs C5 stays UNCURED, now for ruling 421: its GROUND ("did not meet the pressed bar") names no witness left unanswered, so it is a meaning break',changed.some(c=>c.startsWith('32905 K-G4 D6 vs C5: UNCURED -> UNCURED (retracted, but the BROKEN grade rests on meaning')));
T('nothing else changes (6 rows of 36)',changed.length===6);
// the reader on every other stored CORRECTED RESULT form is unchanged (bare tags)
for(const l of ['CORRECTED RESULT: HELD-1','CORRECTED RESULT: BROKEN-1','CORRECTED RESULT: PARTIAL-2'])T('bare "'+l+'" reads the same on base and pkgCR',JSON.stringify(B.cureLines(l).result)===JSON.stringify(N.cureLines(l).result));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
