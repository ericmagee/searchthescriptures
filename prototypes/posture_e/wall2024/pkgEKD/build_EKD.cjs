// pkgEKD (W1, 33617): DeepSeek E-KEY reads a defender keystone ground that restates the defender's own thesis or link as the judge's
// "own statement of doctrine" and rules DISAGREE while its right grade equals the judge's (33617 gemini and sol KEYSTONE D6 STANDS;
// 13 such rows in 9 debates over 3 days, 11 STANDS and 2 BROKEN). The E-KEY item now carries the defender's own words for the keystone,
// from the rounds: the [CR1] opening statement, and the LINK n premise line of the link round, and the rule says a ground restating them
// rests on the debate's words. Judge Enforcer Build and Alt Judge Enforcer Build, on pkgEWB (s58 = live from 05:12 CST).
// Run from wall2024/: node pkgEKD/build_EKD.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const A1="text:'ITEM Z'+zi+' (E-KEY, the keystone line):\\nTHE LINE ('+id+', '+g.seat+'): '+cut(g.line,1200)+'\\nTHIS JUDGE\\'S OWN COLLISION LINES ON '+g.link+':\\n'+(g.own.length?g.own.map(a=>'- '+cut(a,1200)).join('\\n'):'(none)')";
const B1=A1+"+ekdWords(g.link)";
const A2="Its ground, where it gives one, must rest on the debate\\'s words, not on the judge\\'s own statement of doctrine.";
const B2=A2+" A ground that restates the defender\\'s own words for the keystone, given to you under THE DEFENDER\\'S OWN WORDS FOR THE KEYSTONE (its opening statement, or its premise line for that link), rests on the debate\\'s words: the defender\\'s thesis restated is not the judge\\'s own doctrine (pkgEKD).";
const A3="let zi=0;\n";
const B3="/* pkgEKD: the defender's own words for a D keystone, from the rounds: the [CR1] opening statement (the text before its first numbered section) and the\n"
 +"   LINK n premise line of the first link round that gives one. A ground restating them rests on the debate's words. */\n"
 +"function ekdWords(link){try{const m=String(link||'').match(/^D(\\d+)$/);if(!m||!R)return '';const n=+m[1];const cl=s=>String(s||'').replace(/[*_`#>]+/g,'').replace(/\\s+/g,' ').trim();const out=[];\n"
 +" const c1=String(R.CR1||'');const a=c1.search(/\\n#{1,4}\\s*1[.)]\\s/);const op=cl(a>0?c1.slice(0,a):c1.slice(0,1500)).replace(/^[^.]{0,80}?ROUND 1,? [A-Z]+\\s*/,'');if(op)out.push('- OPENING STATEMENT [CR1]: \"'+cut(op,900)+'\"');\n"
 +" for(const rk of ['CR2','CR3','CR4']){const t=String(R[rk]||'');const re=new RegExp('\\\\n#{1,4}\\\\s*LINK\\\\s*'+n+'\\\\b[^\\\\n]*\\\\n+\\\\s*[*_]*Premise\\\\s*:\\\\s*([^\\\\n]+)','i');const x=t.match(re);if(x){out.push('- LINK '+n+' PREMISE LINE ['+rk+']: '+cut(cl(x[1]),500));break;}}\n"
 +" return out.length?'\\nTHE DEFENDER\\'S OWN WORDS FOR THE KEYSTONE (from the rounds):\\n'+out.join('\\n'):'';}catch(e){return '';}}\n"+A3;
const plan={base:'pkgEWB/patched (live s58 from 05:12 CST)',nodes:{}};
for(const f of ['Judge_Enforcer_Build','Alt_Judge_Enforcer_Build']){const s0=fs.readFileSync('pkgEWB/patched/'+f+'.js','utf8');
 for(const a of [A1,A2,A3])if(s0.split(a).length!==2)throw new Error(f+' anchor '+a.slice(0,40));
 const s=s0.replace(A1,()=>B1).replace(A2,()=>B2).replace(A3,()=>B3);new Function('$','$input',s);fs.writeFileSync('pkgEKD/patched/'+f+'.js',s);plan.nodes[f.replace(/_/g,' ')]={base:h(s0),patched:h(s)};}
fs.writeFileSync('pkgEKD/plan_EKD.json',JSON.stringify(plan,null,1));console.log(plan.nodes);
