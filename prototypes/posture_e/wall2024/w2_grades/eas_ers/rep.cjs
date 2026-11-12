// W2: replay Alternate Build and Alternate Payloads of run 35296 on live and on the joint
const fs=require('fs');const {ld}=require('./src.cjs');const D='/mnt/project-files/wall2024/';
const rd=JSON.parse(fs.readFileSync(D+'ex35296_full.json','utf8')).data.resultData.runData;
const items=n=>rd[n]?rd[n].slice(-1)[0].data.main.flat().filter(Boolean):[];
async function runNode(W,name,inputItems,over={}){const node=W.nodes.find(n=>n.name===name);const mk=n=>{const it=over[n]||items(n);const nd=W.nodes.find(x=>x.name===n)||{};return {isExecuted:!!(over[n]||rd[n]),first:()=>it[0],last:()=>it[it.length-1],all:()=>it,item:it[0],params:nd.parameters||{}};};
 const $i={all:()=>inputItems,first:()=>inputItems[0],item:inputItems[0]};return await new Function('$','$input','return (async()=>{\n'+node.parameters.jsCode+'\n})();')(mk,$i);}
(async()=>{for(const [lab,f] of [['live','fetchback_live_s146.json'],['joint','parent_s146_JOINT_ESS_ERS.json']]){const W=ld(f);
 const ab=await runNode(W,'Alternate Build',items('Alternate Needed?'));
 console.log('==',lab,'Alternate Build items',ab.length,ab.map(x=>(x.json.alt&&x.json.alt.seat)+'/'+(x.json.alt&&x.json.alt.removed_seat)+' early='+!!x.json.early_all).join(', '));
 const call=items('Alternate Call openrouter');console.log(' stored call outputs',call.length,call.map(x=>x.json.error?'error:'+JSON.stringify(x.json.error).slice(0,40):(x.json.model||'?')).join(', '));
 let inp;if(lab==='live')inp=call;else{const nonEarly=ab.filter(x=>!x.json.early_all);inp=nonEarly.map(x=>{const k=ab.indexOf(x);return call.find(c=>!c.json.error&&String(c.json.model||'').includes((x.json.alt.api_model||'').split('/')[1]||'#'))||call[0];});}
 const po=await runNode(W,'Alternate Payloads',inp,{'Alternate Build':ab});
 for(const it of po){const j=it.json;const arr=j.results||j.alts||[j];for(const r of [].concat(arr))if(r&&r.alt)console.log(' payload',r.alt.seat,'ok',r.ok,'why',String(r.why||'').slice(0,80),'body',r.body?JSON.stringify(r.body).length:0);}
 fs.writeFileSync('payloads_'+lab+'.json',JSON.stringify(po));}})().catch(e=>console.log('ERR',e.stack.slice(0,500)));
