import json,re
A=json.load(open('confirms_all.json'))
RX=re.compile(r'^CLOSE-CONTRADICTION:\s*(\S+)\s*--\s*(DEFENDER|CHALLENGER)\s*--\s*LINK\s*(\d+)\s*--\s*CONFIRMED\s*--\s*EARLIER\s*\[([^\]]+)\]\s*"(.*)"\s*--\s*CLOSING\s*\[([^\]]+)\]\s*"(.*?)"\s*--\s*(.*)$',re.S)
def rl(s,P):
    s=s.upper().replace(' ','');s=re.sub(r'^ROUND','',s)
    return P+s if re.fullmatch(r'\d',s) else s
out=[];bad=[]
for a in A:
    m=RX.match(a['rl'])
    if not m: bad.append(a['id']);continue
    P='CR' if m[2]=='DEFENDER' else 'DR'
    out.append(dict(id=a['id'],t=a['t'],cid=m[1],side=m[2],link=int(m[3]),earlier_round=rl(m[4],P),earlier_q=m[5],closing_round=rl(m[6],P),closing_q=m[7],status='CONFIRMED'))
json.dump(out,open('rows_all.json','w'),ensure_ascii=False,indent=0)
print(len(out),'parsed; unparsed',bad)
