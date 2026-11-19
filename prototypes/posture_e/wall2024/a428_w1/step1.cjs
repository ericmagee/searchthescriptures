// ASK 428 step 1 (W1): count Shared Library readers and form 3 stubs on live fetch-backs; run the two WRONG-IF cases.
// Usage: node a428_w1/step1.cjs ENGINE.json CHILD.json   (fetch-backs: the .workflow object of get_workflow_details)
const {rebuild}=require('../pkgLIB/unpack.cjs');const fs=require('fs');
for(const f of process.argv.slice(2)){let w=JSON.parse(fs.readFileSync(f));w=w.workflow||w;const lib=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const C=w.nodes.filter(n=>/code$/.test(n.type));
 const readers=C.filter(n=>n.name!=='Shared Library'&&/\$\(\s*["']Shared Library["']\s*\)\.params\.jsCode/.test(n.parameters.jsCode||''));
 const st=readers.filter(n=>n.parameters.jsCode.includes('pkgLIB stub, form 3'));const std=st.filter(n=>n.parameters.jsCode.includes('\nreturn await new Function('));
 const other=readers.filter(n=>!n.parameters.jsCode.includes('pkgLIB stub, form 3'));
 let good=0,bad=0,refused=0;
 for(const n of std){const s=n.parameters.jsCode;const L=s.split('\n');
  if(!(L[0].startsWith('// pkgLIB stub, form 3')&&L[1].startsWith('// and, under'))){bad++;continue;}
  const s2=L.slice(2).join('\n').replace(/^(if\(false\)\{[^\n]*\})\s*\/\*[^\n]*?\*\//,'$1');
  if(rebuild(s,lib)===rebuild(s2,lib))good++;else bad++;
  try{rebuild(s.replace('\nreturn await new Function(','\nreturn await Function('),lib);}catch(e){if(/not a pkgLIB stub/.test(e.message))refused++;}}
 console.log(w.versionId,'Code',C.length,'SharedLib readers',readers.length,'form3',st.length,'std run line',std.length,'nonstd',st.filter(n=>!std.includes(n)).map(n=>n.name).join('|')||'none','| other readers',other.length);
 console.log('  known-good (2 header lines + REFLINE comment removed, rebuild equal):',good,'bad',bad,'| known-bad (run line removed) refused:',refused);
 console.log('  other readers:',other.map(n=>n.name).join('; '));}
