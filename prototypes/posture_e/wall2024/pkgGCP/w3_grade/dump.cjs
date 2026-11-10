const chain=require('../../pkgKSR/w3_grade/chain.cjs');const {remap,gremap}=require('../../pkgKSR/w3_grade/w3_KSR_ECB.cjs');const W=process.argv[2];
(async()=>{const r=await chain(W,{after:{'Send Back Call openrouter':remap('Send Back Call openrouter','Send Back Build'),'Gate Call openrouter':gremap}});
 const SB=r.over['Send Back Record'][0][0].json;console.log('SBR keys',Object.keys(SB).join(','));
 for(const x of SB.sb_items.filter(x=>x.seat==='luna')){const o={};for(const k in x){o[k]=typeof x[k]==='string'?x[k].slice(0,130):x[k];}console.log(JSON.stringify(o).slice(0,900));}
 const GR=r.over['Gate Record'][0][0].json;console.log('GR keys',Object.keys(GR).join(','));const GB=r.over['Gate Build'][0];console.log('GB',JSON.stringify(GB.map(x=>({seat:x.json.seat,skip:x.json.gate_skip,items:(x.json.items||[]).map(i=>({gid:i.gid,kind:i.kind,why:String(i.why).slice(0,80),to:String(i.to||'').slice(0,60)}))}))).slice(0,1500));
 const p=JSON.parse(SB.bodies.find(b=>JSON.parse(b).payload.judge_seat==='luna')).payload;const t=p.verdict_raw;console.log('raw len',t.length,'first newline at',t.indexOf('\n'));console.log(t.slice(0,300));const i=t.indexOf('D5 vs C4 (Isaiah');console.log(JSON.stringify(t.slice(i-200,i+500)));
 console.log((t.match(/\n\[AUDIT[^\n]{0,140}/g)||[]).slice(0,40).join(''));
})().catch(e=>{console.error(e);process.exit(1)});
