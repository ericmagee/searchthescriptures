# W2 grade: pkgCSW (list 3627 item 4, W3, Wall 3665): PASS

1. Rebuild: build_CSW.py on fetchback_live_s79.json gives parent_s79_CSW.json (3b51d853) and child_ODV1_Cure_Call.json (91966d23) byte-equal to the posted files. 398 to 390 nodes; removed exactly Cure Route, Panel Cure Route 1-3, Cure Call deepseek, Panel Cure Call 1-3 deepseek.
2. Probe rerun (pkgCSW_probe_rerun.txt): 128 saved items, 0 differ; 5 near-miss cases OK.
3. Independent check, every parent node that names a kept call node (41 nodes): all but four are x-ai reasoning relay (XR) lists inside try/catch, guarded by an x-ai model test. The four others:
   - Panel Tokens and Build Save Body (__CU): add tokens only when the item has usage or usageMetadata. On a skip, the Execute Workflow node now outputs the Build item (live: node not executed); it has neither field, so nothing is added. The removed deepseek map entries make `__L[n]` undefined inside the existing try, so those names are skipped as before. A deepseek cure reply now sits under the openrouter name and is counted once.
   - Send Back Build, Alt and R2 Alt Send Back Build: the cure-call names appear only in the __L map and the XR list (x-ai only).
4. No node names a removed node anywhere in its parameters (string search, not only $() reads).
5. The child openrouter body keeps live's transforms (z-ai provider pin; cache_control for google/qwen/openai/anthropic); the XR block runs only for x-ai models, so the parent-node reads it cannot do in the child are never reached for the seated panel.

Notes (no fault):
1. Stack order: pkgXK writes the library first. pkgCSW touches no library node, so W4 must rerun build_CSW.py on the post-XK fetch-back (it reads live and fails closed on shape), not write the posted parent file.
2. The Execute Workflow nodes have no onError. HTTP errors still continue (onError kept on the child HTTP nodes), but a sub-execution that cannot start now stops the parent run, where live had no such step. Fail-closed; record only.
3. Child settings copy errorWorkflow, so a child failure also triggers the error workflow (a second alert besides the parent's).
