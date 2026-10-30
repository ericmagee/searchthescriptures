# Usage: python3 a3_esc_check.py OLD_DIR NEW_DIR
# For each .js in OLD_DIR: replace every 6-char backslash-u escape with the code point it names; the result must equal NEW byte for byte.
import os,re,sys,hashlib
old,new=sys.argv[1],sys.argv[2]
rx=re.compile(r'\\{1,2}u([0-9a-fA-F]{4})')
tot=0;bad=0
for f in sorted(os.listdir(old)):
    if not f.endswith('.js'):continue
    a=open(os.path.join(old,f),encoding='utf-8').read()
    b=open(os.path.join(new,f),encoding='utf-8').read() if os.path.exists(os.path.join(new,f)) else None
    n=len(rx.findall(a)); tot+=n
    exp=rx.sub(lambda m:chr(int(m.group(1),16)),a)
    ok=(b==exp)
    left=len(rx.findall(b)) if b is not None else -1
    if not ok:bad+=1
    print(f'{f}: escapes {n}, new==expected {ok}, escapes left {left}, old {hashlib.md5(a.encode()).hexdigest()[:8]} new {hashlib.md5(b.encode()).hexdigest()[:8] if b else None}')
print('total escapes',tot,'files not equal',bad)
