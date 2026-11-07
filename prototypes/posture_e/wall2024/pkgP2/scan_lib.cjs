// Reader phase 2 inventory (W1 half, 11-07; Eric approved the track 16:50 CST): every regex literal in the 22 library node sources (pkgLIB_v14 orig_stack)
// that names a judge line form or a judge answer word, with its enclosing function, and whether that function reads through the shared reader (__RL).
// Run from wall2024/: node pkgP2/scan_lib.cjs > pkgP2/scan_lib.tsv
const fs=require('fs');const acorn=require('../pkgLIB/vendor/acorn.cjs');const D='pkgLIB_v14/orig_stack/patched/';
const KW=/FORCED|RESTATED|RETRACTED|STATEMENT|RESPONSE|MEANS|ANSWER|CONCEDED|STANDS|NOT HELD|NOT\\s\+HELD|COUNTED|TOUCHES|CORRECTED|PRESSED|GROUND|LINK\\?s\+BROKEN|LINK BROKEN|KEYSTONE|RESULT|STANDING|CHAIN MARK|REASONING|PREMISE|Premise|FAILS|CARRIED|REFERENCE|SHORT|CHANGE TO|YOUR LINE|VERDICT|HELD|WITHDRAWN|UNDERDETERMINED|REASSERTED|GRANT|grant|\[L\d|\\\[L|L\[1-3\]|DR\\d|CR\\d|\[CD\]R|D\\d\+|vs/;
const seen=new Map();
for(const f of fs.readdirSync(D).filter(f=>f.endsWith('.js')).sort()){const src=fs.readFileSync(D+f,'utf8');const W='async function __W(){';
 const ast=acorn.parse(W+src+'\n}',{ecmaVersion:2025,sourceType:'script',locations:true,allowReturnOutsideFunction:true});
 const stack=[];const fnName=n=>n.id?n.id.name:null;
 (function walk(n,parent,name){if(!n||typeof n.type!=='string')return;let nm=name;
  if(n.type==='FunctionDeclaration'||n.type==='FunctionExpression')nm=fnName(n)||name;
  if(n.type==='VariableDeclarator'&&n.init&&/Function/.test(n.init.type)&&n.id.name)nm=n.id.name;
  if(n.type==='Property'&&n.value&&/Function/.test(n.value.type)&&n.key&&(n.key.name||n.key.value))nm=String(n.key.name||n.key.value);
  if(n.type==='VariableDeclarator'&&n.id&&n.id.name&&n.init&&n.init.type==='Literal'&&n.init.regex)nm=n.id.name;
  if(n.type==='Literal'&&n.regex&&KW.test(n.regex.pattern)){const k=nm+'\t'+n.regex.pattern;if(!seen.has(k))seen.set(k,{fn:nm||'(top)',re:n.regex.pattern,files:new Set(),line:n.loc.start.line});seen.get(k).files.add(f.replace('.js',''));}
  for(const key of Object.keys(n)){if(key==='loc')continue;const v=n[key];if(Array.isArray(v))v.forEach(c=>c&&typeof c.type==='string'&&walk(c,n,nm));else if(v&&typeof v.type==='string')walk(v,n,nm);}})(ast,null,null);}
// does each function body use __RL / readLine?
const usesRL=new Map();for(const f of fs.readdirSync(D).filter(f=>f.endsWith('.js'))){const s=fs.readFileSync(D+f,'utf8');for(const r of seen.values()){if(usesRL.has(r.fn))continue;const i=s.search(new RegExp('(?:function\\s+'+r.fn.replace(/\$/g,'\\$')+'\\s*\\(|const\\s+'+r.fn.replace(/\$/g,'\\$')+'\\s*=)'));if(i<0)continue;let depth=0,j=s.indexOf('{',i),k=j;for(;k<s.length;k++){if(s[k]==='{')depth++;else if(s[k]==='}'){depth--;if(!depth)break;}}usesRL.set(r.fn,/__RL\.|readLine\(|readLines\(/.test(s.slice(i,k)));}}
console.log('function\tvia_reader\tnodes\tregex');
for(const r of [...seen.values()].sort((a,b)=>a.fn.localeCompare(b.fn)))console.log(r.fn+'\t'+(usesRL.get(r.fn)?'yes':'no')+'\t'+r.files.size+'\t'+r.re.slice(0,220));
