import difflib,hashlib
a=open('v175.txt',encoding='utf-8').read(); b=open('engine_manual_v176_draft.txt',encoding='utf-8').read()
A=a.split('\n'); B=b.split('\n')
sm=difflib.SequenceMatcher(None,A,B,autojunk=False)
pairs=[]
for tag,i1,i2,j1,j2 in sm.get_opcodes():
    if tag=='equal': continue
    # anchor with one preceding line
    i0=max(0,i1-1); old='\n'.join(A[i0:i2]); new='\n'.join(A[i0:i1]+B[j1:j2])
    if i2==i1: old=A[i0]; 
    assert a.count(old+'\n')==1 or a.count(old)==1, old[:100]
    pairs.append((old,new))
# verify replay
c=a
for o,n in pairs:
    assert c.count(o)==1,o[:80]; c=c.replace(o,n)
assert c==b, 'replay mismatch'
md5=hashlib.md5(b.encode()).hexdigest()
for o,n in pairs: assert '$q$' not in o and '$q$' not in n
sql=["SET LOCAL truth.session_id = 'session_01H1X3ANsGiMnhnbkfphocmo';",
"DO $do$ DECLARE c text; o text; BEGIN",
" IF (SELECT max(version) FROM engine_manual)<>175 THEN RAISE EXCEPTION 'max version not 175'; END IF;",
" SELECT content INTO c FROM engine_manual WHERE version=175;",
" IF md5(c)<>'2e322fd3fdfc85f7e1d043fe27206438' THEN RAISE EXCEPTION 'v175 md5 changed'; END IF;"]
for o,n in pairs:
    sql.append(" o:=$q$"+o+"$q$;")
    sql.append(" IF (length(c)-length(replace(c,o,'')))/length(o)<>1 THEN RAISE EXCEPTION 'anchor count %', left(o,60); END IF;")
    sql.append(" c:=replace(c,o,$q$"+n+"$q$);")
sql.append(" IF md5(c)<>'%s' THEN RAISE EXCEPTION 'md5 %%', md5(c); END IF;"%md5)
sql.append(" INSERT INTO engine_manual(version,content,summary) VALUES(176,c,'v176 = v175 + s210 to s218: spark as a debater; every reasoning setting removed (section 4 NO REASONING FIELD with the standing rule); ASKs 317, 318 (sight rows), 319 to 324 entries; live flow s218');")
sql.append(" INSERT INTO engine_manual_log(version,entry_date,title,content,char_len) VALUES(176,'2026-11-15','s210 to s218 and ASKs 317 to 324','Register: s210 7f5cdbc2 spark in Init Seats ENG (operator card \"Add spark to Init Seats\" 08:45Z); s211 123b7df7 hydrogen/spark effort-low removed (operator 02:53, 03:00, 03:03 CST: \"never touch reasoning. unless i instruct it\"); s212 6de39b6d pkgRDF (operator 06:57 CST: \"remove any reasoning adjustments from judges and debators.. they all should run ay default.\"); s213 dfcce94c ASK 319; s214 ca933142 ASK 320; s215 a3b24ed9 ASK 321; s216 2667bdb4 ASK 322; s217 fcab1ec1 ASK 323; s218 ffc2f775 ASK 324 (card taps 13:50Z to 13:58Z, W4 6843). Sights 519 and 266 summaries ASKs 317, 318 (06:44:47Z). Section 4 NO REASONING FIELD replaced whole with the standing rule (source operator 03:03 CST 11-15). Reads: W2 (non-writer).',length(c));")
sql.append("END $do$;")
sql.append("SELECT version, length(content) len, md5(content) m FROM engine_manual WHERE version>=175 ORDER BY version;")
open('ins176.sql','w',encoding='utf-8').write('\n'.join(sql)+'\n')
print(len(pairs), md5, len(b), sum(len(x) for x in sql))
