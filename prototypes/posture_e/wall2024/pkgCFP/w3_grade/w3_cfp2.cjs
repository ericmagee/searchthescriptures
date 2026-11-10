// W3 regrade of pkgCFP rev 2: (A) rev 2 against rev 1 on every stored run; (B) new planted Anticheat Record rows on 33644.
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness,D}=require(process.cwd()+'/pkgGSL/harness.cjs');
const code=(f,n)=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;d=d.workflow||d;return d.nodes.find(x=>x.name===n).parameters.jsCode;};
const LIVE=code('/mnt/project-files/wall2024/fetchback_live_s105.json','Judge Contradiction Build'),R1=code('pkgCFP/parent_s105_CFP.json','Judge Contradiction Build'),R2=code('pkgCFP/parent_s105_CFP2.json','Judge Contradiction Build'),REC=code('/mnt/project-files/wall2024/fetchback_live_s105.json','Judge Contradiction Record');
const J=(r,n)=>{const f=D+r+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const x=Array.isArray(d)?d[0]:d;const m=(x.data&&x.data.main)||x.main;return m&&m[0]&&m[0][0]?m[0][0].json:null;};
const build=(c,r,over)=>{try{return harness(r,over||{})(c,'Panel Payloads')[0].json;}catch(e){return {err:e.message};}};
const record=(r,b,line)=>harness(r,{'Judge Contradiction Build':[{json:b}],'Judge Contradiction Call deepseek':[{json:{choices:[{message:{content:line}}]}}]})(REC,'Judge Contradiction Call deepseek')[0].json;
const ac=b=>(b.cands||[]).filter(c=>/anti-cheat check/.test(c.by));
console.log('== A. rev 2 against rev 1, every stored run with Panel Payloads ==');
const runs=[...new Set(fs.readdirSync(D).filter(f=>/_Panel_Payloads\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();let same=0,lab=0,other=0;
for(const r of runs){const a=build(R1,r),b=build(R2,r);const strip=x=>JSON.stringify((x.cands||[]).map(c=>[c.id,c.side,c.earlier_round,c.earlier_q,c.closing_round,c.closing_q]));
 if(JSON.stringify(a)===JSON.stringify(b)){same++;continue;}if(strip(a)===strip(b)&&a.cec_skip===b.cec_skip){lab++;const m=(b.cands||[]).filter((c,i)=>c.by!==a.cands[i].by);console.log(r+': same candidates and quotes; '+m.length+' label(s) differ, e.g. "'+m[0].by+'"');continue;}other++;console.log(r+': CANDIDATES DIFFER\n  rev1 '+strip(a).slice(0,300)+'\n  rev2 '+strip(b).slice(0,300));}
console.log('A: '+runs.length+' runs; byte-equal '+same+'; only the merged label differs '+lab+'; candidates differ '+other);
console.log('\n== B. plants on 33644 ==');
const r='33644',F=J(r,'Final Output');
const sents=t=>String(t||'').split(/\n+|(?<=[.!?])\s+/).map(s=>s.trim()).filter(s=>s.split(/\s+/).length>=9&&s.split(/\s+/).length<=30&&!/["“”]/.test(s)&&!/\.\.\.|…/.test(s));
const s1=sents(F.cr1),s2=sents(F.cr2),s3=sents(F.cr3),s4=sents(F.cr4);const w=(s,a,b)=>s.split(' ').slice(a,b).join(' ');
const tail=t=>String(t).trim().replace(/["“”]/g,'').split(/\s+/).slice(-5).join(' '),head=t=>String(t).trim().replace(/["“”]/g,'').split(/\s+/).slice(0,5).join(' ');const cross=tail(F.cr1)+' '+head(F.cr2);
const show=b=>ac(b).map(c=>c.id+' '+c.side+' ['+c.earlier_round+'] "'+c.earlier_q.slice(0,70)+'" / ['+c.closing_round+'] "'+c.closing_q.slice(0,60)+'" by "'+c.by+'"').join('\n      ')||'NO ANTI-CHEAT CANDIDATE';
const P=(name,rev,extra,more)=>{const over={'Anticheat Record':[{json:{acx:{reversed:rev}}}],...(extra||{})};const a=build(R1,r,over),b=build(R2,r,over);let x='';try{x=more?more(b,over):'';}catch(e){x=' | CHECK THREW '+e.message;}
 console.log(name+'\n    rev 1: '+(ac(a).length?ac(a).length+' candidate(s)':'NO ANTI-CHEAT CANDIDATE')+(a.cec_skip&&/failed/.test(a.why)?' BUILD FAILED':'')+'\n    rev 2: '+show(b)+(b.cec_skip?' (skip: '+b.why+')':'')+x);};
const conf=(b)=>{const c=ac(b)[0];if(!c)return '';const o=record(r,b,'CLOSE-CONTRADICTION: '+c.id+' -- '+c.side+' -- LINK '+(b.links[c.side]||[])[0]+' -- CONFIRMED -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "'+c.closing_q+'" -- planted.');return '\n      record, the candidate\'s quotes copied: '+JSON.stringify((o.jcc.rows||[]).map(x=>[x.id,x.status,x.note||'']));};
P('Q1 earlier = a CR2 part of 12 words ... a CR3 part of 6 words (the anti-cheat test passes it)',{D:[{earlier_q:w(s2[1],0,12)+' ... '+w(s3[1],0,6),close_q:s4[1]}],C:[]},null,conf);
P('Q2 earlier = a part that runs from the end of CR1 into the start of CR2 ... a CR3 part of 7 words',{D:[{earlier_q:cross+' ... '+w(s3[1],0,7),close_q:s4[1]}],C:[]},null,conf);
P('Q3 earlier = only a part that runs from the end of CR1 into the start of CR2 (the stated limit)',{D:[{earlier_q:cross,close_q:s4[1]}],C:[]},null,(b)=>' | any trace of the pair in the output: '+/anti-cheat/.test(JSON.stringify({...b,body:null})));
P('Q4 earlier = a part crossing CR1 into CR2 ... a three-word part of CR3',{D:[{earlier_q:cross+' ... '+w(s3[1],0,3),close_q:s4[1]}],C:[]},null,conf);
P('Q5 earlier = a CR2 part of 8 words ... words found nowhere (under five words, ignored by the anti-cheat test)',{D:[{earlier_q:w(s2[2],0,8)+' ... zebra quartz',close_q:s4[1]}],C:[]},null,conf);
P('Q6 both quotes with an ellipsis across sentences',{D:[{earlier_q:w(s2[0],0,7)+' … '+w(s2[3],0,9),close_q:w(s4[0],0,6)+' ... '+w(s4[3],0,8)}],C:[]},null,conf);
P('Q7 closing = a part found only in CR3 ... a CR4 part of 6 words',{D:[{earlier_q:s2[1],close_q:w(s3[2],0,9)+' ... '+w(s4[2],0,6)}],C:[]},null,conf);
P('Q8 closing quote found nowhere in CR4 (cannot be shown by the anti-cheat test)',{D:[{earlier_q:s2[1],close_q:'zebra quartz violet anchor seven'}],C:[]},null,null);
P('Q9 three parts, the longest standing only in CR3, the first in CR1',{D:[{earlier_q:w(s1[1],0,5)+' ... '+w(s3[1],0,11)+' ... '+w(s2[1],0,6),close_q:s4[1]}],C:[]},null,conf);
P('Q10 the pair is also a judge\'s contradiction question (question round)',{D:[{earlier_q:s2[1],close_q:s4[1]}],C:[]},{'QR Merge':[{json:{qa:[{judge:'luna',side:'DEFENDER',earlier_round:'CR2',earlier_quote:s2[1],round:'CR4',quote:s4[1]}]}}]},null);
P('Q11 two shown pairs whose fitted parts are the same sentence pair',{D:[{earlier_q:w(s2[1],0,12)+' ... '+w(s3[1],0,6),close_q:s4[1]},{earlier_q:w(s2[1],0,12)+' ... '+w(s3[4],0,6),close_q:s4[1]}],C:[]},null,null);
P('Q12 challenger pair with an ellipsis earlier quote across DR1 sentences',{D:[],C:[{earlier_q:w(sents(F.gr1)[0],0,7)+' ... '+w(sents(F.gr1)[3],0,9),close_q:sents(F.dr4)[1]}]},null,conf);
