const H=require('./harness.cjs');
(async()=>{for(const ver of ['127','128','130']){const lib=H.libFor(ver);for(const nn of ['Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){try{const code=H.src(lib,nn);const r=await H.run(code,nn,lib);console.log(ver,nn,JSON.stringify(r).slice(0,300));}catch(e){console.log(ver,nn,'ERR',e.message.slice(0,200));}}}})();
