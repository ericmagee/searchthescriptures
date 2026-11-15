import difflib,hashlib
a=open('v176.txt',encoding='utf-8').read(); b=open('engine_manual_v177_draft.txt',encoding='utf-8').read()
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
" IF (SELECT max(version) FROM engine_manual)<>176 THEN RAISE EXCEPTION 'max version not 176'; END IF;",
" SELECT content INTO c FROM engine_manual WHERE version=176;",
" IF md5(c)<>'8fe1cc3950b4a668630b4d3e8d2f2017' THEN RAISE EXCEPTION 'v176 md5 changed'; END IF;"]
for o,n in pairs:
    sql.append(" o:=$q$"+o+"$q$;")
    sql.append(" IF (length(c)-length(replace(c,o,'')))/length(o)<>1 THEN RAISE EXCEPTION 'anchor count %', left(o,60); END IF;")
    sql.append(" c:=replace(c,o,$q$"+n+"$q$);")
sql.append(" IF md5(c)<>'%s' THEN RAISE EXCEPTION 'md5 %%', md5(c); END IF;"%md5)
sql.append(" INSERT INTO engine_manual(version,content,summary) VALUES(177,c,'v177 = v176 + s219 to s227: ASKs 325, 327 to 331, 333 to 337, 341, 342 entries; rulings 460, 461 and the own-language [L2] ruling; ASK 323 part 1 correction; live flow s227');")
sql.append(" INSERT INTO engine_manual_log(version,entry_date,title,content,char_len) VALUES(177,'2026-11-15','s219 to s227 and ASKs 325 to 342','Register: s219 5d26ce38 ASKs 325, 330, 331 (operator card Write all three 15:51:54Z); s220 b799dd0b ASK 328 (15:52:17Z); ASK 327 view (database only); s221 67e89720 ASK 329 (16:06Z); s222 3a290d4c ASKs 333, 335 (17:56:42Z); s223 e7cde216 ASK 334 rev 2 (18:06:01Z); s224 985572ac ASK 336 rev 2 (18:11:27Z); s225 657d2953 ASK 337 (18:17:44Z); s226 defaa968 ASK 341 (18:30:20Z); s227 d23c65ca ASK 342 with condition e (19:07:49Z). Rulings 460 and 461 (operator 14:56:43Z); own-language [L2] ruling (operator 09:17, 09:39 CST). Reads: W1 (non-writer).',length(c));")
sql.append("END $do$;")
sql.append("SELECT version, length(content) len, md5(content) m FROM engine_manual WHERE version>=176 ORDER BY version;")
open('ins177.sql','w',encoding='utf-8').write('\n'.join(sql)+'\n')
print(len(pairs), md5, len(b), sum(len(x) for x in sql))
