// pkgSJK (W1): Build Save Body gives the single judge's K-W and K-S3 flags a cure key, as pkgRVF did for the export.
// Keys are the same as pkgRVF's. The cure-report reader also reads a report whose ITEM holds a closed bracket pair (K-W "LINK 6 [premise 1] #5"),
// by the NBR-or-old alternation, so every report the live reader read is still read. Only Build Save Body changes.
// Usage: node build.cjs <parent in> <out>  (s133 + pkgNBR rev 2, or s133 alone)
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(n=>n.name==='Build Save Body');let c=N.parameters.jsCode;
const rep=(o,n)=>{if(c.split(o).length!==2)throw new Error('anchor not unique: '+o.slice(0,70));c=c.replace(o,()=>n);};
rep("match(/\\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- [^\\]\\n]*\\]/g)||[]).forEach(x=>{const m=x.match(/ITEM: ([^;\\]]+); RULE: ([^;\\]]+); RESULT: ([A-Z]+)/);if(m&&m[3]==='CURED')__CUR.add(m[2].trim()+'|'+m[1].trim().toUpperCase());});",
    "match(/\\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- (?:[^\\]\\[\\n]|\\[[^\\]\\[\\n]*\\])*\\]|\\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- [^\\]\\n]*\\]/g)||[]).forEach(x=>{const m=x.match(/ITEM: ((?:[^;\\]\\[]|\\[[^\\]\\[]*\\]|\\[)+); RULE: ([^;\\]]+); RESULT: ([A-Z]+)/);if(m&&m[3]==='CURED'){__CUR.add(m[2].trim()+'|'+m[1].trim().toUpperCase());const s=m[2].trim()==='K-S3'&&x.match(/; LINE: ((?:DEFENDER|CHALLENGER) [CD]R\\d): (.+)/);if(s)__CUR.add(__S3K(s[1],s[2]));}});");
rep("const __CUR=new Set();","const __S3K=(sr,s)=>'K-S3|'+sr.toUpperCase()+'|'+String(s).split(/;\\s+(?:a close-round|STATEMENT|JUDGE STATEMENT)\\b/)[0].toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,40);const __CUR=new Set();");
rep("m=x.match(/VIOLATION -- (D\\d+ vs C\\d+) /);if(m)return 'K-B|'+m[1].toUpperCase();return null;};",
    "m=x.match(/VIOLATION -- (D\\d+ vs C\\d+) /);if(m)return 'K-B|'+m[1].toUpperCase();m=x.match(/\\(K-W; ruling \\d+\\) -- (.+? #\\d+): /);if(m)return 'K-W|'+m[1].toUpperCase();m=x.match(/\\(S3; ruling \\d+\\) -- ((?:DEFENDER|CHALLENGER) [CD]R\\d): (.+)/);if(m)return __S3K(m[1],m[2]);return null;};");
N.parameters.jsCode=c;fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
