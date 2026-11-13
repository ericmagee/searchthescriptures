// W1 pkgOWR replay: run D4 Build and C4 Build, base vs new, on each stored run; the only change must be the YOUR OWN RECORD block.
// usage: node replay.cjs <base json> <new json>
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');
const B=L(process.argv[2]),N=L(process.argv[3]);
const usr=o=>{try{const c=o[0].json?o[0].json.call:o[0].call;const b=c.body||c;const m=b.messages||[];return m.filter(x=>x.role==='user').map(x=>typeof x.content==='string'?x.content:(Array.isArray(x.content)?x.content.map(p=>p.text||JSON.stringify(p)).join(''):JSON.stringify(x.content))).join('\n');}catch(e){return 'ERR '+JSON.stringify(o).slice(0,200);}};
(async()=>{let tot={D4:0,C4:0},n=0,bad=0;
for(const f of fs.readdirSync('/mnt/project-files/wall2024').filter(f=>/^ex\d+_full\.json$/.test(f))){let d;try{d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f));}catch(e){continue;}const rd=d.data.resultData.runData;
 for(const nm of ['D4 Build','C4 Build']){if(!rd[nm])continue;const ob=await run(B.code(nm),nm,rd),on=await run(N.code(nm),nm,rd);
  if(ob.err||on.err){console.log(f,nm,'ERR',ob.err||'',on.err||'');bad++;continue;}
  const ub=usr(ob),un=usr(on);const i=un.indexOf('YOUR OWN RECORD');let same,add=un.length-ub.length;
  if(i<0)same=ub===un;else{const j=un.indexOf('\n\nCLOSE ROUND',i);same=un.split(un.slice(i-2,j)).join('')===ub;if(!same){let k=0;while(k<ub.length&&ub[k]===un[k])k++;console.log('   diff at',k,JSON.stringify(ub.slice(k-60,k+60)),'|',JSON.stringify(un.slice(k-60,k+60)));}}
  const sb=JSON.stringify(ob).length,sn=JSON.stringify(on).length;
  console.log(f.slice(2,7),nm,'block',i>=0?'yes':'no','+'+add,'rest equal',same,'other fields equal',JSON.stringify({...ob[0],call:0})===JSON.stringify({...on[0],call:0}));if(!same)bad++;tot[nm.slice(0,2)]+=add;n++;}}
console.log('requests',n,'added D4',tot.D4,'C4',tot.C4,'bad',bad);})();
