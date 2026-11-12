# pkgCNP: code-found closing pairs (Close Enforcer Build)

Base: live s151. Node changed: Close Enforcer Build only. Library, prompts and every other node unchanged.
Size (MEASURED): Close Enforcer Build jsCode 8,315 to 13,741 (+5,426). Prompt text +0.
File: /mnt/project-files/wall2024/parent_s151_CNP.json. Build and tests: prototypes/posture_e/wall2024/pkgCNP/.

## Why
Run 35379: the defender narrowed LINK 5 in CR3 and withdrew Galatians 4:4 in CR2, then closed in CR4 with
"I narrow nothing and concede nothing." and "I keep D1 to D6 as numbered." The Oracle did not name the pair,
and pkgRCL only matches "as declared". So the close enforcer never saw a candidate, and the side was not broken.

## What it does
A new function cecDeny(F, links, cands) runs after cecOracle and cecReclaim. Its candidates join the
"CANDIDATES ALREADY NAMED" list, marked "by the code (pkgCNP)". Nothing else in the enforcer changes; the
enforcer still decides each candidate.

1. Closing sentences, in the side's round 4 (CR4 for the defender, DR4 for the challenger):
   - Denial: "I/we narrow (concede, withdraw, drop, give up, surrender, retract, yield) nothing / no link",
     "Nothing is/has been ... narrowed (conceded ...)", "No link (premise, limb, part, claim, ground, witness) of mine is ... narrowed",
     "I have not withdrawn anything", "without narrowing anything".
   - Keep-all: keep/stand/hold/remain with D1 to D6 (C1 to C6), "all/every/each (six) links", "my chain" or "the chain",
     ending "as numbered / as stated / as first stated / as written / as given / unchanged / intact / in full / whole / undiminished / untouched".
   - Not taken: inside a quotation (odd number of quote marks before it), a question, a conditional (if, unless, whether,
     would, should, could, might), naming the other side, with an exception word (beyond, except, further, more, else, new,
     again, here, since, after, in this close), or negated before the match ("I do not say that nothing is conceded").
   - A denial that names links ("I concede nothing on D5") pairs only with those links.
2. Earlier lines, in the same side's rounds 2 and 3:
   - "LINK n: NARROWED TO / CONCEDED / WITHDRAWN / DROPPED" lines.
   - "I withdraw / drop / concede / give up / no longer claim ... <object>" anywhere in a sentence (not "I withdraw nothing",
     not conditional, not quoted). Its link is the nearest "LINK n" or "Dn" heading; with none, the link is "?" and the
     enforcer is asked to name it.
3. Pairs: each closing sentence with each earlier line of the same side, only for links the side declared.
   One earlier line per link (the latest round). At most 8 per side. A pair already named (same side, link and closing
   sentence; for "?" the same earlier text) is not repeated.

## Tests (MEASURED, file cases_out.txt): 41 pass, 0 fail
- W1's cases.json A1 to A7 all found, each with and without the Oracle's section (A4 found by the code alone).
- N1 to N7: no pkgCNP pair.
- Plants P1 to P6 on 35379 with both real close sentences removed first: negated, question and conditional give no pair;
  six variant closes pair with LINK 5; the same six on a side with no earlier narrowing give no pair; bold markup gives
  the same result, quoted closes give none.
- Corpus replay of every export with Final Output data: identical except 35296, which gains X6 (LINK 2 against
  "Nothing is conceded or narrowed."). The 35379 export holds a crash stub; its rounds were rebuilt from the stored
  close-enforcer prompt (row 31032) instead.

## Limits
- English patterns only. A close that denies narrowing in other words is not found.
- A single link kept "as stated" is not a keep-all and is not taken.
- A free withdrawal with no heading goes out as LINK "?" for the enforcer to name.
- More candidates mean a longer enforcer prompt (35379: 2 to 8 candidates, about +1.5 KB of candidate lines, ESTIMATE).
- Run outcome not shown until a real run.
