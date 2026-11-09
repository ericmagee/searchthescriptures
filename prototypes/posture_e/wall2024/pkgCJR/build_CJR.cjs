// pkgCJR (W2, 11-09; W3 grade_34016 countermeasure 1): the cure reader reads a JSON cure reply that is not valid JSON.
// Case: run 34016, Haiku (alternate for luna). Its cure reply (enforcer log row 27957) is a JSON verdict whose "reasoning" string holds a RESPONSE line
// for 15 of 17 items, but the string carries unescaped quotation marks (ANSWER: "Hebrews 7:14 names the tribe"), so JSON.parse throws.
// cureUnwrap then returned the raw text, whose line breaks are the two characters \n, so cureLines saw one line and read no RESPONSE: 17 items "no written response".
// Fix: when JSON.parse fails and the reply opens with { and holds a "reasoning" (or "reason", "answer") string with \n escapes, read that string from its
// opening quotation mark to the closing "} with \n and \" unescaped, as gateRead2024 already does for the gate reply. A reply that parses is read as before.
// Base: live s75 library pkgLIB/strip_WLG (Shared Library ed1ec6fb07c0). Run from wall2024/: node pkgCJR/build_CJR.cjs [base strip] [out strip]
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const BASE=process.argv[2]||'pkgLIB/strip_WLG',OUT=process.argv[3]||'pkgLIB/strip_CJR';
const A0="if(j&&typeof j==='object'){for(const k of ['reasoning','reason','answer'])if(typeof j[k]==='string')return j[k];}}catch(e){}return t;};";
const A1="if(j&&typeof j==='object'){for(const k of ['reasoning','reason','answer'])if(typeof j[k]==='string')return j[k];}}catch(e){}return cjrLoose2024(t);}; /* pkgCJR */\n"
 +String.raw`function cjrLoose2024(t){const z=String(t==null?'':t).trim().replace(/^`+'```'+String.raw`(?:json)?\s*|\s*`+'```'+String.raw`$/g,'');if(z[0]!=='{'||!/\\n/.test(z))return t;const m=z.match(/"(?:reasoning|reason|answer)"\s*:\s*"/);if(!m)return t; /* pkgCJR: invalid JSON reply, read its reasoning string as gateRead2024 does */
 return z.slice(m.index+m[0].length).replace(/"\s*\}\s*$/,'').replace(/\\n/g,'\n').replace(/\\"/g,'"');}`;
const sub=(s,a,b,f)=>{const n=s.split(a).length-1;if(n>1)throw new Error(f+': '+n+' hits');return n?s.split(a).join(b):s;};
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT+'/patched',{recursive:true});const plan={base:BASE,library:{}};
for(const f of fs.readdirSync(BASE+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(BASE+'/patched/'+f,'utf8');const s=sub(s0,A0,A1,f);
 if(s!==s0){new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.library[f]={base:h(s0),patched:h(s)};}fs.writeFileSync(OUT+'/patched/'+f,s);}
fs.writeFileSync('pkgCJR/plan_CJR.json',JSON.stringify(plan,null,1)+'\n');console.log('library files changed',Object.keys(plan.library).length);
