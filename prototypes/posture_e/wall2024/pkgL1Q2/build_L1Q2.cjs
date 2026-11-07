// pkgL1Q2 (W3 2896 ruling on W2's note; HIGH priority by Eric's rule): the Commitment 12 KJV check (kkjvPairs, KKJV_Q) read only double-quoted verse
// quotes, so a single-quoted non-KJV quote after a reference escaped it. KKJV_Q now also reads a single-quoted quote ('...' or ‘...’), in the pkgL1Q
// form: the opening mark follows a non-letter, and an apostrophe followed by a lower-case letter (Mary's, Father's) neither opens nor closes it.
// Nothing else changes: the quote must still be 3+ words, is still tested as a verse quote (half its words in the verse) and against the KJV row.
// Same weakness in pkgL1Q's ECL PAIR (4 Send Back nodes), fixed here too: an opening single mark followed by "s " (a possessive right after the reference,
// Luke 3:23's) or by a space (the close of a quoted reference, 'Exodus 6:23' -- ...) opens no quote, in both readers.
// 26 nodes. KKJV_Q nodes (22): base = first of --stack dirs that has the node (default pkgDEC/patched, pkgL1Q/patched), live s45 otherwise.
// Send Back nodes (4): base --sbbase (default pkgEB7/patched_full, the gap stack after 33411). Every anchor must occur once or the build stops.
// Run from wall2024/: node pkgL1Q2/build_L1Q2.cjs [--stack d1,d2] [--sbbase dir] [--out dir]
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};const OUT=arg('--out',__dirname+'/patched');fs.mkdirSync(OUT,{recursive:true});
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s45.json','utf8'));const STK=arg('--stack','pkgDEC/patched,pkgL1Q/patched').split(','),SBB=arg('--sbbase','pkgEB7/patched_full');
const Q0='const KKJV_Q=/^[\\s,:;(\\-–—]{0,6}(?:\\[L1\\]\\s*)?["“]([^"“”]{6,400})["”]/;';
const Q1="const KKJV_Q=/^[\\s,:;(\\-–—]{0,6}(?:\\[L1\\]\\s*)?(?:[\"“]([^\"“”]{6,400})[\"”]|(?<![A-Za-z0-9])['‘](?!s\\b|\\s)((?:[^'‘’\\n]|['’](?=[a-z])){6,400}?)['’](?![a-z]))/; /* pkgL1Q2 (W3 2896): a single-quoted verse quote is read too; an in-word apostrophe neither opens nor closes it, and a possessive 's right after the reference (Luke 3:23's) does not open one, nor does a mark followed by a space (the close of a quoted reference) */";
const P0="const q=KKJV_Q.exec(T.slice(A.lastIndex,A.lastIndex+500));if(q&&kkjvFold(q[1]).split(' ').filter(Boolean).length>=3)out.push({book:m[1],ch:+m[2],v1:+m[3],v2:+(m[4]||m[3]),q:q[1]});";
const P1="const q=KKJV_Q.exec(T.slice(A.lastIndex,A.lastIndex+500));const __q=q?(q[1]||q[2]):null; /* pkgL1Q2 */if(__q&&kkjvFold(__q).split(' ').filter(Boolean).length>=3)out.push({book:m[1],ch:+m[2],v1:+m[3],v2:+(m[4]||m[3]),q:__q});";
const rep=(s,a,b,nm)=>{const c=s.split(a).length-1;if(c!==1)throw new Error(nm+' anchor x'+c+': '+a.slice(0,60));return s.replace(a,()=>b);};
const plan={source:'W2 pkgL1Q2 (W3 2896: KJV check reads single-quoted quotes)',nodes:[]};
for(const n of W.nodes.filter(n=>n.parameters&&n.parameters.jsCode&&/KKJV_Q/.test(n.parameters.jsCode))){const f=n.name.replace(/ /g,'_')+'.js';const LB=STK.find(d=>fs.existsSync(d+'/'+f));const fromL=!!LB;const s0=fromL?fs.readFileSync(LB+'/'+f,'utf8'):n.parameters.jsCode;
 let s=rep(s0,Q0,Q1,n.name);s=rep(s,P0,P1,n.name);new Function('$','$input','$json','$execution','$workflow','$node','$items',s);fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({name:n.name,file:f,base:fromL?LB:'live s45',base_sha:sha(s0),final_sha:sha(s)});}
const PA0="(?<![A-Za-z])[\\'‘]((?:",PA1="(?<![A-Za-z])[\\'‘](?!s\\\\b|\\\\s)((?:";
for(const name of ['Send Back Build','Send Back Record','Alt Send Back Build','Alt Send Back Record']){const f=name.replace(/ /g,'_')+'.js';const s0=fs.readFileSync(SBB+'/'+f,'utf8');
 const s=rep(s0,PA0,PA1,name);new Function('$','$input','$json','$execution','$workflow','$node','$items',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({name,file:f,base:SBB,base_sha:sha(s0),final_sha:sha(s)});}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes');
