const {run,store,SRC}=require('./k.cjs');const S=JSON.stringify;
const kc=g=>g.summary.map(s=>s.seat+': flags '+s.flags+', K-C '+(s.drv||[]).filter(x=>x.rule==='K-C').map(x=>x.link).join(',')+' drv '+(s.drv||[]).length).join(' | ');
module.exports={kc};
if(require.main===module)(async()=>{const src=SRC.LIVE('Panel Payloads');console.log((src.match(/\$\('[^']+'\)/g)||[]).filter((v,i,a)=>a.indexOf(v)===i).join(' '));
 const a=(await run('LIVE','Panel Payloads','Reserve Needed?',store()))[0],b=(await run('A','Panel Payloads','Reserve Needed?',store()))[0];
 console.log('LIVE',kc(a));console.log('A   ',kc(b));
 const st=require('./k.cjs').base['Panel Payloads'][0][0].json;console.log('live replay equals stored:',S(a.summary)===S(st.summary));
 for(let i=0;i<a.summary.length;i++){const x=a.summary[i],y=b.summary[i];const dx=(x.drv||[]).filter(q=>!(y.drv||[]).some(r=>S(r)===S(q))),dy=(y.drv||[]).filter(q=>!(x.drv||[]).some(r=>S(r)===S(q)));console.log(x.seat,'only live:',dx.map(q=>q.rule+' '+q.link).join(';')||'-','| only A:',dy.map(q=>q.rule+' '+q.link).join(';')||'-','| body equal',S(a.bodies[i])===S(b.bodies[i]));}})();
