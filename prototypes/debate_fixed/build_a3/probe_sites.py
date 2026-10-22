# THE DEBATE FIXED (BB-7397), drift BB-7414: one single-site misedit probe per build site (wake_link_manual 7B(3)), Worker_A3.
# A site is one (old, new) pair in one node, as patch_fixed.py applies it. Each probe copies new/, undoes that one pair in that one node,
# runs the whole suite, and compares the suite's output with the clean suite's output. DETECTED = the output differs.
# Usage: python3 probe_sites.py <report27665.md> <w2_label.cjs>
import sys, os, shutil, subprocess, tempfile, importlib.util, json
HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('pf', os.path.join(HERE, 'patch_fixed.py')); pf = importlib.util.module_from_spec(spec); spec.loader.exec_module(pf)
REP, W2 = [os.path.abspath(x) for x in sys.argv[1:3]]
TEXTS = {'K-G6 rule text': pf.LIB[0][1].split('\n')[1].strip()[:60], 'K-G6 statement text': 'For a K-G6 item it must quote', 'plain sentence': pf.PLAIN_JS}

def plan():
    p = {}
    for n in pf.CURE_NODES: p.setdefault(n, []).extend(pf.LIB)
    for n, x in pf.TAIL.items(): p.setdefault(n, []).extend(x)
    for n, x in pf.RAISE.items():
        p.setdefault(n, []).append((pf.RAISE_FN_ANCHOR, pf.LEDGER_FN.lstrip('\n') + pf.RAISE_FN_ANCHOR)); p[n].extend(x)
    for n, x in pf.OTHER.items(): p.setdefault(n, []).extend(x)
    return p

def run(cmd, cwd):
    r = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True, timeout=120)
    return (r.stdout + r.stderr).strip()

def suite(d):
    w = tempfile.mkdtemp(dir=os.path.dirname(d)); shutil.copy(os.path.join(HERE, 'row27665.json'), w)
    for h in ('h_f3a.cjs', 'h_cure.cjs', 'h_fm.cjs', 'h_ask.cjs', 'h_site.cjs', 'h_fm6.cjs', 'h_count.cjs'): shutil.copy(os.path.join(HERE, h), w)
    shutil.copy(os.path.join(HERE, 'derive_new.sql'), os.path.dirname(d))  # h_count reads <dir>/../derive_new.sql
    os.symlink(d, os.path.join(w, 'P'))
    out = []
    for n in ('Panel_Payloads', 'Alternate_Payloads', 'Extract_Independent_Verdict'):
        out.append('F3a ' + n + '\n' + run('node h_f3a.cjs P/%s.js %s' % (n, REP), w))
    out.append('CURE\n' + run('node h_cure.cjs P %s' % REP, w))
    out.append('FM\n' + run('node h_fm.cjs P/Format_Markdown.js panel', w) + '\n' + run('node %s fm_out_panel_P.md' % W2, w))
    md = open(os.path.join(w, 'fm_out_panel_P.md')).read() if os.path.exists(os.path.join(w, 'fm_out_panel_P.md')) else ''
    out.append('FM md5 %s' % __import__('hashlib').md5(md.encode()).hexdigest())
    out.append('ASK\n' + run('node h_ask.cjs P', w))
    out.append('SITE\n' + run('node h_site.cjs P %s' % REP, w))
    out.append('FM6\n' + run('node h_fm6.cjs P/Format_Markdown.js panel', w))
    out.append('COUNT\n' + run('node h_count.cjs P', w))
    # text outputs: the strings each node sends, counted per node (the request text is the node's output to the model)
    cnt = {}
    for f in sorted(os.listdir(d)):
        s = open(os.path.join(d, f)).read()
        for k, t in TEXTS.items():
            c = s.count(t)
            if c: cnt[f + ' ' + k] = c
        if f == 'Build_Save_Body.js': cnt['Build_Save_Body framework_verdict:null'] = s.count('framework_verdict:null')
    out.append('TEXT ' + json.dumps(cnt, sort_keys=True))
    shutil.rmtree(w)
    return '\n'.join(out)

def main():
    root = tempfile.mkdtemp(prefix='probe_', dir=HERE)
    clean = os.path.join(root, 'clean'); shutil.copytree(os.path.join(HERE, 'new'), clean)
    C = suite(clean)
    open(os.path.join(root, '..', 'PROBE_CLEAN.txt'), 'w').write(C)
    rows = []; P = plan()
    for n in sorted(P):
        for i, (a, b) in enumerate(P[n]):
            d = os.path.join(root, 'p'); shutil.rmtree(d, ignore_errors=True); shutil.copytree(clean, d)
            f = os.path.join(d, n + '.js'); s = open(f).read()
            assert s.count(b) == 1, (n, i)
            open(f, 'w').write(s.replace(b, a))
            S = suite(d)
            diff = [l for l in S.split('\n') if l not in C.split('\n')]
            rows.append((n, i, 'DETECTED' if S != C else 'SILENT', (diff[0][:150] if diff else '')))
    shutil.rmtree(root)
    for r in rows: print('%-28s pair %d  %-8s %s' % r)
    print('sites', len(rows), '| DETECTED', sum(r[2] == 'DETECTED' for r in rows), '| SILENT', sum(r[2] == 'SILENT' for r in rows))
main()
