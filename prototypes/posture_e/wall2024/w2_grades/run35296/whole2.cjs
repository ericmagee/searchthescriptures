// W2: whole-path check. For each ruling-372 block in rev 6, read the SAME judge's whole verdict text for any VOID ruling on that premise (any form), outside CONCEDED LINKS and the ANSWER CHECK line
const fs=require('fs');const D='/mnt/project-files/wall2024/';
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
(async()=>{const X=JSON.parse(fs.readFileSync(D+'fetchback_live_s146.json','utf8'));const PW=(X.data||X).workflow||(X.data||X);const lib=PW.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
for(const fn of fs.readdirSync(D).filter(x=>x==='ex35296_full.json')){const rd=JSON.parse(fs.readFileSync(D+fn,'utf8')).data.resultData.runData;
 const mk=name=>{const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}};};
 for(const node of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){if(!rd[node])continue;let src=rebuild(PW.nodes.find(n=>n.name===node).parameters.jsCode,lib);
  if(!src.includes('const AG=[];'))throw new Error('hook');src=src.replace('const AG=[];','globalThis.__J=judges;const AG=[];');const inp=mk(rd[node][0].source[0].previousNode);
  const o=await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,{all:()=>inp.all(),first:()=>inp.first(),item:inp.first()});const J=globalThis.__J||[];
  for(const it of o)for(const x of (it.json.ids||[]))if(x.rule==='E-PREM'&&x.r372&&x.r372.length){const n=+x.grade.replace(/\D/g,'');const sd=/defender/.test(x.item)?'DEFENDER':'CHALLENGER';const j=J.find(q=>q.seat===x.seat);const t=j?String(j.t):'';
   globalThis.__T=globalThis.__T||{};globalThis.__T[x.seat]=t;const hits=t.split('\n').filter(l=>/void/i.test(l)&&new RegExp('(?:premises?|P|LINK)\\s*\\**\\s*(?:\\d+\\s*(?:,|and|or|-|–|to)\\s*)*'+n+'\\b','i').test(l)).map(l=>l.trim().slice(0,260));
   console.log(fn.slice(2,7),node.split(' ')[0],x.id,x.seat,sd,'premise',n,'| judge text found',!!j,'| lines naming VOID and this number:',hits.length);hits.forEach(h=>console.log('     ',h));}}}})();
setTimeout(()=>{const t=(globalThis.__T||{}).argon||'';const s=t.split(/(?<=[.;])\s+|\n/).filter(x=>/void/i.test(x));console.log('ARGON VOID SENTENCES',s.length);s.forEach(x=>console.log(' -',x.slice(0,300)));},20000);
