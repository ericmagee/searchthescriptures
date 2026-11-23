// ASK 518 rev 6 (W1): paid-call bodies for C0 (OLD, the live sentence) and C1/C2 (NEW, plan rev 6 S1). 4 bodies x 2 copies, 3 runs each, per arm = 24 + 24 = 48 calls.
// OLD body = the run's own built body unchanged (md5 equals its orig). NEW body = the same with the one sentence replaced (exactly once, asserted), and the NEW text equals the built node's.
const fs=require('fs'),cr=require('crypto');const H=__dirname,OUT=H+'/bodies';fs.mkdirSync(OUT,{recursive:true});
const {OLD,NEW}=JSON.parse(fs.readFileSync(H+'/sentence518r6.json','utf8'));
{const W=JSON.parse(fs.readFileSync(H+'/target_engine_518r6_on517.json','utf8'));for(const nm of ['Close Enforcer Build','Judge Contradiction Build'])if(!W.nodes.find(n=>n.name===nm).parameters.jsCode.includes(NEW))throw new Error('NEW not in built '+nm);}
const SEL=[ // [label, run, node, side, file]
 ['a','41117','Close Enforcer Build','CHALLENGER','/mnt/project-files/ask518/w4/cebuild_41117.json'],
 ['b','41117','Judge Contradiction Build',null,'/mnt/project-files/ask518/w4/cebuild_41117.json'],
 ['c','41102','Close Enforcer Build','CHALLENGER','/mnt/project-files/ask518/w4/cebuild_41102.json'],
 ['d','41024','Close Enforcer Build','CHALLENGER','/mnt/project-files/ask517/w4/full_41024.json']];
const md5=s=>cr.createHash('md5').update(s,'utf8').digest('hex');const man=[];
for(const [lab,run,nm,side,f] of SEL){const D=JSON.parse(fs.readFileSync(f,'utf8'));const RD=D.runData||D.data.resultData.runData;const r=RD[nm];const it=r[r.length-1].data.main[0];
 const sel=it.map((x,i)=>[x.json,i]).filter(([j])=>j.body&&!j.cec_skip&&(side===null||j.side===side));
 if(sel.length!==2)throw new Error(lab+' items '+sel.length);
 for(const [j,i] of sel){const orig=JSON.stringify(j.body);
  for(const arm of ['OLD','NEW']){const b=JSON.parse(orig);let n=0;
   for(const m of b.messages)if(typeof m.content==='string'){n+=m.content.split(OLD).length-1;if(arm==='NEW')m.content=m.content.split(OLD).join(NEW);}
   if(n!==1)throw new Error(lab+' '+i+' sentence count '+n);
   const s=JSON.stringify(b);if(arm==='OLD'&&s!==orig)throw new Error('old changed');
   const fn=lab+'_'+run+'_'+nm.replace(/ /g,'_')+'_'+i+'_'+arm+'.json';fs.writeFileSync(OUT+'/'+fn,s);
   man.push({body:lab,arm,purpose:arm==='OLD'?'C0':(lab==='b'?'C1':'C2'),run,node:nm,item:i,side:j.side||null,copy:j.copy||null,model:j.model||null,
    cands:(j.cands||[]).map(c=>c.id+' '+c.side+' '+c.kind+' '+c.n+' '+c.earlier_round+'>'+c.closing_round),repeats:3,file:'ask518/w1/rev6/bodies/'+fn,md5:md5(s),bytes:s.length,orig_md5:md5(orig)});}}}
fs.writeFileSync(H+'/manifest518r6.json',JSON.stringify(man,null,1));
let calls=0;for(const m of man){calls+=m.repeats;console.log(m.body,m.arm,m.purpose,m.run,m.node,'item',m.item,'copy',m.copy,m.side||'',m.md5.slice(0,8),m.cands.join(' / ').slice(0,90));}
console.log('total calls',calls);
