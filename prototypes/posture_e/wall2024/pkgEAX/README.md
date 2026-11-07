# pkgEAX (W1): residual hold of false "only grants" E-ANS pushes, stacked on W2's pkgEAI (DeepSeek enforcer fix)

From W3 grade_33389 fault 2 and W1's independent check (Wall 2900): 10 of the 13 "only grants" MISSES pushes in 33389 were false. On the live EAM stack only Hebrews 7:10 was held.

- W2 built pkgEAI (EAW/EAH finders) in parallel; this package is the residual rule on top of it, named pkgEAX so the two do not collide.
- Record only: Judge Enforcer Record and Alt. Base pkgEAI/patched_on_pkgEID (JER 9928ff5cbd47, Alt 3b87eb766cf1).
  - LIVE patched_live: JER 4bf90e5f5607, Alt 948bfb0a7be0.
  - TRIAL patched: JER b9cea7b3dc1f, Alt c721b911364c.
  - The Builds are those of pkgEAI/patched_on_pkgEID, unchanged.
- Efficiency item 4 (Eric 11:06): pkgEAX reuses the rounds pkgECQ already reads (__rdRounds), so the Record reads Panel Cure Normalize once per run. The replay is unchanged by this.
- Rule (eax_lib.js), applied to an E-ANS "DISAGREE (right: MISSES)" only:
  1. **Trigger.** The reason must call the answer a grant, or say it "gives no fit" or "only restates".
  2. **Never held.** A reason that names another defect stays sent: omits, ignores, nowhere, repeats, concedes, withdraws or drops, or the press.
  3. **Which answer is judged.** The quoted words must run 5 or more words in the round the item names. The block is the run of [Ln] lines holding them plus its header line.
  4. **Hold, when the header names the item's verse.** The block carries 3 or more distinct [Ln] tags, or 1 or more tags plus a fit sentence ("fits", or "So ...") after the words.
  5. **Hold, when the item's own "ANSWER: verse" block exists with 3 or more tags.** That block decides.
  6. **Hold, otherwise.** A fit sentence must follow the words on their own line.
  7. **What is written.** LIVE: "ENFORCER HELD (pkgEAX, not sent; ...)". The send-back filter does not send it. TRIAL: a mark only.
- test_EAX 14 OK:
  - 33389: the 5 false pushes pkgEAI leaves are held: 1 Chronicles 28:6 [CR4] for chatgpt and sol, Matthew 1:21 [CR4] and [DR3], and sol Matthew 1:18 [DR3].
  - With pkgEAI + pkgEAX, all 10 false pushes are held and only the 3 arguable ones are sent (Matthew 11:11, Galatians 4:4, Job 14:1).
  - No other row changes. TRIAL marks only.
  - Lib controls: bare grant, other defect, withdrawal, wrong round, quote not found, own answer block.
- replay_EAX 22 OK over every saved run, main and Alt, on pkgEAI. A row changes only from E-ANS DISAGREE MISSES to HELD. In all, 9 more are held and 258 are still sent. The held rows are listed in replay_EAX.txt.
