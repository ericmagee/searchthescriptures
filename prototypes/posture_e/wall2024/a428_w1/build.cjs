// ASK 428 step 2 (W1): strip code comments from live Code nodes and form 3 pkgLIB stubs. Plan a428_w3/plan_rev3.md.
// Usage: node a428_w1/build.cjs <fetchback.json> <out_dir>      (acorn from ../tools/node_modules, as strip.cjs)
// Scope (rev 3 item 3): (a) and (c) every Code node except the Shared Library, "Alternate Build", "Early Alternate Build" and the
// form 3 standard stubs: comments removed by strip.cjs's rule (W3 8865 B), the 422(b) reader exclusion narrowed to those names.
// (b) the form 3 standard stubs (text holds "pkgLIB stub, form 3" and "\nreturn await new Function("): a direct text edit that removes
// the two header lines, the REFLINE comment after if(false){...} and the comment that ends the run line, each with the spaces before it.
// Writes <out>/<wf>_target.json (the full workflow) and <out>/<wf>_nodes.json (per changed node: kind, proofs, original and new text).
const fs=require('fs'),path=require('path'),cr=require('crypto');
const {strip,tokens,tree,comments}=require('../a422b_w1/strip.cjs');
const {rebuild}=require('../pkgLIB/unpack.cjs');
const sha=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const lines=s=>s.split(/\r\n|[\n\r\u2028\u2029]/).length;
const OUTN=new Set(['Shared Library','Alternate Build','Early Alternate Build']);
const RUN='\nreturn await new Function(';
const isStd=s=>s.includes('pkgLIB stub, form 3')&&s.includes(RUN);
const names=s=>[...new Set([...s.matchAll(/\$\(\s*(["'`])((?:(?!\1).)*)\1\s*\)/g)].map(m=>m[2]))].sort();
const AF=Object.getPrototypeOf(async function(){}).constructor;
const compiles=s=>{try{new AF('$','$input',s);return true;}catch(e){return false;}};
function stubEdit(s){const L=s.split('\n');
 if(!(L[0].startsWith('// pkgLIB stub, form 3')&&L[1].startsWith('// and, under this node')))throw new Error('header lines not as expected');
 let t=L.slice(2).join('\n');const cm=comments(t);
 if(cm.length!==2||!cm.every(c=>c.block))throw new Error('expected 2 block comments after the header, found '+cm.length);
 for(const c of cm.slice().reverse()){let a=c.start;while(a>0&&t[a-1]===' ')a--;
  const e=t.slice(c.end).search(/\n|$/);if(e!==0)throw new Error('block comment is not at the end of its line');t=t.slice(0,a)+t.slice(c.end);}
 return t;}
if(require.main===module){
 const [FB,OUT]=process.argv.slice(2);let w=JSON.parse(fs.readFileSync(FB,'utf8'));w=w.workflow||w;
 const wf=(w.id||'wf')+'_'+String(w.versionId||'').slice(0,8);fs.mkdirSync(OUT,{recursive:true});
 const lib=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const R={code:0,kept:[],std:0,a:0,c:0,none:0,changed:[],fail:[],before:0,after:0,stub_chars:0,a_chars:0,c_chars:0};
 for(const n of w.nodes){if(n.type!=='n8n-nodes-base.code')continue;R.code++;const s=n.parameters.jsCode||'';R.before+=s.length;
  if(OUTN.has(n.name)){R.kept.push(n.name);R.after+=s.length;continue;}
  const reader=/\$\(\s*["']Shared Library["']\s*\)\.params\.jsCode/.test(s);
  let kind,t;
  try{if(isStd(s)){kind='b';t=stubEdit(s);R.std++;}else{kind=reader?'c':'a';const r=strip(s);t=r.text;if(!r.n){R.none++;R.after+=s.length;continue;}}}
  catch(e){R.fail.push(n.name+': '+e.message);R.after+=s.length;continue;}
  R.after+=t.length;const cc=s.length-t.length;if(kind==='b')R.stub_chars+=cc;else if(kind==='a'){R.a++;R.a_chars+=cc;}else{R.c++;R.c_chars+=cc;}
  const row={name:n.name,id:n.id,kind,len_before:s.length,len_after:t.length,sha_before:sha(s),sha_after:sha(t),
   tokens:tokens(s)===tokens(t),tree:tree(s)===tree(t),lines_before:lines(s),lines_after:lines(t),no_comment_left:comments(t).length===0,
   compiles:compiles(t),names_equal:JSON.stringify(names(s))===JSON.stringify(names(t))};
  if(!row.names_equal){const nb=names(s),na=names(t);row.names_dropped=nb.filter(x=>!na.includes(x));}
  row.lines_ok=kind==='b'?row.lines_after===row.lines_before-2:row.lines_after===row.lines_before;
  if(kind==='b'){row.rebuild_before=sha(rebuild(s,lib));row.rebuild_after=sha(rebuild(t,lib));row.rebuild_equal=row.rebuild_before===row.rebuild_after;}
  const ok=row.tokens&&row.tree&&row.lines_ok&&row.no_comment_left&&row.compiles&&row.names_equal&&(kind!=='b'||row.rebuild_equal);
  if(!ok)R.fail.push(n.name);row.original=s;row.text=t;n.parameters.jsCode=t;R.changed.push(row);}
 fs.writeFileSync(path.join(OUT,wf+'_target.json'),JSON.stringify(w));
 fs.writeFileSync(path.join(OUT,wf+'_nodes.json'),JSON.stringify(R.changed,null,1));
 const C=R.changed,k=x=>C.filter(r=>r.kind===x),cnt=(a,f)=>a.filter(f).length+'/'+a.length;
 console.log(`${wf}: Code nodes ${R.code}; kept by name ${R.kept.length} (${R.kept.join(', ')}); no comments ${R.none}`);
 console.log(`  changed ${C.length}: (a) ${k('a').length} nodes, ${R.a_chars} chars; (b) ${k('b').length} stubs, ${R.stub_chars} chars; (c) ${k('c').length} library readers, ${R.c_chars} chars`);
 console.log(`  Code node chars ${R.before} -> ${R.after} (${R.before-R.after} less)`);
 for(const f of ['tokens','tree','lines_ok','no_comment_left','compiles','names_equal'])console.log(`  ${f}: ${cnt(C,r=>r[f])}`);
 console.log(`  rebuild equal (b): ${cnt(k('b'),r=>r.rebuild_equal)}`);
 console.log(R.fail.length?'  BUILD FAIL: '+R.fail.join('; '):'  BUILD PASS');process.exit(R.fail.length?1:0);}
