// pkgRRT (W2): the second reading (pkgVP1 reread) does not send DeepSeek a replaced line that begins "RETRACTED:" (a send-back retraction carries no grade
// to read; DeepSeek answered NO ANSWER on all 8 such lines in the stored exports). Such a line is recorded as "SECOND READING NOT MADE" with its reason,
// by the existing not_checked rows; the Record now writes those rows also when the Build skips the call. Independent of pkgECS (different nodes).
// Six plain Code nodes: Reread Build, Alt Reread Build, R2 Alt Reread Build, and the three Records. usage: node pkgRRT/build.cjs <base fetch-back> <out>
const fs=require('fs'),crypto=require('crypto');const [,,inF,outF]=process.argv;const D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);
const W0=JSON.parse(JSON.stringify(W));const by={};W.nodes.forEach(n=>by[n.name]=n);
const rep=(s,o,n)=>{if(s.split(o).length!==2)throw new Error('anchor not once: '+o.slice(0,90));return s.replace(o,()=>n);};
for(const p of ['','Alt ','R2 Alt ']){
 const b=by[p+'Reread Build'];let c=b.parameters.jsCode;
 c=rep(c,"const want=(PASS.sb_items||[]).filter(x=>x&&x.ans==='CHANGE'&&String(x.to||'').trim()&&/^\\(right\\s*:/i.test(String(x.reason||'').trim()));",
  "const RET=[];const want=(PASS.sb_items||[]).filter(x=>x&&x.ans==='CHANGE'&&String(x.to||'').trim()&&/^\\(right\\s*:/i.test(String(x.reason||'').trim())).filter(x=>{if(!/^RETRACTED\\s*:/i.test(String(x.to).replace(/[\\\\*_`]+/g,'').trim()))return true;RET.push(x.seat+' '+x.sid+' ('+x.rule+'): the replaced line is a retraction, which carries no grade to read again (pkgRRT): '+String(x.to).trim().slice(0,200));return false;});");
 c=rep(c,"if(!want.length)return skip('no replaced line that DeepSeek had flagged');","if(!want.length)return skip(RET.length?'every replaced line DeepSeek had flagged is a retraction (pkgRRT)':'no replaced line that DeepSeek had flagged',RET);");
 c=rep(c,"return skip('the first enforcer calls could not be read',want.map(","return skip('the first enforcer calls could not be read',RET.concat(want.map(");
 c=rep(c,"want.map(x=>x.seat+' '+x.sid));\nconst nrm=","want.map(x=>x.seat+' '+x.sid)));\nconst nrm=");
 c=rep(c,"return skip('the first enforcer call holds no ITEM block',want.map(x=>x.seat+' '+x.sid));","return skip('the first enforcer call holds no ITEM block',RET.concat(want.map(x=>x.seat+' '+x.sid)));");
 c=rep(c,"const not_checked=[];","const not_checked=RET.slice();");
 b.parameters.jsCode=c;
 const r=by[p+'Reread Record'];let d=r.parameters.jsCode;
 const m=d.match(/\n\(first\.not_checked\|\|\[\]\)\.forEach\(w=>\{const m=String\(w\)\.match\(([\s\S]*?)\);rows\.push\((\{[\s\S]*?at:T\})\);\}\);\n/);if(!m)throw new Error('record mapper '+p);
 const role=(m[2].match(/seat_role:'(\w+)'/)||[])[1];
 d=rep(d,m[0],"\nrows.push(...NCR(first.not_checked,models));\n");
 d=rep(d,"if(first.rr_skip)return [{json:{reread:{skipped:true,why:first.rr_why||'',not_checked:first.not_checked||[]},rr_rows:[]}}];",
  "const NCR=(nc,M0)=>(nc||[]).map(w=>{const m=String(w).match("+m[1]+");return "+m[2].replace("judge_model:m?(models[m[1]]||null):null","judge_model:m?(M0[m[1]]||null):null")+";});\nif(first.rr_skip)return [{json:{reread:{skipped:true,why:first.rr_why||'',not_checked:first.not_checked||[]},rr_rows:NCR(first.not_checked,{})}}]; /* pkgRRT: a skipped reread still records what it did not read */");
 r.parameters.jsCode=d;
 for(const n of [b,r])new Function('$','$input','return (async()=>{\n'+n.parameters.jsCode+'\n})');
 console.log(p+'Reread Build',b.parameters.jsCode.length-W0.nodes.find(z=>z.name===b.name).parameters.jsCode.length,'|',p+'Reread Record',r.parameters.jsCode.length-W0.nodes.find(z=>z.name===r.name).parameters.jsCode.length,'| role',role);}
const code=x=>x.nodes.reduce((s,n)=>s+(n.parameters.jsCode||'').length,0);
const diff=W.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(W0.nodes.find(z=>z.name===n.name))).map(n=>n.name);
console.log('SIZE (measured): all Code nodes',code(W)-code(W0),'| prompt 0 | nodes changed',diff,'| node count',W.nodes.length,'| connections equal',JSON.stringify(W.connections)===JSON.stringify(W0.connections),'| base versionId',W.versionId);
fs.mkdirSync('pkgRRT/src',{recursive:true});for(const n of diff){fs.writeFileSync('pkgRRT/src/'+n.replace(/ /g,'_')+'.new.js',by[n].parameters.jsCode);fs.writeFileSync('pkgRRT/src/'+n.replace(/ /g,'_')+'.old.js',W0.nodes.find(z=>z.name===n).parameters.jsCode);}
fs.writeFileSync(outF,JSON.stringify(D));console.log('sha256',crypto.createHash('sha256').update(fs.readFileSync(outF)).digest('hex').slice(0,16));
