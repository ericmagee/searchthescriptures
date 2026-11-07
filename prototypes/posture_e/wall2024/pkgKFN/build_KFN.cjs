// pkgKFN (W1, 11-07; W3 2968 item 2, 33461 gemini K-F D5 vs C6, row 16676). kfFound strips list markers ("1. ", "2) ") only at line starts
// (__kfLB). [DR3] wrote its order as a numbered list on separate lines; gemini's FORCED ANSWER quote joined the list on one line and kept
// "2. ", "3. ", "4. ", "5. " mid-line, so the ANSWER quotation was "not in [DR3]" and the seat was flagged K-F (LIVE). Not an inner-quote cut:
// the FAILS quote, which holds the inner "thy wife.", passed.
// Change: when the line-start compare fails, kfFound compares again with inline list markers (1-2 digits then "." or ")", standing alone
// between spaces or at an end) taken out of BOTH the quote and the round. Every quote found today is still found (the first compare is unchanged).
// Base: pkgLIB v12 full sources (pkgLIB_v12/orig_stack/patched; all 22 library nodes carry kfFound). Ships as pkgLIB_v13. Run from wall2024/.
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);const B='pkgLIB_v12/orig_stack/patched/';
const A="const kfFound=(q,t)=>ciFound(__kfLB(q),__kfLB(t));";
const N=String.raw`const __kfIN=s=>__kfLB(s).replace(/(^|\s)\d{1,2}[.)](?=\s|$)/g,'$1'); /* pkgKFN (W3 2968): a numbered list quoted on one line */
const kfFound=(q,t)=>ciFound(__kfLB(q),__kfLB(t))||ciFound(__kfIN(q),__kfIN(t));`;
const plan={};for(const f of fs.readdirSync(B).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(B+f,'utf8');const s0=s;const c=s.split(A).length-1;
 if(c!==1)throw new Error(f+': '+c);s=s.replace(A,()=>N);new Function('$','$input',s);fs.writeFileSync('pkgKFN/patched/'+f,s);plan[f]={base:h(s0),patched:h(s)};}
fs.writeFileSync('pkgKFN/patched.plan.json',JSON.stringify(plan,null,1));console.log(Object.keys(plan).length+' nodes patched');
