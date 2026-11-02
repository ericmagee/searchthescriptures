// Shared reading of the stored rows (data/run<N>.json, saved from the SQL reads) for the unit and replay tests.
const fs=require('fs');
const run=n=>JSON.parse(fs.readFileSync(__dirname+'/../data/run'+n+'.json','utf8'));
// Column map: CR = defender (claude_r1, claude_r2, engine_r3 link round); DR = challenger (engine_r1, engine_r2, challenger_r3 link round).
const rounds=r=>Object.assign({CR1:r.claude_r1,DR1:r.engine_r1,CR2:r.claude_r2,DR2:r.engine_r2,CR3:r.engine_r3,DR3:r.challenger_r3},r.defender_r4?{CR4:r.defender_r4}:{},r.challenger_r4?{DR4:r.challenger_r4}:{});
const unbr=s=>String(s).replace(/\((CR[1-4]|DR[1-4]|L[1-4])\)/g,'[$1]'); // undo cureSafe for round and layer tags
// The end of the JSON object that opens at a (string-aware brace count).
function objEnd(t,a){let d=0,q=false;for(let i=a;i<t.length;i++){const c=t[i];if(q){if(c==='\\')i++;else if(c==='"')q=false;continue;}if(c==='"')q=true;else if(c==='{')d++;else if(c==='}'&&--d===0)return i+1;}return t.length;}
// A panel row: the JSON payload, then the audit lines. A single-judge row (independent_verdict_raw): the raw reply, then "\n\n[AUDIT" lines.
function judgment(raw,panel){let text,fields={},tail;
 if(panel){const a=raw.indexOf('{'),b=objEnd(raw,a);const o=JSON.parse(raw.slice(a,b));text=o.reasoning!=null?o.reasoning:o.reason;fields=o;tail=raw.slice(b);}
 else{const i=raw.indexOf('\n\n[AUDIT');text=i<0?raw:raw.slice(0,i);tail=i<0?'':raw.slice(i);
  const g=(re)=>{const m=text.replace(/[*_`]+/g,'').match(re);return m?m[1]:null;};
  fields={conceded_links:+(g(/^\s*CONCEDED LINKS\s*:\s*(\d+)/m)||0),challenger_conceded_links:+(g(/^\s*CHALLENGER CONCEDED LINKS\s*:\s*(\d+)/m)||0),
   defense_standing:g(/^\s*DEFENSE STANDING\s*:\s*([A-Z-]+)/m),challenge_standing:g(/^\s*CHALLENGE STANDING\s*:\s*([A-Z-]+)/m)};}
 const reports=[];for(const l of tail.split('\n')){const m=l.match(/^\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- (?:SEAT: (\S+); )?ITEM: (.*?); RULE: (\S+); RESULT: (\w+)(.*)\]$/);if(!m)continue;
  const f=k=>{const x=m[5].match(new RegExp('; '+k+': (.*?)(?=; (?:KINDS|WHY|LINE|STATEMENT|JUDGE STATEMENT): |$)'));return x?x[1]:null;};
  reports.push({seat:m[1]||null,item:m[2],rule:m[3],status:m[4],why:f('WHY'),statement:f('STATEMENT'),judge:f('JUDGE STATEMENT')});}
 const marks=tail.split('\n').filter(l=>/^\[AUDIT v2[123]: DEBATE RULE VIOLATION \(/.test(l)||/^\[AUDIT v21: DEBATE RULE VIOLATION -- /.test(l));
 return {text,fields,reports,marks,tail};}
// The cure reply as far as the stored report keeps it: each item's STATEMENT lines (the fixed-form lines that cured or were read) and its
// JUDGE STATEMENT as a STATEMENT line. Fields longer than 600 characters were cut by the node ("..."); such a line may no longer parse.
function reply(reports){const L=[];const seen=new Set();for(const x of reports){
  if(x.statement)for(const s of unbr(x.statement).split(' / '))if(!seen.has(s)){seen.add(s);L.push(s);}
  if(x.judge&&x.judge!=='none written'){const s='STATEMENT: '+(x.rule==='K-G3'?x.item+' '+x.rule:x.item)+' | '+unbr(x.judge);if(!seen.has(s)){seen.add(s);L.push(s);}}}
 return {ok:true,text:L.join('\n')};}
module.exports={run,rounds,judgment,reply,unbr};
