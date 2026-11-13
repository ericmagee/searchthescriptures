// Extracts the whole S-E block of Build Save Body as fn(d) -> [S-E lines]
const fs=require('fs');
module.exports=f=>{const W=JSON.parse(fs.readFileSync(f));const s=W.nodes.find(n=>n.name==='Build Save Body').parameters.jsCode;
 const a=s.indexOf('{const STOPW=');const b=s.indexOf("\n SL.forEach(l=>{if(/\\bguards?",a);if(a<0||b<0)throw new Error('anchor');
 const body=s.slice(a,b);
 return new Function('d','const SY=String(d.synthesis||"");const SL=SY.split("\\n");const QF=s=>String(s||"").toLowerCase().replace(/[“”"’‘\'*_`]/g,"").replace(/[^a-z0-9:\\s]/g," ").replace(/\\s+/g," ").trim();const cut=s=>String(s).replace(/\\s+/g," ").trim().slice(0,200).replace(/[\\[\\]]/g,"");const SX=[];'+body+'\nreturn SX.filter(x=>x.startsWith("(S-E)"));');};
