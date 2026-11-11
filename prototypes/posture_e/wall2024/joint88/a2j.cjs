const fs=require('fs');const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const ld=f=>{const D=JSON.parse(fs.readFileSync(f,'utf8'));return (D.data||D).workflow||(D.data||D);};
const src=(W,n)=>rebuild(W.nodes.find(x=>x.name===n).parameters.jsCode,W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode);
const O=ld('/mnt/project-files/wall2024/fetchback_live_s142.json'),Nw=ld('/mnt/project-files/wall2024/parent_s142_JOINT_EKR_SGR_AMG.json');
const tot={flipUC:0,flipCU:0,other:0,err:0,runs:0};
(async()=>{for(const fn of fs.readdirSync('/mnt/project-files/wall2024/').filter(x=>/^ex3\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+fn,'utf8')).data.resultData.runData;
 const mk=name=>{const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const node=(O.nodes.find(n=>n.name===name)||{});return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:node.parameters||{}};};
 for(const node of ['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record']){const r=rd[node];if(!r)continue;tot.runs++;const sN=r[0].source&&r[0].source[0]&&r[0].source[0].previousNode;const inp=mk(sN);const $input={all:()=>inp.all(),first:()=>inp.first(),item:inp.first()};
  const go=async s=>await new Function('$','$input','return (async()=>{\n'+s+'\n})();')(mk,$input);let a,b;try{a=await go(src(O,node));b=await go(src(Nw,node));}catch(e){tot.err++;console.log(fn,node,'ERR',e.message.slice(0,100));continue;}
  const rows=x=>{const out=[];const w=v=>{if(Array.isArray(v))v.forEach(w);else if(v&&typeof v==='object'){if(v.kind&&v.rule&&'cure_status' in v)out.push(v);Object.values(v).forEach(w);}};w(x.map(i=>i.json));return out;};
  const ra=rows(a),rb=rows(b);if(ra.length!==rb.length){console.log(fn,node,'row count differs',ra.length,rb.length);tot.other++;}
  ra.forEach((x,i)=>{const y=rb[i];if(!y)return;if(x.cure_status!==y.cure_status){if(x.cure_status==='UNCURED'&&y.cure_status==='CURED'&&/pkgAMG/.test(y.cure_reason))tot.flipUC++;else{tot.flipCU++;console.log(fn,'UNEXPECTED',x.cure_status,'->',y.cure_status);}}else if(JSON.stringify(x)!==JSON.stringify(y)&&!/pkgAMG/.test(y.cure_reason||'')){const dx=Object.keys(x).filter(k=>k!=='at'&&JSON.stringify(x[k])!==JSON.stringify(y[k]));if(dx.length){tot.other++;console.log(fn,'diff keys',dx);}}});
  const per=rb.filter(y=>/pkgAMG/.test(y.cure_reason||'')).length;if(per)console.log(fn,node,'CURED by pkgAMG',per);}}
 console.log(tot);})();
