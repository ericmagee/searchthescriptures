// pkgVP4 build (W2). TRIAL, record-only.
//   node pkgVP4/build_VP4.cjs <base parent or fetch-back json> <out json>
// Adds Assume Check Build -> Needed? -> (true) Call deepseek -> Record / (false) Record between Judge Contradiction Record and Panel Cure Needed?,
// and adds the E-ASSUME rows to Alternate Merge's enforcer_log (the pkgCEC __cecL list). No library node changes.
const fs=require('fs'),cr=require('crypto');const C=require('./vp4_nodes.cjs');
const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const sub=(s,a,b,what)=>{const n=s.split(a).length-1;if(n!==1)die(what+': '+n+' hits');return s.split(a).join(b);};
const [,,IN,OUT]=process.argv;if(!IN||!OUT)die('usage: build_VP4.cjs <base> <out>');
const j=JSON.parse(fs.readFileSync(IN,'utf8'));const d=j.data||j.workflow||j;const by=Object.fromEntries(d.nodes.map(n=>[n.name,n]));
const NEW=['Assume Check Build','Assume Check Needed?','Assume Check Call deepseek','Assume Check Record'];for(const nm of NEW)if(by[nm])die(nm+' exists');
for(const nm of ['Judge Contradiction Record','Judge Contradiction Needed?','Judge Contradiction Call deepseek','Panel Cure Needed?','Alternate Merge'])if(!by[nm])die(nm+' missing');
{const nm='Alternate Merge';let s=by[nm].parameters.jsCode;
 s=sub(s,"[['Close Enforcer Record','cec_log'],['Judge Contradiction Record','jcc_log']]","[['Close Enforcer Record','cec_log'],['Judge Contradiction Record','jcc_log'],['Assume Check Record','acx_log']] /* pkgVP4: E-ASSUME rows (TRIAL) */",nm);by[nm].parameters.jsCode=s;}
const uid=s=>cr.createHash('sha1').update('pkgVP4 '+s).digest('hex').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*$/,'$1-$2-$3-$4-$5');
const JR=by['Judge Contradiction Record'];const x0=JR.position[0]+224,y0=JR.position[1]+300;
const BU={id:uid('build'),name:NEW[0],type:'n8n-nodes-base.code',typeVersion:2,position:[x0,y0],parameters:{jsCode:C.BUILD}};
const IF=JSON.parse(JSON.stringify(by['Judge Contradiction Needed?']));IF.id=uid('if');IF.name=NEW[1];IF.position=[x0+224,y0];
if(IF.parameters.conditions.conditions[0].leftValue!=='={{ $json.cec_skip !== true }}')die('Judge Contradiction Needed? condition changed');
IF.parameters.conditions.conditions[0].id='assume-check-needed';IF.parameters.conditions.conditions[0].leftValue='={{ $json.acx_skip !== true }}';
const CA=JSON.parse(JSON.stringify(by['Judge Contradiction Call deepseek']));CA.id=uid('call');CA.name=NEW[2];CA.position=[x0+448,y0-96];
if(CA.parameters.jsonBody!=='={{ $json.body }}'||CA.onError!=='continueRegularOutput')die('Judge Contradiction Call changed');
const RE={id:uid('record'),name:NEW[3],type:'n8n-nodes-base.code',typeVersion:2,position:[x0+672,y0],parameters:{jsCode:C.RECORD}};
d.nodes.push(BU,IF,CA,RE);
const K=d.connections;const L=n=>[{node:n,type:'main',index:0}];
if(JSON.stringify(K['Judge Contradiction Record'])!==JSON.stringify({main:[L('Panel Cure Needed?')]}))die('Judge Contradiction Record outputs changed');
K['Judge Contradiction Record']={main:[L(NEW[0])]};K[NEW[0]]={main:[L(NEW[1])]};K[NEW[1]]={main:[L(NEW[2]),L(NEW[3])]};K[NEW[2]]={main:[L(NEW[3])]};K[NEW[3]]={main:[L('Panel Cure Needed?')]};
for(const n of [BU,RE,by['Alternate Merge']])new Function('$','$input','$execution','return (async()=>{\n'+n.parameters.jsCode+'\n})();');
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:K,settings:d.settings},null,1));
console.log(OUT+': '+d.nodes.length+' nodes (+4); Judge Contradiction Record -> Assume Check Build -> Needed? -> Call deepseek -> Record -> Panel Cure Needed?; Alternate Merge logs acx_log');
