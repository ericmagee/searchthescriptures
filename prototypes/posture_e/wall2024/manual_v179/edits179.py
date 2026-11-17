# engine_manual v179 = v178 with provenance taken out of the body (section 0 body law; operator 19:18 CST 11-16).
# Step 1 (regex): delete whole lines "- WRITTEN AS ..." and "- Graded PASS by ..." (25 lines).
# Step 2 (regex): delete inline sentences " Graded PASS by ... ." (10).
# Step 3 (literal): each parenthetical that cites a seat's Wall post is removed, or cut to its non-provenance words.
import json, sys
KEEP = {"(pkgECF, W3 2534)"}  # literal code text (the AUDIT v41 string)
CUT = {
 "(40042, 40043; W2 6718)": "(40042, 40043)",
 "(32791 DR1, W4 7071)": "(32791 DR1)",
 "(W4 6953 item 8; doctrine mark W3 6955, W2 6963, both under ruling 461's \"the line cannot be replaced\" clause)": "(under ruling 461's \"the line cannot be replaced\" clause)",
 "(\"USAGE: prompt=92421 completion=64000 reasoning=53087 finish=length max_tokens=64000\", and reasoning=61445 on the second; W4 7000, 7009)": "(\"USAGE: prompt=92421 completion=64000 reasoning=53087 finish=length max_tokens=64000\", and reasoning=61445 on the second)",
 "(§4, NO REASONING FIELD; W3 6869 C3)": "(§4, NO REASONING FIELD)",
 "(option 1, W1 7094, W2 7093, W3 7104)": "(option 1)",
 "(the line is split on . ! ? ; with any closing quote mark; W2 6967)": "(the line is split on . ! ? ; with any closing quote mark)",
 "(row ids matched to debate_enforcer_log by md5, W1 6970 item 7)": "(row ids matched to debate_enforcer_log by md5)",
 "(D2 as written; W2 7013 plant P2 expected otherwise; W4 7043 item 6a)": "(D2 as written)",
 "(W2 7013, D1 to D5, all four seats AGREE)": "(D1 to D5)",
 "(Ruling 383; W2 6790, W1 6789)": "(Ruling 383)",
 "(125 rows, W1 6784; 92, W4 6782)": "(125 rows by one count, 92 by another)",
 "(W2 6662 control D; W1 6666)": "(control D)",
}
ALL = json.load(open(sys.argv[1]))  # [[n, paren], ...] from the live query
pairs = []
for n, p in ALL:
    if p in KEEP: continue
    if p in CUT: pairs.append((" "+p, " "+CUT[p]))
    else: pairs.append((" "+p, ""))
json.dump(pairs, open(sys.argv[2], 'w'), ensure_ascii=False, indent=0)
print(len(pairs), "parentheticals;", sum(1 for _,b in pairs if b), "cut,", sum(1 for _,b in pairs if not b), "removed")
