// pkgRVF check: does any newly cured flag key also match an UNCURED report row of the same judge? (probe copy of RVF code, not the write file)
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const un=p=>{let j=JSON.parse(fs.readFileSync(p));j=j.data||j;return j.workflow||j};
let B=un(process.argv[2]||'/tmp/claude-0/cmx/rvf.json').nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;
const rep=(o,n)=>{if(B.split(o).length!==2)throw new Error('anchor '+o.slice(0,50));B=B.replace(o,()=>n);};
rep("const curedSet = raw => { const c = new Set(); drvRead('', raw).rows.forEach(o => { if (o.RESULT === 'CURED') {",
    "const UNC = {}; const curedSet = raw => { const c = new Set(); const u = new Set(); UNC.u = u; drvRead('', raw).rows.forEach(o => { if (o.RESULT !== 'CURED') { u.add(String(o.RULE).trim() + '|' + String(o.ITEM).trim().toUpperCase()); const s3u = String(o.RULE).trim() === 'K-S3' && String(o.LINE || '').match(/^((?:DEFENDER|CHALLENGER) [CD]R\\d): (.+)/); if (s3u) u.add(s3Key(s3u[1], s3u[2])); } if (o.RESULT === 'CURED') {");
rep("const cured = k && cs.has(k);","const cured = k && cs.has(k); if (cured && UNC.u.has(k)) x = x.replace('REVIEW THIS ROW', 'REVIEW THIS ROW @@CONFLICT@@');");
const md=o=>{let t=JSON.stringify(o);return JSON.parse(t)[0]&&JSON.parse(t)[0].md!==undefined?JSON.parse(t)[0].md:t.replace(/\\n/g,'\n');};
(async()=>{let tot=0,cf=0;for(const e of fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;if(!rd['Format Markdown'])continue;
 const b=await run(B,'Format Markdown',rd);if(b.err){console.log(e,'ERR',b.err);continue;}
 const L=md(b).split('\n').filter(l=>/^\| Cured flag/.test(l)&&/\((K-W|S3); ruling/.test(l));const C=L.filter(l=>/@@CONFLICT@@/.test(l));tot+=L.length;cf+=C.length;
 console.log(e,'K-W/S3 cured',L.length,'conflict',C.length);C.forEach(l=>console.log('   ',l.slice(0,260)));}
 console.log('TOTAL cured',tot,'conflict',cf);})();
