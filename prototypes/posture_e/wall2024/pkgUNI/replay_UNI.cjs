// pkgUNI replay: the gate's first read (gateItems2024: send-back changes applied, corrected text read again) for every run that has saved
// Panel Cure Check bodies (corpus/raw/nodes_<run>.json.gz) and Send Back items (corpus/raw/gate_<run>.json), main panel, under the base and the package.
// Run from wall2024/: node pkgUNI/replay_UNI.cjs [base=pkgKGW] [pkg=pkgUNI]
const fs=require('fs'),zlib=require('zlib');const rd=f=>fs.readFileSync(f,'utf8');
const [BASE,PKG]=[process.argv[2]||'pkgKGW',process.argv[3]||'pkgUNI'];
const mk=p=>{const S=rd(p+'/patched/Gate_Build.js');return new Function('$','$input',S.slice(0,S.indexOf("const PASS=$input.first().json;"))+'\nreturn {gateItems2024,sbApply2024,ciRounds,gatePromptText2024,drvLinks};')(()=>{throw 0},null);};
const L0=mk(BASE),L1=mk(PKG);
const runs=fs.readdirSync('corpus/raw').filter(f=>/^gate_\d+\.json$/.test(f)).map(f=>f.slice(5,10)).filter(r=>fs.existsSync('corpus/raw/nodes_'+r+'.json.gz')).sort();
const out=[];let nd=0,ns=0;
for(const run of runs){const G=JSON.parse(rd('corpus/raw/gate_'+run+'.json'));const GR=(G['Gate Record']||[])[0];const g=GR&&(GR['0']||GR);const PB=(G['Panel Build']||[])[0];const pb=PB&&(PB['0']||PB);
 const N=JSON.parse(zlib.gunzipSync(fs.readFileSync('corpus/raw/nodes_'+run+'.json.gz')));const P=N.nodes['Panel Cure Check'];if(!P||!g){out.push(run+': no data');continue;}
 const bodies=P[P.length-1][0].bodies||[];const sbi=(g.sb_items||[]).filter(x=>x.rule!=='E-GATE');
 for(const s of bodies){let b;try{b=JSON.parse(s);}catch(e){continue;}const p=b.payload||{};const seat=p.judge_seat;const its=sbi.filter(x=>x.seat===seat);if(!its.length)continue;
  const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
  const j=pb&&(pb.judges||[]).find(q=>q.seat===seat);
  const one=L=>{const PT=j?L.gatePromptText2024(j.body):'';const ctx={R:PT?L.ciRounds(PT):null,DL:PT?L.drvLinks(PT):[],ask:PT.includes('CITATION CHECK')};const R=L.gateItems2024(seat,p.verdict_raw,F,its,ctx);
   const A=R.R1||{};return {n:R.items.length,live:R.items.filter(i=>i.live).length,items:R.items.map(i=>i.gid+' '+i.kind+(i.live?' LIVE':' rec')+' '+String(i.why||'').slice(0,110)),applied:(A.applied||[]).join(','),res:A.result||null,fields:A.fields?JSON.stringify(A.fields):null,trig:(A.trig||[]).filter(t=>/^ADDED/.test(t)),text:A.text||''};};
  const a=one(L0),c=one(L1);ns++;const same=a.n===c.n&&a.applied===c.applied&&a.res===c.res&&a.fields===c.fields&&a.text===c.text;
  if(same){out.push(run+' '+seat+': same (gate items '+a.n+', live '+a.live+')');continue;}nd++;
  out.push(run+' '+seat+': CHANGED');out.push('   base: gate items '+a.n+' (live '+a.live+'), applied ['+a.applied+'], result '+a.res+', fields '+a.fields);out.push('   pkg : gate items '+c.n+' (live '+c.live+'), applied ['+c.applied+'], result '+c.res+', fields '+c.fields);
  for(const t of c.trig)out.push('   + '+t);const ia=new Set(a.items),ic=new Set(c.items);for(const i of a.items)if(!ic.has(i))out.push('   - item '+i);for(const i of c.items)if(!ia.has(i))out.push('   + item '+i);}}
out.push('');out.push('runs '+runs.join(' ')+'; seats with send-back items '+ns+'; changed '+nd);console.log(out.join('\n'));
