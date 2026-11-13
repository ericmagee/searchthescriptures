// W1 pkgTWC (ASK 167, part A; operator chose "Both forfeit, after 2 confirmations" 21:08 CST 11-12): a closing contradiction is
// CONFIRMED only when two independent DeepSeek checks confirm it. Close Enforcer Build sends each side's check twice, side by side
// in the group batch (the second at temperature 0.6, with no sight of the first); Close Enforcer Record keeps a CONFIRMED line only
// when the other check also confirms the same side and link. A check that fails or is missing confirms nothing.
// Part B (the challenger's forfeit of the debate) is a separate package.
// usage: node pkgTWC/build.cjs <parent in> <parent out>
const fs=require('fs');const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const ed=(nm,pairs)=>{const n=W.nodes.find(x=>x.name===nm);let s=n.parameters.jsCode;const s0=s;for(const [a,b,w] of pairs){const c=s.split(a).length-1;if(c!==1)throw new Error(nm+': anchor '+w+' found '+c);s=s.replace(a,()=>b);}
 new Function('$','$input','$execution','return (async()=>{'+s+'})');n.parameters.jsCode=s;console.log(nm,'+'+(s.length-s0.length));return s.length-s0.length;};
let d=0;
d+=ed('Close Enforcer Build',[[
"out.push({json:{cec_skip:false,side:sd,body,links,cands:cs,missing_rounds:miss,model:ds.api_model,run_token:S.run_token}});}",
"out.push({json:{cec_skip:false,side:sd,body,links,cands:cs,missing_rounds:miss,model:ds.api_model,run_token:S.run_token,copy:1}});out.push({json:{cec_skip:false,side:sd,body:{...body,temperature:0.6},links,cands:cs,missing_rounds:miss,model:ds.api_model,run_token:S.run_token,copy:2}});} /* pkgTWC: each side checked twice, independently */",'push']]);
d+=ed('Close Enforcer Record',[
["const links=B.links||{};const cands=BA.flatMap(b=>b.cands||[]);const prompt=BA.map(",
 "const links=B.links||{};const cands=BA.filter(b=>b.copy!==2).flatMap(b=>b.cands||[]);const __two=BA.some(b=>b.copy===2); /* pkgTWC */const prompt=BA.filter(b=>b.copy!==2).map(",'cands'],
["const o={side:b.side||('call '+(k+1)),",
 "const o={copy:b.copy||1,side:(b.side||('call '+(k+1)))+(b.copy===2?' (second check)':''),",'rp side'],
["const row={id:m[1].replace(/\\s+/g,'').toUpperCase(),side,",
 "const row={copy:rp.copy,id:m[1].replace(/\\s+/g,'').toUpperCase(),side,",'row copy'],
["const seen=new Set();const confirmed=[];",
 "if(__two)rows.forEach(x=>{if(x.status!=='CONFIRMED')return;if(rows.some(y=>y!==x&&y.copy!==x.copy&&y.status==='CONFIRMED'&&y.side===x.side&&y.link===x.link))return;x.status='NOT CONFIRMED (one check of two)';x.note=(x.note?x.note+'; ':'')+'the other independent check did not confirm '+x.side+' LINK '+x.link+' (pkgTWC: two confirmations needed)';});if(__two)rows.forEach(x=>{if(x.copy===2&&x.status==='CONFIRMED')x.status='CONFIRMED (second check)';}); /* W2: one ledger row per link */\nconst seen=new Set();const confirmed=[];",'two'],
["const no_answer=cands.map(c=>c.id).filter(id=>!answered.has(id));",
 "const no_answer=[...new Set(cands.map(c=>c.id))].filter(id=>!answered.has(id));",'no_answer']]);
const s=JSON.stringify(raw);fs.writeFileSync(fout,s);console.log('code +'+d,'sha256',require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16));
