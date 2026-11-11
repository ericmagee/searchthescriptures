const fs=require('fs');const out=[];
for(const fn of fs.readdirSync('/mnt/project-files/wall2024/').filter(x=>/^ex3\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+fn,'utf8')).data.resultData.runData;const seen=new Set();
 for(const n of ['Judge Enforcer Record','Alt Judge Enforcer Record','R2 Alt Judge Enforcer Record'])if(rd[n])for(const r of (rd[n][0].data.main.flat()[0].json.enf428_rows||[])){if(!/^ENFORCER DISAGREE/.test(r.cure_reason||''))continue;const k=r.rule+r.seat+r.flagged_line;if(seen.has(k))continue;seen.add(k);out.push({run:fn.slice(2,7),rule:r.rule,seat:r.seat,item:r.item,line:r.flagged_line,reason:r.cure_reason});}}
const by={};out.forEach(r=>by[r.rule]=(by[r.rule]||0)+1);console.log(by,out.length);fs.writeFileSync('dis_rows.json',JSON.stringify(out));
// screen signatures
const sig={contradiction:/contradict/i,retracted:/^RETRACTED/i,rule_not_words:/rests on a rule|not on any quoted|no quoted debate words/i,absent_in_list:/(?:list|supplied|given)[^.]{0,40}(?:ends|no |does not (?:show|hold|include))/i,cap:/G10|cut|truncat/i};
for(const [k,re] of Object.entries(sig)){const m=out.filter(r=>re.test(r.reason)||re.test(r.line||''));console.log(k,m.length,JSON.stringify(m.reduce((a,r)=>(a[r.rule]=(a[r.rule]||0)+1,a),{})));}
