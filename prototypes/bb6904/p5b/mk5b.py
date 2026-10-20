# BB-6904 5B (6965 option 2, design B fail-closed per 6968/6969). Draft only: writes migration.sql, undo.sql and patched code; applies nothing.
# Usage: python3 mk5b.py <live workflow details json (db281705)> <Panel_Payloads.new.js (portion 3, d3e94674)> <p4 dir (Panel_Cure_Check.js)> <out dir>
# The undo_*.sql files are the live function texts read before this build (pg_get_functiondef); every patch is asserted to apply once.
import json,sys,hashlib,os
md5=lambda s:hashlib.md5((s if s.endswith('\n') else s+'\n').encode()).hexdigest()
def once(src,old,new,what):
  n=src.count(old);assert n==1,'%s: anchor found %d times'%(what,n);return src.replace(old,new)
HERE=os.path.dirname(os.path.abspath(__file__));LIVE,PP3,P4,OUT=sys.argv[1:5];os.makedirs(OUT,exist_ok=True)
N={n['name']:n for n in json.load(open(LIVE))['workflow']['nodes']}
res={}
# 1. aggregate_debate_panel: a seat with any uncured debate rule violation is not clean; such seats are named apart from unreadable ones.
agg=open(os.path.join(HERE,'undo_aggregate_debate_panel.sql')).read()
agg2=once(agg,"""             AND j.challenge_standing IN ('SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED')
           , false) AS is_clean,""","""             AND j.challenge_standing IN ('SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED')
             AND COALESCE(j.drv_uncured, 0) = 0
           , false) AS is_clean,
           -- Option 2 (BB-6965, design B fail-closed BB-6969): readable in every other respect, but the seat carries uncured
           -- DEBATE RULE VIOLATION items (K-B, K-G1, K-G3). Not counted; named apart from unreadable rows. NULL (rows before 5B) = 0.
           COALESCE(
             j.truncated = false
             AND j.verdict_tag IN ('HELD','PARTIAL','BROKEN')
             AND j.defense_standing   IN ('SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED')
             AND j.challenge_standing IN ('SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED')
             AND COALESCE(j.drv_uncured, 0) > 0
           , false) AS drv_out,""",'aggregate is_clean')
agg2=once(agg2,"  v_unrecognised jsonb; v_seats jsonb;","  v_unrecognised jsonb; v_seats jsonb; v_drv int;",'aggregate declare')
agg2=once(agg2,"""         (SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'judge_seat', judge_seat, 'verdict_tag', verdict_tag, 'clean', is_clean)
                  ORDER BY judge_seat), '[]'::jsonb) FROM r)
    INTO v_total, v_clean, v_counts, v_top_tag, v_unrecognised, v_seats;

  v_unreadable := v_total - v_clean;""","""         (SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'judge_seat', judge_seat, 'verdict_tag', verdict_tag, 'clean', is_clean, 'drv_uncured', drv_uncured)
                  ORDER BY judge_seat), '[]'::jsonb) FROM r),
         (SELECT count(*)::int FROM r WHERE drv_out)
    INTO v_total, v_clean, v_counts, v_top_tag, v_unrecognised, v_seats, v_drv;

  v_unreadable := v_total - v_clean - v_drv;""",'aggregate select')
agg2=once(agg2,"""    SELECT j.judge_seat,
           j.verdict_tag,""","""    SELECT j.judge_seat,
           j.verdict_tag,
           j.drv_uncured,""",'aggregate columns')
agg2=once(agg2,"""  IF v_unreadable > 0 THEN
    v_split := v_split || ' (' || v_unreadable || ' unreadable)';
  END IF;""","""  IF v_unreadable > 0 THEN
    v_split := v_split || ' (' || v_unreadable || ' unreadable)';
  END IF;
  IF v_drv > 0 THEN
    v_split := v_split || ' (' || v_drv || ' not counted: debate rule)';
  END IF;""",'aggregate split')
agg2=once(agg2,"""    'rows_unreadable', v_unreadable,""","""    'rows_unreadable', v_unreadable,
    'rows_not_counted_debate_rule', v_drv,""",'aggregate return')
# 2. derive_debate_outcome: the tie count reads the same condition (6967 FOUND).
der=open(os.path.join(HERE,'undo_derive_debate_outcome.sql')).read()
der2=once(der,"""    SELECT count(*) FILTER (WHERE verdict_tag = 'HELD' AND NOT coalesce(truncated, false)),
           count(*) FILTER (WHERE verdict_tag = 'HELD' AND NOT coalesce(truncated, false)
             AND""","""    -- Option 2 (BB-6965/6969): a seat with uncured debate rule violations counts toward the tie no more than toward the verdict.
    SELECT count(*) FILTER (WHERE verdict_tag = 'HELD' AND NOT coalesce(truncated, false) AND coalesce(drv_uncured, 0) = 0),
           count(*) FILTER (WHERE verdict_tag = 'HELD' AND NOT coalesce(truncated, false) AND coalesce(drv_uncured, 0) = 0
             AND""",'derive tie')
# 2b. The fingerprint (ruled BB-6971): drv_uncured joins a seat's digest line only when it is not NULL, so every existing stamp is unchanged.
der2=once(der2,"""  -- AMENDMENT ONE. FIVE fields: exactly the set aggregate_debate_panel reads.
  SELECT md5(coalesce(string_agg(
           judge_seat||'|'||coalesce(verdict_tag,'<null>')||'|'||truncated::text
           ||'|'||coalesce(defense_standing,'<null>')||'|'||coalesce(challenge_standing,'<null>'),""","""  -- AMENDMENT ONE. FIVE fields: exactly the set aggregate_debate_panel reads.
  -- Option 2 (BB-6971): drv_uncured, which aggregate_debate_panel now also reads, joins the line only when it is not NULL, so every
  -- stamp made before 5B recomputes byte-identical.
  SELECT md5(coalesce(string_agg(
           judge_seat||'|'||coalesce(verdict_tag,'<null>')||'|'||truncated::text
           ||'|'||coalesce(defense_standing,'<null>')||'|'||coalesce(challenge_standing,'<null>')
           ||CASE WHEN drv_uncured IS NOT NULL THEN '|drv='||drv_uncured::text ELSE '' END,""",'derive fingerprint')
mig=("-- BB-6904 5B: option 2 (BB-6965), design B fail-closed (BB-6968, ruled BB-6969). Draft; apply only on the operator's word.\n"
 "-- Undo: undo.sql. Live before: aggregate_debate_panel md5 "+hashlib.md5((agg.rstrip('\n').rstrip(';')+'\n').encode()).hexdigest()[:8]+", derive_debate_outcome md5 "+hashlib.md5((der.rstrip('\n').rstrip(';')+'\n').encode()).hexdigest()[:8]+".\n"
 "BEGIN;\n"
 "ALTER TABLE public.debate_judgments ADD COLUMN drv_uncured int;\n"
 "COMMENT ON COLUMN public.debate_judgments.drv_uncured IS 'BB-6904 option 2 (BB-6965): uncured DEBATE RULE VIOLATION items (K-B, K-G1, K-G3) of this seat. Panel Payloads writes the full count; Panel Cure Check lowers it to the UNCURED count. >0 = not clean (aggregate_debate_panel). NULL = written before 5B, read as 0.';\n"
 +agg2+"\n"+der2+"COMMIT;\n")
open(os.path.join(OUT,'migration.sql'),'w').write(mig)
undo=("-- BB-6904 5B undo: the two functions as they were live before 5B, then the column dropped.\nBEGIN;\n"+agg+"\n"+der+
 "ALTER TABLE public.debate_judgments DROP COLUMN drv_uncured;\nCOMMIT;\n")
open(os.path.join(OUT,'undo.sql'),'w').write(undo)
# 3. Panel Payloads (portion 3 draft): every payload carries its seat's violation count, fail-closed until the cure check lowers it.
pp=open(PP3).read();b=md5(pp)
pp2=once(pp,"const DRV=drvCheck(WT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,drvAsk);for(const x of DRV.marks)marks.push(x);",
 "const DRV=drvCheck(WT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,drvAsk);for(const x of DRV.marks)marks.push(x);\n"
 " p.drv_uncured=DRV.items.length; // 5B (BB-6969): fail-closed; Panel Cure Check lowers it to the UNCURED count. K-G2 is a mark, never an item.",'Panel Payloads')
open(os.path.join(OUT,'Panel_Payloads.js'),'w').write(pp2);res['Panel Payloads']=(b[:8],md5(pp2)[:8])
# 4. Panel Cure Check (portion 4): the UNCURED count of each seat's items replaces the full count.
pc=open(os.path.join(P4,'Panel_Cure_Check.js')).read();b=md5(pc)
pc2=once(pc,"const b=JSON.parse(bodies[i]);b.payload.verdict_raw=","const b=JSON.parse(bodies[i]);b.payload.drv_uncured=v.filter(x=>x.status!=='CURED').length;b.payload.verdict_raw=",'Panel Cure Check')
open(os.path.join(OUT,'Panel_Cure_Check.js'),'w').write(pc2);res['Panel Cure Check']=(b[:8],md5(pc2)[:8])
# 5. Failure Salvage (6966 MISS, ruled 6969): read Cure Check first, then the extractor.
fs=N['Failure Salvage']['parameters']['jsCode'];b=md5(fs)
fs2=once(fs,"const ivr=P('Extract Independent Verdict',j=>j.independent_verdict_raw);const vt=P('Extract Independent Verdict',j=>j.verdict_tag);",
 "const ivr=P('Cure Check',j=>j.independent_verdict_raw)||P('Extract Independent Verdict',j=>j.independent_verdict_raw);const vt=P('Cure Check',j=>j.verdict_tag)||P('Extract Independent Verdict',j=>j.verdict_tag); // 5B (BB-6969): the cure report rides the salvage row",'Failure Salvage')
open(os.path.join(OUT,'Failure_Salvage.js'),'w').write(fs2);res['Failure Salvage']=(b[:8],md5(fs2)[:8])
for k,v in res.items():print('%-18s %s -> %s'%(k,*v))
print('migration.sql',md5(mig)[:8],len(mig),'| undo.sql',md5(undo)[:8],len(undo))
