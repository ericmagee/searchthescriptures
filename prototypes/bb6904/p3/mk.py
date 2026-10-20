# BB-6904 portion 3: build Extract Independent Verdict and Panel Payloads drafts from the live db281705 code (base/) and drv_check.js.
# The counter is taken from kb.cjs (git 29caa5c) by line, its names prefixed DRV_/drv, one return changed to list the kinds met.
import hashlib, re
md5 = lambda s: hashlib.md5((s if s.endswith('\n') else s + '\n').encode()).hexdigest()
kb = open('kb.cjs').read().split('\n')
consts = kb[1:5]                                   # REF, SRC, QUOTE, NEG
fn = kb[5:18]                                      # function exhibits(...) { ... }
assert consts[0].startswith('const REF=') and consts[3].startswith('const NEG=') and fn[0].startswith('function exhibits(') and fn[-1] == '}'
ren = lambda s: re.sub(r'\b(REF|SRC|QUOTE|NEG)\b', r'DRV_\1', s).replace('function exhibits(', 'function drvExhibits(')
body = '\n'.join(ren(x) for x in consts + fn)
old_ret = 'return distinct?met.size:n;'
assert body.count(old_ret) == 1
body = body.replace(old_ret, "return distinct?[...met].sort().map(t=>'L'+t):n;")
body += '\nconst drvKinds=(line)=>drvExhibits(line,false,true,true);'
block = open('drv_check.js').read().replace('__KB__', body)
open('drv_block.js', 'w').write(block)

def patch(src, edits):
    for a, b in edits:
        assert src.count(a) == 1, (a[:60], src.count(a))
        src = src.replace(a, b)
    return src

E = open('base/Extract_Independent_Verdict.js').read()
a1 = '// FLAG COUNT AND DATA CLASS (rulings BB-4503 Q3).'
a2 = 'challenger_void_links:chVoid}}];'
En = patch(E, [
    (a1, block + 'const DRV=drvCheck(raw0,conceded_links,challenger_conceded_links,defense_standing,challenge_standing,askedD);for(const x of DRV.marks)raw+=\'\\n\\n\'+x;\n' + a1),
    (a2, 'challenger_void_links:chVoid,debate_rule_violations:DRV.items}}];'),
])
open('Extract_Independent_Verdict.new.js', 'w').write(En)

P = open('base/Panel_Payloads.js').read()
b1 = 'const bodies=[];const summary=[];'
b2 = ' for(const x of sameModelMarks(p,WT))marks.push(x);'
b3 = 'flags:marks.length,substitute:isSub'
Pn = patch(P, [
    (b1, block + b1),
    (b2, b2 + '\n let drvAsk=false;try{drvAsk=JSON.stringify(jd.body||{}).includes(\'CITATION CHECK\');}catch(e){drvAsk=false;}const DRV=drvCheck(WT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,drvAsk);for(const x of DRV.marks)marks.push(x);'),
    (b3, 'flags:marks.length,drv:DRV.items,substitute:isSub'),
])
open('Panel_Payloads.new.js', 'w').write(Pn)

for n, s, t in [('Extract Independent Verdict', E, En), ('Panel Payloads', P, Pn)]:
    print(n, 'base', md5(s)[:8], len(s), 'new', md5(t)[:8], len(t), '+', len(t) - len(s))
print('block chars', len(block), 'md5', hashlib.md5(block.encode()).hexdigest()[:8])
