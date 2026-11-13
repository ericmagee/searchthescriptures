const fs=require('fs');const {harness}=require('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/pkgGSL/harness.cjs');
const S=process.env.LGS_DIR||(__dirname+'/out/');const U=process.env.LIVE_UN||(__dirname+'/live_un/');const wrap=f=>'return (async()=>{\n'+fs.readFileSync(f,'utf8')+'\n})();';
const jfl=r=>['cure','send_back'].includes(r.kind)&&r.cure_status==='UNCURED'&&['panel','reserve','alternate'].includes(r.seat_role)&&/^ODV1-\d+-/.test(r.run_token||'')&&!/(record-only|\bTRIAL\b|removes no seat|not counted)/i.test(r.cure_reason||'');
(async()=>{for(const run of ['33627','33644']){const live=(await harness(run)(wrap(U+'Gate_Record.js'),'Gate Call openrouter'))[0].json;
 const show=(n,j)=>{const c=j.gate_rows.filter(jfl);console.log(run,n,'jfl counted',c.length,'| seats',JSON.stringify(j.gate.seats.map(s=>[s.seat,s.uncured_counted])),'\n   ',c.map(r=>r.seat+' '+r.item).join(' ; '));};
 show('live',live);for(const p of ['cure','keep','empty','half','cure_ud','mixed_cure']){const f=S+'out_'+run+'_'+p+'.json';if(fs.existsSync(f))show(p,require(f)[0].json);}}})();
