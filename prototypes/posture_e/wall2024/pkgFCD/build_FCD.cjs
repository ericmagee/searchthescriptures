// pkgFCD (W1; coordinator 23:57Z 11-09, from W3's note on Wall 3817). Base: strip_FUK3 (pkgFUK rev 3) on live s90. Stacks on pkgFUK rev 3.
// Gap: when pkgFUK rev 2 C1 keeps a follow-up K-S3 answer but drops its CORRECTED COUNT line (keeping it changed an unasked item), fum.count_dropped
// says so only in the Normalize node output. The K-S3 item then reads CURED as COUNTED and the enforcer log does not say the count was not written.
// Fix: enfRows (the enforcer log rows of a seat's cure reply) appends to the cure_reason of each K-S3 row of that reply read CURED as COUNTED
//   (or, if none is, of each K-S3 row, so the drop is never silent):
//   " | COUNT NOT WRITTEN: <fum.count_dropped>". No row is added; no other field changes; only when count_dropped is set. (26 library files)
//   node pkgFCD/build_FCD.cjs strip   -> pkgLIB/strip_FCD, pkgFCD/plan_FCD.json
//   FB=/mnt/project-files/wall2024/fetchback_live_s90.json node gate/pack.cjs pkgLIB/strip_FCD pkgLIB_FCD
//   node pkgFCD/build_FCD.cjs parent  -> pkgFCD/parent_s90_FCD.json
const fs=require('fs'),path=require('path'),cr=require('crypto');const W=path.resolve(__dirname,'..');
const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const sub=(s,a,b,what)=>{const n=s.split(a).length-1;if(n!==1)die(what+': '+n+' hits for '+JSON.stringify(a.slice(0,90)));return s.split(a).join(b);};
const BASE='strip_FUK3',STRIP='strip_FCD',LIBP='pkgLIB_FCD',NODES=418;const mode=process.argv[2];
const A0="cure_reason:enfTrialWhy(x,x.why)||null,at:T}));}";
const A1="cure_reason:((w,d)=>d&&x.rule==='K-S3'&&(/^answered: the close concession is counted/.test(String(x.why||''))||!(v||[]).some(y=>y&&y.rule==='K-S3'&&/^answered: the close concession is counted/.test(String(y.why||''))))?(w?w+' | ':'')+'COUNT NOT WRITTEN: '+String(d):(w||null))(enfTrialWhy(x,x.why),reply&&reply.fum&&reply.fum.count_dropped),at:T}));} /* pkgFCD (W3 3817): a K-S3 row says when the follow-up's corrected count was not kept */";
if(mode==='strip'){
 const A=W+'/pkgLIB/'+BASE,B=W+'/pkgLIB/'+STRIP;if(fs.existsSync(B))die(B+' exists');fs.mkdirSync(B+'/patched',{recursive:true});const plan={base:'pkgLIB/'+BASE,library:{}};
 for(const f of fs.readdirSync(A+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(A+'/patched/'+f,'utf8');let s=s0;const did=[];
  if(s.includes('function enfRows(')){s=sub(s,A0,A1,f+' enfRows');did.push('FCD');}
  new Function('$','$input','return (async()=>{\n'+s+'\n})();');fs.writeFileSync(B+'/patched/'+f,s);plan.library[f]={base:h(s0),patched:h(s),changes:did};}
 const ch=Object.entries(plan.library).filter(e=>e[1].changes.length);
 fs.writeFileSync(__dirname+'/plan_FCD.json',JSON.stringify(plan,null,1)+'\n');console.log(STRIP+': '+Object.keys(plan.library).length+' files, '+ch.length+' changed');
}else if(mode==='parent'){
 const FB=process.env.FB||'/mnt/project-files/wall2024/fetchback_live_s90.json';let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;const P=W+'/'+LIBP+'/patched';if(!fs.existsSync(P))die('pack first');
 const by={};d.nodes.forEach(n=>by[n.name]=n);if(d.nodes.length!==NODES)die('base has '+d.nodes.length+' nodes, expected '+NODES);const changed=[];
 for(const f of fs.readdirSync(P).filter(f=>f.endsWith('.js'))){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');const n=by[nm];if(!n)die('no node '+nm);const c=fs.readFileSync(P+'/'+f,'utf8');if(n.parameters.jsCode!==c){n.parameters.jsCode=c;changed.push(nm);}}
 for(const [nm,f] of [['Alternate Build','Alternate_Build.js'],['Early Alternate Build','Early_Alternate_Build.js']]){const c=fs.readFileSync(W+'/'+LIBP+'/e4_rebase/'+f,'utf8');if(by[nm].parameters.jsCode!==c){by[nm].parameters.jsCode=c;changed.push(nm);}}
 fs.writeFileSync(__dirname+'/parent_s90_FCD.json',JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));
 console.log('parent_s90_FCD.json: '+d.nodes.length+' nodes; changed '+changed.length+'; connections unchanged');
}else die('mode strip | parent');
