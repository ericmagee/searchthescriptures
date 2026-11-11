import re,json,pickle
def norm(s):
    s=re.sub(r'\d+','N',s.strip())
    s=re.sub(r'\s+',' ',s)
    return s[:90]
LAB=re.compile(r'^\s*(?:[-*•>]\s*)*(?:\*\*|__)?\[?([A-Za-z][A-Za-z0-9 ()/&\'._\-–—]{1,60}?)(?:\*\*|__)?\]?\s*:(?:\*\*|__)?(?:\s|$)')
def structure(text):
    lines=text.split('\n')
    heads=[];tabs=[];labs=[]
    for i,l in enumerate(lines):
        if re.match(r'^#{1,6}\s',l): heads.append(norm(l))
        if l.lstrip().startswith('|') and i+1<len(lines) and re.match(r'^\s*\|?\s*:?-{2,}',lines[i+1]) :
            tabs.append(norm(l))
        m=LAB.match(l)
        if m and not l.lstrip().startswith('|'): labs.append(norm(m.group(1)))
        # bracket audit labels
        for m2 in re.finditer(r'\[(AUDIT v\d+: [A-Z0-9\- \[\]()’\']{3,60}?)(?: --|:|\])',l): labs.append(norm('['+m2.group(1)))
        for m3 in re.finditer(r'\*\*(ENGINE: [A-Z]\d [A-Z]+)\*\*',l): labs.append(norm(m3.group(1)))
    return heads,tabs,labs
def first_order(xs):
    seen={};o=[]
    for x in xs:
        if x not in seen: seen[x]=1;o.append(x)
    return o
def cmp(a,b,name,out,cap=60):
    # a=new,b=old ; return lines
    from collections import Counter
    ca,cb=Counter(a),Counter(b)
    oa,ob=first_order(a),first_order(b)
    only_old=[x for x in ob if x not in ca]; only_new=[x for x in oa if x not in cb]
    out.append(f'  {name}: new {len(a)} entries ({len(ca)} distinct); old {len(b)} entries ({len(cb)} distinct); in old not in new: {len(only_old)}; in new not in old: {len(only_new)}')
    for x in only_old[:cap]: out.append(f'    LOST (old only) x{cb[x]}: {x}')
    if len(only_old)>cap: out.append(f'    ... {len(only_old)-cap} more')
    for x in only_new[:cap]: out.append(f'    NEW (new only) x{ca[x]}: {x}')
    if len(only_new)>cap: out.append(f'    ... {len(only_new)-cap} more')
    # count differences for common
    diffc=[(x,ca[x],cb[x]) for x in oa if x in cb and ca[x]!=cb[x]]
    out.append(f'    common labels with different counts: {len(diffc)}')
    for x,n,o in diffc[:cap]: out.append(f'      {x}: new {n}, old {o}')
    # order: relative order of common first-occurrence lists
    com_new=[x for x in oa if x in cb]; com_old=[x for x in ob if x in ca]
    out.append(f'    common distinct labels same first-occurrence order: {com_new==com_old}')
    return
