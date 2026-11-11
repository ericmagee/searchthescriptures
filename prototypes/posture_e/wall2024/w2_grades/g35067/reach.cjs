const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)return stub;const $=n=>({params:{jsCode:lib}});try{return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);}catch(e){return stub;}};
const g=v=>{let d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s'+v+'.json'));d=d.data||d;return d.workflow||d;};
const effAll=W=>{const L=(W.nodes.find(x=>x.name==='Shared Library')||{parameters:{}}).parameters.jsCode;const o={};for(const n of W.nodes)if(n.parameters&&typeof n.parameters.jsCode==='string'&&n.name!=='Shared Library')o[n.name]=rebuild(n.parameters.jsCode,L);return o;};
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json')).data.resultData.runData;
const strip=o=>JSON.stringify(o).replace(/"at":"[^"]*"/g,'');
const P=[['KSL2',104,105],['RLF',107,108],['RLF2',108,109],['ACM',109,110],['GUB2+GCP1b',111,112],['K7C2',112,113],['J4(OON2,GK1,KCQ,KWQ)',114,115],['J3(CCM,BRF4,CMS)',115,116],['RTE3+PLT',117,118]];
(async()=>{for(const [p,a,b] of P){const A=effAll(g(a)),B=effAll(g(b));const ch=Object.keys(B).filter(n=>A[n]!==B[n]);const res=[];
 for(const n of ch){if(!rd[n]){res.push(n+': NOT RUN');continue;}if(!A[n]){res.push(n+': new node');continue;}const x=await run(A[n],n,rd),y=await run(B[n],n,rd);
  if(x&&x.err||y&&y.err){res.push(n+': ERR '+((x.err||'')+' | '+(y.err||'')).slice(0,120));continue;}res.push(n+': '+(strip(x)===strip(y)?'equal':'DIFFER'));}
 console.log(p,'changed',ch.length,'\n  '+res.join('\n  '));}})();
