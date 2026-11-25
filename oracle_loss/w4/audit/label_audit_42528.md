# Judge-facing label audit, run 42528 (W4, read only)

Source: Panel Build judge payload, p42528_msg0.txt (system) and p42528_msg3.txt (transcript).

## 1. [L2] CHECK: 30 NOT COUNTED, 15 are misfires, all against the Oracle (defender)
The check (Shared Library check(), parser rootAt/ROOTPRE) voids a whole [L2] tag when any Greek or Hebrew word named in it is not in the cited verse, unless the word is marked as a root. ROOTPRE marks only a word that directly follows "from", "root", "derived from", "cognate of/with/to" or "related to".
The Oracle quoted the lexicon line whole (as the GLOSS CHECK demands). The lexicon line names etymology words. The parser took those as claimed words:
- "from σύν and ἔρχομαι": σύν is marked root, ἔρχομαι (after "and") is not, so G4905 synérchomai (which IS in Matthew 1:18) is NOT COUNTED. Same for G3880 (λαμβάνω), G1904 (ἔρχομαι), G1982 (σκιά), G4815 (λαμβάνω).
- "(compare ἄνθρωπος)" in the G435 anḗr gloss: G435 NOT COUNTED (CR2 and CR3).
- γένος in the G1080 gloss, χράομαι in the G5548 gloss: NOT COUNTED.
Payload lines: 145, 147, 148, 156, 158, 164, 165, 169, 170, 197, 198, 200, 204, 209, 261. In every one, the tag's Strong's number was found in the cited verse; only an etymology word failed.
The other 15 are correct (H1330 bethulah is not in Isaiah 7:14, which has H5959; G1080 not in the cited verse; "conceive" names no original word; G1165, G5545, H2029 not in the cited verse).
Two correct ones are strict: line 195 (7 numbers, 6 found, one H1330 missing) and line 191 (G4815 and G1537 found, G1080 missing) void the whole tag.

Effect: the judges are told each of these 15 Oracle [L2] layers "is no layer: it gives no footing, proves no press and counts toward no [L4]". G4905 (Matthew 1:18 came together), G3880 (took), G435 (husband), G1080 (begat), G1904 and G1982 (Luke 1:35 come upon, overshadow) are the Oracle's main word layers on the points it lost.
The Oracle is caught both ways: quote the lexicon whole and the [L2] CHECK voids it; quote part and the GLOSS CHECK marks it TRIMMED.

## 2. GLOSS CHECK: 83 TRIMMED, about 8 misfires
Lines whose "left out" text is only the record's source tag "[source: MetaV Strongs.csv ...]", a repeated word, or a verse reference ("Hosea 14:1", "token."): 7 defender, 1 challenger. Examples: H2233 (CR3 and DR3), H2030, H226. The other ~75 are real trims (for example "seed, posterity, child" leaves out fruit, plant).

## 3. PRESSED-WITNESS LEDGER
Covered by ASK 651 and 652 (Wall 12098, 12103).

## Fix candidate (needs an ASK number; not built)
In the parser, mark as root every word inside the etymology clause of a quoted lexicon line: words joined to a root by "and", and words after "compare", "akin to", "a variation of", "prolonged form of", "from ... of". Side-neutral. Replay on 42528 and 42373 before any plan.

Not yet checked: whether a NOT COUNTED [L2] also turned an Oracle press UNPROVEN in the ledger; run 42373.
