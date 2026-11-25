import json,sys
for f in sys.argv[1:]:
  d=json.load(open(f));rd=d['data']['resultData']['runData']
  for n,runs in rd.items():
    for ri,r in enumerate(runs):
      outs=(r.get('data') or {}).get('main') or []
      for oi,out in enumerate(outs):
        for k,it in enumerate(out or []):
          j=it.get('json',{});u=j.get('usage') or {}
          print(f,'|',n,'r',ri,'o',oi,'i',k,'| id',j.get('id'),'| model',j.get('model'),'| in',u.get('prompt_tokens',u.get('input_tokens')),'out',u.get('completion_tokens',u.get('output_tokens')),'cost',u.get('cost'),'byok',u.get('is_byok'),'| keys',','.join(sorted(j.keys()))[:90])
