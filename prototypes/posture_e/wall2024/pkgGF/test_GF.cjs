// pkgGF test (W3 2311). Run from wall2024/ after pkgGKW, pkgGK and pkgGF builds: node pkgGF/test_GF.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const plan=JSON.parse(rd('pkgGF/plan_GF.json'));
T('6 nodes: base and final shas match the plan',plan.nodes.length===6&&plan.nodes.every(n=>sha(rd('pkgGK/patched/'+n.file))===n.base_sha&&sha(rd('pkgGF/patched/'+n.file))===n.final_sha));
T('every node parses as an n8n Code node body',plan.nodes.every(n=>{try{new Function('$','$input',rd('pkgGF/patched/'+n.file));return true;}catch(e){console.log('   '+n.file+': '+e.message);return false;}}));
T('gateForced2024 is in each of the 6 gate-library nodes once',plan.nodes.every(n=>rd('pkgGF/patched/'+n.file).split('function gateForced2024(').length===2));
for(const f of ['Gate_Build','Alt_Gate_Build'])T(f+' prompt names the FORCED form for a RULE K-G4 item',rd('pkgGF/patched/'+f+'.js').includes('A RULE K-G4 item on a link you keep graded LINK BROKEN'));
const mk=dir=>{const AM=rd(dir+'Alternate_Merge.js');const lib=AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"));
 return new Function('$','$input',lib+'\nreturn {gateCure2024,gateRead2024'+(dir.includes('pkgGF')?',gateForced2024':'')+'};')(()=>{throw new Error('offline');},null);};
const B=mk('pkgGK/patched/'),N=mk('pkgGF/patched/');
// 32998 chatgpt G5 rounds (excerpts, as in pkgGK/test_GK.cjs)
const DR2='Isaiah 7:16 "For before the child shall know to refuse the evil, and choose the good" -- MEANS: the sign is bounded by a child\'s age in Isaiah\'s day. -- [L3] Isaiah 8:4 "before the child shall have knowledge to cry, My father" | PROVEN IN [Challenger R1]';
const CR3='  - Isaiah 7:16, "For before the child shall know to refuse the evil, and choose the good". Isaiah 8:3, "I went unto the prophetess; and she conceived, and bare a son". Isaiah 8:8, "O Immanuel".';
const R={CR1:'',CR2:'',CR3,CR4:'',DR1:'',DR2,DR3:'',DR4:''};const ctx={R,DL:[],ask:false};
const x5={gid:'G1',kind:'RULE K-G4',src:'K re-read',key:'RULE|K-G4|DEFENDER|D4 VS C5',why:'w',lines:['D4 vs C5 (Isaiah 7:16): DEFENDER LINK BROKEN (Commitment 5) -- GROUND: the link cannot take the meaning.'],live:true};
const FOK='FORCED: D4 vs C5 -- MEANS [DR2]: "the sign is bounded by a child\'s age in Isaiah\'s day" -- ANSWER [CR3]: "I went unto the prophetess; and she conceived, and bare a son" -- FAILS: "she conceived, and bare a son"';
const FBAD=FOK.replace('I went unto the prophetess; and she conceived','the prophetess bare a son after she conceived');
const one=(M,reply)=>{const r=M.gateCure2024('chatgpt','',{},[],[x5],reply,ctx);return (Array.isArray(r)?r:(r.res||r.results||[]))[0];};
{const g=N.gateForced2024(x5,N.gateRead2024('GATE: G1 || KEEP || '+FOK).G1,ctx);T('a correct FORCED line after KEEP passes the K-F test',g&&g.cured,JSON.stringify(g));}
{const r=one(N,'GATE: G1 || KEEP || '+FOK);T('gateCure2024: a correct FORCED reply CURES the RULE K-G4 item',r&&r.cured&&/forced link/.test(r.why),JSON.stringify(r));
 const b=one(B,'GATE: G1 || KEEP || '+FOK);T('base (pkgGK): the same reply stays UNCURED',b&&!b.cured,JSON.stringify(b));}
{const r=one(N,'GATE: G1 || CHANGE TO: D4 vs C5 (Isaiah 7:16): DEFENDER LINK BROKEN (Commitment 5) -- GROUND: the link cannot take the meaning. || '+FOK);T('a correct FORCED line as the reason of a CHANGE TO also cures',r&&r.cured,JSON.stringify(r));}
{const r=one(N,'GATE: G1 || KEEP || '+FBAD);T('a FORCED reply whose ANSWER quote is not found in its round stays UNCURED, with the K-F reason',r&&!r.cured&&/fails the K-F test/.test(r.why)&&/ANSWER quotation is not in \[CR3\]/.test(r.why),JSON.stringify(r));}
{const r=one(N,'GATE: G1 || KEEP || '+FOK.replace('[DR2]','[DR3]'));T('a FORCED reply naming the wrong MEANS round stays UNCURED',r&&!r.cured&&/MEANS quotation is not in \[DR3\]/.test(r.why),JSON.stringify(r));}
{const r=one(N,'GATE: G1 || KEEP || '+FOK.replace('D4 vs C5','D2 vs C5'));T('a FORCED line for another link does not cure this item',r&&!r.cured,JSON.stringify(r));}
{const r=one(N,'GATE: G1 || KEEP || FORCED: D4 vs C5 -- MEANS [Defender R3]: "x y z w v" -- ANSWER [CR3]: "a" -- FAILS: "b"');T('a malformed FORCED line (gemini 32998 "[Defender R3]" form) stays UNCURED',r&&!r.cured&&/fails the K-F test/.test(r.why),JSON.stringify(r));}
{const r=one(N,'');T('silence still counts',r&&!r.cured&&/silence/.test(r.why));}
// replay: no 32998 gate reply holds a FORCED segment, so gateForced2024 returns null on each, and no gate item changes
const FX=JSON.parse(rd('pkgGF/fixture_gate_32998.json'));let nulls=0;
for(const f of FX){const A=N.gateRead2024(f.resp);const a=A[f.gid];const x={gid:f.gid,kind:f.kind,key:f.key||(f.kind+'|'+f.gid)};const g=N.gateForced2024(x,a,ctx);if(g===null)nulls++;else console.log('   changed: '+f.seat+' '+f.gid+' '+JSON.stringify(g));}
T('replay of the 8 stored 32998 gate replies: the FORCED path decides none, so no 32998 gate item changes',nulls===FX.length,nulls+'/'+FX.length);
T('every stored 32998 gate reply is still read by gateRead2024',FX.every(f=>!!N.gateRead2024(f.resp)[f.gid]));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
