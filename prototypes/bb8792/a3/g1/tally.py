# tally.py: per reply, the collision lines, their grades, GROUND coverage, and the standing lines.
import re, os, collections
G=r'(STANDS|DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|WITHDRAWN(?: AFTER AN UNANSWERED WITNESS)?)'
L=re.compile(r'^\W*(D\d+)(?:\s+vs\.?\s+(C\d+))?(?:\s*\([^)\n]*\))?\s*\**\s*(?::|--|—)\s*\**\s*(?:--\s*)?'+G)
rows=[]
for f in sorted(os.listdir('deepseek/out')):
    t=open('deepseek/out/'+f).read(); unit,arm,r=f[:-4].split('__')
    lines=[l for l in t.split('\n') if L.match(l)]
    g=sum('GROUND:' in l for l in lines)
    grades=' '.join(f"{m.group(1)}{'/'+m.group(2) if m.group(2) else ''}={ {'STANDS':'S','DEFENDER LINK BROKEN':'DB','CHALLENGER LINK BROKEN':'CB','UNDERDETERMINED':'U'}.get(m.group(3),'W')}" for m in (L.match(l) for l in lines))
    st=' | '.join(re.sub(r'\W*\**','',m.strip())[:60] for m in re.findall(r'^.*(?:DEFENSE STANDING|CHALLENGE STANDING|FRAMEWORK VERDICT|RESULT)[^\n]*',t,re.M))[:200]
    rows.append((unit,arm,r,len(lines),g,grades,st))
for x in rows: print(f"{x[0]} {x[1]} {x[2]} lines {x[3]} ground {x[4]} | {x[5]}\n      {x[6]}")
