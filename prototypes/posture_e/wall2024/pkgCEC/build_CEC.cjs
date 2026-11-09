// pkgCEC build (W1, item A of Wall 3714; wording 3718). Base: pkgSJR rev 2 (live s82 + SJR, to be s83), library strip_SJR.
//   node pkgCEC/build_CEC.cjs strip     -> pkgLIB/strip_CEC (strip_SJR + the close-contradiction break in cureRecompute and its callers)
//   FB=/mnt/project-files/wall2024/fetchback_live_s83.json node gate/pack.cjs pkgLIB/strip_CEC pkgLIB_CEC
//   node pkgCEC/build_CEC.cjs parent    -> pkgCEC/parent_s83_CEC.json (pkgSJR/parent_s82_SJR.json + 4 nodes + 4 edited nodes + library)
const fs=require('fs'),path=require('path'),cr=require('crypto');const W=path.resolve(__dirname,'..');const C=require('./cec_nodes.cjs');
const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const sub=(s,a,b,what)=>{const n=s.split(a).length-1;if(n!==1)die(what+': '+n+' hits for '+JSON.stringify(a.slice(0,80)));return s.split(a).join(b);};
const mode=process.argv[2];
// library substitutions
const RC_HEAD='function cureRecompute(seat,text,F,items,v,reply){';
const CRG=" /* pkgCRG (W3 3087 ruling 1)";
const BRK="const brk={DEFENDER:col.filter(z=>z.grade==='DEFENDER LINK BROKEN').length,CHALLENGER:col.filter(z=>z.grade==='CHALLENGER LINK BROKEN').length};";
const BRK2="const brk={DEFENDER:col.filter(z=>z.grade==='DEFENDER LINK BROKEN').length+__cecX.DEFENDER,CHALLENGER:col.filter(z=>z.grade==='CHALLENGER LINK BROKEN').length+__cecX.CHALLENGER}; /* pkgCEC */";
const TIE="rc.trig.indexOf('TIE (KB-0030)')>=0";
const TIE2="(rc.trig.indexOf('TIE (KB-0030)')>=0||rc.trig.some(t=>/^CLOSE-CONTRADICTION /.test(t)))";
const CC0="const all=base.debate_rule_violations||[];if(!all.length)return [{json:{...base,debate_rule_report:[]}}];";
const CC1="const all=base.debate_rule_violations||[];if(!all.length){/* pkgCEC: the single judge with no rule item still takes a confirmed closing contradiction's break */"
 +"const __F0={verdict_tag:base.verdict_tag,defense_standing:base.defense_standing,conceded_links:base.conceded_links,challenge_standing:base.challenge_standing,challenger_conceded_links:base.challenger_conceded_links};"
 +"const __rc=cecBroken2024().length?cureRecompute(null,cureJText(base.independent_verdict_raw,false),__F0,[],[],null):null;"
 +"if(!__rc||!__rc.trig.some(t=>/^CLOSE-CONTRADICTION /.test(t)))return [{json:{...base,debate_rule_report:[]}}];"
 +"const __raw=cureRewrite(base.independent_verdict_raw,false,{...__rc,audit:''},null,null).replace(/\\n$/,'');"
 +"return [{json:{...base,...__rc.fields,recomputed:{trigger:__rc.trig,fields:__rc.fields,result:__rc.result},independent_verdict_raw:cureSupHead(__raw+'\\n\\n'+__rc.audit,base.verdict_tag,__rc.fields.verdict_tag),debate_rule_report:[]}}];}";
if(mode==='strip'){
 const A=W+'/pkgLIB/strip_SJR',B=W+'/pkgLIB/strip_CEC';if(fs.existsSync(B))die(B+' exists');fs.mkdirSync(B+'/patched',{recursive:true});const plan={base:'pkgLIB/strip_SJR',library:{}};
 for(const f of fs.readdirSync(A+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(A+'/patched/'+f,'utf8');let s=s0;const did=[];
  const nb=s.split(BRK).length-1;
  if(s.includes(RC_HEAD)){s=sub(s,RC_HEAD,C.LIB_FN+RC_HEAD,f+' head');
   const i=s.indexOf(RC_HEAD);const j=s.indexOf(CRG,i);if(j<0||s.indexOf(CRG,j+1)>=0)die(f+': pkgCRG anchor');s=s.slice(0,j)+'\n'+C.LIB_STEP+s.slice(j);
   const e=s.indexOf('\nfunction ',i+10);const b=s.indexOf(BRK,i);if(b<0||b>e)die(f+': brk in cureRecompute');s=s.slice(0,b)+BRK2+s.slice(b+BRK.length);did.push('cureRecompute');}
  const SB='function sbApply2024(';if(s.includes(SB)){const i=s.indexOf(SB);if(s.indexOf(SB,i+1)>=0)die(f+': two sbApply2024');const e=s.indexOf('\nfunction ',i+10);const b=s.indexOf(BRK,i);if(b<0||b>e)die(f+': brk in sbApply2024');
   s=s.slice(0,b)+C.LIB_SB+BRK2+s.slice(b+BRK.length);did.push('sbApply2024');}
  if(s.split(BRK).length-1!==0)die(f+': '+(s.split(BRK).length-1)+' brk lines left unpatched (had '+nb+')');
  if(s.includes(TIE)){s=sub(s,TIE,TIE2,f+' tie branch');did.push('no-item branch');}
  if(s.includes(CC0)){s=sub(s,CC0,CC1,f+' single judge');did.push('single judge no-item branch');}
  new Function('$','$input','return (async()=>{\n'+s+'\n})();');
  fs.writeFileSync(B+'/patched/'+f,s);plan.library[f]={base:h(s0),patched:h(s),changes:did};}
 const n=Object.values(plan.library).filter(x=>x.changes.length).length;
 if(!plan.library['Panel_Cure_Check.js'].changes.includes('no-item branch')||!plan.library['Cure_Check.js'].changes.includes('single judge no-item branch'))die('a caller was not patched');
 fs.writeFileSync(__dirname+'/plan_CEC.json',JSON.stringify(plan,null,1)+'\n');console.log('strip_CEC: '+Object.keys(plan.library).length+' files, '+n+' changed');
}else if(mode==='parent'){
 const d=JSON.parse(fs.readFileSync(process.env.BASE||'/mnt/project-files/wall2024/fetchback_live_s83.json','utf8')); /* rev 2: live s83 (pkgSJR written 14:51 CST) */const P=W+'/pkgLIB_CEC/patched';if(!fs.existsSync(P))die('pack first');
 const by={};d.nodes.forEach(n=>by[n.name]=n);let lib=0;
 for(const f of fs.readdirSync(P).filter(f=>f.endsWith('.js'))){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');const n=by[nm];if(!n)die('no node '+nm);const c=fs.readFileSync(P+'/'+f,'utf8');if(n.parameters.jsCode!==c){n.parameters.jsCode=c;lib++;}}
 /* the rebased stub heads (gate/pack.cjs e4_rebase): Alternate Build and Early Alternate Build. Early Alternate Build is stale in live s80 to s82 (W1 Wall finding) */
 for(const [nm,f] of [['Alternate Build','Alternate_Build.js'],['Early Alternate Build','Early_Alternate_Build.js']]){const c=fs.readFileSync(W+'/pkgLIB_CEC/e4_rebase/'+f,'utf8');if(by[nm].parameters.jsCode!==c){by[nm].parameters.jsCode=c;lib++;}}
 const NEW=['Close Enforcer Build','Close Enforcer Needed?','Close Enforcer Call deepseek','Close Enforcer Record'];for(const nm of NEW)if(by[nm])die(nm+' exists');
 // display: Panel Build and Build Independent Verdict
 for(const nm of ['Panel Build','Build Independent Verdict']){let s=by[nm].parameters.jsCode;s=sub(s,"\nconst C4X=(()=>{","\n"+C.SHOW_FN+"const C4X=(()=>{",nm+' show fn');
  s=sub(s,"+__ACX('D')","+__ACX('D')+__CEC('D')",nm+' D');s=sub(s,"+__ACX('C')","+__ACX('C')+__CEC('C')",nm+' C');by[nm].parameters.jsCode=s;}
 // the log: Alternate Merge adds the E-CLOSECON rows to the run's enforcer_log
 {const nm='Alternate Merge';let s=by[nm].parameters.jsCode;
  s=sub(s,"if(!R2)return [{json:R1}];","const __cecL=[['Close Enforcer Record','cec_log'],['Judge Contradiction Record','jcc_log']].flatMap(([n,k])=>{try{return $(n).isExecuted?($(n).first().json[k]||[]):[];}catch(e){return [];}}); /* pkgCEC: the closing enforcer's E-CLOSECON rows join the run's enforcer_log */\nif(!R2)return [{json:__cecL.length?{...R1,enforcer_log:__cecL.concat(R1.enforcer_log||[])}:R1}];",nm+' no round 2');
  s=sub(s,"const enforcer_log=(R1.enforcer_log||[]).concat(","const enforcer_log=__cecL.concat(R1.enforcer_log||[]).concat( /* pkgCEC */",nm+' round 2');by[nm].parameters.jsCode=s;}
 const Q=by['Quote Report'],AC=by['Anticheat Call deepseek'],AN=by['Anticheat Needed?'];
 const uid=s=>cr.createHash('sha1').update('pkgCEC '+s).digest('hex').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*$/,'$1-$2-$3-$4-$5');
 const x0=Q.position[0],y0=Q.position[1]+260;
 const BU={id:uid('build'),name:NEW[0],type:'n8n-nodes-base.code',typeVersion:2,position:[x0,y0],parameters:{jsCode:C.BUILD}};
 const IF=JSON.parse(JSON.stringify(AN));IF.id=uid('if');IF.name=NEW[1];IF.position=[x0+224,y0];IF.parameters.conditions.conditions[0].id='close-enforcer-needed';IF.parameters.conditions.conditions[0].leftValue='={{ $json.cec_skip !== true }}';
 const CA=JSON.parse(JSON.stringify(AC));CA.id=uid('call');CA.name=NEW[2];CA.position=[x0+448,y0-96];if(CA.parameters.jsonBody!=='={{ $json.body }}')die('Anticheat Call body changed');
 const RE={id:uid('record'),name:NEW[3],type:'n8n-nodes-base.code',typeVersion:2,position:[x0+672,y0],parameters:{jsCode:C.RECORD}};
 d.nodes.push(BU,IF,CA,RE);
 /* rev 2 (ASK 2): the post-panel confirmation of judge-found contradictions, between Panel Payloads and Panel Cure Needed? */
 const NJ=['Judge Contradiction Build','Judge Contradiction Needed?','Judge Contradiction Call deepseek','Judge Contradiction Record'];for(const nm of NJ)if(by[nm])die(nm+' exists');
 const PPn=by['Panel Payloads'];const x1=PPn.position[0],y1=PPn.position[1]+300;
 const JB={id:uid('jc build'),name:NJ[0],type:'n8n-nodes-base.code',typeVersion:2,position:[x1,y1],parameters:{jsCode:C.JC_BUILD}};
 const JI=JSON.parse(JSON.stringify(AN));JI.id=uid('jc if');JI.name=NJ[1];JI.position=[x1+224,y1];JI.parameters.conditions.conditions[0].id='judge-contradiction-needed';JI.parameters.conditions.conditions[0].leftValue='={{ $json.cec_skip !== true }}';
 const JK=JSON.parse(JSON.stringify(AC));JK.id=uid('jc call');JK.name=NJ[2];JK.position=[x1+448,y1-96];
 const JR={id:uid('jc record'),name:NJ[3],type:'n8n-nodes-base.code',typeVersion:2,position:[x1+672,y1],parameters:{jsCode:C.JC_RECORD}};
 d.nodes.push(JB,JI,JK,JR);
 const K=d.connections;const L=n=>[{node:n,type:'main',index:0}];
 if(JSON.stringify(K['Quote Report'])!==JSON.stringify({main:[L('Regrade After Quotes?')]}))die('Quote Report outputs changed: '+JSON.stringify(K['Quote Report']));
 if(JSON.stringify(K['Panel Payloads'])!==JSON.stringify({main:[L('Panel Cure Needed?'),L('Panel Failure Note')]}))die('Panel Payloads outputs changed: '+JSON.stringify(K['Panel Payloads']));
 K['Panel Payloads']={main:[L(NJ[0]),L('Panel Failure Note')]};K[NJ[0]]={main:[L(NJ[1])]};K[NJ[1]]={main:[L(NJ[2]),L(NJ[3])]};K[NJ[2]]={main:[L(NJ[3])]};K[NJ[3]]={main:[L('Panel Cure Needed?')]};
 K['Quote Report']={main:[L(NEW[0])]};K[NEW[0]]={main:[L(NEW[1])]};K[NEW[1]]={main:[L(NEW[2]),L(NEW[3])]};K[NEW[2]]={main:[L(NEW[3])]};K[NEW[3]]={main:[L('Regrade After Quotes?')]};
 for(const nm of ['Panel Build','Build Independent Verdict','Alternate Merge'])new Function('$','$input','$execution','return (async()=>{\n'+by[nm].parameters.jsCode+'\n})();');
 for(const n of [BU,RE,JB,JR])new Function('$','$input','return (async()=>{\n'+n.parameters.jsCode+'\n})();');
 fs.writeFileSync(__dirname+'/parent_s83_CEC.json',JSON.stringify({nodes:d.nodes,connections:K,settings:d.settings},null,1));
 console.log('parent_s83_CEC.json: '+d.nodes.length+' nodes (+8), library nodes changed '+lib+'; Quote Report -> Close Enforcer Build -> Needed? -> (true) Call deepseek -> Record / (false) Record -> Regrade After Quotes?');
}else die('mode strip | parent');
