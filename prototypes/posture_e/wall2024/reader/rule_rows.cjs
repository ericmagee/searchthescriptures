// Tags every row of corpus/out/disagreements.tsv with the W3 ruling that covers it (line_form_spec.md section 7), and lists the rows no ruling covers.
// Run from wall2024/: node reader/rule_rows.cjs   -> corpus/out/disagreements_ruled.tsv, and a count per ruling. Target: 0 unruled.
const fs=require('fs');const R=require('./readLines.cjs');
const rows=fs.readFileSync('corpus/out/disagreements.tsv','utf8').split('\n');const H=rows[0];const B=rows.slice(1).filter(Boolean).map(l=>l.split('\t'));
const nb=s=>String(s).replace(/\\+/g,'');const LEN={};for(const l of fs.readFileSync('corpus/texts.jsonl','utf8').trim().split('\n')){const t=JSON.parse(l);LEN[t.tid]=String(t.jtext).length;}
function rule(r){const [tid,run,seat,src,n,form,ad,field,oldv,newv,line]=r;const rl=R.readLine(line);const code=rl.code||'';
 if(field!=='*'&&oldv!==newv&&nb(oldv)===nb(newv))return 'G1 backslashes (spec 0.1 amended)';
 if(/rcLines/.test(ad)&&field==='grade'&&!oldv&&/^(STANDS|WITHDRAWN)$/.test(newv))return 'G2 spec stands (rcLines reads 3 grades)';
 if(/K-CMT/.test(ad)&&oldv==='read')return 'G3 K-CMT form lines only'+(/^MALFORMED_/.test(code)?' ('+code+' is a record item)':'');
 if(/SB_FORM|PR\/FR/.test(ad)&&oldv==='read'&&src==='flagged_line'&&LEN[tid]===600&&/^MALFORMED_/.test(code))return 'flagged_line is the engine 600-character excerpt; the full judge line reads as a form in the verdict or cure text';
 if(/SB_FORM|PR\/FR/.test(ad)&&oldv==='read'&&/^MALFORMED_FORCED$/.test(code)&&/^(?:RESTATED:\s*)?FORCED:\s*D\d+\s+vs\.?\s+C\d+\s*\(\s*Commitment/i.test(R.norm(line)))return 'spec question: (Commitment N) after the pair in FORCED (KF_LINE refuses it too)';
 if(/SB_FORM/.test(ad)&&oldv==='read'&&/^ANSWER CHECK\s*:[^\n]*\[ledger\]/i.test(R.norm(line)))return 'spec 8: [ledger] is not a round; refused';
 if(/SB_FORM|PR\/FR/.test(ad)&&oldv==='read'&&(/^MALFORMED_FORCED$/.test(code)||(/^premise\s+\d/i.test(R.norm(line))&&!rl.form)))return 'G4/G5 spec stands (not a form; CHANGE TO refused in phase 2)';
 if(field==='roundRaw'&&/[,;]/.test(newv))return 'G6 several rounds kept';
 if(/ac\(\)/.test(ad)&&field==='verse'&&/\[/.test(oldv))return 'G7 spec stands';
 if(/kagRow/.test(ad)&&field==='grade'&&!oldv&&newv)return 'G8 spec stands (inner quotes)';
 if(/KF_LINE/.test(ad)&&field!=='*'&&nb(newv).startsWith(nb(oldv).replace(/\s+$/,''))&&nb(newv).length>nb(oldv).length)return 'G9 spec stands (quote runs to the last closing mark)';
 if(/gateRead/.test(ad)&&field==='sentence'&&newv===oldv+'"')return 'G10 spec stands';
 if(/CURE_KEY/.test(ad)&&oldv==='read'&&/^RESTATED/i.test(R.norm(line))&&(code==='NOT_A_FORM'||/^MALFORMED_/.test(code)))return 'G12 RESTATED wraps a spec form only ('+code+')';
 if(/SB_ROW/.test(ad)&&field==='sentence'&&nb(newv).includes(nb(oldv).replace(/^["\u201c]|["\u201d]$/g,'')))return 'SB_ROW spec stands (spec 10: whole sentence; live key rq() = first quoted span)';
 if(/_reply$/.test(src)&&oldv==='read'&&/^\s*"reason(?:ing)?"\s*:\s*"/.test(line)&&R.readLine(line.replace(/^\s*"reason(?:ing)?"\s*:\s*"/,'')).form==='REPLY')return 'G11 reply unwrapped by judgeText, read anchored';
 return null;}
const out=[H+'\truling'],cnt={};const un=[];
for(const r of B){const g=rule(r);cnt[g||'UNRULED']=(cnt[g||'UNRULED']||0)+1;out.push(r.join('\t')+'\t'+(g||'UNRULED'));if(!g)un.push(r);}
fs.writeFileSync('corpus/out/disagreements_ruled.tsv',out.join('\n')+'\n');
console.log('rows',B.length);for(const k of Object.keys(cnt).sort())console.log(cnt[k]+'\t'+k);
for(const r of un.slice(0,15))console.log('UNRULED',r[0],r[3],r[5],r[6],r[7],'| old='+r[8].slice(0,80),'| new='+r[9].slice(0,80),'|',r[10].slice(0,140));
