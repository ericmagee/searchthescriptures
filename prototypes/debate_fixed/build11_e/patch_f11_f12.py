import sys,glob,os
B=sys.argv[1]
def sub(path,old,new,count=1):
    s=open(path).read()
    assert s.count(old)==count,(path,old[:70],s.count(old))
    open(path,'w').write(s.replace(old,new))
LIB=[f for f in sorted(glob.glob(B+'/new11/*.js')) if 'function cureFound(q,txt)' in open(f).read()]
old_cf=""" return ps.length>0&&ps.join(' ').split(' ').length>=3&&ps.every(x=>T.includes(x));}
"""
new_cf=""" return ps.length>0&&ps.join(' ').split(' ').length>=3&&ps.every(x=>T.includes(x));}
// DoD 12 (BB-7397 rev 7, choice (i) BB-7495): a PRESSED line may carry several quotations of the named round, joined as "..." and "..."; a
// quotation not found whole is split at a closing mark, a joiner (and, &, a comma or a semicolon) and an opening mark, and counts when every piece
// is found in that round. A quotation found whole is read as before.
function cureFoundAll(q,txt){if(cureFound(q,txt))return true;const ps=String(q).split(/["”]\\s*(?:and|&|,|;)\\s*["“]/).map(s=>s.trim()).filter(Boolean);
 return ps.length>1&&ps.every(p=>cureFound(p,txt));}
"""
for f in LIB:
    sub(f,old_cf,new_cf)
    sub(f,"cureFound(p.q,R[p.round])","cureFoundAll(p.q,R[p.round])",2)
WT_OLD="try{const o=JSON.parse(answer);wt=(o.reasoning!=null?o.reasoning:o.reason);}catch(e){wt=answer;}"
WT_NEW="wt=cureUnwrap(answer); /* DoD 11 (BB-7397 rev 7): the worked text read as the reply is read, a ```json fence stripped first (27795 Gemini) */"
for n in ['Panel_Cure_Build_1','Panel_Cure_Build_2','Panel_Cure_Build_3','Alternate_Cure_Build']:
    sub(B+'/new11/'+n+'.js',WT_OLD,WT_NEW)
print(len(LIB),'library copies patched; 4 wt sites')
