// W3 R9: ALL without one pkgKSR patch at a time, whole chain on 34626 and on two plants. Candidate files are built in the scratchpad (not kept).
const {run,rd,U,cl}=require('./w3_KSR_ECB.cjs');const S=process.argv[2];
const sum=r=>r.rows.map(w=>w.judge_seat+' '+((U(w.verdict_raw).split('\n').map(s=>s.trim()).filter(s=>/^KEYSTONE\b/.test(s))[0]||'none').slice(0,28))+' u'+w.drv_uncured).join(' | ')+' || gate: '+JSON.stringify(((r.over['Gate Record']||r.stored('Gate Record'))[0][0].json.gate.seats||[]).map(s=>s.seat+' '+s.items+'/'+s.cured+(s.error?' '+s.error:'')))+' || derived STANDS lines: '+(U(JSON.stringify(r.rows)).match(/STANDS -- derived by the engine/g)||[]).length;
// plant N: the confirmed line names link 6 but no collision line of link 6 exists in sol's judgment (the "no collision line names it" branch)
(async()=>{console.log('ALL        : '+sum(await run('ALL',{flip:1})));for(const k of ['K2','K3','K4','K5','K6']){const r=await run(S+'/abl_'+k+'.json',{flip:1});console.log('ALL - '+k+'   : '+sum(r));}
 console.log('-- without the AGREE assumption on the two stored enforcer replies:');console.log('ALL        : '+sum(await run('ALL')));for(const k of ['K2','K3','K4','K5','K6']){const r=await run(S+'/abl_'+k+'.json');console.log('ALL - '+k+'   : '+sum(r));}
})().catch(e=>console.log('ERROR '+e.stack));
