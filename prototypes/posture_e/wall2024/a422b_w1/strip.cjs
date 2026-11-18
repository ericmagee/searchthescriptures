// ASK 422(b) (W1): strip code comments from live Code nodes. Plan: a422_w3/plan_422b_rev1.md + rev 2, comment rule W3 Wall 8865 B.
// Usage: node strip.cjs <fetchback.json> <out_dir>   (needs acorn: npm i --no-save acorn in ../tools, as rbx.cjs)
// Reads only. Writes <out_dir>/<wf>_stripped.json (the full workflow with stripped Code nodes), <out_dir>/<wf>_nodes.json
// (per changed node: name, sha before/after, lengths, the stripped text and the commented original) and prints the report.
// Scope: Code nodes (parameters.jsCode) only. Excluded: "Shared Library"; every pkgLIB stub (reads $('Shared Library').params.jsCode);
// any other node whose text reads node code (.params.jsCode, jsCode, Function(, .toString(), arguments.callee, \bstack\b) unless listed in
// the build as shown safe (none today). A node acorn cannot parse is named and left as is.
// Comment rule (W3 8865 B): (a) a comment that spans lines becomes its line breaks; (b) a comment with no line break becomes one space;
// (c) a line comment's text is removed and its line break stays.
// Proof per changed node: (1) token equality: the acorn token stream (type, value, regex) with comments excluded, equal before and after;
// (2) tree equality: the acorn AST with start, end, loc and range removed, equal before and after; (3) line count equal.
const fs=require('fs'),path=require('path'),cr=require('crypto');
const acorn=require(path.join(__dirname,'../tools/node_modules/acorn'));
const PRE='(async function(){',POST='\n})';const OPT={ecmaVersion:'latest',allowReturnOutsideFunction:true};
const sha=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const READS=[/\.params\.jsCode/,/\bjsCode\b/,/\bFunction\(/,/\.toString\(\)/,/arguments\.callee/,/\bstack\b/];
const isStub=s=>/\$\(\s*["']Shared Library["']\s*\)\.params\.jsCode/.test(s);
function comments(src){const cm=[];acorn.parse(PRE+src+POST,{...OPT,onComment:cm});
 return cm.map(c=>({block:c.type==='Block',start:c.start-PRE.length,end:c.end-PRE.length}));}
function strip(src){const cm=comments(src);let out='',at=0;
 for(const c of cm){if(c.start<0||c.end>src.length)throw new Error('comment outside the node text');out+=src.slice(at,c.start);
  const t=src.slice(c.start,c.end);
  if(c.block){const br=t.match(/\r\n|[\n\r\u2028\u2029]/g);out+=br?br.join(''):' ';}
  at=c.end;}
 return {text:out+src.slice(at),n:cm.length,chars:cm.reduce((a,c)=>a+c.end-c.start,0)};}
function tokens(src){const t=[];for(const k of acorn.tokenizer(PRE+src+POST,OPT)){t.push([k.type.label,k.value instanceof RegExp?String(k.value):k.value,k.regex?k.regex.pattern+'/'+k.regex.flags:null]);}return JSON.stringify(t);}
function tree(src){const a=acorn.parse(PRE+src+POST,OPT);return JSON.stringify(a,(k,v)=>(k==='start'||k==='end'||k==='loc'||k==='range')?undefined:(typeof v==='bigint'?String(v):v));}
const lines=s=>s.split(/\r\n|[\n\r\u2028\u2029]/).length;
if(require.main===module){
 const [FB,OUT]=process.argv.slice(2);if(!FB||!OUT){console.error('usage: node strip.cjs <fetchback.json> <out_dir>');process.exit(2);}
 let w=JSON.parse(fs.readFileSync(FB,'utf8'));if(w.result)w=w.result;if(w.data&&w.data.nodes)w=w.data;
 const wf=(w.workflowId||w.id||'wf')+'_'+String(w.versionId||'').slice(0,8);fs.mkdirSync(OUT,{recursive:true});
 const R={workflow:wf,code:0,lib:0,stubs:0,readers:[],parse_fail:[],no_comments:0,changed:[],fail:[],before:0,after:0,scope_before:0,scope_after:0};
 for(const n of w.nodes){if(n.type!=='n8n-nodes-base.code')continue;R.code++;const s=n.parameters.jsCode||'';R.before+=s.length;
  const keep=()=>{R.after+=s.length;};
  if(n.name==='Shared Library'){R.lib++;keep();continue;}
  if(isStub(s)){R.stubs++;keep();continue;}
  const rd=READS.filter(re=>re.test(s));if(rd.length){R.readers.push(n.name+' ('+rd.map(r=>r.source).join(', ')+')');keep();continue;}
  let r;try{r=strip(s);}catch(e){R.parse_fail.push(n.name+': '+e.message);keep();continue;}
  R.scope_before+=s.length;R.scope_after+=r.text.length;R.after+=r.text.length;
  if(!r.n){R.no_comments++;continue;}
  const ok={tokens:tokens(s)===tokens(r.text),tree:tree(s)===tree(r.text),lines:lines(s)===lines(r.text),no_comment_left:comments(r.text).length===0};
  const row={name:n.name,id:n.id,comments:r.n,comment_chars:r.chars,len_before:s.length,len_after:r.text.length,sha_before:sha(s),sha_after:sha(r.text),...ok};
  if(!(ok.tokens&&ok.tree&&ok.lines&&ok.no_comment_left))R.fail.push(n.name);
  R.changed.push(row);n.parameters.jsCode=r.text;row.text=r.text;row.original=s;}
 fs.writeFileSync(path.join(OUT,wf+'_stripped.json'),JSON.stringify(w));
 fs.writeFileSync(path.join(OUT,wf+'_nodes.json'),JSON.stringify(R.changed,null,1));
 console.log(`${wf}: Code nodes ${R.code}; Shared Library ${R.lib}; pkgLIB stubs ${R.stubs} (excluded); other code readers ${R.readers.length}${R.readers.length?' '+R.readers.join('; '):''}; parse failures ${R.parse_fail.length}${R.parse_fail.length?' '+R.parse_fail.join('; '):''}`);
 console.log(`  in scope ${R.changed.length+R.no_comments} nodes: changed ${R.changed.length}, no comments ${R.no_comments}; comments ${R.changed.reduce((a,x)=>a+x.comments,0)}, comment chars ${R.changed.reduce((a,x)=>a+x.comment_chars,0)}`);
 console.log(`  size: all Code nodes ${R.before} -> ${R.after} (${R.before-R.after} less); in-scope nodes ${R.scope_before} -> ${R.scope_after}`);
 console.log(`  proof: token equality ${R.changed.filter(x=>x.tokens).length}/${R.changed.length}; tree equality ${R.changed.filter(x=>x.tree).length}/${R.changed.length}; line count equal ${R.changed.filter(x=>x.lines).length}/${R.changed.length}; no comment left ${R.changed.filter(x=>x.no_comment_left).length}/${R.changed.length}`);
 console.log(R.fail.length?'  STRIP FAIL: '+R.fail.join(', '):'  STRIP PASS');process.exit(R.fail.length?1:0);}
module.exports={strip,tokens,tree,comments};
