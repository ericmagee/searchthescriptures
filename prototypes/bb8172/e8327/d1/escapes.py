# BB-8327 (8359 (1)): each backslash-u escape in d1/new becomes the code point it names; nothing else changes.
# In a quoted string that is later given to RegExp ('[\\s\\u2010...]') the escaped backslash goes with it, so the
# string holds the literal character where it held the escape; in a regex literal (/—/) the escape alone goes.
import os, re, sys
rx2 = re.compile(r'\\\\u([0-9a-fA-F]{4})'); rx1 = re.compile(r'(?<!\\)\\u([0-9a-fA-F]{4})')
d = sys.argv[1] if len(sys.argv) > 1 else 'new'
for f in sorted(os.listdir(d)):
    p = os.path.join(d, f); s = open(p, encoding='utf-8').read(); o = s
    s = rx2.sub(lambda m: chr(int(m.group(1), 16)), s); s = rx1.sub(lambda m: chr(int(m.group(1), 16)), s)
    if s != o: open(p, 'w', encoding='utf-8').write(s); print(f)
