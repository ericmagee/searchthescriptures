const {run,store,base}=require('../../pkgGK1/w3_grade/k.cjs');const S=JSON.stringify;const C=process.env.W3_W||'A2';
(async()=>{
 const gb=await run(C,'Gate Build','Reread Record',store());const lu=gb.find(x=>x.seat==='luna');
 const old=base['Gate Build'].flat().filter(Boolean).map(x=>x.json).find(x=>x.seat==='luna').items;
 const c0=base['Gate Call openrouter'][0][0].json.choices[0].message.content;const lines=c0.split('\n');
 const rep=lu.items.map(n=>{const o=old.find(z=>z.key===n.key).gid;return lines.find(l=>new RegExp('^\\s*GATE: '+o+' \\|\\|').test(l)).replace('GATE: '+o+' ||','GATE: '+n.gid+' ||');}).join('\n');
 const st=store({'Gate Call openrouter':o=>{o[0][0].json.choices[0].message.content=rep;},'Gate Build':o=>{o.length=0;o.push(gb.map(j=>({json:j})));}});
 const b=(await run(C,'Gate Record','Gate Call openrouter',st))[0];let bd=b.bodies.find(x=>S(x).includes('gpt-6-luna'));if(typeof bd==='string')bd=JSON.parse(bd);let p=bd.payload;if(typeof p==='string')p=JSON.parse(p);
 const ls=String(p.verdict_raw).split('\n').slice(1);const heads={};ls.forEach(l=>{const h=(l.match(/^\[AUDIT (v\d+): ([^-;]{0,48})/)||[0,'?',l.slice(0,30)]);const k=h[1]+': '+h[2].trim();heads[k]=(heads[k]||0)+1;});console.log(Object.entries(heads).map(([k,v])=>v+' '+k).join('\n'));
 const m=ls.filter(l=>/E-OOR|OUT-OF-ROUND|E-APPLY/.test(l));console.log('lines naming E-OOR, OUT-OF-ROUND or E-APPLY:',m.length);m.slice(0,3).forEach(l=>console.log('  ',l.slice(0,330)));
 console.log('sendback field for luna in Send Back Record:',S((base['Send Back Record'][0][0].json.sendback||{})).slice(0,300));
 console.log('lu.F',S(lu.F).slice(0,200),'| Gate Build keys',Object.keys(lu).join(','));console.log('lu.body type',typeof lu.body,Array.isArray(lu.body)?lu.body.length:'' ,S(lu.body).slice(0,300));
})();
