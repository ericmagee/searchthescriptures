// pkgEB7 (rulings item 13; Eric 10:42 CST 11-07, no judge issue is low priority). DeepSeek enforcer fix, side-neutral.
// B7 (selfLines421) only writes a mark, and it matches on the verse alone. E-B7 puts each B7 hit to DeepSeek: the premise's list entry, the judge's
// UNEXHIBITED clause, and the judge's own MEETS ANSWER CHECK lines on that verse. RIGHT: SAME GROUND (the MEETS answer check answers the very fact the
// premise is counted as missing) or DIFFERENT GROUND. SAME GROUND is a DISAGREE: sent back (Send Back Build), and an uncured item is counted in
// drv_uncured (Send Back Record, AUDIT v51), as pkgKSC is. Cure: CHANGE TO the CONCEDED LINKS line without premise n counted UNEXHIBITED; CHANGE TO the
// ANSWER CHECK on that verse graded MISSES or FAILS; or KEEP with a sentence quoting 6+ words in a row of the premise entry and 6+ words in a row of a
// MEANS of those ANSWER CHECK lines. A DISAGREE written with RIGHT: DIFFERENT GROUND is CONTRADICTED and not sent.
// Bases: enforcer nodes = pkgEAI/patched_on_pkgEID (EID, EAI); Send Back nodes = pkgL1Q/patched (W3 PASS 2896).
// Run from wall2024/: node pkgEB7/build_EB7.cjs [--ebase dir] [--sbase dir] [--out dir] [--live true|false]
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const EB=arg('--ebase','pkgEAI/patched_on_pkgEID'),SB=arg('--sbase','pkgL1Q/patched'),OUT=arg('--out',__dirname+'/patched'),LIVE=arg('--live','true')==='true';fs.mkdirSync(OUT,{recursive:true});

// ---- Judge Enforcer Build (and Alt): items
const BUILD_ITEMS=`/* pkgEB7 (rulings item 13): E-B7, each B7 hit (a premise this judge counts UNEXHIBITED on a verse whose ANSWER CHECK lines by the same judge, on
   that side's answers, all read MEETS) put to DeepSeek: same ground or different ground. Side-neutral: CONCEDED LINKS reads the defender's answers
   ([CR] rounds), CHALLENGER CONCEDED LINKS the challenger's ([DR] rounds), as selfLines421 does. */
{const __acG=a=>{const m=String(a).match(AC);if(m)return m[5];const g=[...String(a).matchAll(/--\\s*(MEETS|MISSES|FAILS)\\b/g)];return g.length?g[g.length-1][1]:null;};
 const __seen=new Set();let __si=0;
 for(const j of judges){const ls=linesOf(j.t);const acs=ls.filter(l=>/^ANSWER CHECK:/.test(l));
  for(const l of ls){const h=l.match(/^(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\\s*:(.*)$/i);if(!h)continue;const sd=/^CHALLENGER/i.test(h[1])?'C':'D';const rl=sd==='D'?'C':'D';
   for(const seg of h[2].split(/(?=\\bpremise\\s+\\d+)/i)){const pm=seg.match(/^premise\\s+(\\d+)/i);if(!pm||!/\\bUNEXHIBITED\\b/i.test(seg))continue;const n=+pm[1];
    const hit=[],own=[];for(const r of refsOf(seg)){const o=acs.filter(a=>{const m=a.match(/^ANSWER CHECK:\\s*(.+?)\\s*--\\s*\\[\\s*([CD])R/);return m&&m[2]===rl&&refsOf(m[1]).has(r);});
     if(o.length&&o.every(a=>__acG(a)==='MEETS')){hit.push(r);for(const a of o)if(!own.includes(a))own.push(a);}}
    if(!hit.length)continue;const key=j.seat+'|'+sd+'|'+n;if(__seen.has(key))continue;__seen.add(key);__si++;const id='S'+__si+'.1';
    const V=hit.map(r=>r.replace(/\\b[a-z]/g,c=>c.toUpperCase())).join(', ');const e=entry(sd,n)||'';const sideW=sd==='D'?'defender':'challenger';
    const means=own.map(a=>{const m=String(a).match(AC);return m?m[3]:'';}).filter(Boolean);
    items.push({ids:[{id,rule:'E-B7',seat:j.seat,grade:'DIFFERENT GROUND',item:'SELF-CONTRADICTION '+sideW+' premise '+n+' on '+V,flagged_line:l.slice(0,1500),response_line:own.join('\\n').slice(0,700),
      b7:{side:sd==='D'?'DEFENDER':'CHALLENGER',n,refs:hit,verses:V,round:rl+'R',entry:e.slice(0,1500),seg:seg.trim().slice(0,600),means:means.map(x=>x.slice(0,600)),ac:own.map(a=>a.slice(0,900))}}],
     text:'ITEM S'+__si+' (E-B7, a premise this judge counts UNEXHIBITED on '+V+', where its own ANSWER CHECK lines on the '+sideW+'\\'s answers read MEETS):\\nTHE PREMISE (number '+n+', listed against the '+sideW+'): '+(e?cut(e,1200):'(the list entry was not found)')
      +'\\nTHIS JUDGE\\'S COUNT ('+id+', '+j.seat+'): '+cut(seg.trim(),600)+'\\nTHIS JUDGE\\'S ANSWER CHECK LINES ON '+V+' (each MEETS):\\n'+own.map(a=>'- '+cut(a,900)).join('\\n')});}}}}
`;
const BUILD_RULE=`'RULE E-B7 (a premise counted UNEXHIBITED while the same judge grades MEETS an answer on the same verse; ruling 421, one judge may not hold both on one ground). UNEXHIBITED says the side did not show the fact the premise assumes. MEETS says the side\\'s answer showed how the verse fits its case against the press. Decide FIRST the right reading: SAME GROUND when a MEETS line\\'s press (its MEANS) and its answer concern the very fact the premise is counted as missing, so the two rulings cannot both stand; DIFFERENT GROUND when the press concerns another fact than the one the premise assumes (for example, the press is about who is addressed, while the premise is about whose house she is of). Read only the premise entry, the judge\\'s count and the ANSWER CHECK lines given you. AGREE when DIFFERENT GROUND; DISAGREE when SAME GROUND, quoting the premise words and the MEANS words that are the same fact.\\n'
 +'NO ANSWER, for every rule:`;
const E_BUILD=[["if(!items.length)return [{json:{je_skip:true",BUILD_ITEMS+"if(!items.length)return [{json:{je_skip:true"],
 ["'NO ANSWER, for every rule:",BUILD_RULE],
 ["| TRUE | OVERSTATED -- <one sentence","| TRUE | OVERSTATED | SAME GROUND | DIFFERENT GROUND -- <one sentence"]];

// ---- Judge Enforcer Record (and Alt)
const RIGHTS0='(MEETS|MISSES|NOT VOID|VOID|BROKEN|STANDS|UNDERDETERMINED|COUNTED|SPARED|DOES NOT FOLLOW|FOLLOWS|TRUE|OVERSTATED)';
const RIGHTS1='(MEETS|MISSES|NOT VOID|VOID|BROKEN|STANDS|UNDERDETERMINED|COUNTED|SPARED|DOES NOT FOLLOW|FOLLOWS|TRUE|OVERSTATED|SAME GROUND|DIFFERENT GROUND)';
const E_REC_ALL=[['[BVKYHZPR]','[BVKYHZPRS]'],[RIGHTS0,RIGHTS1]]; // every occurrence
const E_REC=[["for(const k of ['E-ANS','E-VOID','E-COL','E-SYN','E-HOLD','E-KEY','E-PREM','E-RES'])","for(const k of ['E-ANS','E-VOID','E-COL','E-SYN','E-HOLD','E-KEY','E-PREM','E-RES','E-B7'])"],
 ["const __ec=v&&(v.v==='DISAGREE'||v.v==='NO ANSWER')?ETC(x.rule,v.right,v.why):null;","const __ec=v&&(v.v==='DISAGREE'||v.v==='NO ANSWER')?(x.rule==='E-B7'&&v.v==='DISAGREE'&&v.right!=='SAME GROUND'?(v.right||'NO RIGHT'):ETC(x.rule,v.right,v.why)):null; /* pkgEB7: a DISAGREE is SAME GROUND only */"]];

// ---- Send Back Build (and Alt)
const sbbMark=jeb=>`/* pkgEB7: an E-B7 disagreement carries its premise, verses and MEANS from the Build, for the note and the cure */
try{const __b7I={};for(const __it of $('${jeb}').all())for(const __x of ((__it.json&&__it.json.ids)||[]))if(__x&&__x.rule==='E-B7'&&__x.b7)__b7I[__x.seat+'|'+__x.item]=__x.b7;for(const __x of dis)if(__x&&__x.rule==='E-B7')__x.b7=__b7I[__x.seat+'|'+__x.item]||{refs:[],means:[]};}catch(e){}
`;
const B7NOTE=`const __b7R=i=>!i.b7?'':'\\nTHE SELF-CONTRADICTION RULE (E-B7, ${LIVE?'ENFORCED':'TRIAL: answer it; it removes no seat'}, pkgEB7; ruling 421): your '+(i.b7.side==='CHALLENGER'?'CHALLENGER ':'')+'CONCEDED LINKS line counts premise '+i.b7.n+' UNEXHIBITED on '+(i.b7.verses||'')+', and your own ANSWER CHECK on '+(i.b7.verses||'that verse')+' for the '+String(i.b7.side||'').toLowerCase()+'\\'s answer reads MEETS. The enforcer reads them as the same ground; both cannot stand. CHANGE TO your '+(i.b7.side==='CHALLENGER'?'CHALLENGER ':'')+'CONCEDED LINKS line without premise '+i.b7.n+' counted UNEXHIBITED, or CHANGE TO that ANSWER CHECK line graded MISSES. To keep both, KEEP with a sentence that quotes the premise (at least 6 words in a row of: "'+String(i.b7.entry||'').slice(0,300)+'") and the press (at least 6 words in a row of its MEANS, or all of it if shorter) and says how the two grounds differ.'; /* pkgEB7 */
`;
const E_SBB=jeb=>[["/* pkgECL (W3 2547): the layer check on every E-COL line, ENFORCED",sbbMark(jeb)+"/* pkgECL (W3 2547): the layer check on every E-COL line, ENFORCED"],
 ["ksc:x.ksc||null,src:x}));","ksc:x.ksc||null,b7:x.b7||null,src:x}));"],
 ["const __kscR=i=>!i.ksc?'':'\\n'+KSC.note(i.ksc); /* pkgKSC */","const __kscR=i=>!i.ksc?'':'\\n'+KSC.note(i.ksc); /* pkgKSC */\n"+B7NOTE],
 ["+__kscR(i)+","+__kscR(i)+__b7R(i)+"],
 ["ksc:i.ksc||null,epk:i.epk||null,","ksc:i.ksc||null,b7:i.b7||null,epk:i.epk||null,"]];

// ---- Send Back Record (and Alt)
const B7LIB=`/* pkgEB7 (rulings item 13): the E-B7 cure. ${LIVE?'ENFORCED':'TRIAL'} (B7.LIVE). */
const B7=(()=>{const LIVE=${LIVE};const NN=s=>String(s==null?'':s).toLowerCase().replace(/\\\\+"/g,'"').replace(/[‘’“”"'\`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9 :]+/g,' ').replace(/\\s+/g,' ').trim();
 const six=(t,src)=>{const n=Math.min(6,NN(src).split(' ').filter(Boolean).length);if(n<3)return null;const w=NN(t).split(' ').filter(Boolean);const s=' '+NN(src)+' ';for(let i=0;i+n<=w.length;i++)if(s.includes(' '+w.slice(i,i+n).join(' ')+' '))return w.slice(i,i+n).join(' ');return null;}; /* 6 words in a row, or all of a shorter text (3 words at least) */
 const refs=s=>{const o=new Set();for(const m of String(s||'').matchAll(/\\b((?:[1-3]\\s)?[A-Z][a-z]+)\\s+(\\d+):(\\d+)/g))o.add(m[1].toLowerCase()+' '+m[2]+':'+m[3]);return o;};
 const R=(ok,w)=>({status:ok?'CURED':'UNCURED',why:w+' (pkgEB7'+(LIVE?'':'; TRIAL')+')'});
 function cure(it,a){const p=it.b7||{};if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');
  if(a.ans==='KEEP'){const q1=six(a.why,p.entry||''),q2=(p.means||[]).map(m=>six(a.why,m)).find(Boolean);
   return R(!!(q1&&q2),q1&&q2?'KEEP quoting the premise ("'+q1+'") and the press MEANS ("'+q2+'")':'KEEP whose sentence does not quote both 6 words in a row of the premise entry and 6 words in a row of a MEANS'+(q1?' (premise quoted, no MEANS)':q2?' (MEANS quoted, no premise)':''));}
  const to=String(a.to||'').replace(/\\\\+"/g,'"').replace(/[*_\`]+/g,'').trim().replace(/^(?:[-•>]\\s*|\\d+[.)]\\s+)/,'');
  const h=to.match(/^(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\\s*:(.*)$/i);
  if(h){const sd=/^CHALLENGER/i.test(h[1])?'CHALLENGER':'DEFENDER';if(sd!==p.side)return R(false,'the CHANGE TO is the other side\\'s CONCEDED LINKS line');
   const still=h[2].split(/(?=\\bpremise\\s+\\d+)/i).some(s=>{const m=s.match(/^premise\\s+(\\d+)/i);return m&&+m[1]===+p.n&&/\\bUNEXHIBITED\\b/i.test(s);});
   return R(!still,still?'the CHANGE TO still counts premise '+p.n+' UNEXHIBITED':'the CHANGE TO no longer counts premise '+p.n+' UNEXHIBITED');}
  const m=to.match(/^ANSWER CHECK:\\s*(.+?)\\s*--\\s*\\[\\s*([CD])R/);
  if(m){const on=[...refs(m[1])].some(r=>(p.refs||[]).includes(r));const g=[...to.matchAll(/--\\s*(MEETS|MISSES|FAILS)\\b/g)].map(x=>x[1]).pop();
   if(!on)return R(false,'the CHANGE TO is an ANSWER CHECK on another verse than '+(p.verses||'the one sent'));if(String(p.round||'')[0]!==m[2])return R(false,'the CHANGE TO grades the other side\\'s answer');
   return R(g==='MISSES'||g==='FAILS','the CHANGE TO grades the answer '+(g||'with no grade'));}
  return R(false,'the CHANGE TO is neither the CONCEDED LINKS line nor an ANSWER CHECK line on '+(p.verses||'the verse'));}
 return {LIVE,cure};})();
`;
const E_SBR=[["const KSC=(()=>{",B7LIB+"const KSC=(()=>{"],
 ["const KSCM={};","const KSCM={};const B7M={}; /* pkgEB7: seat -> uncured E-B7 items */"],
 ["  if(it.ksc){try{__ec=KSC.cure(it,a||{ans:'NO ANSWER'});}","  if(it.b7){try{__ec=B7.cure(it,a||{ans:'NO ANSWER'});}catch(e){__ec={status:'UNREAD',why:'self-contradiction cure reading error: '+String(e&&e.message||e).slice(0,160)};}} /* pkgEB7 */\n  if(it.ksc){try{__ec=KSC.cure(it,a||{ans:'NO ANSWER'});}"],
 ["(__ec?(it.ksc?' | CURE (KEYSTONE CONSISTENCY ENFORCED, pkgKSC): ':","(__ec?(it.b7?' | CURE (SELF-CONTRADICTION '+(B7.LIVE?'ENFORCED':'TRIAL')+', pkgEB7): ':it.ksc?' | CURE (KEYSTONE CONSISTENCY ENFORCED, pkgKSC): ':"],
 ["  else if(it.ksc&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';});});",
  "  else if(it.ksc&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';\n  if(it.b7&&__ec&&__ec.status!=='CURED'&&!silent&&!err){if(rows[rows.length-1].cure_status!=='UNCURED')(B7M[b.seat]=B7M[b.seat]||[]).push(it.sid+' (E-B7 '+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';} /* pkgEB7: counts once; silence is counted already (pkgSBS) */\n  else if(it.b7&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';});});"],
 ["const ksc_counted=[];","const ksc_counted=[];const b7_counted=[];"],
 ["/* pkgIMP: each seat's uncured imposed-requirement items are added to its drv_uncured */",
  "/* pkgEB7: each seat's uncured self-contradiction items are added to its drv_uncured (B7.LIVE) */\nif(Object.keys(B7M).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies)).slice();\n for(const [seat,its] of Object.entries(B7M)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;\n  if(B7.LIVE){p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;}b7_counted.push({seat,items:its,counted:B7.LIVE});\n  p.verdict_raw=p.verdict_raw+'\\n[AUDIT v51: SELF-CONTRADICTION UNCURED (pkgEB7, ruling 421'+(B7.LIVE?'':'; TRIAL')+') -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+(B7.LIVE?'; counted in drv_uncured':'; TRIAL rule: recorded, not counted in drv_uncured; it removes no seat')+'. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}\n/* pkgIMP: each seat's uncured imposed-requirement items are added to its drv_uncured */"],
 ["imp_counted,ksc_counted},","imp_counted,ksc_counted,b7_counted},"]];

const rep=(s,a,b,nm)=>{const c=s.split(a).length-1;if(c!==1)throw new Error(nm+' anchor x'+c+': '+a.slice(0,70));return s.replace(a,()=>b);};
const plan={source:'W2 pkgEB7, rulings item 13 (B7 as a DeepSeek enforcer check)',live:LIVE,ebase:EB,sbase:SB,nodes:[]};
const job=(name,base,E,ALL)=>{const f=name.replace(/ /g,'_')+'.js';const s0=fs.readFileSync(base+'/'+f,'utf8');let s=s0;
 for(const [a,b] of (ALL||[])){const c=s.split(a).length-1;if(c<1)throw new Error(name+' all-anchor x0: '+a);s=s.split(a).join(b);}
 for(const [a,b] of E)s=rep(s,a,b,name);new Function('$','$input','$json','$execution','$workflow','$node','$items',s);fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({name,file:f,base_sha:sha(s0),final_sha:sha(s),bytes:[s0.length,s.length]});};
job('Judge Enforcer Build',EB,E_BUILD);job('Alt Judge Enforcer Build',EB,E_BUILD);
job('Judge Enforcer Record',EB,E_REC,E_REC_ALL);job('Alt Judge Enforcer Record',EB,E_REC,E_REC_ALL);
job('Send Back Build',SB,E_SBB('Judge Enforcer Build'));job('Alt Send Back Build',SB,E_SBB('Alt Judge Enforcer Build'));
job('Send Back Record',SB,E_SBR);job('Alt Send Back Record',SB,E_SBR);
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log(plan.nodes.map(n=>n.name+' '+n.base_sha+'->'+n.final_sha).join('\n'));
