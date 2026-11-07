// pkgUNXA replay over pkgUNXA/data/rows.json (47 runs, 29199 to 33222): every stored panel verdict, live s16 kunxLines with the K-UNX-A edit.
// Lists every premise whose count rests on an ASSUMES or an "unanswered" ground (either side), RAISED or NOT, with the [L1] quote and why.
const fs=require('fs');const {patch}=require('./patch.cjs');const AM=fs.readFileSync(__dirname+'/base/Alternate_Merge.js','utf8');
const s0=AM.indexOf('const __CSPOUT=(()=>{\n')+22;const env=patch(AM.slice(s0,AM.indexOf("const AM=$('Alternate Merge Seat')")));
const K=new Function('$','$input',env+';return {kunxLines,ciCountSection,lbBlockText,lbFoot,ciRounds,unxSegs,unxPresses,unxaL1,unxaHead,UNX_MRUN,UNXA_HARD,UNXA_ASM,UNXA_UNA};')(()=>{throw 0;},null);
const rows=JSON.parse(fs.readFileSync(__dirname+'/data/rows.json','utf8'));
// 33222 grok (the alternate tried, not stored in debate_judgments; inputs/33222_Alternate_Merge.json alternates_tried[0].verdict_raw), W3 2727
{const g=JSON.parse(fs.readFileSync(__dirname+'/data/grok_33222.json','utf8'));rows.find(r=>r.run.includes('33222')).j.push({seat:'grok(alt)',v:g.v});}
const unw=v=>{const s=String(v||'').trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const J=JSON.parse(s.slice(0,i+1));if(J&&typeof J.reasoning==='string')return J.reasoning;}catch(e){}}return String(v||'');};
const out=[],stat={verdicts:0,A_items:0,A_raised:0,B_items:0,B_raised:0,other_items:0};const judg={A:new Set(),B:new Set()};
for(const r of rows){if(!r.e3||!r.c3)continue;const PT='=== [CR3] ===\n'+r.e3+'\n\n=== [DR3] ===\n'+r.c3+'\n';const R=K.ciRounds(PT);
 for(const j of r.j){stat.verdicts++;const T=unw(j.v).replace(/\n\n\[AUDIT v[\s\S]*$/,'');const X=K.kunxLines(T,PT).items;
  for(const side of ['DEFENDER','CHALLENGER']){const rk=side==='CHALLENGER'?'DR3':'CR3';const sec=K.ciCountSection(T,side);if(!sec)continue;const SG=K.unxSegs(sec);const seen=new Set();
   for(const s of SG){if(!/\bUNEXHIBITED\b/.test(s.seg)||/\b(?:not|never|no\s+longer)\s+UNEXHIBITED\b/i.test(s.seg))continue;
    for(const p of s.ns){if(seen.has(p))continue;seen.add(p);const all=SG.filter(z=>z.ns.includes(p));const isA=all.some(z=>K.UNXA_ASM.test(z.seg)),isB=all.some(z=>K.UNXA_UNA.test(z.seg));if(!isA&&!isB)continue;
     const blk=K.lbBlockText(R[rk],p);const k=blk?K.lbFoot(blk,true):[];const l1=blk?K.unxaL1(blk):null;const x=X.find(y=>y.link===side+' premise '+p&&y.a);
     const hard=all.some(z=>K.UNXA_HARD.test(K.unxaHead(z.seg)));const tag=(isA?'A':'')+(isB?'B':'');if(isA){stat.A_items++;judg.A.add(r.run+j.seat);if(x&&x.a==='ASSUMES')stat.A_raised++;}if(isB){stat.B_items++;judg.B.add(r.run+j.seat);if(x&&x.a==='UNANSWERED')stat.B_raised++;}
     let why;if(x)why='RAISED '+x.a;else if(!blk)why='NOT: no block';else if(hard)why='NOT: other exempt ground';else if(k.length<2)why='NOT: block kinds '+(k.join(',')||'none');else if(isA&&!k.includes('L1')&&!isB)why='NOT: no counted [L1]';else if(isA&&l1&&K.UNX_MRUN(all.map(z=>z.seg.slice(Math.max(0,z.seg.search(K.UNXA_ASM)))).join(' '),l1.q,6))why='NOT: ASSUMES clause quotes the [L1]';else why='NOT: '+(isB?'press not named or its MEANS not quoted under a MEANS line':'no [L1] quotation found');
     out.push([r.run.slice(5,10),j.seat,side[0]+p,tag,why,'kinds='+(k.join(',')||'-'),'L1='+(x&&x.l1?x.l1ref+' "'+x.l1.slice(0,90)+'"':l1?l1.ref+' "'+l1.q.slice(0,90)+'"':'-'),'count: '+all.map(z=>z.seg.replace(/\s+/g,' ').trim()).join(' | ').slice(0,300)].join(' :: '));}}}}}
stat.A_judgments=judg.A.size;stat.B_judgments=judg.B.size;
const txt=JSON.stringify(stat)+'\n'+out.join('\n')+'\n';fs.writeFileSync(__dirname+'/replay_UNXA.txt',txt);console.log(txt.slice(0,200000));
