#!/usr/bin/env python3
"""pkgOCB rev 2 (W4; W1's fold-in, Wall 3751). C4, C4G and C4B Extract keep a local copy __ogrS2 used only for the record field new_press.
It blanked only the GRANTS quotations, so an X line quoting a defender verse was listed as a NEW PRESS. This gives __ogrS2 the same two-section
blanking as the live __ogrS (GRANTS G lines and CONTRADICTIONS X lines). Record field only; nothing reads new_press by name.
usage: python3 build_OCB2.py <live fetchback (s85)> <out target.json>"""
import json, sys
sys.path.insert(0, '.')
src, out = sys.argv[1], sys.argv[2]
w = json.load(open(src)); N = {n['name']: n for n in w['nodes']}
OLD = ("const __ogrS2=t=>{const T=String(t||'');const i=T.search(/OPPONENT['\\u2019]?S GRANTS\\s*:/i);if(i<0)return T;const L=T.slice(i).split('\\n');const G=/^\\s*[-*]?\\s*\\**\\s*G(?:\\d+|\\+)/;"
       "let n=1;while(n<L.length&&(G.test(L[n])||(!L[n].trim()&&n+1<L.length&&G.test(L[n+1]))))n++;const sec=L.slice(0,n).join('\\n');return T.slice(0,i)+sec.replace(/[\"\\u201c][^\"\\u201d\\n]*[\"\\u201d]/g,'\"\"')+T.slice(i+sec.length);};")
# the live two-section __ogrS (pkgOCB B3), read from C4 Extract itself, renamed
c = N['C4 Extract']['parameters']['jsCode']; i = c.find('const __ogrS=t=>{const __sb=')
if i < 0: raise SystemExit('two-section __ogrS not found in C4 Extract (is pkgOCB live?)')
j = c.find('/* pkgOC', i); NEWDEF = c[i:j].rstrip()
if not NEWDEF.endswith('};'): raise SystemExit('unexpected __ogrS end: %r' % NEWDEF[-40:])
NEW = NEWDEF.replace('const __ogrS=', 'const __ogrS2=', 1) + ' /* pkgOCB rev 2: new_press also leaves out the CONTRADICTIONS quotations (W1, Wall 3751) */'
for k in ['C4 Extract', 'C4G Extract', 'C4B Extract']:
    s = N[k]['parameters']['jsCode']
    if s.count(OLD) != 1: raise SystemExit('%s: %d hits for the old __ogrS2' % (k, s.count(OLD)))
    if s.count('const __ogrS=t=>{const __sb=') != 1: raise SystemExit(k + ': two-section __ogrS missing')
    N[k]['parameters']['jsCode'] = s.replace(OLD, NEW)
json.dump({'nodes': w['nodes'], 'connections': w['connections']}, open(out, 'w'))
print('pkgOCB rev 2 built: __ogrS2 two-section in C4 Extract, C4G Extract, C4B Extract')
