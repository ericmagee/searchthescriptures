import hashlib
def md5(s): return hashlib.md5((s if s.endswith('\n') else s+'\n').encode()).hexdigest()[:8]
def rep(s,a,b,n=1):
    assert s.count(a)==n,(a[:60],s.count(a)); return s.replace(a,b)
# 1. Citation Scan: link and load_bearing per item
cs=open('base/Citation_Scan.js').read()
LB=r"""// ORDER (BB-6827, ruled BB-6828, BB-6830): a quotation is load-bearing when it stands in a LINK block of a link round (R3) under an [L1] tag:
// the block runs from a line that opens "LINK n" to the next such line; the last layer tag before the quote in the block must be [L1].
// Not load-bearing: a block whose status is CONCEDED (a conceded link bears no load), and the UNSUPPORTED-L4 PREMISES list that closes the round.
// Rounds 1 and 2 carry the chain by reference, not by quotation (measured, BB-6827), so only round 3 is read. Same test for both sides.
const LBH=/^[ \t>#*_-]*(?:\d+[.)][ \t]*)?\**[ \t]*LINK[ \t]+(\d+)\b[^\n]*/gim;
const LB=(t,round,pos)=>{const no={link:null,load_bearing:false};if(round!=='R3')return no;
 let h=null,x;LBH.lastIndex=0;while((x=LBH.exec(t))!==null&&x.index<pos)h=x;if(!h)return no;
 if(/(?:^|\n)[ \t>#*_]*(?:[A-Z]+['’]S[ \t]+)?UNSUPPORTED[- ]L4[ \t]+PREMISES/i.test(t.slice(0,pos)))return no;
 const link=+h[1];const st=(h[0].match(/LINK[ \t]+\d+[^:\n]{0,40}:[ \t*_]*([A-Za-z-]+)/i)||[])[1]||'';if(/^CONCEDED$/i.test(st))return {link,load_bearing:false};
 const tags=[...t.slice(h.index,pos).matchAll(/\[L([1-4])\]/g)];return {link,load_bearing:tags.length>0&&tags[tags.length-1][1]==='1'};};
"""
cs=rep(cs,"const items=[];const seen=new Set();\n", LB+"const items=[];const seen=new Set();\n")
cs=rep(cs,"  items.push({ref,book,chapter:+m[2],v1,v2,quote,side,round,alt,cite_form:cf});}",
          "  items.push({ref,book,chapter:+m[2],v1,v2,quote,side,round,alt,cite_form:cf,...LB(t,round,m.index+m[0].length-m[5].length-1)});}")
cs=rep(cs,"  items.push({ref,book,chapter:+m[3],v1,v2,quote,side,round,order:'quote-first',cite_form:!/\\d/.test(m[1])&&!OPP(ri,m[1])});}}}",
          "  items.push({ref,book,chapter:+m[3],v1,v2,quote,side,round,order:'quote-first',cite_form:!/\\d/.test(m[1])&&!OPP(ri,m[1]),...LB(t,round,m.index+1)});}}}")
# 2. Quote Compare: gloss set aside
qc=open('base/Quote_Compare.js').read()
qc=rep(qc,"const idx={};",
 "// ORDER (BB-6805, BB-6830): words a side puts in square brackets or parentheses inside a quotation are its own gloss: set aside, not checked,\n// not [L1] evidence. Both sides alike.\nconst unGloss=s=>String(s||'').replace(/\\[[^\\]]*\\]|\\([^)]*\\)/g,' ');\nconst idx={};")
qc=rep(qc,"const items=S.items.map(i=>{const q=words(i.quote);","const items=S.items.map(i=>{const q=words(unGloss(i.quote));")
open('Citation_Scan.new.js','w').write(cs); open('Quote_Compare.new.js','w').write(qc)
for k,b,n in [('Citation_Scan',open('base/Citation_Scan.js').read(),cs),('Quote_Compare',open('base/Quote_Compare.js').read(),qc)]:
    print(k,md5(b),len(b),'->',md5(n),len(n),'+',len(n)-len(b))
# 3. Build Save Body (on the J4 draft): store the citation check per quotation
sb0=open('../bb6819/Build_Save_Body.new.js').read()
sb=rep(sb0,"const d=$input.first().json;const S=$('Init Seats').first().json;",
 "const d=$input.first().json;const S=$('Init Seats').first().json;\n// ORDER (BB-6805, BB-6827): the KJV citation check is stored per quotation, so the outcome rule reads stored data; unavailable is stored as such.\nconst __CC=(()=>{try{const q=$('Quote Report').first().json;if(!q||q.unavailable)return {unavailable:true};return {checked:q.checked,matches:q.matches,not_checked:q.not_checked,mismatches:q.mismatches,items:(q.items||[]).map(i=>({side:i.side,round:i.round,ref:i.ref,status:i.status,link:(i.link==null?null:i.link),load_bearing:i.load_bearing===true}))};}catch(e){return {unavailable:true};}})();\n")
sb=rep(sb,"challenger_served:IG.c_served,","challenger_served:IG.c_served,citation_check:__CC,")
open('Build_Save_Body.new.js','w').write(sb)
print('Build_Save_Body (J4)',md5(sb0),len(sb0),'->',md5(sb),len(sb),'+',len(sb)-len(sb0))
