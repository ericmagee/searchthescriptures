// pkgWLDDS (D51 part 2; W2, 11-08; scope W3 3435): DeepSeek is shown the witness ledger the judges saw.
// An E-HOLD item, and an E-COL item, gets one ledger line for each pressed witness its line names (none when it names none):
//   - <verse> (pressed against the DEFENDER|CHALLENGER, premise n): NAMED IN AN ANSWER [<round>] "<words>" | NAMED ONLY IN OTHER TEXT [...] | NOT NAMED
// The ledger is read from Panel Build's own judge prompt (the PRESSED-WITNESS LEDGER block, pkgWLD), so DeepSeek and the judges share one text.
// RULE E-COL and RULE E-HOLD each gain one sentence on how to read it. No ledger in the prompt (or no witness named) = the item is unchanged.
// Nodes: Judge Enforcer Build, Alt Judge Enforcer Build, R2 Alt Judge Enforcer Build. Base: pkgKWI/patched (KWI rev 2 changes all three).
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const NB=process.argv[2]||'pkgKWI/patched',OUT=process.argv[3]||'pkgWLDDS/patched';
const FN=`/* pkgWLDDS (D51 part 2, W3 3435): the PRESSED-WITNESS LEDGER the judges were shown (Panel Build's prompt, pkgWLD), given on an E-HOLD or E-COL item
   for each pressed witness the item's line names. Read from the prompt text, so DeepSeek and the judges share one ledger. */
const __wldK=s=>String(s||'').toLowerCase().replace(/^psalm\\b/,'psalms').replace(/\\s+/g,' ').trim();
const __wldE=(()=>{try{const pb=__L['Panel Build']();if(!pb.isExecuted)return [];const js=pb.first().json;let t=null;
  const walk=x=>{if(t)return;if(typeof x==='string'){if(x.includes('PRESSED-WITNESS LEDGER --'))t=x;}else if(x&&typeof x==='object')for(const v of Object.values(x))walk(v);};
  walk(js&&js.judges&&js.judges[0]&&js.judges[0].body);if(!t)return [];
  const L=t.slice(t.indexOf('PRESSED-WITNESS LEDGER --')).split('\\n');const out=[];let side='';
  const LAB='((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)? \\\\d+:\\\\d+(?:[-\\\\u2013]\\\\d+)?)';
  const keys=lab=>{const m=String(lab).match(/^(.*?) (\\d+):(\\d+)(?:[-\\u2013](\\d+))?$/);if(!m)return [];const o=[];for(let v=+m[3];v<=(m[4]?+m[4]:+m[3])&&v-+m[3]<=12;v++)o.push(__wldK(m[1])+' '+m[2]+':'+v);return o;};
  for(const l of L.slice(1)){if(/^AGAINST THE DEFENDER/.test(l)){side='DEFENDER';continue;}if(/^AGAINST THE CHALLENGER/.test(l)){side='CHALLENGER';continue;}if(/^A verse marked NOT NAMED/.test(l))break;
   const pm=l.match(/^premise (\\d+)/);if(!pm||!side)continue;const n=+pm[1];
   for(const [cls,re] of [['NAMED IN AN ANSWER',/ -- NAMED IN AN ANSWER: (.*?)(?= -- NAMED ONLY IN OTHER TEXT: | --;)/],['NAMED ONLY IN OTHER TEXT',/ -- NAMED ONLY IN OTHER TEXT: (.*?)(?= --;)/]]){const s=(l.match(re)||[])[1];if(!s)continue;
    for(const m of s.matchAll(new RegExp(LAB+' \\\\[((?:CR|DR)\\\\d)\\\\] "([^"]*)"','g')))out.push({side,n,lab:m[1],keys:keys(m[1]),cls,rd:m[2],w:m[3]});}
   const nn=(l.match(/; NOT NAMED: (.*)$/)||[])[1];if(nn&&nn!=='none')for(const lab of nn.split(/, (?=(?:[1-3] )?[A-Z])/))out.push({side,n,lab:lab.trim(),keys:keys(lab.trim()),cls:'NOT NAMED',rd:'',w:''});}
  return out;}catch(e){return [];}})();
const __wldFor=line=>{try{if(!__wldE.length)return '';const ks=new Set();for(const m of String(line||'').matchAll(/\\b((?:[1-3]\\s)?[A-Z][a-z]+)\\s+(\\d+):(\\d+)/g))ks.add(__wldK(m[1])+' '+m[2]+':'+m[3]);
  const seen=new Set();const hit=__wldE.filter(e=>e.keys.some(k=>ks.has(k))).filter(e=>{const k=e.side+e.n+e.lab+e.cls+e.rd;if(seen.has(k))return false;seen.add(k);return true;}).slice(0,6);
  return hit.length?'\\nTHE WITNESS LEDGER THE JUDGES WERE SHOWN (computed by the system from the rounds; one entry per pressed witness this line names):\\n'+hit.map(e=>'- '+e.lab+' (pressed against the '+e.side+', premise '+e.n+'): '+e.cls+(e.rd?' ['+e.rd+'] "'+e.w+'"':e.cls==='NOT NAMED'?' (named in no later round of the answering side)':'')).join('\\n'):'';}catch(e){return '';}};
`;
const RULE="THE WITNESS LEDGER (pkgWLDDS), when an item gives it, is the system's record of the rounds, the same one the judges were shown: a witness NAMED IN AN ANSWER was answered by name in the round shown, so a line that rests on that witness being unanswered or left unanswered is wrong on that ground (DISAGREE, and say so), though whether that answer meets the meaning pressed is still read from its quoted words; a witness NOT NAMED was named in no later round of the answering side; NAMED ONLY IN OTHER TEXT decides neither. ";
const EDITS=[
 ['L',"const __L={","const __L={\"Panel Build\":()=>$('Panel Build'), /* pkgWLDDS */"],
 ['fn',"const items=[];let gi=0;",FN+"const items=[];let gi=0;"],
 ['col',"+failsNote(g.line)+(__efg?","+failsNote(g.line)+__wldFor(g.line)+(__efg?"],
 ['hold',"+(g.side0?'\\nTHIS IS A LINK-STATE LINE.","+__wldFor(g.line)+(g.side0?'\\nTHIS IS A LINK-STATE LINE."],
 ['rcol',"'RULE E-COL (a collision line: FORCED, or LINK BROKEN). ","'RULE E-COL (a collision line: FORCED, or LINK BROKEN). "+RULE.replace(/'/g,"\\'")],
 ['rhold',"'RULE E-HOLD (a collision line graded STANDS or UNDERDETERMINED). ","'RULE E-HOLD (a collision line graded STANDS or UNDERDETERMINED). "+RULE.replace(/'/g,"\\'")]];
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT,{recursive:true});const plan={base:NB,nodes:{}};
for(const nm of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){const f=nm.replace(/ /g,'_')+'.js';const c0=fs.readFileSync(NB+'/'+f,'utf8');let c=c0;
 for(const [tag,a,b] of EDITS){const k=c.split(a).length-1;if(k!==1)throw new Error(nm+' '+tag+': anchor found '+k+' times');c=c.replace(a,()=>b);}
 new Function('$','$input','$execution','return (async()=>{\n'+c+'\n})();');fs.writeFileSync(OUT+'/'+f,c);plan.nodes[nm]={before:h(c0),after:h(c),edits:EDITS.length};}
fs.writeFileSync(OUT.replace(/patched$/,'')+'plan_WLDDS.json',JSON.stringify(plan,null,1)+'\n');console.log(JSON.stringify(plan.nodes));
