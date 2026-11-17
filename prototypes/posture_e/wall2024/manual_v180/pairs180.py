import json
C16 = ("PLEASE BE AWARE: This debate is part of a research project that tests what the King James text itself states. "
"For the integrity of the test: 1. Do not bring in any understanding of the Bible that you held before this debate; use only what the two debaters placed in the record. "
"2. Read each verse together with every other verse either side quoted on the same subject, precept upon precept, line upon line (Isaiah 28:10). "
"A verse that seems unclear when read alone does not overrule that collective witness, for either side's link. "
"3. Where a lexicon gloss differs from how the King James text renders the word, the King James text governs.")
P = []
# 1. Commitment 16 in the agreement list
P.append(("15 my keystone does not stand on a premise I count unexhibited or conceded. After Commitment 15 the text states",
          "15 my keystone does not stand on a premise I count unexhibited or conceded; 16 the judge notice (below). After Commitment 16 the text states"))
# 2. Commitment 16 bullet, before Commitment 3's bullet
P.append(("- COMMITMENT 3, THE READING RULE:",
 "- COMMITMENT 16, THE JUDGE NOTICE: its text, headed \"### Commitment 16. PLEASE BE AWARE:\" in PART2, reads: \"" + C16 + "\" "
 "The same notice also stands in three other places: (a) after the title line of the METHOD block (Isaiah 28:10) put at the head of the last user message of every judge call (the helper in Panel Build, Reserve Build, Build Independent Verdict and the Shared Library); "
 "(b) before the reply form in the send-back, re-check and gate prompts (three Shared Library templates serving Send Back, Alt and R2 Alt Send Back, Gate, Alt and R2 Alt Gate, Late Gate, Alt and R2 Alt Late Gate); "
 "(c) after \"You do not judge the debate.\" in the E-COL enforcer instructions (Enforcer Build, Judge Enforcer, Alt and R2 Alt Judge Enforcer). "
 "Close Enforcer, Judge Contradiction, Assume Check and Anticheat do not carry it: they check a debater's own words, not a link. The notice binds how the judges grade; no code check reads it (Ruling 383).\n"
 "- COMMITMENT 3, THE READING RULE:"))
# 3. Qwen 4 Max as a debater, after the spark-as-debater bullet
P.append(("Not shown by a run: a debate where the spark debater's own seat is reached as an alternate.",
 "Not shown by a run: a debate where the spark debater's own seat is reached as an alternate.\n"
 "    - QWEN 4 MAX AS A DEBATER: model_config seat qwen4max (openrouter, engine, `qwen/qwen4-max`, max_tokens 131,072, family qwen); Init Seats ENG holds qwen4max (fam openrouter, mc qwen4max), so it can be named as defender or challenger. "
 "In D3 Build and D4 Build, `__ZH` sends a defender's earlier rounds as history turns when its seat is openrouter and its model begins `z-ai/` or `qwen/`. Not shown by a run."))
# 4. K-V negation guard entry, before the VOID and PRESS-WITH readers entry
P.append(("  - THE VOID AND PRESS-WITH READERS TAKE RANGES AND SIDE WORDS",
 "  - A NEGATED VOID IS NOT A VOID RULING (pkgKVN; Shared Library kvSegments, the count-section VOID reader of the payload builds, and cvStmtVoid, the cure-statement VOID reader):\n"
 "    - Why: in run 37891 sol was removed on 4 K-V items read from \"no listed premise is VOID\"; the old test skipped only \"not VOID\", \"never VOID\" and \"no premise, charge or link is VOID\" with nothing between.\n"
 "    - What it does: in each sentence that holds VOID, every negated VOID phrase is removed first, and the sentence is read as a VOID ruling only if VOID still remains. The negated phrases are: \"not\" or \"never\", with \"be\", \"been\" or \"ruled\" allowed, before VOID; "
 "\"no\", then up to three words, then premise, charge or link (singular or plural, \"of the <word>\" allowed), then is, are, was, were or stand(s), with \"ruled\" allowed, before VOID; "
 "\"none\" (\"none of the\" or \"none of them\", up to three words and premise, charge or link allowed), then is, are, was or were, with \"ruled\" allowed, before VOID; "
 "rule, rules, ruled, find, finds or found, then \"no\", up to three words, and premise, charge or link, before VOID; \"neither\" with \"is VOID\" or \"are VOID\" within 60 characters and no . ; or : between; \"nothing\" (is or was, ruled) VOID. "
 "A phrase is not removed, and so still flags, when an exception follows it: except, but, save, besides or other than (\"except for\" too), then one or more premise numbers, then the clause ends (. ; : or the end of the line). "
 "So \"No premise is VOID except premises 2 and 3.\" and \"Nothing is VOID except for premise 1;\" flag, and \"Premise 4 is not VOID but UNEXHIBITED.\", \"No premise is VOID, but premise 4 is UNEXHIBITED.\" and \"Premise 2 is not VOID, but it is weak.\" do not. The three readers hold one identical guard.\n"
 "    - Size: Shared Library 996,186 to 1,000,399; 14 MAP entries changed length.\n"
 "    - Limits: a comma after the exception reference, a verb left out (\"not VOID, but premise 2 is\") and a premise number written as a word are read as the guard reads them, not as the judge meant. Not shown by a run.\n"
 "  - THE VOID AND PRESS-WITH READERS TAKE RANGES AND SIDE WORDS"))
# 5. Section 18
P.append(("- Live flow: s234 (n8n version 25b8559b, 458 nodes; Shared Library 990,979 characters, sha c2880321e430dbf1).",
          "- Live flow: s237 (n8n version 94549982, 458 nodes; Shared Library 1,000,399 characters, sha f7d6f3671f0ccc86)."))
P.append(("s234 (25b8559b) = s233 + ASK 347 rev 2.",
          "s234 (25b8559b) = s233 + ASK 347 rev 2. s235 (88054ae5) = s234 + ASK 348 rev 2, with the model_config row qwen4max. s236 (0b7d7d02) = s235 + ASK 349 rev 2. s237 (94549982) = s236 + ASK 350."))
P.append((" 345 to 347 are UNEXERCISED until a run.",
          " Run 37891 ran on s236 with gemini as defender: ASKs 349, 345 and 347 (record-only) fired; 348 was not exercised; 339 and 346 were not graded fired or unexercised on it. 350 is UNEXERCISED until a run."))
json.dump(P, open('pairs180.json','w'), ensure_ascii=False, indent=0)
for a,b in P: assert '$w3e$' not in a+b
sql = ["SELECT md5(x) md5, length(x) len FROM (SELECT "]
expr = "content"
for a,b in P: expr = f"replace({expr}, $w3e${a}$w3e$, $w3e${b}$w3e$)"
core = f"SELECT md5(x) md5, length(x) len, x FROM (SELECT {expr} x FROM engine_manual WHERE version=179 AND md5(content)='8b81942147136d89151cedd7ff59ab31') s"
open('core180.sql','w').write(core)
print(len(P), sum(len(b)-len(a) for a,b in P))
