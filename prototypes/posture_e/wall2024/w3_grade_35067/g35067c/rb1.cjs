const H=require('./harness.cjs');const fs=require('fs');
(async()=>{
 const rd=H.loadRD();
 for(const ver of ['127','128','129','130']){
  const lib=H.libFor(ver);
  for(const nn of ['Judge Enforcer Build']){
   const code=H.src(lib,nn);
   const r=await H.run(code,nn,lib);
   if(r.err){console.log(ver,nn,'ERR',r.err,r.stack);continue;}
   fs.writeFileSync('rb_'+ver+'_'+nn.replace(/ /g,'_')+'.json',JSON.stringify(r));
   console.log(ver,nn,'items out',r.length,'user sizes',r.map(x=>x.body.messages[1].content.length).join(','),'calls',r[0].calls,'nc',JSON.stringify(r[0].not_checked));
  }
 }
 const st=rd['Judge Enforcer Build'][0].data.main[0].map(x=>x.json);
 console.log('stored user sizes',st.map(x=>x.body.messages[1].content.length).join(','));
})();
