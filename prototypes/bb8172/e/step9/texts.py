# Ruled texts, each md5-checked against its board row (BB-8211, 8213/8219 (i), 8219 (iii), 8266).
C3 = "A charge is stronger than its quote only when it asserts what the quote does not: a negation, a universal (all, none, only, never), or a claim the quote's own words do not make. Dropping, reordering or paraphrasing the quote's words is not stronger. A limb the link round narrows counts in its narrowed form."
QR = "A premise's quote is checked against every earlier round of the opponent; it is verbatim if found in any of them, and the judge names that round."
SV = "A witness contradicts a link only when its own words state the contrary; a verb that leaves the point unnarrated does not, for either side. This tests a pressed witness, not a chained premise, which is judged by its footing (DG-61)."
CL = "When the witnesses pressed against a link are the pressing side's own chain read together, the collision weighs chain against chain by footing, never verse by verse; that no one of them states the contrary in its own words is the stating-verse test DG-61 retires, at a judge's seat as at a debater's, for either side."
WANT = {'C3':'8f3c403a328ecea8ccf938607d5f8d21','QR':'95ae5068776d7c75c77e8de06986d65b','SV':'12789710f1b148574e91dc8b2532ad90','CL':'26542745607cec81f59691a8516d3d62'}
if __name__=='__main__':
    import hashlib
    for k,v in WANT.items():
        m=hashlib.md5(globals()[k].encode()).hexdigest(); print(k,m,m==v)
