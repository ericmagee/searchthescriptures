import json,re,sys,io
_o=sys.stdout; sys.stdout=io.StringIO()
from an3 import V,EA,sections,row,st
from an2 import ROUND
sys.stdout=_o
ids={y['id']:y for c in st for y in c['json']['ids']}
for g in ['B36.1','B39.1','B53.1','B82.1']:
    y=ids[g]; k=g.split('.')[0]; x=EA[k]
    print(g,y['seat'],y['grade'],k,x['verse'],x['rnd'],'FULL' if x['full'] else '-', 'OTHER' if x['other'] else '-', 'call',x['call'])
    blk=(x['full'][1] if x['full'] else x['ans'])
    col=row[ROUND[x['rnd']]]
    pos=col.find(blk[:60].replace('\\',''))
    pre=col[:pos] if pos>=0 else ''
    heads=re.findall(r'\n(\*\*LINK \d[^\n]*|## D\d[^\n]*|LINK \d[^\n]*)',pre)
    print('   pos',pos,'nearest heading',heads[-1][:100] if heads else None)
    print('   judges on item:',[ (yy['seat'],yy['grade']) for kk,yy in ids.items() if kk.startswith(k+'.')])
