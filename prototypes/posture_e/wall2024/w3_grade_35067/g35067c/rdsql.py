import json,sys
def load(p):
    t=json.load(open(p))['result']
    i=t.index('[{') if '[{' in t else t.index('[]')
    j=t.rindex('</untrusted')
    return json.loads(t[i:j].strip())
if __name__=='__main__':
    r=load(sys.argv[1]);print(len(r))
    for x in r: print({k:(v if not isinstance(v,str) else v[:70]) for k,v in x.items()})
