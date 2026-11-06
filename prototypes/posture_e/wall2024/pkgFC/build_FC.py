# pkgFC (W3 on Walls 2330, 2331): a FORCED line may carry its commitment tag between FORCED and the colon, "FORCED (Commitment 7): D1 vs C2 -- ...",
# the form K-CMT's "(Commitment N)" leads judges to write (run 33020 chatgpt S14: E-APPLY "no line form the engine reads"). Every regex that reads
# a FORCED line ("FORCED\s*:") takes an optional "(Commitment N)": KF_LINE (K-F, the K-G4 FORCED cure, __kfHas in drvCheck), kfLines' line test,
# SB_FORM (E-APPLY), the pkgGD gate FORCED write filter and gateForced2024 (pkgGF). Base: live a895b1eb = pkgCR/patched (19 cure-library nodes) +
# pkgKIND/final for the 5 other nodes that read FORCED (Panel Payloads, Alternate Payloads, Judge Enforcer Build, Alt Judge Enforcer Build,
# Extract Independent Verdict). Run from wall2024/.
import os,json,hashlib
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
A=r'FORCED\s*:';B=r'FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:'
OTHER=['Panel_Payloads.js','Alternate_Payloads.js','Judge_Enforcer_Build.js','Alt_Judge_Enforcer_Build.js','Extract_Independent_Verdict.js']
plan={'base':'pkgCR/patched (19) + pkgKIND/final (5)','nodes':[]}
srcs=[('pkgCR/patched',f) for f in sorted(os.listdir('pkgCR/patched'))]+[('pkgKIND/final',f) for f in OTHER]
for d,f in srcs:
    o=open(d+'/'+f).read();n=o.count(A);assert n>0,(f,'no FORCED regex');s=o.replace(A,B)
    open('pkgFC/patched/'+f,'w').write(s);plan['nodes'].append({'file':f,'name':f[:-3].replace('_',' '),'base':d,'base_sha':sha(o),'final_sha':sha(s),'sites':n})
json.dump(plan,open('pkgFC/plan_FC.json','w'),indent=1);print(len(plan['nodes']),'nodes',sum(x['sites'] for x in plan['nodes']),'sites')
