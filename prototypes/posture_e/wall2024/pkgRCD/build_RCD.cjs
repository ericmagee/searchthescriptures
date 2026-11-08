// pkgRCD (W2, 11-08; Eric "yes" 17:40 CST to the Matthew 1:18 countermeasure, coordinator ASK 1; W2 Wall 3266/3267).
// The repeat: a judge grades a collision (Matthew 1:18 in 17 of 22 runs) LINK BROKEN; the enforcer sends the collision line back; the judge
// CHANGEs the collision line (e.g. to UNDERDETERMINED) but leaves its RULING card for the same pair on the old grade; the gate then raises
// E-GATE D38 ("your RULING card grades ... but your collision line ... now grades it ...") and a second send-back round follows.
// Change (sbApply2024, the send-back apply in the library): a RULING card "RULING -- D<i> vs C<j> -- <grade>" that carried the collision
// line's OLD grade, which this send-back regrades, and which no change touches, takes the NEW grade, marked "(derived by the engine ...;
// pkgRCD)". Same precedent as the derived KEYSTONE line (E-APPLY, W3 2362). The judge's own CHANGE TO decides the grade; the card follows it.
// A card that already disagreed before the send-back is left alone (D38 still raises it). Only the three link grades are derived.
// Run from wall2024/: node pkgRCD/build_RCD.cjs [base strip, default pkgLIB/strip_RI4] [dest strip, default pkgLIB/strip_RCD]
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_RI4')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_RCD')+'/patched/';
const PLAN='/tmp/claude-0/plan_RCD_'+(process.argv[3]||'pkgLIB/strip_RCD').replace(/\/$/,'').split('/').pop()+'.json';
fs.rmSync(DST,{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});
const A=' if(!map.size&&!items.length&&!resTo)return null;\n const T=build(map);';
const B=String.raw` {/* pkgRCD (W2; Eric yes 11-08 17:40 CST; Matthew 1:18 repeat): a RULING card that carried a collision line's old grade follows the judge's own regrade of that line in this send-back, when no change touches the card (as the derived KEYSTONE line, W3 2362), so card and line agree (D38) */
  const __rk=s=>U(s).replace(/[*_\x60]+/g,'').replace(/\s+VS\.?\s+/,' VS ').trim();const __CG=/^(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)$/;
  const __g0=new Map(rcLines(text).col.map(z=>[__rk(z.link),z.grade])),__g1=new Map(rcLines(build(map)).col.map(z=>[__rk(z.link),z.grade]));
  for(const l of lines){if(map.has(l))continue;let r;try{r=__RL.readLine(String(l).trim());}catch(e){r=null;}if(!r||r.form!=='RULING'||!r.f||r.f.restated)continue;
   const sm=String(r.f.subject||'').replace(/[*_\x60]+/g,'').trim().match(/^(D\d+)\s+vs\.?\s+(C\d+)$/i);if(!sm)continue;const lk=__rk(sm[1]+' VS '+sm[2]);
   const cg=U(String(r.f.grade||'').replace(/[*_\x60]+/g,'').replace(/\s+/g,' ').trim()).replace(/\s*\(.*$/,'');if(!__CG.test(cg))continue;
   const a=__g0.get(lk),b=__g1.get(lk);if(!a||!b||a===b||cg!==a||!__CG.test(b))continue;if([...map.values()].some(c=>nrm(c.to)===nrm(l)))continue;
   const k=U(l).lastIndexOf(cg);if(k<0)continue;const sids=[...new Set([...map].filter(([o,c])=>__rk(c.to).includes(lk)).map(([o,c])=>c.sid))];
   map.set(l,{sid:'RULING (derived)',to:l.slice(0,k)+b+' (derived by the engine from the collision grade of '+sm[1]+' vs '+sm[2]+' after the change of '+(sids.join(', ')||'the send-back')+'; pkgRCD, as W3 2362)'+l.slice(k+cg.length),over:[],derived:true});}}
` + A;
const plan={base:SRC,nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;
 if(s.includes('function sbApply2024(')){if(s.split(A).length!==2)throw new Error(f+': anchor not once');s=s.replace(A,()=>B);new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.nodes[f]={base:h(s0),patched:h(s)};}
 fs.writeFileSync(DST+f,s);}
fs.writeFileSync(PLAN,JSON.stringify(plan,null,1));console.log(Object.keys(plan.nodes).length+' nodes patched; plan '+PLAN);
