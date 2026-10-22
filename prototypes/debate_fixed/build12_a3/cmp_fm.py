import difflib,sys
a=open(sys.argv[1]).read().split('\n');b=open(sys.argv[2]).read().split('\n')
cut=lambda L:L[:next(i for i,l in enumerate(L) if l.startswith('## What the judges were sent'))]
d=[l for l in difflib.unified_diff(cut(b),cut(a),lineterm='',n=0) if l[:1] in '+-' and not l.startswith(('+++','---'))]
print('diff lines above section 8:',len(d));[print(l[:220]) for l in d]
