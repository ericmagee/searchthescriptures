// ASK 476 test (offline): (1) each of the 13 child stubs, reading the engine's library from pass.lib, rebuilds the same source it rebuilt from the
// child's own library; (2) Library Check passes the engine's text and refuses a changed, missing or wrong text, and strips lib from its output.
// usage: node test476.cjs ENGINE_BASE.json CHILD_BASE.json ENGINE_TARGET.json CHILD_TARGET.json
const fs=require('fs');const ld=f=>{const w=JSON.parse(fs.readFileSync(f));return w.nodes?w:w.data;};
const [EB,CB,ET,CT]=process.argv.slice(2).map(ld);const nd=(w,n)=>w.nodes.find(x=>x.name===n);
const ELIB=nd(EB,'Shared Library').parameters.jsCode,CLIB=nd(CB,'Shared Library').parameters.jsCode;
const mk=(lib,pass)=>{const f=n=>({params:{jsCode:n==='Shared Library'?lib:''},first:()=>({json:{pass}}),all:()=>[{json:{pass}}],isExecuted:true});return f;};
const upto=src=>{const i=src.indexOf('return await new Function');if(i<0)throw new Error('stub form');return src.slice(0,i)+'return __S;';};
let bad=0,n=0;
for(const s of CT.nodes){const j=s.parameters.jsCode;if(typeof j!=='string'||!j.includes("$('Alternate Pass In').first().json.pass.lib"))continue;if(s.name==='Library Check (ASK 422a)')continue;
 const old=nd(CB,s.name).parameters.jsCode;
 const a=new Function('$','$input',upto(old))(mk(CLIB,{}),{all:()=>[]});
 const b=new Function('$','$input',upto(j))(mk('',{lib:ELIB}),{all:()=>[]});
 n++;if(a!==b){bad++;console.log('DIFF',s.name,a.length,b.length);}else console.log('same',s.name.padEnd(30),a.length);
 let threw=false;try{new Function('$','$input',upto(j))(mk('',{}),{all:()=>[]});}catch(e){threw=/pkgLIB1: the pass holds no library text/.test(e.message);}if(!threw){bad++;console.log('NO REFUSAL on a pass without lib',s.name);}}
console.log('stubs',n,'differing',bad);
// engine side: Library Sha computes lib_sha and map_sha from its own library
const LS=nd(ET,'Library Sha (ASK 422a)').parameters.jsCode;const eo=new Function('$','$input',LS)(mk(ELIB,{}),{all:()=>[{json:{}}]})[0].json;
const LC=nd(CT,'Library Check (ASK 422a)').parameters.jsCode;
const run=pass=>new Function('$','$input',LC)(mk('',pass),{all:()=>[{json:{pass,other:1}}]});
const ok=run({lib:ELIB,lib_sha:eo.__lib422,map_sha:eo.__map422,sa:{x:1}});
console.log('Library Check, engine text:',JSON.stringify(ok[0].json.lib422),'| lib kept in output:','lib' in ok[0].json.pass,'| other pass keys kept:',JSON.stringify(Object.keys(ok[0].json.pass)));
for(const [lab,p] of [['changed text',{lib:ELIB.replace('return [];','return [ ];'),lib_sha:eo.__lib422,map_sha:eo.__map422}],['lib line changed',{lib:ELIB.replace('"const ','"let '),lib_sha:eo.__lib422,map_sha:eo.__map422}],['no lib',{lib_sha:eo.__lib422,map_sha:eo.__map422}],['child library sent',{lib:CLIB,lib_sha:eo.__lib422,map_sha:eo.__map422}]]){let m='PASSED (wrong)';try{run(p);}catch(e){m='REFUSED: '+e.message.slice(0,90);}console.log('Library Check,',lab+':',m);}
// old Library Check on the base, for comparison
const oo=new Function('$','$input',nd(CB,'Library Check (ASK 422a)').parameters.jsCode)(mk(CLIB,{}),{all:()=>[{json:{pass:{lib_sha:eo.__lib422,map_sha:eo.__map422}}}]});console.log('base Library Check:',JSON.stringify(oo[0].json.lib422));
process.exit(bad?1:0);
