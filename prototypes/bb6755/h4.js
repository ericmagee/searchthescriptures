const fs=require('fs');const rows=JSON.parse(fs.readFileSync('cr1.json'));
const sl=(s,a,b)=>{const i=s.indexOf(a);const j=s.indexOf(b,i);if(i<0||j<0)throw new Error('anchor '+a);return s.slice(i,j+b.length);};
const fnsEIV=src=>{const cc=sl(src,'const chainCount=','return c;};');const cl=sl(src,'const chain_lines=(()=>{','return out;})();').replace('const chain_lines=','return ').replace(/prev&&prev\.cr1/g,'T');
 return {count:new Function('T',cc+';return chainCount(T);'),lines:new Function('T',cl)};};
const fnPP=src=>{const DM=sl(src,'const DM=',';');const cc=sl(src,'const chain_count=(()=>{','return c;})();').replace('const chain_count=','return ').replace(/F\.cr1/g,'T');return new Function('T',DM+cc);};
const E0=fnsEIV(fs.readFileSync('base/Extract_Independent_Verdict.js','utf8')),E1=fnsEIV(fs.readFileSync('Extract_Independent_Verdict.new.js','utf8'));
const P0=fnPP(fs.readFileSync('base/Panel_Payloads.js','utf8')),P1=fnPP(fs.readFileSync('Panel_Payloads.new.js','utf8'));
let same=0,diff=[],nul=0;
for(const r of rows){const t=r.cr1;const a=[E0.count(t),JSON.stringify(E0.lines(t)),P0(t)],b=[E1.count(t),JSON.stringify(E1.lines(t)),P1(t)];
 if(a[0]===null)nul++;
 if(JSON.stringify(a)===JSON.stringify(b))same++;else diff.push([r.tok,a[0],b[0],a[2],b[2],JSON.parse(b[1]).length]);}
console.log('rows',rows.length,'unchanged',same,'changed',diff.length,'null (headless, base)',nul);diff.forEach(x=>console.log('changed',x));
const H='## DECLARED CHAIN\n';
const syn={'D1 —':'D1 — a\nD2 — b\n','D1 -':'D1 - a\nD2 - b\n','D1 –':'D1 – a\nD2 – b\n','1 —':'1 — a\n2 — b\n','1 -':'1 - a\n2 - b\n','2 Samuel —':'2 Samuel — a\n','1 Chronicles -':'1 Chronicles - a\n'};
for(const [k,v] of Object.entries(syn))console.log('synthetic',JSON.stringify(k),'EIV',E1.count(H+v),'lines',E1.lines(H+v).length,'PP',P1(H+v),'| base EIV',E0.count(H+v));
