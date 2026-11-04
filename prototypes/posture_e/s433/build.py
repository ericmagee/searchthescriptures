#!/usr/bin/env python3
"""s433 (WALL-1963 plan revision 6, piece 2, builder Worker_C; rulings 428, 439: "an enforcer be installed everywhere a judges makes a decision").
The DeepSeek judge enforcer also reads:
  E-HOLD  each collision line a panel judge graded STANDS or UNDERDETERMINED (item 1), with that judge's own ANSWER CHECK lines on the verses the
          line names, so the enforcer reads the quoted press and answer the grade rests on;
  E-KEY   each KEYSTONE line (item 2), with that judge's own collision lines on the keystone link.
NO ANSWER is defined for every rule (the judge's line lacks its grade or its ground, or is not in its form), so an enforcer NO ANSWER row is a
reported violation and the s432 send-back may carry it. Judge Enforcer Record accepts the new ids (H, Z), the RIGHT value UNDERDETERMINED, and
tallies E-HOLD and E-KEY. Nothing else changes. Base: a GET of the live flow (path in argv[1]), versionId given in argv[2] (prefix)."""
import json, os, sys
R = os.path.dirname(os.path.abspath(__file__))
L = json.load(open(sys.argv[1]))
assert L['versionId'].startswith(sys.argv[2]), L['versionId']
N = {n['name']: n for n in L['nodes']}
OUT = {}

def rep(nm, a, b):
    c = OUT.get(nm) or N[nm]['parameters']['jsCode']
    if nm not in OUT:
        open(f'{R}/base/{nm}.js', 'w').write(c)
    k = c.count(a)
    if k != 1:
        raise SystemExit(f'{nm}: anchor count {k}: {a[:70]}')
    OUT[nm] = c.replace(a, b)

JEB = 'Judge Enforcer Build'
JER = 'Judge Enforcer Record'

NEW_ITEMS = r"""// s433 (WALL-1963 revision 6, piece 2; rulings 428, 439). E-HOLD: each collision line a panel judge graded STANDS or UNDERDETERMINED, with
// that judge's own ANSWER CHECK lines on the verses the line names. E-KEY: each KEYSTONE line, with that judge's own collision lines on that link.
const refsOf=s=>{const o=new Set();for(const m of String(s||'').matchAll(/\b((?:[1-3]\s)?[A-Z][a-z]+)\s+(\d+):(\d+)/g))o.add(m[1].toLowerCase()+' '+m[2]+':'+m[3]);return o;};
const linesOf=t=>String(t||'').split('\n').map(l0=>l0.replace(/^[\s*\-•]+/,''));
const HOLD=/^([DC]\d+(?:\s*vs\.?\s*[DC]\d+)?)\s*(?:\([^)]*\))?\s*:\s*(STANDS|UNDERDETERMINED)\b/;
const HG=[];
for(const j of judges){const ls=linesOf(j.t);const acs=ls.filter(l=>/^ANSWER CHECK:/.test(l));
 for(const l of ls){const m=l.match(HOLD);if(!m||/LINK BROKEN/.test(l))continue;
  const rs=refsOf(l);const own=acs.filter(a=>{const v=(a.match(/^ANSWER CHECK:\s*(.+?)\s*--/)||[])[1]||'';for(const r of refsOf(v))if(rs.has(r))return true;return false;}).slice(0,6);
  HG.push({seat:j.seat,line:l,link:m[1].replace(/\s+/g,' '),grade:m[2],own});}}
let hi=0;
for(const g of HG){hi++;const id='H'+hi+'.1';
 items.push({ids:[{id,rule:'E-HOLD',seat:g.seat,grade:g.grade,item:'COLLISION '+g.link,flagged_line:g.line.slice(0,1500),response_line:g.line.slice(0,700)}],
  text:'ITEM H'+hi+' (E-HOLD, a collision line graded '+g.grade+'):\nTHE LINE ('+id+', '+g.seat+'): '+cut(g.line,1600)+'\nTHIS JUDGE\'S OWN ANSWER CHECK LINES ON THE VERSES THE LINE NAMES:\n'+(g.own.length?g.own.map(a=>'- '+cut(a,900)).join('\n'):'(none on these verses)')});}
const KG=[];
for(const j of judges){const ls=linesOf(j.t);for(const l of ls){const m=l.match(/^KEYSTONE\s*:\s*([DC]\d+)\s*(?:--|—|–|-)\s*([A-Z][A-Z -]*?)\b(?:\s*(?:--|—|–|-)\s*([\s\S]*))?$/);if(!m)continue;
 const link=m[1];const own=ls.filter(x=>x!==l&&new RegExp('^(?:FORCED\\s*:\\s*)?'+link+'\\b').test(x)).slice(0,6);KG.push({seat:j.seat,line:l,link,grade:m[2].trim(),own});}}
let zi=0;
for(const g of KG){zi++;const id='Z'+zi+'.1';
 items.push({ids:[{id,rule:'E-KEY',seat:g.seat,grade:g.grade,item:'KEYSTONE '+g.link,flagged_line:g.line.slice(0,1500),response_line:g.line.slice(0,700)}],
  text:'ITEM Z'+zi+' (E-KEY, the keystone line):\nTHE LINE ('+id+', '+g.seat+'): '+cut(g.line,1200)+'\nTHIS JUDGE\'S OWN COLLISION LINES ON '+g.link+':\n'+(g.own.length?g.own.map(a=>'- '+cut(a,1200)).join('\n'):'(none)')});}
"""

rep(JEB, "let SY='';try{const RG=", NEW_ITEMS + "let SY='';try{const RG=")

OLD_FORM = ("+'Reply with exactly one line per judge id, and nothing else, in this form:\\nENFORCER: <judge id> -- AGREE | DISAGREE | NO ANSWER -- "
            "RIGHT: MEETS | MISSES | VOID | NOT VOID | BROKEN | STANDS | TRUE | OVERSTATED -- <one sentence that quotes the words that decide it>';")
NEW_FORM = ("+'RULE E-HOLD (a collision line graded STANDS or UNDERDETERMINED). STANDS is right only when the answering side\\'s own words, as quoted to you "
            "in the line or in this judge\\'s ANSWER CHECK lines, carry a meaning the link can agree with for the meaning pressed. UNDERDETERMINED is right "
            "only when the quoted words show that both readings agree with the pressed verse and neither side\\'s words show that the other cannot. BROKEN "
            "when the answer\\'s quoted words cannot agree with the meaning pressed, or the answer is only a bare grant or an absence with no fit of its own. "
            "A ground that rests on an absence (no verse states it, the text does not narrate it), or on the judge\\'s own reading rather than the debate\\'s "
            "words, is not a ground. AGREE when the judge\\'s grade is right; DISAGREE when it is not.\\n'\n"
            " +'RULE E-KEY (the keystone line). The keystone grade must follow from this judge\\'s own collision lines on that link, given to you: STANDS "
            "only when none of them grades the link BROKEN or FORCED and the link was not withdrawn; BROKEN when one of them does. Its ground, where it gives "
            "one, must rest on the debate\\'s words, not on the judge\\'s own statement of doctrine. AGREE when the keystone grade follows and its ground rests "
            "on the debate\\'s words; DISAGREE when it does not.\\n'\n"
            " +'NO ANSWER, for every rule: the judge\\'s line lacks its grade or its ground, or is not in its form. It reports a violation by the judge; it is "
            "never your own uncertainty, and you choose AGREE or DISAGREE whenever the line can be read.\\n'\n"
            " +'Reply with exactly one line per judge id, and nothing else, in this form:\\nENFORCER: <judge id> -- AGREE | DISAGREE | NO ANSWER -- "
            "RIGHT: MEETS | MISSES | VOID | NOT VOID | BROKEN | STANDS | UNDERDETERMINED | TRUE | OVERSTATED -- <one sentence that quotes the words that decide it>';")
rep(JEB, OLD_FORM, NEW_FORM)

rep(JER, "([BVKY]\\d+\\.\\d+)", "([BVKYHZ]\\d+\\.\\d+)")
rep(JER, "RIGHT\\s*:\\s*(MEETS|MISSES|NOT VOID|VOID|BROKEN|STANDS|TRUE|OVERSTATED)",
         "RIGHT\\s*:\\s*(MEETS|MISSES|NOT VOID|VOID|BROKEN|STANDS|UNDERDETERMINED|TRUE|OVERSTATED)")
rep(JER, "for(const k of ['E-ANS','E-VOID','E-COL','E-SYN'])", "for(const k of ['E-ANS','E-VOID','E-COL','E-SYN','E-HOLD','E-KEY'])")

for nm, c in OUT.items():
    open(f'{R}/new/{nm}.js', 'w').write(c)
json.dump({'base_versionId': L['versionId'], 'nodes': sorted(OUT)}, open(f'{R}/manifest.json', 'w'), indent=1)
print('built', sorted(OUT))
