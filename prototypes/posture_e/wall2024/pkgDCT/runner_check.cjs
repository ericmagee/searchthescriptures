// pkgDCT S4, runner model on the trimmed pack (W1). Usage: node pkgDCT/runner_check.cjs <live fetchback> <trimmed workflow>
// For every Code node: (a) the trimmed effective code needs no node, "all", $env, $execution or $prevNode that its stub does not ask for;
// $input is checked too, except where the stub passes its own $input shim built from a node it names (pkgE4 nodes).
// (b) lists what each stub stops asking for compared with live, and whether the live effective code needed it only in code the trim removed.
const R=require('../pkgLIB/runner_model.cjs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const [FA,FB]=process.argv.slice(2);const A=L(FA),B=L(FB);let c=0,bad=[],less=[];
for(const nd of B.w.nodes){if(!nd.parameters.jsCode||nd.name==='Shared Library')continue;c++;const raw=nd.parameters.jsCode;const s=R.needs(raw),be=R.needs(B.code(nd.name)),l=R.needs(A.w.nodes.find(z=>z.name===nd.name).parameters.jsCode),le=R.needs(A.code(nd.name));
 const shim=/new Function\('\$','\$input'[\s\S]{0,200}\)\(\$,\{first:\(\)=>\$\('([^']+)'\)/.exec(raw);const fl=['env','execution','prevNode'].concat(shim&&s.nodes.has(shim[1])?[]:['input']).filter(k=>be[k]&&!s[k]&&!s.all);
 const miss=s.all?[]:[...be.nodes].filter(m=>!s.nodes.has(m));if(miss.length||fl.length||(be.all&&!s.all)||!s.parsed)bad.push(nd.name+' miss '+miss.join(',')+' flags '+fl.join(','));
 const dropped=[...l.nodes].filter(x=>!s.nodes.has(x)).concat(l.all&&!s.all?['(all)']:[]);if(dropped.length)less.push(nd.name+': '+dropped.join(', ')+' | trimmed effective code needs none of them: '+dropped.every(x=>x==='(all)'?!be.all:!be.nodes.has(x)));}
console.log('code nodes',c,'| trimmed code needs what its stub does not ask for:',bad.length);bad.forEach(b=>console.log('  BAD',b));
console.log('stubs that ask for less than live:',less.length);less.forEach(x=>console.log('  ',x));
