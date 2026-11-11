# pkgCPR, CLOSE PROMPT RULE STATEMENT (W1; built on s138; not written)

Purpose: the debater is told the ruling environment in the close round, on the operator's approval of 12:35 CST 11-11 ("we are giving the debater a fair understanding of the ruling environment").

Change: D4 Build (defender close) and C4 Build (challenger close) append the same fixed text to the close-round instruction:

"Narrowing or conceding carries no conduct penalty: it is weighed on the merits, and a part left out of a narrowed restatement counts as dropped. A close sentence that denies what your earlier rounds granted, or restores a link or a part you narrowed, conceded or dropped, contradicts your own record: your chain is broken by default, the system sends no request to correct it, and a later withdrawal does not undo it."

Before: neither close instruction stated either point. The defender's system prompt says nothing on contradictions; the challenger's CONTRADICTION WATCH concerns the opponent only.

Sizes (measured): code +836 (418 per node); prompt +418 characters per close request. D4B Build, C4B Build and C4G Build carry the close request, so each adds +418 when it fires. System prompts unchanged, so system-prompt caches are kept. Nodes +0, connections +0.

Sources: the operator's contradiction rule ("you can't withdraw after you made the contradiction ... you chain is broken by default"); the ruling of ASK 20 (a part left out of a narrowed restatement counts as dropped).

Limits: "no request to correct it" refers to contradictions only; the barred-moves resend (D4B, C4B) still asks for a rewritten round when a barred move is found. The text informs the debater only; enforcement is unchanged. Its effect on debater conduct is not measured.

Proof: a debater-input change is proven only by debater output. Either a paid replay of the stored D4 and C4 close requests (for example run 35067) with the new text, compared with the stored closes, or the next run's closes graded for contradictions and drops. A live run alone does not isolate the effect.
