# Step 1 of the definition work: the six sample inputs, version 2.
# Changes from s5/in (all three, applied identically to each file):
#  (a) the line "Answer from the text given in this message only. Use no tools." -> "Answer from the text given in this message only."
#  (b) the approved CHAIN definition (WALL-1962, rulings 342) inserted before the RULE block
#  (c) the reply form expanded with feedback fields
import sys
DEF = ('DEFINITION THE JUDGE WORKS UNDER:\n'
 'CHAIN (Isaiah 28:10: "For precept [must be] upon precept, precept upon precept; line upon line, line upon line; here a little, [and] there a little"): '
 'a case built from many verses, in which each LINK is one step resting on the verses beneath it and on the links before it. '
 'Whether a single verse states a link is never the deciding test, for or against.\n\n')
OLD_ANS = 'Answer from the text given in this message only. Use no tools.\n'
NEW_ANS = 'Answer from the text given in this message only.\n'
UNITS = ['K2__K-G4','K3a__K-C','K3b__K-C','K4__K-G4','C_0ff61f2c__K-S2','C_25eae673__K-S2']
for u in UNITS:
    t = open(f's5/in/{u}.txt').read()
    rule = u.split('__')[1]
    assert t.count(OLD_ANS)==1 and t.count('\nRULE ')==1 and t.count('Reply with exactly one JSON object')==1
    t = t.replace(OLD_ANS, NEW_ANS)
    t = t.replace('\nRULE ', '\n'+DEF+'RULE ', 1)
    head, _ = t.split('Reply with exactly one JSON object', 1)
    reply = ('Reply with exactly one JSON object and nothing else. Inside text values use single quotes, never double quotes:\n'
     '{"rule": "%s", "applies": "yes" or "no" or "unclear", "applies_why": "<one sentence: does this judge text do the thing the rule governs?>", '
     '"verdict": "BREACH" or "CLEAN", "quote": "<the judge\'s words that decide your verdict, copied exactly from JUDGE TEXT TO CHECK>", '
     '"rule_words": "<the words of the rule or the definition you relied on, copied exactly>", '
     '"room": "<the phrase of the rule or the definition you had to interpret, and the two readings you weighed; or none>", '
     '"why": "<one sentence>"}\n'
     'BREACH means the judge text does what the rule forbids, or leaves undone what the rule requires of it. CLEAN means it obeys the rule, or the rule does not apply to this text.\n') % rule
    open(f'd1/in/{u}.txt','w').write(head + reply)
