-- rows45 = rows42 (rows42.sql, judgments 1167 to 1208) plus judgments 1209, 1210, 1211:
select json_agg(json_build_object('id',id,'seat',judge_seat,'raw',verdict_raw)) from debate_judgments where id in (1209,1210,1211);
