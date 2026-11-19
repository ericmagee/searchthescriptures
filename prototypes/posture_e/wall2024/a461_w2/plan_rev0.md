# ASK 461 plan and build rev 0 (W2): remove the unreachable direct call nodes from WALL-2024 Panel Judge Call (coordinator 07:37Z; W1 9287 note 6)
Base: the ASK 460 rev 2 target (a460_w4/target.json, md5 73633e6413bbdf89da28fc288694139b, from live 5297cdd3). If 460 is written first, the write base is its fetchback, which must equal that target.
1. OBJECTIVE. Panel Judge Call holds no direct provider call step except openrouter. An item routed to openai, gemini, grok or mimo
   gets the same FAIL-CLOSED error reply that ASK 460 gives deepseek, instead of calling that provider.
2. ROLES. Plan and build W2. Graders W1 and W3. Card, REST write and fetchback W4. Readback W2 or W1.
3. SCOPE with SEARCH.
   SEARCH: W4's call-graph search (a460_w4/graph_out.txt, 6 reached workflows) found the direct openai, gemini, grok and mimo call nodes only in
   Panel Judge Call; the engine, child and cure workflow had them removed by pkgRPN. Stored panel replies: ppj_replies holds 33 rows (11-16 to 11-18), all
   provider openrouter, so no stored run reached these nodes.
   REMOVE: Call openai (api.openai.com), Call gemini (generativelanguage.googleapis.com), Call grok (api.x.ai), Call mimo (api.xiaomimimo.com), and their
   4 connections to Wrap.
   REWIRE: Provider Route outputs 1 to 4 go to Provider Removed Reply (ASK 460), as output 0 does.
   OUT: the Provider Route expression and its 6 outputs (index-aligned with Panel Judges Prep P1/P23 in the engine); the text of Provider Removed Reply
   (its message names the provider it was given, so it fits all five); the n8n credentials themselves; the engine.
4. CRITERIA and DONE.
   C1: the only HTTP hosts left are openrouter.ai and supabase.co; no removed credential name is referenced.
   C2: every kept node and every top-level field equals the base; connections differ only as in REWIRE.
   C3: Provider Removed Reply and the live Wrap, run on a mock body for each of the four providers, give the {error} payload for the slot (reply_out.txt).
   C4: reasoning guard clean.
   DONE: two grades, card, write, readback with 0 differences and published true (activeVersionId = versionId).
5. WRONG-IF. Any kept node or other output changes; a stored or live seat resolves to one of the four providers (then that panel slot now fails closed
   instead of calling it; no seat does today, by the 33 stored replies and pkgRPN).
6. RUN EVIDENCE. NO PROBE: no live seat reaches outputs 1 to 4. Mark: no ppj_replies row with a provider other than openrouter, and no FAIL-CLOSED
   (ASK 460) error in a run.
7. INPUTS IN GIT. a461_w2/: this plan, build461.py, target.json (md5 7fead6b3437526416f69ba4142940206), reply_out.txt, guard_out.txt.
8. STEPS. a. Grades. b. W4's card. c. W4 writes through REST on the 460 fetchback and reads back. d. Readback. e. Manual entry (W3).
