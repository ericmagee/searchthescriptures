// pkgEGP (W1, 11-08): DeepSeek K-W/K-S3 Enforcer Record reads one "G<k>" line per answer, in answer order, when the item's answers differ in form.
// 33497: DeepSeek wrote "ENFORCER: G<k> -- <verdict> -- ..." once per answer (n lines for an item of n answers). The Record (pkgEGL v2) keeps only
// the FIRST G<k> line and, when the answers open with different forms, sets every answer of the item to NO VERDICT: 12 items, 36 answers.
// Change: keep every G<k> line in order. When the item's line count equals its answer count (n>1) and the forms differ, line i goes to answer i,
// unless a line quotes the opening of another answer of that item and not its own (then the item stays NO VERDICT, as today). An opening counts
// only when it is that answer's own words: not found in the flagged debate line or in another answer of the item.
// Same-form items keep the pkgEGL whole-item rule. Base: pkgEGA patched (live s54 + pkgEGA). Run from wall2024/: node pkgEGP/build_EGP.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s54.json','utf8'));const live=W.nodes.find(z=>z.name==='Enforcer Record').parameters.jsCode;
const s0=fs.readFileSync('pkgEGA/patched/Enforcer_Record.js','utf8');
const rep=(s,a,b,tag)=>{if(s.split(a).length!==2)throw new Error(tag+' anchor '+(s.split(a).length-1));return s.replace(a,()=>b);};
let s=s0;
s=rep(s,"const V={},GV={};","const V={},GV={},GL={};",'decl');
s=rep(s,"if(g){const gk=g[1]||g[2];if(!GV[gk])GV[gk]={v:g[3].toUpperCase(),why:g[4].trim()};}",
 "if(g){const gk=g[1]||g[2];if(!GV[gk])GV[gk]={v:g[3].toUpperCase(),why:g[4].trim()};(GL[gk]=GL[gk]||[]).push({v:g[3].toUpperCase(),why:g[4].trim()});}",'collect');
s=rep(s,"  else for(const x of A)V[x.id.toUpperCase()]={v:'NO VERDICT',why:'group-labelled reply, answers differ (pkgEGL)'};}",
 "  else{const L=GL[k]||[];const N=z=>String(z||'').replace(/[*_`\"'\\u2018\\u2019\\u201c\\u201d]+/g,'').replace(/\\s+/g,' ').trim().toLowerCase();\n"+
 "   const op=x=>{const t=N(x.response_line).replace(/^(counted|touches no link|stands without it|conceded|not held|reasserted)\\s*:?\\s*/,'');return t.length>=25?t.slice(0,25):null;};const O0=A.map(op),O=O0.map((o,i)=>o&&!N(A[i].flagged_line).includes(o)&&!A.some((y,j)=>j!==i&&N(y.response_line).includes(o))?o:null);\n"+
 "   const cross=L.some((ln,i)=>{const w=N(ln.why);return !(O[i]&&w.includes(O[i]))&&O.some((o,j)=>j!==i&&o&&w.includes(o));});\n"+
 "   if(A.length>1&&L.length===A.length&&!cross)A.forEach((x,i)=>{V[x.id.toUpperCase()]={v:L[i].v,why:L[i].why+' [pkgEGP: item '+k+' answered line by line, '+L.length+' G'+k+' lines for '+A.length+' answers; line '+(i+1)+' read as '+x.id+']'};});\n"+
 "   else for(const x of A)V[x.id.toUpperCase()]={v:'NO VERDICT',why:'group-labelled reply, answers differ'+(L.length!==A.length?' and '+L.length+' G'+k+' lines for '+A.length+' answers':', a line quotes another answer')+' (pkgEGL/pkgEGP)'};}}",'apply');
new Function('$','$input',s);
fs.writeFileSync('pkgEGP/patched/Enforcer_Record.js',s);
fs.writeFileSync('pkgEGP/plan_EGP.json',JSON.stringify({base:'live s54 + pkgEGA',nodes:{'Enforcer Record':{live_s54:h(live),base_EGA:h(s0),patched:h(s)}}},null,1));console.log(h(live),'->',h(s0),'(EGA) ->',h(s));
