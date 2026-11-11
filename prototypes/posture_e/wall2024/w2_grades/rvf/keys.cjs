// W2 grade of pkgRVF: run the node's own flagKey/curedSet (live s132 vs RVF) on stored judgments, and check each newly cured flag
// against the judge's report rows by a second, independent match (full sentence, not the 40-character prefix).
// Usage: node keys.cjs <json_agg file of debate_judgments rows {id,debate_id,seat,verdict_raw}>
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const L=f=>{let d=JSON.parse(fs.readFileSync(W+f,'utf8'));d=d.data||d;d=d.workflow||d;return d.nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;};
const fns=c=>{const a=c.indexOf('const drvRead');const ae=c.indexOf('\nconst ',a+10);const b=c.indexOf('const s3Key')>=0?c.indexOf('const s3Key'):c.indexOf('const flagKey');const be=c.indexOf('\n',c.indexOf('const curedSet'));
 return new Function(c.slice(a,ae)+'\n'+c.slice(b,be)+'\nreturn {drvRead,flagKey,curedSet};')();};
const LIVE=fns(L('fetchback_live_s132.json')),RVF=fns(L('parent_s132_RVF.json'));
const FLAG=/\[(?:EXTRACTOR|AUDIT) v\d+[^\]\n]*REVIEW THIS ROW[^\]\n]*\]/g;
const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
function load(f){const r=fs.readFileSync(f,'utf8');let t=r;try{const o=JSON.parse(r);t=o.result||r;}catch(e){}const a=t.indexOf('>\n',t.indexOf('<untrusted-data-'))+2,b=t.lastIndexOf('\n</untrusted-data-');const rows=JSON.parse(t.slice(a,b).replace(/^\s*/,''));return rows[0][Object.keys(rows[0])[0]];}
const J=load(process.argv[2]);
const C={flags:0,kw:0,s3:0,live_cured:0,rvf_cured:0,newly:0,newly_kw:0,newly_s3:0,nokey_kw:0,nokey_s3:0,indep_ok:0,indep_bad:0,uncured_also:0,removes:0,nonremoves:0,non_newly:0,non_review_uncured:0,non_review_noreport:0,non_review_other:0};const bad=[];
for(const j of J){const raw=j.verdict_raw;const lc=LIVE.curedSet(raw),rc=RVF.curedSet(raw);const rows=RVF.drvRead('',raw).rows;
 for(const x of (String(raw).match(FLAG)||[]).filter(x=>!/single judge/i.test(x))){const kw=/\(K-W;/.test(x),s3=/\(S3;/.test(x);if(!kw&&!s3)continue;C.flags++;kw?C.kw++:C.s3++;const rm=/removes the seat/.test(x);rm?C.removes++:C.nonremoves++;
  const k0=LIVE.flagKey(x),k1=RVF.flagKey(x);const c0=!!(k0&&lc.has(k0)),c1=!!(k1&&rc.has(k1));if(c0)C.live_cured++;if(c1)C.rvf_cured++;if(!k1)kw?C.nokey_kw++:C.nokey_s3++;
  // independent: report rows for this flag
  let rel=[];if(kw){const m=x.match(/\(K-W; ruling \d+\) -- (.+?): "/);const it=m&&m[1].trim().toUpperCase();rel=rows.filter(o=>String(o.RULE).trim()==='K-W'&&String(o.ITEM).trim().toUpperCase()===it);}
  else{const m=x.match(/\(S3; ruling \d+\) -- ((?:DEFENDER|CHALLENGER) [CD]R\d): (.+)/);const cut=t=>String(t).split(/;\s+(?:a close-round|STATEMENT|JUDGE STATEMENT)\b| -- NOT COUNTED| -- /)[0];if(m){const sr=m[1],s=norm(cut(m[2]));rel=rows.filter(o=>String(o.RULE).trim()==='K-S3'&&String(o.LINE||'').startsWith(sr+':')&&(()=>{const t=norm(cut(String(o.LINE).slice(sr.length+1)));return t===s||t.startsWith(s)||s.startsWith(t);})());}}
  const st=new Set(rel.map(o=>o.RESULT));
  if(c1&&!c0){C.newly++;kw?C.newly_kw++:C.newly_s3++;if(!rm)C.non_newly++;if(st.has('CURED')&&!st.has('UNCURED'))C.indep_ok++;else{C.indep_bad++;if(bad.length<8)bad.push(j.id+' '+j.seat+' '+[...st].join('/')+' | '+x.slice(0,200));}}
  if(st.has('UNCURED')&&c1)C.uncured_also++;
  if(!rm&&!c1){if(st.has('UNCURED'))C.non_review_uncured++;else if(!rel.length)C.non_review_noreport++;else C.non_review_other++;}
 }}
console.log('judgments',J.length);console.log(JSON.stringify(C,null,1));for(const b of bad)console.log('  BAD',b);
