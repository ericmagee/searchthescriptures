// ASK 518 (W1): paid-call bodies for C1 to C3. Each body is the run's own built body (Close Enforcer Build / Judge Contradiction Build, last run)
// with the one NOT-a-contradiction sentence replaced by the plan rev 3 S1 sentence (exactly one replacement per body, asserted).
// Out: bodies518/<run>_<node>_<item>.json and manifest518.json (run, node, item, side, copy, cands, purpose, repeats, md5). Skipped items (cec_skip) are listed, not built.
const fs=require('fs'),cr=require('crypto');const OUT=__dirname+'/bodies518';fs.mkdirSync(OUT,{recursive:true});
const OLD='; or differs only in wording.';
const NEW="; differs only in wording; or differs only by a reference: it ties its point to a verse whose words, as the debater's own rounds quote them, do not give that point (a wrong reference, or one grouped with the verse that does give it). Read such a sentence with that reference set aside; if its point then agrees with the earlier sentence, it is not a contradiction. A sentence whose point itself cannot be true with the earlier sentence is still a contradiction, whatever its references.";
// the same sentence as the built node (target_engine_518.json): check
{const W=JSON.parse(fs.readFileSync(__dirname+'/target_engine_518.json','utf8'));for(const nm of ['Close Enforcer Build','Judge Contradiction Build']){const s=W.nodes.find(n=>n.name===nm).parameters.jsCode;if(!s.includes(NEW.replace(/'/g,"\\'"))&&!s.includes(NEW))throw new Error('NEW not in built '+nm);}}
const SRC={41117:'/mnt/project-files/ask518/w4/cebuild_41117.json',41102:'/mnt/project-files/ask518/w4/cebuild_41102.json',41090:'/mnt/project-files/ask518/w4/cebuild_41090.json',41043:'/mnt/project-files/ask518/w4/cebuild_41043.json',41024:'/mnt/project-files/ask517/w4/full_41024.json'};
const man=[];const md5=s=>cr.createHash('md5').update(s,'utf8').digest('hex');
for(const [run,f] of Object.entries(SRC)){if(!fs.existsSync(f)){man.push({run,missing:f});continue;}const D=JSON.parse(fs.readFileSync(f,'utf8'));const RD=D.runData||D.data.resultData.runData;
 for(const nm of ['Close Enforcer Build','Judge Contradiction Build']){const r=RD[nm];if(!r){man.push({run,node:nm,missing:'node'});continue;}const it=r[r.length-1].data.main[0]||[];
  it.forEach((x,i)=>{const j=x.json;const base={run,node:nm,item:i,side:j.side||null,copy:j.copy||null,model:j.model||null,cands:(j.cands||[]).map(c=>c.id+' '+c.side+' '+c.kind+' '+c.n+' '+c.earlier_round+'>'+c.closing_round)};
   if(j.cec_skip||!j.body){man.push({...base,skipped:j.cec_skip||'no body',why:j.why||null});return;}
   const b=JSON.parse(JSON.stringify(j.body));let n=0;for(const m of b.messages){if(typeof m.content==='string'){const c=m.content.split(OLD).length-1;n+=c;m.content=m.content.split(OLD).join(NEW);}}
   if(n!==1)throw new Error(run+' '+nm+' '+i+': sentence count '+n);
   const purpose=(run==='41117'&&nm==='Judge Contradiction Build')?'C1':(run==='41117'&&nm==='Close Enforcer Build'&&(j.cands||[]).length)?'C2':'C3';
   const s=JSON.stringify(b);const fn=run+'_'+nm.replace(/ /g,'_')+'_'+i+'.json';fs.writeFileSync(OUT+'/'+fn,s);
   man.push({...base,purpose,repeats:purpose==='C3'?1:3,file:'ask518/w1/bodies518/'+fn,md5:md5(s),bytes:s.length,orig_md5:md5(JSON.stringify(j.body))});});}}
fs.writeFileSync(__dirname+'/manifest518.json',JSON.stringify(man,null,1));
let calls=0;for(const m of man){if(m.repeats)calls+=m.repeats;console.log(m.run,m.node||'',m.item==null?'':m.item,m.purpose||'',m.repeats?('x'+m.repeats):'',m.skipped?('SKIPPED '+m.skipped):'',m.missing?('MISSING '+m.missing):'',m.cands?m.cands.join(' / ').slice(0,150):'');}
console.log('total calls',calls);
