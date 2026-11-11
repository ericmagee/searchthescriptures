# Engine manual section: pkgRVF (Format Markdown reads K-W and K-S3 cures)

Node: Format Markdown (export only; feeds Plain Rule Lines, then Save to Drive). No other node, no prompt, no judge or enforcer text changes.

## What it does
The export prints each extractor or audit flag that says REVIEW THIS ROW. A flag prints as "Cured flag" when its key is in the set of
the same judge's CURED rule reports; otherwise it prints as "Review flag". Before this package, flagKey gave no key to two flag forms,
so every such flag printed as "Review flag" even when the seat's own cure report said CURED:

- K-W: `(K-W; ruling N) -- <ITEM> #N: "..."`. Key K-W|<ITEM #N>, matched to the report row with RULE K-W and the same ITEM.
- K-S3: `(S3; ruling N) -- <SIDE> <ROUND>: <sentence>; a close-round concession ...`. The flag carries no #N, so the key is
  K-S3|<SIDE ROUND>|<first 40 letters and digits of the sentence, lower case>. The report side reads the same key from the report
  row's LINE field (`<SIDE ROUND>: <sentence>; STATEMENT: ...`). The sentence ends at "; a close-round", "; STATEMENT" or "; JUDGE STATEMENT".

## Limits
- Two K-S3 flags of one judge whose sentences share the same first 40 letters and digits share one key; if one is CURED and the other
  is not, both print as cured. Not seen in stored data (0 of 842 S3 flags in 30 days matched both a CURED and an UNCURED report).
- Report reading: a K-S3 report row whose LINE does not begin with the side and round adds no sentence key (its flag stays Review).
- Record and export only: no grade, count or verdict reads this label.

## Size
Format Markdown code +590 characters (measured on the live fetch-back); prompt 0.
