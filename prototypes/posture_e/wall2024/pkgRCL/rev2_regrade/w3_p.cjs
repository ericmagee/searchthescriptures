const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const src=(f,n)=>g(f).nodes.find(x=>x.name===n).parameters.jsCode;
const LIVE='/mnt/project-files/wall2024/fetchback_live_s119.json',RCL='/mnt/project-files/wall2024/parent_s119_RCL2.json',CLK='/mnt/project-files/wall2024/parent_s119_CLK3.json';
const load=ex=>JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+ex,'utf8')).data.resultData.runData;
const Fof=rd=>rd['Regrade Load']?rd['Regrade Load'][0].data.main[0][0].json.f:rd['Final Output'][0].data.main[0][0].json;
const build=async(file,rd)=>{const b=await run(src(file,'Close Enforcer Build'),'Close Enforcer Build',JSON.parse(JSON.stringify(rd)));if(b.err)return {err:b.err};return b.map(x=>x.json||x);};
const cs=b=>b.err?('ERR '+b.err):b.flatMap(x=>x.cands||[]).filter(c=>/pkgRCL/.test(c.by)).map(c=>c.id+' '+c.side+' L'+c.n+' ['+c.earlier_round+'] "'+c.earlier_q.slice(0,60)+'" | "'+c.closing_q.slice(0,70)+'" | '+c.why.slice(0,70));
const line=(c,v)=>'CLOSE-CONTRADICTION: '+c.id+' -- '+c.side+' -- LINK '+c.n+' -- '+v+' -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "'+c.closing_q+'" -- planted';
const rec=async(recFile,rd,b)=>{rd=JSON.parse(JSON.stringify(rd));rd['Close Enforcer Build'][rd['Close Enforcer Build'].length-1].data.main[0]=b.map(x=>({json:x}));const c=b.flatMap(x=>x.cands||[]).filter(c=>/pkgRCL/.test(c.by));const call=rd['Close Enforcer Call deepseek'];const m=call[call.length-1].data.main[0][0].json.choices[0].message;m.content=m.content+'\n'+c.map(x=>line(x,'CONFIRMED')).join('\n');
 const o=await run(src(recFile,'Close Enforcer Record'),'Close Enforcer Record',rd);if(o.err)return 'ERR '+o.err;const j=(o[0]&&(o[0].json||o[0]))||{};const C=j.cec||j;return {rows:(C.rows||[]).map(r=>[r.id,r.link,r.status,(r.note||'').slice(0,70)].join('|')),confirmed:(C.confirmed||[]).map(x=>x.side+' '+x.link)};};
const P=async(name,ex,mut,opt={})=>{const rd=load(ex);const F=Fof(rd);if(mut)mut(F);const b=await build(RCL,rd);console.log('##',name);const c=cs(b);console.log(Array.isArray(c)&&c.length?c.join('\n'):c.length?c:'(no pkgRCL candidate)');if(opt.rec&&!b.err)for(const [n,f] of [['live Record',LIVE],['CLK3 Record',CLK]])console.log(' ',n,JSON.stringify(await rec(f,rd,b)));};
const TOP='My chain stands as declared, D1 to D6.';
(async()=>{
await P('P0 stored 34852, all CONFIRMED','ex34852_full.json',null,{rec:true});
await P('P1 mixed: declared and narrowed named apart','ex34852_full.json',F=>{if(!F.cr4.includes(TOP))console.log('!!');F.cr4=F.cr4.replace(TOP,'I keep D2, D4 and D6 as declared and D1, D3 and D5 as narrowed in round 3.').replace('I keep D1 to D6 as declared.','');});
await P('P2 only the last-line sentence (D6 block), all CONFIRMED','ex34852_full.json',F=>{F.cr4=F.cr4.replace(TOP,'My answers follow.');},{rec:true});
await P('P3 only concession is round 2 "(D4)" form','ex34852_full.json',F=>{F.cr2=F.cr2.replace('### LINK 4 (D4): SUPPORTED','### LINK 4 (D4): CONCEDED as written');F.cr3=F.cr3.replace(/NARROWED TO:/g,'SUPPORTED.');});
await P('P4 narrowed in round 2, SUPPORTED in round 3','ex34852_full.json',F=>{F.cr2=F.cr2+'\n\n**LINK 2: NARROWED TO:** Mary was a virgin at the announcement.\n';F.cr3=F.cr3.replace(/NARROWED TO:/g,'SUPPORTED.');},{rec:true});
await P('P5 34626 six candidates, all CONFIRMED','ex34626_full.json',null,{rec:true});
await P('P6a empty close','ex34852_full.json',F=>{F.cr4='';});
await P('P6b no declared chain','ex34852_full.json',F=>{F.cr1=F.cr1.replace(/DECLARED CHAIN/g,'MY CHAIN');});
await P('P6c no narrowing','ex34852_full.json',F=>{F.cr3=F.cr3.replace(/NARROWED TO:/g,'SUPPORTED.');});
for(const ex of ['ex34726_full.json','ex34780_full.json']){const rd=load(ex);const a=await build(LIVE,rd),b=await build(RCL,rd);console.log('## P7',ex,'byte-equal to live',JSON.stringify(a)===JSON.stringify(b));}
await P('P8 challenger: LINK 2 narrowed in DR3, close keeps C1 to C5 as declared','ex34852_full.json',F=>{F.dr3=F.dr3.replace('**LINK 2: SUPPORTED.**','**LINK 2: NARROWED TO:**');F.dr4=F.dr4+'\n\nMy chain stands as declared, C1 to C5.\n';},{rec:true});
})();
