// pkgCK unit test, spec 16 (W3 2469): each kept form now goes through the reader and gives the old fields; the old round sets hold. Run from wall2024/.
const fs=require('fs');let ok=0,bad=0;const T=(n,c,x)=>{console.log((c?'OK  ':'FAIL')+' '+n+(c?'':' :: '+x));c?ok++:bad++;};
const mk=p=>{const s=fs.readFileSync(p+'/patched/Panel_Cure_Check.js','utf8');return new Function('$','$input',s.slice(0,s.indexOf('function cureRecompute('))+'\nreturn {cureLines,__RL};')(()=>{throw 0},null);};
const A=mk('pkgRC'),B=mk('pkgCK');const J=x=>JSON.stringify(x);const same=l=>J(A.cureLines(l))===J(B.cureLines(l));
const src=fs.readFileSync('pkgCK/patched/Panel_Cure_Check.js','utf8');const fn=src.slice(src.indexOf('function cureLines('),src.indexOf('\n return o;}',src.indexOf('function cureLines(')));
T('the new cureLines has no own PRESSED, SHORT or RETRACTED pattern (all three through __RL.readLine)',!/PRESSED'&&\(m=r\.match|SHORT'&&\(m=r\.match|K-\[A-Z\]\+\\d\*\\s\+/.test(fn));
for(const [n,l,b] of [
 ['16.1 RETRACTED with a rule id','RETRACTED: K-G4 D1 vs C2 -- regraded UNDERDETERMINED -- the witness is answered in [CR3]','withdrawn'],
 ['16.1 RETRACTED without a rule id','RETRACTED: D3 vs C1 (Luke 1:27) -- STANDS -- answered','withdrawn'],
 ['16.1 RETRACTED to a LINK BROKEN grade stays malformed','RETRACTED: K-G4 D1 vs C2 -- regraded DEFENDER LINK BROKEN','malformed'],
 ['16.2 PRESSED | form','PRESSED: D1 vs C2 | [CR2] | "the man was just"','pressed'],
 ['16.2 PRESSED | form outside the old round set ([CR4]) stays malformed','PRESSED: D1 vs C2 | [CR4] | "the man was just"','malformed'],
 ['16.2 SHORT | form','SHORT: D2 vs C3 | [DR1] | "text here" | the answer misses the point','short'],
 ['16.2 SHORT | form outside the old round set ([CR1]) stays malformed','SHORT: D2 vs C3 | [CR1] | "text here" | the answer misses the point','malformed'],
 ['16.2 SHORT with a why under 10 characters stays malformed','SHORT: D2 vs C3 | [DR1] | "text here" | short','malformed'],
 ['16.3 reversed pair inside RESTATED','RESTATED: C5 vs D5 (Luke 1:35): CHALLENGER LINK BROKEN -- the ground stands','restated']]){
 const o=B.cureLines(l);const got=Object.keys(o).filter(k=>o[k].length&&k!=='prose');T(n+' -> '+b+', fields as the old reader',got.join()===b&&same(l),'new '+J(o[got[0]])+' old '+J(A.cureLines(l)[got[0]]));}
{const o=B.cureLines('RESTATED: C5 vs D5 (Luke 1:35): CHALLENGER LINK BROKEN -- x').restated[0];T('16.3 the reversed pair is read D first',o&&o.link===A.cureLines('RESTATED: D5 vs C5: STANDS').restated[0].link.replace(/STANDS/,'')&&o.grade==='CHALLENGER LINK BROKEN',J(o));}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
