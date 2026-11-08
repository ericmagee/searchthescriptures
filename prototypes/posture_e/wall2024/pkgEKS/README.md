# pkgEKS: DeepSeek RULE K-S3 accepts NOT HELD (W1, 11-08)

Approved: Eric "yes" to ASK 2 (11:40 CST 11-08). Cause: W3 grade_33750.md, 8 of 8 terra K-S3 rows NO ANSWER. Terra answered NOT HELD with a reason;
the cure (pkgKS3) accepts NOT HELD and CURED them, but the DeepSeek rule text named only COUNTED and TOUCHES NO LINK, so DeepSeek wrote NO ANSWER.
Same drift pkgEKN fixed for K-W.

Change: two passages in RULE K-S3 of the DeepSeek enforcer prompt (the enforcers themselves, so it satisfies the enforcer-fix gate).
1. Names the three answer forms (COUNTED; TOUCHES NO LINK: <why>; NOT HELD: <why>) and says never to write NO ANSWER on NOT HELD.
2. Grading: if the sentence gives up a declared link or listed premise, AGREE with COUNTED, DISAGREE with TOUCHES NO LINK or NOT HELD; otherwise the reverse.

| Node | Base | Before | After |
|---|---|---|---|
| Enforcer Build | live s64 | ed35761ec9e6 | e0541e391f94 |
| Alt Judge Enforcer Build | pkgRP10/patched (s65) | 355115577fc6 | 9326070b9a11 |
| R2 Alt Judge Enforcer Build | pkgRP10/patched (s65) | 022f281cb4a6 | c6f7fae63f06 |

Stacks on s65 (pkgRP10 Alt nodes). If s65 is not written first, rebuild the Alt nodes on whatever is live.

Test (`node pkgEKS/test_EKS.cjs`, 7 OK 0 FAIL): each source equals its base plus the two passages; over 30 saved runs per node, 26 Enforcer Build and
18 Alt prompts holding K-S3 differ only by the two passages, every other item byte-equal. R2 Alt has no saved inputs (static check only).

Live bar: 0 K-S3 rows NO ANSWER where the judge wrote NOT HELD; NOT HELD rows get AGREE or DISAGREE.
Revert: the Before shas (s64 Enforcer Build; pkgRP10 Alt nodes).
