# BB-6904 / 7223 A-C: remove the GUARD-INADMISSIBLE block and the two sentences that name it, from the two judge nodes.
import sys,hashlib
BLK_MD5='f61b8aed'
def patch(s):
    i=s.index('GUARD-INADMISSIBLE: the text');blk=s[i:i+2204]
    assert hashlib.md5(blk.encode()).hexdigest().startswith(BLK_MD5)
    old='+NL+NL+"'+blk+'"'          # A: block with its joining glue
    assert s.count(old)==1;s=s.replace(old,'')
    B='A defender link that the GUARD-INADMISSIBLE block orders graded unexhibited counts as WITHDRAWN. '
    assert s.count(B)==1;s=s.replace(B,'')
    C=('WITHDRAWN if it is withdrawn or conceded, or if the GUARD-INADMISSIBLE block orders it graded unexhibited; BROKEN if it is graded DEFENDER LINK BROKEN at a collision; STANDS otherwise.',
       'WITHDRAWN if it is withdrawn or conceded; BROKEN if it is graded DEFENDER LINK BROKEN at a collision; STANDS otherwise.')
    assert s.count(C[0])==1;s=s.replace(*C)
    return s

# E (7229): Format Markdown's reader section: drop the who-belongs bullet; three rules remain (UNEXHIBITED, VOID, KEYSTONE).
def patch_fm(s):
    i=s.index("- **Who-belongs verdicts.**");j=s.index("- **UNEXHIBITED.**",i)
    old=s[i:j];assert s.count(old)==1;s=s.replace(old,'')
    o2="The judges' rulebook adds four rules, quoted here in its own words.";assert s.count(o2)==1
    return s.replace(o2,"The judges' rulebook adds three rules, quoted here in its own words.")
