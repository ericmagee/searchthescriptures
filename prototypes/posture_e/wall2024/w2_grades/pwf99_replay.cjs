// W2 grade of pkgPWF (ASK 258): replay the 99 stored pkgABS-cured E-ANS rows through parent and target ABS.cure.
// usage: node pwf99_replay.cjs <parent s191 json> <target json>
const fs=require('fs');const {load}=require(__dirname+'/../pkgABR/mods.cjs');const [,,P,T]=process.argv;
const wf=f=>{const r=JSON.parse(fs.readFileSync(f,'utf8'));const W=(r.data||r).workflow||(r.data||r);return W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;};
const O=load(wf(P),'Send Back Record'),N=load(wf(T),'Send Back Record');const ctx={rows:require('./pwf99_kjv.json'),ow:[],lex:[]};
const RX=/SENDBACK\s*:?\s*(?:ITEM\s*)?#?\s*(S\s*\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i;
const unc=[];let oldBad=0;for(const r of require('./pwf99_rows.json')){const m=String(r.rl).match(RX);const a={ans:/^KEEP$/i.test(m[2].trim())?'KEEP':'CHANGE',to:(m[3]||'').trim(),why:m[4]||''};const it={rule:'E-ANS',item:r.item};
 if(O.ABS.cure(it,a,ctx).status!=='CURED')oldBad++;if(N.ABS.cure(it,a,ctx).status==='UNCURED')unc.push(r.id);}
console.log('parent not CURED:',oldBad,'| target UNCURED:',unc.length,unc.join(','));
