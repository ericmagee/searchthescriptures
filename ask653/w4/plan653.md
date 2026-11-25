# ASK 653 plan, rev 0 (W4): [L2] CHECK reads lexicon etymology words as claimed words

## Fault (Wall 12122, W1 confirmed Wall 12123)
In run 42528, 15 of the 30 [L2] tags marked NOT COUNTED are misfires, and all 15 are defender (Oracle) tags. In each, the tag's Strong's number is in the cited verse. The tag fails because the Oracle quoted the lexicon line whole, and the parser took the etymology words in that line as claimed words:
"from σύν and ἔρχομαι", "from παρά and λαμβάνω", "from ἐπί and a derivative of σκιά", "a primary word (compare ἄνθρωπος)", "from a variation of γένος", "probably akin to χράομαι".
The Shared Library markRoots marks a word as a root only when it directly follows "from", "root", "derived from", "cognate of/with/to" or "related to". The check (check(): core = the non-root words; every core word must be in the cited verse) then voids the whole tag.

## Change (one node: Shared Library; two LIB lines; tagged /* ASK 653 */)
Only one copy exists: the Shared Library. L2 Count Plan and the verdict builders load markRoots from it.

1. LIB line 146 (ROOTPRE). Add "compare" and "akin to" to the root markers. Allow "variation of", "derivative of", "prolonged form of" and "form of" after the marker.
Before:
 const ROOTPRE=/(?:\bfrom|\broot|\bderived\s+from|\bcognate\s+(?:of|with|to)|\brelated\s+to)(?:\s+(?:the|a|an))?(?:\s+(?:root|verb|noun|word|stem|lemma|greek|hebrew|aramaic))*[\s*_"“”‘’'(,:]*$/i;
After:
 const ROOTPRE=/(?:\bfrom|\broot|\bderived\s+from|\bcognate\s+(?:of|with|to)|\brelated\s+to|\bcompare|\bakin\s+to)(?:\s+(?:the|a|an))?(?:\s+(?:root|verb|noun|word|stem|lemma|greek|hebrew|aramaic))*(?:\s+(?:variation|derivative|prolonged\s+form|form)\s+of)?[\s*_"“”‘’'(,:]*$/i; /* ASK 653: compare, akin to, a variation/derivative/form of mark a root */

2. LIB line 153 (rootAt, second pass only). A word joined by "and" or "or" (optionally "and a derivative of") to a word already marked root is a root too.
Inserted right after "if(!pass)return false;":
const __a=pre.match(/([^\s(*_"“”]+)[*_"”’]*\s+(?:and|or)(?:\s+(?:a|an|the))?(?:\s+(?:variation|derivative|prolonged\s+form|form)\s+of)?[\s*_"“”‘’'(]*$/i);if(__a){const j=i-pre.length+pre.lastIndexOf(__a[1]);if(wds.some((w,k)=>R.has(k)&&pos[k].includes(j)))return true;} /* ASK 653: an etymology word joined to a root by and/or is a root too */

No line is added to or removed from the LIB array, so the MAP entries keep their line indexes. Their n values are re-measured at build.

## Side-neutral and bounded
- The "and/or" chain applies only when the word before "and" is already a root. So "G4905 ... and G3880" still checks both numbers (negative tests pass).
- A root word is set aside, never counted as found. The tag still needs its own core word or number in the cited verse.
- The 15 correct NOT COUNTED tags in 42528 must stay NOT COUNTED. For example, H1330 is not in Isaiah 7:14. Line 191 (G1080 missing) and line 195 (H1330 missing) are Strong's numbers, not etymology words, so they are unchanged.

## Pre-test (b0/t653.cjs md5 b7d34384, on live LIB lib_base.js md5 9441b4ef)
All 7 misfire patterns: before, the word is core; after, it is a root, and the tag's number stays core. 2 negative cases stay unmarked.

## Build and proof (after grade)
- Build on target_engine_651_652.json (ASK 651+652 not yet pressed), so one write carries 651+652+653. If 651+652 is written first, rebase on the fetch-back.
- Replay the full L2 Count Plan check on the 42528 and 42373 [L2] tags, before and after. Expected for 42528: the 15 misfires become COUNTED, the other 15 stay NOT COUNTED, and no COUNTED tag changes. Report the 42373 diff in full, both sides.
- Library Check pair check; the 651/652 tests are re-run.
