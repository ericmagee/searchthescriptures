# BB-8327 step 4 (D1 with D2): K-C in the 17 code nodes that carry the drv library (live 0b025942, ../live/).
# Every anchor must occur exactly once where it is applied; the run stops on the first miss.
import os, sys, hashlib
H = os.path.dirname(os.path.abspath(__file__))
LIVE = os.path.join(H, '..', 'live')
OUT = os.path.join(H, 'new'); os.makedirs(OUT, exist_ok=True)
snip = lambda f: open(os.path.join(H, 'snip', f), encoding='utf-8').read()
LIB, KCC, RULE, VERD = snip('lib.js'), snip('kc_check.js'), snip('kc_rule.txt'), snip('kc_verdict.js')
DETECT = {'Extract_Independent_Verdict.js': 'prev&&prev.verdictBody', 'Panel_Payloads.js': 'jd.body', 'Alternate_Payloads.js': 'a.body'}

def once(s, a, b, f):
    n = s.count(a)
    if n != 1:
        sys.exit('ANCHOR %d x in %s: %r' % (n, f, a[:80]))
    return s.replace(a, b)

files = sorted(f for f in os.listdir(LIVE) if f.endswith('.js'))
for f in files:
    s = open(os.path.join(LIVE, f), encoding='utf-8').read(); base = s
    # 1 the net library, before drvCheck (all 17)
    s = once(s, 'function drvCheck(', LIB + 'function drvCheck(', f)
    # 2 K-C items and marks at the end of drvCheck (all 17)
    a = "recorded, not counted as a violation.]');\n return {items,marks};}"
    s = once(s, a, "recorded, not counted as a violation.]');\n" + KCC + " return {items,marks};}", f)
    if f in DETECT:
        # 3 the chain each K-C item set aside, read from the judge's prompt (3 detection nodes)
        a = 'const DRV=drvCheck('
        i = s.index(a); j = s.index('\n', i)
        line = s[i:j]
        s = s[:j] + "\n" + (' ' if s[i-1] == ' ' else '') + "for(const x of DRV.items)if(x.rule==='K-C')x.chain=drvChains(drvPromptText(" + DETECT[f] + "),x); // BB-8327 D1 (q3)" + s[j:]
        assert s.count('x.chain=drvChains(') == 1, f
    else:
        # 4 the cure library (14 nodes)
        s = once(s, "x.rule==='K-S')?x.rule+' '+x.link", "x.rule==='K-S'||x.rule==='K-C')?x.rule+' '+x.link", f)
        s = once(s, "||x.rule==='K-S')?String(x.line||'').trim():", "||x.rule==='K-S'||x.rule==='K-C')?String(x.line||'').trim()+(x.rule==='K-C'&&x.chain?'\\n  '+x.chain:''):", f)
        s = once(s, 'with exactly one CORRECTED RESULT.";\nconst CURE_FORM=', 'with exactly one CORRECTED RESULT.' + RULE + '";\nconst CURE_FORM=', f)
        s = once(s, '+"RESTATED: <the full collision line, beginning D<n> vs C<m>>\\n"',
                 '+"RESTATED: <the full collision line, beginning D<n> vs C<m>>\\n"\n +"RESTATED: <for a K-C item on a REASONING, KEYSTONE, STANDING or CONCEDED line: that label, a colon, then the whole regraded sentence>\\n"', f)
        s = once(s, "else if(k[1]==='RESTATED'&&(m=r.match(/^D(\\d+)(?:\\s+vs\\.?\\s+C(\\d+))?\\b/i))){",
                 "else if(k[1]==='RESTATED'&&(m=r.match(/^(REASONING|KEYSTONE|RESULT|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\\s*[:\\-–—]+\\s*/i)))o.restated.push({link:m[1].toUpperCase(),grade:null,text:r.slice(m[0].length),line:l}); // BB-8327 D1\n  else if(k[1]==='RESTATED'&&(m=r.match(/^D(\\d+)(?:\\s+vs\\.?\\s+C(\\d+))?\\b/i))){", f)
        s = once(s, "const keys=(x.rule==='K-B'||x.rule==='K-S')?[x.link]", "const keys=(x.rule==='K-B'||x.rule==='K-S'||x.rule==='K-C')?[x.link]", f)
        s = once(s, "  return res('UNCURED','unknown rule',null);", VERD + "  return res('UNCURED','unknown rule',null);", f)
        s = once(s, "+'; RULE: '+x.rule+'; RESULT: '+x.status", "+'; RULE: '+x.rule+'; RESULT: '+x.status+(x.rule==='K-C'&&x.status!=='CURED'?'; NOT COUNTED (K-C UNCURED)':'')", f)
    open(os.path.join(OUT, f), 'w', encoding='utf-8').write(s)
    print('%-32s %s -> %s  +%d' % (f, hashlib.md5(base.encode()).hexdigest()[:8], hashlib.md5(s.encode()).hexdigest()[:8], len(s) - len(base)))
