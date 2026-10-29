# Step 5 build: insert the part 3 floating-[L4] rule after the one anchor in Panel Build and Build Independent Verdict (copies of live c1bdcd5a).
import hashlib,os
A='Name every floating [L4] on either side before weighing it;'
INS=(' an [L4] floats only when the block that states it exhibits fewer than two prior layers ([L1]-[L3]) for it; that one test applies to the defender and the challenger alike.'
 ' That no quoted row states an [L4] is never a reason to call it floating: an [L4] is an inference by definition, and that demand is the retired stating-verse test, at a collision as everywhere else.'
 ' A judge that names an [L4] floating names, in the same sentence, the layers its block exhibits and the layer it lacks.'
 ' An [L4] whose block exhibits two or more prior layers is footed for either side and is weighed at its collision on the rows it rests on; a verse held to contradict it is quoted in the words that state the contrary;')
assert '"' not in INS and '\\' not in INS
for f in ['Panel_Build.js','Build_Independent_Verdict.js']:
    t=open('../p8/final/'+f).read(); assert t.count(A)==1,(f,t.count(A))
    n=t.replace(A,A+INS); assert n.count(A)==1 and n.count(INS)==1
    open('new_'+f,'w').write(n)
    print(f, hashlib.md5(t.encode()).hexdigest()[:8],'->',hashlib.md5(n.encode()).hexdigest()[:8], len(t),'->',len(n))
open('insert.txt','w').write(INS.strip()+'\n'); print('insert chars',len(INS.strip()))
