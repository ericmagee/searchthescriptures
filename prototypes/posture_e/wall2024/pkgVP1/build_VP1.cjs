// pkgVP1 build (W3; WALL-3703 parts 1 and 2a; md_notes_rulings 459). Base: live s83 (pkgSJR rev 2), library strip_SJR.
//   node pkgVP1/build_VP1.cjs strip   -> pkgLIB/strip_VP1 (strip_SJR + part 2a in the gate) and pkgVP1/plan_VP1.json
//   FB=/mnt/project-files/wall2024/fetchback_live_s83.json node gate/pack.cjs pkgLIB/strip_VP1 pkgLIB_VP1
//   node pkgVP1/build_VP1.cjs parent  -> pkgVP1/parent_s83_VP1.json (live s83 + library + part 1 nodes and edits)
const fs=require('fs'),path=require('path'),cr=require('crypto');const W=path.resolve(__dirname,'..');const V=require('./vp1_lib.cjs');
const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const sub=(s,a,b,what)=>{const n=s.split(a).length-1;if(n!==1)die(what+': '+n+' hits for '+JSON.stringify(a.slice(0,90)));return s.split(a).join(b);};
const BASE=process.env.BASE||'strip_SJR';const mode=process.argv[2];
const A1="function gatePromptText2024(body){";
const A2="const GATE_STATUS={'CONTRADICTION':'LIVE','NOT APPLIED':'LIVE','RESULT DIFFERS':'LIVE','ANSWER GROUND':'LIVE','RULE':'LIVE'};";
const B2="const GATE_STATUS={'CONTRADICTION':'LIVE','NOT APPLIED':'LIVE','RESULT DIFFERS':'LIVE','ANSWER GROUND':'LIVE','RULE':'LIVE','ANSWER OPEN':'LIVE'}; /* pkgVP1 */";
const A3=" items.forEach((x,i)=>x.gid='G'+(i+1));return {R1,items,T1,newk_error:NK.error||null};}";
const A4="(z.src==='K re-read'||z.src==='E-GATE B')&&z.live);";
const B4="(z.src==='K re-read'||z.src==='E-GATE B'||z.src==='E-GATE M')&&z.live); /* pkgVP1: a gate change that opens a new MISSES against an open link does not cure */";
const A5=" const wd2299=new Set(G.filter(x=>x.kind==='CONTRADICTION'&&/^E-APPLY\\b/.test(String(x.src||''))&&A[x.gid]&&A[x.gid].ans==='KEEP').map(x=>x.sid));";
const A6="+(G.items.some(x=>x.src==='E-GATE B')?'\\n\\nAn E-GATE B item (ANSWER GROUND) may instead be answered DIFFERENT POINT";
const PATH_OF={'Gate_Build.js':'Send Back Record','Alt_Gate_Build.js':'Alt Send Back Record','R2_Alt_Gate_Build.js':'R2 Alt Send Back Record'};
if(mode==='strip'){
 const A=W+'/pkgLIB/'+BASE,B=W+'/pkgLIB/strip_VP1';if(fs.existsSync(B))die(B+' exists');fs.mkdirSync(B+'/patched',{recursive:true});const plan={base:'pkgLIB/'+BASE,library:{}};
 for(const f of fs.readdirSync(A+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(A+'/patched/'+f,'utf8');let s=s0;const did=[];
  if(s.includes('function gateItems2024(')){
   for(const need of ['function pwList(','const PW_ROUND=','const pwHead=','function __acRead(','function rcLines(','function ciKeys('])if(!s.includes(need)&&!s.includes(need.replace('function ','const ').replace('(','=')))die(f+': lacks '+need);
   s=sub(s,A1,V.FN+A1,f+' fn');s=sub(s,A2,B2,f+' status');s=sub(s,A3,V.ITEMS_LINE+A3,f+' items');did.push('gateItems2024');
   if(!s.includes('function gateCure2024('))die(f+': gateItems2024 without gateCure2024');
   for(const need of ['function gateForced2024(','function kfLines(','function gateLineFor2024(','function sbLabel(','function ri4IsF2024('])if(!s.includes(need))die(f+': lacks '+need);
   s=sub(s,A4,B4,f+' cure new-item');s=sub(s,"  if(!a){why='no GATE line for this item (silence counts)';}","  if(!a&&x.src==='E-GATE M'&&!now.has(x.key)){why='__VP1_PEND__';} /* pkgVP1: settled after the loop */\n  else if(!a){why='no GATE line for this item (silence counts)';}",f+' cure silence');s=sub(s," const keys0=new Set(G.map(x=>x.key));const fresh="," {const __ok=res.some(r=>r.src==='E-GATE M'&&r.ans==='CHANGE'&&r.cured&&applied.has(r.gid));for(const r of res)if(r.why==='__VP1_PEND__'){r.cured=__ok;r.why=__ok?'no GATE line of its own; the item is no longer raised after your cured gate change on another ANSWER OPEN item: its link is no longer left open (pkgVP1)':'no GATE line for this item (silence counts)';}} /* pkgVP1: one cured change may answer every ANSWER OPEN item of a link */\n const keys0=new Set(G.map(x=>x.key));const fresh=",f+' cure silence 2');s=sub(s,A5,V.CURE_LINE+A5,f+' cure forced');did.push('gateCure2024');
   if(s.includes("An E-GATE B item (ANSWER GROUND) may instead be answered")){s=sub(s,A6,V.MSG+A6,f+' gate message');did.push('gate message');}}
  else if(s.includes(A2)||s.includes('gateAnsGround2024'))die(f+': gate code without gateItems2024');
  /* part 1: the Gate Build nodes read the send-back record by name (the second-reading nodes now stand between them), and the merge nodes take the second-reading rows into the log */
  if(PATH_OF[f]){const nm=PATH_OF[f];s=sub(s,"const PASS=$input.first().json;","const PASS=$('"+nm+"').first().json; /* pkgVP1: by name; the second-reading nodes stand between this node and "+nm+" */",f+' PASS');did.push('PASS by name');}
  if(f==='Alternate_Merge_Seat.js'||f==='R2_Alternate_Merge_Seat.js'){const a=" try{if($('Send Back Record').isExecuted)($('Send Back Record').first().json.sb_rows||[]).forEach(x=>enforcer_log.push(x));}catch(e){}";
   s=sub(s,a,a+"\n try{if($('Reread Record').isExecuted)($('Reread Record').first().json.rr_rows||[]).forEach(x=>enforcer_log.push(x));}catch(e){} /* pkgVP1: the second readings follow the send-back rows */",f+' log');did.push('log');}
  if(f==='Alternate_Merge_1.js'||f==='R2_Alternate_Merge.js'){const nm=f==='Alternate_Merge_1.js'?'Alt Reread Record':'R2 Alt Reread Record';const a="[JER&&JER.enf428_rows,SBR&&SBR.sb_rows,GR&&GR.gate_rows].forEach(rs=>(rs||[]).forEach(x=>log.push(x)));";
   s=sub(s,a,"const __vp1RR=(()=>{try{return $('"+nm+"').isExecuted?($('"+nm+"').first().json.rr_rows||[]):[];}catch(e){return [];}})(); /* pkgVP1: the second readings follow the send-back rows */\n[JER&&JER.enf428_rows,SBR&&SBR.sb_rows,__vp1RR,GR&&GR.gate_rows].forEach(rs=>(rs||[]).forEach(x=>log.push(x)));",f+' log');did.push('log');}
  new Function('$','$input','return (async()=>{\n'+s+'\n})();');
  fs.writeFileSync(B+'/patched/'+f,s);plan.library[f]={base:h(s0),patched:h(s),changes:did};}
 const n=Object.values(plan.library).filter(x=>x.changes.length).length;
 fs.writeFileSync(__dirname+'/plan_VP1.json',JSON.stringify(plan,null,1)+'\n');console.log('strip_VP1: '+Object.keys(plan.library).length+' files, '+n+' changed: '+Object.entries(plan.library).filter(e=>e[1].changes.length).map(e=>e[0]+' ['+e[1].changes.join(', ')+']').join('; '));
}else if(mode==='parent'){
 const FB=process.env.FB||'/mnt/project-files/wall2024/fetchback_live_s83.json';let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;const P=W+'/pkgLIB_VP1/patched';if(!fs.existsSync(P))die('pack first');
 const by={};d.nodes.forEach(n=>by[n.name]=n);if(d.nodes.length!==394)die('base has '+d.nodes.length+' nodes, expected 394 (live s83)');let lib=0;
 for(const f of fs.readdirSync(P).filter(f=>f.endsWith('.js'))){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');const n=by[nm];if(!n)die('no node '+nm);const c=fs.readFileSync(P+'/'+f,'utf8');if(n.parameters.jsCode!==c){n.parameters.jsCode=c;lib++;}}
 for(const [nm,f] of [['Alternate Build','Alternate_Build.js'],['Early Alternate Build','Early_Alternate_Build.js']]){const c=fs.readFileSync(W+'/pkgLIB_VP1/e4_rebase/'+f,'utf8');if(by[nm].parameters.jsCode!==c){by[nm].parameters.jsCode=c;lib++;}}
 // the three send-back record nodes: the cure reading written to cure_status (E-ANS, E-PREM, E-OOR), record-only
 const SBE=fs.readFileSync(__dirname+'/sbr_edit.js','utf8'),SBF=fs.readFileSync(__dirname+'/sbr_fn.js','utf8');
 const E1="else if(it.b7&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';});});";
 const E2="\nlet __RD=null;for(const n of ['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']){";
 const AC=by['Anticheat Call deepseek'],IFN=by['Judge Enforcer Needed?'];if(AC.parameters.jsonBody!=='={{ $json.body }}')die('Anticheat Call body changed');
 const uid=s=>cr.createHash('sha1').update('pkgVP1 '+s).digest('hex').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*$/,'$1-$2-$3-$4-$5');
 const K=d.connections;const L=n=>[{node:n,type:'main',index:0}];const RB=fs.readFileSync(__dirname+'/reread_build.js','utf8'),RR=fs.readFileSync(__dirname+'/reread_record.js','utf8');const added=[];
 for(const [pre,role] of [['','panel'],['Alt ','alternate'],['R2 Alt ','alternate']]){const SBR=pre+'Send Back Record',SBB=pre+'Send Back Build',JEB=pre+'Judge Enforcer Build',GB=pre+'Gate Build';
  const NEW=[pre+'Reread Build',pre+'Reread Needed?',pre+'Reread Call deepseek',pre+'Reread Record'];for(const nm of NEW)if(by[nm])die(nm+' exists');for(const nm of [SBR,SBB,JEB,GB])if(!by[nm])die('no node '+nm);
  {let s=by[SBR].parameters.jsCode;if(!s.includes(E2))die(SBR+': __RD anchor');s=sub(s,E1,E1.slice(0,-6)+'\n'+SBE+'});});',SBR+' row end');s=sub(s,E2,'\n'+SBF+E2.slice(1),SBR+' fn');
   if(!s.includes("seat_role:'"+role+"',judge_model:b.api_model,kind:'send_back',rule:it.rule"))die(SBR+': role');by[SBR].parameters.jsCode=s;new Function('$','$input','return (async()=>{\n'+s+'\n})();');}
  if(JSON.stringify(K[SBR])!==JSON.stringify({main:[L(GB)]}))die(SBR+' outputs changed: '+JSON.stringify(K[SBR]));
  const fill=t=>{const o=t.split('§SBR§').join(SBR).split('§SBB§').join(SBB).split('§JEB§').join(JEB).split('§RRB§').join(NEW[0]).split('§RRR§').join(NEW[3]).split('§ROLE§').join(role);if(/§/.test(o))die('placeholder left');return o;};
  const x0=by[SBR].position[0],y0=by[SBR].position[1]+220;
  const BU={id:uid(pre+'build'),name:NEW[0],type:'n8n-nodes-base.code',typeVersion:2,position:[x0,y0],parameters:{jsCode:fill(RB)}};
  const IF=JSON.parse(JSON.stringify(IFN));IF.id=uid(pre+'if');IF.name=NEW[1];IF.position=[x0+224,y0];IF.parameters.conditions.conditions[0].id=(pre+'reread-needed').toLowerCase().replace(/ /g,'-');IF.parameters.conditions.conditions[0].leftValue='={{ $json.rr_skip !== true }}';
  const CA=JSON.parse(JSON.stringify(AC));CA.id=uid(pre+'call');CA.name=NEW[2];CA.position=[x0+448,y0-96];
  const RE={id:uid(pre+'record'),name:NEW[3],type:'n8n-nodes-base.code',typeVersion:2,position:[x0+672,y0],parameters:{jsCode:fill(RR)}};
  for(const n of [BU,RE])new Function('$','$input','return (async()=>{\n'+n.parameters.jsCode+'\n})();');
  d.nodes.push(BU,IF,CA,RE);added.push(...NEW);
  K[SBR]={main:[L(NEW[0])]};K[NEW[0]]={main:[L(NEW[1])]};K[NEW[1]]={main:[L(NEW[2]),L(NEW[3])]};K[NEW[2]]={main:[L(NEW[3])]};K[NEW[3]]={main:[L(GB)]};}
 if(by['Judge Enforcer Build'].typeVersion!==2&&by['Send Back Record'].typeVersion!==2)console.log('NOTE: code node typeVersion on live is '+by['Send Back Record'].typeVersion);
 fs.writeFileSync(__dirname+'/parent_s83_VP1.json',JSON.stringify({nodes:d.nodes,connections:K,settings:d.settings},null,1));
 console.log('parent_s83_VP1.json: '+d.nodes.length+' nodes (+12: '+added.join(', ')+'); library and stub nodes changed '+lib+'; 3 send-back record nodes edited; each path: Send Back Record -> Reread Build -> Reread Needed? -> (true) Reread Call deepseek -> Reread Record / (false) Reread Record -> Gate Build');
}else die('mode strip | parent');
