// pkgRVF (W1): Issue A (outside review Wall 4812; W1 Wall 4840, W2 Wall 4843). Format Markdown's result table shows a review flag as "Cured flag"
// only when flagKey keys it to a CURED report. flagKey had no key for the K-W (WITHDRAWAL TO ANSWER) and K-S3 (CLOSE-ROUND CONCESSION NOT MARKED COUNTED)
// flags, so every one printed as "Review flag". Now: K-W keys on its item ("DEFENDER CR2 no link heading #1"); K-S3 keys on side, round and the quoted
// sentence (the flag carries no #N), and curedSet adds the same sentence key from the report's LINE. Format Markdown only (display; feeds Save to Drive).
// Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(n=>n.name==='Format Markdown');let c=N.parameters.jsCode;
const rep=(o,n)=>{if(c.split(o).length!==2)throw new Error('anchor not unique: '+o.slice(0,60));c=c.replace(o,()=>n);};
// a shared sentence key: side and round, then the sentence's first 40 letters and digits, lower case
rep("const flagKey = x => {","const s3Key = (sr, s) => 'K-S3|' + sr.toUpperCase() + '|' + String(s).split(/;\\s+(?:a close-round|STATEMENT|JUDGE STATEMENT)\\b/)[0].toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40); /* pkgRVF */ const flagKey = x => {");
rep("m = x.match(/VIOLATION -- (D\\d+ vs C\\d+) /); if (m) return 'K-B|' + m[1].toUpperCase(); return null; };",
    "m = x.match(/VIOLATION -- (D\\d+ vs C\\d+) /); if (m) return 'K-B|' + m[1].toUpperCase(); m = x.match(/\\(K-W; ruling \\d+\\) -- (.+? #\\d+): /); if (m) return 'K-W|' + m[1].toUpperCase(); m = x.match(/\\(S3; ruling \\d+\\) -- ((?:DEFENDER|CHALLENGER) [CD]R\\d): (.+)/); if (m) return s3Key(m[1], m[2]); return null; }; /* pkgRVF */");
rep("if (o.RESULT === 'CURED') c.add(String(o.RULE).trim() + '|' + String(o.ITEM).trim().toUpperCase()); });",
    "if (o.RESULT === 'CURED') { c.add(String(o.RULE).trim() + '|' + String(o.ITEM).trim().toUpperCase()); const s3 = String(o.RULE).trim() === 'K-S3' && String(o.LINE || '').match(/^((?:DEFENDER|CHALLENGER) [CD]R\\d): (.+)/); if (s3) c.add(s3Key(s3[1], s3[2])); } }); /* pkgRVF */");
N.parameters.jsCode=c;fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
