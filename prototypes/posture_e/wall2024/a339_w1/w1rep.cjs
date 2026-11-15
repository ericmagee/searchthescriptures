// W1: ASK 339 replay on the 27 S-C runs, Quote Report absent (REST refused here). Verse notes do not read Quote Report; words N1 does.
const fs=require('fs');const W=f=>JSON.parse(fs.readFileSync(f));const g=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;
const L=W('../g338/rdf/live227b.json'),T=W('target_w1.json');const FMpre=g(L,'Format Markdown'),FMpost=g(T,'Format Markdown');
const mk=M=>n=>{const m=M[n];return m?{isExecuted:true,all:()=>m.map(j=>({json:j})),first:()=>({json:m[0]})}:{isExecuted:false,all:()=>[],first:()=>{throw new Error('no '+n);}};};
const EX=(c,M)=>new Function('$','$input',c)(mk(M),{all:()=>[{json:{}}],first:()=>({json:{}})})[0].json;
const SCN=new Function(fs.readFileSync('scn339.js','utf8')+';return __SCNmk;')();
const GV={text:'For precept [must be] upon precept, precept upon precept; line upon line, line upon line; here a little, [and] there a little: [must be: or, hath been]'};
const S=W('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/a339/sc27_rows.json');let same=0,diff=0,nl=0,bad=0,err=0;const out=[];
for(const r of S.rows.sort((a,b)=>String(a.run_token||a.id)<String(b.run_token||b.id)?-1:1)){const M={'Get Row':[r],'Get Judgments':S.judgments.filter(j=>j.debate_id===r.id),'Get Verse':[GV]};
 let a,b;try{a=EX(FMpre,M).md;}catch(e){a='ERR '+e.message;err++;}try{b=EX(FMpost,M).md;}catch(e){b='ERR '+e.message;err++;}
 if(a===b)same++;else{diff++;const A=a.split('\n'),B=b.split('\n');if(A.length!==B.length)bad++;out.push('== CHANGED '+(r.run_token||r.id));for(let i=0;i<Math.max(A.length,B.length);i++)if(A[i]!==B[i]){nl++;if(!(typeof B[i]==='string'&&B[i].startsWith(String(A[i]).replace(/\s+$/,'')+' [SYSTEM CHECK S-C: ')&&/this line says no side charged it\.\]$/.test(B[i])))bad++;out.push('  NOTE '+B[i].slice(String(A[i]).replace(/\s+$/,'').length+1));}}
 const s0=a.indexOf('## Synthesis\n\n');const s1=a.indexOf('\n\n',a.indexOf('\n\n',s0+14)+2);const s2=a.indexOf('\n\n**Synthesis checks**',s1);const I=[];SCN(r,null,GV.text,I)(a.slice(s1+2,s2));
 out.push('-- S-C '+(r.run_token||r.id));for(const n of I)out.push('   INFO '+n.kind+' | '+(n.kind==='words'?'S-C gram "'+n.hit+'" charge gram "'+(n.gram||'')+'" | at '+n.where:'verses '+n.verses.join('; '))+' | '+(n.note?'NOTE at line '+n.at:'no note: '+n.why)+' | line: '+String(n.line).slice(0,90));}
console.log('runs',S.rows.length,'| identical',same,'| changed',diff,'| errors',err,'| changed lines',nl,'| not PRE+note',bad);out.forEach(l=>console.log(l));
