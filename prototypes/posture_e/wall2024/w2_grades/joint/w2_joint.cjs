// W2: data links into my nodes in the joint candidate. (1) upstream of QR Check / QR Final: rebuilt sources equal s110?
// (2) chain replay of 34626 (Panel Cure Check to Replay Rows): Gate Record, Alternate Merge 1, Second Alternate?, Alternate Merge, Replay Rows
// for s110, F3A2s ALL alone, GFS alone, and the joint file.
const fs=require('fs');const chain=require('../fix34626/w2_chain.cjs');const {rebuild}=require('../../pkgLIB/unpack.cjs');
const L=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const F={s110:'/mnt/project-files/wall2024/fetchback_live_s110.json',F3A:'pkgF3A/parent_s110_F3A2s_ALL.json',GFS:'/mnt/project-files/wall2024/parent_s110_GFS.json',JOINT:'/mnt/project-files/wall2024/joint_GFS_QRD_F3A2s_plus_KSR_ECB_rev3.json'};
const srcOf=(w,n)=>{const by={};w.nodes.forEach(x=>by[x.name]=x);const c=by[n].parameters.jsCode||'';return /^\/\/ pkgLIB stub/.test(c)&&c.indexOf('\nconst __e4h')<0?rebuild(c,by['Shared Library'].parameters.jsCode):c;};
const nt=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');
(async()=>{const S=L(F.s110),J=L(F.JOINT);
 const up=['Init Seats','Regrade Load','QR Ask Build','Regrade Row','Resolve Seats'];for(const n of up){try{console.log('upstream',n,'source equal to s110:',srcOf(S,n)===srcOf(J,n));}catch(e){console.log('upstream',n,'n/a',e.message);}}
 const R={};for(const [k,f] of Object.entries(F)){const c=await chain(f);if(c.err){console.log(k,'ERR',c.err);continue;}R[k]=c;}
 const pick=(c,n)=>((c.over[n]||[[]])[0]||[]).map(x=>x.json);
 for(const n of ['Gate Record','Alternate Merge 1','Second Alternate?','Alternate Merge']){console.log('== '+n);for(const k of Object.keys(R)){const o=pick(R[k],n);const a=o[0]||{};
   const s=n==='Gate Record'?JSON.stringify((a.gate||{}).seats)+' alt_needed '+a.alt_needed:n==='Second Alternate?'?JSON.stringify(a.a2r||null).slice(0,260):n==='Alternate Merge'?JSON.stringify(a.alternate_round2||null).slice(0,260):'items '+o.length;
   console.log('   '+k.padEnd(6)+' '+s+'  equal to F3A alone: '+(nt(o)===nt(pick(R.F3A,n))));}}
 const R2=c=>pick(c,'Replay Rows').flatMap(x=>x.body?JSON.parse(x.body).p_rows:[x]);
 for(const k of Object.keys(R))console.log('rows '+k.padEnd(6)+' '+R2(R[k]).map(r=>r.judge_seat+':'+r.verdict_tag+'/drv'+r.drv_uncured).join(' '));})();
