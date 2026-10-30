# A3 9b-amend check: old file vs amended file; exactly one site, the 6-char escape backslash-u2019 -> U+2019, nothing else.
import sys,difflib,hashlib
old,new=[open(p,encoding='utf-8').read() for p in sys.argv[1:3]]
ops=[o for o in difflib.SequenceMatcher(None,old,new,autojunk=False).get_opcodes() if o[0]!='equal']
print('md5',hashlib.md5(old.encode()).hexdigest(),'->',hashlib.md5(new.encode()).hexdigest(),'len',len(old),'->',len(new),'ops',len(ops))
ok=len(ops)==1 and ops[0][0]=='replace' and old[ops[0][1]:ops[0][2]]=='\\u2019' and new[ops[0][3]:ops[0][4]]=='’'
for o in ops: print(' ',o[0],repr(old[o[1]:o[2]]),'->',repr(new[o[3]:o[4]]))
print('ONE-SITE ESCAPE ONLY:', ok); sys.exit(0 if ok else 1)
