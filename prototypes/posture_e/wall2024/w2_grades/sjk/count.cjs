// W2 second reading of W1 Wall 4865: single-judge K-W / K-S3 flags that the judge cured but Build Save Body stores as REVIEW THIS ROW.
// Uses the node code itself: Format Markdown (s133, pkgRVF keys) for the key and cure set; Build Save Body (s133) for what it does today.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
let d=JSON.parse(fs.readFileSync(W+'fetchback_live_s133.json','utf8'));d=d.data||d;d=d.workflow||d;
const FMc=d.nodes.find(n=>n.name==='Format Markdown').parameters.jsCode,BSc=d.nodes.find(n=>n.name==='Build Save Body').parameters.jsCode;
const a=FMc.indexOf('const drvRead'),ae=FMc.indexOf('\nconst ',a+10),b=FMc.indexOf('const s3Key'),be=FMc.indexOf('\n',FMc.indexOf('const curedSet'));
const RVF=new Function(FMc.slice(a,ae)+'\n'+FMc.slice(b,be)+'\nreturn {drvRead,flagKey,curedSet};')();
// Build Save Body: its own __CUR and __FK, taken from the node
const i0=BSc.indexOf('const RVW=');const i1=BSc.indexOf('RVW.forEach(',i0);
const BS=new Function('d',BSc.slice(i0,i1)+'\nreturn {RVW,__CUR,__FK};');
function load(f){const t=JSON.parse(fs.readFileSync(f,'utf8')).result;const x=t.indexOf('>\n',t.indexOf('<untrusted-data-'))+2,y=t.lastIndexOf('\n</untrusted-data-');const rows=JSON.parse(t.slice(x,y));return rows[0][Object.keys(rows[0])[0]];}
const R=load(process.argv[2]);
const C={runs_kw:new Set(),runs_s3:new Set(),kw:0,s3:0,kw_cured:0,kw_uncured:0,kw_none:0,s3_cured:0,s3_uncured:0,s3_none:0,bs_marked_cured:0,stored_review_of_cured:0,stored_cured_text:0,stored_absent:0,reports_kw_cured:0,reports_s3_cured:0};
for(const r of R){const raw=String(r.ivr||'');const rn=String(r.rn||'');const bs=BS({independent_verdict_raw:raw});const rows=RVF.drvRead('',raw).rows;
 C.reports_kw_cured+=(raw.match(/RULE: K-W; RESULT: CURED/g)||[]).length;C.reports_s3_cured+=(raw.match(/RULE: K-S3; RESULT: CURED/g)||[]).length;
 const cs=RVF.curedSet(raw);const unc=new Set();rows.forEach(o=>{if(o.RESULT==='UNCURED'){unc.add(String(o.RULE).trim()+'|'+String(o.ITEM).trim().toUpperCase());const s3=String(o.RULE).trim()==='K-S3'&&String(o.LINE||'').match(/^((?:DEFENDER|CHALLENGER) [CD]R\d): (.+)/);if(s3){const k=RVF.flagKey('[x (S3; ruling 1) -- '+s3[1]+': '+s3[2]+']');if(k)unc.add(k);}}});
 for(const x of bs.RVW){const kw=/\(K-W;/.test(x),s3=/\(S3;/.test(x);if(!kw&&!s3)continue;const k=RVF.flagKey(x);const t=kw?'kw':'s3';C[t]++;(kw?C.runs_kw:C.runs_s3).add(r.id);
  const cured=k&&cs.has(k),un=k&&unc.has(k);C[t+(cured?'_cured':un?'_uncured':'_none')]++;
  const bk=bs.__FK(x);if(bk&&bs.__CUR.has(bk))C.bs_marked_cured++;
  if(cured){const body=x.replace(/^\[(?:EXTRACTOR|AUDIT) v\d+: /,'').slice(0,70);const at=rn.indexOf(body);if(at<0)C.stored_absent++;else{const line=rn.slice(rn.lastIndexOf('\n',at)+1,(rn.indexOf('\n',at)+1||rn.length+1)-1);if(/REVIEW THIS ROW/.test(line))C.stored_review_of_cured++;else C.stored_cured_text++;}}}}
C.runs_kw=C.runs_kw.size;C.runs_s3=C.runs_s3.size;console.log('debate_results rows',R.length);console.log(JSON.stringify(C,null,1));
