import sys
B=sys.argv[1]
def sub(path,old,new,count=1):
    s=open(path).read()
    assert s.count(old)==count,(path,old[:60],s.count(old))
    s=s.replace(old,new); open(path,'w').write(s)
cs=B+'/new11/Citation_Scan.js'
sub(cs,"const RF=new RegExp(",
"""// DoD 14 (BB-7397 rev 7; the operator's 1, BB-7495): "A quotation of the other side's own words, quoted under the pressing rule, is not a scripture
// citation and is not checked against the KJV text." Tested by the text, not by a cue phrase (BB-7498, ruled BB-7499): opp_words is true when the
// quotation's words, folded as QN folds them and with quote marks removed, occur in an earlier round of the other side, quoted or not; "..." splits
// the quotation into pieces that must occur there in order. Quote Report leaves out such an item only when its status is WORDING NOT FOUND.
const QF=s=>QN(s).replace(/["']/g,'').replace(/\\s+/g,' ').trim();
const FULL=rounds.map(x=>QF(String(x[2]||'')));
const OPPW=(ri,raw)=>{const ps=String(raw).split(/…|\\.\\.\\./).map(p=>QF(p).replace(/^[\\s.,;:!?]+|[\\s.,;:!?]+$/g,'')).filter(Boolean);
 if(ps.join(' ').length<12)return false;
 return rounds.some((x,j)=>{if(j>=ri||x[0]===rounds[ri][0])return false;let at=0;for(const p of ps){const k=FULL[j].indexOf(p,at);if(k<0)return false;at=k+p.length;}return true;});};
const RF=new RegExp(""")
sub(cs,"items.push({ref,book,chapter:+m[2],v1,v2,quote,side,round,alt,cite_form:cf,...LB(",
       "items.push({ref,book,chapter:+m[2],v1,v2,quote,side,round,alt,cite_form:cf,opp_words:OPPW(ri,m[5]),...LB(")
sub(cs,"cite_form:!/\\d/.test(m[1])&&!OPP(ri,m[1]),...LB(",
       "cite_form:!/\\d/.test(m[1])&&!OPP(ri,m[1]),opp_words:OPPW(ri,m[1]),...LB(")
qr=B+'/new11/Quote_Report.js'
sub(qr,"const items=all.filter(i=>i.status==='MATCHES'||i.status==='NOT CHECKED'||i.cite_form!==false);",
"""// DoD 14 (BB-7397 rev 7, BB-7495): a quotation of the other side's own words (Citation Scan opp_words) that the KJV check would report as
// WORDING NOT FOUND is not a scripture citation: left out of the report. MATCHES and WORDS ARE AT are reported as before.
const items=all.filter(i=>i.status==='MATCHES'||i.status==='NOT CHECKED'||(i.cite_form!==false&&!(i.opp_words&&/^WORDING NOT FOUND IN /.test(i.status))));""")
print('ok')
