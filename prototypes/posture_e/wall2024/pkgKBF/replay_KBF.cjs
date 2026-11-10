// pkgKBF replay: every stored run with a stored send-back call, the 3 Send Back Record nodes, pkgKBN (parent_s100_KBN.json) against pkgKBN + pkgKBF. Lists every row that differs.
process.chdir(__dirname+'/..');const fs=require('fs');const H=require('../pkgVP3/harness.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const LV=g(__dirname+'/../pkgKBN/parent_s100_KBN.json'),PK=g(__dirname+'/../pkgKBF/parent_s100_KBN_KBF.json');const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;
const strip=o=>JSON.stringify(o,(k,v)=>k==='at'?undefined:v);
const P=[['Send Back Record','Send Back Call openrouter'],['Alt Send Back Record','Alt Send Back Call openrouter'],['R2 Alt Send Back Record','R2 Alt Send Back Call openrouter']];
(async()=>{let t={runs:0,err:0,eq:0,diff:0,keep:0};const runs=[...new Set(fs.readdirSync(H.IN).filter(f=>/Send_Back_Call_openrouter\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
 for(const run of runs)for(const [node,inp] of P){if(!fs.existsSync(H.IN+'/'+run+'_'+inp.replace(/ /g,'_')+'.json'))continue;let a,b;try{a=await H.run(code(LV,node),run,inp);b=await H.run(code(PK,node),run,inp);}catch(e){t.err++;continue;}t.runs++;
  const ra=(a[0].json.sb_rows||[]),rb=(b[0].json.sb_rows||[]);t.keep+=ra.filter(r=>r.rule==='E-ANS'&&/^SEND-BACK KEEP/.test(String(r.cure_reason))).length;
  if(strip(a)===strip(b)){t.eq++;continue;}t.diff++;ra.forEach((r,i)=>{if(strip(r)!==strip(rb[i]))console.log('DIFF '+run+' '+node+' '+r.seat+' '+r.rule+' '+r.item+'\n   live '+r.cure_status+' | KBG '+rb[i].cure_status+'\n   reply: '+String(r.response_line).slice(0,400)+'\n   flagged: '+String(r.flagged_line).slice(0,300)+'\n   KBG: '+String(rb[i].cure_reason).slice(String(rb[i].cure_reason).indexOf('CURE (')).slice(0,250));});}
 console.log('\n'+JSON.stringify(t)+' (keep = E-ANS KEEP rows on live)');})();
