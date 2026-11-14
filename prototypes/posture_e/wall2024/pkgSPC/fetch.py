import json,sys,urllib.request,urllib.parse,re
K='sb_publishable_rgfWFjynRqBdzyEeBRHcig_c6pHysAi';V=json.load(open(sys.argv[1]));G={}
for k in V:
  m=re.match(r'^(.+) (\d+):(\d+)$',k)
  if m:G.setdefault((m[1],m[2]),[]).append(m[3])
rows=[]
for (b,c),vs in G.items():
  for i in range(0,len(vs),40):
    q='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/original_words?select=book,chapter,verse,word_position,strongs_number,transliteration,original_script,morph&book=eq.'+urllib.parse.quote(b)+'&chapter=eq.'+c+'&verse=in.('+','.join(vs[i:i+40])+')&limit=5000'
    r=urllib.request.Request(q,headers={'apikey':K,'Authorization':'Bearer '+K});rows+=json.load(urllib.request.urlopen(r))
nums=sorted({re.match(r'^([GH])0*(\d+)',r['strongs_number']).group(1)+re.match(r'^([GH])0*(\d+)',r['strongs_number']).group(2) for r in rows if r.get('strongs_number') and re.match(r'^[GH]\d',r['strongs_number'])})
lex=[]
json.dump(rows,open(sys.argv[2],'w'));print('rows',len(rows))
