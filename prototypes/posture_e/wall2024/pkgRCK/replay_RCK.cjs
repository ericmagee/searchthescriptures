// pkgRCK replay: live s22 code (BASE) against pkgRCK (RCK) on every saved run with Gate Record inputs.
// Gate Record and Alt Gate Record run on their saved inputs; Alternate Merge Seat runs on the Gate Record output of the same code.
const fs=require('fs');const {harness,live,D}=require('../pkgGSL/harness.cjs');const FB='/mnt/project-files/wall2024/fetchback_live_s22.json';
const P=n=>fs.readFileSync(__dirname+'/out/'+n.replace(/[^A-Za-z0-9]+/g,'_')+'.js','utf8');const code=(lab,n)=>lab==='BASE'?live(FB,n):P(n);
const has=(r,n)=>fs.existsSync(D+r+'_'+n.replace(/ /g,'_')+'.json');
const runs=fs.readdirSync(D).filter(f=>/^\d+_Gate_Record\.json$/.test(f)).map(f=>f.split('_')[0]).sort();
const fields=j=>(j&&j.bodies||[]).map(b=>{const p=JSON.parse(b).payload;return p.judge_seat+':'+[p.verdict_tag,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,p.drv_uncured].join('/');}).join(' ');
const hits=j=>(JSON.stringify(j).match(/newly counts [^"]{0,60}/g)||[]).length;
let diffs=0,total=0;
for(const r of runs){const out={};
 for(const lab of ['BASE','RCK']){const o={};try{const gr=harness(r)(code(lab,'Gate Record'),'Gate Call openrouter');o.gr=fields(gr[0].json);o.hits=hits(gr);
   const ams=['Alternate Cure Normalize','Alternate Needed?','Alternate Calls?','Alternate Cure Needed?'].find(n=>has(r,n));
   if(ams){try{const a=harness(r,{'Gate Record':gr})(code(lab,'Alternate Merge Seat'),ams);o.amsj=a;o.ams=fields(a[0].json);}catch(e){o.ams='ERR '+e.message.slice(0,80);}}
   if(has(r,'Alt Gate Call openrouter')){try{const ag=harness(r)(code(lab,'Alt Gate Record'),'Alt Gate Call openrouter');o.ag=fields(ag[0].json);o.hits+=hits(ag);try{const ov={'Alt Gate Record':ag,'Gate Record':gr};if(o.amsj)ov['Alternate Merge Seat']=o.amsj;o.am=fields(harness(r,ov)(code(lab,'Alternate Merge'),'Alt Gate Record')[0].json);}catch(e){o.am='ERR '+e.message.slice(0,80);}}catch(e){o.ag='ERR '+e.message.slice(0,80);}}
  }catch(e){o.err=e.message.slice(0,120);}out[lab]=o;}
 total++;const same=['gr','ams','ag','am'].every(k=>out.BASE[k]===out.RCK[k]);if(!same)diffs++;
 console.log(r+' '+(same?'SAME':'DIFF')+' rck_hits='+(out.RCK.hits||0)+(out.BASE.err||out.RCK.err?' ERR '+(out.BASE.err||out.RCK.err):''));
 if(!same)for(const k of ['gr','ams','ag','am'])if(out.BASE[k]!==out.RCK[k])console.log('   '+k+'\n     BASE '+out.BASE[k]+'\n     RCK  '+out.RCK[k]);}
console.log('runs '+total+', differing '+diffs);
