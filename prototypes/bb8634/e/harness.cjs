const fs=require('fs');
const rows={'30091':JSON.parse(fs.readFileSync('row_49774304-6140-4ac7-953d-e0577caf83a9.json'))[0],'runB':JSON.parse(fs.readFileSync('row_d1c76ad8-c1da-4790-ad19-9e62d6ea9f5d.json'))[0]};
const F=r=>({cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3});
const pwl=(file)=>{const s=fs.readFileSync(file,'utf8');const a=s.indexOf('const PWL=(()=>{');const b=s.indexOf('})();',s.indexOf('return {ledger',a))+5;return eval(s.slice(a,b).replace('const PWL=',''));};
const premCount=(blk,label)=>{const L=blk.split('\n');const i=L.findIndex(x=>x.startsWith(label));let c=0;for(let k=i+1;k<L.length&&/^premise \d+/.test(L[k]);k++)c++;return c;};
for(const v of ['base','new'])for(const f of ['Panel_Build','Build_Independent_Verdict']){const P=pwl(v+'/'+f+'.js');for(const [rk,r] of Object.entries(rows)){const blk=P.judgeBlock(F(r));
  console.log(v,f,rk,'premises AGAINST THE DEFENDER:',premCount(blk,'AGAINST THE DEFENDER'),'AGAINST THE CHALLENGER:',premCount(blk,'AGAINST THE CHALLENGER'));
  if(v==='new')blk.split('\n').filter(x=>/^BY THE /.test(x)).forEach(x=>console.log('   ',x));}}
for(const v of ['base','new']){const P=pwl(v+'/D3_Build.js');for(const [rk,r] of Object.entries(rows)){const rb=P.roundBlock(r.engine_r2,P.DEF_RE);console.log(v,'D3 roundBlock',rk,'premise lines:',(rb.match(/^premise \d+/gm)||[]).length);}}
for(const v of ['base','new']){const s=fs.readFileSync(v+'/Extract_Independent_Verdict.js','utf8');const a=s.indexOf('const seqCount=');const b=s.indexOf('const premise_sequence');const a2=s.indexOf('const seqLines=');const b2=s.indexOf('const premise_lines');
 const seqCount=eval('('+s.slice(a,b).replace('const seqCount=','').replace(/;\s*$/,'')+')');const seqLines=eval('('+s.slice(a2,b2).replace('const seqLines=','').replace(/;\s*$/,'')+')');
 const H=/^\s*#*\s*\**\s*UNSUPPORTED-L4 PREMISES\s*:?\s*\**\s*:?\s*$/i;for(const [rk,r] of Object.entries(rows))console.log(v,'Extract IV',rk,'seqCount',seqCount(r.engine_r2,H),'seqLines',seqLines(r.engine_r2,H).length);}
