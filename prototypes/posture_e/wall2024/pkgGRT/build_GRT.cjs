// pkgGRT (W1, W3 3130/3134 narrowed; 33627): the E-COL send-back options offered "CHANGE TO: RETRACTED: <pair>" on a collision line, and the apply
// step reads RETRACTED only against a FORCED line, so the engine refused the cure it offered ("no line form the engine reads"; 33627 gemini
// S4/S6/S8/S10, grok S7/S9/S11/S13/S14/S16, each costing a gate round). Wording fix only: the RETRACTED option is offered on a FORCED line; on a
// collision line the option is the pair regraded (UNDERDETERMINED or STANDS) with its GROUND, and the ask says a collision line is not retracted.
// Nodes: Send Back Build, Alt Send Back Build (base pkgEHF/patched, = live s59 + pkgEHF). Run from wall2024/: node pkgGRT/build_GRT.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const FN="const __grtF=i=>/^\\s*(?:[-\\u2022]|\\d+[.)])?\\s*FORCED\\b/i.test(String(i&&i.line||'').replace(/[*_`]+/g,'')); /* pkgGRT */\nconst __grtO=i=>__grtF(i)?'Otherwise CHANGE TO: RETRACTED: <pair>. A FORCED line is retracted only once the pair\\'s collision line is no longer graded LINK BROKEN (ruling 411), so regrade that line (UNDERDETERMINED or STANDS) where it is asked (pkgGRT).':'Otherwise CHANGE TO this collision line with the pair regraded (UNDERDETERMINED or STANDS, with its GROUND). A collision line is regraded, never retracted: RETRACTED is for a FORCED line only (pkgGRT).'; /* pkgGRT */\n";
const R=[["const __eclR=i=>","Otherwise CHANGE TO: RETRACTED: <pair>, or the pair regraded. A KEEP does not cure this item.';","'+__grtO(i)+' A KEEP does not cure this item.';"],
 ["const __ecfR=i=>","Otherwise CHANGE TO: RETRACTED: <pair>, or the pair regraded (UNDERDETERMINED or STANDS). An item left without either counts against your seat.';","'+__grtO(i)+' An item left without either counts against your seat.';"]];
const plan={base:'pkgEHF/patched (live s59 + pkgEHF)',nodes:{}};
for(const f of ['Send_Back_Build','Alt_Send_Back_Build']){const s0=fs.readFileSync('pkgEHF/patched/'+f+'.js','utf8');let s=s0;
 for(const [d,a,b] of R){const ln=s.split('\n').findIndex(l=>l.startsWith(d));if(ln<0)throw new Error(f+' '+d);const L=s.split('\n');if(L[ln].split(a).length!==2)throw new Error(f+' anchor '+d);L[ln]=L[ln].replace(a,()=>b);s=L.join('\n');}
 {const d='const __eclR=i=>';const at=s.indexOf('\n'+d);if(at<0)throw new Error('fn');s=s.slice(0,at+1)+FN+s.slice(at+1);}
 new Function('$','$input',s);fs.writeFileSync('pkgGRT/patched/'+f+'.js',s);plan.nodes[f]={base:h(s0),patched:h(s)};}
fs.writeFileSync('pkgGRT/plan_GRT.json',JSON.stringify(plan,null,1));console.log(plan.nodes);
