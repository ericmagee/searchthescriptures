// W3 R9 plant N: sol's judgment has no collision line of the keystone link (its two D6 lines renamed D5), so the confirmed closing line on link 6 takes the
// "no collision line names it; counted as one" branch. ALL against ALL without K2, K3, K4, K5, K6, and live.
const {run,rd,U,cl}=require('./w3_KSR_ECB.cjs');const S=process.argv[2];
const ORDER=Object.keys(rd).map(n=>({n,t:rd[n][0].startTime})).sort((a,b)=>a.t-b.t).map(o=>o.n);const up=ORDER.slice(0,ORDER.indexOf('Panel Cure Check'));
const P=[['D6 vs C5 (John 3:6; 1 John 5:1; Romans 1:3)','D5 vs C5 (John 3:6; 1 John 5:1; Romans 1:3)'],['D6 vs C6 (Luke 2:4; Numbers 1:18)','D5 vs C6 (Luke 2:4; Numbers 1:18)']];
const hook={before:{'Panel Cure Check':async(over,out)=>{for(const n of up){const cur=out(n);if(!cur)continue;let s=JSON.stringify(cur),h=0;for(const [a,b] of P){if(s.includes(a)){h++;s=s.split(a).join(b);}}if(h)over[n]=JSON.parse(s);}}}};
const sum=r=>{const w=r.rows.find(x=>x.judge_seat==='sol');const t=U(w.verdict_raw);const g=((r.over['Gate Record']||r.stored('Gate Record'))[0][0].json.gate.report||[]).filter(x=>x.seat==='sol').flatMap(x=>x.items.map(i=>i.kind+' '+i.src+': '+String(i.why).slice(0,110)));
 const sb=r.over['Send Back Build'][0].filter(x=>x.json.seat==='sol').flatMap(x=>(x.json.items||[]).map(i=>i.rule+' '+i.item));
 return 'sol '+((t.split('\n').map(s=>s.trim()).filter(s=>/^KEYSTONE\b/.test(s))[0]||'none').slice(0,60))+' | tag '+w.verdict_tag+' u'+w.drv_uncured+' | CLAUSE '+((t.match(/\nCLAUSE:[^\n]{0,30}/)||[''])[0].trim())+'\n      send-back items: '+sb.join('; ')+'\n      gate items: '+(g.join(' ## ')||'none');};
(async()=>{for(const [n,f] of [['LIVE','LIVE'],['ALL','ALL']].concat(['K2','K3','K4','K5','K6'].map(k=>['ALL - '+k,S+'/abl_'+k+'.json']))){try{console.log(n+': '+sum(await run(f,Object.assign({flip:1},hook))));}catch(e){console.log(n+': ERROR '+e.message.slice(0,200));}}})();
