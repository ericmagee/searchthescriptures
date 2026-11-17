// ASK 353 tests. Usage: node tack.cjs [target] [base]. REAL = a stored debate_enforcer_log row (ecol_rows.json, read 08:44Z 11-17); PLANT = made for the test.
const fs=require('fs');const {unpack,rb,load}=require('../tools/lib.cjs');
let fails=0,n=0;const ok=(t,c,d)=>{n++;console.log((c?'ok  ':'FAIL')+' '+t+(d?' :: '+d:''));if(!c)fails++;};
const lw=JSON.parse(fs.readFileSync(process.argv[3]||'live.json')),tw=JSON.parse(fs.readFileSync(process.argv[2]||'target_ack.json'));const lu=unpack(lw),tu=unpack(tw);
const dl=tu.L.map((l,i)=>l!==lu.L[i]?i:-1).filter(i=>i>=0);
ok('library lines changed are 2647, 2688, 3354, 3361, 3406 only, line count unchanged',tu.L.length===lu.L.length&&dl.join()==='2647,2688,3354,3361,3406',dl.join(', '));
ok('no changed line holds a newline',dl.every(i=>!tu.L[i].includes('\n')));
const LN={};for(const x of lw.nodes)LN[x.name]=x;const dn=tw.nodes.filter(x=>JSON.stringify(x)!==JSON.stringify(LN[x.name])).map(x=>x.name);ok('only the Shared Library node changed',dn.join()==='Shared Library',dn.join(', '));
ok('connections and settings unchanged',JSON.stringify(tw.connections)===JSON.stringify(lw.connections)&&JSON.stringify(tw.settings)===JSON.stringify(lw.settings));
const bad=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k]).length!==tu.M[k].n);ok('every MAP entry rebuilds to its n',bad.length===0,Object.keys(tu.M).length+' entries'+(bad.length?' bad: '+bad.join(','):''));
const ch=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k])!==rb(lu.L,lu.M[k]));ok('changed entries are the 3 Judge Enforcer Record and 3 Send Back Record nodes',ch.sort().join()===['Alt Judge Enforcer Record','Alt Send Back Record','Judge Enforcer Record','R2 Alt Judge Enforcer Record','R2 Alt Send Back Record','Send Back Record'].join(),ch.join(', '));
const syn=[];for(const k of ch){try{new Function('$','$input','return (async()=>{\n'+rb(tu.L,tu.M[k])+'\n})();');}catch(e){syn.push(k+': '+e.message);}}ok('syntax of every changed entry',syn.length===0,syn.join('; '));
ok('each changed entry defines ackFoot2024 once',ch.every(k=>rb(tu.L,tu.M[k]).split('function ackFoot2024(').length===2));
const $=()=>({all:()=>[],first:()=>({json:{}}),isExecuted:false});
const TJ=load(rb(tu.L,tu.M['Judge Enforcer Record']),$),LJ=load(rb(lu.L,lu.M['Judge Enforcer Record']),$);
const TS=load(rb(tu.L,tu.M['Send Back Record']),$),LS=load(rb(lu.L,lu.M['Send Back Record']),$);
ok('loaders find ETC, enf428Cure and ackFoot2024',typeof TJ.ETC==='function'&&typeof TS.enf428Cure==='function'&&typeof TJ.ackFoot2024==='function'&&typeof TS.ackFoot2024==='function');
const F=TS.ackFoot2024;
// reader plants (W3 7485 condition 2)
ok('reader: "missing footing" read',F('so the FORCED break is missing footing rather than a meaning')==='missing footing');
ok('reader: "assumed-fact defect" read',F('identify a separate assumed-fact defect rather than')==='assumed-fact');
ok('reader: bare "assumed" in passing NOT read',F('the answer assumed the reading the verse gives, and can agree')===null);
ok('reader: bare "unexhibited" NOT read',F('the premise is unexhibited in the round, but the meaning can agree')===null);
ok('reader: inside a quotation NOT read',F('the ground calls it "missing footing" yet the meaning can agree')===null&&F('the ground says “an assumed fact” and the words agree')===null);
ok('reader: negated NOT read',F('this is not missing footing but a meaning that can agree')===null&&F('the break is not a footing defect')===null&&F('without any assumed fact the words agree')===null);
for(const t of ['the break has no footing defect; the words cannot agree','there is no footing problem here','the line does not rest on an assumed fact','there is no assumed fact in the ground','no unexhibited genealogical fact is named','the enforcer found no footing gap in the line','nothing here is an assumed fact'])ok('reader (W3 7499 F1): a denial NOT read: '+t,F(t)===null,String(F(t)));
ok('reader: "no footing" alone still read',F('the FORCED line has no footing in the record')==='no footing');
ok('reader: "rather than exhibiting" read',/^rather than exhibit/.test(F('the answer asserts the lineage rather than exhibiting it')||''));
// Part A: the enforcer push (ETC) on every stored E-COL DISAGREE
const rows=JSON.parse(fs.readFileSync('ecol_rows.json'));
const parseE=cr=>{const m=String(cr||'').match(/\(right: ([A-Z ]+?)\):\s*([\s\S]*?)(?:\s*\[pkg[A-Z0-9]+ code check:|\s*\(judge wrote |$)/);return m?{right:m[1],why:m[2]}:null;};
const E=rows.filter(r=>r.kind==='enforcer_check');let chA=[];for(const r of E){const p=parseE(r.cure_reason);if(!p)continue;const a=LJ.ETC('E-COL',p.right,p.why,r.flagged_line),b=TJ.ETC('E-COL',p.right,p.why,r.flagged_line);if(String(a)!==String(b))chA.push({id:r.id,right:p.right,live:a,tgt:b});}
const r486=E.find(r=>r.id===42486),p486=parseE(r486.cure_reason);
const f486=r486.flagged_line;ok('REAL 42486 (sol, run 37891): judge line in footing form ("unexhibited genealogical fact" outside quotes); live sends the STANDS push; ASK 353 records it CONTRADICTED, not sent',TJ.ackForm2024(f486)&&LJ.ETC('E-COL',p486.right,p486.why,f486)===null&&/^BROKEN \(its own reason names a footing defect, "missing footing"/.test(TJ.ETC('E-COL',p486.right,p486.why,f486)||''),String(TJ.ETC('E-COL',p486.right,p486.why,f486)).slice(0,120));
const Lmean='FORCED: D1 vs C1 -- MEANS [CR3]: "Mary was with child of the Holy Ghost before any union occurred" -- ANSWER [DR3]: "The finding before the coming together is the finding before the taking under one roof" -- FAILS: "the taking under one roof" -- GROUND: [L1] Matthew 1:18 "before they came together, she was found with child of the Holy Ghost"';
ok('PLANT judge meaning line (no footing form) + enforcer reason saying "missing footing": sent as live (W2 7492 condition 1)',!TJ.ackForm2024(Lmean)&&TJ.ETC('E-COL','STANDS',p486.why,Lmean)===LJ.ETC('E-COL','STANDS',p486.why,Lmean));
ok('PLANT judge line whose footing words stand only inside its quotations: not footing form',!TJ.ackForm2024('FORCED: D1 vs C1 -- MEANS [CR3]: "the missing footing of the claim" -- GROUND: [L1] Matthew 1:18 "x"'));
ok('PLANT judge line with ASSUMES: is footing form',TJ.ackForm2024('D4 vs C4 (Romans 1:3): DEFENDER LINK BROKEN -- ASSUMES: "Mary was of David" -- GROUND: [L1] Romans 1:3 "x"'));
ok('PLANT meaning DISAGREE using "assumed" in passing still goes back as STANDS (W3 7485 condition 2)',TJ.ETC('E-COL','STANDS','the answer\'s words "of the house of David" can agree with the pressed meaning; the judge assumed a conflict the verse does not state -- CARRIED BY: Luke 1:27 "to a man whose name was Joseph, of the house of David"',f486)===null);
ok('PLANT the same footing reason on E-HOLD, E-KEY and on right BROKEN: unchanged',['E-HOLD','E-KEY'].every(k=>String(TJ.ETC(k,'STANDS',p486.why,f486))===String(LJ.ETC(k,'STANDS',p486.why,f486)))&&String(TJ.ETC('E-COL','BROKEN',p486.why,f486))===String(LJ.ETC('E-COL','BROKEN',p486.why,f486)));
ok('REPLAY Part A over '+E.length+' stored E-COL enforcer rows: changes are 42486 only (42492, the second line of the same seat, says "the given genealogical fact", not a footing form, and stays HELD by pkgECW live)',chA.length===1&&chA[0].id===42486,chA.map(x=>x.id+' '+x.right).join('; '));
// Part B: the send-back cure on every stored E-COL send-back (rounds not read: R={} on both sides, so only the withdrawal branch can differ)
const parseS=rl=>{const s=String(rl||'').replace(/^SENDBACK:\s*S\d+\s*\|\|\s*/,'');const m=s.match(/^CHANGE TO:\s*([\s\S]*?)\s*\|\|\s*([\s\S]*)$/);if(m)return {ans:'CHANGE',to:m[1],why:m[2]};const k=s.match(/^KEEP\s*\|\|\s*([\s\S]*)$/);if(k)return {ans:'KEEP',why:k[1]};return null;};
const SB=rows.filter(r=>r.kind==='send_back');let chB=[],nS=0;const cure=(M,r)=>{const a=parseS(r.response_line);if(!a)return null;return M.enf428Cure({rule:'E-COL',line:r.flagged_line,item:r.item,reason:r.cure_reason},a,{},null);};
const res={};for(const r of SB){const a=cure(LS,r),b=cure(TS,r);if(!a)continue;nS++;res[r.id]={a,b};if(a.status!==b.status||a.why!==b.why)chB.push({id:r.id,stored:r.cure_status,live:a.status,tgt:b.status,why:b.why});}
const st=id=>res[id]?res[id].b.status+': '+res[id].b.why.slice(0,110):'not parsed';
ok('REAL 42554 (sol, run 37891): RETRACTED with "assumed-fact defect" in its reason reads UNCURED',res[42554]&&res[42554].b.status==='UNCURED'&&/footing defect \("assumed-fact"\)/.test(res[42554].b.why),st(42554));
ok('REAL 42680 to 42683 (grok meaning withdrawals): still CURED, same reason as live',[42680,42681,42682,42683].every(i=>res[i]&&res[i].b.status==='CURED'&&res[i].a.status==='CURED'),[42680,42681,42682,42683].map(i=>i+' '+st(i)).join(' | '));
ok('PLANT RETRACTED whose reason says "missing footing" on a judge meaning line (no footing form): CURED as live',(()=>{const it={rule:'E-COL',line:Lmean,item:'x',reason:''},a={ans:'CHANGE',to:'RETRACTED: D1 vs C1',why:'the break is missing footing'};return TS.enf428Cure(it,a,{},null).status==='CURED'&&JSON.stringify(TS.enf428Cure(it,a,{},null))===JSON.stringify(LS.enf428Cure(it,a,{},null));})());
ok('REAL 18229 and 18231 (RETRACTED holding FORCED, no footing words): CURED, now as CHANGE TO RETRACTED',[18229,18231].every(i=>res[i]&&res[i].b.status==='CURED'&&res[i].b.why==='CHANGE TO RETRACTED'),[18229,18231].map(i=>i+' '+st(i)).join(' | '));
ok('REAL 18233 (RETRACTED holding FORCED, no footing words): stored UNCURED, ASK 353 CURED as a retraction (stated change)',res[18233]&&res[18233].b.status==='CURED'&&SB.find(r=>r.id===18233).cure_status==='UNCURED',st(18233));
ok('PLANT RETRACTED with "missing footing" on a grt2 item: CURED (pkgGRT2 companion kept)',TS.enf428Cure({rule:'E-COL',line:r486.flagged_line,item:'x',reason:'',grt2:true},{ans:'CHANGE',to:'RETRACTED: D4 vs C4',why:'the break is missing footing'},{},null).status==='CURED');
ok('PLANT CHANGE TO STANDS whose reason says "missing footing": UNCURED',TS.enf428Cure({rule:'E-COL',line:r486.flagged_line,item:'x',reason:''},{ans:'CHANGE',to:'D4 vs C4 (Romans 1:3): STANDS -- x',why:'the defect is missing footing, not meaning'},{},null).status==='UNCURED');
ok('PLANT CHANGE TO STANDS whose reason says "not a footing defect": CURED as live',(()=>{const it={rule:'E-COL',line:r486.flagged_line,item:'x',reason:''},a={ans:'CHANGE',to:'D4 vs C4 (Romans 1:3): STANDS -- x',why:'this is not a footing defect; the words agree'};return JSON.stringify(TS.enf428Cure(it,a,{},null))===JSON.stringify(LS.enf428Cure(it,a,{},null));})());
ok('PLANT a KEEP that names "missing footing": same as live (KEEP path untouched)',(()=>{const it={rule:'E-COL',line:r486.flagged_line,item:'x',reason:''},a={ans:'KEEP',why:'the break is missing footing'};return JSON.stringify(TS.enf428Cure(it,a,{},null))===JSON.stringify(LS.enf428Cure(it,a,{},null));})());
const exp=new Set([42554,18229,18231,18233]);const other=chB.filter(x=>!exp.has(x.id));
console.log('REPLAY Part B (rounds not read on either side, so 42554 reads UNCURED on live too here; the stored CURED came from both() with rounds): '+nS+' parsed of '+SB.length+' stored E-COL send-backs; status or reason changed on '+chB.length+': '+chB.map(x=>x.id+' '+x.live+'->'+x.tgt+' (stored '+x.stored+')').join('; '));
const stc=chB.filter(x=>x.live!==x.tgt);ok('REPLAY Part B: the only rows whose status or reason changes are 42554, 18229, 18231, 18233',other.length===0&&chB.length===4,'status changes: '+stc.map(x=>x.id+' '+x.live+'->'+x.tgt).join(', ')+'; other: '+other.map(x=>x.id).join(','));
console.log('\nNOTE (W1 7488 item 4): 42680 to 42683 come from grok pushes 42659 to 42662. Under ASK 355 those pushes are HELD (CARRIED BY is the line\'s own verse), so in a run with both ASKs those send-backs are not issued: a combined replay shows them as NOT SENT, not UNCURED. The test above checks the ASK 353 cure code alone.');
console.log('\n'+(n-fails)+'/'+n+' OK');process.exit(fails?1:0);
