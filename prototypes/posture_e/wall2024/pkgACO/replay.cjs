// pkgACO replay: runs s135 Build Independent Verdict and Build Save Body on stored executions, once with Anticheat Record
// hidden (as on every live run to date) and once with it present (as after pkgACO). Prints the measured difference.
// Usage: node replay.cjs <parent json> <export json> [more exports]
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');
const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const code=n=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const hide=rd=>{const r={...rd};for(const k of ['Anticheat Build','Anticheat Needed?','Anticheat Call deepseek','Anticheat Record','Anticheat Only?'])delete r[k];return r;};
const S=x=>JSON.stringify(x);
(async()=>{for(const f of process.argv.slice(3)){const ex=JSON.parse(fs.readFileSync(f,'utf8'));const rd=ex.data.resultData.runData;const nm=f.split('/').pop();
 if(!rd['Build Independent Verdict']){console.log(nm,'regrade run: no Build Independent Verdict; skipped');continue;}
 for(const node of ['Build Independent Verdict','Build Save Body']){
  const a=await run(code(node),node,hide(rd)),b=await run(code(node),node,rd);
  if(a.err||b.err){console.log(nm,node,'ERR',a.err||'',b.err||'');continue;}
  const sa=S(a),sb=S(b);
  // locate the added text
  let i=0;while(i<sa.length&&sa[i]===sb[i])i++;let j=0;while(j<sa.length-i&&sa[sa.length-1-j]===sb[sb.length-1-j])j++;
  const added=sb.slice(i,sb.length-j);const removed=sa.slice(i,sa.length-j);
  let extra='';
  if(node==='Build Independent Verdict'){const t=x=>{const c=x[0]&&x[0].call||x[0];return S(c);};const m=sb.match(/\[ANTI-CHEAT CHECK/g)||[];const strip=sb.replace(/(?:\\n){2}\[ANTI-CHEAT CHECK -- [^\]]*?against the verse\.\]/g,'');const pos=[...sb.matchAll(/=== \[(CR4|DR4)\][^=]*===/g)].map(x=>x[1]+'@'+x.index).join(',');const at=[...sb.matchAll(/\[ANTI-CHEAT CHECK/g)].map(x=>x.index).join(',');
    // the stored output for the control
    const st=rd[node][0].data.main[0].map(x=>x.json);extra=' | control equals stored output: '+(S(st)===sa)+' | ANTI-CHEAT notes: '+m.length+' | added chars (JSON form) '+(sb.length-sa.length)+' | with-output minus the notes equals without: '+(strip===sa)+' | close headers '+pos+' notes at '+at;}
  else{const m=(sb.match(/\[AUDIT ANTI-CHEAT \(TRIAL\)/g)||[]).length,m0=(sa.match(/\[AUDIT ANTI-CHEAT \(TRIAL\)/g)||[]).length;extra=' | AUDIT ANTI-CHEAT rows: without '+m0+', with '+m;}
  console.log(nm,'|',node,'| output chars without',sa.length,'with',sb.length,'| changed span: removed',removed.length,'added',added.length,extra);
  if(process.env.SHOW)console.log('   ADDED: '+added.slice(0,1200).replace(/\\n/g,' / '));
 }}})();
