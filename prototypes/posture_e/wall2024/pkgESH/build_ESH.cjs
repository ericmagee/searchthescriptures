// pkgESH (W1, 11-08): DeepSeek K-W/K-S3 Enforcer Build sends the section that holds the side's sentence when no link block holds it.
// 33575: the defender's round 2 heads its parts "## Answer to C1: ...", "## Answer to C3 ...", which the link-heading pattern does not read, so
// for 4 K-W items (12 answers) DeepSeek got only the sentence ("I grant it.") and "(no block of this link found)". It wrote DISAGREE on all 12
// ("footing the side never gives this link"), though the footing the judges named stands in that same section (Luke 2:4, Matthew 1:16).
// Saved runs: the empty excerpt reached DeepSeek 87 times in 11 runs (33218 29, 33389 19, 33461 17, 33506 9, 33497 5, 33575 4, ...).
// Change: when no headed block of the round holds the sentence and the sentence is found in that round, the excerpt opens with that round's
// section holding it (from the nearest heading or "---" rule before it to the next one; a longer section is cut to 2000 characters
// around the sentence, 1400 before it; kept short for cost), labelled as under no link
// heading. Every other excerpt is unchanged. Base: live s55 Enforcer Build. Run from wall2024/: node pkgESH/build_ESH.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s55.json','utf8'));const s0=W.nodes.find(z=>z.name==='Enforcer Build').parameters.jsCode;
const A=" if(!own){const k=nzd(R[rk]||'').indexOf(key);if(k<0)parts.unshift('(the sentence was not found in ['+rk+'])');}";
const B=" if(!own){const k=nzd(R[rk]||'').indexOf(key);if(k<0)parts.unshift('(the sentence was not found in ['+rk+'])');\n"+
"  else{const C=clean(R[rk]||'');let Z='',M=[];for(let i=0;i<C.length;i++){const d=C[i].normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');if(/[\"\\u201c\\u201d\\u2018\\u2019']/.test(d))continue;if(/\\s/.test(d)){if(Z.endsWith(' '))continue;Z+=' ';M.push(i);continue;}for(const ch of d){Z+=ch;M.push(i);}}\n"+
"   const z=Z.indexOf(key);if(z>=0){const p=M[z];const a=Math.max(C.lastIndexOf('\\n#',p),C.lastIndexOf('\\n---',p),0);let e=C.length;for(const q0 of ['\\n#','\\n---']){const q=C.indexOf(q0,p);if(q>=0&&q<e)e=q;}\n"+
"    const a2=e-a>2000?Math.max(a,p-1400):a,e2=e-a>2000?Math.min(e,a2+2000):e;parts.unshift('['+rk+'] (the section holding the sentence; it sits under no link heading) '+(a2>a?'[...] ':'')+C.slice(a2,e2).trim()+(e2<e?' [...]':''));}}} /* pkgESH (33575): \"## Answer to C1:\" sections */";
if(s0.split(A).length!==2)throw new Error('anchor '+(s0.split(A).length-1));const s=s0.replace(A,()=>B);new Function('$','$input',s);
fs.writeFileSync('pkgESH/patched/Enforcer_Build.js',s);fs.writeFileSync('pkgESH/plan_ESH.json',JSON.stringify({base:'live s55',nodes:{'Enforcer Build':{base:h(s0),patched:h(s)}}},null,1));console.log(h(s0),'->',h(s));
