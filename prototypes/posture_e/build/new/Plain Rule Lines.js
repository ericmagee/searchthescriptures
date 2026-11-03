const x = $input.first().json;
const WHY = {
  'BROKEN-1': "the challenger refuted at least one of the defender's declared links from the text",
  'BROKEN-2': 'the defender withdrew more than half of the links it declared, or withdrew its conclusion link',
  'PARTIAL-1': 'the defender withdrew at least one declared link',
  'PARTIAL-2': "the defender's defense standing is COLLAPSED",
  'HELD-1': 'none of the conditions for BROKEN or PARTIAL was met'
};
// ITEM 8 (BB-7234): the section "What the judges were sent" is verbatim judge text; only the text above it is rewritten here.
const SENT_AT = String(x.md || '').indexOf('\n## What the judges were sent\n');
const HEAD = SENT_AT >= 0 ? String(x.md).slice(0, SENT_AT) : String(x.md || ''), TAIL = SENT_AT >= 0 ? String(x.md).slice(SENT_AT) : '';
// BB-7397 rev 9 DoD 21: the clause counted after a judge's cure (Format Markdown's line), and a judge's own lines quoted under it ("> ").
const md0 = HEAD.replace(/^CLAUSE: ((BROKEN|PARTIAL|HELD)-\d) -- counted after the judge's cure(?:; retracted: (.*))?$/gm, (m, code, word, rx) => 'Rule applied: ' + word + ', because ' + (WHY[code] || 'the judge applied rule ' + code) + " (the clause counted after the judge's cure" + (rx ? '; retracted: ' + rx : '') + ').').replace(/^(> )?CLAUSE:\s*((BROKEN|PARTIAL|HELD)-\d)\s*(?:(?:--|—|–)\s*)?n=(\d+)\s+w=(\d+)\s+k=(\d+)\s*$/gm, (m, qt, code, word, n, w, k) => (qt || '') + 'Rule applied: ' + word + ', because ' + (WHY[code] || 'the judge applied rule ' + code) + '. The defender declared ' + n + ' links, withdrew ' + w + ', and the challenger refuted ' + k + '.');
// posture v5 (Part C item 3): the judges' agreement, printed in the transcript before what the judges were sent.
let AGM='';try{const AG=$('Accept Final').first().json.acc;const q=t=>String(t==null?'':t).split('\n').map(l=>'> '+l).join('\n');
 AGM='\n## The judges\' agreement\n\nBefore the debate was judged, every judge was sent the posture and asked to accept it. A judge that refused, or failed the check twice, did not judge.\n\n'+
  (AG.seats||[]).map(x=>'### '+x.seat+' ('+x.api_model+'): '+x.status+(x.placed?'':' -- not seated')+'\n\n'+q(x.first_text)+(x.return_text!=null?'\n\nReturned once ('+(x.faults||[]).join('; ')+'):\n\n'+q(x.return_text):'')).join('\n\n')+'\n';}catch(e){AGM='\n## The judges\' agreement\n\nThe agreement record was not found.\n';}
const md = md0 + AGM + TAIL;
const left = (md0.match(/BROKEN-\d|PARTIAL-\d|HELD-\d|2w > n|k >= 1/g) || []).length;
return [{ json: { ...x, md, chars: md.length, codes_left: left } }];
