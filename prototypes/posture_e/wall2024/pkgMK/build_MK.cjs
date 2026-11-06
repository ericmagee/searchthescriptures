// pkgMK (W1; run 33083 Oracle premise 3): a 1611 margin key "word...:" is not an elision.
// Run from wall2024/: node pkgMK/build_MK.cjs. Base: pkgMK/base/Citation_Scan.js, the live node's code (prewrite_lib_66adcc25.json; the 2a23bc90
// write did not touch it).
// The stored KJV verse prints its margin notes with a keyed word and three dots: "[they...: or, his name shall be called]". Citation Scan reads
// every "..." in a quotation as an elision: it splits the quotation there (segs) and blanks the dots (quote). A side that quotes the verse with
// its margin note, exactly as served, gets segments "... God with us. [they" and ": or, his name shall be called]", the first of which is not
// contiguous in the verse, so Quote Compare marks it WORDING DIFFERS and the judges read the quotation as NOT COUNTED. Run 33083: the Oracle's
// [DR3] Isaiah 8:8 and Matthew 1:23 (premise 3), and its [DR4] Isaiah 8:8; chatgpt and sol then counted premise 3 UNEXHIBITED.
// Fix: an ellipsis directly followed by ":" (the margin key form) is not an elision: (?:…|\.\.\.)(?!:) in the 6 ellipsis patterns.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const b=fs.readFileSync('pkgMK/base/Citation_Scan.js','utf8');let t=b;
const E=[['/…|\\.\\.\\./g','/(?:…|\\.\\.\\.)(?!:)/g',4],['/…|\\.\\.\\./)','/(?:…|\\.\\.\\.)(?!:)/)',2]];
for(const [o,n,k] of E){const c=t.split(o).length-1;if(c!==k)throw new Error(o+' x'+c+' expected '+k);t=t.split(o).join(n);}
new Function('$','$input','$json',t);fs.mkdirSync('pkgMK/patched',{recursive:true});fs.writeFileSync('pkgMK/patched/Citation_Scan.js',t);
const plan={node:'Citation Scan',base:'pkgMK/base/Citation_Scan.js (live, prewrite_lib_66adcc25.json)',base_sha:sha(b),final_sha:sha(t),edits:'6 ellipsis patterns: (?:…|\\.\\.\\.)(?!:)'};
fs.writeFileSync('pkgMK/plan_MK.json',JSON.stringify(plan,null,1));console.log(JSON.stringify(plan));
