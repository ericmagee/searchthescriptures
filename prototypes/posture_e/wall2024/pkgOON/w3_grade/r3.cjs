const {run,store,base,SRC}=require('../../pkgGK1/w3_grade/k.cjs');const S=JSON.stringify;
const OLD=' (\\"the verbatim sentence in which the ground was granted\\")',NEW='; quote it verbatim, or CHANGE TO: STRUCK';const OLD2=OLD.replace(/\\"/g,'\\\\\\"');
const T=s=>s.replace(/"at":"[^"]+"/g,'"at":0');
const swapAll=()=>{const o={};for(const n in base){if(!base[n])continue;const s=S(base[n]);if(s.includes('ground was granted')){const t=s.split(OLD).join(NEW).split(OLD2).join(NEW);try{o[n]=JSON.parse(t);}catch(e){console.log('parse fail',n);}}}return o;};
(async()=>{const sw=swapAll();console.log('stored nodes carrying the old words:',Object.keys(sw).length);const st=Object.assign({},base,sw);
 for(const [node,inp] of [['Send Back Build','Judge Enforcer Record'],['Gate Build','Reread Record']]){const a=await run('LIVE',node,inp,store()),b=await run('OON2',node,inp,st),c=await run('OON',node,inp,store());
  const sa=T(S(a)),sb=T(S(b)),sc=T(S(c));const back=sb.split(NEW).join(OLD);const back2=sb.split(NEW).join(OLD2);
  console.log(node,'| new words in rev 2 output:',sb.split(NEW).length-1,'| rev 2 (new reasons upstream) equals', node==='Gate Build'?'rev 1':'live','after reversal:',node==='Gate Build'?(back===sc||back2===sc):(back===sa||back2===sa), node==='Gate Build'?'| luna items '+b[0].items.length:'');
  if(node==='Send Back Build'){const m=b.find(x=>x.seat==='luna').msg;const k=m.indexOf('quote it verbatim');console.log('  luna prompt sample:',m.slice(Math.max(0,k-230),k+110).replace(/\n/g,' / '));console.log('  luna prompt length live',a.find(x=>x.seat==='luna').msg.length,'rev 2',m.length);}}})();
