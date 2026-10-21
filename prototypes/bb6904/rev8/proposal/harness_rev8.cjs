// BB-6904 rev 8 step 3 harness: the live and patched check and cure code over the five stored same-topic rows. No model call, no flow run.
// Usage: node harness_rev8.cjs <five.json> <mod_live.js> <mod_new.js>
const fs=require('fs');const [F,ML,MN]=process.argv.slice(2);const D=JSON.parse(fs.readFileSync(F,'utf8'));
const L=require(ML),N=require(MN);
const text=(raw)=>{const h=String(raw||'').split('\n\n[AUDIT')[0];try{return JSON.parse(h).reasoning||h;}catch(e){return h;}};
const R=(r)=>({CR1:r.dr1,CR2:r.dr2,CR3:r.dlink,DR1:r.cr1,DR2:r.cr2,DR3:r.clink}); // flow tags: CR = defender rounds, DR = challenger rounds
const cnt=(it,k)=>it.filter(x=>x.rule===k).length;let tot={live:{},new:{}};
console.log('1. DETECTION (drvCheck), per judge: live K-G1 | new K-G1 K-G4');
for(const r of D){const row=r.tok.slice(5,10);
 const js=[{seat:'single',raw:r.single,ds:null}].concat((r.judges||[]).map(j=>({seat:j.seat,raw:j.raw,ds:j.ds})));
 for(const j of js){let st={};try{st=JSON.parse(String(j.raw).split('\n\n[AUDIT')[0]);}catch(e){}
  const t=text(j.raw);const dc=st.conceded_links!=null?st.conceded_links:(()=>{const m=t.match(/CONCEDED LINKS:\s*(\d+)/);return m?+m[1]:null;})();
  const cc=st.challenger_conceded_links!=null?st.challenger_conceded_links:(()=>{const m=t.match(/CHALLENGER CONCEDED LINKS:\s*(\d+)/);return m?+m[1]:null;})();
  const a=L.drvCheck(t,dc,cc,null,null,false).items,b=N.drvCheck(t,dc,cc,null,null,false).items;
  for(const k of ['K-G1','K-G4']){tot.live[k]=(tot.live[k]||0)+cnt(a,k);tot.new[k]=(tot.new[k]||0)+cnt(b,k);}
  console.log(row,j.seat.padEnd(8),'live',cnt(a,'K-G1'),'| new',cnt(b,'K-G1'),cnt(b,'K-G4'));}}
console.log('TOTAL live',JSON.stringify(tot.live),'new',JSON.stringify(tot.new));
// 2. CURE VERDICTS on synthetic replies (the code that grades a cure; the judge's actual reply needs a model call and is UNEXERCISED).
const r=D.find(x=>x.tok.includes('27433'));const RR=R(r);
const sent=(s)=>{const m=String(s).replace(/\s+/g,' ').match(/[A-Z][^.?!"“”*#\[\]]{40,140}[.?!]/);return m?m[0]:null;};
const dq=sent(RR.DR1),cq=(()=>{const i=RR.CR3.indexOf('Luke 3:23');return sent(RR.CR3.slice(i));})();
const line='D4 vs C2 (Luke 3:23): DEFENDER LINK BROKEN — [L1] Luke 3:23 says "being (as was supposed) the son of Joseph"; [CR3] never answers.';
const item={rule:'K-G4',side:'DEFENDER',link:'D4 vs C2',line};const B={DEFENDER:['D4 vs C2'],CHALLENGER:[]};
const T=(name,reply,exp)=>{const v=N.cureVerdicts([item],{ok:true,text:reply},B,RR)[0];console.log((v.status===exp?'PASS ':'FAIL ')+name+': '+v.status+' -- '+v.why);return v.status===exp;};
console.log('\n2. CURE VERDICTS (K-G4 and K-G5) on 27433 single judge D4 vs C2, Luke 3:23 named in CR3; DR1 quote:',JSON.stringify(dq).slice(0,90),'; CR3 quote:',JSON.stringify(cq).slice(0,90));
let ok=true;
ok&=T('PRESSED true, no SHORT',`PRESSED: D4 vs C2 | [DR1] | "${dq}"`,'UNCURED');
ok&=T('PRESSED true + SHORT true',`PRESSED: D4 vs C2 | [DR1] | "${dq}"\nSHORT: D4 vs C2 | [CR3] | "${cq}" | the link round restates the register and never shows why supposed does not overturn it`,'CURED');
ok&=T('PRESSED false quote',`PRESSED: D4 vs C2 | [DR1] | "these words are not in the round at all anywhere"`,'UNCURED');
ok&=T('PRESSED wrong round',`PRESSED: D4 vs C2 | [CR1] | "${dq}"`,'UNCURED');
ok&=T('WITHDRAWN','WITHDRAWN: D4 vs C2','CURED');
ok&=T('SHORT with a false quote',`PRESSED: D4 vs C2 | [DR1] | "${dq}"\nSHORT: D4 vs C2 | [CR3] | "nothing like this is in the link round text" | it falls short of the text`,'UNCURED');
ok&=T('prose only','I stand by my line.','UNCURED');
const item2={rule:'K-G4',side:'DEFENDER',link:'D3 vs C4',line:'D3 vs C4 (Genesis 99:99): DEFENDER LINK BROKEN'};
const v2=N.cureVerdicts([item2],{ok:true,text:`PRESSED: D3 vs C4 | [DR1] | "${dq}"`},{DEFENDER:['D3 vs C4']},RR)[0];console.log((v2.status==='CURED'?'PASS ':'FAIL ')+'K-G4 with a verse the link round does not name, PRESSED true: '+v2.status);ok&=v2.status==='CURED';
// 3. The refusal check: the patched extract's pattern over every stored round of the five rows.
console.log('\n3. REFUSAL TEXT CHECK over 30 stored rounds');const RFT=/^\s*The request was rejected because it was considered high risk\.?\s*$/i;
let fired=[];for(const x of D)for(const k of ['dr1','dr2','dlink','cr1','cr2','clink']){const body=String(x[k]||'').replace(/^[^\n]*-- ROUND \d[^\n]*\n\n/,'');if(RFT.test(body))fired.push(x.tok.slice(5,10)+':'+k);}
console.log('fired on',JSON.stringify(fired));ok&=fired.length===1&&fired[0]==='27177:dlink';
console.log('\nHARNESS', ok?'PASS':'FAIL');
// 4. ITEM 5: the judge's own statement (7191), recorded, never curing by itself.
{console.log('\n4. ITEM 5, the judge statement');let ok5=true;const T5=(n,c)=>{console.log((c?'PASS ':'FAIL ')+n);ok5&=!!c;};
 const rep=`PRESSED: D4 vs C2 | [DR1] | "${dq}"\nSHORT: D4 vs C2 | [CR3] | "${cq}" | the link round restates the register and never shows why supposed does not overturn it\nSTATEMENT: K-G4 D4 vs C2 | The challenger pressed Luke 3:23 in its first round and the link round named it without answering the word supposed.`;
 const v=N.cureVerdicts([item],{ok:true,text:rep},B,RR)[0];T5('statement attached to a cured item',v.status==='CURED'&&/pressed Luke 3:23/.test(v.judge_statement||''));
 const v0=N.cureVerdicts([item],{ok:true,text:'WITHDRAWN: D4 vs C2'},B,RR)[0];T5('no statement written: null',v0.status==='CURED'&&v0.judge_statement===null);
 const vs=N.cureVerdicts([item],{ok:true,text:'STATEMENT: D4 vs C2 | I stand by this line because the challenger is right about it.'},B,RR)[0];T5('a statement alone does not cure (option 1)',vs.status==='UNCURED'&&/stand by/.test(vs.judge_statement||''));
 const g3={rule:'K-G3',side:'DEFENDER',link:null,line:null};const vg=N.cureVerdicts([g3],{ok:true,text:'CORRECTED STANDING: DEFENDER PROP-DEPENDENT\nSTATEMENT: K-G3 DEFENDER | My broken lines and my standing disagreed; the standing follows the lines.'},B,RR)[0];T5('K-G3 statement matched by side',vg.status==='CURED'&&/standing follows/.test(vg.judge_statement||''));
 const rl=N.cureReport('gemini',[v,v0])[0],rl0=N.cureReport('gemini',[v0])[0];T5('report line carries JUDGE STATEMENT',/; JUDGE STATEMENT: The challenger pressed/.test(rl));T5('report line says none written',/; JUDGE STATEMENT: none written\]$/.test(rl0));
 const rd=N.drvRead('Panel judge Gemini',rl).rows[0];T5('transcript parser reads it, statement kept apart',rd&&/The challenger pressed/.test(rd['JUDGE STATEMENT']||'')&&!/JUDGE/.test(rd.STATEMENT||''));
 const rdl=L.drvRead('Panel judge Gemini',rl).rows[0];T5('the live parser would fold it into STATEMENT (why the parser changes)',rdl&&/JUDGE STATEMENT/.test(rdl.STATEMENT||''));
 console.log('ITEM 5', ok5?'PASS':'FAIL');ok&=ok5;}
console.log('\nHARNESS (with item 5)', ok?'PASS':'FAIL');
