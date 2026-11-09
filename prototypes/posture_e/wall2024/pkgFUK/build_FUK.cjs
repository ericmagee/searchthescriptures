// pkgFUK (W1; coordinator assignment 23:04Z 11-09, from W1 Wall 3790 FUM gap 1). Base: live s89, library strip_VP1_s84 (pkgLIB_VP1_s84 equals s89, 31 files).
// Gap: a K-S3 item answered with a RESPONSE the reader cannot count (TOUCHES NO LINK with a reason under five words, or any other answer that is neither COUNTED nor NOT HELD)
// stays UNCURED and the one follow-up never asks about it; K-S3 is LIVE, so the seat is removed with no chance to answer.
// Fix: fumAsk2024 (6 Normalize nodes) adds those K-S3 items to the one follow-up, in their own section, labelled 'NO REASON'; their follow-up lines are read as every asked item's are (fumKeep2024).
//   node pkgFUK/build_FUK.cjs strip    -> pkgLIB/strip_FUK and pkgFUK/plan_FUK.json
//   FB=/mnt/project-files/wall2024/fetchback_live_s89.json node gate/pack.cjs pkgLIB/strip_FUK pkgLIB_FUK
//   node pkgFUK/build_FUK.cjs parent   -> pkgFUK/parent_s90_FUK.json (live s90 + library; no node added; s90 library = s89 library)
const fs=require('fs'),path=require('path'),cr=require('crypto');const W=path.resolve(__dirname,'..');
const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const sub=(s,a,b,what)=>{const n=s.split(a).length-1;if(n!==1)die(what+': '+n+' hits for '+JSON.stringify(a.slice(0,90)));return s.split(a).join(b);};
const BASE='strip_VP1_s84',STRIP='strip_FUK',LIBP='pkgLIB_FUK',NODES=+(process.env.NODES||418),TAG=process.env.TAG||'s90'; /* s90 (pkgVP4 rev 2) left the library as s89 */const mode=process.argv[2];
const NORM=['Alternate_Cure_Normalize.js','Cure_Normalize.js','Panel_Cure_Normalize_1.js','Panel_Cure_Normalize_2.js','Panel_Cure_Normalize_3.js','R2_Alternate_Cure_Normalize.js'];
const EDITS=[
 ["\n if(!miss.length&&!noq.length)return null;",
  "\n const ks3=v.filter(x=>x.status!=='CURED'&&x.rule==='K-S3'&&x.response&&!/^\\s*NOT\\s+HELD\\b/i.test(String(x.response))&&!miss.includes(x)&&!noq.includes(x)); /* pkgFUK: a K-S3 answer the reader cannot count (TOUCHES NO LINK with a reason under five words, or neither COUNTED nor NOT HELD) */\n if(!miss.length&&!noq.length&&!ks3.length)return null;",'check'],
 [" quoting at least six words in a row of the flagged sentence (all of it when shorter).');",
  " quoting at least six words in a row of the flagged sentence (all of it when shorter).');\n if(ks3.length)P.push('','K-S3 items whose RESPONSE cannot be counted ('+ks3.length+'):',...ks3.map(x=>'- '+lab(x)),'For each, write its RESPONSE line again in one of these forms: RESPONSE: <the item, as labelled above> | COUNTED, and correct your count; or RESPONSE: <the item, as labelled above> | TOUCHES NO LINK: <at least five words naming why it touches no declared link or listed premise>; or RESPONSE: <the item, as labelled above> | NOT HELD: <your reason>, quoting at least six words in a row of the flagged sentence (all of it when shorter).'); /* pkgFUK */",'prompt'],
 ["asked:miss.map(x=>'NO LINE '+lab(x)).concat(noq.map(x=>'NO QUOTE '+lab(x))),items:miss.concat(noq).map(",
  "asked:miss.map(x=>'NO LINE '+lab(x)).concat(noq.map(x=>'NO QUOTE '+lab(x)),ks3.map(x=>'NO REASON '+lab(x))),items:miss.concat(noq,ks3).map(",'asked/items'],
 ["others:v.filter(x=>x.rule==='K-RUL'&&!miss.includes(x)&&!noq.includes(x))",
  "others:v.filter(x=>x.rule==='K-RUL'&&!miss.includes(x)&&!noq.includes(x)&&!ks3.includes(x))",'others']];
if(mode==='strip'){
 const A=W+'/pkgLIB/'+BASE,B=W+'/pkgLIB/'+STRIP;if(fs.existsSync(B))die(B+' exists');fs.mkdirSync(B+'/patched',{recursive:true});const plan={base:'pkgLIB/'+BASE,library:{}};
 for(const f of fs.readdirSync(A+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(A+'/patched/'+f,'utf8');let s=s0;const did=[];
  if(NORM.includes(f)){for(const [a,b,w] of EDITS){s=sub(s,a,b,f+' '+w);did.push(w);}}
  else if(s.includes('function fumAsk2024('))die(f+': fumAsk2024 outside the 6 Normalize files');
  new Function('$','$input','return (async()=>{\n'+s+'\n})();');fs.writeFileSync(B+'/patched/'+f,s);plan.library[f]={base:h(s0),patched:h(s),changes:did};}
 const ch=Object.entries(plan.library).filter(e=>e[1].changes.length);if(ch.length!==6)die('changed '+ch.length+' files, expected 6');
 // the 6 changed fumAsk2024 bodies must be identical
 const fx=f=>{const s=fs.readFileSync(B+'/patched/'+f,'utf8');return s.slice(s.indexOf('function fumAsk2024('),s.indexOf('function fumKey2024('));};const u=new Set(NORM.map(fx));if(u.size!==1)die('fumAsk2024 differs across the 6 files');
 fs.writeFileSync(__dirname+'/plan_FUK.json',JSON.stringify(plan,null,1)+'\n');console.log(STRIP+': '+Object.keys(plan.library).length+' files, 6 changed (fumAsk2024 identical in all 6, '+h([...u][0])+')');
}else if(mode==='parent'){
 const FB=process.env.FB||'/mnt/project-files/wall2024/fetchback_live_s90.json';let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;const P=W+'/'+LIBP+'/patched';if(!fs.existsSync(P))die('pack first');
 const by={};d.nodes.forEach(n=>by[n.name]=n);if(d.nodes.length!==NODES)die('base has '+d.nodes.length+' nodes, expected '+NODES+' (live '+TAG+')');const changed=[];
 for(const f of fs.readdirSync(P).filter(f=>f.endsWith('.js'))){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');const n=by[nm];if(!n)die('no node '+nm);const c=fs.readFileSync(P+'/'+f,'utf8');if(n.parameters.jsCode!==c){n.parameters.jsCode=c;changed.push(nm);}}
 for(const [nm,f] of [['Alternate Build','Alternate_Build.js'],['Early Alternate Build','Early_Alternate_Build.js']]){const c=fs.readFileSync(W+'/'+LIBP+'/e4_rebase/'+f,'utf8');if(by[nm].parameters.jsCode!==c){by[nm].parameters.jsCode=c;changed.push(nm);}}
 /* packed stubs carry Shared Library line offsets, so stubs that read a moved line change text; pack proves each stub rebuilds its strip code byte for byte, and only the 6 Normalize strip files differ from strip_VP1_s84 */
 const want=NORM.map(f=>f.replace(/\.js$/,'').replace(/_/g,' '));for(const n of want)if(!changed.includes(n))die(n+' unchanged');if(changed.includes('Alternate Build')||changed.includes('Early Alternate Build'))die('e4 heads changed');
 fs.writeFileSync(__dirname+'/parent_'+TAG+'_FUK.json',JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));
 console.log('parent_'+TAG+'_FUK.json: '+d.nodes.length+' nodes; changed: '+changed.join(', ')+'; connections unchanged');
}else die('mode strip | parent');
