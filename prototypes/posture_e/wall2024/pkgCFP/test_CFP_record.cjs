// pkgCFP L5 (W1): Judge Contradiction Record (live s105, unchanged) confirms a planted CONFIRMED answer to each anti-cheat candidate by code.
process.chdir(__dirname+'/..');const fs=require('fs');const {harness}=require(process.cwd()+'/pkgGSL/harness.cjs');
const code=(f,n)=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;d=d.workflow||d;return d.nodes.find(x=>x.name===n).parameters.jsCode;};
const B=code((process.env.PARENT||'pkgCFP/parent_s105_CFP.json'),'Judge Contradiction Build'),R=code('/mnt/project-files/wall2024/fetchback_live_s105.json','Judge Contradiction Record');
let ok=0,bad=0;
for(const r of ['33222','33261','33299','33345','33371','33644','33705','33846']){const b=harness(r,{})(B,'Panel Payloads');const j=b[0].json;const ac=(j.cands||[]).filter(c=>/anti-cheat check/.test(c.by));
 for(const c of ac){const n=(j.links[c.side]||[])[0];const line='CLOSE-CONTRADICTION: '+c.id+' -- '+c.side+' -- LINK '+n+' -- CONFIRMED -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "'+c.closing_q+'" -- planted.';
  const call=[{json:{choices:[{message:{content:line}}]}}];let out;try{out=harness(r,{'Judge Contradiction Build':b,'Judge Contradiction Call deepseek':call})(R,'Judge Contradiction Call deepseek');}catch(e){out=[{json:{err:e.message}}];}
  const jc=out[0].json.jcc||{};const row=(jc.rows||[]).find(x=>x.id===c.id)||{};const conf=(jc.confirmed||[]).some(x=>x.id===c.id||x.cand===c.id);
  const pass=n!=null&&(row.status==='CONFIRMED'||conf);pass?ok++:bad++;
  console.log((pass?'OK   ':'FAIL ')+r+' '+c.id+' '+c.side+' LINK '+n+' | status '+row.status+' confirmed list '+conf+' | '+JSON.stringify(row).slice(0,120)+(out[0].json.err?' ERR '+out[0].json.err:''));}}
console.log('L5: '+ok+' OK, '+bad+' FAIL');
