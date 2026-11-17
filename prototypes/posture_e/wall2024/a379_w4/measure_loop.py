import json,sys
d=json.load(open(sys.argv[1]));rd=d["data"]["resultData"]["runData"];print("status",d["status"],json.dumps(d["data"]["resultData"].get("error"))[:300])
stub=set(json.load(open(sys.argv[2])) ) if len(sys.argv)>2 else set()
tot=0;loop=0
for k,v in rd.items():
  b=sum(len(json.dumps(r.get("data"))) for r in v);tot+=b
  if k in("Second Alternate?","Second Alternate Needed?","Alternate Pass Call","Pass Accumulate","Alternate Merge"):
    loop+=b;print(f"  {k}: runs {len(v)}, MB {[round(len(json.dumps(r.get('data')))/1e6,2) for r in v]}")
print("parent total MB",round(tot/1e6,1),"loop nodes MB",round(loop/1e6,1),"stubs MB",round((tot-loop)/1e6,1))
sa=rd["Second Alternate?"];print("decisions:",[ (r["data"]["main"][0][0]["json"]["a2r"]["run"],r["data"]["main"][0][0]["json"]["a2r"]["why"][:70]) for r in sa])
am=rd.get("Alternate Merge");
if am:
  A=am[-1]["data"]["main"][0][0]["json"];print("tried:",[(x["removed_seat"],x["alternate"],x["result"],x["why"][:50]) for x in A["alternates_tried"]])
