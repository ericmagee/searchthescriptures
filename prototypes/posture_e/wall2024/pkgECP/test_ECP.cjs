// pkgECP test: base s48 vs patched Judge Enforcer Build and Alt Judge Enforcer Build on every saved run that has the node's feeder saved.
// The output must be identical once the pkgECP rule sentence and the added FORCED-line blocks are removed, and every E-COL LINK BROKEN item
// that has a same-seat FORCED line on the same collision must now carry it. Prints one built item.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');
const F='/mnt/project-files/wall2024/fetchback_live_s48.json';let ok=0,bad=0,lb=0,paired=0,shown=false;const per={};
const RS=" A LINK BROKEN line given with THE SAME JUDGE'S FORCED LINE on that collision";const strS=t=>{let k=t.indexOf(RS);while(k>=0){const e=t.indexOf('(pkgECP, either side alike).',k);t=t.slice(0,k)+t.slice(e+'(pkgECP, either side alike).'.length);k=t.indexOf(RS);}return t.replace(/\nTHE SAME JUDGE'S FORCED LINE ON THIS COLLISION \(pkgECP[^\n]*\n[^\n]*(?:\n(?!\n)(?!THE |ITEM )[^\n]*)?/g,'');};
const walk=o=>typeof o==='string'?strS(o):Array.isArray(o)?o.map(walk):(o&&typeof o==='object')?Object.fromEntries(Object.entries(o).map(([k,v])=>[k,walk(v)])):o;
const strip=b=>JSON.stringify(walk(JSON.parse(b)));
(async()=>{for(const node of ['Judge Enforcer Build','Alt Judge Enforcer Build']){const f=node.replace(/ /g,'_')+'.js';const A=rd('pkgECP/base_s48/'+f),B=rd('pkgECP/patched/'+f);const IN=feeder(F,node)[0];
 const runs=[...new Set(fs.readdirSync(D).filter(x=>x.startsWith('33')&&x.endsWith('_'+node.replace(/ /g,'_')+'.json')).map(x=>x.slice(0,5)))].sort();
 for(const R of runs){const run=async c=>{try{return await harness(R)('return (async()=>{'+c+'\n})()',IN);}catch(e){return 'ERR '+e.message;}};
  const a=JSON.stringify(await run(A)),b=JSON.stringify(await run(B));
  if(a.startsWith('"ERR')||b.startsWith('"ERR')){if(a===b){ok++;per[R+' '+node]='same error';}else{bad++;console.log('FAIL '+R+' '+node+' '+a.slice(0,100)+' | '+b.slice(0,100));}continue;}
  const norm=x=>{const o=JSON.parse(x);const ids=[],its=[],sys=new Set(),rest=[];for(const it of o){const j=it.json||{};for(const d of (j.ids||[]))ids.push(d);if(j.body&&j.body.messages)for(const m of j.body.messages){if(m.role==='system')sys.add(m.content);else for(const blk of String(m.content).split(/\n\n(?=ITEM )/))its.push(blk.replace(/^[\s\S]*?(?=ITEM )/,''));}const r={...j};delete r.ids;delete r.body;delete r.call;delete r.calls;delete r.counts;rest.push(r);}return JSON.stringify({ids,its:its.filter(t=>t.startsWith('ITEM ')&&!t.startsWith('ITEM id (')).map(t=>t.split('\n\n')[0]),sys:[...sys],rest:rest[0]});};
  const ncA=JSON.parse(a).length,ncB=JSON.parse(b).length;if(ncA!==ncB)console.log('note '+R+' '+node+': calls '+ncA+' -> '+ncB+' (the larger items pack into calls differently)');
  const sb=norm(strip(b)),a2=norm(a);if(sb===a2)ok++;else{bad++;let i=0;while(a2[i]===sb[i])i++;console.log('FAIL '+R+' '+node+' differs at '+i+':\n a '+a2.slice(i-100,i+150)+'\n b '+sb.slice(i-100,i+150));}

  const n=(b.match(/\(E-COL, a collision line graded against a link\):\\nTHE LINE: (?!FORCED)/g)||[]).length,p=(b.match(/THE SAME JUDGE'S FORCED LINE ON THIS COLLISION \(pkgECP/g)||[]).length;lb+=n;paired+=p;per[R+' '+node]=n+' LINK BROKEN items, '+p+' given their FORCED line';
  if(!shown&&p&&R==='33442'){shown=true;const i=b.indexOf("THE SAME JUDGE'S FORCED LINE ON THIS COLLISION");const s=b.lastIndexOf('ITEM K',i);console.log('ONE BUILT ITEM ('+R+' '+node+'):\n'+JSON.parse('"'+b.slice(s,b.indexOf('\\n\\n',i))+'"')+'\n');}}}
 for(const [k,v] of Object.entries(per))console.log(k+': '+v);
 console.log('node runs identical apart from pkgECP text: '+ok+', differing: '+bad+'; LINK BROKEN items '+lb+', given their FORCED line '+paired);console.log(bad===0?'OK':'FAIL');})();
