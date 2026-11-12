// pkgGDC: sol's summary cure entries on run 35296, live s147 against the package
const fs=require('fs');const D='/mnt/project-files/wall2024/';const ld=f=>{const X=JSON.parse(fs.readFileSync(D+f,'utf8'));return X.data&&X.data.nodes?X.data:X;};
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');return new Function('$',stub.slice(0,i)+'\nreturn __S;')(n=>({params:{jsCode:lib}}));};
const rd=JSON.parse(fs.readFileSync(D+'ex35296_full.json','utf8')).data.resultData.runData;
const mk=name=>{const r=rd[name];const it=r?r[r.length-1].data.main.flat().filter(Boolean):[];return {isExecuted:!!r,first:()=>it[0],all:()=>it,last:()=>it[it.length-1],item:it[0],params:{}};};
(async()=>{for(const f of ['fetchback_live_s147.json','parent_s147_GDC.json']){const W=ld(f);const src=rebuild(W.nodes.find(x=>x.name==='Send Back Record').parameters.jsCode,W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode);
 const p=mk(rd['Send Back Record'][0].source[0].previousNode);const o=await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,{all:()=>p.all(),first:()=>p.first(),item:p.first()});
 const s=o[0].json.summary.find(x=>x.seat==='sol');const st={};for(const c of s.cure)st[c.status]=(st[c.status]||0)+1;
 const un=s.cure.filter(c=>/UNCURED/.test(c.status)).map(c=>c.rule+' '+c.link);console.log(f,'sol cure statuses',JSON.stringify(st),'| not cured:',un.join('; ')||'none','| tag',s.verdict_tag);}})();
