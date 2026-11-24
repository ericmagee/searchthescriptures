# ASK 583 step 6.5: generates cut583.sql (the cut, for W3's card) and preview583.sql (migration + cut in one rolled-back transaction).
# Only offsets, names and titles come from here; every part's text is taken in SQL from the stored row by substr().
import sys,re,hashlib,json
sys.path.insert(0,'/mnt/project-files/manual1123/w3/a583')
from split583 import split
SRC=sys.argv[1]; EXPECT=sys.argv[2] if len(sys.argv)>2 else None   # EXPECT: "md5,len" of part 00.1 after the section 0 pairs
c=open(SRC,encoding='utf-8').read(); assert hashlib.md5(c.encode()).hexdigest()=='d0e9efda3280624ce987050bc9568197' and len(c)==707670
parts=split(c); assert ''.join(parts)==c and len(parts)==31
rows=[];sec='00';k=0;names=[];pos=1;head={}
for p in parts:
    m=re.match(r'\n?## (\d+)\. ([^\n]*)',p)
    if m:
        ns='%02d'%int(m.group(1)); k=k+1 if (ns==sec and names) else 0; sec=ns; head[sec]=m.group(1)+'. '+m.group(2).strip()
    else: k=k+1 if names else 0
    names.append('%s.%d'%(sec,k)); rows.append([names[-1],pos,len(p),sec]); pos+=len(p)
assert pos-1==len(c)
cnt={}
for r in rows: cnt[r[3]]=cnt.get(r[3],0)+1
seen={}
vals=[]
for i,(nm,s,n,sec) in enumerate(rows):
    if nm=='00.0': t='Preamble (title and notice before section 0)'
    else:
        t=head[sec]
        if sec!='00' and cnt[sec]>1:
            seen[sec]=seen.get(sec,0)+1; t+=' (part %d of %d)'%(seen[sec],cnt[sec])
    vals.append("('%s',%d,'%s',%d,%d)"%(nm,(i+1)*100,t.replace("'","''"),s,n))
sec0=parts[1]; md5_001=hashlib.md5(sec0.encode()).hexdigest()
B1="- The active version is `SELECT max(version) FROM engine_manual`. `SELECT engine_manual_toc()` gives the live map. The revision history is `engine_manual_log`."
N1="- The manual is held in parts: table `engine_manual_parts`, one row per part per version of that part. `SELECT engine_manual_toc()` lists the parts. `SELECT engine_manual_part('<part>')` gives one part; `SELECT * FROM engine_manual_full()` gives the whole text and its version. The manual's version is the highest part version. The revision history is `engine_manual_log`; its column `part` names the part a version changed. The parts are read in the order `engine_manual_toc()` gives. The table `engine_manual` holds the whole-text versions up to the cut and is not written again."
L="Limit: an old text that overlaps itself is counted once.\n"
NB="- New text enters only through engine_manual_part_apply on an existing part. A part that has grown is divided in two with engine_manual_part_split, at a text that occurs once in it, with no change of text; no part and no size is refused.\n"
pairs=[{'old':B1,'new':N1},
 {'old':"To revise: call engine_manual_apply (ASK 421) in the same batch as",'new':"To revise: call engine_manual_part_apply on the one part (engine_manual_apply refuses now that the manual is in parts) in the same batch as"},
 {'old':"it refuses unless the base is the max version and has the given md5",'new':"it refuses unless the base is that part's latest version and has the given md5"},
 {'old':"it inserts version+1 with its summary",'new':"it inserts that part at the manual's highest version + 1 with its summary"},
 {'old':"the readback is mrb.cjs (ASK 420(b))",'new':"the readback is mrb.cjs with the part as its fourth argument, node mrb.cjs <base> <new> <pairs.json> <part> (ASK 420(b))"},
 {'old':L,'new':L+NB}]
t=sec0
for p in pairs: assert t.count(p['old'])==1,p['old'][:30]; t=t.replace(p['old'],p['new'])
new_md5=hashlib.md5(t.encode()).hexdigest(); new_len=len(t)
full_new=parts[0]+t+''.join(parts[2:]); full_md5=hashlib.md5(full_new.encode()).hexdigest()
json.dump(pairs,open('section0_pairs.json','w'),ensure_ascii=False,indent=1)
open('section0_part_new.txt','w',encoding='utf-8').write(t)
def q(s): return "$q$"+s+"$q$"
POINTER="# TRUTH engine manual: held in parts\n- The engine manual is held in parts since this version. This row is a pointer, not the manual.\n- The list of parts: SELECT engine_manual_toc();\n- One part: SELECT engine_manual_part('<part>');\n- The whole text and its version: SELECT * FROM engine_manual_full();\n"
SESS="SET LOCAL truth.session_id='session_01H1X3ANsGiMnhnbkfphocmo';\nSET LOCAL truth.card='@@CARD@@';\n"
cut=SESS+"""DO $cut$
DECLARE c text; v int; f record; n int; mx int; lg text;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('engine_manual_version'));
  SELECT version, content INTO v, c FROM engine_manual ORDER BY version DESC, id DESC LIMIT 1;
  IF v <> 241 OR md5(c) <> 'd0e9efda3280624ce987050bc9568197' OR length(c) <> 707670 THEN
    RAISE EXCEPTION 'cut583: the base is not version 241 d0e9efda (found v% %)', v, md5(c); END IF;
  IF EXISTS (SELECT 1 FROM engine_manual_parts) THEN RAISE EXCEPTION 'cut583: engine_manual_parts already holds rows'; END IF;
  INSERT INTO engine_manual_parts (part, order_index, title, version, content, summary)
    SELECT x.part, x.oi, x.title, v + 1, substr(c, x.s, x.n), 'ASK 583 cut: this part is characters ' || x.s || ' to ' || (x.s + x.n - 1) || ' of engine_manual version 241, unchanged.'
    FROM (VALUES
"""+",\n".join(vals)+"""
    ) AS x(part, oi, title, s, n) ORDER BY x.oi;
  -- C1: lossless, before any change of text
  SELECT * INTO f FROM engine_manual_full();
  IF md5(f.content) <> 'd0e9efda3280624ce987050bc9568197' OR length(f.content) <> 707670 OR f.version <> v + 1 THEN
    RAISE EXCEPTION 'cut583 C1 FAILED: joined parts give % length % version %', md5(f.content), length(f.content), f.version; END IF;
  -- C2 (first cut only; not a standing limit) and the count
  SELECT count(*), max(length(content)) INTO n, mx FROM engine_manual_parts;
  IF n <> 31 OR mx > 40000 THEN RAISE EXCEPTION 'cut583 C2 FAILED: % parts, largest %', n, mx; END IF;
  -- the pointer row and the log row of the cut
  INSERT INTO engine_manual (id, version, content, summary)
    VALUES ((SELECT max(id) + 1 FROM engine_manual), v + 1, """+q(POINTER)+""", 'ASK 583: the engine manual is held in parts (engine_manual_parts) from this version; this row is a pointer. No text of the manual changed at the cut.');
  SELECT string_agg(part || ' | order ' || order_index || ' | ' || title || ' | ' || length(content) || ' | ' || md5(content), E'\\n' ORDER BY order_index) INTO lg FROM engine_manual_parts;
  INSERT INTO engine_manual_log (version, entry_date, title, content, char_len, part)
    VALUES (v + 1, (now() at time zone 'America/Chicago')::date, 'ASK 583: the engine manual cut into 31 parts',
      'Writer W3 (seat 33). Card: ' || coalesce(current_setting('truth.card', true), 'NONE') || E'\\nBase: engine_manual version 241, md5 d0e9efda3280624ce987050bc9568197, 707,670 characters. The 31 parts joined in order give that md5 and length (checked inside the write). No text changed. Plan manual1123/w3/a583/ASK583_plan.md draft 2c d0c99b47 (W1 PASS Wall 11224); operator approval for build 20:50 CST 2026-11-23; ruling 20:52 CST: no cap on size. The engine_manual row of this version is a pointer.\\npart | order_index | title | characters | md5\\n' || lg,
      707670, NULL);
END $cut$;
"""
apply_args="'00.1', 242, '%s', %s::jsonb, %s, %s, 'ASK 583: section 0 names the parts and their read and write calls', 'Section 0: the manual is held in parts; read calls engine_manual_toc, engine_manual_part, engine_manual_full; revise with engine_manual_part_apply; divide a grown part with engine_manual_part_split. No other section changed.', %s, %s"
LOG="Writer W3 (seat 33). Part 00.1 (section 0), base version 242 md5 "+md5_001+". Six pairs (manual1123/w3/a583/cut/section0_pairs.json): bullet 1 replaced; three phrases of the To revise bullet; one bullet added after it. Wording approved text: section0_new_text.md 09babd38 (W1 PASS Wall 11224). Result md5 "+new_md5+", "+str(new_len)+" characters; the whole manual then has md5 "+full_md5+", "+str(len(full_new))+" characters."
cut+="DO $s0$\nDECLARE r jsonb;\nBEGIN\n  r := engine_manual_part_apply("+apply_args%(md5_001,q(json.dumps(pairs,ensure_ascii=False)),"'"+new_md5+"'",new_len,q(LOG),'true')+");\n  IF (r->>'success') IS DISTINCT FROM 'true' OR (r->>'written') IS DISTINCT FROM 'true' OR (r->>'version')::int <> 243 THEN\n    RAISE EXCEPTION 'cut583 section 0 write FAILED, the whole cut is rolled back: %', r::text; END IF;\n  IF (SELECT md5(f.content) FROM engine_manual_full() f) <> '"+full_md5+"' THEN\n    RAISE EXCEPTION 'cut583 C1b FAILED: the whole manual is not "+full_md5+"'; END IF;\nEND $s0$;\nSELECT version, md5(content) AS md5, length(content) AS length FROM engine_manual_full();\n"
open('cut583.sql','w',encoding='utf-8').write(cut)
mig=open('/mnt/project-files/ask583/w4/build/migration583.sql',encoding='utf-8').read()
body=cut.replace(SESS,'').replace('AS section0_write;','INTO r0;').replace('SELECT engine_manual_part_apply','PERFORM 1; SELECT engine_manual_part_apply')
# preview: BEGIN; migration; cut; checks; RAISE (rolled back)
cutdo=cut.replace(SESS,'').split("DO $s0$")[0]
prev="BEGIN;\n"+SESS.replace('@@CARD@@','PREVIEW 583 (rolled back) W3')+mig+"\n"+cutdo+"""DO $chk$
DECLARE r0 jsonb; f record; same int; toc text; ap jsonb; ptr text;
BEGIN
  r0 := engine_manual_part_apply("""+apply_args%(md5_001,q(json.dumps(pairs,ensure_ascii=False)),"'"+new_md5+"'",new_len,q(LOG),'true')+""");
  SELECT * INTO f FROM engine_manual_full();
  SELECT count(*) INTO same FROM (SELECT DISTINCT ON (part) part, version FROM engine_manual_parts ORDER BY part, version DESC) l WHERE version = 242;
  toc := engine_manual_toc();
  ap := engine_manual_apply(241,'d0e9efda3280624ce987050bc9568197','[{"old":"x","new":"y"}]'::jsonb,NULL,NULL,NULL,NULL,NULL,false);
  SELECT content INTO ptr FROM engine_manual ORDER BY version DESC, id DESC LIMIT 1;
  RAISE EXCEPTION 'PREVIEW583 %', jsonb_build_object('section0',r0,'full_version',f.version,'full_md5',md5(f.content),'full_len',length(f.content),
    'parts_still_at_242',same,'parts',(SELECT count(DISTINCT part) FROM engine_manual_parts),'toc_len',length(toc),'toc_head',left(toc,900),
    'old_apply',ap,'pointer_len',length(ptr),'em_max',(SELECT max(version) FROM engine_manual),
    'log',(SELECT jsonb_agg(jsonb_build_object('v',version,'part',part,'title',title,'len',length(content)) ORDER BY id) FROM engine_manual_log WHERE version>241),
    'audit_new',(SELECT count(*) FROM audit_log WHERE session_title LIKE 'GUARD: engine_manual%' AND created_at>=now()))::text;
END $chk$;
"""
open('preview583.sql','w',encoding='utf-8').write(prev)
print('part 00.1 base',md5_001,len(sec0),'-> new',new_md5,new_len,'| full new',full_md5,len(full_new))
print(len(cut),len(prev))
