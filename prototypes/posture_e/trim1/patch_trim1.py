#!/usr/bin/env python3
"""Trim A1-A3 (the judge decides the verdict basis, the result and the standings; counts stay as reported facts) and the reserve seat (DeepSeek replaces MiMo).
Over the committed live copy brace/fetchback_brace.json (301acba5). Each anchor is asserted in its expected node count and count per node."""
import json, os
ROOT=os.path.dirname(os.path.abspath(__file__))
BASE=json.load(open(os.path.join(ROOT,'..','brace','fetchback_brace.json')))
E=[ # (anchor, replacement, expected nodes, count per node)
("VERDICT DEFINITIONS -- apply these mechanically, first match wins; not your own scale.",
 "VERDICT DEFINITIONS -- the verdict word follows from your own rulings at the collision points and on the withdrawn links (Commitment 7: you judge; you do not only count); first match wins.",2,1),
("BROKEN gives CHALLENGER WINS. HELD gives DEFENDER WINS only if CHALLENGE STANDING is not SELF-SUPPORTED or at least one collision is graded CHALLENGER LINK BROKEN. Every other case gives UNDERDETERMINED.",
 "BROKEN gives CHALLENGER WINS. Otherwise the RESULT is your judgment (Commitments 7 and 8): DEFENDER WINS when the verses of the record, read together line upon line, support the chain of the defender against the chain of the challenger; UNDERDETERMINED when, read together, they leave the topic open. The sentence gives the reason.",2,1),
("COLLAPSED = by count, mandatory, not discretionary: 2c > L, where L is the number of premises the CHALLENGER listed",
 "COLLAPSED = your judgment that the defense rests on inadmissible claims, most of the premises listed against it standing conceded or unexhibited (Commitment 7); report L and c, where L is the number of premises the CHALLENGER listed",2,1),
("COLLAPSED = by count, mandatory, not discretionary: 2c > L, where L is the number of premises the DEFENDER listed",
 "COLLAPSED = your judgment that the challenge rests on inadmissible claims, most of the premises listed against it standing conceded or unexhibited (Commitment 7); report L and c, where L is the number of premises the DEFENDER listed",2,1),
("COLLAPSED is reached by this count only; SELF-SUPPORTED against PROP-DEPENDENT is your judgment as defined above.",
 "All three standings are your judgment as defined above; L and c are the count you weigh.",2,2),
(": when 2c > L the standing is COLLAPSED, whatever the clause.", ".",2,1),
("DEFENSE STANDING is PROP-DEPENDENT, or COLLAPSED when 2c > L; if CHALLENGER CONCEDED LINKS is 1 or more, CHALLENGE STANDING is PROP-DEPENDENT, or COLLAPSED when 2c > L.",
 "DEFENSE STANDING is PROP-DEPENDENT or COLLAPSED, as you judge; if CHALLENGER CONCEDED LINKS is 1 or more, CHALLENGE STANDING is PROP-DEPENDENT or COLLAPSED, as you judge.",2,1),
("(PROP-DEPENDENT, or COLLAPSED when twice the count exceeds the number of premises listed against that side)",
 "(PROP-DEPENDENT or COLLAPSED, as you judge the side's case)",14,1),
("PROP-DEPENDENT; COLLAPSED when twice the count exceeds the number of premises listed against that side)",
 "PROP-DEPENDENT or COLLAPSED, as you judge the side's case)",14,1),
("if(L!=null&&2*n>L)return 'COLLAPSED';if(L==null&&orig==='COLLAPSED'&&n>0)return 'COLLAPSED';return (n>=1||brk[sd]>0)?'PROP-DEPENDENT':'SELF-SUPPORTED';",
 "if(n>=1||brk[sd]>0)return (orig==='COLLAPSED'||orig==='PROP-DEPENDENT')?orig:'PROP-DEPENDENT';return 'SELF-SUPPORTED'; /* trim A3: the judge's own standing is kept; a side with a counted or broken link is not SELF-SUPPORTED */",14,1),
("const res=word==='BROKEN'?'CHALLENGER WINS':word==='HELD'?((cst!=='SELF-SUPPORTED'||brk.CHALLENGER>0)?'DEFENDER WINS':'UNDERDETERMINED'):'UNDERDETERMINED';",
 "const res=word==='BROKEN'?'CHALLENGER WINS':(()=>{const r0=P.result?((P.result.u.match(/^RESULT\\s*:\\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null;return (r0&&r0!=='CHALLENGER WINS')?r0:'UNDERDETERMINED';})(); /* trim A2: the judge's own RESULT is kept unless the cure leaves BROKEN or its CHALLENGER WINS no longer has a BROKEN verdict */",14,1),
("const want=(x.L&&2*ns[0]>x.L)?'COLLAPSED':'PROP-DEPENDENT';",
 "const want=(sv.length===1&&(sv[0]==='COLLAPSED'||sv[0]==='PROP-DEPENDENT'))?sv[0]:((x.st==='COLLAPSED'||x.st==='PROP-DEPENDENT')?x.st:'PROP-DEPENDENT'); /* trim A3: PROP-DEPENDENT or COLLAPSED is the judge's choice */",14,2),
("const want=(x.L&&2*n9>x.L)?'COLLAPSED':'PROP-DEPENDENT';",
 "const want=(sv.length===1&&(sv[0]==='COLLAPSED'||sv[0]==='PROP-DEPENDENT'))?sv[0]:((x.st==='COLLAPSED'||x.st==='PROP-DEPENDENT')?x.st:'PROP-DEPENDENT'); /* trim A3 */",14,1),
("gives '+((2*c>L)?'COLLAPSED':'not COLLAPSED')+'. REVIEW THIS ROW.]');",
 "gives '+((2*c>L)?'more than half':'half or fewer')+' (information only; trim A3: the standing is the judge\\'s).]');",2,1),
("if(verdict==='PARTIAL'&&verdict_result!=='UNDERDETERMINED'){rej('PARTIAL WITH RESULT '+verdict_result+'.');}",
 "if(verdict==='PARTIAL'&&verdict_result==='CHALLENGER WINS'){rej('PARTIAL WITH RESULT '+verdict_result+'.');} /* trim A2 */",1,1),
("if(verdict==='HELD'&&verdict_result==='DEFENDER WINS'&&challenge_standing==='SELF-SUPPORTED'&&chBroken===0){rej('HELD WITH RESULT DEFENDER WINS WHILE THE CHALLENGER IS SELF-SUPPORTED AND NO CHALLENGER LINK IS BROKEN.');}",
 "/* trim A2: the RESULT is the judge's; the N2 formula check is retired */",1,1),
("const ORDER0=['deepseek','gemini','glm','chatgpt','mimo','qwen','grok','sol'];",
 "const ORDER0=['deepseek','gemini','glm','chatgpt','qwen','grok','sol']; // 2026-11-03 (operator: \"replace the mimo reserve ... bring back DeepSeek\"): mimo judges no more (its reserve calls spent the whole 65,536-token limit in 32471 and 32482)",1,1),
("const panel_reserve=(pfree.length>3&&JUDGE_TIME_REMOVED.indexOf(pfree[3])<0)?pfree[3]:null; // judge_fix5 G12",
 "const panel_reserve=free.indexOf('deepseek')>=0?'deepseek':((pfree.length>3&&JUDGE_TIME_REMOVED.indexOf(pfree[3])<0)?pfree[3]:null); // 2026-11-03: DeepSeek is the reserve when it does not debate (operator: \"bring back DeepSeek\"); judge_fix5 G12 otherwise",1,1),
]
out={}
for a,b,nn,cc in E:
    hit=0
    for nd in BASE['nodes']:
        c=out.get(nd['name']) or (nd.get('parameters') or {}).get('jsCode')
        if not c or a not in c: continue
        assert c.count(a)==cc,(nd['name'],a[:50],c.count(a));out[nd['name']]=c.replace(a,b);hit+=1
    assert hit==nn,(a[:60],hit,nn)
for nd in BASE['nodes']:
    if nd['name'] in out:
        open(os.path.join(ROOT,'base',nd['name']+'.js'),'w').write(nd['parameters']['jsCode']);open(os.path.join(ROOT,'new',nd['name']+'.js'),'w').write(out[nd['name']])
print('nodes patched',len(out))
