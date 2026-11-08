// pkgFCT: FORM CONFORMANCE TEST (approved redesign item 1, step 1; W3 3168). For every option form a send-back ask offers, render its example
// for the item's own flagged line, answer every item with it, and run the engine's own chain: Send Back Build -> (synthetic reply) ->
// Send Back Record -> Gate Build (sbApply2024). FAIL when the engine refuses an offered form for its FORM (not for content):
// "no line form the engine reads", "drops the collision", "has no line label", a CONCEDED LINKS / CHAIN MARK side move.
// Usage (from wall2024/): node pkgFCT/fct.cjs <SendBackBuild.js> <SendBackRecord.js> <GateBuild.js> [main|alt] [runs...]
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const [SBB,SBR,GB,side='main',...only]=process.argv.slice(2);const src=f=>fs.readFileSync(f,'utf8');const B=src(SBB),R=src(SBR),G=src(GB);
const N=side==='alt'?{b:'Alt Send Back Build',c:'Alt Send Back Call openrouter',r:'Alt Send Back Record',g:'Alt Gate Build',bi:'Alt Judge Enforcer Record'}:{b:'Send Back Build',c:'Send Back Call openrouter',r:'Send Back Record',g:'Gate Build',bi:'Judge Enforcer Record'};
const fn=n=>n.replace(/ /g,'_');const ld=(RUN,n)=>{const d=JSON.parse(fs.readFileSync(D+RUN+'_'+fn(n)+'.json','utf8'));const r=Array.isArray(d)?d[0]:d;return ((r.data&&r.data.main)||r.main)[0];};
const FORM=/no line form the engine reads|drops the collision|has no line label|moves the \w+ (?:CHALLENGER )?CONCEDED LINKS|CHAIN MARK/i;
const nrm=s=>String(s||'').replace(/[*_`]+/g,'').trim();
const PAIR=l=>{const m=nrm(l).match(/(D\d+)\s+vs\.?\s+(C\d+)/i);return m?m[1]+' vs '+m[2]:null;};
const isF=l=>/^\s*(?:[-•]|\d+[.)])?\s*FORCED\b/i.test(nrm(l));const isCol=l=>/^\s*(?:[-•]|\d+[.)])?\s*D\d+\s+vs\.?\s+C\d+\b/i.test(nrm(l));
const regrade=(l,g)=>{const t=nrm(l);const m=t.match(/^(\s*(?:[-•]|\d+[.)])?\s*D\d+\s+vs\.?\s+C\d+\b(?:\s*\([^)\n]*\))?[^:\n(]*:\s*)(.*)$/);if(!m)return null;const gi=m[2].search(/GROUND\s*:/i);
 return m[1]+g+' -- the record leaves the reading open'+(gi>=0?' -- '+m[2].slice(gi):' -- GROUND: [L1] Luke 1:35 "the power of the Highest shall overshadow thee"');};
// option extractors: [name, test on the item block, synth(line)]
const OPT=[
 ['RETRACTED: <pair>',b=>/CHANGE TO: RETRACTED: <pair>/.test(b),l=>PAIR(l)?'RETRACTED: '+PAIR(l):null],
 ['bare RETRACTED',b=>/CHANGE TO: RETRACTED(?!:)/.test(b),l=>'RETRACTED'],
 ['pair regraded UNDERDETERMINED',b=>/pair regraded|regrade it \(CHANGE TO|CHANGE TO the line regraded|keep UNDERDETERMINED by CHANGE TO the same line/.test(b),l=>isCol(l)?regrade(l,'UNDERDETERMINED'):(PAIR(l)?PAIR(l)+': UNDERDETERMINED -- the record leaves the reading open -- GROUND: [L1] Luke 1:35 "the power of the Highest shall overshadow thee"':null)],
 ['FORCED form',b=>/FORCED: <Dn vs Cm> -- MEANS/.test(b),l=>PAIR(l)?'FORCED: '+PAIR(l)+' -- MEANS [CR3]: "the power of the Highest is the stated means" -- ANSWER [DR3]: "The power and presence sanctify the son" -- FAILS: "The power and presence sanctify the son"':null]];
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^\d+_/.test(f)&&f.slice(f.indexOf('_')+1)===fn(N.c)+'.json').map(f=>f.split('_')[0]))].filter(r=>!only.length||only.includes(r)).sort();
const res={offered:0,refused:[],ran:0,skipped:[]};const byOpt={};
for(const RUN of runs){if(![N.b,N.r,N.bi].every(n=>fs.existsSync(D+RUN+'_'+fn(n)+'.json'))){res.skipped.push(RUN+' inputs');continue;}
 let built;try{built=harness(RUN)(B,N.bi);}catch(e){res.skipped.push(RUN+' build '+e.message.slice(0,50));continue;}
 const call=ld(RUN,N.c);
 for(let v=0;v<OPT.length;v++){const [oname,has,synth]=OPT[v];const answered=[];
  const c2=JSON.parse(JSON.stringify(call));
  built.forEach((bi,k)=>{const j=bi.json;if(j.sb_skip||!j.items)return;const msg=String(j.msg||'');const blocks={};msg.split(/\n(?=ITEM S\d+ \()/).forEach(t=>{const m=t.match(/^ITEM (S\d+) \(/);if(m)blocks[m[1]]=t;});
   const lines=[];for(const it of j.items){const blk=blocks[it.sid]||'';if(!has(blk)){lines.push('SENDBACK: '+it.sid+' || KEEP || The record says "'+String(it.line).slice(0,40)+'".');continue;}
    const to=synth(it.line);if(!to){lines.push('SENDBACK: '+it.sid+' || KEEP || The record says "x".');continue;}
    answered.push({seat:j.seat,sid:it.sid,rule:it.rule,line:it.line,to});lines.push('SENDBACK: '+it.sid+' || CHANGE TO: '+to+' || The record says "'+String(it.line).slice(0,40).replace(/"/g,'')+'".');}
   const ci=c2.findIndex(x=>x.json&&x.json.model===j.api_model);if(ci>=0)c2[ci].json.choices[0].message.content=lines.join('\n');});
  if(!answered.length)continue;res.ran++;byOpt[oname]=byOpt[oname]||{offered:0,refused:0};
  let rec,gate;try{rec=harness(RUN,{[N.b]:built,[N.c]:c2})(R,N.c);gate=harness(RUN,{[N.b]:built,[N.c]:c2,[N.r]:rec})(G,N.r);}catch(e){res.skipped.push(RUN+' '+oname+' '+e.message.slice(0,60));continue;}
  const gi=gate.map(x=>x.json);
  for(const a of answered){res.offered++;byOpt[oname].offered++;const g=gi.find(x=>x.seat===a.seat);const its=(g&&(g.items||g.gate_items))||[];
   const hit=its.find(z=>z&&(z.src==='E-APPLY '+a.sid||z.sid===a.sid)&&z.kind==='NOT APPLIED'&&FORM.test(String(z.why||'')));
   if(hit){byOpt[oname].refused++;res.refused.push(RUN+' '+a.seat+' '+a.sid+' ('+a.rule+', '+(isF(a.line)?'FORCED line':isCol(a.line)?'collision line':'other line')+') offered "'+oname+'": '+String(hit.why).slice(0,90));}}}}
const out=[];out.push('FORM CONFORMANCE ('+side+'): '+res.ran+' run x option replays; '+res.offered+' offered answers; '+res.refused.length+' refused for form');
for(const [k,v] of Object.entries(byOpt))out.push('  '+k+': offered '+v.offered+', refused '+v.refused);
res.refused.forEach(r=>out.push('  REFUSED '+r));if(res.skipped.length)out.push('  skipped: '+res.skipped.join('; '));
out.push(res.refused.length?'FAIL':'PASS');console.log(out.join('\n'));
