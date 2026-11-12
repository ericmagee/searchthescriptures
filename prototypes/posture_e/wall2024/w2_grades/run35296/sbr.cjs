// W2: replay Send Back Record of run 35296 on live s146; optional plant on sol's dash replies (counterfactual for the pkgGDS split)
const fs=require('fs');const D='/mnt/project-files/wall2024/';
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
(async()=>{const PW=JSON.parse(fs.readFileSync(D+'fetchback_live_s146.json','utf8'));const lib=PW.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 let raw=fs.readFileSync(D+'ex35296_full.json','utf8');let planted=0;
 if(process.argv[2]==='plant'){for(const s of ['S2','S8','S9','S10']){const a='SENDBACK: '+s+' -- CHANGE TO: ANSWER CHECK';const n=raw.split(a).length-1;planted+=n;raw=raw.split(a).join('SENDBACK: '+s+' || CHANGE TO: ANSWER CHECK');}}
 const rd=JSON.parse(raw).data.resultData.runData;
 const mk=name=>{const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const node=(PW.nodes.find(n=>n.name===name)||{});return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:node.parameters||{}};};
 const node='Send Back Record';const src=rebuild(PW.nodes.find(n=>n.name===node).parameters.jsCode,lib);const inp=mk(rd[node][0].source[0].previousNode);const $i={all:()=>inp.all(),first:()=>inp.first(),item:inp.first()};
 const o=await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,$i);const j=o[0].json;
 console.log('planted',planted);const S=j.summary.find(s=>s.seat==='sol');console.log('sol drv',JSON.stringify(S.drv).slice(0,300));
 for(const c of S.cure)if(c.status!=='CURED')console.log(' sol not cured:',c.rule,c.status,String(c.why).slice(0,160));
 for(const r of j.sb_rows)if(r.seat==='sol'&&r.rule==='E-ANS')console.log(' row',r.item,r.cure_status,String(r.cure_reason).slice(-120));
 const stored=JSON.parse(fs.readFileSync(D+'ex35296_full.json','utf8')).data.resultData.runData[node].slice(-1)[0].data.main.flat()[0].json;
 if(process.argv[2]!=='plant')console.log('replay equals stored (summary, sb_rows):',JSON.stringify(j.summary)===JSON.stringify(stored.summary),JSON.stringify(j.sb_rows.map(r=>[r.item,r.cure_status,r.cure_reason]))===JSON.stringify(stored.sb_rows.map(r=>[r.item,r.cure_status,r.cure_reason])));
})().catch(e=>console.log('ERR',e.message));
