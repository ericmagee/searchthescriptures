// pkgKG1L (W1, 11-07; W3 2952, grade_33442): a gate K-G1 item names a contradiction between two lines, the collision graded LINK BROKEN on an
// unanswered witness and the same side's CONCEDED LINKS count of 0. It listed only the collision, so gateLineFor2024 aimed any CHANGE TO at the
// collision; chatgpt (33442) fixed the count line, the engine read that as dropping the collision (E-APPLY 2351), refused it, and removed the seat.
// (1) gateNewK2024: a K-G1 item also lists the side's CONCEDED LINKS line (CHALLENGER CONCEDED LINKS for a challenger link). gateLineFor2024 already
//     matches a change to the line with the same label (sbLabel knows both count labels), so a count-line change now replaces the count line.
// (2) gateCure2024, K-G1 items: an applied change that raises CHALLENGER CONCEDED LINKS above 0 writes a [pkgKG1L ORACLE CONCEDE ...] note naming the
//     chain (W3: every Oracle concede needs a cause). A K-G1 change that pkgRCT refuses (it recounts premises the same judge took out at the cure) is
//     recorded and removes no seat, as W3 2819 item 3 already does for a NOT APPLIED item; before, it fell to 'not applied' and counted. Every other
//     check (K re-read, E-APPLY, kby new LIVE items) runs unchanged.
// Base: pkgLIB v10 full sources (pkgLIB_v10/orig_stack/patched). 6 library nodes carry these functions. Ships as pkgLIB_v11. Run from wall2024/.
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);const B='pkgKG1L/base_v10/';
const A1="items.push({key:'RULE|'+k,rule:x.rule,live:enfStatus(x.rule)==='LIVE',why:(w?String(w):x.rule+(x.link?' '+x.link:'')).slice(0,500),lines:x.line?[String(x.line)]:[]});}";
const N1=String.raw`items.push({key:'RULE|'+k,rule:x.rule,live:enfStatus(x.rule)==='LIVE',why:(w?String(w):x.rule+(x.link?' '+x.link:'')).slice(0,500),lines:x.line?[String(x.line)].concat(x.rule==='K-G1'?__kg1lCount(T1,x.side):[]):[]});} /* pkgKG1L (W3 2952): a K-G1 item lists both lines of its contradiction */`;
const A0="function gateNewK2024(T0,T1,F0,F1,ctx){";
const N0=String.raw`/* pkgKG1L (W3 2952): the side's CONCEDED LINKS line in the judgment text (the last one, as written), for a K-G1 gate item */
function __kg1lCount(T,side){if(side!=='DEFENDER'&&side!=='CHALLENGER')return [];const re=side==='CHALLENGER'?/^(?:[-\u2022]|\d+[.)])?\s*CHALLENGER CONCEDED LINKS\s*:/i:/^(?:[-\u2022]|\d+[.)])?\s*(?:DEFENDER\s+)?CONCEDED LINKS\s*:/i;
 const L=String(T||'').split('\n').filter(l=>re.test(l.replace(/\\+/g,'').replace(/[*_\x60]+/g,'').trim()));return L.length?[L[L.length-1].trim()]:[];}
function gateNewK2024(T0,T1,F0,F1,ctx){`;
const A2="cured=!now.has(x.key)&&(applied.has(x.gid)||st);why=cured?(applied.has(x.gid)?'the gate change was applied and the item is no longer raised':'the gate change is already in the corrected text (another change wrote the same line), and the item is no longer raised (W3 2319)'):(!applied.has(x.gid)?(st?'the gate change is already in the corrected text, but the item is still raised':'the gate change was not applied'):'the corrected text still raises it');";
const N2=A2+String.raw`{const __k1=x.kind==='RULE K-G1'&&a.ans==='CHANGE'; /* pkgKG1L (W3 2952) */
   const __rc=__k1&&!cured&&!applied.has(x.gid)&&((R2.R1&&R2.R1.items)||[]).find(z=>z&&z.sid===x.gid&&z.rct);
   if(__rc){cured=true;why='pkgRCT refused the K-G1 gate change on the count line, and the count stays at your cure value (recorded, no seat removed; W3 2819 item 3, pkgKG1L): '+String(__rc.why).slice(0,300);}
   else if(__k1&&cured&&applied.has(x.gid)&&/^(?:[-•]|\d+[.)])?\s*CHALLENGER CONCEDED LINKS\s*:\s*[1-9]/i.test(String(a.to||'').replace(/\\+/g,'').replace(/[*_\x60"“”]+/g,'').trim()))why+=' [pkgKG1L ORACLE CONCEDE: this K-G1 change on the count line sets CHALLENGER CONCEDED LINKS to '+((String(a.to).match(/CONCEDED LINKS\s*:\s*(\d+)/i)||[])[1])+'; chain: the collision line "'+String((x.lines||[])[0]||'').slice(0,200)+'" stands BROKEN on a witness left unanswered, and K-G1 requires the count]';}`;
const plan={};for(const f of fs.readdirSync(B).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(B+f,'utf8');const s0=s;const c=[A0,A1,A2].map(a=>s.split(a).length-1);
 if(c.every(n=>n===0)){continue;}if(!c.every(n=>n===1))throw new Error(f+': counts '+c.join(','));
 s=s.replace(A0,()=>N0).replace(A1,()=>N1).replace(A2,()=>N2);new Function('$','$input',s);fs.writeFileSync('pkgKG1L/patched/'+f,s);plan[f]={base:h(s0),patched:h(s)};}
fs.writeFileSync('pkgKG1L/patched.plan.json',JSON.stringify(plan,null,1));console.log(Object.keys(plan).length+' nodes:',Object.keys(plan).join(', '));
