# ASK 329 [L2] binding TRIAL: grading baseline (W1, session_01H1X3ANxr57MZvsu7fHB9kh)

Eric approved the record-only TRIAL at 15:03:57Z ("all approved."). Design: Wall 6902 (rev 2), 6903 (L2 Count Plan), 6907 (B3 line definition and plants), 6908 (corrected D).
Sources: debate_results, original_words, the live s218 code, and a329/measure.sql (fixed window, 116 rows). Nothing here comes from training knowledge.

## 1. Comparison base (important)

Run 37372 ran on s211. A replay through s218 code (ASKs 319 to 324 live) can differ from the stored s211 row. So "byte-identical" means a comparison between two s218 replays:

- **PRE:** replay on live s218 (ffc2f775) as it stands now.
- **POST:** replay on the built version.

Do NOT compare POST with the stored debate_results row. For reference only, the stored row has review_notes md5 46139339d9115d4748251070bda90ed5 (5,855 chars), and one AUDIT v28 line, md5 555763ff19c948cb0ac0b37031c1bd0c ("291 tags; 278 COUNTED; 13 NOT COUNTED").

## 2. Byte-identical, PRE vs POST, replay of 37372 (all must hold)

a. The L2 Count Plan output with l2_trial removed: tags, claims, gloss, counts_url (6903 item 10).
b. The L2 Counts request URL.
c. Quote Report l2.tags, l2.counts and l2.gloss. POST may add only l2.trial.
d. Every Panel Build judge prompt (the full body string per seat).
e. The Build Independent Verdict prompt.
f. drvCheck inputs (PRS_L2BAD set) and drvCheck results for every judge reply on all three call sites: panel cure, alternate, regrade.
g. kl2Lines and K-KJV l2() results on the judges' own [L2] lines (W1 6901 addition).
h. Build Save Body: every stored column, and the existing AUDIT v28 line byte for byte. Only one new AUDIT line is added (6907 item 2).
i. Format Markdown: the whole report, except one new section.
j. Each debater-facing Build (D2 to C4, the B and G variants): prompt unchanged. They call only L2C.sheet (W1 6901 check).

## 3. No whole-object serialization (6903 item 11)

**Static check:** the builder lists every JSON.stringify( call in these nodes, with its argument:
- Panel Build
- Build Independent Verdict
- Shared Library (drvCheck, kl2Lines and cure paths)
- Build Save Body
- Format Markdown
- Quote Report

None of those arguments may be (or contain) the Quote Report json, its l2 object, or the L2 Count Plan output.

W1's partial check (6905): no stringify argument names Quote Report or l2. That is not proof, because a variable can carry the object.

**Decisive check:** the PRE/POST prompt diffs in 2d to 2f must be empty. If l2.trial leaks into a prompt, it shows there.

## 4. Expected trial classes: the 37372 rows of the 116 (measure.sql n = 107 to 116)

| n | round | number | nearest ref | expected trial class |
|---|---|---|---|---|
| 107 | CR3 | G1080 | Psalms 2:7 | NOT COUNTED, cross-reference reason (false catch; 6908) |
| 108 | CR3 | G4815 | Galatians 4:4 | COUNTED (footing line, B3; W3 6898) |
| 109 | CR3 | G5088 | Luke 1:35 | NOT COUNTED ("not in Luke 1:35; stands only in the cross-reference Luke 1:31 after the tag") |
| 110 | CR3 | H2029 | Isaiah 7:14 | NUMBERING PAIR sub-line (H2029 tagged; record H2030) |
| 111 | CR3 | H2029 | Galatians 4:4 | NUMBERING PAIR per 6902. CHECK: the nearest reference is New Testament. If Isaiah 7:14 is not among its bound verses, rule C(a) cannot fire and C(b) cross-language applies. The builder states which happens, and why. |
| 112 | CR4 | G1080 | Psalms 2:7 | NOT COUNTED, cross-reference reason (false catch) |
| 113 | CR4 | G1097 | Genesis 4:1 | CROSS-LANGUAGE flag (B), never NOT COUNTED |
| 114 | CR4 | G5088 | Matthew 1:16 | NOT COUNTED (A) |
| 115 | CR4 | H2029 | Isaiah 7:14 | NUMBERING PAIR |
| 116 | CR4 | H2029 | Isaiah 7:14 | NUMBERING PAIR |

Also: Matthew 1:25 G5088 (CR3) stays COUNTED in the trial (6902 E1).

## 5. Whole-116 expected totals (6908; the hand reads are W2's a329/w2_hand_read_1_58.md and W3's 6891 as corrected in 6898)

- A 65: 60 NOT COUNTED, 5 on the pair sub-line (96, 110, 111, 115, 116).
- Cross-language flags: 13. That is B's 9 plus rows 30, 40, 45, 46.
- B' (1 row): NOT COUNTED (reviewer case).

C 41:
- 23 COUNTED:
  - 9 pipe form (W2 3, 5, 17, 26, 38; W3 63, 65, 71, 77)
  - 3 footing (97, 98, 108)
  - 11 bare reference (W3's 8; W2 8, 18, 55)
- 10 REVIEW: W2 2, 12, 19, 48, 51; W3 70, 78, 79, 86, 88.
- 4 cross-language (counted in the 13 above).
- 4 false NOT COUNTED, with the cross-reference reason: 107, 112, W2 31, W2 32.

**Grade rule:** each row that differs from its expected class is listed with a reason. An unexplained difference fails.

## 6. Invariants outside the 116

- The 36 numbers that fail SECTION today never become COUNTED in the trial (W1 6895 condition 1).
- The 3,130 numbers that pass NEAR keep their status.
- The 846 numbers with no reference: binding falls back to the section, as today.
- Class B is never NOT COUNTED (Eric's 6888 question is still open).
- A pair is only H2029/H2030. The list is fixed, and only Eric may add to it.

## 7. Plants

- The B3 line pair and its mirror (6907 item 1).
- A bare "1:18" under the wrong book (goes to REVIEW; W1 6895 condition 2).
- An en dash range "Matthew 1:22–23".
- Self-correction "wrongly gave" (REVIEW).
- A clause just before the marker quoting verse words (W2 48 shape; REVIEW).
- A grant label "G5" inside an [L2] segment: pkgGLB drops it, and the trial must not count it as a number.

## 8. Build hygiene

- Every L2C copy that defines tags carries the identical trial function (the 22 pkgGLB-marked nodes, per W4 6917).
- Shared Library MAP lengths and header sha are recomputed.
- reasoning_guard passes, and no model setting is touched.
- Fresh readback after the write.
- The next run report lists 329 TRIAL as FIRED or UNEXERCISED.
