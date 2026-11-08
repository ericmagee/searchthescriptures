// pkgSGA3 (W2, 11-08; Eric "approved" 13:47 CST, ASK 2): the repeating E-APPLY no-label class (33798: gemini S5-S8, terra x2; W3 3362).
// A send-back CHANGE TO written as "Premise N: <grade> -- <reason>" against a CONCEDED LINKS line that has no sentence of its own for premise N was
// refused (pkgSGA: "the change has no line label and would replace the whole ... line"). The engine knows the target line, so it now
// appends the change to that line as its own clause, under four guards (else the old refusal stands):
//   1 the line's side and count number do not change (psGrades before and after);
//   2 premise N gets a grade, and it is not COUNTED (a counted premise would leave the count stale: pkgSGA2's rule); when the line already
//     grades N in a joint "Premises a, N and b are X" sentence and N is not COUNTED there, N is taken out of that sentence first (33798 terra S13);
//   3 no other premise's grade changes or appears (digits in the reason must not regrade other premises);
//   4 the appended clause starts a new clause for psGrades: " -- " after a bare "<label>: <n>", else "; ".
// Run from wall2024/: node pkgSGA3/build_SGA3.cjs [base strip=pkgLIB/strip_RTB3] [dest strip=pkgLIB/strip_SGA3]
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_RTB3').replace(/\/$/,'')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_SGA3').replace(/\/$/,'')+'/patched/';
const A1="}else{items.push({sid:x.sid,kind:'NOT APPLIED',why:'the change has no line label and would replace the whole '+__lo+' line'";
const B1="}else if(!__ix.length&&__pn&&sga3Append2024(__c,__pn,to)){to=sga3Append2024(__c,__pn,to); /* pkgSGA3 */"+A1;
const A2="function sbApply2024(";
const B2="/* pkgSGA3 (W2, 11-08; Eric approved ASK 2): append a no-label \"Premise N: <grade>\" change to the CONCEDED LINKS line that has no sentence for\n"
 +"   premise N, when side and count stay, N gets a grade that is not COUNTED, and no other premise moves; else null (the pkgSGA refusal stands) */\n"
 +"function sga3Append2024(cur,pn,to){try{const c=String(cur==null?'':cur).trim(),t=String(to==null?'':to).trim();if(!c||!t||!new RegExp('^Premise\\\\s+'+pn+'\\\\b','i').test(t))return null;\n"
 +" const P0=psGrades(c);if(!P0)return null;let c1=c;\n"
 +" if(pn in P0.g){if(P0.g[pn]==='COUNTED')return null;const J=/\\b(Premises\\s+)((?:\\d+\\s*(?:,\\s*(?:and\\s+)?|and\\s+|&\\s*))+\\d+)(\\s+)(are|were)\\b/gi;const hs=[...c.matchAll(J)].filter(m=>(m[2].match(/\\d+/g)||[]).map(Number).includes(+pn));if(hs.length!==1)return null;\n"
 +"  const m=hs[0];const rest=(m[2].match(/\\d+/g)||[]).map(Number).filter(n=>n!==+pn);if(!rest.length)return null;const lst=rest.length===1?String(rest[0]):rest.slice(0,-1).join(', ')+' and '+rest[rest.length-1];\n"
 +"  c1=c.slice(0,m.index)+(rest.length===1?'Premise ':m[1])+lst+m[3]+(rest.length===1?(/^were$/i.test(m[4])?'was':'is'):m[4])+c.slice(m.index+m[0].length);} /* a joint sentence that names N loses N; the change is appended as N's own clause */\n"
 +" const bare=/CONCEDED LINKS\\s*:\\s*\\d*\\s*\\.?$/i.test(c1);const nw=bare?c1.replace(/\\s*\\.$/,'')+' -- '+t:c1.replace(/[\\s.;]+$/,'')+'; '+t;\n"
 +" const P1=psGrades(nw);if(!P1||P1.side!==P0.side||P1.n!==P0.n||!(pn in P1.g)||P1.g[pn]==='COUNTED')return null;\n"
 +" for(const k of new Set(Object.keys(P0.g).concat(Object.keys(P1.g))))if(+k!==+pn&&P0.g[k]!==P1.g[k])return null;return nw;}catch(e){return null;}}\n"+A2;
fs.rmSync(DST,{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});const plan={base:SRC,nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;
 const n1=s.split(A1).length-1,n2=s.split(A2).length-1;if(n1!==n2)throw new Error(f+': anchors '+n1+'/'+n2);
 if(n1){if(n1!==1)throw new Error(f+': anchor x'+n1);if(!/function psGrades\(/.test(s))throw new Error(f+': no psGrades');s=s.replace(A1,()=>B1).replace(A2,()=>B2);
  new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.nodes[f]={base:h(s0),patched:h(s)};}
 fs.writeFileSync(DST+f,s);}
fs.writeFileSync('pkgSGA3/plan_'+DST.split('/').filter(Boolean).slice(-2,-1)[0]+'.json',JSON.stringify(plan,null,1)+'\n');console.log(Object.keys(plan.nodes).length+' nodes patched');
