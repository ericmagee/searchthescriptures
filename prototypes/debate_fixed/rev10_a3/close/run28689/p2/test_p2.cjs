// P2 harness (BB-7994 step 4): F5a-F5d, F6a-F6c, F8a-F8b of FALSIFIERS.md. Rows from debate_results (rows3.json, md5-checked against SQL).
const fs=require('fs'),path=require('path');const D=__dirname;const rd=f=>fs.readFileSync(path.join(D,f),'utf8');
const rows=JSON.parse(rd('rows3.json'));const out=[];const say=s=>out.push(s);
const LBL=['[CR1] DEFENDER R1','[DR1] CHALLENGER R1','[CR2] DEFENDER R2','[DR2] CHALLENGER R2','[CR3] DEFENDER R3 -- LINK ROUND (defender exhibit-or-concede)','[DR3] CHALLENGER R3 -- LINK ROUND (challenger exhibit-or-concede)'];
const HDR=LBL.map(l=>'=== '+l+' ===');
const G={c_named:[],c_served:['S1'],d_named:[],d_served:['S2'],posline:'POSITIONS: the defender holds the record; the challenger presses it.',fref:'FREF'};
const stub=(map)=>{const $=n=>{if(!(n in map))throw new Error('no node '+n);const v=map[n];return {first:()=>({json:v}),all:()=>(Array.isArray(v)?v:[v]).map(json=>({json}))};};return $;};
const run=(src,map,input)=>new Function('$','$input',src)(stub(map),{first:()=>({json:input}),all:()=>[{json:input}]})[0].json;
const base={'Init with Guards':G,'Init Seats':{run_token:'T',single_judge:'deepseek'},'Fetch Models':[{seat:'deepseek',api_model:'m',max_tokens:8000}],'Resolve Seats':{deepseek:{api_model:'m',max_tokens:8000}},'Quote Report':{unavailable:true,items:[]}};
const fo=r=>({topic:r.topic,cr1:r.cr1,gr1:r.gr1,cr2:r.cr2,gr2:r.gr2,cr3:r.cr3,dr3:r.dr3});
// cureRounds, extracted verbatim from live Cure Build by brace matching.
const CB=rd('base_Cure_Build.js');const k0=CB.indexOf('function cureRounds(body){');let dep=0,k=k0;for(;k<CB.length;k++){if(CB[k]==='{')dep++;else if(CB[k]==='}'){dep--;if(dep===0)break;}}
const cureRounds=new Function(CB.slice(k0,k+1)+';return cureRounds;')();
const msgOf=b=>b.messages?b.messages.map(m=>m.content).join('\n'):JSON.stringify(b);
const BIVold=rd('base_Build_Independent_Verdict.js'),BIVnew=rd('new_Build_Independent_Verdict.js');
const mutBIV=BIVnew.split('=== [').join('[').split(' ===\'').join('\'');
const SANLEN=(x)=>x;
for(const r of rows){const map={...base,'Final Output':fo(r)};
 const o=run(BIVold,map),n=run(BIVnew,map),m=run(mutBIV,map);
 const uo=msgOf(o.verdictBody),un=msgOf(n.verdictBody);
 const once=HDR.map(h=>un.split('\n').filter(x=>x===h).length);
 const rn=cureRounds(n.verdictBody),ro=cureRounds(o.verdictBody),rm=cureRounds(m.verdictBody);
 const keys=x=>x&&typeof x==='object'?Object.keys(x).length:(Array.isArray(x)?x.length:0);
 say('ROW '+r.id.slice(0,8)+' F5a headers once each: '+once.join(',')+' | cureRounds keys new '+keys(rn)+', old '+keys(ro)+', bare-form mutant '+keys(rm));
 say('   rounds equal new vs old: '+(JSON.stringify(rn)===JSON.stringify(ro)));
 // F8a: diff of user messages, line by line
 const lo=uo.split('\n'),ln=un.split('\n');const dif=[];const n0=Math.max(lo.length,ln.length);
 if(lo.length!==ln.length)dif.push('LINE COUNT '+lo.length+' vs '+ln.length);else for(let i=0;i<n0;i++)if(lo[i]!==ln[i])dif.push(i+': '+lo[i].slice(0,70)+' => '+ln[i].slice(0,90));
 say('   F8a changed lines: '+dif.length);dif.forEach(x=>say('      '+x));
 // F8b: Extract Independent Verdict on the stored judge text, prev = old and new bodies
 const EX=rd('base_Extract_Independent_Verdict.js');const inp={choices:[{message:{content:r.iv},finish_reason:'stop'}]};
 const eo=run(EX,{'Build Independent Verdict':o},inp),en=run(EX,{'Build Independent Verdict':n},inp);
 const F=['framework_verdict','defense_standing','conceded_links','challenge_standing','challenger_conceded_links'];
 const pick=e=>({framework_verdict:e.verdict_tag,defense_standing:e.defense_standing,conceded_links:e.conceded_links,challenge_standing:e.challenge_standing,challenger_conceded_links:e.challenger_conceded_links});
 const po=pick(eo),pn=pick(en);say('   F8b extract new==old: '+(JSON.stringify(po)===JSON.stringify(pn))+' | audit_flags equal: '+(JSON.stringify(eo.audit_flags)===JSON.stringify(en.audit_flags)));
 for(const f of F)say('      '+f.padEnd(26)+' extract '+String(pn[f]).padEnd(16)+' stored '+String(r[f])+(String(pn[f])===String(r[f])?'':'   <- DIFFERS'));
}
// Diagnostic prompt: F5c, F5d, F6a on both branches
const DPo=rd('base_Build_Diagnostic_Prompt.js'),DPn=rd('new_Build_Diagnostic_Prompt.js');
const NEI="You hold neither seat. The [CR] rounds are the DEFENDER's and the [DR] rounds are the CHALLENGER's. Write about both sides in the third person; never call either side's rounds your own.";
const SEC="The debate's verdict is the panel's. The panel judges after this diagnostic is written, so it is not known here. Review the second opinion's break; do not announce a verdict.";
const LAB="SECOND OPINION (single judge, not the debate's verdict): ";
const r0=rows.find(x=>x.id.startsWith('e6253a01'));
for(const vt of ['BROKEN','HELD']){const d={...fo(r0),verdict_tag:vt,independent_verdict_raw:'IVRAW',synthesis:'SYN'};
 const map={...base,'Cure Check':d,'D1 Extract':{usage:{}},'D2 Extract':{usage:{}},'Synthesis Normalizer':{usage:{}}};
 const n=run(DPn,map),o=run(DPo,map);const u=msgOf(n.requestBody),uo=msgOf(o.requestBody);const L=u.split('\n');
 const hc=HDR.map(h=>L.filter(x=>x===h).length).join(',');const pi=L.indexOf(G.posline);
 say('DIAG '+vt+' F5c headers '+hc+' | "[GR" '+(u.split('[GR').length-1)+' | F5d neither line count '+(u.split(NEI).length-1)+', right after posline '+(L[pi+1]===NEI)+
  ' | F6a label '+(u.split(LAB).length-1)+', "INDEPENDENT VERDICT" '+(u.split('INDEPENDENT VERDICT').length-1)+', second line '+(u.split(SEC).length-1)+' | old "INDEPENDENT VERDICT" '+(uo.split('INDEPENDENT VERDICT').length-1));
 say('   label line: '+L.find(x=>x.startsWith('SECOND OPINION')));}
// F6b, F6c: Extract Diagnostic and Format Markdown synthParts
const EDo=rd('base_Extract_Diagnostic.js'),EDn=rd('new_Extract_Diagnostic.js');
const sepB='--- ORACLE_DEBATE_V1 BROKEN DIAGNOSTIC ---',sepC='--- ORACLE_DEBATE_V1 CONFIRMATION ---';
say('F6b separators in new Extract Diagnostic: BROKEN '+(EDn.split(sepB).length-1)+', CONFIRMATION '+(EDn.split(sepC).length-1)+' (old '+(EDo.split(sepB).length-1)+', '+(EDo.split(sepC).length-1)+')');
const FM=rd('base_Format_Markdown.js');const i1=FM.indexOf('const DIAG_MARK');const line=FM.slice(i1,FM.indexOf('\n',FM.indexOf('\n',i1)+1));
say('FM lines read: '+line.replace(/\n/g,' || ').slice(0,400));
for(const vt of ['BROKEN','HELD']){const prev={synthesis:'THE SYNTHESIS TEXT.',verdict_tag:vt};
 const e=run(EDn,{'Init Seats':{run_token:'T'},'Build Diagnostic Prompt':prev},{choices:[{message:{content:'DIAG BODY'},finish_reason:'stop'}],usage:{}});
 const sep=vt==='BROKEN'?sepB:sepC;const after=e.synthesis.split(sep)[1];
 say('F6b '+vt+': synthesis = '+JSON.stringify(e.synthesis));
 say('   line right after separator: '+JSON.stringify(after.split('\n')[1]));}
console.log(out.join('\n'));
// F6c: Format Markdown's synthParts (its own two lines, read from P1 35de12a3) on the new synthesis; mutant renames the separator.
{const FM=rd('base_Format_Markdown.js');const a=FM.indexOf('const DIAG_MARK');const b=FM.indexOf('\n',FM.indexOf('const synthParts',a));
 const sp=new Function(FM.slice(a,b)+';return synthParts;')();
 const syn="THE SYNTHESIS TEXT.\n\n--- ORACLE_DEBATE_V1 BROKEN DIAGNOSTIC ---\n(A review of the single judge's second opinion, which was BROKEN. The debate's verdict is the panel's.)\nDIAG BODY";
 const p=sp(syn);console.log('F6c synthParts: synthesis part '+JSON.stringify(p[0])+' | diagnostic part '+JSON.stringify(p[1]));
 const q=sp(syn.replace('BROKEN DIAGNOSTIC','DIAGNOSTIC (on the single judge)'));console.log('F6c mutant (separator renamed): diagnostic part '+JSON.stringify(q[1])+' | synthesis part holds diagnostic: '+q[0].includes('DIAG BODY'));}
