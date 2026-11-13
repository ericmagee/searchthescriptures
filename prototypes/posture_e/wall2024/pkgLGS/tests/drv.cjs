const fs=require('fs');const {harness}=require('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/pkgGSL/harness.cjs');
const S=process.env.LGS_DIR||(__dirname+'/out/');const U=process.env.LIVE_UN||(__dirname+'/live_un/');const wrap=f=>'return (async()=>{\n'+fs.readFileSync(f,'utf8')+'\n})();';
(async()=>{for(const [run,ps] of [['33627',['keep','cure']],['33644',['keep','mixed_cure']]]){const live=(await harness(run)(wrap(U+'Gate_Record.js'),'Gate Call openrouter'))[0].json;
const d=o=>o.bodies.map(b=>{const p=JSON.parse(b).payload;return p.judge_seat+':'+p.drv_uncured;}).join(' ');console.log(run,'live drv_uncured',d(live));
for(const p of ps)console.log(run,p,'drv_uncured',d(require(S+'out_'+run+'_'+p+'.json')[0].json));}})();
