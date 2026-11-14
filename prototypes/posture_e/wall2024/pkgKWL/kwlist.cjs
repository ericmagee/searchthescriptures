// ASK 284 (operator card 15:04 CST 11-14): build-time rule for the keep-word verb list (W3 6382).
// The list stands twice in each of 5 non-stub nodes. This script checks the 10 copies are byte-equal (check),
// or rewrites every copy from one source string (set). It never touches n8n; use it inside a build, then diff.
// usage: node kwlist.cjs check <workflow.json>
//        node kwlist.cjs set <workflow.json> <out.json> '<new alternation>'
const fs=require('fs');const [, , mode, fin, fout, neu]=process.argv;
const NODES=['D4 Build','C4 Build','C4 Extract','C4G Extract','C4B Extract'];
const LIST=String.raw`(?:do\s+not\s+claim|no\s+longer\s+claim|no\s+longer\s+rest|withdraw|grant|concede|drop|admit|retract|give\s+up)`;
const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
// a copy is the (?:...) group that holds both "do\s+not\s+claim" and "give\s+up"
const find=c=>{const out=[];let i=-1;while((i=c.indexOf(String.raw`(?:do\s+not\s+claim`,i+1))>=0){let d=0,k=i;for(;k<c.length;k++){if(c[k]==='\\'){k++;continue;}if(c[k]==='(')d++;else if(c[k]===')'){d--;if(!d)break;}}const g=c.slice(i,k+1);if(/give\\s\+up/.test(g))out.push({at:i,g});}return out;};
let bad=0;const all=[];
for(const nm of NODES){const n=W.nodes.find(x=>x.name===nm);if(!n){console.log('MISSING node',nm);bad++;continue;}const C=find(n.parameters.jsCode);all.push(...C.map(x=>x.g));console.log(nm,'copies',C.length,C.map(x=>x.g.length).join(','));if(C.length!==2)bad++;}
const kinds=[...new Set(all)];console.log('distinct forms',kinds.length);kinds.forEach(k=>console.log('  ',k.length,k===LIST?'(= reference)':'',k));
if(mode==='check'){if(bad||kinds.length!==1){console.log('CHECK FAIL');process.exit(1);}console.log('CHECK OK: 10 copies byte-equal');}
else if(mode==='set'){if(!neu||!/^\(\?:.*\)$/.test(neu))throw new Error('give the new alternation as (?:...)');if(kinds.length!==1)throw new Error('copies differ now; fix by hand first');
 for(const nm of NODES){const n=W.nodes.find(x=>x.name===nm);n.parameters.jsCode=n.parameters.jsCode.split(kinds[0]).join(neu);new Function(n.parameters.jsCode.replace(/\$\(/g,'(()=>({first:()=>({json:{}}),all:()=>[],isExecuted:false}))('));}
 fs.writeFileSync(fout,JSON.stringify(W));console.log('SET: rewrote',all.length,'copies');}
