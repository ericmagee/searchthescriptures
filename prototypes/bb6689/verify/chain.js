const fs=require('fs');const runs=JSON.parse(fs.readFileSync('../f1v/runs.json'));
const get=(f,start,end)=>{const s=fs.readFileSync(f,'utf8');const i=s.indexOf(start);return s.slice(i,s.indexOf(end,i));};
const mk=f=>new Function(get(f,'const chainCount','\nconst chain_count=')+';return chainCount;')();
const mkP=f=>{const body=get(f,'const chain_count=(()=>{','})();');return t=>new Function('F','DM',body.replace('const chain_count=(()=>{','')+'')({cr1:t},x=>x.replace(/[‐-―−]/g,'-'));};
const O=mk('Extract_Independent_Verdict.old.js'),N=mk('Extract_Independent_Verdict.new.js'),PO=mkP('Panel_Payloads.old.js'),PN=mkP('Panel_Payloads.new.js');
let same=0;
for(const r of runs){const a=O(r.cr1),b=N(r.cr1),pa=PO(r.cr1),pb=PN(r.cr1);
 if(a!==pa||b!==pb)console.log('EXTRACT/PANEL DISAGREE',r.tok,a,pa,b,pb);
 if(a===b)same++;else console.log(r.tok,a,'->',b);}
console.log('same',same,'of',runs.length);
const T={'D1..D6':'## DECLARED CHAIN\nD1. a\nD2. b\nD3. c\nD4. d\nD5. e\nD6. f','plain':'DECLARED CHAIN:\n1. a\n2. b','none':'1. a\n2. b','prose':'DECLARED CHAIN\nI hold this.','gap':'DECLARED CHAIN\nD1. a\nD3. c','DNA':'DECLARED CHAIN\nDNA1. x\n1. a','trail':'## DECLARED CHAIN -- the links your case stands on:\n1. a\n2. b\n3. c','sentence':'The DECLARED CHAIN is below.\n1. a','bold':'**DECLARED CHAIN**\n**D1.** a\n**D2.** b','lowerd':'DECLARED CHAIN\nd1. a\nd2. b','emdash':'DECLARED CHAIN — my links\n1. a'};
for(const [k,t] of Object.entries(T))console.log(k,'old',O(t),'new',N(t),'panelNew',PN(t));
