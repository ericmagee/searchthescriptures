# ASK 526 build (W4; plan rev 2 9e2f3819, PASS W1 Wall 10558). Engine only; the child is unchanged.
# 1. Shared Library: no LIB line changes. The MAP gains one entry, "Alternate Merge CPD": the "Alternate Merge ERT" lines plus the lines that define
#    ri3Count2024/ri3Head2024 (885-888), psGrades (1376-1383) and cpdSync (1536-1546) (0-based LIB indices on the 520 library 1baf759d74aecb36).
# 2. Alternate Merge: at its end, after the ERT pass, one final cpdSync pass per judge body with the count marked as changed ("FINAL PASS"), so the
#    count-unchanged skip does not apply; the skip for an array whose length equals the count stays. Only a side that DERIVES is kept: its array is
#    replaced and its one "AUDIT v50: COUNTED PREMISES DERIVED (pkgCPD) ... COUNT: FINAL PASS to n" line is appended. A side that does not derive is
#    left exactly as it was, with no new line. Usage: python3 patch526.py <engine.json> <out.json>
import json,sys,hashlib
src,dst=sys.argv[1:3]
P=[[240,328],338,903,[904,905],1286,1287,[1288,1290],[1291,1298],394,1299,[885,888],[1376,1383],[1536,1546]]
ANCHOR="\nreturn __AMOUT;  "
ADD=("\ntry{ /* ASK 526 (pkgCPD final pass): the counted-premise arrays agree with the final count lines. cpdSync runs once more per judge body with the count "
"marked as changed (FINAL PASS), so the count-unchanged skip does not apply; only a side that DERIVES is kept (array replaced, one DERIVED line); a side that "
"does not derive is left exactly as it was, with no new line. Every in-run reader of the arrays runs upstream of this node. */\n"
" const __LT=$('Shared Library').params.jsCode;const __L=JSON.parse(__LT.slice(__LT.indexOf('\\n/*LIB*/')+8,__LT.lastIndexOf('\\n/*MAP*/')));const __M=JSON.parse(__LT.slice(__LT.lastIndexOf('\\n/*MAP*/')+8,__LT.lastIndexOf('\\n/*END*/')))['Alternate Merge CPD'];if(!__M)throw new Error('pkgLIB: the Shared Library holds no entry for Alternate Merge CPD');\n"
" const __S=__M.p.map(e=>typeof e==='number'?__L[e]:typeof e[0]==='string'?e[0]:__L.slice(e[0],e[1]+1).join('\\n')).join('\\n');if(__S.length!==__M.n)throw new Error('pkgLIB: Alternate Merge CPD rebuilt '+__S.length+' bytes, expected '+__M.n);\n"
" const __C=new Function('$',__S+'\\nreturn {cpdSync,rcObjEnd};')($);const o=__AMOUT&&__AMOUT[0]&&__AMOUT[0].json;const __er=[];\n"
" if(o&&Array.isArray(o.bodies))o.bodies=o.bodies.map((s,bi)=>{try{const j=JSON.parse(s);const p=j.payload||{};if(!p.judge_seat||typeof p.verdict_raw!=='string')return s;const raw=p.verdict_raw;const a=raw.indexOf('{');if(a<0)return s;const b=__C.rcObjEnd(raw,a);if(b<0)return s;\n"
"  const r=__C.cpdSync(raw.slice(a,b),{conceded_links:'FINAL PASS',challenger_conceded_links:'FINAL PASS'},p.judge_seat);const mk=String(r.mark||'').split('\\n').filter(x=>/^\\[AUDIT v50: COUNTED PREMISES DERIVED \\(pkgCPD\\)/.test(x));if(!mk.length)return s;\n"
"  p.verdict_raw=raw.slice(0,a)+r.j+raw.slice(b)+mk.map(x=>'\\n'+x).join('');j.payload=p;return JSON.stringify(j);}catch(e){__er.push('body '+bi+': '+String(e&&e.message||e));return s;}});\n"
" if(o&&__er.length)o.cpd526_error=__er.join(' | ');\n"
"}catch(e){try{const o=__AMOUT&&__AMOUT[0]&&__AMOUT[0].json;if(o)o.cpd526_error=String(e&&e.message||e);}catch(e2){}}  ")
def patch(src,dst):
    d=json.load(open(src));N={n['name']:n for n in d['nodes']}
    t=N['Shared Library']['parameters']['jsCode']
    a=t.index('\n/*LIB*/')+8;b=t.rindex('\n/*MAP*/');c=b+8;e=t.rindex('\n/*END*/')
    L=json.loads(t[a:b]);M=json.loads(t[c:e])
    assert 'library sha 1baf759d74aecb36' in t[:a] or 'library sha a383650b705f3fb7' in t[:a], 'base library'
    assert 'Alternate Merge CPD' not in M
    assert L[1536].startswith('function cpdSync(') and L[1376].startswith('function psGrades(') and L[886].startswith('function ri3Count2024(') and L[888].startswith('function ri3Head2024(')
    assert M['Alternate Merge ERT']['p']==P[:10]
    S='\n'.join((L[x] if isinstance(x,int) else '\n'.join(L[x[0]:x[1]+1])) for x in P)
    M['Alternate Merge CPD']={'n':len(S),'p':P}
    N['Shared Library']['parameters']['jsCode']=t[:a]+json.dumps(L,ensure_ascii=False)+'\n/*MAP*/'+json.dumps(M,ensure_ascii=False)+'\n/*END*/'+t[e+8:]
    am=N['Alternate Merge']['parameters']['jsCode']
    assert am.count(ANCHOR)==1 and am.endswith(ANCHOR) or am.rstrip().endswith('return __AMOUT;'), 'anchor'
    k=am.rindex('\nreturn __AMOUT;')
    N['Alternate Merge']['parameters']['jsCode']=am[:k]+ADD+am[k:]
    json.dump(d,open(dst,'w'),ensure_ascii=False)
    print(dst,hashlib.md5(open(dst,'rb').read()).hexdigest()[:8],'MAP entry n',len(S))
patch(src,dst)
