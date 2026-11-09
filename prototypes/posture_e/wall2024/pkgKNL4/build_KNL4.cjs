// pkgKNL rev 4 (W2; W1 Wall 3790 misses 4 and 5): the none-line allow-list takes five more phrasings. Base: live s89 (library strip_VP1_s84 = pkgLIB_VP1_s84).
//   node pkgKNL4/build_KNL4.cjs strip    -> pkgLIB/strip_KNL4 (knlNone2024 replaced in all 30 files)
//   FB=/mnt/project-files/wall2024/fetchback_live_s89.json node gate/pack.cjs pkgLIB/strip_KNL4 pkgLIB_KNL4
//   FB=/mnt/project-files/wall2024/fetchback_live_s89.json node pkgKNL4/build_KNL4.cjs parent   -> pkgKNL4/parent_s89_KNL4.json
const fs=require('fs'),path=require('path');const W=path.resolve(__dirname,'..');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const NEW=fs.readFileSync(__dirname+'/knl4_fn.js','utf8');const HEAD='function knlNone2024(',NEXT='function kfLines(';const mode=process.argv[2];
if(mode==='strip'){const A=W+'/pkgLIB/strip_VP1_s84',B=W+'/pkgLIB/strip_KNL4';if(fs.existsSync(B))die(B+' exists');fs.mkdirSync(B+'/patched',{recursive:true});let old=null,n=0;
 for(const f of fs.readdirSync(A+'/patched').filter(f=>f.endsWith('.js')).sort()){let s=fs.readFileSync(A+'/patched/'+f,'utf8');const i=s.indexOf(HEAD);
  if(i<0||s.indexOf(HEAD,i+1)>=0)die(f+': knlNone2024 defined '+(i<0?0:2)+' times');const j=s.indexOf(NEXT,i);if(j<0)die(f+': no kfLines after it');const o=s.slice(i,j);
  if(old===null)old=o;else if(o!==old)die(f+': knlNone2024 text differs from the first file');s=s.slice(0,i)+NEW+s.slice(j);fs.writeFileSync(B+'/patched/'+f,s);n++;}
 console.log('strip_KNL4: '+n+' files, knlNone2024 replaced ('+old.length+' -> '+NEW.length+' chars)');
}else if(mode==='parent'){const FB=process.env.FB||'/mnt/project-files/wall2024/fetchback_live_s89.json';let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;
 const by=Object.fromEntries(d.nodes.map(n=>[n.name,n]));const Q=W+'/pkgLIB_VP1_s84',P=W+'/pkgLIB_KNL4';if(!fs.existsSync(P))die('pack first');let ch=[];
 for(const f of fs.readdirSync(Q+'/patched')){const n=by[f.replace(/\.js$/,'').replace(/_/g,' ')];if(!n)die('no node for '+f);if(n.parameters.jsCode!==fs.readFileSync(Q+'/patched/'+f,'utf8'))die('live '+n.name+' is not pkgLIB_VP1_s84: restack');}
 for(const [nm,f] of [['Alternate Build','Alternate_Build.js'],['Early Alternate Build','Early_Alternate_Build.js']])if(by[nm].parameters.jsCode!==fs.readFileSync(Q+'/e4_rebase/'+f,'utf8'))die('live '+nm+' head is not pkgLIB_VP1_s84');
 for(const f of fs.readdirSync(P+'/patched')){const n=by[f.replace(/\.js$/,'').replace(/_/g,' ')];const c=fs.readFileSync(P+'/patched/'+f,'utf8');if(n.parameters.jsCode!==c){n.parameters.jsCode=c;ch.push(n.name);}}
 for(const [nm,f] of [['Alternate Build','Alternate_Build.js'],['Early Alternate Build','Early_Alternate_Build.js']]){const c=fs.readFileSync(P+'/e4_rebase/'+f,'utf8');if(by[nm].parameters.jsCode!==c){by[nm].parameters.jsCode=c;ch.push(nm);}}
 fs.writeFileSync(__dirname+'/parent_s89_KNL4.json',JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));
 console.log('parent_s89_KNL4.json from '+path.basename(FB)+': '+d.nodes.length+' nodes; changed '+ch.length+': '+ch.join(', '));
}else die('mode strip | parent');
