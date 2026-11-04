import sys
B=open("base/Build Save Body.js").read()
patch=open("patch_syn.js").read(); qh=open("qheld.js").read()
a1="  for(const s of SY.split(/\\n|(?<=[.!?])\\s+(?=[A-Z*_\"“])/)){const m=s.match(/(?<!"
assert B.count(a1)==1, ("a1",B.count(a1))
B=B.replace(a1, qh+a1)
a2="if(!held&&!affirmed(SIDEC[side],fr,objs))SX.push('(S-E)"
assert B.count(a2)==1, ("a2",B.count(a2))
B=B.replace(a2,"if(!held&&!qheld(s,side,fr)&&!affirmed(SIDEC[side],fr,objs))SX.push('(S-E)")
a3="SX.forEach(x=>FF.push('[AUDIT v23: SYNTHESIS CHECK '+x+'. REVIEW THIS ROW.]'));}"
assert B.count(a3)==1, ("a3",B.count(a3))
B=B.replace(a3, patch+" "+a3)
open("new/Build Save Body.js","w").write(B)
# block for harness
i=B.find("{const SY=String(d.synthesis||'');");j=B.find(a3,i)+len(a3)
open("test/synblock_new.js","w").write(B[i:j])
print("built",len(B))
