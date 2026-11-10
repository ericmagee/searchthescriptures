// W2 form-loss scan, Enforcer Record and Anticheat Record (live s108 outputs from run_records.cjs). Usage: node study_form_loss/scan_enf_acx.cjs <out dir>
const fs=require('fs');const O=process.argv[2];const D='/mnt/project-files/wall2024/inputs/';
const saved=(run,n)=>{const f=D+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;return (m&&m[0])||[];};
const txt=j=>{try{return String(j.choices[0].message.content||'');}catch(e){return null;}};
const cleanL=l=>l.replace(/[*_`]+/g,'').trim();
const E={runs:0,ids:0,nv:0,nv_line:[],nv_none:0,failed:[]};
for(const f of fs.readdirSync(O).filter(f=>f.endsWith('_Enforcer_Record.json')&&!/Judge/.test(f)).sort()){const x=JSON.parse(fs.readFileSync(O+'/'+f));if(!x.ok){E.failed.push(x.run+': '+x.err.slice(0,100));continue;}
 const j=x.out[0].json;if(!j.enf421||j.enf421.skipped)continue;E.runs++;const rows=j.enf421_rows||[];const reps=(saved(x.run,'Enforcer Call deepseek')||[]).map(i=>txt(i.json)).filter(Boolean).join('\n');
 for(const r of rows){E.ids++;if(!/^ENFORCER NO VERDICT/.test(r.cure_reason))continue;E.nv++;const id=(String(r.cure_reason).match(/A\d+\.\d+/)||[])[0];
  // find the id this row is for: rows carry item and flagged_line; use B ids order
 }
 const B=(saved(x.run,'Enforcer Build')||[])[0];const ids=(B&&B.json.ids)||[];
 ids.forEach((it,k)=>{const r=rows[k];if(!r||!/^ENFORCER NO VERDICT/.test(r.cure_reason))return;const id=String(it.id);const g=id.split('.')[0].slice(1);
  const ls=reps.split('\n').map(cleanL).filter(l=>/ENFORCER/i.test(l)&&(new RegExp('\\b'+id.replace('.','\\.')+'\\b','i').test(l)||new RegExp('^ENFORCER\\s*:\\s*(ITEM\\s+)?G?'+g+'\\b','i').test(l)));
  if(ls.length)E.nv_line.push({run:x.run,id,why:r.cure_reason.slice(0,140),lines:ls.map(l=>l.slice(0,300))});else E.nv_none++;});}
console.log('ENFORCER (K-W enforcer): runs',E.runs,'answers',E.ids,'NO VERDICT',E.nv,'; with a reply line naming the id or its item:',E.nv_line.length,'; with none:',E.nv_none,E.failed.length?'; record step failed: '+E.failed.join(' | '):'');
for(const z of E.nv_line)console.log('  '+z.run+' '+z.id+' :: '+z.why+'\n     '+z.lines.join('\n     '));
const A={runs:0,items:0,noans:[],qnf:[],failed:[],unparsed:[]};
for(const f of fs.readdirSync(O).filter(f=>f.endsWith('_Anticheat_Record.json')).sort()){const x=JSON.parse(fs.readFileSync(O+'/'+f));if(!x.ok){A.failed.push(x.run+': '+x.err.slice(0,100));continue;}
 const a=x.out[0].json.acx;if(!a||a.skipped)continue;A.runs++;A.items+=a.counts.items;const reps=(saved(x.run,'Anticheat Call deepseek')||[]).map(i=>txt(i.json)).filter(Boolean).join('\n');
 const parsed=new Set(a.rows.map(r=>r.id));
 for(const id of a.no_answer){const ls=reps.split('\n').filter(l=>new RegExp('\\b'+id+'\\b').test(l)).map(l=>l.trim().slice(0,400));A.noans.push({run:x.run,id,lines:ls});}
 for(const r of a.rows)if(r.note==='QUOTE NOT FOUND')A.qnf.push({run:x.run,id:r.id,side:r.side,close_ok:r.close_ok,earlier_ok:r.earlier_ok,close_q:r.close_q.slice(0,200),earlier_q:r.earlier_q.slice(0,200)});
 for(const l of reps.split('\n'))if(/ANTICHEAT\s*:/i.test(l)){const id=(l.match(/X\d+/)||[])[0];if(id&&!parsed.has(id)&&!a.no_answer.includes(id))A.unparsed.push(x.run+' '+l.trim().slice(0,200));}}
console.log('\nANTICHEAT: runs',A.runs,'items',A.items,'no answer',A.noans.length,'(with a reply line naming the id:',A.noans.filter(z=>z.lines.length).length+')','QUOTE NOT FOUND',A.qnf.length,A.failed.length?'; failed: '+A.failed.join(' | '):'');
for(const z of A.noans.filter(z=>z.lines.length))console.log('  NOANS '+z.run+' '+z.id+'\n     '+z.lines.join('\n     '));
for(const z of A.qnf)console.log('  QNF '+z.run+' '+z.id+' '+z.side+' close_ok='+z.close_ok+' earlier_ok='+z.earlier_ok+'\n     CLOSE "'+z.close_q+'"\n     EARLIER "'+z.earlier_q+'"');
if(A.unparsed.length)console.log('  other ANTICHEAT lines not read: '+A.unparsed.length+'\n   '+A.unparsed.slice(0,10).join('\n   '));
