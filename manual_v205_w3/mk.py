import json
P=[]
def a(o,n):P.append({"old":o,"new":n})
a('; its comment "every seat runs through openrouter or deepseek" now reads "every seat runs through openrouter".',
  '; its comment "every seat runs through openrouter or deepseek" was changed to "every seat runs through openrouter", and ASK 464 then removed it.')
E='''  - NO CODE NODE COMMENTS IN THE SUB-WORKFLOWS (ASK 464; ODV1 Cure Call, WALL-2024 Panel Judge Call, WALL-2024 Early Alternate):
    - Why: no Code node carries a comment (§15); a search of every workflow the engine and the child reach found 6 comment lines in 4 Code nodes of three sub-workflows.
    - What it does: removes whole comment lines and nothing else: Skip Return (1) and Provider Removed Stop (1) in ODV1 Cure Call; Wrap (3) in Panel Judge Call; Early Alternate Shape (1) in Early Alternate. The Shared Library header in the engine and the child keeps its comment lines, because it carries the library sha that the stubs and the Library Check read, and the node never runs.
    - Reach: none on behavior; the token stream of each changed node equals the base, and no node reads these nodes as text.
    - Shown offline: each changed node has 0 comments and equal tokens; no other node key or connection changed; the reasoning guard passes.
    - Live: ODV1 Cure Call fb18e79a (from e2fa573a), Panel Judge Call 15a91429 (from 474d8def), Early Alternate f47f5955 (from 30a47a4a), on the operator's card "Write it" pressed 13:24:13Z on 11-19.
    - Limits: not shown by a run; its mark is a run in which these sub-workflows execute with no error naming Skip Return, Wrap or Early Alternate Shape.
'''
A='  - THE ENFORCER MODEL SEES JUDGES AS "Judge 1"'
a(A,E+A)
json.dump(P,open('pairs.json','w'),ensure_ascii=False)
pj=json.dumps(P,ensure_ascii=False); assert '$p$' not in pj and '—' not in pj
open('preview_q.sql','w').write("select left(r::text,400) x from (select engine_manual_apply(204,'7e20b77cae07ef04c1bb99e7048c01ac',$p$"+pj+"$p$::jsonb,null,null,null,null,null,false) r) s;")
