// pkgEOQ (W1, 11-07; W3 grade_33490, Lane 1 DeepSeek enforcer fix). The E-OOR code check in Judge Enforcer Build and Alt Judge Enforcer Build
// read an OUT-OF-ROUND CONCESSIONS sentence as everything after "| <round> |", stripping only a trailing COUNTED and an outer quote pair.
// A judge's tag (` -- CONCEDED as ...`) stayed in the sentence, so it was "not found verbatim" though the sentence is in the round
// (33490: 28 sol rows). Now the sentence is read as spec section 10 (SB_ROW) reads it: a quoted sentence ends at the first closing quote
// that is followed by ` -- ` (or an en or em dash), by the line end, or by a space and the judge's own prose (a capital letter or bracket);
// an unquoted sentence ends before ` -- `. 33490: 14 of 14 rows; also 33299, 33345, 33461 sol rows whose tag is prose after the quote.
// Base: live s51. Run from wall2024/: node pkgEOQ/build_EOQ.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const A="sent=sent.replace(/\\s*(?:\\||--)\\s*COUNTED\\.?\\s*$/,'').replace(/^[\"“]|[\"”]$/g,'');";
const B="sent=sent.replace(/\\s*(?:\\||--)\\s*COUNTED\\.?\\s*$/,'');{const __q=sent.match(/^[\"“]([\\s\\S]*?)[\"”](?:\\s*(?:--|\\u2014|\\u2013)\\s[\\s\\S]*|\\s+[A-Z(\\[][\\s\\S]*)?$/);sent=__q?__q[1]:sent.split(/\\s(?:--|\\u2014|\\u2013)\\s/)[0];} /* pkgEOQ (W3 grade_33490): the sentence ends before the judge's ' -- ' tag (spec 10, SB_ROW) */";
const plan={};for(const f of fs.readdirSync('pkgEOQ/base_s51')){let s=fs.readFileSync('pkgEOQ/base_s51/'+f,'utf8');const s0=s;const c=s.split(A).length-1;if(c!==1)throw new Error(f+': '+c);
 s=s.replace(A,()=>B);new Function('$','$input',s);fs.writeFileSync('pkgEOQ/patched/'+f,s);plan[f]={base:h(s0),patched:h(s)};console.log(f.padEnd(30),h(s0),'->',h(s));}
fs.writeFileSync('pkgEOQ/patched.plan.json',JSON.stringify(plan,null,1));
