// W2: count PCQ limits on stored items, live s145 preCheckSide
const fs=require('fs');const D='/mnt/project-files/wall2024/';const ld=f=>{const X=JSON.parse(fs.readFileSync(D+f,'utf8'));return (X.data||X).workflow||(X.data||X);};
const W=ld('fetchback_live_s145.json');const c=W.nodes.find(n=>n.name==='Panel Build').parameters.jsCode;
const f=new Function(c.slice(c.indexOf('function preCheckSide'),c.indexOf('function preCheckBlock'))+';return preCheckSide;')();
const findR=v=>{if(v&&typeof v==='object'){if(typeof v.gr2==='string'&&typeof v.cr1==='string')return v;for(const k in v){const r=findR(v[k]);if(r)return r;}}return null;};
let outs=0,tot=0,none=0,cQ=0,cRD=0,cSQ=0;const rows=[];
for(const e of fs.readdirSync(D).filter(x=>/^ex3\d+_full\.json$/.test(x))){const r=findR(JSON.parse(fs.readFileSync(D+e,'utf8')).data.resultData.runData);
 for(const [lst,opp,lab] of [[r.gr2,[r.cr1,r.cr2],'CH'],[r.cr3,[r.gr1,r.gr2],'DF']]){
  const out=f(lst,opp,lab);outs+=out.length;const its=(lst||'').split(/\n(?=\s*\d+\.\s)/).filter(s=>/ASSUMES:/i.test(s));
  for(const it of its){tot++;const aft=it.slice(it.search(/ASSUMES:/i));
   if(/\bQuote:\s*["“]/i.test(aft)){cQ++;rows.push(e.slice(2,7)+' '+lab+' QUOTE: '+aft.slice(0,200));}
   if(/ROWS GIVE:\s*(?:Defender|Challenger)\s*:/i.test(aft)){cRD++;rows.push(e.slice(2,7)+' '+lab+' ROWSGIVE-SIDE: '+aft.slice(0,200));}
   if(/(?:words|said|wrote|states?)\s*:?\s*'[^']{12,}'/i.test(aft)||/(?:Defender|Challenger)(?:'s)?\s*(?:words)?\s*:\s*['‘]/i.test(aft)){cSQ++;rows.push(e.slice(2,7)+' '+lab+' SINGLEQ: '+aft.slice(0,200));}}
  out.forEach((x,i)=>{if(/no verbatim quote found/.test(x)){none++;rows.push(e.slice(2,7)+' '+lab+' NONE-FOUND #'+i+': '+x.slice(0,240));}});}}
console.log("live output lines",outs,"items with ASSUMES (my split)",tot,'| Quote: after ASSUMES',cQ,'| ROWS GIVE: side:',cRD,'| single-quoted after marker',cSQ,'| live output lines with no verbatim quote found',none);rows.forEach(x=>console.log(' ',x));
