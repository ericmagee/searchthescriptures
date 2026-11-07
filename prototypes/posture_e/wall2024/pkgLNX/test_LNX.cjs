// pkgLNX node test. Run from wall2024/: node pkgLNX/test_LNX.cjs   (reads the repo only)
//  A. The 33175 single verdict (fixture_single_echo.json, debate_results 954d416d): base reads no RESULT, no CLAUSE, n/w/k from prose;
//     patched reads RESULT DEFENDER WINS, CLAUSE HELD-1, n=6 w=0 k=0 from the CLAUSE line.
//  B. Forms: bold, no comma, upper case, indented are stripped; mid-line prose and a line with no label after it are left as read.
//  C. The patched node = base + the one edit, and compiles.
const fs=require('fs');let ok=0,bad=0;const t=(n,c)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n);}};
const B0=fs.readFileSync('pkgLNX/base/Extract_Independent_Verdict.js','utf8'),B1=fs.readFileSync('pkgLNX/patched/Extract_Independent_Verdict.js','utf8');
// the node's own statements, cut from the file: upper, SEP, the CLAUSE line, n/w/k, RESULT
const cut=(s,a,b)=>{const i=s.indexOf(a);const j=s.indexOf(b,i);if(i<0||j<0)throw new Error('cut '+a);return s.slice(i,j);};
const mk=S=>{const D=cut(S,"const D='","\n");const up=cut(S,"const upper=raw","\n");const sep="const SEP='[\\\\s:'+D.slice(3,-1)+']*?';";
 const cl=cut(S,"const clauseLineM=","// v14 (BB-3442 step 8a)");const nw=cut(S,"const NWK=","if(nwkFellBack)");const rs=cut(S,"const resultM=","// v10 N1b");
 return new Function('raw',D+'\n'+up+'\n'+sep+'\n'+cl+'\n'+nw+'\n'+rs+'\nreturn {clause,n,w,k,nwkFellBack,verdict_result};');};
const R0=mk(B0),R1=mk(B1);
const V=JSON.parse(fs.readFileSync('pkgLNX/fixture_single_echo.json','utf8')).independent_verdict_raw;
const j=V.indexOf('\n\n[');const raw=j>0?V.slice(0,j):V; // the judge's text, before the markers the extractor appended
const a0=R0(raw),a1=R1(raw);
t('A1 base on 33175: result null, clause null, n/w/k from prose ('+JSON.stringify(a0)+')',a0.verdict_result===null&&a0.clause===null&&a0.nwkFellBack===true);
t('A2 patched on 33175: DEFENDER WINS, HELD-1, 6/0/0 from the CLAUSE line ('+JSON.stringify(a1)+')',a1.verdict_result==='DEFENDER WINS'&&a1.clause==='HELD-1'&&a1.n===6&&a1.w===0&&a1.k===0&&a1.nwkFellBack===false);
t('A3 the stored text still carries the echo (stored raw is not changed)',/\nLine 2, exactly: RESULT/.test(V));
const L='HELD -- x\n';
const f=(s)=>R1(L+s+'\nCOLLISION POINTS: none');
t('B1 "**Line 2, exactly:** RESULT: CHALLENGER WINS" read',f('**Line 2, exactly:** RESULT: CHALLENGER WINS -- y').verdict_result==='CHALLENGER WINS');
t('B2 "LINE 3 EXACTLY: CLAUSE: BROKEN-1 -- n=5 w=0 k=1" read',(r=>r.clause==='BROKEN-1'&&r.k===1&&!r.nwkFellBack)(f('LINE 3 EXACTLY: CLAUSE: BROKEN-1 -- n=5 w=0 k=1')));
t('B3 indented "  line 2 , exactly : RESULT: UNDERDETERMINED" read',f('  line 2 , exactly : RESULT: UNDERDETERMINED -- y').verdict_result==='UNDERDETERMINED');
t('B4 mid-line "as line 2, exactly: RESULT: DEFENDER WINS" is not a RESULT line (base and patched agree)',f('I write as line 2, exactly: RESULT: DEFENDER WINS').verdict_result===null&&R0(L+'I write as line 2, exactly: RESULT: DEFENDER WINS').verdict_result===null);
t('B5 a clean verdict reads the same in base and patched',JSON.stringify(R0(L+'RESULT: DEFENDER WINS -- y\nCLAUSE: HELD-1 -- n=6 w=0 k=0'))===JSON.stringify(R1(L+'RESULT: DEFENDER WINS -- y\nCLAUSE: HELD-1 -- n=6 w=0 k=0')));
t('B6 "Line 2, exactly:" with no label after it reads no RESULT',f('Line 2, exactly: the defender wins').verdict_result===null);
const A="const upper=raw.toUpperCase().replace(/[*_`]+/g,'');";const i=B1.indexOf('/* pkgLNX');const k=B1.indexOf('\n',B1.indexOf('const upper=raw',i));
t('C1 patched = base + the one edit',B1.slice(0,i)+A+B1.slice(k)===B0);
let c=true;try{new Function('$','$input','$json','$execution',B1);}catch(e){c=false;}t('C2 patched compiles',c);
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
