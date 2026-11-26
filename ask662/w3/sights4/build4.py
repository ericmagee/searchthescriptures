import hashlib, json
SRC='/mnt/project-files/ask662/w3/'
OUT=SRC+'sights4/'
def body(fn, start, end):
    t=open(SRC+fn).read()
    a=t.index(start); b=t.index(end)
    return t[a:b].rstrip()+'\n', t
def rep(s, old, new, n=1):
    assert s.count(old)==n, (old, s.count(old))
    return s.replace(old,new)
INTRO="Rows first (kjv_verses, kjv_word_map, original_words, lexicon_words, pulled live 2026-11-25). Marks: [L1] the verse's own words; [L2] the word under them, at a verse in its own language; [L3] another passage set beside; [L4] a reading. "
S={}
# 1 born of the Spirit
b,_=body('born_of_the_spirit_reading_v2.md','WHAT THE RECORD ALREADY HOLDS','NOT DONE.')
b=rep(b,'WHAT THE RECORD ALREADY HOLDS (read before writing).','WHAT THE RECORD ALREADY HOLDS.')
b=rep(b,' No sight\'s summary names Galatians 4:29 or "born after the Spirit" (search of kb_sights.summary: 0 rows).','')
b=rep(b,'(The sight draft part (4) already holds Job 31:15 and Job 33:4 to the same end.)','(Sight 1824 part (4) already holds Job 31:15 and Job 33:4 to the same end.)')
b=rep(b,'MY READING, EACH LINE MARKED.','THE READING, EACH LINE MARKED.')
S[1]=dict(title='Born of the Spirit: Matthew 1:20 and John 3:6 Are One Greek Construction; Isaac Born After the Spirit, His Father Named',
 intro=INTRO+'The verses that set the Spirit beside birth, begetting and the womb (the open part (14) of Sight 1824).\n',
 summary=b, layer='L1-L2-L3',
 topic='The verses that set the Spirit beside birth, begetting and the womb: gennao with ek and pneuma at Matthew 1:20 and John 3:5-8; Isaac "born after the Spirit" (Galatians 4:29); Malachi 2:15 "seed of God"; Ecclesiastes 11:5; born again by the word.',
 passage='Matthew 1:20; John 3:5-8; John 1:12-13; 1 John 5:1; Galatians 4:22-29; Genesis 21:2; Romans 4:19; Malachi 2:14-15; Ecclesiastes 11:5; 1 Peter 1:23; James 1:18',
 area='S1824 part (14); S1822 and DG-8 (Matthew 1:18-20); DG-18 (Son of God); S1583; S1285 (Galatians 4); S1169 (John 1); S1828 (gennao, every row)',
 limits='The remaining ruach and pneuma rows of the counts in Sight 1824 part (2) were not read. Sights 1285 and 1169 were found by title and searched for the strings named, not read whole. No sight summary named Galatians 4:29 or "born after the Spirit" before this filing (0 rows).',
 graded='ask662/w3/born_of_the_spirit_reading_v2.md md5 64598dc0, W1 PASS Wall 12332')
# 2 promised sons
b,_=body('promised_sons_reading_v2.md','HOW THE ROWS WERE FOUND.','NOT DONE.')
b=rep(b,' This reading does not re-lay either. No sight\'s title or summary names Luke 1:37 (0 rows).',' This sight does not re-lay either.')
b=rep(b,'this reading does not say they are one child.','this sight does not say they are one child.')
b=rep(b,'and shall call his name Immanuel." In the next chapter:','and shall call his name Immanuel." The Hebrew word there is almah (H5959), and Matthew 1:23 reads parthenos (G3933); Sight 24 and DG-57 hold the word. In the next chapter:')
b=rep(b,'MY READING, EACH LINE MARKED.','THE READING, EACH LINE MARKED.')
b=rep(b,'this file adds nothing there.','this sight adds nothing there.')
S[2]=dict(title='The Promised Sons: Eight Sons Announced Before Conception, and Samuel Asked For; the Angel\'s "Also" at Luke 1:36',
 intro="Rows first (kjv_verses, pulled live 2026-11-25; kjv_word_map at Isaiah 7:14 and Matthew 1:23). Marks: [L1] the verse's own words; [L2] the word under them, at a verse in its own language; [L3] another passage set beside; [L4] a reading. The sons announced before they were conceived.\n",
 summary=b, layer='L1-L2-L3',
 topic='The sons announced before they were conceived: Isaac, Samson, the Shunammite\'s son, Samuel, Solomon, Josiah, Immanuel, John, Jesus; for each, the announcing, whether the act is told, and the father the rows name; the angel\'s own parallel of Elisabeth and Mary (Luke 1:36-37).',
 passage='Genesis 17:19; Genesis 18:14; Genesis 21:1-3; Judges 13:2-25; 2 Kings 4:14-18; 1 Samuel 1:11-19; 1 Chronicles 22:9; 1 Kings 13:2; Isaiah 7:14-16; Isaiah 8:3-4; Luke 1:13-37; Matthew 1:20-21',
 area='S1822 and DG-8 (the conception rows; the father question); S32; DG-57 and S24 (Isaiah 7:14); S1824; S1825 (Isaac born after the Spirit)',
 limits='R1 is a count of nine found by one phrase search; other announced sons under other wording were not searched for. Rebekah (Genesis 25:21) and Rachel (Genesis 30:22-23) were pulled and not worked in. Sights 1822, 32, 1578 were read at the lines named, not whole. Word tags were pulled at Isaiah 7:14 and Matthew 1:23 only; the [L3] lines are joins of passages. No sight title or summary named Luke 1:37 before this filing (0 rows).',
 graded='ask662/w3/promised_sons_reading_v2.md md5 2ca7faa2, W1 PASS Wall 12347')
# 3 anointing
b,_=body('anointing_reading_v2.md','WHAT THE RECORD ALREADY HOLDS.','NOT DONE.')
b=rep(b,'MY READING, EACH LINE MARKED.','THE READING, EACH LINE MARKED.')
b=rep(b,'This is the operator\'s statement of 19:55 CST 2026-11-17, recorded verbatim at Wall 8003 ("\'that which is conceived in her is of the Holy Ghost.\' translation: the child in her is anointed") and DG-8\'s "anointing marker"; the rows above are the passages it stands on.',
        'This is the reading recorded at Wall 8003 (19:55 CST 2026-11-17: "\'that which is conceived in her is of the Holy Ghost.\' translation: the child in her is anointed") and DG-8\'s "anointing marker"; the rows above are the passages it stands on.')
b=rep(b,'Both sets are rows; this reading does not choose a day.','Both sets are rows; this sight does not choose a day.')
S[3]=dict(title='Christ Means Anointed: the Anointing and the Spirit of the LORD; Saul, David, the Branch of Jesse; Christ at His Birth',
 intro=INTRO+'The anointing and the Spirit.\n',
 summary=b, layer='L1-L2-L3',
 topic='The anointing and the Spirit: mashach, mashiach, chrio, Christos, chrisma, Messias; the verses that hold an anoint word and ruach or pneuma together; Saul and David anointed and the Spirit coming; Isaiah 11:1-4; the anointed king called Son; Christ at his birth; the anointing in the people.',
 passage='1 Samuel 10:1-10; 1 Samuel 16:1-14; 2 Samuel 23:1-2; Isaiah 11:1-4; Isaiah 61:1; Luke 4:18; Acts 10:38; Acts 4:26-27; Psalms 2:2-7; Psalms 89:20-36; Luke 2:11; Luke 2:26; John 1:41; 2 Corinthians 1:21-22; 1 John 2:27; Lamentations 4:20',
 area='S1824 part (11); DG-8 (anointing marker); DG-18 (Son of God, Psalm 2:7); S8; S465 (Lamentations 4); S1288 (1 John 2, chrisma); S1783 (Isaiah 45:1); S1583',
 limits='The 69 mashach and 39 mashiach rows were not all read; the priests\' anointing (Exodus, Leviticus) was not read at all. Psalms 45:7 and Hebrews 1:9 were pulled and not worked in. Sights 465, 1288, 1783 were not read whole.',
 graded='ask662/w3/anointing_reading_v2.md md5 3001ea30, W1 PASS Wall 12354')
# 4 gennao
b,_=body('gennao_reading_v2.md','WHAT THE RECORD ALREADY HOLDS.','NOT DONE.')
b=rep(b,'This reading does not re-lay them; it reads the whole word.','This sight does not re-lay them; it reads the whole word.')
b=rep(b,' (W1, Wall 12356; entered as item 6 of ask663/w3/word_tag_defects.md)','')
b=rep(b,'(my sorting; the verses are named so it can be checked)','(a sorting; the verses are named so it can be checked)')
b=rep(b,'MY READING, EACH LINE MARKED.','THE READING, EACH LINE MARKED.')
b=rep(b,'The operator\'s words of 20:00 CST 2026-11-17 in W3\'s thread stand over this: "keep in mind context and comprehension ... not word couting" (recorded in project memory, file kjv-1611-only). My application of it: the passage is read whole, and a preposition supports a reading and does not decide it.',
        'The record\'s method stands over this: context and comprehension, not word counting (thread ruling of 20:00 CST 2026-11-17). Applied here [L4]: the passage is read whole, and a preposition supports a reading and does not decide it.')
b=rep(b,'is not a gennao row and is not read here.','is not a gennao row and is not read here.')
S[4]=dict(title='Gennao (G1080), Every Row: Begat, Born, Conceived Are One Greek Verb; Born of God Is Said of Persons Already Born',
 intro=INTRO+'Gennao (G1080), every row.\n',
 summary=b, layer='L1-L2-L3',
 topic='Gennao (G1080) read at every row: the 65 verses sorted by what the verb is said of; Matthew 1 begat, was born, conceived as one verb; Luke 1:13 and 1:35; born of God and of the Spirit said of those who believe; Paul begetting by the gospel; Psalm 2:7 at Acts 13:33.',
 passage='Matthew 1:2-20; Luke 1:13; Luke 1:35; John 1:12-13; John 3:3-8; John 8:39-41; 1 John 3:9; 1 John 5:1; 1 Corinthians 4:15; Philemon 1:10; Acts 13:33; Hebrews 1:5; Hebrews 5:5; Galatians 4:23-29',
 area='S1583 (begotten; Psalm 2:7); S1578 (Matthew 1:16); S1169 (John 1:13); S1822 and DG-8 (Matthew 1:18-20); DG-18; S1824; S1825 (born of the Spirit)',
 limits='The noun and kindred words (gennesis G1083, genesis G1078, gennema, anagennao G313, monogenes G3439) were not read. The Hebrew yalad was not read. Matthew 1:2-15 was read for the verb only. Known word-tag defect: 2 Peter 2:12 is tagged G1080 in kjv_word_map and is G1096 in original_words (ask663/w3/word_tag_defects.md item 6).',
 graded='ask662/w3/gennao_reading_v2.md md5 8f08546e, W1 PASS Wall 12358')
out={}
for k,d in S.items():
    assert len(d['title'])<=120,(k,len(d['title']))
    d['summary']=d['intro']+d['summary'].rstrip()
    for bad in ['operator','Eric','W3','W1','this file','This reading','this reading','MY READING','my sorting']:
        assert bad not in d['summary'],(k,bad)
    d['notes']=("DUP-REVIEWED 2026-11-26 (seat 33, session_01H1X3ANsGiMnhnbkfphocmo). Distinct from Sights 1822, 1824, 1583 and DG-8, which it names and does not re-lay. Lines marked [L4] are readings. Text taken from the graded reading ("+d['graded']+") with its header, NOT DONE and CHECK lines moved here. LIMITS: "+d['limits']+" Filed on the instruction of 00:07 CST 2026-11-26 in the seat 33 thread.")
    fn=OUT+'sight_draft_%d.md'%k
    txt="TITLE: %s\nLAYER_STATUS: %s\nSTATUS: SUBSTANTIALLY_SUPPORTED\nTOPIC: %s\nPRIMARY_PASSAGE: %s\nFRAMEWORK_AREA: %s\nNOTES: %s\n\nSUMMARY:\n%s\n"%(d['title'],d['layer'],d['topic'],d['passage'],d['area'],d['notes'],d['summary'])
    open(fn,'w').write(txt)
    out[k]=dict(title_len=len(d['title']),summary_len=len(d['summary']),summary_md5=hashlib.md5(d['summary'].encode()).hexdigest(),file_md5=hashlib.md5(txt.encode()).hexdigest())
json.dump(S,open('sights4.json','w'))
print(json.dumps(out,indent=1))
