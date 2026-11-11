const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};const eff=(W,n)=>rebuild(W.nodes.find(x=>x.name===n).parameters.jsCode,W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode);
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json')).data.resultData.runData;
const n='Judge Enforcer Build';
(async()=>{const a=await run(eff(g('/mnt/project-files/wall2024/fetchback_live_s128.json'),n),n,rd);
const live=rd[n][0].data.main[0].map(i=>i.json);
const len=o=>o.reduce((s,j)=>s+j.body.messages.reduce((t,m)=>t+m.content.length,0),0);
console.log('check chars s128',len(a),'s130 live',len(live),'diff',len(live)-len(a),'calls',a.length,live.length);
const txt=live.map(j=>j.body.messages[1].content).join('\n');
const parts=txt.split(/(?=\n\nITEM [A-Z]+[0-9]+ \()/).slice(1);
let n0=0,bad=[],linkLab=[],maxLen=0;
for(const p of parts){const id=p.match(/ITEM ([A-Z]+[0-9]+) \(([A-Z-]+)(?:; the answering side wrote this in \[([A-Z]+\d)\])?/);if(!id||id[2]!=='E-ANS')continue;
 const m=p.match(/THE SIDE'S OTHER LINES ON THIS VERSE[^:]*: "([\s\S]*?)"\nTHE JUDGES' GRADES:/);
 const ans=(p.match(/\nTHE ANSWER(?: IN FULL[^:]*)?: "([\s\S]*?)"\n/g)||[]).join(' ');
 const ptr=[...ans.matchAll(/\bunder\s+link\s+(\d+)\b|\(\s*link\s+(\d+)\s*\)/gi)].map(x=>x[1]||x[2]);
 if(!m){if(ptr.length)bad.push(id[1]+' pointer '+ptr+' but no section');continue;}
 n0++;const s=m[1];maxLen=Math.max(maxLen,s.length);
 if(/PRESSED WITH|-- MEANS:/.test(s))bad.push(id[1]+' press list in section');
 const side=id[3][0];const tags=[...s.matchAll(/\[([CD]R\d)(?:, LINK (\d+))?\]/g)];
 for(const t of tags){if(t[1][0]!==side)bad.push(id[1]+' other side tag '+t[0]+' (answer in '+id[3]+')');if(t[2]){linkLab.push(id[1]+' '+t[0]+' ptr='+ptr);if(!ptr.includes(t[2]))bad.push(id[1]+' link '+t[2]+' not in pointers '+ptr);}}
}
console.log('E-ANS items with section',n0,'max section length',maxLen);console.log('LINK labels',linkLab);console.log('BAD',bad);
})();
