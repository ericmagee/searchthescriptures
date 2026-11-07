// pkgTRM (Eric 11:06 CST 11-07 approved; W4's efficiency item 2, "the large state object carried through the whole workflow"). Not a DeepSeek fix.
// 33389: Send Back Record's output is 1091K, of which enf428_rows 449K, enf421_rows 94K; Gate Record repeats them and adds sb_rows 151K. These row arrays
// ride along only through "...PASS" copies. Every node that uses them reads them from the node that made them, by name: Alternate Merge Seat reads
// $('Enforcer Record').enf421_rows, $('Judge Enforcer Record').enf428_rows, $('Send Back Record').sb_rows, $('Gate Record').gate_rows; Alternate Merge
// reads the Alt nodes by name; Send Back Build reads enf428_rows from its own input (Judge Enforcer Record's output, unchanged here).
// So the copies are dropped where they are passed on:
//  - Send Back Build / Alt (skip output): enf428_rows, enf421_rows
//  - Send Back Record / Alt (both outputs): enf428_rows, enf421_rows (its own sb_rows stay)
//  - Gate Record / Alt (both outputs): enf428_rows, enf421_rows, sb_rows (its own gate_rows stay)
// Base: pkgL1Q/patched (W3 PASS 2896). Run from wall2024/: node pkgTRM/build_TRM.cjs [--base dir] [--out dir] [--sbr-base dir] [--only 'Name,Name']
// W3 2914 restack: node pkgTRM/build_TRM.cjs --sbr-base pkgDEC/patched --only 'Send Back Record,Alt Send Back Record' --out pkgTRM/patched_on_pkgDEC
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};const BASE=arg('--base','pkgL1Q/patched'),OUT=arg('--out',__dirname+'/patched'),SBRB=arg('--sbr-base',null),ONLY=arg('--only',null);fs.mkdirSync(OUT,{recursive:true});
const lib=keys=>`/* pkgTRM: row arrays the next nodes never read from this output (each reader takes them from the node that made them, by name) are not copied on */
const __trm=o=>{const c={...o};for(const k of ${JSON.stringify(keys)})delete c[k];return c;};
`;
const J=[['Send Back Build',['enf428_rows','enf421_rows'],1],['Alt Send Back Build',['enf428_rows','enf421_rows'],1],
 ['Send Back Record',['enf428_rows','enf421_rows'],2],['Alt Send Back Record',['enf428_rows','enf421_rows'],2],
 ['Gate Record',['enf428_rows','enf421_rows','sb_rows'],2],['Alt Gate Record',['enf428_rows','enf421_rows','sb_rows'],2]];
const plan={source:'W2 pkgTRM (state object trim)',base:BASE,nodes:[]};
for(const [name,keys,n] of J){if(ONLY&&!ONLY.split(',').includes(name))continue;const f=name.replace(/ /g,'_')+'.js';const b=(SBRB&&/Send Back Record$/.test(name))?SBRB:BASE;const s0=fs.readFileSync(b+'/'+f,'utf8');const a='json:{...PASS,';const c=s0.split(a).length-1;if(c!==n)throw new Error(name+' anchor x'+c);
 const s=lib(keys)+s0.split(a).join('json:{...__trm(PASS),');new Function('$','$input','$json','$execution','$workflow','$node','$items',s);fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({name,file:f,base:b,base_sha:sha(s0),final_sha:sha(s),dropped:keys,bytes:[s0.length,s.length]});}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log(plan.nodes.map(n=>n.name+' '+n.base_sha+'->'+n.final_sha).join('\n'));
