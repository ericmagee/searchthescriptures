const fs=require('fs'),path=require('path');
const A=process.argv.slice(2),opt={};for(let i=0;i<A.length;i++){if(A[i].startsWith('--')){opt[A[i].slice(2)]=A[i+1]&&!A[i+1].startsWith('--')?A[++i]:true;}}
const use='usage: node gate.cjs --base LIVE.json --cand TARGET.json --expect-base <versionId> [--rows debates.json] [--only REGEX] [--spec SPEC.json --rows ROWS.json]';
if(!opt.base||!opt.cand||!opt['expect-base']){console.error(use);process.exit(2);}
const rd=f=>{let w=JSON.parse(fs.readFileSync(f));return w.workflow||w.data||w;};const B=rd(opt.base),C=rd(opt.cand);
if(B.versionId!==opt['expect-base']){console.error('REFUSE: base is '+B.versionId+', not the expected live '+opt['expect-base']);process.exit(3);}
const key=n=>JSON.stringify([n.type,n.typeVersion,n.parameters]);const bm=new Map(B.nodes.map(n=>[n.name,key(n)])),cm=new Map(C.nodes.map(n=>[n.name,key(n)]));
const changed=[...new Set([...bm.keys(),...cm.keys()])].filter(k=>bm.get(k)!==cm.get(k)).sort();
const conn=JSON.stringify(B.connections)===JSON.stringify(C.connections);
console.log('BASE',B.versionId,'CAND',C.versionId||'(target)','CHANGED',JSON.stringify(changed),'CONNECTIONS',conn?'equal':'differ');
const acorn=require('acorn');const cmts=(c,k)=>{if(k==='Shared Library'){const i=c.indexOf('/*LIB*/');return (i<0?c:c.slice(0,i)).split('\n').filter(l=>/^\s*\/\//.test(l));}const o=[];acorn.parse('(async function(){'+c+'\n})',{ecmaVersion:'latest',onComment:(b,t)=>o.push(t)});return o;};
const bn=new Map(B.nodes.map(n=>[n.name,n])),cn=new Map(C.nodes.map(n=>[n.name,n]));const cbad=[];
for(const k of changed){const x=cn.get(k);if(!x||typeof (x.parameters||{}).jsCode!=='string')continue;const y=bn.get(k),yc=y&&typeof (y.parameters||{}).jsCode==='string'?y.parameters.jsCode:'';
 let a,b;try{a=cmts(yc,k).length;b=cmts(x.parameters.jsCode,k).length;}catch(e){cbad.push(k+' (cannot parse: '+e.message+')');continue;}
 if(b>a)cbad.push(k+' ('+a+' -> '+b+' comments)');}
if(cbad.length){console.log('COMMENT IN A CHANGED CODE NODE (engine manual s15, ASK 469): '+cbad.join('; '));process.exit(6);}
console.log('COMMENTS: no changed Code node gains a comment');
if(!changed.length){console.log('NOTHING TO REPLAY');process.exit(0);}
const {replay,save,net}=require(path.join(__dirname,'..','a430_w1','chain430.cjs'));
const CHAIN=['Citation Scan','Cited Verses','Quote Compare','Find Words','L2 Words Plan','L2 Words','L2 Lexicon Plan','L2 Lexicon','L2 Gloss Plan','L2 Gloss Any','L2 Gloss Read','L2 Gloss Pages Plan','L2 Gloss Pages Any','L2 Gloss Pages Read','L2 Count Plan'];
const inChain=changed.filter(n=>CHAIN.includes(n)),outChain=changed.filter(n=>!CHAIN.includes(n));
if(outChain.length&&!opt.spec){console.log('NOT COVERED by the chain replay: '+JSON.stringify(outChain)+'. Rerun with --spec SPEC.json --rows ROWS.json (a418_w4/replay418.cjs form).');}
if(opt.spec){const cp=require('child_process');const r=cp.spawnSync('node',[path.join(__dirname,'..','a418_w4','replay418.cjs'),'--base',opt.base,'--cand',opt.cand,'--spec',opt.spec,'--rows',opt.rows||'rows.json'],{stdio:'inherit'});if(r.status)process.exit(r.status);}
if(!inChain.length)process.exit(outChain.length&&!opt.spec?4:0);
const D=JSON.parse(fs.readFileSync(opt.rows&&!opt.spec?opt.rows:'debates.json')).filter(r=>!opt.only||new RegExp(opt.only).test(r.run_token));
const t={runs:0,errors:0,changed:0};const out=[],err=[];
for(const r of D){let x,y;try{x=replay(B,r);y=replay(C,r);}catch(e){t.errors++;err.push(r.run_token+' ERROR '+e.message);continue;}t.runs++;let ch=false;
 for(const n of CHAIN){const a=JSON.stringify(x[n]||null),b=JSON.stringify(y[n]||null);if(a!==b){ch=true;out.push('=== '+r.run_token+' | '+n+'\nOLD '+a+'\nNEW '+b);}}
 if(ch)t.changed++;}
save();
console.log('RUNS '+t.runs+' ERRORS '+t.errors+' CHANGED '+t.changed+' NET_READS '+net());for(const e of err)console.log(e);for(const o of out)console.log(o);
process.exit(t.errors?5:(outChain.length&&!opt.spec?4:0));
