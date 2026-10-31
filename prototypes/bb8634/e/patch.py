import hashlib
def rep(s,a,b,f):
    n=s.count(a); assert n==1,(f,a[:60],n); return s.replace(a,b)
OLD_ITEMS="const items=t=>String(t||'').split(/\\n(?=\\s*\\**\\s*\\d+[.)]\\s)/).filter(x=>/^\\s*\\**\\s*\\d+[.)]\\s/.test(x));"
NEW_ITEMS="const items=t=>String(t||'').split(/\\n(?=\\s*\\**\\s*(?:\\d+[.)]\\s|LINK\\s+(?:\\d+|none)\\s*:))/i).filter(x=>/^\\s*\\**\\s*(?:\\d+[.)]\\s|LINK\\s+(?:\\d+|none)\\s*:)/i.test(x)); // BB-8634 S1: a list line is a numbered line or a LINK n: / LINK none: line"
JB="const judgeBlock=F=>{let L;try{L=ledger(F);}"
UNL=("// BB-8634 S2: every verse a side cited (written with its book) in its rounds up to its own closing list, that the list does not carry.\n"
" const unlistedLines=F=>{const one=(name,rounds,listText,headRe)=>{const i=lastHead(listText,headRe);const Lt=i<0?'':String(listText).slice(i);const on=new Set();"
"for(const r of refs(Lt)){const b=r.book||r.ctx;if(!b)continue;for(const cv of r.cvs)on.add(b+' '+cv);}const seen=new Set();const out=[];"
"for(const [rn,t] of rounds){let txt=String(t||'');if(t===listText&&i>=0)txt=txt.slice(0,i);for(const x of citedLabels(txt)){if(seen.has(x.label))continue;seen.add(x.label);"
"if(x.r.cvs.some(cv=>on.has(x.r.book+' '+cv)))continue;out.push(x.label+' '+rn);}}"
"return name+(i<0?' (no closing list found)':'')+' ('+out.length+'): '+(out.length?out.join(', '):'none');};\n"
"  try{return ['PRESSED, UNLISTED -- computed by the system from the transcript, not by a model: every verse a side cited, written with its book, in its own rounds up to its own closing list, that the list does not carry. Which of these were pressed against the other side is for the judge to decide; a reference written without its book is not read.',"
"one('BY THE CHALLENGER, not on the list that closes [DR2]',[['[DR1]',F.gr1],['[DR2]',F.gr2]],F.gr2,DEF_RE),"
"one('BY THE DEFENDER, not on the list that closes [CR3]',[['[CR1]',F.cr1],['[CR2]',F.cr2],['[CR3]',F.cr3]],F.cr3,CH_RE)];}catch(e){return ['PRESSED, UNLISTED: not available this run.'];}};\n ")
NNM="   ['A verse marked NOT NAMED is unanswered by the rule; a verse marked NAMED may still be unanswered, and the judge decides that.']).join(LF);};"
NNM_NEW="   unlistedLines(F),['A verse marked NOT NAMED is unanswered by the rule; a verse marked NAMED may still be unanswered, and the judge decides that.']).join(LF);};"
for f in ['Panel_Build.js','Build_Independent_Verdict.js']:
    s=open('base/'+f).read(); s=rep(s,OLD_ITEMS,NEW_ITEMS,f); s=rep(s,JB,UNL+JB,f); s=rep(s,NNM,NNM_NEW,f); open('new/'+f,'w').write(s)
s=open('base/D3_Build.js').read(); s=rep(s,OLD_ITEMS,NEW_ITEMS,'D3'); open('new/D3_Build.js','w').write(s)
E=open('base/Extract_Independent_Verdict.js').read()
O1="for(let i=hi+1;i<L.length;i++){const m=L[i].match(/^(?:#+\\s*)?\\**([0-9]+)\\./);if(!m)continue;if(parseInt(m[1],10)===c+1)c++;else break;}"
N1="for(let i=hi+1;i<L.length;i++){const m=L[i].match(/^(?:#+\\s*)?\\**([0-9]+)\\./);if(!m){if(/^(?:#+\\s*)?\\**\\s*LINK\\s+(?:\\d+|none)\\s*:/i.test(L[i]))c++;continue;}if(parseInt(m[1],10)===c+1)c++;else break;} // BB-8634 S1: a LINK n: line counts as the next item"
O2="for(let i=hi+1;i<L.length;i++){const m=L[i].match(/^(?:#+\\s*)?\\**([0-9]+)\\./);if(!m)continue;if(parseInt(m[1],10)===c+1){c++;out.push(L[i].slice(0,60));}else break;}"
N2="for(let i=hi+1;i<L.length;i++){const m=L[i].match(/^(?:#+\\s*)?\\**([0-9]+)\\./);if(!m){if(/^(?:#+\\s*)?\\**\\s*LINK\\s+(?:\\d+|none)\\s*:/i.test(L[i])){c++;out.push(L[i].slice(0,60));}continue;}if(parseInt(m[1],10)===c+1){c++;out.push(L[i].slice(0,60));}else break;} // BB-8634 S1"
E=rep(E,O1,N1,'EIV1'); E=rep(E,O2,N2,'EIV2'); open('new/Extract_Independent_Verdict.js','w').write(E)
for f in ['Panel_Build.js','Build_Independent_Verdict.js','D3_Build.js','Extract_Independent_Verdict.js']:
    b=open('new/'+f).read(); print(f,len(b),hashlib.md5(b.encode()).hexdigest())
