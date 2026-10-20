import hashlib,sys
B='../f1b/'
def rep(s,a,b,name):
    n=s.count(a); assert n==1,(name,n,a[:80]); return s.replace(a,b)
LIB_RET=" return {ledger,judgeBlock,roundBlock,DEF_RE,CH_RE};})();"
LIB_NEW=(" // ORDER (A) (BB-6708, ruled BB-6712): every verse the opposing side cited in the rounds before a link round is listed for that link round and counted in the ledger; one rule, both sides; which verse was quoted against a link stays the judge's call.\n"
" const citedLabels=t=>{const out=[];const seen=new Set();for(const r of refs(t)){if(!r.book)continue;const label=r.book+' '+r.label.replace(/[–—]/g,'-');if(seen.has(label))continue;seen.add(label);out.push({label,r});}return out;};\n"
" const citedRounds=rounds=>{const seen=new Set();return rounds.map(([name,t])=>({name,items:citedLabels(t).filter(x=>{if(seen.has(x.label))return false;seen.add(x.label);return true;})}));};\n"
" const citedBlock=(rounds,who)=>{let rs;try{rs=citedRounds(rounds);}catch(e){return '';}if(!rs.some(x=>x.items.length))return '';\n"
"  return ['EVERY VERSE '+who+' CITED BEFORE THIS LINK ROUND -- computed by the system from the transcript, not by a model; each verse is listed under the first round that cites it:'].concat(rs.map(x=>x.name+': '+(x.items.length?x.items.map(i=>i.label).join(', '):'none'))).join(LF);};\n"
" const citedNotNamed=(rounds,answering)=>{const N=namedIn(answering);let total=0;const not=[];for(const x of citedRounds(rounds))for(const i of x.items){total++;if(!i.r.cvs.some(cv=>isNamed(N,i.r.book,cv)))not.push(i.label);}return {total,not};};\n"
" const citedLine=(c,rounds,link)=>'cited in '+rounds+' and not named in '+link+' ('+c.not.length+' of '+c.total+'): '+(c.not.length?c.not.join(', '):'none');\n"
" return {ledger,judgeBlock,roundBlock,citedBlock,DEF_RE,CH_RE};})();")
LEDGER_OLD=" const ledger=F=>({defender:side(F.gr2,F.cr3,DEF_RE),challenger:side(F.cr3,F.dr3,CH_RE)});"
LEDGER_NEW=" const ledger=F=>({defender:side(F.gr2,F.cr3,DEF_RE),challenger:side(F.cr3,F.dr3,CH_RE),dCited:citedNotNamed([['[DR1]',F.gr1],['[DR2]',F.gr2]],F.cr3),cCited:citedNotNamed([['[CR1]',F.cr1],['[CR2]',F.cr2],['[CR3]',F.cr3]],F.dr3)});"
SCOPE_OLD="Verses carried by the closing premise lists only; a witness pressed elsewhere in the rounds is still the judge\\'s to count."
SCOPE_NEW="The line beginning \"cited in\" under each side lists every verse the opposing side cited in the rounds before that link round that the link round does not name; which of those verses were quoted against a link or a listed premise is the judge\\'s to decide."
CONCAT_OLD="   .concat(sideLines(L.defender,'AGAINST THE DEFENDER, answered in [CR3]'),sideLines(L.challenger,'AGAINST THE CHALLENGER, answered in [DR3]'),"
CONCAT_NEW="   .concat(sideLines(L.defender,'AGAINST THE DEFENDER, answered in [CR3]'),[citedLine(L.dCited,'[DR1] or [DR2]','[CR3]')],sideLines(L.challenger,'AGAINST THE CHALLENGER, answered in [DR3]'),[citedLine(L.cCited,'[CR1], [CR2] or [CR3]','[DR3]')],"
out={}
for n in ['D3_Build','C3_Build','Build_Independent_Verdict','Panel_Build']:
    s=open(B+n+'.new.js').read()
    s=rep(s,LIB_RET,LIB_NEW,n+':ret'); s=rep(s,LEDGER_OLD,LEDGER_NEW,n+':ledger')
    s=rep(s,SCOPE_OLD,SCOPE_NEW,n+':scope'); s=rep(s,CONCAT_OLD,CONCAT_NEW,n+':concat')
    if n=='D3_Build':
        a="const PV=PWL.roundBlock($('C2 Extract').first().json.raw,PWL.DEF_RE);"
        s=rep(s,a,a+"\nconst CV=PWL.citedBlock([['round 1',$('C1 Extract').first().json.raw],['round 2',$('C2 Extract').first().json.raw]],'THE CHALLENGER');",n+':cv')
        s=rep(s,"(PV?'\\n\\n'+PV:'')+","(PV?'\\n\\n'+PV:'')+(CV?'\\n\\n'+CV:'')+",n+':msg')
    if n=='C3_Build':
        a="const PV=PWL.roundBlock($('D3 Extract').first().json.raw,PWL.CH_RE);"
        s=rep(s,a,a+"\nconst CV=PWL.citedBlock([['round 1',$('D1 Extract').first().json.raw],['round 2',$('D2 Extract').first().json.raw],['round 3, the link round above',$('D3 Extract').first().json.raw]],'THE DEFENDER');",n+':cv')
        s=rep(s,"(PV?'\\n\\n'+PV:'')+","(PV?'\\n\\n'+PV:'')+(CV?'\\n\\n'+CV:'')+",n+':msg')
    open(n+'.new.js','w').write(s)
    b=open(B+n+'.new.js','rb').read()
    print(n,'base',hashlib.md5(b+b'\n').hexdigest()[:8],len(b),'new',hashlib.md5(s.encode()+b'\n').hexdigest()[:8],len(s.encode()))
