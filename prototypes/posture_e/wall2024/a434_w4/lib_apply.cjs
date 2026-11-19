// ASK 422(a) joined library builder: one pair set applied to the engine's and the child's Shared Library alike.
// Usage: node lib_apply.cjs ENG_BASE.json CHILD_BASE.json pairs.json ENG_OUT.json CHILD_OUT.json
// Each pair {old,new} must occur exactly once in the library (counted over all lines, as they stand when the pair is applied) and lie within one
// line; lines are never added or removed (MAP holds line indices). MAP n recomputed, header sha and line count rewritten, every stub parsed. REFUSES unless both new bodies give one sha.
// ASK 424 R6 (W4 8929): a pair with "map":"<MAP key>" applies to that entry's inline MAP text instead (the parts held as text, not line indices);
// its old text must occur "count" times (default 1) across those parts. REFUSES also unless the two MAPs are equal after the change.
const fs=require('fs'),cr=require('crypto'),path=require('path');const acorn=require(path.join('/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/tools/node_modules/acorn'));const T=require(path.join('/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/tools/lib.cjs'));
const [EB,CB,PR,EO,CO]=process.argv.slice(2);const P=JSON.parse(fs.readFileSync(PR));if(!Array.isArray(P)||!P.length)throw new Error('pairs: a non-empty array');
const sha=L=>cr.createHash('sha256').update(JSON.stringify(L)).digest('hex').slice(0,16);
const build=(IN,OUT,who)=>{let w=JSON.parse(fs.readFileSync(IN));if(w.data&&w.data.nodes)w=w.data;const U=T.unpack(w);const before=sha(U.L);const L=U.L.slice();
 P.forEach((p,i)=>{if(typeof p.old!=='string'||!p.old||typeof p.new!=='string')throw new Error(who+' pair '+(i+1)+': old and new text required');
  if(p.map){const e=U.M[p.map];if(!e)throw new Error(who+' pair '+(i+1)+': no MAP key '+p.map);const parts=e.p.filter(x=>Array.isArray(x)&&typeof x[0]==='string');const c=parts.reduce((a,x)=>a+x[0].split(p.old).length-1,0);const want=p.count||1;
   if(c!==want)throw new Error(who+' pair '+(i+1)+': old text occurs '+c+' times in the inline text of MAP '+p.map+', not '+want);parts.forEach(x=>{x[0]=x[0].split(p.old).join(p.new);});return;}
  let c=0,at=-1;L.forEach((l,j)=>{const k=l.split(p.old).length-1;c+=k;if(k)at=j;});if(c!==1)throw new Error(who+' pair '+(i+1)+': old text occurs '+c+' times, not once');L[at]=L[at].replace(p.old,()=>p.new);});
 const M=U.M;const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
 const lsha=sha(L);const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr&&lsha!==before)throw new Error(who+': header');
 w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+JSON.stringify(L)+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
 for(const k of Object.keys(M))acorn.parse(T.rb(L,M[k]),{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
 return {w,before,after:lsha,changed:ch.length,OUT};};
const E=build(EB,EO,'engine'),C=build(CB,CO,'child');
console.log('engine',E.before,'->',E.after,'MAP n changed',E.changed,'| child',C.before,'->',C.after,'MAP n changed',C.changed);
if(E.after!==C.after){console.log('REFUSED: the two library bodies differ after the change ('+E.after+' / '+C.after+')');process.exit(1);}
// MAP compare: every key both hold must be equal; the engine alone holds REFP (ASK 409: the 30 engine loaders rebuild it), the child nothing extra.
const mapOf=w=>T.unpack(w).M;const ME=mapOf(E.w),MC=mapOf(C.w);const onlyE=Object.keys(ME).filter(k=>!(k in MC)),onlyC=Object.keys(MC).filter(k=>!(k in ME));
const mdiff=Object.keys(ME).filter(k=>k in MC&&JSON.stringify(ME[k])!==JSON.stringify(MC[k]));
if(mdiff.length||onlyC.length||JSON.stringify(onlyE)!==JSON.stringify(['REFP'])){console.log('REFUSED: the MAPs differ after the change (entries differ: '+mdiff.join(', ')+'; engine only: '+onlyE.join(', ')+'; child only: '+onlyC.join(', ')+')');process.exit(1);}
console.log('SAME MAP ENTRIES',Object.keys(MC).length,'(engine also holds REFP)');
fs.writeFileSync(EO,JSON.stringify(E.w));fs.writeFileSync(CO,JSON.stringify(C.w));console.log('SAME LIBRARY',E.after);
