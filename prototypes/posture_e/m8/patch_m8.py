#!/usr/bin/env python3
"""Commitment 8 (the method, Isaiah 28:10) in the posture and agreement; the same text at the top of each final judging request; trial QR Commitment 8 -> 9; ChatGPT ask as its own turn. Base: live 5256f33a."""
import json,os,re
R=os.path.dirname(os.path.abspath(__file__));W=json.load(open(os.path.join(R,'..','qr','fix2','fetchback_qr2.json')));N={n['name']:n for n in W['nodes']}
METHOD=('The method. Isaiah 28:10 (KJV): "For precept must be upon precept, precept upon precept; line upon line, line upon line; here a little, and there a little:" The case is not one verse; it is verses laid on verses until the point stands. That is how these debates are built and how they are judged.\n'
 '- [L1] The KJV verse: the verse itself, quoted exactly.\n'
 '- [L2] Source language: the Hebrew or Greek behind the English.\n'
 '- [L3] Cross-reference: what the rest of scripture says.\n'
 '- [L4] Inference: a conclusion the debater draws from at least two prior layers.\n'
 'How the case is judged. To win, the challenger must break the defender\'s chain, the linked argument the defender builds for the topic. Defeating one isolated verse or term does not break the chain. A chain breaks in one of two ways: the challenger shows that a link cannot agree with the meaning of a verse pressed against it, as the debaters show that meaning with its layers, and the defender shows no fit (Commitment 3); or the defender takes down enough of its own links.')
js=lambda s:json.dumps(s)[1:-1]
A='My count of premises follows from these rulings and does not replace them.";'
C8=js('\n\n### Commitment 8. The method is Isaiah 28:10.\n'+METHOD)
out={}
for nm,n in N.items():
    c=n.get('parameters',{}).get('jsCode','')
    if c.count(A)==1:out[nm]=c.replace(A,'My count of premises follows from these rulings and does not replace them.'+C8+'";')
assert len(out)==12,len(out)
# the final judging request: the method at the top of the last user message of every judge body each builder returns
MT=('const __METHOD_TOP='+json.dumps('THE METHOD (Isaiah 28:10), the framework of this debate and of your judgment:\n'+METHOD+'\n\n')+';\n'
 'const __MT=(items)=>{const seen=new WeakSet();const walk=(o,d)=>{if(!o||typeof o!==\'object\'||d>7||seen.has(o))return;seen.add(o);'
 'if(Array.isArray(o.messages)&&typeof o.model===\'string\'){const m=o.messages;for(let i=m.length-1;i>=0;i--){if(m[i]&&m[i].role===\'user\'){const c=m[i].content;'
 'if(typeof c===\'string\'){if(!c.startsWith(\'THE METHOD (Isaiah 28:10)\'))m[i].content=__METHOD_TOP+c;}else if(Array.isArray(c)){if(!(c[0]&&String(c[0].text||\'\').startsWith(\'THE METHOD (Isaiah 28:10)\')))c.unshift({type:\'text\',text:__METHOD_TOP});}break;}}}'
 'for(const k of Object.keys(o))walk(o[k],d+1);};(items||[]).forEach(it=>walk(it&&it.json,0));return items;};\n')
for nm in ['Panel Build','Reserve Build','Alternate Build','Build Independent Verdict']:
    c=out.get(nm,N[nm]['parameters']['jsCode'])
    out[nm]='// posture Commitment 8 (operator 2026-11-03): THE METHOD stands at the top of the final judging request of every judge body this builder returns.\n'+MT+'const __R=await (async()=>{\n'+c+'\n})();\nreturn __MT(__R);\n'
# trial QR: its Commitment 8 becomes 9; ChatGPT ask as its own turn with a closing system reminder
for nm in ['QR Ask Build','QR Check','QR Final','QR Merge']:
    c=N[nm]['parameters']['jsCode'];assert c.count('Commitment 8. I ask only for explanation.')==1,nm
    c=c.replace('Commitment 8. I ask only for explanation.','Commitment 9. I ask only for explanation.')
    if nm=='QR Ask Build':
        old="const last=m[m.length-1];if(last.role==='user'){if(typeof last.content==='string')last.content+='\\n\\n'+text;else if(Array.isArray(last.content))last.content.push({type:'text',text});else last.content=text;}else m.push({role:'user',content:text});"
        assert c.count(old)==1,'ask anchor'
        c=c.replace(old,"m.push({role:'assistant',content:'I will not judge yet. I will first put one question to each debater.'});m.push({role:'user',content:text});m.push({role:'system',content:'QUESTION ROUND: this reply is only the JSON of two questions. Do not write a judgment, a verdict or any verdict field in this reply; the judgment comes in a later turn.'});")
    out[nm]=c
for nm,c in out.items():
    open(os.path.join(R,'base',nm+'.js'),'w').write(N[nm]['parameters']['jsCode']);open(os.path.join(R,'new',nm+'.js'),'w').write(c)
print(len(out),'nodes')
