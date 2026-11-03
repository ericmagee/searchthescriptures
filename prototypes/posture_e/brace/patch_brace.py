#!/usr/bin/env python3
"""judge_fix10 B: a judge reply cut off before its last closing brace (it opens with "{" and ends with a closed string) gets the brace and is read.
Over the committed live copy gloss/fetchback_gloss.json (1a7c9979). Three readers: verdict() (seat check and payloads), netUnwrap() (library, the rule checks), panelText (Format Markdown)."""
import json, os
ROOT=os.path.dirname(os.path.abspath(__file__))
BASE=json.load(open(os.path.join(ROOT,'..','gloss','fetchback_gloss.json')))
E=[("const a=s.indexOf('{');const b=s.lastIndexOf('}');\n if(a===-1||b===-1||b<=a)throw new Error('FAIL-CLOSED: seat \"'+seat+'\" returned no JSON object.",
    "if(s[0]==='{'&&!/\\}\\s*$/.test(s)&&/\"\\s*$/.test(s))s=s+'}'; /* judge_fix10 B: a reply cut off before its last closing brace (GLM, runs 32455 and 32471) gets the brace */const a=s.indexOf('{');const b=s.lastIndexOf('}');\n if(a===-1||b===-1||b<=a)throw new Error('FAIL-CLOSED: seat \"'+seat+'\" returned no JSON object."),
   ("if(s[0]==='{'){const i=s.lastIndexOf('}');try{const j=JSON.parse(s.slice(0,i+1));",
    "if(s[0]==='{'){const s2=(!/\\}\\s*$/.test(s)&&/\"\\s*$/.test(s))?s+'}':s; /* judge_fix10 B */const i=s2.lastIndexOf('}');try{const j=JSON.parse(s2.slice(0,i+1));"),
   ("const panelText = (raw, j) => { let o = null; const a = ",
    "const panelText = (raw, j) => { let o = null; raw = (s => (s[0] === '{' && !/\\}\\s*$/.test(s) && /\"\\s*$/.test(s)) ? s + '}' : raw)(String(raw || '').trim()); /* judge_fix10 B */ const a = ")]
n=0;cnt=[0,0,0]
for nd in BASE['nodes']:
    c=(nd.get('parameters') or {}).get('jsCode')
    if not c: continue
    c2=c
    for k,(a,b) in enumerate(E):
        x=c2.count(a)
        if x: assert x==1,(nd['name'],k,x); c2=c2.replace(a,b); cnt[k]+=1
    if c2!=c:
        open(os.path.join(ROOT,'base',nd['name']+'.js'),'w').write(c);open(os.path.join(ROOT,'new',nd['name']+'.js'),'w').write(c2);n+=1
print('nodes patched',n,'| verdict',cnt[0],'netUnwrap',cnt[1],'panelText',cnt[2])
