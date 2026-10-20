// DEBATE RULE VIOLATIONS (BB-6904 e, step 6): one row per report line the cure check stored in a judge's text (single judge:
// independent_verdict_raw; panel: verdict_raw), read back by its fixed fields. The judge texts above drop these lines (noMarkers).
// DRV_EFFECT states what the report does to the verdict; it follows the operator's choice in 6904 (d) and reads "record only" until then.
const DRV_EFFECT = 'This report is a record. It does not change any judge\'s verdict or the outcome.';
const DRV_RULE = { 'K-B': 'Two kinds of layer (K-B)', 'K-G1': 'Conceded count (K-G1)', 'K-G3': 'Standing (K-G3)' };
const drvCell = x => String(x == null ? '' : x).replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim();
const drvRead = (who, raw) => { const rows = []; let prose = false;
  for (const ln of String(raw || '').split('\n')) { const l = ln.trim(); const m = l.match(/^\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- (.*)\]$/);
    if (m) { const p = m[1].split(/(?:^|; )(SEAT|ITEM|RULE|RESULT|KINDS|WHY|LINE|STATEMENT): /); const o = { who }; for (let i = 1; i < p.length; i += 2) o[p[i]] = p[i + 1]; if (o.ITEM && o.RESULT) rows.push(o); continue; }
    if (/^\[AUDIT v21: DEBATE RULE VIOLATION REPLY -- /.test(l)) prose = true; }
  return { rows, prose }; };
const DRV = [drvRead('Single judge: ' + SJN, r.independent_verdict_raw)].concat(J.map(j => drvRead('Panel judge ' + nm(j.judge_seat), j.verdict_raw)));
const DRVR = [].concat(...DRV.map(x => x.rows));
if (DRVR.length) {
  const nc = DRVR.filter(x => x.RESULT === 'CURED').length;
  t += '## Debate rule violations\n\n**Rule B.** A link a judge grades BROKEN must show, on its own line, at least two different kinds of lower layer: [L1] the KJV words quoted, [L2] the Hebrew or Greek word, or [L3] a cross-reference named. A judge whose line did not, or whose counts or standings disagreed with its own BROKEN lines, was asked once to cure it in a fixed form, and the cure was checked by the same count.\n\n';
  t += '**Effect on the verdict.** ' + DRV_EFFECT + '\n\n';
  t += DRVR.length + (DRVR.length === 1 ? ' violation' : ' violations') + ': ' + nc + ' cured, ' + (DRVR.length - nc) + ' not cured.\n\n';
  t += '| Judge | Item | Rule | Result | Original line | Cure statement, or why not cured |\n|---|---|---|---|---|---|\n';
  DRVR.forEach(x => { const last = x.RESULT === 'CURED' ? (x.STATEMENT || x.WHY || '') : ((x.STATEMENT ? x.STATEMENT + ' ' : '') + (x.WHY ? 'Not cured: ' + x.WHY + '.' : 'Not cured.'));
    t += '| ' + drvCell(x.who) + ' | ' + drvCell(x.ITEM) + ' | ' + drvCell(DRV_RULE[x.RULE] || x.RULE) + ' | **' + drvCell(x.RESULT) + '**' + (x.KINDS ? ' (' + drvCell(x.KINDS) + ')' : '') + ' | ' + drvCell(x.LINE || '') + ' | ' + drvCell(last) + ' |\n'; });
  t += '\n';
  const PR = DRV.filter(x => x.prose).map(x => x.rows.length ? x.rows[0].who : null).filter(Boolean);
  if (PR.length) t += 'The reply of ' + PR.join(', ') + ' also held prose. It is recorded in the stored row and was not read for a cure.\n\n';
}
