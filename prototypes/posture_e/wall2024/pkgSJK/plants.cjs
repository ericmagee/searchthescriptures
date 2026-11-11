// pkgSJK plants on 35067: edit the single judge's text (independent_verdict_raw in every node output that carries it), run Build Save Body
// (base = s133 + pkgNBR rev 2, and pkgSJK), and read how the planted item is stored in review_notes.
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const un=p=>{let j=JSON.parse(fs.readFileSync(p));j=j.data||j;return j.workflow||j};const cd=(p)=>un(p).nodes.find(x=>x.name==='Build Save Body').parameters.jsCode;
const A=cd('/tmp/claude-0/cmx/nbr2.json'),B=cd(process.argv[2]||'/tmp/claude-0/cmx/sjk.json');
const raw0=JSON.parse(fs.readFileSync(P+'ex35067_full.json','utf8')).data.resultData.runData['Get Row'][0].data.main[0][0].json.independent_verdict_raw;
const s3r=raw0.match(/ITEM: (S3 [^;]+); RULE: K-S3; RESULT: CURED[^\n]*?; LINE: ((?:DEFENDER|CHALLENGER) [CD]R\d): ([^;]{20,60})/);
const kwr=raw0.match(/ITEM: ([^;]+#\d+); RULE: K-W; RESULT: CURED/);
const flag=(item,q)=>'[AUDIT v30: WITHDRAWAL TO ANSWER (K-W; ruling 421) -- '+item+': "'+q+'"; the judge answers STANDS WITHOUT IT because <layer>, or CONCEDED. REVIEW THIS ROW.]';
const rep=(item,res)=>'[AUDIT v21: DEBATE RULE VIOLATION REPORT -- SEAT: grok; ITEM: '+item+'; RULE: K-W; RESULT: '+res+'; WHY: planted; LINE: x]';
const PL0={
 P0_none:[t=>t,null],
 P0_S3_control:[t=>t,null],
 P0_KW_control:[t=>t,null],
 P1_S3_report_uncured:[t=>t.replace('ITEM: '+s3r[1]+'; RULE: K-S3; RESULT: CURED','ITEM: '+s3r[1]+'; RULE: K-S3; RESULT: UNCURED'),s3r[3].slice(0,25)],
 P2_KW_report_uncured:[t=>t.replace('ITEM: '+kwr[1]+'; RULE: K-W; RESULT: CURED','ITEM: '+kwr[1]+'; RULE: K-W; RESULT: UNCURED'),kwr[1]+':'],
 P3_KW_bracket_cured:[t=>t+'\n'+flag('DEFENDER CR3 LINK 9 [premise 2] #99','I drop planted one.')+'\n'+rep('DEFENDER CR3 LINK 9 [premise 2] #99','CURED')+'\n','LINK 9 [premise 2] #99'],
 P4_KW_bracket_uncured:[t=>t+'\n'+flag('DEFENDER CR3 LINK 9 [premise 2] #99','I drop planted one.')+'\n'+rep('DEFENDER CR3 LINK 9 [premise 2] #99','UNCURED')+'\n','LINK 9 [premise 2] #99'],
 P5_KW_open_bracket_cured:[t=>t+'\n'+flag('DEFENDER CR3 LINK 9 [premi #98','I drop planted two.')+'\n'+rep('DEFENDER CR3 LINK 9 [premi #98','CURED')+'\n','LINK 9 [premi #98'],
 P6_KW_plain_cured:[t=>t+'\n'+flag('DEFENDER CR3 LINK 9 #97','I drop planted three.')+'\n'+rep('DEFENDER CR3 LINK 9 #97','CURED')+'\n','LINK 9 #97']};
const PL=Object.assign({},PL0,{P0_S3_control:[t=>t,s3r[3].slice(0,25)],P0_KW_control:[t=>t,kwr[1]+':']});const set=(rd,f)=>{for(const v of Object.values(rd)){for(const r of v){try{for(const it of r.data.main[0]){if(it.json&&typeof it.json.independent_verdict_raw==='string')it.json.independent_verdict_raw=f(it.json.independent_verdict_raw);}}catch(e){}}}};
const look=(o,tag)=>{const j=JSON.parse(JSON.stringify(o));const s=(Array.isArray(j)?j[0]:j);const rn=((s.json||s).saveBody||{}).review_notes||'';const its=rn.split(/ (?=\[(?:EXTRACTOR|AUDIT) v\d+)/);const h=its.filter(x=>/SINGLE JUDGE/.test(x)&&x.includes(tag));return h.length?h.map(x=>/CURED by the single judge/.test(x)?'Cured':/REVIEW THIS ROW/.test(x)?'Review':'?').join(','):'absent';};
console.log('S3 report used:',s3r[1],'|',s3r[2],s3r[3].slice(0,40));console.log('K-W report used:',kwr[1]);
(async()=>{for(const [k,[f,tag]] of Object.entries(PL)){const rd=JSON.parse(fs.readFileSync(P+'ex35067_full.json','utf8')).data.resultData.runData;set(rd,f);
 if(!tag){const a=await run(A,'Build Save Body',rd),b=await run(B,'Build Save Body',rd);const c=o=>(JSON.stringify(o).match(/CURED by the single judge/g)||[]).length;console.log(k.padEnd(26),'cured texts base',c(a),'SJK',c(b));continue;}
 const a=await run(A,'Build Save Body',rd),b=await run(B,'Build Save Body',rd);console.log(k.padEnd(26),'base',look(a,tag).padEnd(10),'SJK',look(b,tag));}})();
