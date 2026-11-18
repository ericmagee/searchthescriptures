// ASK 396 plants: Format Markdown of run 38661's stored inputs, live 386 against t396, with a planted Alternate Merge enforcer_log and Get Row drv_removed.
const fs=require('fs');const E=JSON.parse(fs.readFileSync(__dirname+'/../run/exec_38661.json'));const RD=E.data.resultData.runData;
const out=nm=>{const r=RD[nm];if(!r)return null;const x=r[r.length-1];return (x&&x.data&&x.data.main&&x.data.main[0])||[];};
const src=f=>{let d=JSON.parse(fs.readFileSync(f));if(d.data&&d.data.nodes)d=d.data;return d.nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;};
const S={live386:src(__dirname+'/../rdf/fetchback_w386.json'),t396:src(__dirname+'/t396.json')};
const row=(seat,role,rule,item,st)=>({kind:'send_back',seat,seat_role:role,rule,item,cure_status:st});
const P=[
 ['1 none open (all CURED)',[row('sol','panel','E-PREM','premise listed against the challenger 3','CURED')],null],
 ['2 one seat, one E-PREM',[row('sol','panel','E-PREM','premise listed against the defender 2','UNCURED')],null],
 ['3 two seats, both kinds',[row('sol','panel','E-PREM','premise listed against the challenger 3','UNCURED'),row('sol','panel','E-ANS','ANSWER CHECK Matthew 1:18 [CR4]','UNCURED'),row('chatgpt','panel','E-ANS','ANSWER CHECK Luke 1:34 [DR3]','UNCURED'),row('chatgpt','panel','E-PREM','premise listed against the defender 1','UNCURED')],null],
 ['4 removed seat',[row('haiku','panel','E-PREM','premise listed against the defender 3','UNCURED')],[{seat:'haiku'}]],
 ['5 item CURED on the send-back is not listed',[row('sol','panel','E-ANS','ANSWER CHECK Luke 1:35 [CR4]','CURED'),row('sol','panel','E-PREM','premise listed against the defender 4','UNCURED')],null],
 ['6 alternate seat that took over (W3 8552 B2)',[row('sonnet','alternate','E-ANS','ANSWER CHECK Luke 3:23 [CR4]','UNCURED')],null],
 ['7 other rules and statuses are not listed (E-COL UNCURED, E-PREM not sent)',[row('sol','panel','E-COL','COLLISION D3','UNCURED'),row('haiku','panel','E-PREM','premise listed against the defender 1',null)],null],
 ['8 duplicate row listed once',[row('sol','panel','E-PREM','premise listed against the challenger 2','UNCURED'),row('sol','panel','E-PREM','premise listed against the challenger 2','UNCURED')],null],
 ['9 no enforcer log',undefined,null]];
const mk$=(EL,DR)=>nm=>{let it=out(nm);if(!it)return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)},params:{}};
 if(nm==='Alternate Merge')it=[{json:{...it[0].json,enforcer_log:EL}}];if(nm==='Get Row'&&DR)it=[{json:{...it[0].json,drv_removed:DR}}];
 return {isExecuted:true,first:()=>it[0]||{json:{}},last:()=>it[it.length-1],all:()=>it,item:it[0],params:{}};};
const run=async(code,EL,DR)=>{const inp=out('Get Guards')||[];const $input={all:()=>inp,first:()=>inp[0],last:()=>inp[inp.length-1],item:inp[0]};const cd={};
 const T0=Date;class FD extends T0{constructor(...a){if(a.length)super(...a);else super('2026-11-18T03:00:00.000Z');}static now(){return new T0('2026-11-18T03:00:00.000Z').getTime();}}
 const f=new Function('$','$input','$execution','$workflow','$now','require','Date','return (async()=>{'+code+'\n})();');const r=await f(mk$(EL,DR),$input,{id:'38661',mode:'trigger',customData:{set:(k,v)=>{cd[k]=v},get:k=>cd[k]}},{id:'moMxiV4Irg1uRBZN'},new T0('2026-11-18T03:00:00Z'),require,FD);
 return r[0].json.md;};
(async()=>{const res=[];for(const [nm,EL,DR] of P){const a=await run(S.live386,EL,DR),b=await run(S.t396,EL,DR);
 const line=(b.split('\n').find(l=>l.startsWith('**OPEN ENFORCER DISAGREEMENTS'))||'(no line)');const rest=b.split('\n').filter(l=>!l.startsWith('**OPEN ENFORCER DISAGREEMENTS')).join('\n');
 const b2=b.replace(line+'\n\n','');const same=b2===a;let dif=null;if(!same){let i=0;while(a[i]===b2[i])i++;dif={at:i,live:a.slice(i-80,i+120),t396:b2.slice(i-80,i+120)};}res.push({plant:nm,line,rest_identical_to_live:same,dif});}
 for(const o of res)console.log(JSON.stringify(o));fs.writeFileSync(__dirname+'/plants396_out.json',JSON.stringify(res,null,1));})().catch(e=>console.log('ERR',e.stack));
