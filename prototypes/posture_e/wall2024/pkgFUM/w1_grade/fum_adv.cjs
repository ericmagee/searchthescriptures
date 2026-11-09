// W1 grade of pkgFUM (Wall 3581): follow-up cases A (full repeat), B (unasked item changed), C (prose only). Run from wall2024/: node pkgFUM/w1_grade/fum_adv.cjs
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');const B='pkgLIB/strip_FUM/patched/';const R=f=>fs.readFileSync(f,'utf8');
const H=harness('34016');const MG=JSON.parse(R('pkgFUM/plan_FUM.json')).nodes_added.find(n=>n.name==='FUM Merge Panel 1').parameters.jsCode;
const b1=H(R(B+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');const first=b1[0].json.reply.text;
const line3='RESPONSE: K-W CHALLENGER DR3 LINK 3 #3 | NOT HELD: the challenger writes "I drop the limb that names what Joseph knew of the cause", which withdraws one limb only.';
const run=(ans)=>{const mg=harness('34016',{'FUM Needed? Panel 1':b1,'FUM Call Panel 1 openrouter':[{json:{choices:[{finish_reason:'stop',message:{role:'assistant',content:ans}}]}}]})(MG,'FUM Call Panel 1 openrouter');
 const n2=harness('34016',{'FUM Merge Panel 1':mg})(R(B+'Panel_Cure_Normalize_1.js'),'FUM Merge Panel 1');
 const o=harness('34016',{'Panel Cure Normalize 1':n2})(R(B+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;
 const L=o.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6-luna');return {rows:L.map(r=>r.rule+' '+r.item+' '+r.cure_status+' | '+String(r.cure_reason||'').slice(0,80)),o};};
const base=run(line3);
const show=(tag,x)=>{console.log('== '+tag+' rows '+x.rows.length);const d=x.rows.filter(r=>!base.rows.includes(r));console.log(' differs from the clean follow-up: '+d.length);d.forEach(r=>console.log('   '+r));
 const k=Object.keys(x.o).filter(k=>JSON.stringify(x.o[k])!==JSON.stringify(base.o[k]));console.log(' output keys that differ: '+k.join(', '));};
console.log('clean follow-up:');base.rows.filter(r=>!/ CURED \|/.test(r)).forEach(r=>console.log('   '+r));
// A: judge repeats its whole first reply and adds the missing line
show('A full repeat + missing line',run(first.replace('RULING -- keystone',line3+'\n\nRULING -- keystone')));
// B: follow-up flips an unasked item: concedes DEFENDER CR2 D2 #2 instead of NOT HELD
show('B unasked item changed',run(line3+'\nRESPONSE: K-W DEFENDER CR2 D2 #2 | ACCEPTED: the defender withdrew D2.\nRETRACTED: D2 vs C2 -- [CR2] "I grant that born of a woman is said of men with fathers"\nCORRECTED RESULT: BROKEN-1'));
// C: follow-up with prose only, no RESPONSE line
show('C prose only',run('I have nothing to add; my earlier reply stands.'));
{const x=run(line3+'\nRESPONSE: K-W DEFENDER CR2 D2 #2 | ACCEPTED: the defender withdrew D2.\nRETRACTED: D2 vs C2 -- [CR2] "I grant that born of a woman is said of men with fathers"\nCORRECTED RESULT: BROKEN-1');
const s=o=>JSON.stringify(o.summary);const a=s(base.o),b=s(x.o);let i=0;while(a[i]===b[i])i++;console.log('SUMMARY base: ',a.slice(Math.max(0,i-200),i+200));console.log('SUMMARY B:    ',b.slice(Math.max(0,i-200),i+200));}
