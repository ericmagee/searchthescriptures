const fs=require('fs');const dir=process.argv[2];
function loadPW(file){const L0=fs.readFileSync(file,'utf8').split('\n');const ln=(a,b)=>L0.slice(a-1,b).join('\n');
const find=(re,from)=>{for(let i=(from||1)-1;i<L0.length;i++)if(re.test(L0[i]))return i+1;throw new Error('anchor '+re);};
const libEnd=find(/end judge_fix9 libraries/),rA=find(/^const REFP=/),rB=find(/\}\)\(\);$/,rA),ci=find(/^const ciKeys=/),pA=find(/^const PW_CAP=/),pB=find(/^const PW_SEG=/);
return new Function('$',ln(1,libEnd)+'\n'+ln(rA,rB)+'\n'+ln(ci,ci)+'\n'+ln(pA,pB-1)+'\nreturn {pwList};')(()=>{throw 0});}
function loadBSB(file){const c=fs.readFileSync(file,'utf8');const L0=c.split('\n');
const rA=L0.findIndex(l=>/^const REFP=/.test(l));let rB=rA;while(!/\}\)\(\);$/.test(L0[rB]))rB++;
const capA=L0.findIndex(l=>/judge_fix8 R13 \(md_notes_rulings 393\)/.test(l));let capB=capA+1;while(!/^\/\/ posture v5/.test(L0[capB]))capB++;
return new Function('d',L0.slice(rA,rB+1).join('\n')+'\nconst FF=[];\n'+L0.slice(capA,capB).join('\n')+'\nreturn FF;');}
const cases={
 'A tidy 9 (control)':[1,2,3,4,5,6,7,8,9].map(i=>`Genesis 1:${i} "w" -- MEANS: m -- [L3] Exodus 3:14 "I AM"`),
 'B bare refs, no quote, no MEANS (9)':[1,2,3,4,5,6,7,8,9].map(i=>`Genesis 1:${i}`),
 'C quote but no MEANS (9)':[1,2,3,4,5,6,7,8,9].map(i=>`Genesis 1:${i} "words of it"`),
 'D curly quotes (9)':[1,2,3,4,5,6,7,8,9].map(i=>`Genesis 1:${i} “w” -- MEANS: m -- [L3] Exodus 3:14 “I AM”`),
 'E 8 entries, [L3] wrapped to its own line':[1,2,3,4,5,6,7,8].map(i=>`Genesis 1:${i} "w" -- MEANS: m --\n  | [L3] Exodus 3:${i} "x"`),
 'F bulleted (9)':[1,2,3,4,5,6,7,8,9].map(i=>`- **Genesis 1:${i}** "w" -- MEANS: m -- [L3] Exodus 3:14 "I AM"`),
 'G range head (9)':[1,2,3,4,5,6,7,8,9].map(i=>`Genesis 2:${i}-${i+1} "w" -- MEANS: m -- [L3] Exodus 3:14 "I AM"`),
};
for(const v of ['base','new']){const PW=loadPW(`${dir}/${v}/Panel Payloads.js`),BS=loadBSB(`${dir}/${v}/Build Save Body.js`);console.log('##### '+v);
 for(const [nm,lines] of Object.entries(cases)){const DR2='## UNSUPPORTED-L4 PREMISES\n\n1. LINK 1: a premise: "quote here."\nPRESSED WITH:\n'+lines.join('\n')+'\n';
  let p;try{p=PW.pwList({DR2},'DEFENDER')[0];}catch(e){p=null;}
  let f;try{f=BS({gr2:DR2,cr3:''});}catch(e){f=['ERR '+e.message];}
  const bs=f.length?(f[0].match(/carries (\d+) verses/)||[])[1]+' over:'+(f[0].split('):')[1]||'').replace(/ REVIEW THIS ROW\.\]/,'').trim():'no cap line';
  console.log(nm.padEnd(44),'| judges list counted',p?p.all.size:'ERR','over',p?JSON.stringify(p.over):'','| save body:',bs);}}
