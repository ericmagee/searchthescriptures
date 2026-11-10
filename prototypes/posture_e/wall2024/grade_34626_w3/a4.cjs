const fs=require('fs');for(const s of ['luna','chatgpt','sol']){const r=JSON.parse(fs.readFileSync('row_'+s+'.json','utf8'));let t=r.verdict_raw;let o=null;try{o=JSON.parse(t);}catch(e){}
 if(!o){const i=t.indexOf('{');console.log(s,'raw starts:',JSON.stringify(t.slice(0,200)));} 
 fs.writeFileSync('v_'+s+'.txt',t);console.log('== '+s+' length '+t.length);
 const L=t.split(/\\n|\n/);const show=re=>L.filter(l=>re.test(l)).forEach(l=>console.log('   '+l.slice(0,420)));
 show(/KEYSTONE|LINK 6 BROKEN|CONFIRMED CLOSING|RESULT|VERDICT[: ]|DEFENDER LINK BROKEN|BROKEN-|CHAIN|recomput|UNEXHIBITED|NO VERDICT/i);}
