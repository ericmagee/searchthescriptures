// ASK 383 plants: the old keysOf (live text) against the new (t383 text), both run on the node's own REFP and L2C
const fs=require('fs'),T=require('../tools/lib.cjs');
const src=f=>{const d=JSON.parse(fs.readFileSync(f));return (d.data||d).nodes.find(n=>n.name==='L2 Count Plan').parameters.jsCode;};
const A=src(process.argv[2]),B=src(process.argv[3]);const env=T.load(A,{});const {REFP,L2C}=env;
const BK=/((?:[123] )?(?:Song of Solomon|[A-Z][a-z]+))\.?\s+(\d{1,3}):(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?/g;
const pick=(s,re)=>{const m=s.match(re);if(!m)throw new Error('keysOf not found');return m[0];};
const ko=new Function('REFP','L2C','BK',pick(A,/const keysOf=s=>\{[^\n]*?return \[\.\.\.new Set\(o\)\];\};/)+'return keysOf;')(REFP,L2C,BK);
const kn=new Function('REFP','L2C','BK',pick(B,/const keysOf=s=>\{[^\n]*?return \[\.\.\.new Set\(o\)\];\};/)+'return keysOf;')(REFP,L2C,BK);
const P=[['Matthew 1:18, 20',['Matthew 1:18','Matthew 1:20']],['Matthew 1:18-20, 25',['Matthew 1:18','Matthew 1:19','Matthew 1:20','Matthew 1:25']],
 ['Matthew 1:18, 2:3',['Matthew 1:18','Matthew 2:3']],['Matthew 1:18, and Luke 1:35',['Matthew 1:18','Luke 1:35']],['Matthew 1:18',['Matthew 1:18']],
 ['Matthew 1:1-25',Array.from({length:25},(_,i)=>'Matthew 1:'+(i+1))],['as established in Matthew 1:18, 20 [L1], through gennao (G1080)',['Matthew 1:18','Matthew 1:20']]];
let bad=0;for(const [s,exp] of P){const o=ko(s),n=kn(s);const ok=JSON.stringify(n)===JSON.stringify(exp);if(!ok)bad++;console.log(ok?'OK  ':'FAIL',JSON.stringify(s),'| old',JSON.stringify(o),'| new',JSON.stringify(n));}
const live=s=>L2C.refsIn(s);for(const s of ['Matthew 1:18, 2 witnesses','Luke 1:35, 3 times','Matthew 1:18, 40'])console.log('FINDING (REFP, 8083 a)',JSON.stringify(s),'| new',JSON.stringify(kn(s)),'| live binding',JSON.stringify(live(s)));
console.log('plants',P.length,'| failed',bad);
