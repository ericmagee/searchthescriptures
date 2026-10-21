// Worker_A3 step 3d harness (BB-7330), falsifiers (1) to (8) and (10) of FALSIFIERS3.txt (git 1d19930), plus the TRUNCAT check.
// Pure functions are run from each node's own source (the file up to its first line that reads an n8n node). The three check nodes
// (Panel Cure Check, Alternate Merge, Cure Check) are also run whole, with their n8n inputs stubbed, to read the payload they emit.
const fs=require('fs'),path=require('path');
const pre=s=>{const L=s.split('\n');const i=L.findIndex(l=>/\$\(['"]/.test(l)&&!/^\s*\/\//.test(l));return L.slice(0,i<0?L.length:i).join('\n');};
const load=f=>new Function(pre(fs.readFileSync(f,'utf8'))+'\n;return {cureVerdicts,cureAsk,cureLines,cureCorrected:typeof cureCorrected==="function"?cureCorrected:null};')();
const runNode=(f,inputs)=>{const $=n=>{const v=inputs[n];return {isExecuted:v!==undefined,first:()=>({json:Array.isArray(v)?v[0]:v}),all:()=>(Array.isArray(v)?v:[v]).map(json=>({json}))};};
 return new Function('$','$input','$execution',fs.readFileSync(f,'utf8'))($,{first:()=>({json:{}})},{id:'0',customData:{set(){}}})[0].json;};
const RULE_NEW='RETRACTED: D<n> vs C<m> retracts your BROKEN grade on that line; a retracted line is not a BROKEN line, so that one line cures every item flagged on it (layer, count, pressing). A retraction counts only beside one CORRECTED RESULT line: your CLAUSE tag as it stands after your retractions, and that result is the one counted. A STATEMENT line never retracts anything.';
const FORM_R='RETRACTED: D<n> vs C<m>\nCORRECTED RESULT: <BROKEN-1 | BROKEN-2 | PARTIAL-1 | PARTIAL-2 | PARTIAL-3 | HELD-1>\n';
const L='D1 vs C7 (Galatians 4:4): DEFENDER LINK BROKEN -- (L1) "made of a woman" left unanswered in (CR3).';
const items=[{rule:'K-B',side:'DEFENDER',link:'D1 vs C7',line:L},{rule:'K-G1',side:'DEFENDER',link:'D1 vs C7',line:L},{rule:'K-G4',side:'DEFENDER',link:'D1 vs C7',line:L}];
const g3items=[{rule:'K-G3',side:'CHALLENGER',link:null,line:null}];
const broken={DEFENDER:['D1 vs C7'],CHALLENGER:[]};const rounds={DR1:'x',DR2:'x',CR3:'nothing here'};
const rep=t=>({ok:true,text:t});
const R={ok:'RETRACTED: D1 vs C7\nCORRECTED RESULT: HELD-1',none:'RETRACTED: D1 vs C7',resOnly:'CORRECTED RESULT: HELD-1',
 old:'WITHDRAWN: D1 vs C7\nCORRECTED RESULT: HELD-1',badHELD:'RETRACTED: D1 vs C7\nCORRECTED RESULT: HELD',badH2:'RETRACTED: D1 vs C7\nCORRECTED RESULT: HELD-2',
 badB:'RETRACTED: D1 vs C7\nCORRECTED RESULT: BROKEN',two:'RETRACTED: D1 vs C7\nCORRECTED RESULT: HELD-1\nCORRECTED RESULT: PARTIAL-1',
 md:'**RETRACTED: D1 vs C7**\n**CORRECTED RESULT: PARTIAL-3**',other:'RETRACTED: D2 vs C6\nCORRECTED RESULT: HELD-1',stmt:'STATEMENT: D1 vs C7 | Retracted, this line no longer stands as graded.\nCORRECTED RESULT: HELD-1'};
// (10) gemini 27563, rebuilt from the report's cure column (rows 72, 74, 76) and statement column (rows 71-76): RECONSTRUCTED, not the stored reply.
const GL=['D1 vs C7','D2 vs C6','D4 vs C7'];
const gemItems=GL.flatMap(k=>[{rule:'K-B',side:'DEFENDER',link:k,line:k+' (Romans 8:32): DEFENDER LINK BROKEN -- (L1) "x"'},{rule:'K-G1',side:'DEFENDER',link:k,line:k+' (Romans 8:32): DEFENDER LINK BROKEN -- (L1) "x"'}]);
const gemBroken={DEFENDER:GL,CHALLENGER:[]};
const gemReply=GL.map(k=>'RETRACTED: '+k+'\nSTATEMENT: '+k+' | Retracted to resolve K-G1 conflict, as CONCEDED LINKS is 0.').join('\n');
let fail=0;const say=[];
const st=(F,r,it,b)=>F.cureVerdicts(it||items,rep(r),b||broken,rounds);
const all=(v,s)=>v.every(x=>x.status===s);
function siteRuns(dir,reply,it,b){const out={};const iv=it||items,bk=b||broken;const orig='BROKEN';
 const body=JSON.stringify({payload:{judge_seat:'Gemini',verdict_tag:orig,verdict_raw:'RAW',defense_standing:'SELF-SUPPORTED'}});
 const nrm={cure:{idx:0,who:'alternate',k:0,broken:bk,rounds},reply:rep(reply)};
 const pcc=runNode(path.join(dir,'Panel_Cure_Check.js'),{'Panel Payloads':{debate_id:'d',bodies:[body],summary:[{seat:'Gemini',verdict_tag:orig,drv:iv}]},'Panel Cure Normalize 1':[nrm],'Init Seats':{}});
 out.pcc=JSON.parse(pcc.bodies[0]).payload;
 const am=runNode(path.join(dir,'Alternate_Merge.js'),{'Panel Cure Check':{debate_id:'d',bodies:[JSON.stringify({payload:{judge_seat:'Old',verdict_tag:'HELD',verdict_raw:'O',drv_uncured:2}})],summary:[{seat:'Old'}]},'Init Seats':{},
  'Alternate Payloads':[{alt:{seat:'Gemini',idx:0,removed_seat:'Old',qualify:false,api_model:'m'},ok:true,body,drv:iv,summary:{seat:'Gemini',verdict_tag:orig}}],'Alternate Cure Normalize':[nrm]});
 out.am=JSON.parse(am.bodies[0]).payload;out.amSeated=(am.alternates_seated||[]).length;out.amTried=am.alternates_tried;
 const cc=runNode(path.join(dir,'Cure_Check.js'),{'Extract Independent Verdict':{verdict_tag:orig,independent_verdict_raw:'RAW',debate_rule_violations:iv},'Cure Normalize':[{cure:{broken:bk,rounds},reply:rep(reply)}]});
 out.cc=cc;return out;}
for(const dir of process.argv.slice(2)){const T={};const inc=(k,c)=>{T[k]=(T[k]||0)+(c?1:0);if(!c&&dir.endsWith('new'))say.push('  FAIL '+k);};let n=0;
 for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.js')).sort()){n++;const s=fs.readFileSync(path.join(dir,f),'utf8');const F=load(path.join(dir,f));
  const ask=F.cureAsk(items.concat(g3items),{DEFENDER:['D1 vs C7'],CHALLENGER:['D2 vs C5']});
  // (1) keyword: no WITHDRAWN in what the judge is served; RETRACTED form and rule served once, in place.
  const r1=!/WITHDRAWN/.test(ask)&&ask.split(RULE_NEW).length===2&&ask.split(FORM_R).length===2&&/K-G1[^\n]*or with RETRACTED for that link/.test(s)&&/one RETRACTED line for each BROKEN link/.test(s)
   &&ask.indexOf('STATEMENT: <the flagged item')<ask.indexOf(RULE_NEW)&&ask.indexOf(RULE_NEW)<ask.indexOf('Write one STATEMENT line');
  inc('1 keyword '+f,r1);
  const g3b={DEFENDER:[],CHALLENGER:['D2 vs C5']};
  inc('2 RETRACTED alone cures nothing '+f,all(st(F,R.none),'UNCURED')&&all(st(F,'RETRACTED: D2 vs C5',g3items,g3b),'UNCURED'));
  inc('3 RETRACTED+RESULT cures K-B,K-G1,K-G4,K-G3 '+f,all(st(F,R.ok),'CURED')&&all(st(F,R.md),'CURED')&&all(st(F,'RETRACTED: D2 vs C5\nCORRECTED RESULT: PARTIAL-1',g3items,g3b),'CURED'));
  inc('5 RESULT alone cures nothing '+f,all(st(F,R.resOnly),'UNCURED')&&(!F.cureCorrected||F.cureCorrected(rep(R.resOnly),st(F,R.resOnly))===null));
  inc('6 old WITHDRAWN cures nothing '+f,all(st(F,R.old),'UNCURED'));
  inc('7 bad tags cure nothing '+f,[R.badHELD,R.badH2,R.badB,R.two].every(r=>all(st(F,r),'UNCURED')));
  inc('x other link and STATEMENT cure nothing '+f,all(st(F,R.other),'UNCURED')&&all(st(F,R.stmt),'UNCURED'));
  const gv=st(F,gemReply+'\nCORRECTED RESULT: HELD-1',gemItems,gemBroken),gn=st(F,gemReply,gemItems,gemBroken);
  inc('10 gemini replay '+f,gv.filter(v=>v.status!=='CURED').length===0&&gn.every(v=>v.status==='UNCURED'));
  inc('T no TRUNCAT in node '+f,!/TRUNCAT/.test(s));}
 // (4) the counting sites, run whole.
 const chk=(name,reply,want,it,b)=>{let o;try{o=siteRuns(dir,reply,it,b);}catch(e){inc('4 '+name+' threw '+e.message.slice(0,80),false);return;}
  const corr=x=>/\[AUDIT v21: CORRECTED RESULT -- /.test(x);
  inc('4 '+name+' Panel Cure Check',o.pcc.verdict_tag===want&&corr(o.pcc.verdict_raw)===(want!=='BROKEN')&&!/TRUNCAT/.test(o.pcc.verdict_raw));
  inc('4 '+name+' Alternate Merge',o.am.verdict_tag===(o.amSeated?want:'HELD')&&(o.amSeated?corr(o.am.verdict_raw)===(want!=='BROKEN'):true)&&!/TRUNCAT/.test(o.am.verdict_raw));
  inc('4 '+name+' Cure Check',o.cc.verdict_tag===want&&corr(o.cc.independent_verdict_raw)===(want!=='BROKEN')&&!/TRUNCAT/.test(o.cc.independent_verdict_raw));
  if(name==='ok')say.push('  sample audit line ('+dir.split('/').pop()+'): '+(o.pcc.verdict_raw.split('\n').find(corr)||'none'));};
 chk('ok',R.ok,'HELD');chk('md PARTIAL-3',R.md,'PARTIAL');chk('none',R.none,'BROKEN');chk('resOnly',R.resOnly,'BROKEN');chk('old',R.old,'BROKEN');chk('badHELD',R.badHELD,'BROKEN');chk('two',R.two,'BROKEN');
 chk('gemini HELD-1',gemReply+'\nCORRECTED RESULT: HELD-1','HELD',gemItems,gemBroken);chk('gemini no result',gemReply,'BROKEN',gemItems,gemBroken);
 const keys=Object.keys(T);const by={};keys.forEach(k=>{const g=k.split(' ')[0];by[g]=by[g]||[0,0];by[g][0]+=T[k];by[g][1]++;});
 console.log(dir.split('/').pop(),'nodes',n,'|',Object.entries(by).map(([g,[p,t]])=>'('+g+') '+p+'/'+t).join(' | '));}
say.forEach(l=>console.log(l));fail=say.filter(l=>l.startsWith('  FAIL')).length;console.log('fail',fail);
