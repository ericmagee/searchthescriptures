#!/usr/bin/env python3
"""s427a build: the anti-cheat hooks in Panel Build, Build Independent Verdict and Build Save Body (ruling 427). Anchors must occur exactly once."""
import os
R=os.path.dirname(os.path.abspath(__file__))
H="""// ruling 427 (TRIAL): the closing-round anti-cheat marks (Anticheat Record). A close sentence the enforcer found REVERSED against the same side's own
// earlier reading, with both quotes found in that side's rounds, is marked to the judge and disregarded; nothing else changes.
const __ACX=sd=>{try{if(!$('Anticheat Record').isExecuted)return '';const A=$('Anticheat Record').first().json.acx||{};const L=((A.reversed||{})[sd]||[]);if(!L.length)return '';
 return L.map(r=>'\\n\\n[ANTI-CHEAT CHECK -- computed by the system\\'s enforcer, not by a judge (a TRIAL check): this close round reverses the same side\\'s own earlier reading of '+r.verse+'. The close says: "'+String(r.close_q).slice(0,400)+'". The same side said earlier: "'+String(r.earlier_q).slice(0,400)+'". The close sentence is disregarded; grade this side\\'s earlier answer on '+r.verse+' on its own words, against the verse.]').join('');}catch(e){return '';}};
"""
def one(c,a,b,nm):
    n=c.count(a)
    if n!=1: raise SystemExit(f'{nm}: anchor count {n}: {a[:60]}')
    return c.replace(a,b)
c=open(f'{R}/base/Panel Build.js').read()
c=one(c,"const C4X=(()=>{",H+"const C4X=(()=>{","Panel Build")
c=one(c,"C4X.note(F,'D')","C4X.note(F,'D')+__ACX('D')","Panel Build")
c=one(c,"C4X.note(F,'C')","C4X.note(F,'C')+__ACX('C')","Panel Build")
open(f'{R}/new/Panel Build.js','w').write(c)
c=open(f'{R}/base/Build Independent Verdict.js').read()
c=one(c,"const C4X=(()=>{",H+"const C4X=(()=>{","BIV")
c=one(c,"C4X.note(d,'D')","C4X.note(d,'D')+__ACX('D')","BIV")
c=one(c,"C4X.note(d,'C')","C4X.note(d,'C')+__ACX('C')","BIV")
open(f'{R}/new/Build Independent Verdict.js','w').write(c)
c=open(f'{R}/base/Build Save Body.js').read()
A="// judge_fix3 B2: the challenger's close-round new presses"
S="""// ruling 427 (TRIAL): the closing-round anti-cheat record, one summary line and one line per REVERSED answer, shown or not.
{try{if($('Anticheat Record').isExecuted){const A=$('Anticheat Record').first().json.acx||{};if(A.skipped)FF.push('[AUDIT ANTI-CHEAT (TRIAL): not run: '+(A.why||'no reason given')+'.]');else{const k=A.counts||{};
 FF.push('[AUDIT ANTI-CHEAT (TRIAL): '+k.items+' close-round verse(s) checked in '+k.calls+' call(s): '+k.consistent+' CONSISTENT, '+k.reversed+' REVERSED ('+k.shown+' shown to the judges, '+k.quote_not_found+' QUOTE NOT FOUND), '+k.no_earlier+' NO EARLIER READING, '+k.no_answer+' NO ANSWER, '+k.not_checked+' NOT CHECKED'+((A.errors||[]).length?'; errors: '+A.errors.join('; '):'')+'.]');
 for(const r of (A.rows||[]).filter(r=>r.answer==='REVERSED'))FF.push('[AUDIT ANTI-CHEAT (TRIAL): '+(r.side==='D'?'DEFENDER':'CHALLENGER')+' '+r.verse+' REVERSED'+(r.shown?' (shown to the judges)':' (QUOTE NOT FOUND, not shown)')+': close "'+String(r.close_q).slice(0,240)+'"; earlier "'+String(r.earlier_q).slice(0,240)+'". REVIEW THIS ROW.]');}}}catch(e){}}
"""
c=one(c,A,S+A,"BSB")
open(f'{R}/new/Build Save Body.js','w').write(c)
print('built')
