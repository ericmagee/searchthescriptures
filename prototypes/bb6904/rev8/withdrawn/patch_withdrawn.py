# BB-6904 rev 8, WITHDRAWN cure portion (BB-7321): files only, nothing written to n8n.
# Each anchor must occur exactly once in each node, or the patch refuses.
# Usage: python3 -I patch_withdrawn.py <in.js> <out.js> [1|2|12]
import sys
E1=("if(x.rule==='K-B'){const rs=o.restated.filter(r=>U(r.link)===U(x.link));",
    "if(x.rule==='K-B'){if(wd.has(U(x.link)))return res('CURED','withdrawn',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));const rs=o.restated.filter(r=>U(r.link)===U(x.link));")
ST=' +"STATEMENT: <the flagged item, as labelled above> | <in your own words, why the line stands as you graded it, or what you corrected and why>\\n"\n'
E2=(ST, ST+' +"WITHDRAWN: D<n> vs C<m> withdraws your BROKEN grade on that line; a withdrawn line is not a BROKEN line, so that one line cures every item flagged on it (layer, count, pressing). A STATEMENT line never withdraws anything.\\n"\n')
if __name__=='__main__':
    src=open(sys.argv[1],encoding='utf-8').read();which=sys.argv[3] if len(sys.argv)>3 else '12';out=src
    for tag,(old,new) in (('1',E1),('2',E2)):
        if tag not in which: continue
        c=out.count(old)
        if c!=1: sys.exit('REFUSED: anchor %s occurs %d times in %s'%(tag,c,sys.argv[1]))
        out=out.replace(old,new)
    open(sys.argv[2],'w',encoding='utf-8').write(out)
