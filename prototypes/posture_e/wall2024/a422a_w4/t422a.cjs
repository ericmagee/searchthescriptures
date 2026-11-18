// ASK 422(a) offline proof (DONE WHEN 2; rev 3 item 12 map_sha cases): run the engine node and the child check node on the target texts with the libraries given.
const fs=require('fs');const ld=p=>{let d=JSON.parse(fs.readFileSync(p));return d.data||d;};
const [ET,CT,ELIB,CLIB]=process.argv.slice(2);const E=ld(ET),C=ld(CT);const code=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;
const lib=f=>code(ld(f),'Shared Library');
const run=(src,libText,items)=>new Function('$','$input',src)(n=>{if(n!=='Shared Library')throw new Error('reads '+n);return {params:{jsCode:libText}};},{all:()=>items,first:()=>items[0]});
const go=(el,cl,label)=>{const t0=Date.now();const eo=run(code(E,'Library Sha (ASK 422a)'),el,[{json:{a2r:{run:true},__a379:1}}]);const ms=Date.now()-t0;const pass={sa:Object.fromEntries(Object.entries(eo[0].json).filter(e=>e[0]!=='__a379'&&e[0]!=='__lib422'&&e[0]!=='__map422')),lib_sha:eo[0].json.__lib422,map_sha:eo[0].json.__map422};
 try{const co=run(code(C,'Library Check (ASK 422a)'),cl,[{json:{pass}}]);console.log(label,'| engine lib_sha',pass.lib_sha,'map_sha',pass.map_sha,'('+ms+' ms) | child PASSES, output lib422',JSON.stringify(co[0].json.lib422),'| sa keys',Object.keys(pass.sa).join(','));}
 catch(e){console.log(label,'| engine lib_sha',pass.lib_sha,'map_sha',pass.map_sha,'| child STOPS:',e.message);}};
const el=lib(ELIB),cl=lib(CLIB);go(el,cl,'live pair');
const a=cl.indexOf('\n/*LIB*/')+8;const b=cl.indexOf('\n/*MAP*/');const L=JSON.parse(cl.slice(a,b));L[2000]=L[2000].replace(/;/,';;');const cl2=cl.slice(0,a)+JSON.stringify(L)+cl.slice(b);go(el,cl2,'child library with one byte added on one line');
go(el.replace('\n/*MAP*/','x\n/*MAP*/'),cl,'engine library unreadable');
(()=>{try{run(code(C,'Library Check (ASK 422a)'),cl,[{json:{pass:{sa:{}}}}]);console.log('no lib_sha: PASSES (wrong)');}catch(e){console.log('pass without lib_sha (an engine before 422(a)) | child STOPS:',e.message);}})();

/* rev 3 item 12: map_sha cases. Each edits one MAP and keeps every LIB line, so lib_sha alone would pass. */
const mapEdit=(t,f)=>{const a=t.lastIndexOf('\n/*MAP*/')+8,b=t.lastIndexOf('\n/*END*/');const M=JSON.parse(t.slice(a,b));f(M);return t.slice(0,a)+JSON.stringify(M)+t.slice(b);};
const shared=Object.keys(JSON.parse(cl.slice(cl.lastIndexOf('\n/*MAP*/')+8,cl.lastIndexOf('\n/*END*/')))).sort()[0];
go(el,mapEdit(cl,M=>{const p=M[shared].p;const i=p.findIndex(x=>Array.isArray(x)&&typeof x[0]==='string');if(i>=0)p[i]=[p[i][0]+' '];else M[shared].n+=1;}),'map_sha case 2: one shared MAP entry ('+shared+') changed in the child');
go(mapEdit(el,M=>{delete M[shared];}),cl,'map_sha case 3: child key '+shared+' dropped from the engine');
go(mapEdit(el,M=>{M['ZZ UNLISTED']={n:1,p:[0]};}),cl,'map_sha case 4: an unlisted engine-only key added');
go(mapEdit(el,M=>{delete M['REFP'];}),cl,'map_sha extra: the listed engine-only key REFP missing from the engine');
