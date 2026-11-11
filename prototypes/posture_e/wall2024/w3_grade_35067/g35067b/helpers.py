import json
def paths(o,p='',dep=0,out=None):
    out=out if out is not None else {}
    if isinstance(o,dict):
        if not o and p: out[p]='{}empty'
        for k,v in o.items(): paths(v,p+'.'+k,dep+1,out)
    elif isinstance(o,list):
        if not o: out[p]='[]empty'
        else:
            out[p]='list'+str(len(o))
            if dep<4:
                for v in o[:1]: paths(v,p+'[]',dep+1,out)
    else:
        if o is None: out[p]='null'
        elif o=='' : out[p]='emptystr'
        else: out[p]=type(o).__name__
    return out
def short(o,n=120):
    if isinstance(o,str): return o if len(o)<=n else o[:n]+f'...({len(o)})'
    if isinstance(o,dict): return {k:short(v,n) for k,v in list(o.items())[:40]}
    if isinstance(o,list): return [short(v,n) for v in o[:3]]+(['...%d'%len(o)] if len(o)>3 else [])
    return o
