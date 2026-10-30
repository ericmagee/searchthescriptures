// BB-8172 (v) round order, challenger side: a premise in the list closing [CR3] answered in [DR2] counts only when pressed in [CR1] or [CR2].
const fs=require('fs'),path=require('path');const ND=process.argv[2]||'new';
const pwl=(dir,nm)=>{const t=fs.readFileSync(path.join(__dirname,dir,nm+'.js'),'utf8');const a=t.indexOf('const PWL=(()=>{');const e=t.indexOf('})();',a);return new Function(t.slice(a,e+5)+'\nreturn PWL;')();};
const F={cr1:'Luke 2:48 "thy father and I" names him.',gr1:'Opening.',cr2:'Round two.',
 gr2:'Luke 2:48 is the mother speaking of the household; Acts 14:19 shows the verb.',
 cr3:'LINK 1: SUPPORTED.\n\nCHALLENGER\'S UNSUPPORTED-L4 PREMISES\n1. LINK 1: the household reading; against Luke 2:48.\n2. LINK 2: the mistaken-crowd reading; against Acts 14:19.',dr3:'LINK 1: SUPPORTED.'};
for(const d of ['base',ND])console.log(d,JSON.stringify(pwl(d,'Panel_Build').judgeBlock(F).split('\n').filter(l=>/^premise|AGAINST THE CHALLENGER/.test(l))));
