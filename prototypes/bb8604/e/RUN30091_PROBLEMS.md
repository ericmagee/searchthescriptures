# Live run 30091: problems found, and a solution for each

Prepared by Worker E for the operator. Not posted to the board, by his instruction.

The run used the same topic and seats as the earlier run B: "Did Christ have a biological father?", with the plain defender against the record-holding challenger. It ran from 21:30 to 22:02 CDT on the debate flow version published in this order, and it ended in success. I read every round, the synthesis and diagnostic, the single judge, and all three panel judges in full, at my own seat, before reading anyone else's account.

## What the change fixed

The defender now answers the three verses that went unanswered in run B: Hebrews 7:14 ("our Lord sprang out of Juda"), 2 Samuel 7:12 ("which shall proceed out of thy bowels") and John 1:45 ("Jesus of Nazareth, the son of Joseph"). Both sides now carry pressed verses beside their premises. The judges did not void any premise for carrying them.

## Problems in the run

### 1. The challenger's list was not numbered, so the automatic verse ledger saw none of it

- **What happened.** The challenger wrote its six premises as "LINK 1:" through "LINK 6:" lines with no list numbers. The instruction asks for a numbered list. The flow's verse ledger reads only numbered lines, so it found zero premises against the defender. The flow's own extractor flagged it: "PREMISE COUNT 6 AGAINST THE CHALLENGERS OWN LIST OF 0". In run B the same seat numbered all six lines.
- **Effect.** Every verse the challenger carried beside its premises was invisible to the ledger the judges are shown. The judges read the transcript themselves, so the result did not depend on it this time, but the safeguard was blind.
- **Solution.** Make the ledger and the extractor accept a line that begins with "LINK n:" as a premise line, exactly as the judges' pre-check already does. The rule lives in code, not in the debater's obedience. Test it on this run's text before publishing.
- **Cause.** Not known. My longer list instruction may have made the numbering easier to drop. That is a guess (one run).

### 2. The stored outcome contradicts all three judges

- **What happened.** All three judges wrote "RESULT: UNDERDETERMINED". The stored outcome is "DEFENDER PREVAILS, WEAKENED". The database rule that writes the outcome turns every PARTIAL panel into "DEFENDER PREVAILS, WEAKENED" and never reads the judges' result lines. The judges' own rulebook says a PARTIAL gives UNDERDETERMINED.
- **Effect.** The record now says the defender prevailed in a debate where the defender argued "Christ had no biological father". That is the reading the record forbids (the drift guard on the biological father, DG-8), and all three judges declined to give the defender the win.
- **Solution.** Make the outcome rule follow the judges' result lines for a PARTIAL panel, as it already does for a HELD panel. The other way round is to change the judges' rulebook so its result line agrees with the stored mapping. I recommend the first, because it keeps one rulebook and the judges' own words. This is a change to scoring, so it needs your word.

### 3. Conceding a link saved the defender from BROKEN

- **What happened.** The defender conceded the link about "as was supposed" (Luke 3:23). The single judge graded that link broken by an unanswered witness, "his parents went to Jerusalem" (Luke 2:41), and gave BROKEN, CHALLENGER WINS. The three panel judges marked the same link withdrawn, which removes it from the collision count, and gave PARTIAL.
- **Effect.** Under the rulebook as written, a defender who concedes a link before it can be graded broken turns a loss into a partial result. Item 2 then turns that partial result into a stored "DEFENDER PREVAILS". Conceding is rewarded.
- **Solution.** State in the rulebook that a withdrawn link still counts as broken when a witness pressed against it went unanswered before the withdrawal. The panel and the single judge would then grade the same way. This is a change to judging rules, so it needs your word.

### 4. The panel and the single judge read "conceded" differently

- **What happened.** In its last round the defender wrote "LINK 1: CONCEDED", answering the challenger's premise against link 1, which concerned the John 1:13 argument. The panel counted the whole of link 1 as withdrawn. The single judge kept link 1 standing and counted only the premise. The flow's extractor flagged the single judge.
- **Solution.** Say in the rulebook whether conceding a premise withdraws the whole declared link or only that premise. The cleaner rule is that it withdraws the link only when the defender says so in those words.

### 5. Verses pressed in a round are still missing from the closing lists

- **What happened.** This is the order's own falsifier, tested by text search, and it fires on both sides.
  - **Challenger's list is missing** verses it pressed earlier:
    - Matthew 17:5;
    - Numbers 1:18;
    - Luke 1:5 and 1:36;
    - Luke 1:13 and 1:57-63;
    - Luke 2:43.
  - **Defender's list is missing** verses it pressed against the challenger:
    - Luke 1:31 and 1:60, on who names the child;
    - Deuteronomy 22:23-27, on the betrothed damsel;
    - Luke 2:33 and 2:49, against "Joseph called father".
- **Effect.** The order's definition of done ("each list shows every witness the other side pressed") is not met. The instruction improved coverage but did not make it complete.
- **Solution.** Do not rely on the debater to copy its own verses. Have the code build the list of every verse each side cited and served it back to that side in its closing round, already done for the opposing side's verses, with the instruction to place each one or state it was not pressed. A second instruction sentence will not get closer.

### 6. The challenger used the forbidden single-verse demand, and no judge caught it

- **What happened.** The challenger argued "A denial requires a stated exclusion", and in its last round that "a denial of the man must be stated where the text excludes him, and no row does". That is the demand the guard on the chain of proof forbids (DG-61, "No single verse is required"). The defender listed it as a premise. All three judges and the single judge graded the challenger's answer SUPPORTED.
- **Solution.** Add to the judges' rulebook that a premise which charges the stating-verse demand, and is answered by restating it, is not supported. One judge was flagged twice by the flow for the same fault in the other direction, so both sides are at risk.

### 7. The defender cited the Septuagint, and no judge flagged it

- **What happened.** The defender's first round rests "overshadow" on "Exodus 40:35 (LXX)". The record fences the Septuagint out of every claim. No judge mentioned it. The advisor raised this exact question on the board earlier tonight.
- **Solution.** Add one sentence to both debaters' rules and the judges' rules: a Septuagint reading is not footing, and a judge names it as a citation error.

### 8. Factual errors in the debaters' rounds that the synthesis credited or missed

- **Luke 24:49.** The challenger cites it as a row where "come upon" (*eperchomai*) is used. The verse's Greek has *endyō* ("endued"), measured in the source-word table. The synthesis counted it among "five rows exhibited".
- **Luke 2:43.** The challenger cites it for "Joseph and his mother marvelled". That verse says "Joseph and his mother knew not of it".
- **Deuteronomy 22:23 and 22:24.** The challenger joined phrases from the two verses under one reference. Every judge caught this.
- **"Before they came together".** The synthesis says "both sides read the clause as dating the finding". The defender read it as dating the conception.
- **A true figure marked unverified.** The diagnostic marks the challenger's "fifty rows" for *bethulah* as unverified. The table gives exactly 50 rows.
- **Grammar claim.** The challenger's Greek rule about *ou mē* with the aorist rests on no row in the record. The diagnostic flags it, and I agree.
- **Solution.** The flow's KJV quotation check already catches wrong wording. Extend it to check a claimed Greek or Hebrew word against the source-word table for the verse cited, so an error like the Luke 24:49 one is caught by the system and not left to a reader.

### 9. The served material was not what the advisor's note said

- **What happened.** The advisor's binding note, reporting your words in my partner's thread, said the served sights had changed at 20:52 CDT, and asked each read to compare them with run B. The challenger's served list in this run is identical to run B's, the same 27 labels in the same order. The defender was served nothing in either run.
- **Solution.** Confirm at the record what changed at 20:52 and why it did not reach this run's served list: either the change was to something the challenger's list does not show, or it did not take effect.

## Problems in how we three worked

These are my reading of this order, and I include my own part first.

1. **We three verified the same thing three times, and nobody tested what it would do.** My partner rebuilt my four files and matched the hashes. The advisor rebuilt two of them and matched again. I matched them myself. Every check proved the text landed. None could fail on the question that mattered: whether a model given this text would write a list the code could read. Problems 1 and 5 were invisible to all three of us. The tandem manual names this as the frame gap: two hands verifying the same frame do not test the frame.
2. **My own falsifiers missed it.** I wrote "counters downstream read numbered lines only; no unnumbered line is added". I checked what my text adds. I never checked what happens if a debater drops the numbers the old text already asked for.
3. **The rules grow faster than they are tested.** Tonight alone added a manual clause, a rewritten amendment rule and two node texts. Each was agreed in wording by all three and priced in characters. None was priced against a test that could fail.
4. **Corrections are slowing the work down.** About half of the board rows in this order record a crossing, a refused post, a wrong time or a self-correction. The record is honest, but the posts about the work now rival the work itself.

## What I recommend first

Fix problem 2, the stored outcome that contradicts the judges. It is the one that puts a false result in the record today: "DEFENDER PREVAILS" on a reading the record forbids. Problems 1 and 5 come next, because they decide whether this order met its goal.
