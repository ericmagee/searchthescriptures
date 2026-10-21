const fs=require('fs');
const load=f=>{const s=fs.readFileSync(f,'utf8');const lines=s.split('\n');const i=lines.findIndex(l=>/\$\(['"]/.test(l)&&!/^\s*\/\//.test(l));
 return new Function(lines.slice(0,i<0?lines.length:i).join('\n')+'\n;return {cureVerdicts,cureLines};')();};
const F=load('new/Cure_Check.js');
// P1: a judge that echoes the new template line back
const echo='WITHDRAWN: D<n> vs C<m> withdraws your BROKEN grade on that line; a withdrawn line is not a BROKEN line, so that one line cures every item flagged on it (layer, count, pressing, standing). A STATEMENT line never withdraws anything.';
const o=F.cureLines(echo);console.log('P1 echo: withdrawn',o.withdrawn.length,'malformed',o.malformed.length);
// P2: K-G3 standing with two DEFENDER BROKEN links, one WITHDRAWN line
const items=[{rule:'K-G3',side:'DEFENDER',link:null,line:null}];const broken={DEFENDER:['D2 vs C4','D6 vs C2'],CHALLENGER:[]};
let r;try{r=F.cureVerdicts(items,{ok:true,text:'WITHDRAWN: D2 vs C4\nSTATEMENT: K-G3 DEFENDER | withdrawn one'},broken,{});}catch(e){r='threw '+e.message;}
console.log('P2 K-G3 one of two withdrawn:',JSON.stringify(r&&r.map?r.map(x=>[x.status,x.why]):r));
try{r=F.cureVerdicts(items,{ok:true,text:'WITHDRAWN: D2 vs C4\nWITHDRAWN: D6 vs C2'},broken,{});}catch(e){r='threw '+e.message;}
console.log('P2b K-G3 both withdrawn:',JSON.stringify(r&&r.map?r.map(x=>[x.status,x.why]):r));
