// pkgFUK rev 3 (W1; W3 FAIL Wall 3817, part A). Base: strip_FUK2 (rev 2) on live s90. B, C1, C2 unchanged from rev 2.
//  A rev 3. K-S3 reader: COUNTED reads CURED only when it is the FIRST word of the answer after the bar (markup and quote marks before it ignored),
//  followed by the end of the answer or by punctuation (. : ; , ! -- dash), and the first sentence holds no negation (not, never, no, nor, cannot, neither, none, n't).
//  Every other answer (\"This cannot be COUNTED\", \"COUNTED is wrong here\", \"Refuse: COUNTED ...\") is UNCURED and is asked once by the rev 1 section (NO REASON). (cureVerdicts; 26 library files)
//   node pkgFUK/build_FUK3.cjs strip   -> pkgLIB/strip_FUK3, pkgFUK/plan_FUK3.json
//   FB=/mnt/project-files/wall2024/fetchback_live_s90.json node gate/pack.cjs pkgLIB/strip_FUK3 pkgLIB_FUK3
//   node pkgFUK/build_FUK3.cjs parent  -> pkgFUK/parent_s90_FUK3.json
const fs=require('fs'),path=require('path'),cr=require('crypto');const W=path.resolve(__dirname,'..');
const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const sub=(s,a,b,what)=>{const n=s.split(a).length-1;if(n!==1)die(what+': '+n+' hits for '+JSON.stringify(a.slice(0,90)));return s.split(a).join(b);};
const BASE='strip_FUK2',STRIP='strip_FUK3',LIBP='pkgLIB_FUK3',NODES=418;const mode=process.argv[2];
const A1=String.raw`if([...rp.matchAll(/\bCOUNTED\b/g)].some(m=>!/(?:^|\s)(?:not|never|no|nor|\S*n['’]t)\s+(?:\S+\s+){0,2}$/i.test(rp.slice(0,m.index))))return res('CURED','answered: the close concession is counted',[rp]); /* pkgFUK rev 2 A (W3 3809): NOT COUNTED is not COUNTED */`;
const A3=String.raw`{const c0=String(rp).replace(/^[\s*_\x60"'“”‘’>]+/,'');if(/^COUNTED[*_\x60"'”’]*\s*(?:$|[.:;,!]|--|—|–)/.test(c0)&&!/\b(?:not|never|no|nor|cannot|neither|none)\b|n['’]t\b/i.test(c0.split(/[.;!?](?:\s|$)/)[0]))return res('CURED','answered: the close concession is counted',[rp]);} /* pkgFUK rev 3 A (W3 3817): COUNTED only as the first word of the answer, with no negation in its sentence */`;
if(mode==='strip'){
 const A=W+'/pkgLIB/'+BASE,B=W+'/pkgLIB/'+STRIP;if(fs.existsSync(B))die(B+' exists');fs.mkdirSync(B+'/patched',{recursive:true});const plan={base:'pkgLIB/'+BASE,library:{}};
 for(const f of fs.readdirSync(A+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(A+'/patched/'+f,'utf8');let s=s0;const did=[];
  if(s.includes("if(x.rule==='K-S3'){const rp=respOf(x)")){s=sub(s,A1,A3,f+' A');did.push('A3');}
  new Function('$','$input','return (async()=>{\n'+s+'\n})();');fs.writeFileSync(B+'/patched/'+f,s);plan.library[f]={base:h(s0),patched:h(s),changes:did};}
 for(const f of fs.readdirSync(A).filter(f=>!fs.statSync(A+'/'+f).isDirectory()))fs.copyFileSync(A+'/'+f,B+'/'+f);
 const ch=Object.entries(plan.library).filter(e=>e[1].changes.length);
 fs.writeFileSync(__dirname+'/plan_FUK3.json',JSON.stringify(plan,null,1)+'\n');console.log(STRIP+': '+Object.keys(plan.library).length+' files, '+ch.length+' changed');
}else if(mode==='parent'){
 const FB=process.env.FB||'/mnt/project-files/wall2024/fetchback_live_s90.json';let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;const P=W+'/'+LIBP+'/patched';if(!fs.existsSync(P))die('pack first');
 const by={};d.nodes.forEach(n=>by[n.name]=n);if(d.nodes.length!==NODES)die('base has '+d.nodes.length+' nodes, expected '+NODES);const changed=[];
 for(const f of fs.readdirSync(P).filter(f=>f.endsWith('.js'))){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');const n=by[nm];if(!n)die('no node '+nm);const c=fs.readFileSync(P+'/'+f,'utf8');if(n.parameters.jsCode!==c){n.parameters.jsCode=c;changed.push(nm);}}
 for(const [nm,f] of [['Alternate Build','Alternate_Build.js'],['Early Alternate Build','Early_Alternate_Build.js']]){const c=fs.readFileSync(W+'/'+LIBP+'/e4_rebase/'+f,'utf8');if(by[nm].parameters.jsCode!==c){by[nm].parameters.jsCode=c;changed.push(nm);}}
 fs.writeFileSync(__dirname+'/parent_s90_FUK3.json',JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));
 console.log('parent_s90_FUK3.json: '+d.nodes.length+' nodes; changed '+changed.length+': '+changed.join(', ')+'; connections unchanged');
}else die('mode strip | parent');
