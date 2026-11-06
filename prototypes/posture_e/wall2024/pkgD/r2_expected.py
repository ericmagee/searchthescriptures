# R2 expected list, written before the K-RUL code runs (independent python reading of the extraction rule in ruling_card_draft.md).
import json,re,sys
out={}
for f in ['32791','32905','32924']:
  for j in json.load(open(f'pkgA/judgments/{f}.json')):
    s=j['verdict_raw'].strip();J=json.loads(s[:s.rfind('}')+1]);R=J['reasoning']
    rul=[]
    for side,k in (('DEFENDER','counted_premises_defender'),('CHALLENGER','counted_premises_challenger')):
      for n in (J.get(k) or []): rul.append(f'{side} premise {n}')
    if any(re.match(r'^\s*[-*•]?\s*\**KEYSTONE\s*:',l) for l in R.split('\n')): rul.append('keystone')
    seen=set()
    for l in R.split('\n'):
      m=re.match(r'^\s*(?:[-•*]\s*|\d+[.)]\s*)?\**(D\d+)\s+vs\.?\s+(C\d+)\b(?:\s*\([^)\n]*\))?[^:\n(]*:\s*\**(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|WITHDRAWN)\b',l)
      if m and (m[1],m[2]) not in seen: seen.add((m[1],m[2]));rul.append(f'{m[1]} vs {m[2]}')
      m=re.match(r'^\s*(?:[-•*]\s*)?RESTATED\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)',l)
      if m and (m[1],m[2]) not in seen: seen.add((m[1],m[2]));rul.append(f'{m[1]} vs {m[2]}')
    out[f'{f} {j["judge_seat"]}']=rul
for k,v in out.items(): print(k.ljust(14),len(v),'; '.join(v))
json.dump(out,open('pkgD/r2_expected.json','w'),indent=1)
