// pkgEGL v2 (W2, on W1's v1 fea0141; W3 ruling Wall 3010 on W2 3008). Run from wall2024/: node pkgEGL/build_EGLv2.cjs
// 1. Build: the item header carries no G id: "ITEM <k> OF <n> (...)" plus an "Answer each of: A<k>.1, A<k>.2 ..." line; the v1 rule sentence no longer names G labels.
// 2. Record: reads G<k> (as v1) and a bare <k> ("ENFORCER: <k> -- AGREE|DISAGREE|NO ANSWER"), with v1's fan-out condition unchanged.
// 3. Record: when the fan-out condition fails on forms, the item's answers without a line of their own stay NO VERDICT with the reason
//    "group-labelled reply, answers differ (pkgEGL)".
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const R={
 'Enforcer_Build.js':[
  ["return 'ITEM G'+(k+1)+' ('+g.rule+', '+g.item+'):\\nTHE SIDE","return 'ITEM '+(k+1)+' OF '+G.length+' ('+g.rule+', '+g.item+'):\\nAnswer each of: '+g.ans.map((r,j)=>'A'+(k+1)+'.'+(j+1)).join(', ')+'\\nTHE SIDE"],
  ["An ITEM label (G1, G2, ...) is never an answer id: write one line for each judge answer under the item, even when they agree (pkgEGL).",
   "An item number is never an answer id: write one line for each answer id listed under \"Answer each of\", even when the judges agree (pkgEGL)."]],
 'Enforcer_Record.js':[
  ["match(/^ENFORCER\\s*:\\s*(?:ITEM\\s+)?G(\\d+)\\s*(?:--|—|–|-)\\s*(AGREE|DISAGREE|NO ANSWER)\\s*(?:--|—|–|-)?\\s*(.*)$/i);if(g&&!GV[g[1]])GV[g[1]]={v:g[2].toUpperCase(),why:g[3].trim()};",
   "match(/^ENFORCER\\s*:\\s*(?:(?:ITEM\\s+)?G(\\d+)|(\\d+))\\s*(?:--|—|–|-)\\s*(AGREE|DISAGREE|NO ANSWER)\\s*(?:--|—|–|-)?\\s*(.*)$/i);if(g){const gk=g[1]||g[2];if(!GV[gk])GV[gk]={v:g[3].toUpperCase(),why:g[4].trim()};} /* pkgEGL v2: G<k> or bare <k> */"],
  ["if(f[0]&&f.every(z=>z===f[0]))for(const x of A)V[x.id.toUpperCase()]={v:gv.v,why:gv.why+' [pkgEGL: the enforcer answered item G'+k+' as a whole; applied to each of its '+A.length+' answers, all '+f[0]+']'};}",
   "if(f[0]&&f.every(z=>z===f[0]))for(const x of A)V[x.id.toUpperCase()]={v:gv.v,why:gv.why+' [pkgEGL: the enforcer answered item '+k+' as a whole; applied to each of its '+A.length+' answers, all '+f[0]+']'};\n  else for(const x of A)V[x.id.toUpperCase()]={v:'NO VERDICT',why:'group-labelled reply, answers differ (pkgEGL)'};}"]]};
const plan={base:'pkgEGL/patched (v1 fea0141)',nodes:{}};
for(const [f,rs] of Object.entries(R)){let s=fs.readFileSync('pkgEGL/patched/'+f,'utf8');const s0=s;for(const [a,b] of rs){const c=s.split(a).length-1;if(c!==1)throw new Error(f+': '+c+' x '+a.slice(0,70));s=s.replace(a,()=>b);}
 new Function('$','$input',s);fs.writeFileSync('pkgEGL/patched_v2/'+f,s);const b0=fs.readFileSync('pkgEGL/base_s52/'+f,'utf8');plan.nodes[f]={base_s52:h(b0),v1:h(s0),v2:h(s)};console.log(f.padEnd(22),h(b0),'->',h(s),'(v1 '+h(s0)+')');}
fs.writeFileSync('pkgEGL/patched_v2.plan.json',JSON.stringify(plan,null,1));
