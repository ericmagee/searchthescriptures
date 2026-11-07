// pkgCLS test. Run from wall2024/: node pkgCLS/test_CLS.cjs
// 1. Units on __clsLine (plain and JSON-encoded text). 2. Replay: every saved run 33218+, 3 nodes, base vs patched; every changed output listed.
// 3. 33411 Alternate Merge Seat: gemini's CHALLENGER CONCEDED LINKS line keeps its own text; the defender line takes the S7 change.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const BW='/mnt/project-files/wall2024/fetchback_live_s45.json';const D='/mnt/project-files/wall2024/inputs/';
const B=process.env.CLS_B||'pkgLIB/orig_stack/patched/',P=__dirname+'/patched/';let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;log('FAIL '+m);}};
const src=fs.readFileSync(P+'Gate_Record.js','utf8');const fn=src.slice(src.indexOf('function __clsLine'),src.indexOf('function cureRewrite('));const L=new Function(fn+';return __clsLine;')();
const enc=x=>JSON.stringify(String(x)).slice(1,-1);
const txt='KEYSTONE: D6 STANDS\nCONCEDED LINKS: 0\nCHALLENGE STANDING: X\nCHALLENGER CONCEDED LINKS: 0\nEND',txt2='CHALLENGER CONCEDED LINKS: 0\nCONCEDED LINKS: 0';
T(L(txt,'CONCEDED LINKS: 0','CONCEDED LINKS: 1',false)==='KEYSTONE: D6 STANDS\nCONCEDED LINKS: 1\nCHALLENGE STANDING: X\nCHALLENGER CONCEDED LINKS: 0\nEND','plain: defender line only');
T(L(txt2,'CONCEDED LINKS: 0','CONCEDED LINKS: 1',false)==='CHALLENGER CONCEDED LINKS: 0\nCONCEDED LINKS: 1','plain: challenger line first, still the defender line');
T(L('CHALLENGER CONCEDED LINKS: 0','CONCEDED LINKS: 0','x',false)===null,'plain: only inside a longer line -> null');
const j='{"reasoning": "'+enc(txt2)+'", "x": 1}';T(L(j,enc('CONCEDED LINKS: 0'),enc('CONCEDED LINKS: 1'),true)==='{"reasoning": "'+enc('CHALLENGER CONCEDED LINKS: 0\nCONCEDED LINKS: 1')+'", "x": 1}','json: defender line at the string end');
const j2='{"reasoning": "'+enc('CONCEDED LINKS: 0\nCHALLENGER CONCEDED LINKS: 0')+'"}';T(L(j2,enc('CHALLENGER CONCEDED LINKS: 0'),enc('CHALLENGER CONCEDED LINKS: 0 -- VOID'),true)==='{"reasoning": "'+enc('CONCEDED LINKS: 0\nCHALLENGER CONCEDED LINKS: 0 -- VOID')+'"}','json: challenger line');
T(L(enc('a "CONCEDED LINKS: 0" b'),enc('CONCEDED LINKS: 0'),'x',true)===null,'json: an escaped quote is not a line start');
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>+r>=33218).sort();const st=x=>JSON.stringify(x,(k,v)=>k==='at'||k==='created_at'?undefined:v);let n=0;const flips=[];
for(const RUN of runs){const H=harness(RUN);for(const name of ['Alternate Merge Seat','Gate Record','Alt Gate Record']){if(!fs.existsSync(D+RUN+'_'+name.replace(/ /g,'_')+'.json'))continue;const f=feeder(BW,name);
 const fin=[...f.filter(x=>/Call/.test(x)),...f.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));if(!fin)continue;const file=name.replace(/ /g,'_')+'.js';
 let a,b,e0=null,e1=null;try{a=H(fs.readFileSync(B+file,'utf8'),fin);}catch(x){e0=String(x.message).slice(0,90);}try{b=H(fs.readFileSync(P+file,'utf8'),fin);}catch(x){e1=String(x.message).slice(0,90);}
 if(e0||e1){T(e0===e1,RUN+' '+name+' same error ('+e0+')');continue;}n++;const sa=st(a),sb=st(b);
 if(RUN==='33411'&&name==='Alternate Merge Seat'){const c=s=>(s.match(/CHALLENGER CONCEDED LINKS: 1 -- Premise 2/g)||[]).length,d=s=>(s.match(/\\nCONCEDED LINKS: 1 -- Premise 2 CONCEDED \(stated\)/g)||[]).length;T(c(sa)>0&&c(sb)===0&&d(sb)>0,'33411 AMS: false challenger line '+c(sa)+' -> '+c(sb)+', defender line kept the S7 change ('+d(sb)+')');}
 if(sa===sb)continue;let i=0;while(sa[i]===sb[i])i++;flips.push(RUN+' '+name+' @'+i+'\n   base:    '+sa.slice(Math.max(0,i-150),i+120)+'\n   patched: '+sb.slice(Math.max(0,i-150),i+120));}}
log('node runs compared: '+n+'; changed outputs: '+flips.length);for(const f of flips)log(f);log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_CLS.txt',out.join('\n')+'\n');
