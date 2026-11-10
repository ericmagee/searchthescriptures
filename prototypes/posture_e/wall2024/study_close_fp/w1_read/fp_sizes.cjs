const fs=require('fs');const s=fs.readFileSync('ceb_s107.js','utf8');const m=s.match(/const PROMPT=("(?:[^"\\]|\\.)*")/);const P=JSON.parse(m[1]);
const OLD="It is NOT a contradiction when the closing sentence: grants, concedes, narrows or withdraws something; states or quotes the other side's position; answers a press with a further reason the earlier sentence leaves room for; or differs only in wording.";
const W2NEW="It is NOT a contradiction when: the closing sentence grants, concedes, narrows or withdraws something; either sentence states or quotes the other side's position; the closing names, quotes or answers a dropped verse without resting the dropped claim on it, or says what a verse does not show; the closing answers a press with a further reason the earlier sentence leaves room for; or both say the same thing.\nCONFIRMED only when you can name the one claim one sentence affirms and the other denies; put that claim in the why.";
const FOLD="<one sentence: why both cannot be true, or why they can>";
// W1 short form: same three cases, cause 3 folded into the reply format's why field
const S_NEW="It is NOT a contradiction when: the closing grants, concedes, narrows or withdraws something; either sentence states or quotes the other side's position; the closing names or answers a dropped verse without resting on it; it answers a press with a reason the earlier sentence leaves room for; or both say the same.";
const S_FOLD="<one sentence: the one claim one sentence affirms and the other denies, or why both can stand>";
// net-zero: also cut the framing sentence restated by the next two lines
const CUT="A debater's closing round may not contradict what the same debater stated in its earlier rounds. ";
const code=p=>JSON.stringify(p).length;
const show=(n,p)=>console.log(n.padEnd(34),'prompt',p.length-P.length,'code',code(p)-code(P));
if(!P.includes(OLD)||!P.includes(FOLD)||!P.includes(CUT))throw 'anchor missing';
console.log('live prompt',P.length);
show('W2 proposal',P.replace(OLD,W2NEW));
const sh=P.replace(OLD,S_NEW).replace(FOLD,S_FOLD);show('W1 short (sentence + why field)',sh);
show('W1 short + framing cut',sh.replace(CUT,''));
fs.writeFileSync('fp_short_prompt.txt',sh.replace(CUT,''));
