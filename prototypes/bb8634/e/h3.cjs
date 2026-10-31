const fs=require('fs');
const rows={'30091':JSON.parse(fs.readFileSync('row_49774304-6140-4ac7-953d-e0577caf83a9.json'))[0],'runB':JSON.parse(fs.readFileSync('row_d1c76ad8-c1da-4790-ad19-9e62d6ea9f5d.json'))[0]};
const F=r=>({cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3});
const pwl=(file)=>{const s=fs.readFileSync(file,'utf8');const a=s.indexOf('const PWL=(()=>{');const b=s.indexOf('})();',s.indexOf('return {ledger',a))+5;return eval(s.slice(a,b).replace('const PWL=',''));};
for(const v of ['base','new'])for(const f of ['Panel_Build','Build_Independent_Verdict']){const P=pwl(v+'/'+f+'.js');for(const [rk,r] of Object.entries(rows)){const blk=P.judgeBlock(F(r));
 blk.split('\n').filter(x=>/^cited in /.test(x)).forEach(x=>console.log(v,f,rk,x.slice(0,110)));}}
