const fs=require('fs'),path=require('path'),crypto=require('crypto');
const acorn=require(process.env.ACORN||'acorn');
const D=__dirname;const IDS=['c7366RPLb8vdMQg6','Y1VIsNB6KBrs1znP','SX4ZWtgHNs96uBOo'];
const OFF='(async function(){'.length;const wrap=c=>'(async function(){'+c+'\n})';
const parse=c=>{const cm=[],tk=[];acorn.parse(wrap(c),{ecmaVersion:2025,sourceType:'script',allowReturnOutsideFunction:true,onComment:(b,t,s,e)=>cm.push([s-OFF,e-OFF,t]),onToken:t=>tk.push(t.type.label+'|'+(t.value===undefined?'':String(t.value)))});return {cm,tk};};
const js=x=>JSON.stringify(x,Object.keys(x||{}).sort());
const deep=x=>JSON.stringify(x,(k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(q=>[q,v[q]])):v);
const GUARD=/reasoning|max_tokens|temperature|effort|thinking/i;
let ok=true;const out=[];
fs.mkdirSync(path.join(D,'target'),{recursive:true});
for(const id of IDS){
  const base=JSON.parse(fs.readFileSync(path.join(D,'base',id+'.json')));const t=JSON.parse(JSON.stringify(base));
  out.push(`== ${id} ${base.name} base ${base.versionId} nodes ${base.nodes.length}`);
  for(const n of t.nodes){
    const c=n.parameters&&n.parameters.jsCode;if(typeof c!=='string')continue;
    const A=parse(c);if(!A.cm.length){out.push(`  ${n.name}: 0 comments`);continue;}
    for(const [s,e,txt] of A.cm){if(GUARD.test(txt)){ok=false;out.push(`  ${n.name}: COMMENT HOLDS A GUARDED WORD, not removed: ${txt}`);}}
    let o=c;for(const [s,e] of A.cm.slice().reverse()){let a=s,b=e;while(a>0&&(o[a-1]===' '||o[a-1]==='\t'))a--;if((a===0||o[a-1]==='\n')&&o[b]==='\n')b++;o=o.slice(0,a)+o.slice(b);}
    const B=parse(o);
    const same=B.tk.join('\n')===A.tk.join('\n');if(!same||B.cm.length)ok=false;
    out.push(`  ${n.name}: removed ${A.cm.length} comment(s), ${c.length} -> ${o.length} chars, tokens equal ${same}, comments left ${B.cm.length}`);
    for(const [,,txt] of A.cm)out.push(`    - ${txt.trim().slice(0,160)}`);
    n.parameters.jsCode=o;
  }
  const BN=Object.fromEntries(base.nodes.map(n=>[n.name,n]));
  for(const n of t.nodes){const b=BN[n.name];const x={...n,parameters:{...n.parameters,jsCode:undefined}},y={...b,parameters:{...b.parameters,jsCode:undefined}};if(deep(x)!==deep(y)){ok=false;out.push('  OTHER KEY CHANGED '+n.name);}}
  if(deep(t.connections)!==deep(base.connections)){ok=false;out.push('  CONNECTIONS CHANGED');}
  const s=JSON.stringify(t);fs.writeFileSync(path.join(D,'target',id+'.json'),s);
  out.push(`  target md5 ${crypto.createHash('md5').update(s).digest('hex')}`);
}
out.push(ok?'ALL CHECKS PASS':'CHECK FAILED');console.log(out.join('\n'));process.exit(ok?0:1);
