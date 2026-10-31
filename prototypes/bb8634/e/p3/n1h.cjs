const fs=require('fs');
const load=f=>{const s=fs.readFileSync(f,'utf8');const a=s.indexOf('const seqCount=');const b=s.indexOf('const premise_sequence');const a2=s.indexOf('const seqLines=');const b2=s.indexOf('const premise_lines');
 return {seqCount:eval('('+s.slice(a,b).replace('const seqCount=','').replace(/;\s*$/,'')+')'),seqLines:eval('('+s.slice(a2,b2).replace('const seqLines=','').replace(/;\s*$/,'')+')')};};
const H=/^\s*#*\s*\**\s*UNSUPPORTED-L4 PREMISES\s*:?\s*\**\s*:?\s*$/i;
const cases={'LINK in-seq':'UNSUPPORTED-L4 PREMISES:\nLINK 1: a\nLINK 2: b\nPREMISE COUNT: 2\nLINK 3: stray','num in-seq':'UNSUPPORTED-L4 PREMISES:\n1. a\n2. b\nPREMISE COUNT: 2\n3. stray','LINK out-seq':'UNSUPPORTED-L4 PREMISES:\nLINK 1: a\nLINK 2: b\nPREMISE COUNT: 2\nLINK 7: stray','num out-seq':'UNSUPPORTED-L4 PREMISES:\n1. a\n2. b\nPREMISE COUNT: 2\n7. stray','bold PREMISE COUNT':'UNSUPPORTED-L4 PREMISES:\n1. a\n2. b\n**PREMISE COUNT: 2**\n3. stray'};
const rows={'30091':JSON.parse(fs.readFileSync('row_49774304-6140-4ac7-953d-e0577caf83a9.json'))[0],'runB':JSON.parse(fs.readFileSync('row_d1c76ad8-c1da-4790-ad19-9e62d6ea9f5d.json'))[0]};
for(const [v,f] of [['S1','new/Extract_Independent_Verdict.js'],['N1','p3/new/Extract_Independent_Verdict.js']]){const X=load(f);
 for(const [k,t] of Object.entries(cases))console.log(v,k,X.seqCount(t,H),X.seqLines(t,H).length);
 for(const [k,r] of Object.entries(rows))console.log(v,k,'engine_r2',X.seqCount(r.engine_r2,H),X.seqLines(r.engine_r2,H).length);}
