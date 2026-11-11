// pkgRCS offline replay: s139 against RCS on stored runs. Panel Tokens (old fields unchanged, call list complete), pricing mirror of the SQL, Plain Rule Lines (old md is an exact prefix).
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');
const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const A=un('/mnt/project-files/wall2024/fetchback_live_s139.json'),B=un('/mnt/project-files/wall2024/parent_s139_RCS.json');
const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
// TEST prices only (Anthropic list rates as published in the API reference cached 2026-11-03); no DeepSeek row, so DeepSeek shows "no price".
const PR={'claude-opus-5-5':[4,0.2,5,8,20],'claude-sonnet-5-5':[2,0.1,2.5,4,10]};
const price=L=>L.map(x=>{let usd=null,src='no price';if(x.b!==undefined){usd=x.b;src='billed';}else if(PR[x.m]){const p=PR[x.m];usd=Math.round(((x.i||0)*p[0]+(x.cr||0)*p[1]+(x.w5||0)*p[2]+(x.w1||0)*p[3]+(x.o||0)*p[4]))/1e6;src='price list';}return {...x,usd,src};});
const names=new Set(fs.readFileSync('names.txt','utf8').trim().split('|'));
(async()=>{const out=[];for(const f of process.argv.slice(2)){const j=JSON.parse(fs.readFileSync(f,'utf8'));const rd=(j.data||j).resultData.runData;const tag=f.split('/').pop().replace('_full.json','');
 if(!rd['Panel Tokens']){out.push(tag+' | Panel Tokens did not run');continue;}
 const o=await run(code(A,'Panel Tokens'),'Panel Tokens',rd),n=await run(code(B,'Panel Tokens'),'Panel Tokens',rd);
 if(o.err||n.err){out.push(tag+' | ERR '+(o.err||n.err));continue;}
 const {calls,...rest}=n[0];const same=JSON.stringify(rest)===JSON.stringify(o[0]);
 // independent count: items in the export's call nodes, distinct ids
 const ids=new Set();let items=0;for(const [nm,runs] of Object.entries(rd)){if(!names.has(nm))continue;for(const r of runs)for(const it of (((r.data||{}).main||[])[0]||[])){const id=it.json&&it.json.id;if(id){if(ids.has(id))continue;ids.add(id);}items++;}}
 const fam={};for(const c of calls){fam[c.f]=(fam[c.f]||0)+1;}
 const P=price(calls);const tot=P.reduce((a,x)=>a+(x.usd||0),0),bill=P.filter(x=>x.src==='billed').reduce((a,x)=>a+x.usd,0),est=P.filter(x=>x.src==='price list').reduce((a,x)=>a+x.usd,0),np=P.filter(x=>x.usd==null).length;
 let prl='Plain Rule Lines did not run';
 if(rd['Plain Rule Lines']){const row=JSON.parse(JSON.stringify(rd['Get Row'][0].data.main[0][0].json));row.call_costs=P;row.run_cost_usd=Math.round(tot*1e6)/1e6;
  const over={'Get Row':[[{json:row}]]};const po=await run(code(A,'Plain Rule Lines'),'Plain Rule Lines',rd),pn=await run(code(B,'Plain Rule Lines'),'Plain Rule Lines',rd,over);
  if(po.err||pn.err)prl='ERR '+(po.err||pn.err);else{const a=po[0].md,b=pn[0].md;prl='old md exact prefix '+(b.startsWith(a))+' | added '+(b.length-a.length)+' chars | other fields equal '+(JSON.stringify({...pn[0],md:0,chars:0})===JSON.stringify({...po[0],md:0,chars:0}));if(tag==='ex35067')fs.writeFileSync('cost_section_35067.md',b.slice(a.length));}}
 out.push(tag+' | old fields equal '+same+' | calls '+calls.length+' (export count '+items+') | '+JSON.stringify(fam)+' | billed $'+bill.toFixed(4)+' | estimate $'+est.toFixed(4)+' | no price '+np+' | total $'+tot.toFixed(4)+' | '+prl);
 if(tag==='ex35067')fs.writeFileSync('calls_35067.json',JSON.stringify(calls));}
 fs.writeFileSync('replay_out.txt',out.join('\n')+'\n');console.log(out.join('\n'));})();
