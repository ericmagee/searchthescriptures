// pkgUNI unit tests on sbApply2024 in each of the 6 nodes. Run from wall2024/: node pkgUNI/test_UNI.cjs
const fs=require('fs');let ok=0,bad=0;const t=(n,c)=>{if(c){ok++;}else{bad++;console.log('FAIL '+n);}};
const NODES=['Gate_Build','Gate_Record','Alt_Gate_Build','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'];
const cut=S=>{for(const a of ["const PASS=$input.first().json;","const PASS=$('Send Back Record').first().json;","const PASS=$('Alt Send Back Record').first().json;","const AM=$('Alternate Merge Seat')","let PP=$('Panel Cure Check')"]){const i=S.indexOf(a);if(i>0&&S.indexOf('function sbApply2024')<i)return S.slice(0,i);}throw new Error('no cut');};
const J=lines=>JSON.stringify({verdict_tag:'HELD',reasoning:lines.join('\n')});
const BASE=['COLLISION POINTS:','D1 vs C6 (Matthew 1:20): STANDS -- GROUND: x','D2 vs C3 (Matthew 1:16): STANDS -- GROUND: y','RESULT: DEFENDER WINS -- z'];
const F={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:0};
const UL='D1 vs C6 (Matthew 1:20): UNDERDETERMINED -- open -- GROUND: [L1] Matthew 1:20 "of the Holy Ghost" leaves open.';
for(const f of NODES){const S=fs.readFileSync('pkgUNI/patched/'+f+'.js','utf8');const L=new Function('$','$input',cut(S)+'\nreturn {sbApply2024,cureJText};')(()=>{throw 0},{first:()=>({json:{}}),all:()=>[]});
 const A=(raw,its)=>L.sbApply2024('gemini',raw,F,its,null);const raw=J(BASE);
 // 1. placeholder + the same pair held as STANDS: the judge's line takes the change
 let r=A(raw,[{sid:'S9',rule:'E-UNG',ans:'CHANGE',line:'(no COLLISION POINTS line for D1)',to:UL}]);
 t(f+' 1 applied',r&&r.applied.includes('S9')&&!r.items.length);t(f+' 1 replaced',r.text.includes(UL)&&!r.text.includes('D1 vs C6 (Matthew 1:20): STANDS'));
 // 2. placeholder + no line for the pair: inserted after the last collision line
 const U5='D5 vs C3 (Luke 3:23): UNDERDETERMINED -- open -- GROUND: [L1] Luke 3:23 "as was supposed" leaves open.';
 r=A(raw,[{sid:'S12',rule:'E-UNG',ans:'CHANGE',line:'(no COLLISION POINTS line for D5)',to:U5}]);const ls=r.text.split('\n');
 t(f+' 2 inserted',r.applied.includes('S12')&&ls.indexOf(U5)===ls.indexOf(BASE[2])+1);t(f+' 2 trig',r.trig.some(x=>/^ADDED D5 vs C3 \(UNDERDETERMINED/.test(x)));
 t(f+' 2 rp',r.rp.some(([o,n])=>o===BASE[2]&&n===BASE[2]+'\n'+U5));
 // 3. a later change on the inserted line replaces it
 const U5b=U5.replace('open --','still open --');r=A(raw,[{sid:'S12',rule:'E-UNG',ans:'CHANGE',line:'(no COLLISION POINTS line for D5)',to:U5},{sid:'G4',rule:'E-GATE',ans:'CHANGE',line:U5,to:U5b}]);
 t(f+' 3 replaced',r.text.includes(U5b)&&!r.text.includes(U5+'\n')&&r.text.split('\n').filter(l=>/^D5 vs C3/.test(l)).length===1);
 // 4. a change for another D on the placeholder is refused as before
 r=A(raw,[{sid:'S9',rule:'E-UNG',ans:'CHANGE',line:'(no COLLISION POINTS line for D1)',to:U5}]);t(f+' 4 refused',r.items.some(i=>i.sid==='S9'&&i.kind==='NOT APPLIED'&&/not in the judge text/.test(i.why)));
 // 5. a placeholder change with no graded collision form is refused as before
 r=A(raw,[{sid:'S9',rule:'E-UNG',ans:'CHANGE',line:'(no COLLISION POINTS line for D1)',to:'D1: UNDERDETERMINED -- x'}]);t(f+' 5 refused',r.items.some(i=>i.sid==='S9'&&i.kind==='NOT APPLIED'));
 // 6. the gate copy (flagged line = an unapplied collision change for D1 the text does not hold) finds the D1 vs C6 line
 r=A(raw,[{sid:'S9',rule:'E-UNG',ans:'KEEP',line:'(no COLLISION POINTS line for D1)',to:UL},{sid:'G2',rule:'E-GATE',ans:'CHANGE',line:UL,to:UL}]);t(f+' 6 gate copy',r.applied.includes('G2')&&r.text.includes(UL));
 r=A(raw,[{sid:'G2',rule:'E-GATE',ans:'CHANGE',line:UL,to:UL}]);t(f+' 6b gate change with no E-UNG source refused',r.items.some(i=>i.sid==='G2'&&i.kind==='NOT APPLIED'));
 // 7. no COLLISION POINTS section and no collision line: refused as before
 r=A(J(['RESULT: DEFENDER WINS -- z']),[{sid:'S12',rule:'E-UNG',ans:'CHANGE',line:'(no COLLISION POINTS line for D5)',to:U5}]);t(f+' 7 no section',r.items.some(i=>i.sid==='S12'&&i.kind==='NOT APPLIED'));
 // 8. heading only: inserted after COLLISION POINTS:
 r=A(J(['COLLISION POINTS:','RESULT: DEFENDER WINS -- z']),[{sid:'S12',rule:'E-UNG',ans:'CHANGE',line:'(no COLLISION POINTS line for D5)',to:U5}]);t(f+' 8 heading',r.text.split('\n')[1]===U5);
 // 9. an ordinary missing flagged line is refused as before
 r=A(raw,[{sid:'S3',rule:'E-COL',ans:'CHANGE',line:'D9 vs C9 (X 1:1): STANDS -- nope',to:'D9 vs C9 (X 1:1): UNDERDETERMINED -- a'}]);t(f+' 9 ordinary',r.items.some(i=>i.sid==='S3'&&/not in the judge text/.test(i.why)));
}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
