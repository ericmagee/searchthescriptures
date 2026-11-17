import json
P=[]
PH="at all, in any wise, in any way, in no way, by no means, of any kind, at any time, nothing but, whatsoever, only, alone, solely, merely, exclusively, ever, always, all, every, any, entirely, wholly, completely, fully, absolutely, utterly, altogether, for ever, from then on, after that, perpetually, permanently, continually, henceforth, thereafter, afterward, afterwards, never"
# 1. K-G4 row: reader words and the retraction outcome
P.append(("a BROKEN grade resting on meaning is cured only by a FORCED line (md_notes_rulings 421).",
 "a BROKEN grade resting on meaning is cured only by a FORCED line (md_notes_rulings 421), and a retraction of it leaves the item UNCURED. A GROUND names a witness left unanswered when, outside quotations, it says the witness got no answer, or that the answer does not (did not, do not) address or engage it, or was given without addressing or engaging it, or that it was not (been) addressed: an answer that MISSES or FAILS leaves the witness unanswered (md_notes_rulings 372)."))
# 2. K-ML and K-SU rows after the K-KJV row
P.append(("| K-AG | an ANSWER CHECK grade the reader cannot map",
 "| K-ML | (TRIAL, list only) a FORCED line whose MEANS, quoted from a side's round, holds a listed word or phrase that the sentence unit of the line's GROUND [L1] verse lacks (unit as K-SU), where no layer in that side's block of the MEANS round carries it: an [L2] gloss that states it, or an [L3] verse whose KJV row as read this run states it. The list: " + PH + ". The longest phrase is matched first; \"forever\" is read as \"for ever\", \"n't\" as \"not\" and \"cannot\" as \"can not\". A negation word (not, no, nor, neither, none, nothing, nought, naught, never) counts as added only when the unit holds none of them, and any negation word in a layer carries it; \"never\" as a time limit is carried only by a layer that says \"never\". The verse is the GROUND's [L1] verse, or, when the GROUND names none, the verse in parentheses at the head of the line (\"D1 vs C1 (Matthew 1:25) ...\"). NOT CHECKED (an AUDIT v35 line, no item): a line with neither, a verse or [L3] verse not read this run, a MEANS quotation not found in its round. LIST ONLY: the item is asked and recorded CURED or UNCURED; it moves no count and removes no seat; silence on it does not count; a retraction on a link that only K-ML or K-SU items name is recorded and not applied | the FORCED line written again without the added words, or the line withdrawn |\n"
 "| K-SU | (TRIAL, list only, as K-ML) a FORCED line, or a line holding \"LINK BROKEN\", whose verse (read as for K-ML) completes a larger sentence, where the line itself neither names another verse of that sentence nor quotes six running words of one, and the answer round the line names (the ANSWER round of a FORCED line, or \"answer [round]\" in a BROKEN line) does. The sentence unit runs back while the verse before ends in \":\", \";\" or \",\", and forward while the verse does not end in \".\", \"?\" or \"!\", three verses each way at most; margin notes in the form \"[word: or, word]\" are removed and bracketed supplied words such as \"[was]\" are kept | the line graded on the whole sentence (naming the other verse or quoting six running words of it), or the line withdrawn |\n"
 "| K-AG | an ANSWER CHECK grade the reader cannot map"))
# 3. Section 18
P.append(("- Live flow: s237 (n8n version 94549982, 458 nodes; Shared Library 1,000,399 characters, sha f7d6f3671f0ccc86).",
          "- Live flow: s239 (n8n version 87f6d416, 458 nodes; Shared Library 1,009,724 characters, sha d802f4b35dc4eb2d)."))
P.append(("s237 (94549982) = s236 + ASK 350.", "s237 (94549982) = s236 + ASK 350. s238 (52302760) = s237 + ASK 352 rev 2. s239 (87f6d416) = s238 + ASK 351 rev 2."))
P.append((" 350 is UNEXERCISED until a run.", " 350 to 352 are UNEXERCISED until a run."))
NEW = ("  - A RETRACTED MEANING BREAK STAYS UNCURED (Shared Library, library lines 809, 852, 1068 to 1074 and 3315):\n"
"    - What it does: a K-G4 item whose GROUND names no pressed witness left unanswered rests on meaning (md_notes_rulings 421). A RETRACTED line on it reads UNCURED, with the reason \"retracted, but the GROUND names no pressed witness left unanswered, so the BROKEN grade rests on meaning: only a FORCED line cures it; a retraction does not\". One FORCED line still cures it. K-G4 is LIVE, so a retracted meaning break with no FORCED line counts in drv_uncured and the seat is NOT COUNTED.\n"
"    - The quoted-reason retraction cure for K-G4 is withdrawn: the named-verse reason, the reason quoting 6 or more words of the holding side's answer, and the refusals added to them (the judge's own ANSWER CHECK graded MISSES or FAILS). The K-G4 item still records `acm` and `acq` at the raising check; no cure reads them.\n"
"    - The unanswered-witness reader (g4Unans2024) also reads the words the K-G4 row lists (does not address, without engaging, not addressed and the like). A line holding them takes the unanswered-witness path in the unanswered-false check, the cure, the gate engine note, the corrected-text check and the label.\n"
"    - Prompt: the judges' K-G4 prompt includes \"A BROKEN line whose GROUND names no pressed witness left unanswered rests on meaning: it is cured only by one FORCED line; a retraction does not cure it (ruling 421).\" The MEANING BREAK label gives the FORCED form and \"A retraction does not cure it (ruling 421): a retracted meaning break stays uncured, and an uncured K-G4 item counts against your seat (LIVE rule).\"\n"
"    - Shown offline: of the stored K-G4 retractions, 48 move from CURED to UNCURED. Not shown by a run.\n")
P.append(("no K-G4 retraction cure reason was written, so the cure-reason text is not yet shown.",
 "no K-G4 retraction cure reason was written. Both texts are now withdrawn: the K-G4 quoted-reason retraction cure and its reason, and the judges' rule sentence that ended \"ruling of 2026-11-06\" (see A RETRACTED MEANING BREAK STAYS UNCURED)."))
json.dump({"pairs":P,"block_new":NEW}, open('pairs181.json','w'), ensure_ascii=False, indent=0)
for a,b in P: assert '$w3e$' not in a+b
assert '$w3e$' not in NEW
expr="content"
for a,b in P: expr=f"replace({expr}, $w3e${a}$w3e$, $w3e${b}$w3e$)"
blk=("overlay(c placing $w3e$"+NEW+"$w3e$ from position(E'  - A K-G4 RETRACTION AGAINST THE JUDGE''S OWN ANSWER CHECK' in c) "
     "for position(E'  - A GATE K-G4 ITEM ON A MEANING BREAK SAYS SO' in c) - position(E'  - A K-G4 RETRACTION AGAINST THE JUDGE''S OWN ANSWER CHECK' in c))")
DEL="regexp_replace(regexp_replace(content, E'\\n  - pkgRMQ rev 2 \\\\(K-G4 retraction quoting a missed answer\\\\):[^\\n]*', ''), E'\\n  - pkgCNV rev 3 \\\\(K-G4 retraction against the judge''s own ANSWER CHECK\\\\):[^\\n]*', '')"
meas=(f"with b as (select {DEL} c from engine_manual where version=180 and md5(content)='1bcac6b4209a0cfce1436eda5de29208'), "
      f"o as (select {blk} as content from b) "
      f"select md5(x) md5, length(x) len from (select {expr} x from o) s")
open('meas181.sql','w').write(meas)
print(len(meas))
