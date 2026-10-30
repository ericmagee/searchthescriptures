// E probe: a premise verse first pressed in [DR2] (not in [DR1]) and named by the defender only in [CR2], which comes before [DR2].
const fs=require('fs'),path=require('path');const H=process.argv[2];
const pwl=(dir,nm)=>{const t=fs.readFileSync(path.join(H,dir,nm+'.js'),'utf8');const a=t.indexOf('const PWL=(()=>{');const e=t.indexOf('})();',a);return new Function(t.slice(a,e+5)+'\nreturn PWL;')();};
const F={cr1:'The father is named at Luke 2:48.',gr1:'The supposing verb is answered elsewhere.',
 cr2:'Acts 14:19 "supposing he had been dead" shows the verb used of a mistaken crowd.',
 gr2:'Closing.\n\nUNSUPPORTED-L4 PREMISES\n1. LINK 1: the naming rows prove begetting; against Acts 14:19.',
 cr3:'LINK 1: SUPPORTED. The naming rows stand.',dr3:'LINK 1: SUPPORTED.'};
for(const d of ['base','new']){const L=pwl(d,'Panel_Build').judgeBlock(F).split('\n').filter(l=>/premise 1|AGAINST THE DEFENDER/.test(l));console.log(d,JSON.stringify(L));}
