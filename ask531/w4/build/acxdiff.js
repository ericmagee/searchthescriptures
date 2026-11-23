const fs=require('fs');const P=process.argv[2];const W=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
const RD={};for(const f of ['part_sb','part_er','part_misc','part_panel','part_ac'])Object.assign(RD,JSON.parse(fs.readFileSync(P+'/'+f+'.json','utf8')).data.resultData.runData);
const rec=n=>RD[n]?RD[n][0].data.main[0]:null;
const $=n=>{const it=rec(n);return {isExecuted:!!it,all:()=>it||[],first:()=>{if(!it)throw new Error('no '+n);return it[0];}};};
const inp=rec(RD['Assume Check Record'][0].source[0].previousNode);
(async()=>{const r=await new Function('$','$input','return (async()=>{\n'+W.nodes.find(n=>n.name==='Assume Check Record').parameters.jsCode+'\n})();')($,{all:()=>inp,first:()=>inp[0]});
 const a=rec('Assume Check Record')[0].json.acx,b=r[0].json.acx;console.log(JSON.stringify(a).length,JSON.stringify(b).length);
 for(const k of Object.keys(b))if(JSON.stringify(a[k])!==JSON.stringify(b[k]))console.log('key',k,JSON.stringify(a[k]).slice(0,600),'\n---\n',JSON.stringify(b[k]).slice(0,600));})();
