// pkgOAN probe: harvest the [CR3] presses and check [DR3] for every run whose Panel Build is saved (corpus/raw/gate_<run>.json).
// Run from wall2024/: node pkgOAN/probe_OAN.cjs [verbose]
const fs=require('fs');const OAN=new Function(fs.readFileSync('pkgOAN/src_OAN.js','utf8')+'\nreturn OAN;')();const V=process.argv[2];
const rounds=t=>{const re=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});const o={};at.forEach((x,i)=>{if(o[x.k]==null)o[x.k]=t.slice(x.e,i+1<at.length?at[i+1].s:t.length);});return o;};
for(const f of fs.readdirSync('corpus/raw').filter(f=>/^gate_\d+\.json$/.test(f)).sort()){const run=f.slice(5,10);const G=JSON.parse(fs.readFileSync('corpus/raw/'+f));const pb=(G['Panel Build']||[])[0];const P0=pb&&(pb['0']||pb);if(!P0||!P0.judges){console.log(run+': no Panel Build');continue;}
 const j=P0.judges[0];const t=j.body.messages.map(m=>typeof m.content==='string'?m.content:(m.content||[]).map(c=>c.text||'').join('\n')).join('\n');const R=rounds(t);
 const P=OAN.harvest(R.CR3);const c=OAN.check(R.DR3,P);
 console.log(run+': presses '+P.length+' (premises '+[...new Set(P.map(p=>p.n))].join(',')+'); DR3 link sections '+c.sections+'; ok '+c.ok.length+', missing '+c.missing.length+', unanswered '+c.unanswered.length+', conceded '+c.conceded.length+' -> '+(c.pass?'PASS':'RE-CALL'));
 if(V)for(const p of P)console.log('   '+p.id+' '+p.ref+' -- '+p.means.slice(0,90)+' :: '+(c.ok.includes(p.id)?'ok':c.missing.includes(p.id)?'MISSING':c.unanswered.includes(p.id)?'UNANSWERED':'conceded'));}
