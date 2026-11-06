// pkgKW (W3 queue item 5: K-W to LIVE at zero false items). Run from wall2024/: node pkgKW/build_KW.cjs
// Base: pkgKC2/patched (W3 order pkgRU, pkgKFR, pkgACR, pkgKC2). Raise-side fixes in kwLines421 (all 22 library nodes), from the
// promotion read of every corpus K-W item (Wall, W2): a matched "I grant / I concede / ..." is NOT a withdrawal when
// (a) it stands inside a quotation on its line (an odd number of double quotes before it): the side is quoting the OTHER side's words
//     (33014 DR3 "The defender grants, in his own words, "I grant no row states Mary's house.""; 33021 DR3 "The defender's own words: ...");
// (b) it stands on a markdown heading line that is a title, with no sentence end ("## 0. What I concede, so the rest can stand", 33020 CR2);
//     a heading line that carries full sentences is read as before (33021 DR3 "## LINK 6: NARROWED TO: ... I drop "mercy" and drop "excludes."");
// (c) the verb is negated by its object: "I concede none / nothing / no ..." (33020 DR4 "I concede none of the six").
// Item ids keep their numbering (a skipped match still takes its number), so every other item keeps its id.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE=process.env.BASE||'pkgKC2/patched';const OUT=process.env.OUT||'pkgKW';
const A="for(const m of t.matchAll(RX)){if(n>=10)break;const pre=t.slice(0,m.index);";
const B="for(const m of t.matchAll(RX)){if(n>=10)break;const pre=t.slice(0,m.index);{const ls=pre.lastIndexOf('\\n')+1;const le=t.indexOf('\\n',m.index);const ln=t.slice(ls,le<0?t.length:le);const bf=t.slice(ls,m.index);"
 +"if((/^\\s*#/.test(ln)&&!/[.!?][\"\\u201d\x27]?\\s*$/.test(ln))||((bf.match(/[\"\\u201c\\u201d]/g)||[]).length%2===1)||/^\\s*(?:none|nothing|no)\\b/i.test(t.slice(m.index+m[0].length))){n++;continue;}} /* pkgKW (a) quoted, (b) heading, (c) negated: not a withdrawal; the number is kept */";

// (d) cure side: NOT HELD answers a K-W item when its reason quotes the flagged sentence: 3 words in a row of what follows the verb
//     ("I grant ..."), or all of it when it is shorter. A reason that quotes nothing of it stays UNCURED. Switch KW_NH (true).
const C="return res('UNCURED','neither the RESPONSE nor the STATEMENT line says STANDS WITHOUT IT because <layer> with an [L1], [L2] or [L3], CONCEDED, or REASSERTED IN <round> \"<quote>\"',rp?[rp]:(sp?[sp]:null));}";
const D="if(KW_NH){const nw=s=>String(s||'').toLowerCase().replace(/[\\u2018\\u2019\\u201c\\u201d\"'`*_]/g,'').replace(/[^a-z0-9\\u0370-\\u03ff\\u1f00-\\u1fff]+/g,' ').trim().split(' ').filter(Boolean);"
 +"const q=String(x.line||'');const a=q.indexOf('\"'),b=q.lastIndexOf('\"');const fs0=a>=0&&b>a?q.slice(a+1,b):q;const body=nw(fs0.replace(/^\\s*I\\s+(?:do\\s+not\\s+claim|no\\s+longer\\s+claim|withdraw|grant|concede|drop)\\b/i,''));"
 +"const runs=body.length<=3?[body.join(' ')]:body.slice(0,body.length-2).map((_,i)=>body.slice(i,i+3).join(' '));"
 +"for(const [t,w] of [[rp,''],[sp,' (on its STATEMENT line)']]){if(!t||!/^\\s*NOT\\s+HELD\\b/i.test(t))continue;const T=' '+nw(t).join(' ')+' ';if(runs.some(r=>r&&T.includes(' '+r+' ')))return res('CURED','answered: NOT HELD, with a reason that quotes the flagged sentence (pkgKW)'+w,[t]);}}"
 +"return res('UNCURED','neither the RESPONSE nor the STATEMENT line says STANDS WITHOUT IT because <layer> with an [L1], [L2] or [L3], CONCEDED, REASSERTED IN <round> \"<quote>\", or NOT HELD with a reason that quotes the flagged sentence',rp?[rp]:(sp?[sp]:null));}";
const E="const ENF_STATUS={";const F="const KW_NH=true; /* pkgKW (d): NOT HELD quoting the flagged sentence answers a K-W item */\nconst ENF_STATUS={";

// (e) K-W goes LIVE (ENF_STATUS), and both K-W marks (kwLines421 and the withdrawn-premise flag, which rides on K-W) state the forms and
//     the LIVE rule. The withdrawn-premise flag raised no item on the corpus.
const G1=["'K-W':'TRIAL'","'K-W':'LIVE'"];
const G2=["the judge answers STANDS WITHOUT IT because <layer>, or CONCEDED. TRIAL rule: it removes no seat. REVIEW THIS ROW.]","the judge answers STANDS WITHOUT IT because <layer>, CONCEDED, or NOT HELD with a reason that quotes it. LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]"];
const plan={base:BASE,nodes:[]};fs.mkdirSync(OUT+'/patched',{recursive:true});
for(const f of fs.readdirSync(BASE).sort()){const b=fs.readFileSync(BASE+'/'+f,'utf8');let t=b;const ed=[];
 if(t.includes('function kwLines421')){if(t.split(A).length-1!==1)throw new Error(f+' A');t=t.replace(A,()=>B);ed.push('kwLines421 skips quoted, heading, negated');}
 if(t.includes(C)){if(t.split(C).length-1!==1)throw new Error(f+' C');t=t.replace(C,()=>D);ed.push('K-W cure: NOT HELD with a quote');if(t.split(E).length-1!==1)throw new Error(f+' E');t=t.replace(E,()=>F);}
 if(t.split(G1[0]).length-1!==1)throw new Error(f+' G1');t=t.replace(G1[0],G1[1]);const k2=t.split(G2[0]).length-1;if(k2!==2)throw new Error(f+' G2 x'+k2);t=t.split(G2[0]).join(G2[1]);ed.push('K-W LIVE');
 new Function('$','$input','$json',t);fs.writeFileSync(OUT+'/patched/'+f,t);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(t),edits:ed});}
fs.writeFileSync(OUT+'/plan_KW.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes; edited '+plan.nodes.filter(n=>n.edits.length).length);
