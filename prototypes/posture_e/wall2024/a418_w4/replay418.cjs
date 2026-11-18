#!/usr/bin/env node
// ASK 418 (W4): one stored-row replay for code-only changes. Plan rev 1 (65ef20a6) with W1 8927 C1-C3, N1 and W2 8928.
// Usage: node replay418.cjs --base BASE.json --cand CAND.json --spec spec.json [--rows rows.json] [--ms 2000] [--out out.txt] [--show N]
// spec: {"cut":[{"from":"node:<name>"|"lib:<MAP key>" | ["node:a","node:b",...], "names":["n1",...]}       (named declarations, any depth)
//               |{"from":"node:<name>","whole":"<as>"}],                                                    (a whole node body as function <as>())
//        "stubs":"<JS run before the cuts, inside the per-row function; row is in scope>",
//        "call":"<expression over the cuts and row>", "empty":"<expression over out: true when the output holds nothing>",
//        "allow_changed":["row id",...] | "all", "allow_error":false, "cases":[{"id","row",("want"|"want_base"): <json>}]}
// rows.json: [{"id":..., ...}] (the row object is passed as row).
// "node:<name>" reads a library-stub node by rebuilding its text from the Shared Library (tools/lib.cjs rb(L, M[name])); a plain Code node is read
// as written (W1 8927 C2). A name must occur exactly once in each source (a declarator or a function declaration, at any depth); when a name is
// cut from several sources, their texts must be identical on each side, and the sha256 of each is printed.
// Classes per row: EQUAL (split into non-empty and empty), CHANGED, NEWLY NON-EMPTY, EMPTIED, ERROR (a throw or a timeout on either side;
// W1 8927 C1). Exit 0 only when every case passes, no row is ERROR (unless allow_error), and no row is CHANGED or EMPTIED outside allow_changed.
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const acorn=require(path.join(__dirname,'../tools/node_modules/acorn'));const T=require(path.join(__dirname,'../tools/lib.cjs'));
const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const ld=p=>{let d=JSON.parse(fs.readFileSync(p));return d.data&&d.data.nodes?d.data:d;};
function walk(n,f,parent){if(!n||typeof n.type!=='string')return;f(n,parent);for(const k in n){const v=n[k];if(k==='type'||k==='start'||k==='end')continue;if(Array.isArray(v))v.forEach(x=>x&&typeof x.type==='string'&&walk(x,f,n));else if(v&&typeof v.type==='string')walk(v,f,n);}}
const parse=src=>acorn.parse('(async function(){'+src+'\n})',{ecmaVersion:'latest'});const OFF='(async function(){'.length;
function sourceOf(wf,from){const m=from.match(/^(node|lib):(.+)$/);if(!m)throw new Error('bad from '+from);const u=T.unpack(wf);
 if(m[1]==='lib'){if(!u.M[m[2]])throw new Error('no MAP key '+m[2]);return {src:T.rb(u.L,u.M[m[2]]),how:'library MAP '+m[2]};}
 const n=wf.nodes.filter(x=>x.name===m[2]);if(n.length!==1)throw new Error('node '+m[2]+' found '+n.length+' times');
 if(u.M[m[2]])return {src:T.rb(u.L,u.M[m[2]]),how:'stub rebuilt from the library'};const c=n[0].parameters&&n[0].parameters.jsCode;if(typeof c!=='string')throw new Error(m[2]+' is not a Code node');return {src:c,how:'plain Code node'};}
function cutName(src,name,label){const ast=parse(src);const hits=[];
 walk(ast,(n)=>{if(n.type==='FunctionDeclaration'&&n.id&&n.id.name===name)hits.push(src.slice(n.start-OFF,n.end-OFF));
  if(n.type==='VariableDeclarator'&&n.id&&n.id.type==='Identifier'&&n.id.name===name)hits.push('var '+src.slice(n.start-OFF,n.end-OFF)+';');});
 if(hits.length!==1)throw new Error('STOP: '+name+' occurs '+hits.length+' times in '+label+' (must be exactly once)');return hits[0];}
const GL=new Set(Object.getOwnPropertyNames(globalThis).concat(['undefined','NaN','Infinity','arguments','row','out']));
function freeNames(code,known){const ast=parse(code);const decl=new Set(),used=new Set();
 walk(ast,(n,p)=>{if(n.type==='VariableDeclarator')walk(n.id,x=>{if(x.type==='Identifier')decl.add(x.name);});
  if((n.type==='FunctionDeclaration'||n.type==='FunctionExpression'||n.type==='ArrowFunctionExpression')){if(n.id)decl.add(n.id.name);n.params.forEach(q=>walk(q,x=>{if(x.type==='Identifier')decl.add(x.name);}));}
  if(n.type==='CatchClause'&&n.param)walk(n.param,x=>{if(x.type==='Identifier')decl.add(x.name);});
  if(n.type==='Identifier'){if(p&&p.type==='MemberExpression'&&p.property===n&&!p.computed)return;if(p&&p.type==='Property'&&p.key===n&&!p.computed&&!p.shorthand)return;if(p&&(p.type==='MethodDefinition'||p.type==='PropertyDefinition')&&p.key===n)return;if(p&&p.type==='LabeledStatement')return;used.add(n.name);}});
 return [...used].filter(x=>!decl.has(x)&&!GL.has(x)&&!known.has(x)).sort();}
function build(wf,spec,label){const parts=[],shas=[];const known=new Set();
 for(const c of spec.cut){const froms=Array.isArray(c.from)?c.from:[c.from];
  if(c.whole){const s=sourceOf(wf,froms[0]);const hasAwait=(()=>{let a=false;walk(parse(s.src),n=>{if(n.type==='AwaitExpression')a=true;});return a;})();if(hasAwait)throw new Error('STOP: '+froms[0]+' uses await; whole-node replay is synchronous');
   parts.push('var '+c.whole+'=function(){'+s.src+'\n};');known.add(c.whole);shas.push(label+' '+c.whole+' <- '+froms[0]+' ('+s.how+') sha '+sha(s.src));continue;}
  for(const nm of c.names){const texts=froms.map(f=>{const s=sourceOf(wf,f);return {f,how:s.how,t:cutName(s.src,nm,f)};});
   const distinct=[...new Set(texts.map(x=>x.t))];shas.push(label+' '+nm+': '+texts.length+' cop'+(texts.length>1?'ies':'y')+', '+distinct.length+' text'+(distinct.length>1?'s':'')+' ['+[...new Set(texts.map(x=>sha(x.t)))].join(', ')+'] ('+[...new Set(texts.map(x=>x.how))].join('; ')+')');
   if(distinct.length!==1)throw new Error('STOP: '+nm+' differs across its copies on the '+label+' side');parts.push(distinct[0]);known.add(nm);}}
 const cuts=parts.join('\n');const stubKnown=new Set();try{walk(parse(spec.stubs||''),n=>{if(n.type==='VariableDeclarator'&&n.id.type==='Identifier')stubKnown.add(n.id.name);if(n.type==='FunctionDeclaration')stubKnown.add(n.id.name);});}catch(e){}
 const free=freeNames(cuts,new Set([...known,...stubKnown]));
 const fn='__f=function(row){\n'+(spec.stubs||'')+'\n'+cuts+'\nreturn ('+spec.call+');\n};__e=function(out){return !!('+(spec.empty||'out==null')+');};';
 return {fn,shas,free};}
function runner(b,ms){const ctx=vm.createContext({});vm.runInContext(b.fn,ctx,{timeout:ms});
 return row=>{ctx.__row=row;try{vm.runInContext('__o=__f(__row);__s=JSON.stringify(__o);__m=__e(__o);',ctx,{timeout:ms});return {ok:true,s:ctx.__s===undefined?'undefined':ctx.__s,empty:ctx.__m,v:ctx.__o};}
  catch(e){return {ok:false,s:'ERROR: '+String(e&&e.message||e).slice(0,200)};}};}
module.exports={build,runner,sourceOf,cutName,freeNames,ld,sha};
if(require.main===module){
 const A={};for(let i=2;i<process.argv.length;i+=2)A[process.argv[i].replace(/^--/,'')]=process.argv[i+1];
 const out=[];const P=s=>{out.push(s);};const fin=code=>{const t=out.join('\n')+'\n';if(A.out)fs.writeFileSync(A.out,t);process.stdout.write(t);process.exit(code);};
 let spec,B,C;try{spec=JSON.parse(fs.readFileSync(A.spec));const W0=ld(A.base),W1=ld(A.cand);P('base '+W0.versionId+' | cand '+W1.versionId+' | spec '+path.basename(A.spec)+' sha '+sha(fs.readFileSync(A.spec,'utf8')));
  B=build(W0,spec,'base');C=build(W1,spec,'cand');}catch(e){P(String(e.message||e));P('RESULT: STOPPED');fin(2);}
 B.shas.concat(C.shas).forEach(s=>P('CUT '+s));P('FREE NAMES (base): '+(B.free.join(', ')||'none'));P('FREE NAMES (cand): '+(C.free.join(', ')||'none'));
 const ms=+(A.ms||2000);let rb,rc;try{rb=runner(B,ms);rc=runner(C,ms);}catch(e){P('STOP: the cut code does not load: '+e.message);P('RESULT: STOPPED');fin(2);}
 const rows=A.rows?JSON.parse(fs.readFileSync(A.rows)):[];const cls={EQUAL_NONEMPTY:[],EQUAL_EMPTY:[],CHANGED:[],'NEWLY NON-EMPTY':[],EMPTIED:[],ERROR:[]};const det={};
 for(const r of rows){const o=rb(r),n=rc(r);let k;if(!o.ok||!n.ok)k='ERROR';else if(o.s===n.s)k=o.empty?'EQUAL_EMPTY':'EQUAL_NONEMPTY';else if(o.empty&&!n.empty)k='NEWLY NON-EMPTY';else if(!o.empty&&n.empty)k='EMPTIED';else k='CHANGED';
  cls[k].push(String(r.id));if(k!=='EQUAL_NONEMPTY'&&k!=='EQUAL_EMPTY')det[r.id]=[o.s,n.s];}
 P('ROWS '+rows.length+(A.rows?' from '+path.basename(A.rows)+' sha '+sha(fs.readFileSync(A.rows,'utf8')):''));
 P('  EQUAL '+(cls.EQUAL_NONEMPTY.length+cls.EQUAL_EMPTY.length)+' (non-empty '+cls.EQUAL_NONEMPTY.length+', empty '+cls.EQUAL_EMPTY.length+')');
 const show=+(A.show||3);for(const k of ['CHANGED','NEWLY NON-EMPTY','EMPTIED','ERROR']){P('  '+k+' '+cls[k].length+(cls[k].length?': '+cls[k].join(', '):''));for(const id of cls[k].slice(0,show))P('    '+id+' base '+det[id][0].slice(0,160)+' | cand '+det[id][1].slice(0,160));}
 let cf=0;for(const c of spec.cases||[]){const o=rb(c.row),n=rc(c.row);const res=[];let ok=true;
  if('want_base' in c){const g=o.ok?o.s:o.s;const w=JSON.stringify(c.want_base);if(g!==w)ok=false;res.push('base '+g.slice(0,120));}
  if('want' in c){const g=n.ok?n.s:n.s;const w=JSON.stringify(c.want);if(g!==w)ok=false;res.push('cand '+g.slice(0,160));}
  if(!ok)cf++;P('CASE '+(ok?'PASS ':'FAIL ')+c.id+' | '+res.join(' | ')+(ok?'':' | want '+JSON.stringify({want_base:c.want_base,want:c.want}).slice(0,200)));}
 const al=spec.allow_changed==='all'?null:new Set((spec.allow_changed||[]).map(String));const unallowed=[...cls.CHANGED,...cls.EMPTIED].filter(id=>al&&!al.has(id));
 const errs=spec.allow_error?0:cls.ERROR.length;P('CASES '+(spec.cases||[]).length+', failed '+cf+' | ERROR rows '+cls.ERROR.length+(spec.allow_error?' (allowed)':'')+' | CHANGED or EMPTIED outside allow_changed '+unallowed.length);
 const bad=cf+errs+unallowed.length;P('RESULT: '+(bad?'FAIL':'PASS'));fin(bad?1:0);}
