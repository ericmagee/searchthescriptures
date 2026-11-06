// pkgBAR build (Eric approved 17:21 CST 2026-11-06; W3 spec, Wall 2632, parts 1 and 2).
// Run from wall2024/: node pkgBAR/build_BAR.cjs [base workflow JSON] [out workflow JSON]
//   default base: pkgBAR/base/workflow_base.json (make_base.cjs: live 98daac9e + n19 + n20 + pkgIMP b0208c5). W4 passes the real fetch-back.
// Part 1: BARRED MOVES block at the end of both debater system prompts (Init with Guards: dsys and csys), ending "Repeated offenses will
//   result in disqualification."; the VOID sentence and the same closing line after Commitment 14 in the 15 PART2 nodes.
// Part 2: one re-call stage per debater round the pkgIMP harvest reads (C1, D2, C2, D3, C3, D4, C4 = [DR1] [CR2] [DR2] [CR3] [DR3] [CR4]
//   [DR4]), on the pkgOGS pattern: <r>B Build, <r>B Route, 7 <r>B Call copies, <r>B Extract. Every later reader of the round reads <r>B Extract.
//   Build Save Body writes AUDIT v47 lines (re-call, VOID); Failure Salvage reads the B Extract first.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const {addStage}=require('./stage.cjs');
const IN=process.argv[2]||'pkgBAR/base/workflow_base.json',OUTW=process.argv[3]||'pkgBAR/out/workflow_BAR.json';
const w=JSON.parse(fs.readFileSync(IN,'utf8'));const N=()=>Object.fromEntries(w.nodes.map(n=>[n.name,n]));let NN=N();
const OUT='pkgBAR/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:IN,base_nodes:w.nodes.length,changed:[],added:[]};const base={};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor found '+n+' times: '+a.slice(0,90));return s.replace(a,()=>b);};
const LIB=fs.readFileSync('pkgIMP/src_IMP.js','utf8')+'\n'+fs.readFileSync('pkgBAR/src_BAR.js','utf8')+'\n';
const code=n=>{if(!NN[n])throw new Error('no node '+n);if(!(n in base))base[n]=JSON.stringify(NN[n].parameters);return NN[n].parameters.jsCode;};
const setCode=(n,s)=>{code(n);new Function('$','$input','$json',s);NN[n].parameters.jsCode=s;};
// ---------- Part 1 ----------
const STAMP='Repeated offenses will result in disqualification.';
const BARRED="\n\nBARRED MOVES. Four moves are barred to both sides. Each example is from one of our runs.\n"
 +"(a) An answer from silence: answering a press from what a verse does not name, state or say. Run 33107 [CR3]: \"They do not name the parent.\" Run 33149 [CR4]: \"It does not say through whom.\"\n"
 +"(b) A requirement the verse never sets: asking a verse to state what it never sets out to state, and counting its silence against the other side. Run 33160 [CR4]: Mary asks how, and the answer does not say \"when Joseph takes you.\"\n"
 +"(c) Answering the verse but not the press's MEANS: naming or quoting the pressed verse without meeting the meaning the press claims for it. Run 33160 [DR3]: the press on Matthew 1:19 claimed it MEANS \"a husband who knew himself the father would have no cause to put her away\"; the answer gave the verse's words (\"being a just [man]... was minded to put her away privily\") and their Greek, and never met that meaning.\n"
 +"(d) Granting a row and then acting as if it were not granted. Run 33107: [CR3] \"I grant that \"born of a woman\" is said of men with fathers.\" Then [CR4] rested the source on that same row: \"Galatians 4:4 puts the same woman as the source.\"\n"
 +"Answer every press positively: quote the words a verse does state ([L1], with its reference) and say what they carry. When a sentence of yours only denies a requirement the other side imposed, write directly under it: NOT A REQUIREMENT -- rebuts [<the other side's round>] \"<their words, 6 or more, word for word>\". "
 +"The system finds (a) and (b) in code. A round that carries one is sent back to you once; a sentence that still carries one after that is VOID: the system strikes it from the round, the press it answered counts as unanswered, and the offense is named in the run report. "+STAMP;
{const n='Init with Guards';const a="const dsys=build('DEFENDER',S.defender,S.dpos)+PROVE;const csys=build('CHALLENGER',S.challenger,S.cpos)+PROVE;";
 setCode(n,rep(code(n),a,"const __BARRED="+JSON.stringify(BARRED)+"; /* pkgBAR part 1: both debaters */\nconst dsys=build('DEFENDER',S.defender,S.dpos)+PROVE+__BARRED;const csys=build('CHALLENGER',S.challenger,S.cpos)+PROVE+__BARRED;",n));}
const J14="\n\nA sentence the system marks VOID (pkgBAR) is a barred move struck from its round: the press it answered counts as unanswered, and I grade no ANSWER CHECK MEETS on it.\n"+STAMP;
const J14JS=J14.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,'\\n');
const C14END='a KEEP does not cure the item, and an item left uncured is recorded against my seat.";';
for(const n of ['Panel Build','Reserve Build','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Alternate Build','Alternate Cure Build','Accept Build','Accept Check','Accept Return Build','Accept Final','Accept DS Return Build','Enforcer Build','Judge Enforcer Build','Alt Judge Enforcer Build'])
 setCode(n,rep(code(n),C14END,C14END.slice(0,-2)+J14JS+'";',n));
// ---------- Part 2 ----------
const ORDER=['D1','C1','D2','C2','D3','C3','D4','C4'];const RR=['C1','D2','C2','D3','C3','D4','C4'];
const G={C3:{src:'C3G Extract',gb:'C3G Build',gk:'press_resend',fault:"c=>!c||c.error||!c.applies?1e9:(c.missing||[]).length+(c.unanswered||[]).length",chk:'press_check'},
         C4:{src:'C4G Extract',gb:'C4G Build',gk:'grants_resend',fault:"c=>!c||c.error||!c.applies?1e9:(c.missing||[]).length+(c.misquoted||[]).length",chk:'grants_check'}};
const LAB=r=>(r[0]==='D'?'CR':'DR')+r[1];const FIN=r=>r==='D1'?'D1 Extract':r+'B Extract';
const own=r=>new Set([r+' Build',r+' Extract',r+'G Build',r+'G Extract',r+'B Build',r+'B Extract']);
// readers: every $('<r> Extract') / $('<r>G Extract') outside the round's own stage reads $('<r>B Extract')
NN=N();const readers={};
for(const n of w.nodes){if(n.name==='Failure Salvage'||/^(?:C1|D2|C2|D3|C3|D4|C4)B /.test(n.name))continue;let s=JSON.stringify(n.parameters),k=0;
 for(const r of RR){if(own(r).has(n.name))continue;for(const old of [r+' Extract',r+'G Extract'])for(const q of ["'",'"','\\"']){const a="$("+q+old+q+")",b="$("+q+r+"B Extract"+q+")";const c=s.split(a).length-1;if(c){s=s.split(a).join(b);k+=c;}}}
 if(k){if(!(n.name in base))base[n.name]=JSON.stringify(n.parameters);n.parameters=JSON.parse(s);readers[n.name]=k;}}
// the z-ai conversation helper reads the previous round by a built name
for(const n of ['D3 Build','C3 Build','D4 Build','C4 Build'])setCode(n,rep(code(n),"const raw=$(side+prev+' Extract').first().json.raw;","const raw=$(side+prev+'B Extract').first().json.raw; /* pkgBAR */",n));
// Failure Salvage: the B Extract first, then the round's G or own Extract
{const n='Failure Salvage';let s=code(n);let k=0;
 s=rep(s,"const t=(r==='C3'?P('C3G Extract',j=>j.raw):null)||P(r+' Extract',j=>j.raw);","const t=P(r+'B Extract',j=>j.raw)||(r==='C3'?P('C3G_Extract_',j=>j.raw):null)||P(r+' Extract',j=>j.raw); /* pkgBAR */",n);
 s=s.replace(/P\('(C1|D2|C2|D3|D4) Extract',(j=>j\.\w+)\)/g,(m,r,f)=>{k++;return "(P('"+r+"B Extract',"+f+")||P('"+r+" Extract',"+f+"))";});
 s=s.replace(/P\('(C3|C4)G Extract',(j=>j\.\w+)\)/g,(m,r,f)=>{k++;return "P('"+r+"B Extract',"+f+")||P('"+r+"G Extract',"+f+")";});
 s=s.split("P('C3G_Extract_',").join("P('C3G Extract',");
 if(k!==7)throw new Error('Failure Salvage: '+k+' round reads, expected 7');setCode(n,s);}
// Build Save Body: AUDIT v47 lines, one per re-call and one per VOID sentence, in round order
{const n='Build Save Body';const a='for(const x of __L2RV)FF.push(x);';
 setCode(n,rep(code(n),a,a+"\n/* pkgBAR: the barred-move re-calls and the VOID sentences, named in the run's review notes */\nfor(const r of "+JSON.stringify(RR)+"){try{const nd=r+'B Extract';if(!$(nd).isExecuted)continue;const b=$(nd).first().json.bar;if(!b||!b.applies||!b.resent)continue;"
 +"FF.push('[AUDIT v47: BARRED MOVE RE-CALL (pkgBAR) -- SEAT: '+b.seat+' ('+b.side+'); ROUND: ['+b.round+']; SENT BACK: '+((b.first&&b.first.hits)||[]).length+' sentence(s); KEPT: '+b.kept+' round ('+b.why+'); VOID: '+(b.void||[]).length+'.]');"
 +"for(const v of (b.void||[]))FF.push('[AUDIT v47: BARRED MOVE VOID (pkgBAR) -- SEAT: '+v.seat+' ('+v.side+'); ROUND: ['+v.round+']; SENTENCE: \"'+String(v.sentence).slice(0,300)+'\"; '+v.move+'; '+(v.struck?'struck from the round':'not found in the round to strike')+'; the press it answered counts as unanswered. REVIEW THIS ROW.]');}catch(e){}}",n));}
// the stages
const stageCodes={};
for(const r of RR){NN=N();const g=G[r];const src=g?g.src:r+' Extract',P=r+'B',L=LAB(r),side=r[0]==='D'?'DEFENDER':'CHALLENGER';
 const prior=ORDER.slice(0,ORDER.indexOf(r)).map(x=>[FIN(x),LAB(x)]);
 const RD="const __RD=(own)=>{const o={};for(const [n,k] of "+JSON.stringify(prior)+"){try{if($(n).isExecuted){const j=$(n).first().json;if(j&&typeof j.raw==='string')o[k]=j.raw;}}catch(e){}}o['"+L+"']=own;return o;};\n";
 const B="// pkgBAR "+P+" Build (W3 spec, Wall 2632, part 2): the one barred-move re-call of the "+side.toLowerCase()+"'s round ["+L+"]. The pkgIMP harvest reads the round\n"
  +"// ("+src+"); a sentence with a verified NOT A REQUIREMENT line under it is not a hit. No hit: the item passes through (resend false) and\n"
  +"// "+P+" Route sends it to "+P+" Extract. A hit: one call that continues the debater's own conversation (the round's request"+(g?", the "+r+"G re-call when that round was kept":"")+",\n"
  +"// its reply, then a user turn quoting each sentence and naming its barred move). Same seat, model and body form.\n"
  +LIB+RD
  +"const X=$('"+src+"').first().json;const C=$('"+r+" Build').first().json;let B=C.call,__base='"+r+" Build';\n"
  +(g?"try{const g=X."+g.gk+";if(g&&g.resent&&g.kept==='second'){B=$('"+g.gb+"').first().json.call;__base='"+g.gb+"';}}catch(e){B=C.call;__base='"+r+" Build';}\n":"")
  +"const pass=(why,c)=>[{json:{run_token:X.run_token,round:'"+P+"',resend:false,why,bar_check:c||null}}];\n"
  +"let c;try{c=BAR.check('"+L+"',X.raw,__RD(X.raw));}catch(e){return pass('check error: '+String(e&&e.message||e).slice(0,200));}\n"
  +"if(!c.applies)return pass('no round text',c);if(c.pass)return pass(c.rebutted.length?'every harvested sentence rebuts the other side (NOT A REQUIREMENT verified)':'no barred move harvested',c);\n"
  +"if(!B||!B.body)return pass('no call to continue',c);\n"
  +"const note=BAR.note(c);const body=JSON.parse(JSON.stringify(B.body));\n"
  +"if(B.fam==='gemini'){body.contents=(body.contents||[]).concat([{role:'model',parts:[{text:X.raw}]},{role:'user',parts:[{text:note}]}]);}\n"
  +"else{body.messages=(body.messages||[]).concat([{role:'assistant',content:X.raw},{role:'user',content:note}]);}\n"
  +"if(body.diagnostics)body.diagnostics={previous_message_id:X.msg_id||null};\n"
  +"return [{json:{...C,run_token:X.run_token,round:'"+P+"',resend:true,why:c.hits.length+' barred sentence(s)',note,bar_check:c,base:__base,call:{...B,body}}}];\n";
 const X1=code(r+' Extract');const nb=X1.split("$('"+r+" Build')").length-1;if(nb!==1)throw new Error(r+' Extract reads '+r+' Build '+nb+' times');
 const inner=X1.replace("$('"+r+" Build')","$('"+P+" Build')");
 const E="// pkgBAR "+P+" Extract: the round ["+L+"] after the barred-move re-call. A pass-through item (resend false), a failed re-call or an unread reply\n"
  +"// keeps "+src+"'s round unchanged, and nothing is VOID. Otherwise "+r+" Extract's own reading (below, unchanged but for its call source, "+P+" Build)\n"
  +"// reads the new reply. The replacement is kept unless it is under 60% of the first round's length"+(g?" or its own "+g.chk+" has more faults":"")+"; each sentence\n"
  +"// of the kept round that is still a barred move is VOID: struck from raw and labelled by the system's mark, and listed in bar.void.\n"
  +LIB+RD
  +"const __X1=$('"+src+"').first().json;const __G=$('"+P+" Build').first().json;const __in=$input.first().json||{};\n"
  +"const __seat=(()=>{const c=(__G&&__G.call)||{};return (c.fam||__X1.fam||'?')+'/'+(c.model||__X1.model||'?');})();\n"
  +"const __rec=o=>({applies:!!(__G&&__G.bar_check&&__G.bar_check.applies),round:'"+L+"',node:'"+r+"',seat:__seat,side:'"+side+"',first:(__G&&__G.bar_check)||null,...o});\n"
  +"const __keep=(why,o)=>[{json:{...__X1,bar:__rec({resent:!!(__G&&__G.resend),kept:'first',why,void:[],...(o||{})})}}];\n"
  +"if(!__G||!__G.resend)return __keep((__G&&__G.why)||'no re-call');\n"
  +"if(__in.error)return __keep('the re-call failed: '+String(__in.error&&__in.error.message||__in.error).slice(0,200));\n"
  +"let __X2=null;try{__X2=(()=>{\n"+inner+"\n})()[0].json;}catch(x){return __keep('the re-call reply was not read: '+String(x&&x.message||x).slice(0,200));}\n"
  +"let __c2=null;try{__c2=BAR.check('"+L+"',__X2.raw,__RD(__X2.raw));}catch(e){__c2=null;}\n"
  +"const __n1=String(__X1.raw||'').length,__n2=String(__X2.raw||'').length;\n"
  +(g?"const __f="+g.fault+";const __worse=__f(__X2."+g.chk+")>__f(__X1."+g.chk+");\n":"const __worse=false;\n")
  +"const __k2=!!(__c2&&__c2.applies&&__n2>=0.6*__n1&&!__worse);const __K=__k2?__X2:__X1;const __cK=__k2?__c2:__G.bar_check;\n"
  +"const __why=__k2?'the replacement round ('+__n1+' -> '+__n2+' chars; barred sentences '+__G.bar_check.hits.length+' -> '+__c2.hits.length+')':(!__c2?'the replacement was not checked':__n2<0.6*__n1?'the replacement is under 60% of the first round ('+__n1+' -> '+__n2+' chars)':'the replacement has more "+(g?g.chk:'')+" faults');\n"
  +"const __S=BAR.strike(__K.raw,__cK.hits),__SL=BAR.strike(__K.labelled,__cK.hits);\n"
  +"const __void=__cK.hits.map(h=>({seat:__seat,side:'"+side+"',round:'"+L+"',id:h.id,sentence:h.sentence,move:h.move.name,struck:__S.struck.includes(h.id)}));\n"
  +"return [{json:{...__K,"+(g?g.gk+":__X1."+g.gk+",":"")+"raw:__S.raw,labelled:typeof __K.labelled==='string'?__SL.raw:__K.labelled,bar:__rec({resent:true,kept:__k2?'second':'first',why:__why,second:__c2,void:__void,struck:__S.struck,unfound:__S.unfound,first_raw_chars:__n1})}}];\n";
 new Function('$','$input','$json',B);new Function('$','$input','$json',E);
 const st=addStage(w,P,src,r+' Route',B,E);stageCodes[P]={src,next:st.next,fam:st.fam};plan.added.push(...st.added);}
// ---------- outputs ----------
NN=N();
for(const n of Object.keys(base)){const now=JSON.stringify(NN[n].parameters);if(now===base[n])continue;const isCode=typeof NN[n].parameters.jsCode==='string';
 const f=n.replace(/ /g,'_')+(isCode?'.js':'.params.json');fs.writeFileSync(OUT+'/'+f,isCode?NN[n].parameters.jsCode:JSON.stringify(NN[n].parameters,null,1));
 plan.changed.push({node:n,file:f,base_sha:sha(base[n]),final_sha:sha(now),readers:readers[n]||0});}
for(const n of plan.added)if(NN[n].type==='n8n-nodes-base.code')fs.writeFileSync(OUT+'/'+n.replace(/ /g,'_')+'.js',NN[n].parameters.jsCode);
plan.stages=stageCodes;plan.final_nodes=w.nodes.length;
fs.mkdirSync(require('path').dirname(OUTW),{recursive:true});fs.writeFileSync(OUTW,JSON.stringify(w));fs.writeFileSync('pkgBAR/plan_BAR.json',JSON.stringify(plan,null,1));
console.log('base '+plan.base_nodes+' nodes -> '+plan.final_nodes+'; changed '+plan.changed.length+', added '+plan.added.length);
for(const c of plan.changed)console.log('  '+c.node.padEnd(26)+c.base_sha+' -> '+c.final_sha+(c.readers?'  ('+c.readers+' reads)':''));
