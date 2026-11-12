// Plants for pkgOHK / pkgOSP (W1). Built from W3's grade_OAD/plant.cjs form. Usage: node plants.cjs <live json> <new json>
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
const C=[
 ['B1 real prefix (pkgOAD form)',R1,P+R1+' COUNTED','R1+'],
 ['B2 prefix no colon',R1,'OUT-OF-ROUND CONCESSIONS '+R1+' COUNTED','R1+'],
 ['B3 prefix with --',R1,'OUT-OF-ROUND CONCESSIONS -- '+R1+' COUNTED','R1+'],
 ['B4 prefix with en dash',R1,'OUT-OF-ROUND CONCESSIONS – '+R1+' COUNTED','R1+'],
 ['B5 bold prefix',R1,'**OUT-OF-ROUND CONCESSIONS:** '+R1+' COUNTED','R1+'],
 ['B6 bullet before prefix',R1,'- '+P+R1+' COUNTED','R1+'],
 ['B7 singular heading',R1,'OUT-OF-ROUND CONCESSION: '+R1+' COUNTED','R1+'],
 ['B8 unhyphenated',R1,'OUT OF ROUND CONCESSIONS: '+R1+' COUNTED','R1+'],
 ['B9 prefix twice',R1,P+P+R1+' COUNTED','R1+'],
 ['B10 lower case, whole quoted','x','"out-of-round concessions: '+R2+' COUNTED"','R2+'],
 ['B11 control: no prefix',R1,R1+' COUNTED','R1+'],
 ['B12 prefix then prose DEFENDER sentence',R1,P+'DEFENDER conceded nothing that touches a link.','SAME'],
 ['B13 prefix: NONE',R1,P+'NONE','SAME'],
 ['B14 prefix + chain mark label','x',P+'DEFENDER CHAIN MARK: BROKEN -- test','SAME'],
 ['B15 prefix + row without bars, flagged line found (old pkgRPS limit, unchanged)',R1,P+'DEFENDER CR4: “I drop the ‘alone’ from D5.” COUNTED','SAME'],
 ['B15b prefix + row without bars, flagged line absent','x',P+'DEFENDER CR4: “I drop the ‘alone’ from D5.” COUNTED','R2+'],
 ['B16 other section word before DEFENDER, kept',R1,'COLLISION POINTS: '+R1+' COUNTED','SAME'],
 ['A1 heading flagged, to = existing row COUNTED',H,R1+' COUNTED','R1+'],
 ['A2 heading flagged, to = prefix + existing row',H,P+R1+' COUNTED','R1+'],
 ['A3 heading flagged, to = new row',H,RN,'ADD'],
 ['A4 bold heading flagged, existing row','**'+H+'**',R2+' COUNTED','R2+','**'+H+'**'],
 ['A5 heading flagged, to = NONE (strike path, unchanged)',H,'NONE','SAME'],
 ['A6 heading flagged, to = prose (unchanged)',H,'The defender conceded nothing more.','SAME'],
 ['A7 heading with colon flagged, new row',H+':',RN,'ADD',H+':'],
 ['A9 heading flagged, prose after DEFENDER (W3 H4)',H,'DEFENDER conceded nothing that touches a link.','NA'],
 ['A10 heading flagged, chain mark label (W3 H5)',H,'DEFENDER CHAIN MARK: BROKEN -- D2 fails.','NA'],
 ['A11 heading flagged, row without bars, no match (W3 H6)',H,'DEFENDER CR4: “I give up D2 entirely.” COUNTED','NA'],
 ['A12 heading flagged, row without bars, existing row',H,'DEFENDER CR4: “I drop the ‘alone’ from D5.” COUNTED','R2+'],
 ['A8 control: flagged row absent, prefix + existing row','some line not there',P+R2+' COUNTED','R2+'],
];
const run=(M,c)=>{const t=text(c[4]);let r;try{r=M.sbApply2024('luna',t,Object.assign({},F),[{sid:'S1',ans:'CHANGE',line:c[1],to:c[2],rule:'K-S3',item:'S1'}],null);}catch(e){return {err:e.message};}
 const base=t.split('\n'),now=String(r.text).split('\n');return {it:(r.items||[]).map(x=>x.kind).join(','),add:now.filter(l=>!base.includes(l)),gone:base.filter(l=>!now.includes(l)),f:r.fields&&[r.fields.verdict_tag,r.fields.conceded_links,r.fields.challenger_conceded_links].join('/'),n:now.length};};
const ok=(e,r,old,c)=>{if(r.err)return false;const h=c[4]||H;if(e==='SAME')return JSON.stringify(r)===JSON.stringify(old);
 if(e==='R1+'||e==='R2+'){const R=e==='R1+'?R1:R2;return !r.it&&r.gone.length===1&&r.gone[0]===R&&r.add.length===1&&r.add[0].startsWith(R)&&/COUNTED$/.test(r.add[0]);}
 if(e==='NA'){return r.it==='NOT APPLIED'&&!r.add.length&&!r.gone.length;}if(e==='ADD'){return !r.it&&r.gone.length===0&&r.add.length===1&&r.add[0]===RN;}return false;};
let p=0;for(const c of C){const a=run(O,c),b=run(N,c);const g=ok(c[3],b,a,c);p+=g;console.log((g?'PASS ':'FAIL ')+c[0]+'\n   live '+JSON.stringify(a)+'\n   new  '+(JSON.stringify(a)===JSON.stringify(b)?'(same)':JSON.stringify(b)));}
console.log(p+'/'+C.length);
