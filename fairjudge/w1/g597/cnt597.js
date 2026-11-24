const fs=require('fs');
function load(p){let j=JSON.parse(fs.readFileSync(p,'utf8'));if(j.data)j=j.data;if(j.workflow)j=j.workflow;if(j.nodes===undefined&&j.activeVersion)j=j.activeVersion;return j;}
function codeOf(n){const p=n.parameters||{};return [p.jsCode,p.code,p.functionCode].filter(Boolean).join('\n')+'\n'+JSON.stringify(p.jsonBody||'')+JSON.stringify(p.bodyParametersJson||'');}
for(const [lab,p] of [['eng',process.argv[2]],['child',process.argv[3]]]){
 const w=load(p);console.log(lab,w.versionId||'',w.nodes.length);
 const L=[400,500,600,700,1500];const strict={},loose={},other={};let libS={},sub=0,subs=[];
 for(const n of w.nodes){const c=codeOf(n);const isLib=c.includes('/*LIB*/');
  for(const m of c.matchAll(/\.slice\(\s*0\s*,\s*(\d+)\s*\)/g)){const N=+m[1];if(L.includes(N)){strict[N]=(strict[N]||0)+1;if(isLib)libS[N]=(libS[N]||0)+1;}else other[N]=(other[N]||0)+1;}
  for(const m of c.matchAll(/(?:slice|substring|substr)\(\s*0\s*,\s*(?:[A-Za-z_$.]+\s*[-+]\s*)?(\d+)/g)){const N=+m[1];if(L.includes(N))loose[N]=(loose[N]||0)+1;}
  for(const m of c.matchAll(/\.(substring|substr)\(\s*0\s*,\s*(\d+)/g)){sub++;subs.push(n.name+':'+m[2]);}
 }
 const tot=o=>Object.values(o).reduce((a,b)=>a+b,0);
 console.log(' strict',JSON.stringify(strict),tot(strict),'lib',JSON.stringify(libS),tot(libS));
 console.log(' loose ',JSON.stringify(loose),tot(loose));
 console.log(' other N',JSON.stringify(other),tot(other));
 console.log(' substring/substr',sub,subs.slice(0,30).join(' | '));
}
