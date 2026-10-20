# BB-6904 portion 2: the DEBATE RULE VIOLATION paragraph after the COLLISION POINTS rule, both judges. Base: live db281705.
import json,hashlib,sys
md5=lambda s:hashlib.md5((s if s.endswith('\n') else s+'\n').encode()).hexdigest()
w=json.load(open(sys.argv[1]))['workflow'];N={n['name']:n for n in w['nodes']}
DRV=("DEBATE RULE VIOLATION (BB-6904; Isaiah 28:10, here a little, there a little). The rule on a BROKEN ground binds you as it binds the debaters. "
"On every COLLISION POINTS line you grade DEFENDER LINK BROKEN or CHALLENGER LINK BROKEN, exhibit on that line itself at least two lower layers of DIFFERENT kinds, each tagged: "
"[L1] with the KJV words quoted; [L2] with the Hebrew or Greek word in *italics*; [L3] with the cross-reference named. Two quotations at one layer are one layer. "
"A BROKEN line without them is a DEBATE RULE VIOLATION. The system checks every BROKEN line after you answer; a violating line is returned to you to cure, by exhibiting the two layers, "
"or to answer in writing why it stands. An answer that does not exhibit them leaves the violation standing, and that ground does not count toward BROKEN. "
"The same holds when your CONCEDED LINKS or CHALLENGER CONCEDED LINKS count is 0 while you grade a link of that side BROKEN for a witness left unanswered. Both sides alike.")
J=json.dumps(DRV)  # a double-quoted JS string literal
plan={
 'Build Independent Verdict':('A side with any link graded BROKEN here cannot be SELF-SUPPORTED.\"+NL+NL+\'CITATION CHECK, PER SEAT',
                              'A side with any link graded BROKEN here cannot be SELF-SUPPORTED.\"+NL+NL+'+J+'+NL+NL+\'CITATION CHECK, PER SEAT'),
 'Panel Build':('A side with any link graded BROKEN here cannot be SELF-SUPPORTED.\",\'\',\n\'CITATION CHECK, PER SEAT',
                'A side with any link graded BROKEN here cannot be SELF-SUPPORTED.\",\'\','+J+',\'\',\n\'CITATION CHECK, PER SEAT'),
}
for k,(a,b) in plan.items():
    s=N[k]['parameters']['jsCode'];open('base/'+k.replace(' ','_')+'.js','w').write(s)
    n=s.count(a);assert n==1,(k,n)
    t=s.replace(a,b);open(k.replace(' ','_')+'.new.js','w').write(t)
    print(k,'base',md5(s)[:8],len(s),'new',md5(t)[:8],len(t),'+',len(t)-len(s))
print('DRV chars',len(DRV),'md5',hashlib.md5(DRV.encode()).hexdigest()[:8])
