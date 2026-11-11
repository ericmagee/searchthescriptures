# Manual section: pkgRCH (reclaim check reads link headings with a bracket or parenthesis) (W2)

Enter only when written. Figures MEASURED.

Reclaim candidates at the close (pkgRCL rev 3, heading reader widened by pkgRCH). Close Enforcer Build finds the earlier rounds' narrowing lines by their heading: "LINK N: NARROWED TO", "LINK N: CONCEDED", "LINK N: WITHDRAWN" or "LINK N: DROPPED", in any letter case, after * and _ are stripped. Since pkgRCH it also reads one bracket or one parenthesis between the link number and the colon: "LINK 2 [premise 3]: NARROWED TO", "LINK 13 [§VII]: CONCEDED", "LINK 4 (premise 4, D2): CONCEDED", "LINK 5 (D5): CONCEDED", "LINK 2 ("carried by the woman"): CONCEDED", "LINK 7 (D5, Galatians 4:4): CONCEDED". The link number is the number after LINK, not the premise number inside the bracket.

Size: code +32 in Close Enforcer Build only; fixed prompt 0. The enforcer request grows only when the case occurs (+565 characters on run 35067).

Limits: two brackets in a row, a bracket and a parenthesis together, or words between the bracket and the colon are not read. A heading with no colon keyword is never read.

First-run check: when [CR3] or [DR3] has a bracketed or parenthesized narrowing heading and the close keeps that link "as declared", the closing enforcer's request lists a candidate for it; otherwise the request is byte-equal to s130. No Close Enforcer Build error.
