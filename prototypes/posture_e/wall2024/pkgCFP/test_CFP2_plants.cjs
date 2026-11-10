// pkgCFP rev 2 plants P1-P4 on stored run 34108 (labels pkgCFP/labels_CFP2.md, dceab771). Sentences are taken from 34108's own rounds.
process.chdir(__dirname+'/..');const fs=require('fs');const {harness}=require(process.cwd()+'/pkgGSL/harness.cjs');
const code=(f,n)=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;d=d.workflow||d;return d.nodes.find(x=>x.name===n).parameters.jsCode;};
const B=code(process.env.PARENT||'pkgCFP/parent_s105_CFP2.json','Judge Contradiction Build'),REC=code('/mnt/project-files/wall2024/fetchback_live_s105.json','Judge Contradiction Record');
const R='34108';const F=harness(R,{})('return $("Final Output").first().json','Init Seats');
const sents=t=>String(t||'').replace(/[*_`#>]/g,'').split(/\n+|(?<=[.!?])\s+/).map(x=>x.trim()).filter(x=>/^[A-Z]/.test(x)&&!/["“”\[\]]/.test(x)&&x.split(' ').length>=7&&x.split(' ').length<=25&&!/--|:|[A-Z]{4,}/.test(x));
const cr2=sents(F.cr2),cr3=sents(F.cr3),cr4=sents(F.cr4);const strip=x=>x.replace(/[.!?]$/,'');
const ac=(earlier_q,close_q)=>[{json:{acx:{skipped:false,reversed:{D:[{id:'X900',side:'D',verse:'Planted 1:1',answer:'REVERSED',close_q,earlier_q,quotes_ok:true,shown:true}],C:[]}}}}];
const cases=[
 ['P1',ac(strip(cr3[0])+'... '+strip(cr3[3]),cr4[0]),c=>c.earlier_round==='CR3'&&c.earlier_q===[strip(cr3[0]),strip(cr3[3])].sort((a,b)=>b.length-a.length)[0].trim()],
 ['P2',ac(strip(cr2[1])+'... '+strip(cr3[2]),cr4[1]),c=>{const L=[[strip(cr2[1]),'CR2'],[strip(cr3[2]),'CR3']].sort((a,b)=>b[0].length-a[0].length)[0];return c.earlier_round===L[1]&&c.earlier_q===L[0].trim();}],
 ['P3',ac(cr3[1],strip(cr4[0])+'... '+strip(cr4[3])),c=>c.closing_q===[strip(cr4[0]),strip(cr4[3])].sort((a,b)=>b.length-a.length)[0].trim()]];
let ok=0,bad=0;
for(const [id,A,chk] of cases){const b=harness(R,{'Anticheat Record':A})(B,'Panel Payloads');const j=b[0].json;const c=(j.cands||[]).find(x=>/anti-cheat check/.test(x.by));let pass=!!c&&chk(c);let rec='';
 if(c&&id==='P3'){const n=(j.links[c.side]||[])[0];const line='CLOSE-CONTRADICTION: '+c.id+' -- '+c.side+' -- LINK '+n+' -- CONFIRMED -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "'+c.closing_q+'" -- planted.';
  const out=harness(R,{'Anticheat Record':A,'Judge Contradiction Build':b,'Judge Contradiction Call deepseek':[{json:{choices:[{message:{content:line}}]}}]})(REC,'Judge Contradiction Call deepseek');const row=((out[0].json.jcc||{}).rows||[]).find(x=>x.id===c.id)||{};rec=' | Record status '+row.status;pass=pass&&row.status==='CONFIRMED';}
 pass?ok++:bad++;console.log((pass?'OK   ':'FAIL ')+id+' | '+(c?c.earlier_round+' "'+c.earlier_q.slice(0,70)+'" / '+c.closing_round+' "'+c.closing_q.slice(0,70)+'"':'NO CANDIDATE')+rec);}
// P4: a pair a judge also named (take 34108's first judge candidate and plant it as an anti-cheat pair with the same quotes)
const b0=harness(R,{})(B,'Panel Payloads')[0].json;const jc=(b0.cands||[])[0];if(jc){const A=[{json:{acx:{skipped:false,reversed:{[jc.side==='DEFENDER'?'D':'C']:[{id:'X901',side:jc.side[0],verse:'Planted',answer:'REVERSED',close_q:jc.closing_q,earlier_q:jc.earlier_q,quotes_ok:true,shown:true}]}}}}];
 const c=(harness(R,{'Anticheat Record':A})(B,'Panel Payloads')[0].json.cands||[])[0];const pass=/^the judges' CONTRADICTION lines \([^)]*\) and the anti-cheat check \(found by the system; both quotes checked\)$/.test(c&&c.by||'')&&!/\(.*the anti-cheat check.*\) and/.test(c.by);pass?ok++:bad++;console.log((pass?'OK   ':'FAIL ')+'P4 | '+(c&&c.by));}
console.log('plants: '+ok+' OK, '+bad+' FAIL');
