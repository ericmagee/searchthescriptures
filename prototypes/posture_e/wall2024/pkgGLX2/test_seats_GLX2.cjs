// pkgGLX2 n8n check: live s54 Init Seats, Resolve Seats, Accept Build on saved inputs, with vs without the glm and glm_flash model rows. Run from wall2024/: node pkgGLX2/test_seats_GLX2.cjs 33482 33490 33497 33506
const fs=require('fs');const {harness}=require(process.cwd()+'/pkgGSL/harness.cjs');const F='/mnt/project-files/wall2024/fetchback_live_s54.json';
const W=JSON.parse(fs.readFileSync(F,'utf8'));const ns=(W.data||W).nodes||(W.data||W).workflow.nodes;const code=n=>ns.find(z=>z.name===n).parameters.jsCode;
const AW=c=>'return (async()=>{'+c+'\n})();';
(async()=>{for(const R of process.argv.slice(2)){const p='/mnt/project-files/wall2024/inputs/'+R+'_';if(!fs.existsSync(p+'Fetch_Models.json')){console.log(R,'no Fetch Models');continue;}
 const rd=n=>{const d=JSON.parse(fs.readFileSync(p+n.replace(/ /g,'_')+'.json','utf8'));return (Array.isArray(d)?d[0]:d).data.main[0];};
 const FM=rd('Fetch Models');const cut=FM.filter(x=>!['glm','glm_flash'].includes(x.json.seat));
 const run=async(ov,n,inp)=>{try{return JSON.stringify(await harness(R,ov)(AW(code(n)),inp)).replace(/ODV1-\d+-[a-z0-9]+/g,"TOK");}catch(e){return 'ERR '+e.message;}};
 for(const [n,inp] of [['Accept Build','Accept Models'],['Init Seats','Accept Final'],['Resolve Seats','Fetch Tensions']]){
  const a=await run({'Fetch Models':FM,'Accept Models':FM},n,inp),b=await run({'Fetch Models':cut,'Accept Models':cut},n,inp);
  console.log(R,n,a===b?'IDENTICAL':'DIFFERS',a.slice(0,90).replace(/\n/g,' '),a===b?'':'| cut: '+b.slice(0,200));}}})();
