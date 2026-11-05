#!/usr/bin/env python3
"""Grok reasoning hand-back (operator: "set it up as the vendor suggested", option A). xAI: send the encrypted reasoning back with every turn,
and only append to the conversation. OpenRouter already calls xAI's Responses API for x-ai/ models and returns the reasoning as
message.reasoning_details (format xai-responses-v1, an rs_ id); its documentation says to pass reasoning_details back on the assistant message.
1. The 27 OpenRouter call bodies: for an x-ai/ model, each assistant message whose content equals, exactly, the content of an earlier x-ai/
   reply in this run gets that reply's reasoning_details, unchanged. No match: the message is sent as today.
2. Send Back Build: for an x-ai/ seat, the assistant message is the judge's reply exactly as Grok wrote it (today it is the reply with JSON
   escapes undone and [AUDIT] lines removed, an edit that xAI says breaks the conversation). Chosen only when that reply, read the way
   Send Back Build reads it today, equals what it would send; otherwise unchanged.
Base: fetchback.json (live 77926cf1)."""
import json, os
R = os.path.dirname(os.path.abspath(__file__))
L = json.load(open(f'{R}/fetchback.json')); assert L['versionId'].startswith('77926cf1')
ORN = [n['name'] for n in L['nodes'] if 'openrouter.ai' in n['parameters'].get('url', '')]
assert len(ORN) == 27, len(ORN)
NEW = {}
for n in L['nodes']:
    nm = n['name']
    if nm not in ORN: continue
    b = n['parameters']['jsonBody']; assert b.count('return o;})(') == 1, nm
    names = json.dumps([x for x in ORN if x != nm])
    inj = ("if(/^x-ai\\//.test(md)&&Array.isArray(o.messages)){const XR=new Map();for(const xn of " + names + "){let xa=[];try{if(!$(xn).isExecuted)continue;xa=$(xn).all();}catch(xe){continue;}"
           "for(const xi of xa){const xj=(xi&&xi.json)||{};if(!/^x-ai\\//.test(String(xj.model||'')))continue;for(const xc of (xj.choices||[])){const xm=xc&&xc.message;"
           "if(xm&&typeof xm.content==='string'&&Array.isArray(xm.reasoning_details)&&xm.reasoning_details.length)XR.set(xm.content,xm.reasoning_details);}}}"
           "if(XR.size)o=Object.assign({},o,{messages:o.messages.map(m=>(m&&m.role==='assistant'&&typeof m.content==='string'&&!m.reasoning_details&&XR.has(m.content))?Object.assign({},m,{reasoning_details:XR.get(m.content)}):m)});}")
    NEW[nm] = ('jsonBody', b, b.replace('return o;})(', inj + 'return o;})('))
SB = 'Send Back Build'
c = next(n for n in L['nodes'] if n['name'] == SB)['parameters']['jsCode']
A = "const body={...j.body,messages:[...j.body.messages,{role:'assistant',content:said[seat]},{role:'user',content:msg}]};"
assert c.count(A) == 1
B = ("// xAI (operator, option A): for an x-ai/ seat, the judge's reply exactly as Grok wrote it, so the conversation is only appended to and the\n"
     "// wrapper can hand its reasoning back; chosen only when it reads, as said[] is read, to the same text. Otherwise said[seat] as before.\n"
     "let asst=said[seat];if(/^x-ai\\//.test(String(j.api_model||j.body.model||''))){const XN=['Panel Judge 1 openrouter','Panel Judge 2 openrouter','Panel Judge 3 openrouter','Panel Reserve openrouter','Panel Cure Call 1 openrouter','Panel Cure Call 2 openrouter','Panel Cure Call 3 openrouter'];"
     "const rd=t=>textOf(t).split('\\n').filter(l=>!/^\\s*\\[AUDIT\\b/.test(l)).join('\\n').trim();"
     "for(const xn of XN){let xa=[];try{if(!$(xn).isExecuted)continue;xa=$(xn).all();}catch(xe){continue;}for(const xi of xa){const xj=(xi&&xi.json)||{};const xc=xj.choices&&xj.choices[0]&&xj.choices[0].message&&xj.choices[0].message.content;"
     "if(/^x-ai\\//.test(String(xj.model||''))&&typeof xc==='string'&&rd(xc)===said[seat])asst=xc;}}}\n"
     "const body={...j.body,messages:[...j.body.messages,{role:'assistant',content:asst},{role:'user',content:msg}]};")
NEW[SB] = ('jsCode', c, c.replace(A, B))
os.makedirs(f'{R}/reason', exist_ok=True)
json.dump({'base_versionId': L['versionId'], 'nodes': {k: [v[0], v[1], v[2]] for k, v in NEW.items()}}, open(f'{R}/reason/manifest.json', 'w'))
print('built', len(NEW), 'nodes')
