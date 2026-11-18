// ASK 423 build (plan W3 rev 2 at 5a51ae34; W2 C1 C2; W1 8867 note adopted W3 8868): link label rewrite at C2B, D3B, C3B Extract;
// Build Save Body writes the AUDIT v27 LINK LABELS line from the B node's round_fix; Assume Check Build's vp4Block reads the [premise n] tag.
// Usage: node a423b/build.cjs IN OUT BASE_VERSIONID
const fs=require('fs');const acorn=require('../tools/node_modules/acorn');
const [IN,OUT,BASEV]=process.argv.slice(2);let w=JSON.parse(fs.readFileSync(IN));if(w.data&&w.data.nodes)w=w.data;if(w.versionId!==BASEV)throw new Error('base moved: '+w.versionId);
const LBL=fs.readFileSync(__dirname+'/lbl423.js','utf8').trim();const node=n=>{const x=w.nodes.filter(y=>y.name===n);if(x.length!==1)throw new Error('node '+n);return x[0];};
const rep1=(s,a,b,l)=>{if(s.split(a).length!==2)throw new Error(l+': anchor count '+(s.split(a).length-1));return s.replace(a,()=>b);};
const STOP="/CHALLENGER.{0,2}S\\s+UNSUPPORTED-?\\s*\\[?L4\\]?\\s*PREMISES/gi";
for(const [n,cfg] of [['C2B Extract',"{side:'D',stop:null}"],['D3B Extract',"{side:'D',stop:"+STOP+"}"],['C3B Extract',"{side:'C',stop:null}"]]){const p=node(n).parameters;if(p.jsCode.includes('__A423'))throw new Error('already built '+n);
 p.jsCode=LBL+'\nconst __O423=(()=>{\n'+p.jsCode+'\n})();\nreturn __A423(__O423,'+cfg+'); /* ASK 423 */';}
// Build Save Body: read the B node's round_fix when it ran; write the LINK LABELS line
{const p=node('Build Save Body').parameters;
 const A="for(const nd of ['D1','C1','D2','C2','D3','C3','D4','C4']){let fx=null;try{if(__L[nd+' Extract']().isExecuted)fx=__L[nd+' Extract']().first().json.round_fix;}catch(e){fx=null;}if(!fx)continue;";
 const B="for(const nd of ['D1','C1','D2','C2','D3','C3','D4','C4']){let fx=null,bx=false;try{const nb=$(nd+'B Extract');if(nb.isExecuted){bx=true;fx=nb.first().json.round_fix||null;}}catch(e){bx=false;} /* ASK 423: the B node holds the kept round when it ran */if(!bx){try{if(__L[nd+' Extract']().isExecuted)fx=__L[nd+' Extract']().first().json.round_fix;}catch(e){fx=null;}}if(!fx)continue;\n"+
 " if(fx.labels&&((fx.labels.rewritten||[]).length||(fx.labels.left||[]).length)){const rw=(fx.labels.rewritten||[]).map(x=>x.at+': '+x.as_written+' -> '+x.as_kept),lf=(fx.labels.left||[]).map(x=>x.label+' ('+x.reason+')');FF.push('[AUDIT v27: LINK LABELS ('+nd+', ASK 423) -- REWRITTEN: '+(rw.length?rw.join('; '):'none')+'; LEFT AS WRITTEN: '+(lf.length?lf.join('; '):'none')+'.]');}";
 p.jsCode=rep1(p.jsCode,A,B,'Build Save Body loop');}
// Assume Check Build: vp4Block takes the premise's own number and prefers the header tagged [premise n]
{const p=node('Assume Check Build').parameters;
 p.jsCode=rep1(p.jsCode,"const vp4Block=(t,k)=>{t=String(t||'');const H=[...t.matchAll(/^[ \\t>*#_-]*LINK\\s+(\\d+)\\b[^\\n]*/gmi)];const h=H.find(x=>+x[1]===k);",
  "const vp4Block=(t,k,n)=>{t=String(t||'');const H=[...t.matchAll(/^[ \\t>*#_-]*LINK\\s+(\\d+)\\b[^\\n]*/gmi)];const tg=n==null?null:H.find(x=>{const m=x[0].match(/\\[premise\\s+(\\d+)\\]/i);return !!m&&+m[1]===n;});const h=tg||H.find(x=>+x[1]===k); /* ASK 423 part 2: the [premise n] tag first, as blocksOf does */",'vp4Block');
 p.jsCode=rep1(p.jsCode,"vp4Block(p.side==='DEFENDER'?F.cr3:F.dr3,p.link)","vp4Block(p.side==='DEFENDER'?F.cr3:F.dr3,p.link,p.n)",'vp4Block call');}
const P=s=>acorn.parse('(async function(){'+s+'\n})',{ecmaVersion:'latest'});
for(const n of ['C2B Extract','D3B Extract','C3B Extract','Build Save Body','Assume Check Build'])P(node(n).parameters.jsCode);
fs.writeFileSync(OUT,JSON.stringify(w));console.log('built',OUT);
