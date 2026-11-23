// ASK 542 criterion 4(a) detail (W4): for each item NEW drops in out_first542.txt, the presses of its premise (round 3 PR and the opposing round 2), each press's OLD and NEW exemption result, and every ANSWER CHECK line naming the press reference (tag and grade as unxAcFail reads them).
const fs=require('fs');const {load}=require('/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/rp542/sandbox.cjs');const P='/mnt/project-files/';const B='/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/rp542/';
const rd=f2=>{const RD={};for(const f of f2){const J=JSON.parse(fs.readFileSync(f,'utf8'));const r=J.runData||(J.data&&J.data.resultData||J).runData||J;for(const k of Object.keys(r))RD[k]=r[k];}return RD;};
const outs=(RD,n)=>{const r=RD[n];if(!r)return [];return r.map(x=>(((x.data||{}).main||[[]])[0]||[]).map(y=>y.json));};
const content=j=>{try{const c=j.choices[0].message.content;return typeof c==='string'?c:(Array.isArray(c)?c.map(p=>p.text||'').join(''):'');}catch(e){return null;}};
const O=load(B+'live542_engine.json','Panel Payloads').ctx;
const RUNS={'41418':['ask531/w4/41418/part_panel.json','ask531/w4/41418/part_misc.json']};for(const r of ['41090','41102','41117'])RUNS[r]=[1,2,3,6,7].map(k=>'ask517/w4/'+r+'_part'+k+'.json');
const CASES=[['41090',2,'DEFENDER',3],['41090',3,'DEFENDER',1],['41090',3,'DEFENDER',3],['41102',2,'DEFENDER',6],['41117',2,'DEFENDER',4],['41418',3,'DEFENDER',2],['41418',3,'DEFENDER',3]];
const res=[];
for(const [run,ji,side,pj] of CASES){const RD=rd(RUNS[run].filter(x=>fs.existsSync(P+x)).map(x=>P+x));const j=outs(RD,'Panel Build')[0][0].judges[ji-1];
 const T=O.kkjvText(content(outs(RD,'Panel Judge '+ji+' openrouter')[0][0]));const R=O.ciRounds(O.drvPromptText(j.body));const rk=side==='CHALLENGER'?'DR3':'CR3';
 const PR=O.unxPresses(side==='CHALLENGER'?R.CR3:R.DR3),P2=O.unxPresses(side==='CHALLENGER'?R.CR2:R.DR2);const ps=[...PR,...P2].filter(p=>p.n===pj);
 res.push(run+' '+j.seat+' '+side+' premise '+pj+': presses '+ps.length);
 const seen=new Set();for(const p of ps){if(seen.has(p.ref))continue;seen.add(p.ref);const o=O.unxAcFail(T,p.ref,rk),n=o||O.unxAcFail(T,p.ref,rk.slice(0,2)+'[2-4]');
  const rf=String(p.ref).replace(/\s+/g,'\\s+').replace(/\./g,'\\.');const re=new RegExp('^[\\s>*_-]*ANSWER\\s+CHECK\\s*:?[\\s*_]*'+rf+'(?!\\s*[-–]?\\d)(?![0-9])[\\s*_]*--\\s*\\[?\\s*([^\\]]{0,40})','i');
  const ls=T.split('\n').map(l=>{const m=l.match(re);if(!m)return null;const i=l.search(/--\s*ANSWER\s*:/i);const g=i<0?null:(l.slice(i+2).match(/--\s*\**\s*([A-Z]{3,})\b/)||[])[1];return '['+m[1].trim()+'] '+(g||'(no grade read)');}).filter(Boolean);
  res.push('  press '+p.ref+' | OLD exempt '+o+' | NEW exempt '+n+' | ANSWER CHECK lines: '+(ls.join('; ')||'none'));}}
console.log(res.join('\n'));fs.writeFileSync('/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/rp542/out_detail542.txt',res.join('\n')+'\n');
