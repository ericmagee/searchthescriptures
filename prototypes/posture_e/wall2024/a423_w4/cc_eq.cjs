// W3 8885 condition: the widened bound reader gives the same count as the library's chain_count wherever chain_count is above 0.
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const c=W.nodes.find(n=>n.name==='C2B Extract').parameters.jsCode;const lb=c.slice(0,c.indexOf('\nconst __O423'));
const F=new Function('$',lb+';return {__CC423};')(()=>({first:()=>({json:{}})}));
const {unpack}=require('../tools/lib.cjs');const U=unpack(W);const ln=U.L.find(l=>l.includes('const chain_count=(()=>{const t=F.cr1'));
const body=ln.slice(ln.indexOf('const chain_count=(()=>{')+'const chain_count=(()=>{'.length);const end=body.indexOf('})();');
const DM=(s)=>String(s||'').replace(/[‐-―−]/g,'-');const LIBCC=new Function('F','DM',body.slice(0,end));
const R=JSON.parse(fs.readFileSync(process.argv[3]));let pos=0,eq=0,diff=[],zero=0,zeroNow=[];
for(const [run,t] of R){const a=LIBCC({cr1:t},DM),b=F.__CC423(t);if(a>0){pos++;if(a===b)eq++;else diff.push([run,a,b]);}else{zero++;if(b)zeroNow.push([run,a,b]);}}
console.log('runs with DECLARED CHAIN',R.length,'| chain_count > 0:',pos,'equal',eq,'differ',diff.length,JSON.stringify(diff.slice(0,10)));
console.log('chain_count 0 or null:',zero,'| widened reads a chain in',zeroNow.length,JSON.stringify(zeroNow.slice(0,40)));
