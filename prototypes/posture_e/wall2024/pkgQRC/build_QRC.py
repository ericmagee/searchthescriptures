# pkgQRC (W2, item C of Wall 3714): the judges' question round asks about closing-round contradictions.
# Base: live s82 (b04eda94). Edits only the four QR code nodes, each edit anchored and asserted once. Wording: Wall 3716 (C1 to C5).
# The dry-trial guard (QR Trial?, QR Ask Build fail-closed outside a dry regrade) is NOT changed: that waits for the operator's ASK 1.
#   python3 pkgQRC/build_QRC.py [fetchback]  -> pkgQRC/parent_s82_QRC.json and pkgQRC/nodes/*.js
import json, sys, os
FB = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/wall2024/fetchback_live_s83.json'
d = json.load(open(FB)); ns = {n['name']: n for n in d['nodes']}
def sub(code, old, new, what):
    n = code.count(old)
    if n != 1: sys.exit('BUILD REFUSED: %s: anchor found %d times: %r' % (what, n, old[:80]))
    return code.replace(old, new)
C1 = ' When a debater\'s closing round ([CR4] for the defender, [DR4] for the challenger) says what contradicts its own earlier round, my question to that debater quotes both passages, the earlier one and the closing one, and asks it to explain how the two agree. Its answer cannot withdraw either passage: a contradiction made in the closing round stands as made, and whether it is one is confirmed by the closing enforcer.'
C2 = '\\n\\nWatch the closing rounds for contradictions. If a debater\\\'s closing round contradicts its own earlier round, your question to that debater must be about that contradiction: give "round" as its closing round, "quote" as the closing words, "earlier_round" and "earlier_quote" as the earlier words, and ask how the two agree. If you find no contradiction for a debater, ask that debater a question as before and leave out the earlier fields.'
C4 = ' If the judge quotes two of your passages, explain how they agree; you cannot withdraw or change either one here.'
C5 = ' A question that quotes two passages of one debater is a contradiction question. The answer does not withdraw either passage; the closing enforcer confirms whether it is a contradiction, and the contradiction rule then applies.'
CHK_OLD = "if(!QR_SIDE[side].includes(rd))f.push('round \"'+q.round+'\" is not one of that debater\\'s rounds ('+QR_SIDE[side].join(', ')+')');"
CHK_NEW = CHK_OLD + "\n const __qe=v=>{const s=String(v==null?'':v).trim();return /^(?:none|n\\/a|na|null|-+)?$/i.test(s)?'':s;};if(__qe(q.earlier_round)||__qe(q.earlier_quote)){const CL={defender:'CR4',challenger:'DR4'}[side];if(rd!==CL)f.push('a contradiction question quotes the closing round '+CL+', not \"'+q.round+'\"');const er=String(q.earlier_round||'').toUpperCase().replace(/[\\[\\]\\s]/g,'');if(!QR_SIDE[side].includes(er)||er===CL)f.push('earlier round \"'+q.earlier_round+'\" is not one of that debater\\'s earlier rounds');const eq=qrNorm(q.earlier_quote);if(eq.length<8)f.push('earlier quotation missing or under 8 characters');else if(QR_SIDE[side].includes(er)&&er!==CL&&!qrNorm(F[QR_KEY[er]]).includes(eq))f.push('the earlier quotation is not found word for word in '+er);} /* pkgQRC */"
NV_OLD = "const nv=qrRefs((q.question||'')+' '+(q.quote||''))"
NV_NEW = "const nv=qrRefs((q.question||'')+' '+(q.quote||'')+' '+(q.earlier_quote||''))"
for k in ['QR Ask Build', 'QR Check', 'QR Final', 'QR Merge']:
    c = ns[k]['parameters']['jsCode']
    c = sub(c, 'any verse not already cited, is disregarded.";', 'any verse not already cited, is disregarded.' + C1 + '";', k + ' C1')
    c = sub(c, CHK_OLD, CHK_NEW, k + ' C3'); c = sub(c, NV_OLD, NV_NEW, k + ' C3 verses')
    if k == 'QR Ask Build':
        c = sub(c, "All three judges will read all six questions and answers before they judge.\\n\\nReply with JSON only, in this form:", "All three judges will read all six questions and answers before they judge." + C2 + "\\n\\nReply with JSON only, in this form (add \"earlier_round\" and \"earlier_quote\" to a side only for a contradiction question):", k + ' C2')
    if k == 'QR Final':
        c = sub(c, "or cite a verse you did not already cite: any such material is disregarded. Answer in at most 250 words.", "or cite a verse you did not already cite: any such material is disregarded." + C4 + " Answer in at most 250 words.", k + ' C4')
        c = sub(c, "'\\n\\n=== A JUDGE\\'S QUESTION ===\\nThe judge quotes your round '+rd+': \"'+q.quote+'\"\\nQuestion: '+q.question",
                "'\\n\\n=== A JUDGE\\'S QUESTION ===\\n'+((q.earlier_quote&&!/^(?:none|n\\/a|na|null|-+)$/i.test(String(q.earlier_quote).trim()))?'The judge quotes your earlier round '+String(q.earlier_round).toUpperCase().replace(/[\\[\\]\\s]/g,'')+': \"'+q.earlier_quote+'\"\\nand your closing round '+rd+': \"'+q.quote+'\"':'The judge quotes your round '+rd+': \"'+q.quote+'\"')+'\\nQuestion: '+q.question", k + ' C4 user')
        c = sub(c, "rec.push({judge:c.seat,side,round:q&&q.round,quote:q&&q.quote,", "rec.push({judge:c.seat,side,round:q&&q.round,quote:q&&q.quote,earlier_round:(q&&q.earlier_round)||null,earlier_quote:(q&&q.earlier_quote)||null,", k + ' record')
        c = sub(c, "items.push({json:{judge:c.seat,side,round:rd,quote:q.quote,", "items.push({json:{judge:c.seat,side,round:rd,quote:q.quote,earlier_round:(q.earlier_quote&&!/^(?:none|n\\/a|na|null|-+)$/i.test(String(q.earlier_quote).trim()))?String(q.earlier_round).toUpperCase().replace(/[\\[\\]\\s]/g,''):null,earlier_quote:(q.earlier_quote&&!/^(?:none|n\\/a|na|null|-+)$/i.test(String(q.earlier_quote).trim()))?q.earlier_quote:null,", k + ' items')
    if k == 'QR Merge':
        c = sub(c, "is disregarded.\\n\\n'+block+'", "is disregarded." + C5 + "\\n\\n'+block+'", k + ' C5')
        c = sub(c, "' -- judge '+x.judge+' to the '+x.side+', quoting ['+x.round+']: \"'+x.quote+'\"", "' -- judge '+x.judge+' to the '+x.side+', '+(x.earlier_quote?'CONTRADICTION QUESTION, quoting ['+x.earlier_round+']: \"'+x.earlier_quote+'\" and ['+x.round+']: \"'+x.quote:'quoting ['+x.round+']: \"'+x.quote)+'\"", k + ' C5 block')
        c = sub(c, "return {judge:q.judge,side:q.side,round:q.round,quote:q.quote,", "return {judge:q.judge,side:q.side,round:q.round,quote:q.quote,earlier_round:q.earlier_round||null,earlier_quote:q.earlier_quote||null,", k + ' qa')
    ns[k]['parameters']['jsCode'] = c
os.makedirs('pkgQRC/nodes', exist_ok=True)
for k in ['QR Ask Build', 'QR Check', 'QR Final', 'QR Merge']:
    open('pkgQRC/nodes/' + k.replace(' ', '_') + '.js', 'w').write(ns[k]['parameters']['jsCode'])
json.dump({'nodes': d['nodes'], 'connections': d['connections'], 'settings': d['settings']}, open(os.environ.get('OUT','pkgQRC/parent_s83_QRC.json'), 'w'), indent=1)
print(os.environ.get('OUT','parent_s83_QRC.json')+': %d nodes; changed: QR Ask Build, QR Check, QR Final, QR Merge' % len(d['nodes']))
