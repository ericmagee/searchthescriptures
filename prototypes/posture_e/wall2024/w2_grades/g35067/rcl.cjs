const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)return stub;const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};const eff=(W,n)=>rebuild(W.nodes.find(x=>x.name===n).parameters.jsCode,W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode);
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json')).data.resultData.runData;const n='Close Enforcer Build';
(async()=>{const a=await run(eff(g('/mnt/project-files/wall2024/fetchback_live_s129.json'),n),n,rd),b=await run(eff(g('/mnt/project-files/wall2024/fetchback_live_s130.json'),n),n,rd);
const live=rd[n][0].data.main[0].map(i=>i.json);const strip=o=>JSON.stringify(o).replace(/"at":"[^"]*"/g,'');
console.log('err',a.err,b.err,'s129==s130 replay',strip(a)===strip(b),'s130 replay==live',strip(b)===strip(live));
{const x=strip(a),y=strip(b);let p=0;while(x[p]===y[p])p++;console.log("DIFF at",p,x.length,y.length,"\nA:",x.slice(p-300,p+500),"\nB:",y.slice(p-300,p+900));}
for(const j of live)console.log(j.side,'skip',j.cec_skip,'links',JSON.stringify(j.links).slice(0,300),'\ncands',JSON.stringify(j.cands).slice(0,400),'missing',JSON.stringify(j.missing_rounds));
const u=live.map(j=>j.body?j.body.messages.map(m=>m.content).join('\n'):'').join('\n');console.log('RECLAIM in body',/RECLAIM/i.test(u));
const all=JSON.stringify(rd);const m=[...all.matchAll(/[^.\\]{0,140}(as declared|chain stands|links stand|stands as|as stated)[^.\\]{0,140}/gi)].map(x=>x[0]);console.log('phrases',[...new Set(m)].slice(0,8));
})();
