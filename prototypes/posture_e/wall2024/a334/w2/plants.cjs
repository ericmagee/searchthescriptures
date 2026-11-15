const fs=require('fs');
eval(fs.readFileSync(__dirname+'/vp4.js','utf8').replace(/^const vp4List=/,'global.vp4List='));
const UNX_MW=s=>String(s).toLowerCase().replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();
function unxPresses(r){const t=String(r||'');let i=-1;for(const m of t.matchAll(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi))i=m.index;if(i<0)return [];
 const its=t.slice(i).split(/\n(?=\s*\**\s*\d+[.)]\s)/).filter(x=>/^\s*\**\s*\d+[.)]\s/.test(x));const out=[];
 for(const x of its){const n=+x.match(/^\s*\**\s*(\d+)/)[1];const pw=x.search(/PRESSED WITH\s*:/i);if(pw<0)continue;
  for(const l of x.slice(pw).split('\n').slice(1)){const m=l.match(/^\s*[-*•]?\s*\**\s*([1-3]?\s*[A-Z][A-Za-z ]+?\s+\d+:\d+(?:[-–]\d+)?)\**\s*[\s\S]*?\s--\s*MEANS\s*:\s*([\s\S]+?)(?:\s+--\s+(?=\[L\d\]|PROVEN\b)|\s+\|\s+|$)/);
   if(!m)continue;const means=m[2].replace(/^["“]|["”]$/g,'').trim();if(UNX_MW(means).split(' ').length<3)continue;out.push({n,ref:m[1].replace(/\s+/g,' ').trim(),means});}}return out;}
function pwSegs(s){const o=[];for(const m of s.matchAll(/PRESSED WITH\s*:/gi)){let seg=s.slice(m.index);const b=seg.search(/\n\s*\n|\n\s*\**\s*\d+[.)]\s/);if(b>=0)seg=seg.slice(0,b);o.push([...seg.matchAll(/\b([1-3]?\s?[A-Z][a-z]+)\s+(\d+):(\d+)/g)].map(x=>x[0]));}return o;}
const Q='"The record states Mary of the house of David as the line of the child."';
const PW='PRESSED WITH:\nRomans 1:3 "which was made of the seed of David according to the flesh" -- MEANS: the seed is out of David by the flesh of a man -- [L2] sperma (seed)';
const SL='STEP: the child is of David through Mary -- ASSUMES: Mary is of the house of David -- ROWS GIVE: Luke 1:27 "to a virgin espoused to a man whose name was Joseph, of the house of David"';
const H='UNSUPPORTED-L4 PREMISES\n';
const P={
P1:H+'1. LINK 3: the Davidic line -- '+Q+'\n'+SL+'\n'+PW+'\nPREMISE COUNT: 1',
P2:H+'1. LINK 3: the Davidic line -- '+Q+'\n'+PW+'\nPREMISE COUNT: 1',
P3:H+'1. LINK 3: the Davidic line -- '+Q+'\n'+PW+'\n'+SL+'\nPREMISE COUNT: 1',
P4:H+'1. LINK 3: the Davidic line -- '+Q+'\nSTEP: the child is of David through Mary -- ASSUMES: Mary is of the house of David\n'+PW+'\nPREMISE COUNT: 1',
P5:H+'1. LINK 3: the Davidic line -- '+Q+'\n'+SL+'\n'+PW+'\n2. LINK 4: the throne -- "The throne is given by the house of Joseph alone."\n'+PW+'\nPREMISE COUNT: 2',
P3b:H+'1. LINK 3: the Davidic line -- '+Q+'\n'+PW+' '+SL+'\nPREMISE COUNT: 1',
};
for(const [k,t] of Object.entries(P)){const v=vp4List(t,'DEFENDER');console.log(k,JSON.stringify(v.map(x=>({n:x.n,link:x.link,assumes:x.assumes,rows_give:x.rows_give}))),'| unx',JSON.stringify(unxPresses(t).map(x=>x.n+':'+x.ref)),'| pwRefs',JSON.stringify(pwSegs(t)));}
