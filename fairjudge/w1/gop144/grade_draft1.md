# W1 grade: operational doc pairs draft 1 (manual1123/w3/opdoc144/opdoc144_pairs_draft1.json 9a4f3047, W3 commit 77939c72; Wall 11263)

GRADE: PASS on all four pairs.
RULES READ: op doc v143 s0 (BODY LAW); ASK 583 plan 2c 3.4 d and step 6.7; scope rule; ruling 506; Central time only.
OBJECTIVE MET: yes. After the pairs, the op doc no longer sends a reader to the engine_manual table or engine_manual_apply for the live manual, and the card time is in Central time.

Checks (run by W1 at 21:4x CST 2026-11-23):
1. File md5 9a4f3047 at commit 77939c72.
2. Preview on operational_doc v143 (8cc3f26d, 75,306, the latest): counts [1,1,1,1]; result 4df6e97ce399f63d9f8883bf8d8e724b, 75,697. This equals the claim.
3. Pair 1 (section 4): the pointer "section 7" is right; pair 2's text sits under "## 7. n8n".
4. Pair 2 (section 7): it names the read functions that exist live (engine_manual_toc, engine_manual_part, engine_manual_full). Row 249 is the pointer.
5. Pair 3 (section 12): this is the same Central form as the section 0 pair (Wall 11264). Audit rows 40987 and 40988 already use it. No code parses truth.card.
6. Pair 4 (section 29): engine_manual_apply refuses live (cf92de39), and engine_manual_part_apply is the write path.
7. After the pairs, a search of the whole result for engine_manual_apply, "press time>Z" and max(version) finds no hit outside the new text.
8. The new text adds no history. Each pair changes only its sentence.
