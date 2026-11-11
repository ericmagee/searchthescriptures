// W2 grade of pkgSJK: every stored single-judge flag (30 days of debate_results) through the old and new Build Save Body key/cure code,
// checked against an independent key: Format Markdown's pkgRVF reader (s133).  args: <debate_results json_agg file (id, ivr, rn)>
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const L=f=>{let d=JSON.parse(fs.readFileSync(W+f,'utf8'));d=d.data||d;return d.workflow||d;};
const bsc=d=>d.nodes.find(n=>n.name==='Build Save Body').parameters.jsCode;
const mkBS=c=>{const i0=c.indexOf('const RVW=');const i1=c.indexOf('RVW.forEach(',i0);return new Function('d',c.slice(i0,i1)+'\nreturn {RVW,__CUR,__FK};');};
const OLD=mkBS(bsc(L(process.env.BASE||'parent_s133_NBR2.json'))),NEW=mkBS(bsc(L(process.env.CAND||'parent_s133_NBR2_SJK.json')));
const FMc=L('fetchback_live_s133.json').nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;
const a=FMc.indexOf('const drvRead'),ae=FMc.indexOf('\nconst ',a+10),b=FMc.indexOf('const s3Key'),be=FMc.indexOf('\n',FMc.indexOf('const curedSet'));
const RVF=new Function(FMc.slice(a,ae)+'\n'+FMc.slice(b,be)+'\nreturn {drvRead,flagKey,curedSet};')();
function load(f){const t=JSON.parse(fs.readFileSync(f,'utf8')).result;const x=t.indexOf('>\n',t.indexOf('<untrusted-data-'))+2,y=t.lastIndexOf('\n</untrusted-data-');const rows=JSON.parse(t.slice(x,y));return rows[0][Object.keys(rows[0])[0]];}
const R=load(process.argv[2]);
const C={rows:R.length,rows_changed:0,flags:0,rvw_sets_equal:0,kw:0,s3:0,other:0,old_cured:0,new_cured:0,became_cured:{},lost_cured:0,other_changed:0,agree_rvf:0,new_not_rvf:0,rvf_not_new:0,uncured_report_now_cured:0,stored_review_lines_changed:0,stored_absent:0};const ex=[];
for(const r of R){const raw=String(r.ivr||''),rn=String(r.rn||'');const o=OLD({independent_verdict_raw:raw}),n=NEW({independent_verdict_raw:raw});
 if(JSON.stringify(o.RVW)===JSON.stringify(n.RVW))C.rvw_sets_equal++;
 const cs=RVF.curedSet(raw);const unc=new Set();(raw.match(/ITEM: [^\n]*?; RULE: (K-W|K-S3); RESULT: UNCURED[^\n]*/g)||[]).forEach(l=>{const m=l.match(/ITEM: (.+?); RULE: (K-W|K-S3)/);unc.add(m[2]+'|'+m[1].trim().toUpperCase());const s=l.match(/LINE: ((?:DEFENDER|CHALLENGER) [CD]R\d): (.+)/);if(s){const k=RVF.flagKey('[x (S3; ruling 1) -- '+s[1]+': '+s[2]+']');if(k)unc.add(k);}});
 let ch=false;
 for(const x of n.RVW){C.flags++;const t=/\(K-W;/.test(x)?'kw':/\(S3;/.test(x)?'s3':'other';C[t]++;
  const oc=!!(o.__FK(x)&&o.__CUR.has(o.__FK(x))),nc=!!(n.__FK(x)&&n.__CUR.has(n.__FK(x)));if(oc)C.old_cured++;if(nc)C.new_cured++;
  if(!oc&&nc){C.became_cured[t]=(C.became_cured[t]||0)+1;ch=true;if(t==='other')C.other_changed++;
   const body=x.replace(/^\[(?:EXTRACTOR|AUDIT) v\d+: /,'').slice(0,70);const at=rn.indexOf(body);if(at<0)C.stored_absent++;else{const line=rn.slice(rn.lastIndexOf('\n',at)+1,(rn.indexOf('\n',at)+1||rn.length+1)-1);if(/REVIEW THIS ROW/.test(line))C.stored_review_lines_changed++;}}
  if(oc&&!nc){C.lost_cured++;ch=true;}
  if(t!=='other'){const rk=RVF.flagKey(x);const rc=!!(rk&&cs.has(rk));if(rc===nc)C.agree_rvf++;else{if(nc)C.new_not_rvf++;else C.rvf_not_new++;if(ex.length<6)ex.push((nc?'NEW only ':'RVF only ')+r.id+' '+x.slice(0,200));}
   if(nc&&rk&&unc.has(rk)&&!cs.has(rk))C.uncured_report_now_cured++;}}
 if(ch)C.rows_changed++;}
console.log(JSON.stringify(C,null,1));ex.forEach(s=>console.log('  ',s));
