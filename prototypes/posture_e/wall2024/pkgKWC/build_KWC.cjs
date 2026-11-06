// pkgKWC (W3 Wall 2596; run 33149 chatgpt K-W CHALLENGER DR3 LINK 5, engine fault): the K-W reader's CONCEDED form (kwCo, pkgQ) needed a colon,
// semicolon, period, dash or line end right after CONCEDED, so "CONCEDED in that form: [DR3] drops it" was refused. Now CONCEDED at a sentence
// start may be followed by up to 4 words and then a colon or dash (W3's rule). The bare forms read as before; "CONCEDED LINKS" is still excluded;
// "conceded" in prose (lowercase, or mid-sentence) is still not the form. 19 library nodes that carry kwCo. Base: pkgKGW/patched (live ff8967bb).
// Run from wall2024/: node pkgKWC/build_KWC.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE='pkgKGW/patched',OUT='pkgKWC/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:BASE+' (live ff8967bb)',nodes:[]};
const A="const kwCo=t=>/(?:^|[.;!?]\\s+|:\\s+)\\**CONCEDED\\**(?!\\s+LINKS?\\b)\\s*(?::|;|\\.|--|\\u2014|$)/.test(String(t));";
const B="const kwCo=t=>/(?:^|[.;!?]\\s+|:\\s+)\\**CONCEDED\\**(?!\\s+LINKS?\\b)(?:\\s*(?::|;|\\.|--|\\u2014|$)|(?:\\s+[A-Za-z][A-Za-z'\\u2019-]*){1,4}\\s*(?::|--|\\u2014))/.test(String(t)); /* pkgKWC (W3 2596): or up to 4 words, then a colon or dash */";
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(BASE+'/'+f,'utf8');const n=s0.split(A).length-1;if(n===0)continue;if(n!==1)throw new Error(f+': anchor '+n);
 const s=s0.replace(A,()=>B);new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base:BASE,base_sha:sha(s0),final_sha:sha(s),edits:1});}
fs.writeFileSync('pkgKWC/plan_KWC.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes');
