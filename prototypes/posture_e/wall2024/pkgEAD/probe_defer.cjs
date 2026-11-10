// W1 study: on every stored run with a Send Back call, run live s112 Send Back Record and list each E-ANS / E-HOLD DeepSeek item with the pkgVP3 code reading.
const fs=require('fs');const H=require('../pkgVP3/harness.cjs');const IN=H.IN;
const src=fs.readFileSync(__dirname+'/../pkgLIB/strip_S112L/patched/Send_Back_Record.js','utf8');
const runs=[...new Set(fs.readdirSync(IN).filter(f=>/_Send_Back_Call_openrouter\.json$/.test(f)&&!/Alt/.test(f)).map(f=>f.split('_')[0]))].sort();
(async()=>{const T={runs:0,err:0,items:0,notAgree:0,notAgreeDefer:0,agree:0,notChecked:0,noNote:0};const rows=[];
 for(const run of runs){let a;try{a=await H.run(src,run,'Send Back Call openrouter');}catch(e){T.err++;console.log(run,'not replayable',String(e.message).slice(0,80));continue;}T.runs++;
  for(const r of (a[0].json.sb_rows||[])){if(!['E-ANS','E-HOLD'].includes(r.rule))continue;const cr=String(r.cure_reason||'');if(!/\(right: (MISSES|BROKEN)\)/.test(cr))continue;T.items++;
   const m=cr.match(/TRIAL pkgVP3: (.*)$/);const note=m?m[1]:'';const enf=(cr.match(/ENFORCER: (.*?)\(judge wrote/)||[])[1]||'';
   const resp=String(r.response_line||'');const ans=(resp.match(/\|\| (CHANGE TO|KEEP)/)||[])[1]||'NONE';const toMiss=/CHANGE TO:.*-- (MISSES|FAILS)\b|CHANGE TO:.*DEFENDER LINK BROKEN|CHANGE TO:.*CHALLENGER LINK BROKEN|CHANGE TO:\s*FORCED/.test(resp);
   const defer=/\b(under|at|in|see)\s+LINK\s*\d|answer(ed)?\s+(it\s+)?(fully|below|above)|pointer|defers?\b|redirect|points elsewhere/i.test(enf);
   let k='noNote';if(/does not agree/.test(note))k='notAgree';else if(/TWO READERS AGREE/.test(note))k='agree';else if(/NOT CHECKED/.test(note))k='notChecked';T[k]++;if(k==='notAgree'&&defer)T.notAgreeDefer++;
   rows.push({run,seat:r.seat,rule:r.rule,item:String(r.item).slice(0,50),k,defer,ans,applied_to_broken:toMiss,cure:r.cure_status,note:note.slice(0,200),enf:enf.slice(0,200)});}}
 for(const x of rows)if(x.k==='notAgree'||x.defer)console.log([x.run,x.seat,x.rule,x.item,x.k,'defer='+x.defer,x.ans,'judgeMoved='+x.applied_to_broken,'cure='+x.cure].join(' | ')+'\n    VP3: '+x.note+'\n    DS: '+x.enf);
 console.log('\nTOTAL',JSON.stringify(T));fs.writeFileSync(__dirname+'/probe_defer_rows.json',JSON.stringify(rows,null,1));})();
