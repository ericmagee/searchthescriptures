// pkgVP3 multi-run replay (W4): every saved run with a stored Send Back call; live s89 code vs package code; lists each VP3 note.
const fs=require('fs');const H=require('./harness.cjs');const IN=H.IN;
const P=JSON.parse(fs.readFileSync(__dirname+'/parent_s90_VP3.json','utf8'));const by={};P.nodes.forEach(n=>by[n.name]=n);
let LV=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s90.json','utf8'));LV=LV.data||LV;LV=LV.workflow||LV;const lv={};LV.nodes.forEach(n=>lv[n.name]=n);
const strip=o=>JSON.parse(JSON.stringify(o,(k,v)=>k==='at'?undefined:v));
const runs=[...new Set(fs.readdirSync(IN).filter(f=>/_Send_Back_Call_openrouter\.json$/.test(f)&&!/Alt/.test(f)).map(f=>f.split('_')[0]))].sort();
(async()=>{let tot={runs:0,err:0,eq:0,notes:0,agree:0,would:0};
 for(const run of runs){for(const node of ['Send Back Record','Alt Send Back Record']){const inp=node==='Send Back Record'?'Send Back Call openrouter':'Alt Send Back Call openrouter';if(!fs.existsSync(IN+'/'+run+'_'+inp.replace(/ /g,'_')+'.json'))continue;
  let a,b;try{a=await H.run(lv[node].parameters.jsCode,run,inp);b=await H.run(by[node].parameters.jsCode,run,inp);}catch(e){tot.err++;console.log(run+' '+node+': not replayable ('+String(e.message).slice(0,80)+')');continue;}
  tot.runs++;const ra=a[0].json.sb_rows||[],rb=b[0].json.sb_rows||[];let ok=ra.length===rb.length;
  ra.forEach((r,i)=>{const q=rb[i];for(const k of Object.keys(r)){if(k==='at')continue;if(k==='cure_reason'){if(!(String(q[k])===String(r[k])||(String(q[k]).startsWith(String(r[k]))&&/^ \| TRIAL pkgVP3: /.test(String(q[k]).slice(String(r[k]).length)))))ok=false;}else if(JSON.stringify(r[k])!==JSON.stringify(q[k]))ok=false;}});
  const rest=o=>{const c={...o,sendback:{...(o.sendback||{})}};delete c.sb_rows;delete c.sendback.vp3_trial;return JSON.stringify(strip(c));};if(rest(a[0].json)!==rest(b[0].json))ok=false;if(ok)tot.eq++;
  const v=(b[0].json.sendback||{}).vp3_trial;const ns=rb.filter(r=>/pkgVP3/.test(r.cure_reason));tot.notes+=ns.length;tot.agree+=(v&&v.agree)||0;tot.would+=v?Object.values(v.would_remove).flat().length:0;
  console.log(run+' '+node+': '+(ok?'equal except VP3 notes':'DIFFERS')+' | checked '+(v?v.checked:0)+', agree '+(v?v.agree:0)+', would remove '+JSON.stringify(v?v.would_remove:{}));
  for(const r of ns)if(/TWO READERS AGREE/.test(r.cure_reason))console.log('     '+r.seat+' '+r.rule+' '+String(r.item).slice(0,40)+' |'+r.cure_reason.slice(r.cure_reason.indexOf('TRIAL pkgVP3')).slice(0,330));}}
 console.log('\nTOTAL '+JSON.stringify(tot));process.exit(tot.eq===tot.runs?0:1);})();
