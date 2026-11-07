// pkgEIS (W1, 11-07): the seat-first reply label "ENFORCER: grok (H1) -- AGREE ..." (33411 Alt call 2, 13 grok items NO VERDICT under pkgEID).
// pkgEID reads "H1.1 (grok)", a bare "Y8" and seat-only lines; it does not read the seat FIRST with the id in brackets. This rewrites such a line to the
// id-first form before the existing parse, so the bare-number rule (one item of the call starts "H1.") and every other check apply unchanged.
// Base: live s46 (1162a73a) Judge Enforcer Record + Alt, from fetchback_live_s46.json. Run from wall2024/: node pkgEIS/build_EIS.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const OLD="for(const l of txt.split('\\n')){const __t=l.replace(/[*_`]+/g,'').trim();";
const NEW="for(const l of txt.split('\\n')){let __t=l.replace(/[*_`]+/g,'').trim();{const __sf=__t.match(/^ENFORCER\\s*:\\s*(?:(?:JUDGE|SEAT)\\s+)?([A-Za-z][\\w.-]*)\\s*\\(\\s*(?:(?:ITEM|ANSWER|ID)\\s+)?([BVKYHZPRS]\\d+(?:\\.\\d+)?)\\s*\\)\\s*((?:--|—|–|-)[\\s\\S]*)$/i);if(__sf&&!/^[BVKYHZPRS]\\d/i.test(__sf[1])){__t='ENFORCER: '+__sf[2]+' ('+__sf[1]+') '+__sf[3];__eid.seat_first=(__eid.seat_first||0)+1;}} /* pkgEIS: seat-first label */";
const plan={};for(const f of ['Judge_Enforcer_Record.js','Alt_Judge_Enforcer_Record.js']){const s=fs.readFileSync('pkgEIS/base_s46/'+f,'utf8');
 if(s.split(OLD).length!==2)throw new Error(f+': anchor count '+(s.split(OLD).length-1));const p=s.replace(OLD,()=>NEW);fs.writeFileSync('pkgEIS/patched/'+f,p);plan[f]={base:h(s),patched:h(p)};console.log(f,h(s),'->',h(p));}
fs.writeFileSync('pkgEIS/patched.plan.json',JSON.stringify(plan,null,1));
