// pkgCLP plants (W1, ASK 141-1). Harness from pkgOHK_OSP/plants.cjs. Usage: node plants.cjs <live json> <new json>
const fs=require('fs');
const gr=f=>{const w=JSON.parse(fs.readFileSync(f));const T=w.nodes.find(x=>x.name=="Shared Library").parameters.jsCode;
 const M=JSON.parse(T.slice(T.lastIndexOf("\n/*MAP*/")+8,T.lastIndexOf("\n/*END*/")));const Lb=JSON.parse(T.slice(T.indexOf("\n/*LIB*/")+8,T.lastIndexOf("\n/*MAP*/")));
 const src=M['Gate Record'].p.map(e=>typeof e==="number"?Lb[e]:typeof e[0]==="string"?e[0]:Lb.slice(e[0],e[1]+1).join("\n")).join("\n").split('\n');
 const k=src.findIndex(l=>/\$\('/.test(l));return new Function('$input','$',src.slice(0,k).join('\n')+'\nreturn {sbApply2024};')({all:()=>[]},()=>({first:()=>({json:{}}),all:()=>[]}));};
const O=gr(process.argv[2]),N=gr(process.argv[3]);
const R1='DEFENDER | [CR4] | “D5: NARROWED TO: Galatians 4:4 and Genesis 3:15 name the woman as the human source of the Son.”';
const R2='DEFENDER | [CR4] | “I drop the ‘alone’ from D5.”';
const R3='CHALLENGER | [DR4] | “I grant that Matthew 1:16 does not name a begetter.” TOUCHES NO LINK';
const R4='DEFENDER | [CR2] | “I grant that Luke 2:27, 2:41 and 2:48 put Joseph in the father\'s place.” COUNTED';
const RN='DEFENDER | [CR4] | “I give up D2 entirely.” COUNTED';
const H='OUT-OF-ROUND CONCESSIONS';
const text=(h)=>['VERDICT: HELD','DEFENSE: SELF-SUPPORTED','CONCEDED LINKS: 0','COLLISION POINTS','D1 VS C1: UNDERDETERMINED -- both exhibit rows.',h||H,R1,R2,R3,R4,'RULING CARD: none.'].join('\n');
const F={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:0};
const P='OUT-OF-ROUND CONCESSIONS: ';
// [name, flagged line, change to, expected NEW outcome, heading text (optional)]
// expected: 'R1+' = R1 replaced by its COUNTED form; 'ADD' = new row added under the heading, heading kept; 'NA' = NOT APPLIED; 'SAME' = same as live
const L='x';/* flagged line is the enforcer's item label, not a judge line (the 35856 S6 form) */
const C=[
 ['C1 35856 form: CONCEDED -- before a barred row',L,'CONCEDED -- '+R2+' COUNTED','R2+'],
 ['C2 CONCEDED: before a barred row',L,'CONCEDED: '+R2+' COUNTED','R2+'],
 ['C3 bold CONCEDED with em dash',L,'**CONCEDED** — '+R2+' COUNTED','R2+'],
 ['C4 bullet then CONCEDED --',L,'- CONCEDED -- '+R2+' COUNTED','R2+'],
 ['C5 lower case conceded:',L,'conceded: '+R2+' COUNTED','R2+'],
 ['G1 guard: CONCEDED LINKS: 1',L,'CONCEDED LINKS: 1','SAME'],
 ['G2 guard: CONCEDED LINKS: before a barred row',L,'CONCEDED LINKS: '+R2+' COUNTED','SAME'],
 ['G3 guard: CONCEDED LINKS: NONE',L,'CONCEDED LINKS: NONE','SAME'],
 ['G4 guard: CONCEDED: D2',L,'CONCEDED: D2','SAME'],
 ['G5 guard: key-word answer opening CONCEDED',L,'CONCEDED as to the exclusion from those rows, and REASSERTED IN [CR4] "I keep D1 to D6 as declared."','SAME'],
 ['G6 guard: CONCEDED -- then DEFENDER prose, no bar',L,'CONCEDED -- DEFENDER grants the husband\'s standing.','SAME'],
 ['G7 guard: flagged line found, CONCEDED -- row',R1,'CONCEDED -- '+R1+' COUNTED','R1+'],
 ['G8 control: OUT-OF-ROUND prefix still stripped',L,'OUT-OF-ROUND CONCESSIONS: '+R2+' COUNTED','R2+'],
 ['G9 control: COLLISION POINTS: kept (plant B16)',R1,'COLLISION POINTS: '+R1+' COUNTED','SAME'],
];
const run=(M,c)=>{const t=text(c[4]);let r;try{r=M.sbApply2024('luna',t,Object.assign({},F),[{sid:'S1',ans:'CHANGE',line:c[1],to:c[2],rule:'K-S3',item:'S1'}],null);}catch(e){return {err:e.message};}
 const base=t.split('\n'),now=String(r.text).split('\n');return {it:(r.items||[]).map(x=>x.kind).join(','),add:now.filter(l=>!base.includes(l)),gone:base.filter(l=>!now.includes(l)),f:r.fields&&[r.fields.verdict_tag,r.fields.conceded_links,r.fields.challenger_conceded_links].join('/'),n:now.length};};
const ok=(e,r,old,c)=>{if(r.err)return false;const h=c[4]||H;if(e==='SAME')return JSON.stringify(r)===JSON.stringify(old);
 if(e==='R1+'||e==='R2+'){const R=e==='R1+'?R1:R2;return !r.it&&r.gone.length===1&&r.gone[0]===R&&r.add.length===1&&r.add[0].startsWith(R)&&/COUNTED$/.test(r.add[0]);}
 if(e==='NA'){return r.it==='NOT APPLIED'&&!r.add.length&&!r.gone.length;}if(e==='ADD'){return !r.it&&r.gone.length===0&&r.add.length===1&&r.add[0]===RN;}return false;};
let p=0;for(const c of C){const a=run(O,c),b=run(N,c);const g=ok(c[3],b,a,c);p+=g;console.log((g?'PASS ':'FAIL ')+c[0]+'\n   live '+JSON.stringify(a)+'\n   new  '+(JSON.stringify(a)===JSON.stringify(b)?'(same)':JSON.stringify(b)));}
console.log(p+'/'+C.length);
