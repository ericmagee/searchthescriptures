// pkgEKR limits on live s143 code: E-RES asked though a defender closing contradiction is confirmed (no "contradict" in reason);
// E-KEY asked on a confirmed link whose grade is not BROKEN.
const fs=require('fs');const [,,exF]=process.argv;const rd=JSON.parse(fs.readFileSync(exF,'utf8')).data.resultData.runData;
const mk=n=>{const r=rd[n];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}};};
(async()=>{for(const node of ['Judge Enforcer Build','Alt Judge Enforcer Build']){if(!rd[node])continue;let src=fs.readFileSync('w2_grades/ekr_live/pkgEKR/src/'+node.replace(/ /g,'_')+'.new.js','utf8');
 src=src.replace('const __ekK=g=>','globalThis.__CC=__cc;globalThis.__KG=KG;const __ekK=g=>');const r=rd[node];const inp=mk(r[0].source[0].previousNode);
 const out=await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,{all:()=>inp.all(),first:()=>inp.first(),item:inp.first()});
 const cc=[...(globalThis.__CC||[])];const ids=out.flatMap(i=>i.json.ids||[]);const def=cc.some(k=>k.startsWith('DEFENDER '));
 const res=ids.filter(x=>x.rule==='E-RES');const key=ids.filter(x=>x.rule==='E-KEY');
 console.log(exF.slice(-16,-10),node,'| cc',JSON.stringify(cc),'| E-RES asked',res.length,'| E-KEY asked',key.length);
 if(def)for(const x of res)console.log('   E-RES ASKED with defender cc:',x.seat,String(x.flagged_line).slice(0,230));
 for(const x of key){const m=String(x.flagged_line).match(/KEYSTONE:\s*([DC])(\d+)\s*--\s*([A-Z]+)/);if(m&&cc.includes((m[1]==='D'?'DEFENDER ':'CHALLENGER ')+(+m[2])))console.log('   E-KEY ASKED on confirmed link:',x.seat,String(x.flagged_line).slice(0,160));}}})();
