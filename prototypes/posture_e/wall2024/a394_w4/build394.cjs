// ASK 394 build (plan rev 9, site table Wall 8224, settled calls Wall 8230): moved grade sites read collision lines through the shared reader
// (ri6Col2024 / ri5Rd2024 over the stub's own __RL text), with the §8 grade list and no own-regex fallback. Shared Library only. Offline.
// Usage: node build394.cjs IN OUT   (IN = engine or child workflow JSON whose library holds the s262 site texts)
const fs=require('fs'),cr=require('crypto'),acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const U=T.unpack(d);const L=U.L,M=U.M;
const NO='/(?!)/';const DLB="'DEFENDER LINK BROKEN'",CLB="'CHALLENGER LINK BROKEN'",UND="'UNDERDETERMINED'";
const E=[ // [site, line-finder text, old, new]
 ['1 __UD','const __UD=/^[\\s>*_-]*(D\\d+)\\s+vs','const __UD=/^[\\s>*_-]*(D\\d+)\\s+vs\\.?\\s+(C\\d+)\\b[^\\n]{0,200}?:\\s*\\**\\s*UNDERDETERMINED\\b/i;',
  "const __UD={[Symbol.match]:l=>ri6Col2024(l,"+NO+",["+UND+"])}; /* ASK 394 site 1: the shared reader, COLLISION graded UNDERDETERMINED */"],
 ['2 COL','const m=l.replace(/[*_`]+/g,\'\').match(COL);',"const m=l.replace(/[*_`]+/g,'').match(COL);\n   if(m){const lab=m[1].toUpperCase()+' vs '+m[2].toUpperCase();",
  "const m=l.replace(/[*_`]+/g,'').match(COL);\n   if(m){const lab=m[2]?m[1].toUpperCase()+' vs '+m[2].toUpperCase():m[1].toUpperCase();"],
 ['2 COL def','const COL=/^[\\s>*_-]*(?:\\d+[.)]','const COL=/^[\\s>*_-]*(?:\\d+[.)]\\s*)?\\**\\s*(D\\d+)\\s+vs\\.?\\s+(C\\d+)\\b[^\\n]{0,200}?:\\s*\\**\\s*(STANDS|UNDERDETERMINED)\\b/i;',
  "const COL={[Symbol.match]:l=>ri6Col2024(l,"+NO+",['STANDS',"+UND+"])}; /* ASK 394 site 2: COLLISION graded STANDS or UNDERDETERMINED, today's shapes (Wall 8247 W1 condition 2) */"],
 ['3 g','g=a?a[2]:(t.match(/^D\\d+\\s+vs','g=a?a[2]:(t.match(/^D\\d+\\s+vs\\.?\\s+C\\d+\\s*(?:\\([^)]*\\))?\\s*:\\s*(DEFENDER|CHALLENGER) LINK BROKEN\\b/)||[])[1],',
  "g=a?a[2]:((c=>c?String(c[3]).split(' ')[0]:undefined)(ri6Col2024(t,"+NO+",["+DLB+","+CLB+"]))) /* ASK 394 site 3 */,"],
 ['4 G2','const G2=/^\\s*(?:','const G2=/^\\s*(?:[-\\u2022*]\\s*|\\d+[.)]\\s*)?\\**D\\d+\\s+vs\\.?\\s+C\\d+\\b(?:\\s*\\([^)\\n]*\\))?[^:\\n(]*:\\s*\\**(?:DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN)\\b/;',
  "const G2={test:l=>!!ri6Col2024(l,"+NO+",["+DLB+","+CLB+"])}; /* ASK 394 site 4 */"],
 ['6 GR1','const GR=/^\\s*(?:[-\\u2022*]','const GR=/^\\s*(?:[-\\u2022*]\\s*|\\d+[.)]\\s*)?\\**D\\d+\\s+vs\\.?\\s+C\\d+\\b(?:\\s*\\([^)\\n]*\\))?[^:\\n(]*:\\s*\\**(?:DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|WITHDRAWN)\\b/;',
  "const GR={test:l=>!!ri6Col2024(String(l==null?'':l).replace(/^\\s+/,'').split('\\n')[0],"+NO+",["+DLB+","+CLB+","+UND+",'STANDS'])}; /* ASK 394 site 6: first line of the CHANGE TO; STANDS kept (Wall 8251 W1 3.1) */"],
 ['8 GRADED1','const GRADED1=n=>new RegExp(',"const GRADED1=n=>new RegExp('\\\\bD'+n+'\\\\s+vs\\\\.?\\\\s+C\\\\d+\\\\b[^\\\\n]{0,200}?:\\\\s*\\\\**\\\\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|WITHDRAWN AFTER)','i');",
  "const GRADED1=n=>({[Symbol.match]:s=>{for(const x of String(s==null?'':s).split('\\n')){const c=ri6Col2024(x,"+NO+",["+DLB+","+CLB+","+UND+"]);if(c&&String(c[1]).toUpperCase()==='D'+n)return [c[0],c[3]];}return null;}}); /* ASK 394 site 8: a graded Dn vs C<j> line, line by line, §8 grades; [1] is the grade, as the old capture group */"],
 ['9 hm','const hm=l.match(','const hm=l.match(/^(?:[-•]\\s*|\\d+[.)]\\s*)?(D\\d+\\s+vs\\.?\\s+C\\d+)\\b[^\\n]*?:\\s*UNDERDETERMINED\\b/i);',
  "const hm=(c=>c?[c[0],c[1]+' vs '+c[2]]:null)(ri6Col2024(l,"+NO+",["+UND+"])); /* ASK 394 site 9 */"],
 ['10 HOLD','const HOLD=/^([DC]','const HOLD=/^([DC]\\d+(?:\\s*vs\\.?\\s*[DC]\\d+)?)\\s*(?:\\([^)]*\\))?\\s*:\\s*(STANDS|UNDERDETERMINED)\\b/;',
  "const HOLD={[Symbol.match]:l=>{const c=ri6Col2024(l,"+NO+",["+UND+",'STANDS']);if(c)return [l,c[1]+' vs '+c[2],c[3]];const r=ri5Rd2024(l);return r&&r.form==='LINK STATE'&&/^D\\d+$/i.test(String(r.f.link||''))&&(r.f.grade==='STANDS'||r.f.grade==='UNDERDETERMINED')?[l,String(r.f.link),r.f.grade]:null;}}; /* ASK 394 site 10: COLLISION graded UNDERDETERMINED, or LINK STATE \"D<i>: STANDS\" (§8) or \"D<i>: UNDERDETERMINED\" (Wall 8247 W1) */"],
 ['12 rudPair','const m=l.match(/^(?:[-•]\\s*|\\d+[.)]\\s*)?(D\\d+\\s+vs','const m=l.match(/^(?:[-•]\\s*|\\d+[.)]\\s*)?(D\\d+\\s+vs\\.?\\s+C\\d+)\\b[^\\n]*?:\\s*UNDERDETERMINED\\b/i);',
  "const m=(c=>c?[c[0],c[1]+' vs '+c[2]]:null)(ri6Col2024(l,"+NO+",["+UND+"])); /* ASK 394 site 12 */"],
 ['13 brokenD','const m=l.match(/^(?:FORCED(?:','const m=l.match(/^(?:FORCED(?:\\s*\\(\\s*Commitment\\s+\\d+\\s*\\))?\\s*:\\s*)?D(\\d+)\\s*(?:vs\\.?\\s*C\\d+)?\\s*(?:\\([^)]*\\))?\\s*:\\s*DEFENDER LINK BROKEN\\b/);',
  "const m=(c=>c?[c[0],String(c[1]).slice(1)]:null)(ri6Col2024(l,"+NO+",["+DLB+"]))||((r=>r&&r.form==='LINK STATE'&&/^D\\d+$/i.test(String(r.f.link||''))&&r.f.grade==='DEFENDER LINK BROKEN'?[l,String(r.f.link).slice(1)]:null)(ri5Rd2024(l))); /* ASK 394 site 13 (rev 7; Wall 8240 ruling W1/W3): COLLISION graded DEFENDER LINK BROKEN, or LINK STATE \"D<i>: DEFENDER LINK BROKEN\" */"],
 ['14 pkgECG','t.match(/^D(\\d+)\\s+vs','t.match(/^D(\\d+)\\s+vs\\.?\\s+C(\\d+)\\b\\s*(?:\\([^)]*\\))?\\s*:\\s*(DEFENDER|CHALLENGER) LINK BROKEN\\b/)',
  "((c=>c?[c[0],String(c[1]).slice(1),String(c[2]).slice(1),String(c[3]).split(' ')[0]]:null)(ri6Col2024(t,"+NO+",["+DLB+","+CLB+"]))) /* ASK 394 site 14 */"],
 ['15 ri6','ri6Col2024(l,/^\\s*(?:[-•*]','ri6Col2024(l,/^\\s*(?:[-•*]\\s*|\\d+[.)]\\s*)?\\**(D\\d+)\\s+vs\\.?\\s+(C\\d+)\\b(?:\\s*\\([^)\\n]*\\))?[^:\\n(]*:\\s*\\**(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|WITHDRAWN)\\b/,[\'DEFENDER LINK BROKEN\',\'CHALLENGER LINK BROKEN\',\'WITHDRAWN\'])',
  "ri6Col2024(l,"+NO+",["+DLB+","+CLB+"]) /* ASK 394 site 15: no fallback; WITHDRAWN AFTER is not a §8 grade */"],
];
const touched=new Set(),log=[];
for(const [site,find,old,nu] of E){const lines=[];L.forEach((x,i)=>{const k=x.split(old).length-1;if(k)lines.push([i,k]);});
 if(lines.length!==1||lines[0][1]!==1)throw new Error(site+': old text found '+JSON.stringify(lines));const li=lines[0][0];L[li]=L[li].replace(old,()=>nu);touched.add(li);log.push(site+' L'+li);}
// wrappers: every stub whose rebuilt source now calls ri6Col2024/ri5Rd2024 must hold their definitions (library lines, byte-equal), at top level after its __RL
const LI5=L.findIndex(x=>/^function ri5Rd2024\(/.test(x)),LI6=L.findIndex(x=>/^function ri6Col2024\(/.test(x));if(LI5<0||LI6<0)throw new Error('wrappers not found');
const has=(m,li)=>m.p.some(e=>typeof e==='number'?e===li:(typeof e[0]!=='string'&&li>=e[0]&&li<=e[1]));
const isRL=(e)=>{const t=typeof e==='number'?L[e]:(typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n'));return /const __RL=\(function/.test(t);};
const added=[];
for(const [k,m] of Object.entries(M)){const usesT=m.p.some(e=>{const ids=typeof e==='number'?[e]:(typeof e[0]==='string'?[]:Array.from({length:e[1]-e[0]+1},(_,j)=>e[0]+j));return ids.some(i=>touched.has(i));});if(!usesT)continue;
 const need=[];if(!has(m,LI5))need.push(LI5);if(!has(m,LI6))need.push(LI6);if(!need.length)continue;
 let at;const i5=m.p.findIndex(e=>typeof e==='number'?e===LI5:(typeof e[0]!=='string'&&LI5>=e[0]&&LI5<=e[1]));
 if(i5>=0)at=i5; // after ri5Rd2024, in its own container
 else{ // after the statement that declares __RL, in the same container: the p entry where that statement ends must end exactly there
  const src=T.rb(L,m);const ast=acorn.parse(src,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});let decl=null;
  (function walk(n){if(!n||typeof n.type!=='string'||decl)return;if(n.type==='VariableDeclaration'&&n.declarations.some(d=>d.id&&d.id.name==='__RL'))decl=n;for(const key of Object.keys(n)){const v=n[key];if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v.type==='string')walk(v);}})(ast);
  if(!decl)throw new Error(k+': no __RL declaration');let off=0;at=-1;for(let j=0;j<m.p.length;j++){const e=m.p[j];const t=typeof e==='number'?L[e]:(typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n'));off+=t.length;if(off>=decl.end){if(src.slice(decl.end,off).trim()!=='')throw new Error(k+': __RL statement ends inside p['+j+'] with text after it: '+JSON.stringify(src.slice(decl.end,off).slice(0,80)));at=j;break;}off+=1;}
  if(at<0)throw new Error(k+': __RL end not mapped');}
 m.p.splice(at+1,0,...need);added.push(k+' +'+need.map(x=>'L'+x).join(','));}
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});for(const k of Object.keys(M))P(T.rb(L,M[k]));
fs.writeFileSync(OUT,JSON.stringify(d));
console.log('sites',log.join(' | '));console.log('wrappers added',added.length,added.join('; '));console.log('MAP lengths changed',ch.length,'| lib sha',lsha);
