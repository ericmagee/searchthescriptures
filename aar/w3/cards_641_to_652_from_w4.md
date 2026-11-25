# Facts for the AAR rows of ASK 641, 638 A, 645, 646, 634, 651 and 652 (from W4)
All times are Central. Every md5 is given in full. The engine is moMxiV4Irg1uRBZN; the child aad0ad9c-ecc7-49a1-9079-57a065d9ec74 was unchanged by every write below.
Standing set on every written target: 31 PASS, 0 FAIL. Pair Library Check: PASSES on every one.
Run-evidence mark for all: NO LIVE RUN YET on these versions. The last run is 42528, which ran before all of them. A first-run check is owed for each.
"Message above the card": this is my last thread message before the card. Where several cards follow one message, that message introduced them. It may not repeat the card's exact text.

## ASK 641 (a stopped run still stores its call costs)
1. Card cmsg_017ZQamDMHrS6fqMHnQDVo58A2dTgHnyvXTJT6Vh5XmnQJ, posted 06:40 CST 11-25.
   - Question: "Write ASK 641 (a stopped run still stores its call costs)?"
   - Option "Write it": "W4 writes the engine: the cost collector moves into the library, and the failure path stores call costs. W1 reads it back."
   - Option "Hold": "Nothing is written; a run that stops before the panel keeps storing no cost (42505 shows NULL)."
   - Press: "Write it", 08:19 CST 11-25.
   - Message above: cmsg_017ZQamDMHrS6fqMHnQDVo589xSiQUcNzHoNx7rS7yWXaT.
2. Plan: ask641/w4/plan641.md, md5 24d6f455fdc9ab891e4511ec2ff746a2. W1 grade: Wall 12033.
3. Written target: ask641/w4/b1/tg/target_engine_641.json, md5 dbeff2f638a0956cda806ffe8f829acb. W1 build grade: Wall 12046.
4. Files and records:
   - Fetch-back: ask641/w4/write/fetchback_eng_641.json, md5 6be53e67fec5cb93fc95fa26d231fd1a.
   - Revert: ask641/w4/write/revert_eng_641.json, md5 1e3f392f349f5199b54d67225fac3954.
   - Write script: write641.sh, md5 778bc14a67115881327d98ad74086c86.
   - Audit row: 42216.
   - Commit: 3ab3cce8cc9df6d8242dac9473558c7e926e09d2.
   - W1 readback: Wall 12068, PASS.
5. Engine: ee4e389d becomes 393bca2e-18fb-4069-a373-7750010c9467.
6. Tests: t641 ALL PASS (ask641/w4/write/atw/t641.txt, md5 35e27ea78bdf784ee74b27d9faf541e0).

## ASK 638 A (a cure's removed premise leaves the counted list too)
1. Card cmsg_017ZQamDMHrS6fqMHnQDVo58585hQ6W9wEeFfsVzkqb2uVoN, posted 07:01 CST 11-25.
   - Question: "Write ASK 638 A (a cure's removed premise leaves the counted list too)?"
   - Option "Write it": "Shared Library changes. Judges can now see a corrected STORED COUNTED PREMISES line and may get a D38 BASIS gate item."
   - Option "Hold": "Nothing is written; the stored list keeps a premise the cure took out of the count, as in 42528 ([3,4] for a count of 1)."
   - Press: "Write it", 08:23 CST 11-25 (time from audit row 42231).
   - Message above: cmsg_017ZQamDMHrS6fqMHnQDVo58AWdUc4gbGEcBse2HWfAYZS.
2. Plan: ask638/w4/plan638a.md, md5 7ff14cb7269fc13b80a4732951697cd4. W1 grade: Wall 12062.
3. Targets:
   - Written target: b2, ask638/w4/b2/tg/target_engine_638.json, md5 1674abcbbfe3180ddedce029cf0022a7. W1 recheck PASS: Wall 12070.
   - Earlier target: b1, a6073640a879363faff4ec54ae30e043. I found no W1 post that names this md5.
4. Files and records:
   - Fetch-back: ask638/w4/write/fetchback_eng_638.json, md5 41a9c47a819d27bc1568014ed4c2aad1.
   - Revert: revert_eng_638.json, md5 2ef74ddb17f27df7b6341b19c7c01a97.
   - Write script: write638.sh, md5 a49f516d3013c5688b6c217457c41740.
   - Audit row: 42231.
   - Commit: a7c92c1482c4a099867e312395342693ea92fcad.
   - W1 readback: Wall 12076, PASS.
5. Engine: 393bca2e becomes ebf1dbcf-184a-4b96-b35c-62ffb937b910.
6. Tests: t638 ALL PASS (md5 3a9ad8ccfdb1d9ee149405c3b35ac138).

## ASK 645 (a follow-up that repeats the whole question is dropped)
1. Card cmsg_017ZQamDMHrS6fqMHnQDVo58AtvDdVQtii3Ep8H2boYCMm, posted 07:01 CST 11-25.
   - Question: "Write ASK 645 (a follow-up that repeats the whole question is dropped)?"
   - Option "Write it": "A follow-up whose open words are the whole question is dropped, with no paid answer call. Three Question Round nodes change."
   - Option "Hold": "Nothing is written; a judge can re-ask a whole question as a paid follow-up, as sol62 did in 42528."
   - Press: "Write it", 08:24 CST 11-25.
   - Message above: cmsg_017ZQamDMHrS6fqMHnQDVo58AWdUc4gbGEcBse2HWfAYZS.
2. Plan: ask645/w4/plan645.md, md5 be88af8075cb59fd91a17ba2a70564a1. W1 grade: Wall 12056.
3. Targets:
   - Written target: b3, ask645/w4/b3/tg/target_engine_645.json, md5 3edd747fc160b53a6a2f85823337f123. This is the rebase on 393bca2e/ebf1dbcf. The W1 recheck PASS of the rebase is on Wall 12072, which names b2.
   - b2: dbed99b43ed65461a47f84afdf1af8b4, graded on Wall 12072.
   - b1: a47183fdcd2e46d71497da621a11c2f7. I found no W1 post that names this md5.
   - W1 readback 12076 rebuilt 638 A and then 645 on 393bca2e and found it equal to live.
4. Files and records:
   - Fetch-back: md5 cada8505b45e5117d9d2b1b2087c6e1c.
   - Revert: revert_eng_645.json, md5 408d1f17c0261aa41a3d48c9ffa3c14e.
   - Write script: write645.sh, md5 2e5312b1ef666439e2df2e991854c2d9.
   - Audit row: 42232.
   - Commit: a7c92c1482c4a099867e312395342693ea92fcad.
   - W1 readback: Wall 12076, PASS.
5. Engine: ebf1dbcf becomes 8470161f-f72a-4719-835d-1ae4e245ed56.
6. Tests: t645 ALL PASS (md5 d3a732879cb24b67ec0af2b3068c46b0).

## ASK 646 (the row names who was left out of the judge order and why)
1. Card cmsg_017ZQamDMHrS6fqMHnQDVo58Jbsg9gUqijyeXPR8zJryhd, posted 07:01 CST 11-25.
   - Question: "Write ASK 646 (the row names who was left out of the judge order and why)?"
   - Option "Write it": "The JUDGE ORDER line ends with LEFT OUT and each seat's reason; Init Seats and Build Save Body change, seating does not."
   - Option "Hold": "Nothing is written; the row keeps naming only who sat."
   - Press: "Write it", 08:25 CST 11-25.
   - Message above: cmsg_017ZQamDMHrS6fqMHnQDVo58AWdUc4gbGEcBse2HWfAYZS.
2. Plan: ask646/w4/plan646.md, md5 f9052bc754a35f2edf3d4d069202a823. W1 grade: Wall 12056.
3. Targets:
   - Written target: b4, ask646/w4/b4/tg/target_engine_646.json, md5 e27e24e5dc0408fe210b281b2c0d01dd. W1 recheck PASS: Wall 12076.
   - Earlier targets: b1 dc3bedc60f0f2da76e46708063bc3568, b2 764f434a46feeb70c5afe4890c2fc2e1, b3 0ec564d1d7504e1fcb9adb3d574dfc2a. I found no W1 post that names these md5s.
4. Files and records:
   - Fetch-back: md5 a2c74e54a160caa3d5cdbc42b82855da.
   - Revert: revert_eng_646.json, md5 2712daa791d6fa8beba41ee1906d5218.
   - Write script: write646.sh, md5 d9ca233543cc7282b140357640937be0.
   - Audit row: 42235.
   - Commit: b2a743a41a3f06f628ff34851d288cd07034d5a5.
   - W1 readback: Wall 12078, PASS.
5. Engine: 8470161f becomes e11a57aa-f60d-4fee-8b59-22403aa8639e.
6. Tests: t646 ALL PASS (md5 958f8bf18f497d171730aad2ad751339).

## ASK 634 (a judge's corrected FORCED line is applied at its pair's line)
1. Card cmsg_017ZQamDMHrS6fqMHnQDVo584otzyTAZs2oZpEscmXAHnW, posted 06:16 CST 11-25.
   - Question: "Write ASK 634 so a judge's corrected FORCED line is applied at its pair's line?"
   - Option "Write it": "I change one line of the engine's shared library. In 42528, sol's three items would have counted as cured (uncured 9 to 6), with no change to the outcome. W1 reads it back."
   - Option "Hold": "The engine stays as it is. A judge that corrects a pointer line at the gate still cannot cure it, and the item counts against the judge."
   - Press: "Write it", 08:35 CST 11-25.
   - Message above: cmsg_017ZQamDMHrS6fqMHnQDVo582HTcBQvHEbeAAvhuJJA9sb.
2. Plan: ask634/w4/plan634.md, md5 4735a147f96353c9f6366e3bc6b6f042. W1 grade: Wall 12002.
3. Targets:
   - Written target: b4, ask634/w4/b4/tg/target_engine_634.json, md5 e6d008111e84aacc1880718fa39e3f75. W1 recheck PASS: Wall 12078.
   - b1: 2136d5ad6fd06983e7b50d0dda04a224, Wall 12046.
   - b2: 7a19c8be1c603e9bbd2e5432228827a5. I found no W1 post that names this md5.
   - b3: 56ea8c2861270ef256ca18471739f8c0, Wall 12076.
4. Files and records:
   - Fetch-back: ask634/w4/write/fetchback_eng_634.json, md5 9eb6db1e82dde9644f033718b2616fcb.
   - Revert: revert_eng_634.json, md5 e40b088f16d5bbb74eaddb9a4c6dbc76.
   - Write script: write634.sh, md5 6eb56d01a4479a28cc7e92a0c22f48de.
   - Audit row: 42241.
   - Commit: cb25ecb15a9bec560bec6c85aa0c962a32f9c0db.
   - W1 readback: Wall 12085, PASS.
5. Engine: e11a57aa becomes 7f4e5503-4e17-42df-a05b-882cbf04ac50.
6. Tests: t634 ALL PASS (22) (md5 22e230ecd7486654de306013f78d07f4).

## ASK 651 + 652 (one card, one write)
- 651: the PRS refCheck reads the quotation to the end of its line, not 160 characters.
- 652: a verse inside a press line ([L3], MEANS) is not a press.
1. Card cmsg_017ZQamDMHrS6fqMHnQDVo58F12ck7RxDR9wiG7wni57j5, posted 08:57 CST 11-25.
   - Question: "Write ASK 651 + 652 to the live engine?"
   - Option "Write it": "Stops the engine telling judges proven verses are \"not a witness\" and telling the Oracle proven presses cost nothing. Reverts with one file."
   - Option "Hold": "Next run keeps the false UNPROVEN labels and the false costless list (25 such labels were in the 42528 judge text)."
   - Press: "Write it", 09:09 CST 11-25.
   - Message above: cmsg_017ZQamDMHrS6fqMHnQDVo58YEDWGeV3txREtJW5gMFKEk.
2. Plans:
   - 651: ask651/w4/plan651.md, rev 0, md5 a6d624d4cb9d42e2ca05630da7a4c2ce. W1 PASS WITH N1: Wall 12101.
   - 652: ask652/w4/plan652.md, rev 1, md5 c82c1d696e3ff8417e3516170e0d1cca. W1 PASS: Wall 12103. Rev 0 was graded FAIL on F1 in Wall 12101; that rev 0 file was overwritten by rev 1.
3. Targets:
   - Written target: ask652/w4/b1/tg/target_engine_651_652.json, md5 1aa1517517fc227ef4e8d9cd75d05917. W1 build PASS: Wall 12108.
   - Intermediate: target_engine_651.json, md5 70329a64d0a33f9f7ef7d67ca12c34b4. It was not graded alone.
4. Files and records:
   - Fetch-back: ask652/w4/write/fetchback_eng_651_652.json, md5 4bf159e462b3843fe283c7255ac8f6d7.
   - Revert: revert_eng_651_652.json, md5 60a8ddf02c11f8b0cf506816b2a71f75.
   - Write script: write651_652.sh, md5 5e627cc5ca2db076457e88160f6e337b.
   - Audit row: 42304.
   - Commit: 0ac3498ff18c136ae53300de3815194ce77865d5.
   - W1 readback: Wall 12129, PASS.
5. Engine: 7f4e5503 becomes 50ade174-e08d-48a2-95de-1fd4bcbebcfd. LIB is 78f56d1449dc8e96, map b5974b30d48fe432.
6. Tests: t651_652 ALL PASS (28) (md5 9352cdbc844bc02a1913e5e467c7c82e). One-copy check: PASS.
