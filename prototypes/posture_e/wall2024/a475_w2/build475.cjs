// ASK 475 (W2): one LAY text. The 12 B-round nodes (D2B..C4B Build and Extract) each hold the same inline "const LAY=(()=>{...})();".
// This moves that text into the Shared Library as a MAP entry LAY (engine and child alike, so the child MAP stays the engine MAP without REFP),
// and replaces each inline copy with a loader of the REFP form (ASK 409) that rebuilds it from the library and checks its length.
// Rebuilds on any base: the LAY lines are appended after the last library line, so no existing MAP index moves.
// usage: node a475_w2/build475.cjs ENGINE.json CHILD.json OUT_ENGINE.json OUT_CHILD.json
const fs=require('fs'),cr=require('crypto'),path=require('path');
const acorn=require(path.join(__dirname,'../tools/node_modules/acorn'));const T=require('../tools/lib.cjs');
const [EI,CI,EO,CO]=process.argv.slice(2);
const rd=p=>{let w=JSON.parse(fs.readFileSync(p));if(w.data&&w.data.nodes)w=w.data;return w;};
const E=rd(EI),C=rd(CI);
const NODES=[];for(const r of ['D2B','C2B','D3B','C3B','D4B','C4B'])for(const s of ['Build','Extract'])NODES.push(r+' '+s);
const P='(async function(){';
const decl=(c,nm)=>{const a=c.indexOf('const LAY=(()=>{');if(a<0||c.indexOf('const LAY=(()=>{',a+1)>=0)throw new Error(nm+': inline LAY not found exactly once');
 const ast=acorn.parse(P+c+'\n})',{ecmaVersion:'latest'});let hit=null;
 (function w(n){if(!n||typeof n!=='object')return;if(n.type==='VariableDeclaration'&&n.start-P.length===a)hit=n;for(const k in n){const v=n[k];if(Array.isArray(v))v.forEach(w);else if(v&&typeof v.type==='string')w(v);}})(ast);
 if(!hit)throw new Error(nm+': LAY declaration not parsed');return {a,e:hit.end-P.length,text:c.slice(a,hit.end-P.length)};};
const EN=Object.fromEntries(E.nodes.map(n=>[n.name,n]));
const found=NODES.map(nm=>{if(!EN[nm])throw new Error('no node '+nm);return decl(EN[nm].parameters.jsCode,nm);});
const TXT=found[0].text;if(found.some(f=>f.text!==TXT))throw new Error('the 12 inline LAY texts differ');
const cm=[];acorn.parse(TXT,{ecmaVersion:'latest',onComment:(b,t)=>cm.push(t)});if(cm.length)throw new Error('inline LAY holds a comment');
const sha=L=>cr.createHash('sha256').update(JSON.stringify(L)).digest('hex').slice(0,16);
const lib=(w,who)=>{const U=T.unpack(w);if(U.M.LAY)throw new Error(who+': the library already holds a LAY entry');
 const L=U.L.slice();const s=L.length;const add=TXT.split('\n');L.push(...add);const M=U.M;M.LAY={n:TXT.length,p:[[s,L.length-1]]};
 if(T.rb(L,M.LAY)!==TXT)throw new Error(who+': rebuilt LAY differs');
 const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+sha(L)+', '+L.length+' lines');if(h2===U.hdr)throw new Error(who+': header not rewritten');
 w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+JSON.stringify(L)+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
 return {before:sha(U.L),after:sha(L),lines:[U.L.length,L.length],at:s};};
const le=lib(E,'engine'),lc=lib(C,'child');if(le.after!==lc.after)throw new Error('engine and child library sha differ after the change');
const REFPL=EN['D2 Build'].parameters.jsCode;const ri=REFPL.indexOf('const REFP=(T=>{');const re=REFPL.indexOf("})($('Shared Library').params.jsCode);",ri);
if(ri<0||re<0)throw new Error('REFP loader not found in D2 Build');
// LAY's sheet() reads the Verse Sheet nodes through $ (guarded by typeof $), so the loader hands the node's $ to the rebuilt text;
// without it the rebuilt LAY would see no $ and silently read no verse rows. $ is the only free name in the LAY text (free_out.txt).
const L0=REFPL.slice(ri,re+"})($('Shared Library').params.jsCode);".length).replace(/REFP/g,'LAY');
const OLDF="return new Function(S+'\\nreturn LAY;')();";if(L0.split(OLDF).length!==2)throw new Error('loader return not found once');
const LOADER=L0.replace(OLDF,()=>"return new Function('$',S+'\\nreturn LAY;')($);");
for(const [i,nm] of NODES.entries()){const n=EN[nm];const c=n.parameters.jsCode;const f=found[i];n.parameters.jsCode=c.slice(0,f.a)+LOADER+c.slice(f.e);}
fs.writeFileSync(EO,JSON.stringify(E));fs.writeFileSync(CO,JSON.stringify(C));
console.log('inline LAY',TXT.length,'chars,',TXT.split('\n').length,'lines, identical in',NODES.length,'nodes, 0 comments');
console.log('library engine',le.before,'->',le.after,'lines',le.lines.join(' -> '),'| child',lc.before,'->',lc.after,'| LAY entry at line',le.at,'(0-based)');
console.log('loader',LOADER.length,'chars:',LOADER);
console.log('engine md5',cr.createHash('md5').update(fs.readFileSync(EO)).digest('hex'),'child md5',cr.createHash('md5').update(fs.readFileSync(CO)).digest('hex'));
