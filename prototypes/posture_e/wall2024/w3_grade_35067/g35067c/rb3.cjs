const H=require('./harness.cjs');const fs=require('fs');
function node(ver,name){let d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s'+ver+'.json'));d=d.data||d;d=d.workflow||d;return d.nodes.find(n=>n.name===name).parameters.jsCode;}
(async()=>{
 const out={};
 for(const ver of ['129','130']){const r=await H.run(node(ver,'Close Enforcer Build'),'Close Enforcer Build',H.libFor(ver));
  if(r.err){console.log(ver,'ERR',r.err,r.stack);continue;} out[ver]=r; console.log(ver,'items',r.length,'sides',r.map(x=>x.side),'cands',r.map(x=>(x.cands||[]).map(c=>c.id)),'user sizes',r.map(x=>x.body&&x.body.messages[1].content.length));}
 const st=H.loadRD()['Close Enforcer Build'][0].data.main[0].map(x=>x.json);
 console.log('s130 rebuild equals stored:',JSON.stringify(out['130'])===JSON.stringify(st));
 const a=out['129'][0].body.messages[1].content,b=out['130'][0].body.messages[1].content;
 const la=a.split('\n'),lb=b.split('\n');
 console.log('s129 defender prompt lines',la.length,'s130',lb.length,'extra lines in s130:',lb.filter(l=>!la.includes(l)).map(l=>l.slice(0,60)),'lines only in s129:',la.filter(l=>!lb.includes(l)).map(l=>l.slice(0,60)));
 // is s130 prompt equal to s129 prompt with the two X3/X4 lines removed?
 const strip=lb.filter(l=>!/^X[34] -- /.test(l));
 console.log('s130 minus X3/X4 lines equals s129:',strip.join('\n')===a, 'challenger prompt equal:',out['129'][1].body.messages[1].content===out['130'][1].body.messages[1].content);
 fs.writeFileSync('ceb129.json',JSON.stringify(out['129']));
})();
