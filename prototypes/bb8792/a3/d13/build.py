# Definition run d9: fresh inputs, built from the original s5 inputs with every change approved through d8,
# plus the KJV capitals line, d10-d11 changes and the approved contrary-verse line.
OLD_ANS='Answer from the text given in this message only. Use no tools.\n'
NEW_ANS=('Answer from the text given in this message only.\n'
 'Judge only the reasons the judge wrote. Do not guess at a reason it did not write.\n')
DEF=('DEFINITION THE JUDGE WORKS UNDER:\n'
 'CHAIN (Isaiah 28:10: "For precept [must be] upon precept, precept upon precept; line upon line, line upon line; here a little, [and] there a little"): '
 'an argument built from many verses. Each LINK is one step, standing on its verses and on the steps before it. '
 'A link is judged by its support, never by whether any verse, or the chain as a whole, states it word for word; '
 'and a verse whose words leave the question open decides nothing by itself.\n'
 'A verse whose own words state the contrary is weighed with the chains. It does not decide alone.\n'
 'In the KJV, capitals mark who is meant: father and Father, god and God and GOD, lord and Lord and LORD are different words. '
 'A judge may not treat them as one word or as balancing each other.\n\n')
S2='That a single verse does not state a link or its contrary is never a ground for STANDS or UNDERDETERMINED, for either side.'
S2_ADD=' A verse that carries two senses at once is not open. Both senses stand.'
G4="A verse on a side's 'cited in' line counts as an unanswered witness only when the judge quotes the sentence of the earlier round that pressed it against that link or a listed premise and names that round; a verse cited there but not pressed against the link does not count."
G4_ADD=' A verse the judge counts toward a broken link is counted this way. A verse the judge says was answered is not counted.'
UNITS=[l.split('\t')[0]+'__'+l.split('\t')[1] for l in open('d13/labels.tsv').read().splitlines()]
for u in UNITS:
    t=open(f's5/in/{u}.txt').read(); rule=u.split('__')[1]
    assert t.count(OLD_ANS)==1 and t.count('\nRULE ')==1 and t.count('Reply with exactly one JSON object')==1, u
    t=t.replace(OLD_ANS,NEW_ANS).replace('\nRULE ','\n'+DEF+'RULE ',1)
    if rule=='K-S2': assert t.count(S2)==1; t=t.replace(S2,S2+S2_ADD)
    if rule=='K-G4': assert t.count(G4)==1; t=t.replace(G4,G4+G4_ADD)
    head,_=t.split('Reply with exactly one JSON object',1)
    reply=('Reply with exactly one JSON object and nothing else. Escape any double quote inside a value with a backslash.\n'
     '{"rule": "%s", "applies": "yes" or "no" or "unclear", "applies_why": "<one sentence: does this judge text do the thing the rule governs?>", '
     '"verdict": "BREACH" or "CLEAN", "quote": "<the judge\'s words that decide your verdict, copied exactly from JUDGE TEXT TO CHECK>", '
     '"rule_words": "<the words of the rule or the definition you relied on, copied exactly>", '
     '"room": "<the phrase of the rule or the definition you had to interpret, and the two readings you weighed; or none>", '
     '"why": "<one sentence>"}\n'
     'BREACH means the judge text does what the rule forbids, or leaves undone what the rule requires of it. CLEAN means it obeys the rule, or the rule does not apply to this text.\n')%rule
    open(f'd13/in/{u}.txt','w').write(head+reply)
print('built',len(UNITS))
