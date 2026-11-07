// pkgV18 (W3 rulings 2026-11-07 item 12, HIGH per Eric 10:42; W2 2892 handed it to W1). Extract Independent Verdict (single judge), v18 audit layer.
// The judge wrote collision entries "D3 vs C5 (Matthew 1:16): DEFENDER LINK STANDS -- ...", a grade outside the list the parser reads, so each entry was
// dropped: "ENTRY NOT READ" plus "CARRIES NO ENTRY FOR D3" (33345 D3-D6). The entry is now read as STANDS, and one audit line names the off-list grade:
// "[AUDIT v18: D3 GRADED WITH THE OFF-LIST WORDING "DEFENDER LINK STANDS"; READ AS STANDS. REVIEW THIS ROW.]". Nothing else changes.
// Run from wall2024/: node pkgV18/build_V18.cjs [--base dir] [--out dir]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};const BASE=arg('--base','pkgLIB/base_s45/patched'),OUT=arg('--out','pkgV18/patched');const F='Extract_Independent_Verdict.js';
const rep=(s,a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('anchor x'+n+': '+a.slice(0,50));return s.split(a).join(b);};
let s=fs.readFileSync(BASE+'/'+F,'utf8');const s0=s;
s=rep(s,"const colMap={};const colUnparsed=[];","const colMap={};const colUnparsed=[];const colOff=[]; /* pkgV18 */");
s=rep(s,"if(/^VS\\.?\\s/.test(rest)){const g=rest.match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);st=g?g[1]:null;}",
 "if(/^VS\\.?\\s/.test(rest)){const g=rest.match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|DEFENDER LINK STANDS)/);st=g?g[1]:null;if(st==='DEFENDER LINK STANDS'){st='STANDS';colOff.push(+m[1]);} /* pkgV18: off-list wording read as STANDS, named below */}");
s=rep(s," for(const u of colUnparsed){raw+='\\n\\n[AUDIT v18: COLLISION POINTS ENTRY NOT READ: \"'+u+'\". REVIEW THIS ROW.]';}",
 " for(const u of colUnparsed){raw+='\\n\\n[AUDIT v18: COLLISION POINTS ENTRY NOT READ: \"'+u+'\". REVIEW THIS ROW.]';}\n for(const i of colOff){raw+='\\n\\n[AUDIT v18: D'+i+' GRADED WITH THE OFF-LIST WORDING \"DEFENDER LINK STANDS\"; READ AS STANDS. REVIEW THIS ROW.]';} /* pkgV18 */");
fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(OUT+'/'+F,s);new Function('$','$input','return (async()=>{'+s+'\n})()');
fs.writeFileSync(OUT+'.plan.json',JSON.stringify({base:BASE,nodes:[{file:F,base_sha:sha(s0),final_sha:sha(s)}]},null,1));console.log(F,sha(s0),'->',sha(s));
