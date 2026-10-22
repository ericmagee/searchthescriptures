// W2 (new order, pen Worker_A3): fires when a report's verdict block shows a single-judge verdict word without the SECOND OPINION label,
// or when no line names the panel's verdict as the debate's verdict.
const md=require('fs').readFileSync(process.argv[2],'utf8');
const sj=md.split('\n').filter(l=>/Single judge/i.test(l)&&/\*\*(HELD|PARTIAL|BROKEN)\*\*|: (HELD|PARTIAL|BROKEN)\b/.test(l));
const bad=sj.filter(l=>!/SECOND OPINION/.test(l));
const verdictLine=/Verdict of the debate: \*\*(HELD|PARTIAL|BROKEN|UNGRADED REVIEW)\*\* \(the panel\)/.test(md);
console.log('single-judge lines',sj.length,'| unlabelled',bad.length,'| panel verdict line',verdictLine,'=>',(bad.length||!verdictLine)?'FIRES':'SILENT');
