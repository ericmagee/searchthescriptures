// BB-8172 F1 test: the flag count Extract Independent Verdict uses for data_class, base code on base marks vs new code on new marks.
const fs=require('fs'),path=require('path');
function load(file){const t=fs.readFileSync(file,'utf8');const a=t.indexOf('const DRV_REF=');const f=t.indexOf('function drvCheck(');const e=t.indexOf(' return {items,marks};}',f);
 return new Function(t.slice(a,e+23)+';return {drvCheck};')();}
function nflagLine(file){return fs.readFileSync(file,'utf8').split('\n').find(l=>l.startsWith('const nflag='));}
const B=load('base/Extract_Independent_Verdict.js'),N=load('new/Extract_Independent_Verdict.js');
const fB=new Function('raw','raw0',nflagLine('base/Extract_Independent_Verdict.js')+'return nflag;'),fN=new Function('raw','raw0',nflagLine('new/Extract_Independent_Verdict.js')+'return nflag;');
const rows={};for(const p of fs.readdirSync('../data').filter(x=>/^part_/.test(x)))for(const l of fs.readFileSync('../data/'+p,'utf8').split('\n'))if(l.trim()){const r=JSON.parse(l);(rows[r.i]=rows[r.i]||[]).push(r);}
let eq=0,diff=[],withNew=0;
for(const i of Object.keys(rows)){const text=rows[i].sort((a,b)=>a.n-b.n).map(r=>r.t).join('\n');
 const rb=text+B.drvCheck(text,null,null,null,null,false).marks.map(m=>'\n\n'+m).join(''),nm=N.drvCheck(text,null,null,null,null,false).marks,rn=text+nm.map(m=>'\n\n'+m).join('');
 if(nm.some(m=>/\((?:K-U|K-S2)\)/.test(m)))withNew++;const a=fB(rb,text),b=fN(rn,text);if(a===b)eq++;else diff.push([i,a,b]);}
// controls: a K-S mark still counts; the old code would count a K-U mark
const ks="[AUDIT v22: DEBATE RULE VIOLATION (K-S) -- D1 STANDS rests on ... REVIEW THIS ROW.]",ku="[AUDIT v22: DEBATE RULE VIOLATION (K-U) -- D1 STANDS says ... REVIEW THIS ROW.]";
console.log(JSON.stringify({rows:Object.keys(rows).length,rowsWithNewMarks:withNew,nflagEqual:eq,diff,ctl_KS_counted_new:fN('x\n\n'+ks,'x'),ctl_KU_new:fN('x\n\n'+ku,'x'),ctl_KU_old:fB('x\n\n'+ku,'x')}));
