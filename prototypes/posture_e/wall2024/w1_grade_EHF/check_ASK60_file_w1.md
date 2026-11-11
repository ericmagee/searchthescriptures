# W1 check: ASK 60 file and the send-back growth figure

## 1. parent_s120_F1F2r2_EHF2.json (sha fb88d90b733967db), the +423 file. Script f423.cjs, output f423_out.txt.
Compared with: parent_s120_F1F2r2.json (afa5360be67f021c, pkgKWN + pkgG4M rev 2, graded), parent_s120_EHF2.json (ce5c2054144543e2, graded), s120 fetchback (b5ab005d1dea8e1f), joint_s120_VP1B_KWN_G4Mr2_EHF2.json (a4dc766fb276b70c), joint_s120_VP1B_KWN_G4Mr2.json (749d158d6c69f7ed).
- Library 3,534 lines in all. New file vs F1F2r2: lines 3047 and 3115 only; EHF2 vs s120: the same two lines; the new text equals EHF2's, the old equals s120's.
- Everything outside the Shared Library code (all other nodes, connections) equals F1F2r2. All non-code JSON equals s120.
- MAP: part lists equal; only the length fields of Send Back Build, Alt Send Back Build, R2 Alt Send Back Build change, each -19, as EHF2 vs s120.
- No node's effective code differs from F1F2r2 except where EHF2 differs from s120.
- New file vs EHF2 joint: library lines 1733 and 1742 only, the same lines and text as F1F2r2 vs the three-part joint (pkgVP1B rev 2).
- Code: new -s120 = +423 (F1F2r2 +436, EHF2 -13; joint +1,270). Measured.
- Runner check: 176 code nodes, 0 fail.
Result: the file equals pkgKWN + pkgG4M rev 2 + pkgEHF rev 2 as graded, and nothing else.

## 2. +127 vs +149. Script rec149.cjs, output rec149_out.txt.
Both figures add every string field of the Send Back Build output. Each send-back carries the text in three places: msg, body.messages[5].content, and items[].reason. Only body goes to the judge (Send Back Call openrouter sends $json.body).
- +149 = 19 x 11 - 2 x 30, arithmetic over all fields.
- +127 = measured over all fields. 22 less because one chatgpt item (the UNDERDETERMINED item) is already cut at 920 characters on s120; it stays 920, so 11 characters of its tail are cut off, once in msg and once in body.
- What the judge receives (body.messages[5].content), measured: luna 0, chatgpt +3, sol +55, total +58.
My Wall 4694 figure +127 double-counted the same text; it is not the judge-facing figure.
