#!/usr/bin/env python3
"""GLM (Z.ai) context caching as the vendor's best practices set it out: a stable system prompt and the conversation history kept and sent
in full, each new turn appended (Z.ai "Conversation History Management": history = system + every user and assistant message; each call
sends the history). Rounds 3 and 4 of a z-ai/ debater now continue that seat's own conversation: the previous round's messages (its
system message aside), the seat's previous reply (Extract raw), then this round's message, unchanged. Other models: no change.
Base: reason/fetchback.json (live 095b39b5)."""
import json, os
R = os.path.dirname(os.path.abspath(__file__))
L = json.load(open(f'{R}/reason/fetchback.json')); assert L['versionId'].startswith('095b39b5')
N = {n['name']: n for n in L['nodes']}
ZH = ("// Z.ai context caching (operator, 2026-11-04: set up according to the vendor): a z-ai/ debater's round continues its own conversation,\n"
      "// the previous round's messages and its reply, then this round's message unchanged. Any other model, or a missing piece: as before.\n"
      "const __ZH=(side,prev,seat,ms)=>{if(!(seat&&seat.fam==='openrouter'&&/^z-ai\\//.test(String(seat.model||''))))return ms;try{const pb=$(side+prev+' Build').first().json.call.body;"
      "const raw=$(side+prev+' Extract').first().json.raw;if(!pb||!Array.isArray(pb.messages)||typeof raw!=='string'||!raw)return ms;"
      "return pb.messages.filter(m=>m&&m.role!=='system').concat([{role:'assistant',content:raw}],ms);}catch(e){return ms;}};\n")
OUT = {}
for nm, side, prev, who in [('D3 Build', 'D', '2', 'R.defender'), ('C3 Build', 'C', '2', 'R.challenger'),
                            ('D4 Build', 'D', '3', 'R.defender'), ('C4 Build', 'C', '3', 'R.challenger')]:
    c = N[nm]['parameters']['jsCode']
    a = 'call:call(' + who + ',sys,msgs)}}];'
    assert c.count(a) == 1, nm
    i = c.rfind('return [{json:{run_token:TOK')
    assert i > 0 and c.count('return [{json:{run_token:TOK') == 1, nm
    new = c[:i] + ZH + c[i:].replace(a, 'call:call(' + who + ",sys,__ZH('" + side + "','" + prev + "'," + who + ',msgs))}}];')
    OUT[nm] = ['jsCode', c, new]
os.makedirs(f'{R}/glm', exist_ok=True)
json.dump({'base_versionId': L['versionId'], 'nodes': OUT}, open(f'{R}/glm/manifest.json', 'w'))
print('built', sorted(OUT))
