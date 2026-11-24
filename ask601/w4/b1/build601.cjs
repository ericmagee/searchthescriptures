// ASK 601 build (W4): same-model judge out, Init Seats + Resolve Seats only. Base: live ff7ab4cf fetch-back.
const fs=require('fs');const crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const BASE=process.env.B601||'/mnt/project-files/ask588/w4/fixqr/fetchback_eng_fixqr.json';
const W=JSON.parse(fs.readFileSync(BASE,'utf8'));
const once=(s,a,b,what)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(what+': anchor occurs '+k+' times');return s.replace(a,()=>b);};
const MN="const __MN601=m=>String(m||'').trim().toLowerCase().replace(/^anthropic\\//,'').replace(/\\./g,'-'); /* ASK 601: model match (trim, lower-case, drop anthropic/, . to -) */";
const E={
 'Init Seats':[
  ['const pfree0=free.filter(s=>', MN+"\nconst __AMR601=(()=>{const R={};try{$('Accept Models').all().forEach(i=>{const x=i.json;if(x&&x.seat&&x.api_model)R[x.seat]=String(x.api_model);});}catch(e){}return R;})();const __DM601=[D.mc_seat,C.mc_seat].map(k=>__AMR601[k]).filter(Boolean).map(__MN601);const __SAMEM=s=>{const m=__AMR601[s];return (m&&__DM601.indexOf(__MN601(m))>=0)?m:null;}; /* ASK 601: a judge never runs a debater's model */\nconst pfree0=free.filter(s=>",'I1 defs'],
  ["||__d(s,'family '+FAM_PANEL[s]+' debates in this debate')));", "||__d(s,'family '+FAM_PANEL[s]+' debates in this debate'))&&(!__SAMEM(s)||__d(s,'runs the same model as a debater ('+__SAMEM(s)+')')));",'I2 filter']],
 'Resolve Seats':[
  ["S.panel_order.forEach(k=>{if(!__CC(k)&&debFam.indexOf(famOf(k))>=0)fail(", MN+"\nconst __DM601=[D.model,C.model].map(__MN601);const __SM601=m=>!!m&&__DM601.indexOf(__MN601(m))>=0;\nS.panel_order.forEach(k=>{const x=M[k];if(x&&__SM601(x.api_model))fail('judge seat \"'+k+'\" runs '+x.api_model+', the same model as a debater (ASK 601).');});\nS.panel_order.forEach(k=>{if(!__CC(k)&&debFam.indexOf(famOf(k))>=0)fail(",'R1 guard'],
  ['const reserve=(reserve0&&(', 'const reserve=(reserve0&&!__SM601(reserve0.api_model)&&(','R2 reserve'],
  ['debFam.indexOf(a.family)<0);', 'debFam.indexOf(a.family)<0).filter(a=>!__SM601(a.api_model));','R3 alternates']]};
for(const [nm,eds] of Object.entries(E)){const n=W.nodes.find(x=>x.name===nm);let c=n.parameters.jsCode;const c0=md5(c);for(const [a,b,w] of eds)c=once(c,a,b,nm+' '+w);n.parameters.jsCode=c;console.log(nm,c0.slice(0,8),'->',md5(c).slice(0,8),c.length);}
const out=process.env.T601||__dirname+'/target_engine_601.json';fs.writeFileSync(out,JSON.stringify(W));console.log('target',md5(JSON.stringify(W)).slice(0,8),out);
