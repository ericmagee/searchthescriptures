const {Tournament}=require('@n8n/tournament');const t=new Tournament(e=>{throw e;});
for(const f of process.argv.slice(2)){const W=require(f);let n=0,bad=[];const walk=(o,p,name)=>{if(typeof o==='string'){if(o.startsWith('=')&&o.indexOf('{{')>=0){n++;try{t.getExpressionCode(o.slice(1));}catch(e){bad.push(name+' '+p+': '+String(e.message).slice(0,80));}}}else if(o&&typeof o==='object')for(const k of Object.keys(o))walk(o[k],p+'.'+k,name);};
for(const x of W.nodes)walk(x.parameters,'',x.name);console.log(f.split('/').pop(),'expressions',n,'fail',bad.length);bad.forEach(b=>console.log('  ',b));}
