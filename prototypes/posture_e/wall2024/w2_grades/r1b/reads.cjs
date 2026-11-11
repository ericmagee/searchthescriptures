// W2 R1b grade step 2: for each of the 45 newly packed nodes, (a) every $('X') the source reads is named in the stub's if(false) list; (b) non-literal $() calls; (c) n8n globals other than $ and $input; same checks on the 41 stubs already live, for comparison.
const fs=require('fs');const {rebuild}=require('../../pkgLIB/unpack.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=g('/mnt/project-files/wall2024/fetchback_live_s119.json'),B=g('/mnt/project-files/wall2024/parent_s119_R1b.json');
const lb=B.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const changed=JSON.parse(fs.readFileSync(__dirname+'/changed.json'));
const G=/(?<![\w$.])(\$json|\$node|\$items|\$execution|\$workflow|\$now|\$today|DateTime|\$runIndex|\$prevNode|\$env|\$vars|\$getWorkflowStaticData|\$binary|\$parameter|\$position|\$data|\$evaluateExpression|\$jmespath|\$fromAI|\$secrets|\$itemIndex|\$mode|items|this|require|Buffer|helpers|\$\w+)(?![\w$])/g;
const strip=s=>s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/(^|[^:\\])\/\/[^\n]*/g,'$1');
const rep=(name,stub,src)=>{const list=new Set([...((stub.match(/if\(false\)\{[^\n]*?\}/)||[''])[0].matchAll(/\$\("([^"]+)"\)/g))].map(m=>m[1]));
 const s=strip(src);const lit=new Set([...s.matchAll(/\$\(\s*(['"`])([^'"`]+)\1\s*\)/g)].map(m=>m[2]));const nonlit=[...s.matchAll(/\$\(\s*(?!['"`])([^)\s]{1,40})/g)].map(m=>m[1]);
 const missing=[...lit].filter(x=>!list.has(x));const glob=[...new Set([...s.matchAll(G)].map(m=>m[1]))].filter(x=>x!=='$input');
 return {name,missing,nonlit:[...new Set(nonlit)],glob};};
const out=[];for(const n of B.nodes){const s=n.parameters.jsCode;if(typeof s!=='string'||!s.includes('\nreturn await new Function('))continue;const r=rep(n.name,s,rebuild(s,lb));r.newly=changed.includes(n.name);out.push(r);}
for(const r of out)if(r.missing.length||r.nonlit.length||r.glob.length)console.log((r.newly?'NEW ':'OLD ')+r.name,JSON.stringify({missing:r.missing,nonlit:r.nonlit,glob:r.glob}));
console.log('stubs',out.length,'newly packed',out.filter(r=>r.newly).length,'with a read missing from the if(false) list',out.filter(r=>r.missing.length).length);
