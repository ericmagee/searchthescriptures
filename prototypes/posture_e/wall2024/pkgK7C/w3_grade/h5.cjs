const {cmp,srcs,out}=require('./h.cjs');const tags={};let items=0;
for(const s of Object.keys(srcs)){let r;try{r=cmp('stored '+process.env.EX.replace(/.*\//,'')+' '+s,srcs[s])}catch(e){console.log('ERR',s,e.message.slice(0,100));continue}items+=r.a.v.length;r.d.forEach(x=>{const k=x.split(' ')[0];tags[k]=(tags[k]||0)+1})}
for(const n of ['Alternate Cure Normalize 2','R2 Alt Cure Normalize'])if(out(n))console.log('note: also has',n);
console.log('TOTAL items',items,'changed by rule',JSON.stringify(tags));
