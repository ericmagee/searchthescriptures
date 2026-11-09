// pkgSJR build (W2, Wall 3696). Base: live s82 (b04eda94), library strip_XKB (pkgXK rev 3).
//   node pkgSJR/build_SJR.cjs strip                      -> pkgLIB/strip_SJR (strip_XKB + one Cure Check line)
//   FB=<fetchback s82> node pkgSJR/build_SJR.cjs parent   -> pkgSJR/parent_s82_SJR.json (after: node gate/pack.cjs pkgLIB/strip_SJR pkgLIB_SJR)
const fs=require('fs'),path=require('path');const W=path.resolve(__dirname,'..');const S=require('./sjr_nodes.cjs');
const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const once=(t,a,what)=>{const i=t.indexOf(a);if(i<0||t.indexOf(a,i+1)>=0)die(what+': anchor found '+(i<0?0:2)+' times');return i;};
const mode=process.argv[2];
if(mode==='strip'){
 const A=W+'/pkgLIB/strip_XKB',B=W+'/pkgLIB/strip_SJR';if(fs.existsSync(B))die(B+' exists');fs.cpSync(A,B,{recursive:true});
 const f=B+'/patched/Cure_Check.js';let t=fs.readFileSync(f,'utf8');const i=once(t,S.CC_ANCHOR,'Cure Check')+S.CC_ANCHOR.length;
 t=t.slice(0,i)+S.CC_LINE+t.slice(i);fs.writeFileSync(f,t);console.log('strip_SJR: Cure_Check.js +'+S.CC_LINE.length+' chars; other '+(fs.readdirSync(B+'/patched').length-1)+' files = strip_XKB');
}else if(mode==='parent'){
 const FB=process.env.FB||'/mnt/project-files/wall2024/fetchback_live_s82.json';const d=JSON.parse(fs.readFileSync(FB,'utf8'));
 const P=W+'/pkgLIB_SJR/patched';if(!fs.existsSync(P))die('pack first: node gate/pack.cjs pkgLIB/strip_SJR pkgLIB_SJR');
 const by={};d.nodes.forEach(n=>by[n.name]=n);let lib=0;
 for(const f of fs.readdirSync(P).filter(f=>f.endsWith('.js'))){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');const n=by[nm];if(!n)die('no node '+nm);
  const c=fs.readFileSync(P+'/'+f,'utf8');if(n.parameters.jsCode!==c){n.parameters.jsCode=c;lib++;}}
 for(const nm of ['SJ Re-ask?','SJ Re-ask Build','SJ Re-ask Call openrouter','SJ Re-ask Pick'])if(by[nm])die(nm+' already exists');
 const X=by['Extract Independent Verdict'],V=by['Verdict Call openrouter'];
 const uid=s=>require('crypto').createHash('sha1').update('pkgSJR '+s).digest('hex').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*$/,'$1-$2-$3-$4-$5');
 const IF={id:uid('if'),name:'SJ Re-ask?',type:'n8n-nodes-base.if',typeVersion:2.2,position:[X.position[0]+224,X.position[1]+160],
  parameters:{conditions:{combinator:'and',conditions:[{id:'sj-reask',leftValue:S.IF_EXPR,operator:{operation:'true',singleValue:true,type:'boolean'},rightValue:''}],
   options:{caseSensitive:true,leftValue:'',typeValidation:'loose'}},options:{}}};
 const BU={id:uid('build'),name:'SJ Re-ask Build',type:'n8n-nodes-base.code',typeVersion:2,position:[X.position[0]+448,X.position[1]+64],parameters:{jsCode:S.BUILD}};
 const CA=JSON.parse(JSON.stringify(V));CA.id=uid('call');CA.name='SJ Re-ask Call openrouter';CA.position=[X.position[0]+672,X.position[1]+64];
 const PK={id:uid('pick'),name:'SJ Re-ask Pick',type:'n8n-nodes-base.code',typeVersion:2,position:[X.position[0]+896,X.position[1]+64],parameters:{jsCode:S.PICK}};
 d.nodes.push(IF,BU,CA,PK);
 const C=d.connections;const L=n=>[{node:n,type:'main',index:0}];
 const xo=JSON.stringify(C['Extract Independent Verdict']);if(xo!==JSON.stringify({main:[L('Cure Needed?')]}))die('Extract Independent Verdict outputs changed: '+xo);
 C['Extract Independent Verdict']={main:[L('SJ Re-ask?')]};
 C['SJ Re-ask?']={main:[L('SJ Re-ask Build'),L('Cure Needed?')]};
 C['SJ Re-ask Build']={main:[L('SJ Re-ask Call openrouter')]};
 C['SJ Re-ask Call openrouter']={main:[L('SJ Re-ask Pick'),L('SJ Re-ask Pick')]};
 C['SJ Re-ask Pick']={main:[L('Verdict Normalizer')]};
 const out={nodes:d.nodes,connections:C,settings:d.settings};fs.writeFileSync(__dirname+'/parent_s82_SJR.json',JSON.stringify(out,null,1));
 console.log('parent_s82_SJR.json: '+d.nodes.length+' nodes (+4), library nodes changed '+lib+'; Extract Independent Verdict -> SJ Re-ask? -> (true) Build -> Call -> Pick -> Verdict Normalizer; (false) Cure Needed?');
}else die('mode strip | parent');
