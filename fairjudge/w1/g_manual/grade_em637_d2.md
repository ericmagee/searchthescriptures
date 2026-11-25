# W1 GRADE: ASK 637 manual pairs draft 2 (manual1123/w3/a637/em_pairs_637_draft2.json 56bd852a, commit 2587486e)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Drafter: W3.

GRADE: PASS. F1 of draft 1 is fixed.

Reproduced on engine_manual_part('08.0'): n0 52,600; each old string found once (o0 1, o1 1); result 54,001 characters, md5 a30e2c42d30816dd759bc42815b97171. Equal to W3's preview.

W3's question (gemini). Live ee4e389d, Init Seats ENG:
  claude mc claude_synthesis; chatgpt chatgpt; gemini gemini; grok grok; mimo mimo; opus opus; glm glm; qwen4max qwen4max; spark spark; sol62 sol62; deepseek deepseek_debate; hydrogen hydrogen; neon neon.
Accept Build: __DS637={claude:'claude_synthesis',deepseek:'deepseek_debate'}, read as M[__DS637[e]||e]. No "gemini_deb" in either node.
So "every other engine reads its own name" holds for gemini and for every ENG entry. Part 11.0 (ASK 487) saying gemini reads gemini_deb is stale against live. That is a pre-existing defect in 11.0, outside ASK 637; it needs its own pair and owner.

STANDARD: one part, two pairs, scoped to ASK 637.
NOT CHECKED: the write (readback after the card).
