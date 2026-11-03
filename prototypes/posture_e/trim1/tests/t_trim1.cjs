// trim1 unit checks: the cure standing check and the recompute standing/result logic, extracted from Panel Cure Check (new vs base).
const fs=require('fs'),path=require('path');const D=path.join(__dirname,'..');let pass=0,fail=0;const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('FAIL',m);}};
for(const w of ['base','new']){const c=fs.readFileSync(path.join(D,w,'Panel Cure Check.js'),'utf8');
 const i=c.indexOf('const stand=(sd,k,orig)=>');const j=c.indexOf('};',i)+2;const src=c.slice(i,j);
 const f=new Function('P','c','brk','Lof','return (sd,k,orig)=>{'+src+';return stand(sd,k,orig);}')({st:{DEFENSE:{u:'DEFENSE STANDING: X -- L=6 c=1'}}},{DEFENDER:1},{DEFENDER:0},()=>6);
 const g=new Function('P','c','brk','Lof','return (sd,k,orig)=>{'+src+';return stand(sd,k,orig);}')({st:{DEFENSE:{u:'x L=6 c=4'}}},{DEFENDER:4},{DEFENDER:0},()=>6);
 const z=new Function('P','c','brk','Lof','return (sd,k,orig)=>{'+src+';return stand(sd,k,orig);}')({st:{DEFENSE:{u:'x L=6 c=0'}}},{DEFENDER:0},{DEFENDER:0},()=>6);
 console.log(w,'| c=1 judge COLLAPSED ->',f('DEFENDER','DEFENSE','COLLAPSED'),'| c=4 of 6 judge PROP ->',g('DEFENDER','DEFENSE','PROP-DEPENDENT'),'| c=1 judge SELF ->',f('DEFENDER','DEFENSE','SELF-SUPPORTED'),'| c=0 judge PROP ->',z('DEFENDER','DEFENSE','PROP-DEPENDENT'));
 if(w==='new'){ok(f('DEFENDER','DEFENSE','COLLAPSED')==='COLLAPSED','judge COLLAPSED kept at c=1');ok(g('DEFENDER','DEFENSE','PROP-DEPENDENT')==='PROP-DEPENDENT','judge PROP kept at c=4 of 6');ok(f('DEFENDER','DEFENSE','SELF-SUPPORTED')==='PROP-DEPENDENT','SELF-SUPPORTED with a counted link still corrected');ok(z('DEFENDER','DEFENSE','PROP-DEPENDENT')==='SELF-SUPPORTED','count 0 gives SELF-SUPPORTED');}
 else{ok(g('DEFENDER','DEFENSE','PROP-DEPENDENT')==='COLLAPSED','base forced COLLAPSED (defect reproduced)');}
 const r0=c.indexOf("const res=word==='BROKEN'");const r1=c.indexOf(';\n',r0)+1;let rs=c.slice(r0,r1);
 const R=(word,res0)=>new Function('word','P','cst','brk',rs+';return res;')(word,{result:res0?{u:'RESULT: '+res0+' -- x'}:null},'SELF-SUPPORTED',{CHALLENGER:0});
 console.log(w,'| HELD judge DEFENDER WINS, challenger SELF-SUPPORTED ->',R('HELD','DEFENDER WINS'),'| BROKEN ->',R('BROKEN','DEFENDER WINS'),'| HELD after retraction, judge had CHALLENGER WINS ->',R('HELD','CHALLENGER WINS'));
 if(w==='new'){ok(R('HELD','DEFENDER WINS')==='DEFENDER WINS','judge RESULT kept');ok(R('BROKEN','UNDERDETERMINED')==='CHALLENGER WINS','BROKEN gives CHALLENGER WINS');ok(R('HELD','CHALLENGER WINS')==='UNDERDETERMINED','CHALLENGER WINS without BROKEN becomes UNDERDETERMINED');ok(R('PARTIAL','UNDERDETERMINED')==='UNDERDETERMINED','judge UNDERDETERMINED kept');}
 else ok(R('HELD','DEFENDER WINS')==='UNDERDETERMINED','base overrode the judge (defect reproduced)');}
// rulebook text: the three formulas are gone from the judges' request builders, the counts stay
for(const f of ['Panel Build','Build Independent Verdict']){const t=fs.readFileSync(path.join(D,'new',f+'.js'),'utf8');
 ok(!/apply these mechanically/.test(t)&&!/by count, mandatory, not discretionary/.test(t)&&!/HELD gives DEFENDER WINS only if/.test(t)&&!/COLLAPSED is reached by this count only/.test(t),f+': formula wording removed');
 ok(/L=<L> c=<c>/.test(t)&&/A SIDE WITH A COUNTED LINK IS NOT SELF-SUPPORTED/.test(t),f+': counts and the definitional rule kept');}
const is=fs.readFileSync(path.join(D,'new','Init Seats.js'),'utf8');ok(!/'mimo','qwen'/.test(is)&&/free\.indexOf\('deepseek'\)>=0\?'deepseek'/.test(is),'Init Seats: mimo out of the judge order, DeepSeek reserve');
console.log('PASS',pass,'FAIL',fail);process.exit(fail?1:0);
