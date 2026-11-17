import json,re,collections,sys
R=json.load(open(sys.argv[1] if len(sys.argv)>1 else 'res380.json'))
tot=collections.Counter();other=[];seatlines=[];noalt=[];rfb=0;hdr=[];tried_mod=[]
for x in R:
  a=x['a'].split('\n');b=x['b'].split('\n')
  if any('REMOVED FOR' in l for l in b): rfb+=1; print('REMOVED FOR still in',x['tok'],[l for l in b if 'REMOVED FOR' in l][:2])
  # pair by multiset
  ca=collections.Counter(a);cb=collections.Counter(b)
  gone=list((ca-cb).elements());new=list((cb-ca).elements())
  for l in new:
    if re.match(r'^- .+ was not counted: ',l): seatlines.append((x['tok'],l))
    elif ': no alternate, ' in l: noalt.append((x['tok'],l))
    elif l.startswith('- Panel judge'): hdr.append((x['tok'],l))
    elif ' tried, ' in l: tried_mod.append((x['tok'],l))
    else: other.append((x['tok'],'+',l))
  for l in gone:
    if ': alternate none tried, ' in l: continue
    if 'REMOVED FOR' in l: continue
    other.append((x['tok'],'-',l))
print('debates',len(R),'with REMOVED FOR left',rfb)
print('seat lines added',len(seatlines));[print('  ',t,l[:200]) for t,l in seatlines]
print('no-alternate lines',len(noalt))
print('header lines changed',len(hdr));[print('  ',t,l[:260]) for t,l in hdr]
print('tried lines changed (clause dropped)',len(tried_mod))
print('OTHER differing lines',len(other));[print('  ',o[0],o[1],o[2][:200]) for o in other[:20]]
