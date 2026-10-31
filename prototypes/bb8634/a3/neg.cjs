const fs=require('fs');
const ex=fs.readFileSync('e/new/Extract_Independent_Verdict.js','utf8');
const i=ex.indexOf('const seqCount=');const j=ex.indexOf('return c;};',i);
const seqCount=eval('('+ex.slice(i,j+11).replace('const seqCount=','').replace(/;$/,'')+')');
const head=/^\s*#*\s*\**\s*UNSUPPORTED-L4 PREMISES\s*:?\s*\**\s*:?\s*$/i;
const t='intro\nUNSUPPORTED-L4 PREMISES:\n\nLINK 1: a\n\nLINK 2: b\n\nPREMISE COUNT: 2\nLINK 3: stray line after the count\n';
console.log('stray after count ->',seqCount(t,head),'(2 expected)');
const t2='UNSUPPORTED-L4 PREMISES\n1. LINK 6: a\n2. LINK 5: b\n';
console.log('numbered with LINK ->',seqCount(t2,head),'(2 expected)');
