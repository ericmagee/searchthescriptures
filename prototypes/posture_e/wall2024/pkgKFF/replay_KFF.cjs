// pkgKFF replay: every FORCED line found in the saved inputs of each run (inputs/<run>_*.json), checked with kffLines against that run's rounds
// (Panel Build body, cureRounds) and its Cited Verses. Run from wall2024/: node pkgKFF/replay_KFF.cjs [--json]
const fs=require('fs');const D='/mnt/project-files/wall2024/inputs/';const E=require('./env.cjs');
const runs=[...new Set(fs.readdirSync(D).filter(f=>f.endsWith('_Panel_Build.json')).map(f=>f.split('_')[0]))].sort();
const unesc=s=>{let t=s;for(let i=0;i<6&&/\\["n\\]/.test(t);i++)t=t.replace(/\\\\/g,'\u0001').replace(/\\n/g,'\n').replace(/\\"/g,'"').replace(/\u0001/g,'\\');return t;};
const out=[];
for(const run of runs){const pb=JSON.parse(fs.readFileSync(D+run+'_Panel_Build.json','utf8'));const it=(Array.isArray(pb)?pb[0]:pb);const items=(it.data&&it.data.main&&it.data.main[0])||it.items||it;
 const first=JSON.stringify(items).length?items:null;let body=null;const find=o=>{if(!o||typeof o!=='object'||body)return;if(o.judges&&Array.isArray(o.judges)){const j=o.judges.find(q=>q&&q.body);if(j)body=j.body;}for(const k in o)find(o[k]);};find(items);
 if(!body){out.push({run,skip:'no body'});continue;}
 const L0=E.load([]);const R=L0.cureRounds(body);
 const cvf=D+run+'_Cited_Verses.json';let rows=null;if(fs.existsSync(cvf)){const c=JSON.parse(fs.readFileSync(cvf,'utf8'));const x=Array.isArray(c)?c[0]:c;const arr=(x.data&&x.data.main&&x.data.main[0])||(x.main&&x.main[0])||x.items||[];rows=arr.map(i=>i.json||i).filter(r=>r&&r.book);}
 const L=E.load(rows||[]);const lines=new Map();
 for(const f of fs.readdirSync(D).filter(f=>f.startsWith(run+'_'))){const t0=fs.readFileSync(D+f,'utf8');if(!/FORCED[^\n]{0,40}D\d+ vs/.test(t0))continue;const t=unesc(t0);
  for(const raw of t.split('\n')){const l=raw.trim().replace(/[*_`]+/g,'');const i=l.search(/FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*D\d+\s+vs/i);if(i<0)continue;let s=l.slice(i);const g=s.search(/"\s*(?:,|\}|\])/);
   const m=s.match(L.KF_LINE);if(!m)continue;const key=m.slice(1,7).join('|');if(!lines.has(key))lines.set(key,{line:s,file:f});}}
 let n=0;for(const [k,v] of lines){n++;const r=L.kffLines(v.line,R,rows||[]);out.push({run,link:k.split('|')[0],fails:k.split('|')[5].slice(0,140),items:r.items.map(x=>x.why),report:r.report,cited_verses:!!rows});}
 out.push({run,forced_lines:n,cited_verses:!!rows});}
if(require.main===module){if(process.argv.includes('--json'))console.log(JSON.stringify(out,null,1));else{for(const o of out){if(o.forced_lines!==undefined)console.log(o.run,'FORCED lines:',o.forced_lines,'Cited Verses:',o.cited_verses);else if(o.skip)console.log(o.run,o.skip);else if(o.items.length||o.report.length)console.log('  ',o.run,o.link,'|',o.fails,'\n     ',o.items.concat(o.report).join(' || ').slice(0,400));}}
}module.exports=out;
