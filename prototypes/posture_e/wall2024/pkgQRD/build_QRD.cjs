// pkgQRD (W2): item C option 1 (operator 10:45 CST 11-10). A judge whose contradiction question repeats an earlier judge's (same debater, same
// closing and earlier rounds, one quote inside the other) is returned once with one sentence asking for a different contradiction, if any.
// QR Check and QR Final only. Usage (from wall2024/): node pkgQRD/build_QRD.cjs <fetch-back> <out write file>
const fs=require('fs');const [,,FB,OUT]=process.argv;const d=JSON.parse(fs.readFileSync(FB,'utf8'));let w=d.data||d;w=w.workflow||w;
const node=n=>w.nodes.find(x=>x.name===n);const size={};
const ed=(name,pairs)=>{const n=node(name);let c=n.parameters.jsCode;const c0=c;for(const [a,b] of pairs){if(c.split(a).length!==2)throw new Error(name+': anchor not found once: '+a.slice(0,70));c=c.replace(a,()=>b);}
 new Function('$','$input','return (async()=>{\n'+c+'\n})();');n.parameters.jsCode=c;size[name]=[c0.length,c.length];};
ed('QR Check',[
 ["return A.map((a,i)=>{const t=qrText(R[i]);const o=qrParse(t);",
  "const __Q=A.map((a,i)=>qrParse(qrText(R[i])));const __rr=r=>String(r||'').toUpperCase().replace(/[\\[\\]\\s]/g,'');const __ct=q=>!!(q&&typeof q==='object'&&String(q.earlier_quote||'').trim()&&!/^(?:none|n\\/a|na|null|-+)$/i.test(String(q.earlier_quote).trim()));\n"+
  "const __in=(x,y)=>{x=qrNorm(x);y=qrNorm(y);return x.length>=8&&y.length>=8&&(x.includes(y)||y.includes(x));};\n"+
  "const __ok=__Q.map(o=>['defender','challenger'].every(s=>!qrCheck(o&&o[s],s,F).length));const __RD=[];A.forEach((a,i)=>{const r={};for(const side of ['defender','challenger']){const q=__Q[i]&&__Q[i][side];if(!__ct(q)||qrCheck(q,side,F).length)continue;for(let j=0;j<i;j++){const p=__Q[j]&&__Q[j][side];if(__ok[j]&&!__RD[j][side]&&__ct(p)&&__rr(p.round)===__rr(q.round)&&__rr(p.earlier_round)===__rr(q.earlier_round)&&(__in(p.earlier_quote,q.earlier_quote)||__in(p.quote,q.quote))){r[side]={of:A[j].seat,earlier:__rr(q.earlier_round),closing:__rr(q.round)};break;}}}__RD.push(r);});\n"+
  "return A.map((a,i)=>{const t=qrText(R[i]);const o=qrParse(t);"],
 [" const RET='=== QUESTION ROUND (TRIAL): RETURNED ONCE ===\\nYour questions are returned once. Faults: '+bad.join(' | ')+'.\\nReply again with JSON only, in the same form, both questions.';",
  " const rd=__RD[i],rs=Object.keys(rd);const RET='=== QUESTION ROUND (TRIAL): RETURNED ONCE ===\\n'+(bad.length?'Your questions are returned once. Faults: '+bad.join(' | ')+'.\\n':'')+rs.map(s=>'Another judge already asks the '+s+' about the contradiction between '+rd[s].earlier+' and '+rd[s].closing+'. If you see a different contradiction in that debater\\'s closing round, ask about it instead; if you see none, keep your question.\\n').join('')+'Reply again with JSON only, in the same form, both questions.';"],
 ["if(bad.length){body.messages.push(","if(bad.length||rs.length){body.messages.push("],
 ["return {json:{...out,retry:bad.length>0,why:bad,body}};","return {json:{...out,retry:bad.length>0||rs.length>0,why:bad,redirect:rd,body}};"]]);
ed('QR Final',[
 ["if(c.retry){second=qrText(R[i]);const o=qrParse(second);qs={};faults={};for(const side of ['defender','challenger']){const q=o&&o[side];qs[side]=q||null;faults[side]=qrCheck(q,side,F);}}",
  "const RD=c.redirect||{},KF={};if(c.retry){second=qrText(R[i]);const o=qrParse(second);qs={};faults={};for(const side of ['defender','challenger']){const q=o&&o[side];qs[side]=q||null;faults[side]=qrCheck(q,side,F);if(!c.faults[side].length&&(RD[side]?faults[side].length:!(c.why||[]).length)){qs[side]=c.qs[side];faults[side]=[];KF[side]=true;}}}"],
 ["status:ok?(c.retry?'PASSED ON RETURN':'PASSED'):'DROPPED',","status:ok?(c.retry&&!KF[side]?'PASSED ON RETURN':'PASSED'):'DROPPED',redirect:RD[side]||null,...(RD[side]&&KF[side]?{redirect_note:'redirect reply failed, first kept'}:{}),"]]);
fs.writeFileSync(OUT,JSON.stringify(d));for(const k in size)console.log(k,size[k][0],'->',size[k][1],'(+'+(size[k][1]-size[k][0])+')');
