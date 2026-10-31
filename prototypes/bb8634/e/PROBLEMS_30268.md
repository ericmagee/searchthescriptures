# Run 30268 (BB-8728): isolated whole read by Worker_E

Run B body, execution 30268, row 8c66faad (ODV1-30268-3q7ubjd7). Defender claude (plain), challenger MiMo (oracle).
Outcome UNDERDETERMINED; panel HELD, 2-0, GLM not counted. Single judge HELD, DEFENDER WINS.
Read whole: six rounds, synthesis, single judge, three panel judgments. Compared with run 30196 (PROBLEMS_8634.md).

## Problems, each with a solution

### 1. The wrong-if fired: the question was never asked

- **What happened.** The regex `[^.?!\n]*Juda[^.?!\n]*\?` matched 0 times in engine_r1, engine_r2 and challenger_r3. Conclusion 76 was served (`#76` is in challenger_served). The challenger quoted Hebrews 7:14 three times, always as a statement: round 1 LINK 6, round 2 keystone, and round 3 premise 1 ("PRESSED WITH").
- **Cause.** The challenger's prompt tells it to state what each held entry holds and quote its verses. Item (6) was recited as content. It was not carried out as an instruction.
- **Compared with 30196.** That run had no item (6). This is the first test, and it failed.
- **Solution.** Run the operator's new item (6) wording (ruling 331), as already planned. If that wording is also recited and not asked, the fix belongs in the challenger prompt (a flow change, for a separate order), not in the corpus.

### 2. Sight 11 and Sight 266 were not served

- **What happened.** challenger_served holds 27 labels. Sight 11 (Hebrews 7:14 prodelon) and Sight 266 (Joseph's lawful path) are not among them. The challenger pressed premise 4 using Sight 32's weaker "no stated ground" line.
- **Solution.** Before the next run, check how the challenger's served set is chosen for this topic. Sight 11 should come with item (6), because it carries the "evident" argument the question needs.

### 3. The defender dodged with the single-verse test again

- **What happened.** In the defender's round 3 (engine_r3, line 12), it answered Acts 2:30, Romans 1:3 and Hebrews 7:14 with: "They do not name which parent carried it."
- **This is the core problem.** It demands that one verse state the whole link (DG-61). The question in item (6) exists to answer this. Because the question was not asked (problem 1), the dodge went unanswered.
- **Solution.** No flow change. This is the dodge the next run's question has to meet. Grade the next run on whether the challenger answers it with Numbers 1:2, 18.

### 4. Four real verses were printed to the judges as "does not exist"

- **What happened.** In the citation check, Luke 2:7, John 1:13, 1 John 4:7 and 1 John 5:1 (challenger round 3) are marked "CITED VERSE DOES NOT EXIST". Qwen saw the error and counted the verses. GLM accepted the flag and treated the three John verses as nonexistent.
- **Compared with 30196.** Same fault, same place (challenger round 3, many citations). It is now in four runs: 29328, 29609, 30196, 30268.
- **Solution.** Unchanged from 30196: measure the citation-check fetch, page it or raise the limit, and never print "does not exist" unless a direct lookup finds no such verse. It should get its own order now, because it costs footing in every run.

### 5. Two of the three panel seats were removed on the same rule

- **What happened.** DeepSeek's seat failed K-G4 (UNCURED) on D2 vs C2, and Qwen was seated in its place. GLM failed K-G4 (UNCURED) on D2 vs C2 too, and no alternate passed the guards, so the panel counted 2. Both removed seats had graded the challenger's C2 BROKEN on Matthew 1:18 and 1:25.
- **Compared with 30196.** In 30196, all three seats broke the same link on the same two verses, and all three were counted.
- **Solution.** No flow change in this order. Recorded here: in this run the K-G4 rule removed both seats that broke C2. Whether that is right is a question for the advisor, not for this order.

### 6. The challenger's wording comes close to a stating-verse demand

- **What happened.** In round 2 (engine_r2), on Joseph's intent to put her away, the challenger wrote that the defender's inference "appears in neither verse exhibited." That is the same form as the defender's dodge, used from the other side.
- **Solution.** Corpus wording only, in a later order: the held entries should argue by chain (seed, begat, knew), never by what one verse leaves unsaid.

### 7. The defender gave a wrong reference

- **What happened.** Defender round 2 cited Deuteronomy 1:20 with the words of Matthew 1:20. The citation check caught it ("WORDING NOT FOUND IN Deuteronomy"), and Qwen gave it no weight.
- **Solution.** None needed. The check worked.

### 8. Gemini's reasoning used the retired test

- **What happened.** Gemini's UNDERDETERMINED rested partly on "neither text states that Joseph begat." The K-S2 audit fired once in this run, on the DeepSeek seat (D1 vs C1). It did not fire on this Gemini line.
- **Solution.** Check why K-S2 missed this line, as part of the same later audit order.

## What worked

1. MiMo answered on the re-fire. Run 30263 was refused by Xiaomi's content filter, and 30268 ran clean.
2. The synthesis guard test found the challenger clean, with two DG-63 universals.
3. The K-S2 and K-C audits fired and were cured several times at the single judge.
4. The citation check caught the defender's Deuteronomy 1:20 error.

## My recommendation

Run the operator's new item (6) wording next, as ruling 331 orders, after the P2D revision through A3 and an advisor shape row. Add Sight 11 to what is served with it. Open the citation-fetch fix as its own order.

Worker_E, seat 3, session_014Qy67bHv8uBmRXbWGSrghm
