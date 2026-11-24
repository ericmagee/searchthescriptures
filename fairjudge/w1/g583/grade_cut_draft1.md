# W1 grade: ASK 583 step 6.5, the cut, draft 1 (W3)

GRADE: PASS WITH CONDITIONS K1 and K2. Graded: cut583.sql 8d54dbb1, section0_pairs.json 73bcac7a, section0_part_new.txt b5bdbeee (W3 commit 9a5a7321).
RULES READ: plan 2c 6.5, C1, C1b, C2; engine manual section 0 (no provenance in the body); migration583.sql 4e7becd4 (part_apply returns errors as jsonb and does not raise); ruling 506; the scope rule.
OBJECTIVE MET: yes, with the conditions. The 31 parts join back to v241, and section 0 names the new read and write calls.

## Checks I ran
1. Offsets (Python over cut583.sql): 31 rows, contiguous from 1 to 707,670 with no gap or overlap, largest 39,934. Names and order_index values ascend together. The lengths equal split583_on_v241.out (for example 09.0 38,944; 09.5 39,934; 17.1 20,347).
2. Section 0 replay in SQL against stored v241, written independently of W3's generator:
   - base substr(1231, 2204) has md5 9e331d82 (the same as the cut's base md5);
   - each of the five pairs occurs exactly once;
   - the result is b5bdbeee, 2,984 characters (equal to the cut's expectation and to section0_part_new.txt);
   - the whole manual is then b725565c, 708,450 (C1b, equal to W3's figure).
3. The pairs in cut583.sql are byte-equal to section0_pairs.json.
4. engine_manual.id has no default (max id 247), so the explicit max(id)+1 for the pointer row is needed.

## Conditions
K1. Section 0 still says "the readback is mrb.cjs (ASK 420(b))". After the cut, mrb.cjs without its fourth argument reads engine_manual, where the newest row is the pointer, so a writer who follows section 0 gets a MISMATCH. Add one pair: the readback is mrb.cjs with the part as its fourth argument (node mrb.cjs <base> <new> <pairs.json> <part>). This is a write-method line, so it is in scope.
K2. engine_manual_part_apply reports a refusal as jsonb {success:false} and does not raise. Run as written, a refused section 0 pair would leave the cut committed with the old section 0, which tells writers to use engine_manual_apply. Wrap the call in a DO block that raises unless success is true, so the cut and section 0 land together or not at all (plan 6.5, one transaction; ruling 506).

## Notes
N1. Section 0 keeps older provenance that this ASK does not touch ("(ASK 477)", "since ASK 477", "(ASK 420(b))" unless K1 replaces it). That is outside this cut's scope and is left for a later section 0 item.
N2. Item 5 (truth.card time form): I read it the same way. The sentence says 'Z' and the order since 03:06 CST is Central. Changing it is a manual change, so bring it to the operator as its own numbered line on the card and keep it out of the cut's pairs.
N3. Run order agreed: 6.3 write, then my readback, then 6.4, then your rolled-back run with the md5s posted, then your card.
