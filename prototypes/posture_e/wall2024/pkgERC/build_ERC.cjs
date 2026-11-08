// pkgERC (W1, 11-08; W3 3087 ruling 3): DeepSeek E-PREM reads a judge's engine-recounted CONCEDED LINKS line with that judge's stored counted premises.
// 33592 grok: after the cure the engine rewrote grok's line as "CONCEDED LINKS: 3 -- recomputed after the cure from the cured lines (CORRECTED COUNT
// DEFENDER 3)". It names no premise, and the E-PREM rule reads a premise the line does not name as SPARED, so DeepSeek wrote AGREE SPARED on all 6,
// while the stored counted_premises_defender is [2, 5, 6]. The judge's real ruling never reached DeepSeek.
// Change, Judge Enforcer Build and Alt Judge Enforcer Build (same edits): (1) each judge keeps its stored counted_premises_defender/_challenger and
// its own pre-recount line (AUDIT v27 SUPERSEDED); (2) an E-PREM line that says "recomputed after the cure" is shown with "STORED COUNTED PREMISES"
// and the judge's line before the recount, and for premise N with this judge's own collision lines on LINK N; (3) one rule sentence: on such a line
// the judge's ruling is COUNTED when N is stored as counted, else SPARED; a counted premise whose shown lines give no ground is
// "counted with no stated ground". Lines not recomputed are shown exactly as today. Base: live s56. Run from wall2024/: node pkgERC/build_ERC.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s56.json','utf8'));
const rep=(s,a,b,tag)=>{if(s.split(a).length!==2)throw new Error(tag+' anchor '+(s.split(a).length-1));return s.replace(a,()=>b);};
const plan={base:'live s56',nodes:{}};
const CPFN=String.raw`const __cp=k=>{const m=String(p.verdict_raw||'').match(new RegExp('\\\\?\x22'+k+'\\\\?\x22\\s*:\\s*\\[([\\d,\\s]*)\\]'));return m?m[1].split(',').map(x=>+x.trim()).filter(x=>x>0):null;};`;
for(const name of ['Judge Enforcer Build','Alt Judge Enforcer Build']){const s0=W.nodes.find(z=>z.name===name).parameters.jsCode;let s=s0;
 s=rep(s,"judges.push({seat:p.judge_seat||'?',t:textOf(p.verdict_raw)});",
  "const __t=textOf(p.verdict_raw);"+CPFN+""+
  "const __sup=lb=>{const m=__t.match(new RegExp('\\\\[AUDIT v27: SUPERSEDED LINE -- SEAT: [^;\\\\]]*; LABEL: '+lb+'; ORIGINAL: ([\\\\s\\\\S]*?) ; END\\\\]'));return m?m[1].trim():null;};"+
  "judges.push({seat:p.judge_seat||'?',t:__t,cp:{D:__cp('counted_premises_defender'),C:__cp('counted_premises_challenger')},orig:{D:__sup('CONCEDED LINKS'),C:__sup('CHALLENGER CONCEDED LINKS')}}); /* pkgERC */",'push');
 s=rep(s,"for(const j of judges)for(const l of linesOf(j.t)){if(/^CHALLENGER CONCEDED LINKS\\b/.test(l))CLN.C.push({seat:j.seat,line:l});else if(/^CONCEDED LINKS\\b/.test(l))CLN.D.push({seat:j.seat,line:l});}",
  "for(const j of judges)for(const l of linesOf(j.t)){if(/^CHALLENGER CONCEDED LINKS\\b/.test(l))CLN.C.push({seat:j.seat,line:l,j});else if(/^CONCEDED LINKS\\b/.test(l))CLN.D.push({seat:j.seat,line:l,j});}\n"+
  "/* pkgERC (33592 grok): an engine-recounted line names no premise; show the judge's stored counted premises, its own line before the recount, and its own collision lines on LINK n */\n"+
  "const __rc=x=>/recomputed after the cure/i.test(x.line);\n"+
  "const __show=(sd,x,n)=>{if(!__rc(x))return cut(x.line,900);const cp=x.j&&x.j.cp?x.j.cp[sd]:null;const o=x.j&&x.j.orig?x.j.orig[sd]:null;const L=(sd==='D'?'D':'C')+n;\n"+
  " const own=linesOf(x.j.t).filter(z=>{const m=z.match(/^(?:FORCED\\s*:\\s*)?(D\\d+)\\s+vs\\.?\\s+(C\\d+)\\b/i);return !!m&&(m[1].toUpperCase()===L||m[2].toUpperCase()===L);}).slice(0,4);\n"+
  " return cut(x.line,300)+'\\n    THE ENGINE RECOUNTED THIS LINE. STORED COUNTED PREMISES FOR THIS SIDE: '+(cp?(cp.length?cp.join(', '):'none'):'(not stored)')+(cp?' -- premise '+n+' is '+(cp.includes(n)?'COUNTED':'not counted (SPARED)')+' in this judge\\'s stored ruling':'')+\n"+
  "  '\\n    THIS JUDGE\\'S OWN LINE BEFORE THE RECOUNT: '+(o?cut(o,700):'(not found)')+'\\n    THIS JUDGE\\'S OWN COLLISION LINES ON '+L+': '+(own.length?own.map(z=>cut(z,400)).join(' || '):'(none)');};",'cln');
 s=rep(s,"ids.map((x,k)=>'- '+x.id+' ('+x.seat+'): '+cut(CLN[sd][k].line,900)).join('\\n')",
  "ids.map((x,k)=>'- '+x.id+' ('+x.seat+'): '+__show(sd,CLN[sd][k],n)).join('\\n')",'show');
 s=rep(s,"'RULE E-PREM, THE COUNTED KIND (pkgEPS).",
  "'RULE E-PREM, A RECOUNTED LINE (pkgERC). When a judge\\'s line says the engine recounted it, that judge\\'s ruling on premise N is the one its STORED COUNTED PREMISES give: COUNTED when N is listed, SPARED when it is not; the line\\'s silence is not a SPARED ruling. Judge that ruling as any other, from the block, the judge\\'s line before the recount and its own collision lines shown. When the ruling is COUNTED and none of those lines gives a ground for premise N, say \"counted with no stated ground\" in your sentence.\\n'\n +'RULE E-PREM, THE COUNTED KIND (pkgEPS).",'rule');
 new Function('$','$input',s);fs.writeFileSync('pkgERC/patched/'+name.replace(/ /g,'_')+'.js',s);plan.nodes[name]={base:h(s0),patched:h(s)};console.log(name,h(s0),'->',h(s));}
fs.writeFileSync('pkgERC/plan_ERC.json',JSON.stringify(plan,null,1));
