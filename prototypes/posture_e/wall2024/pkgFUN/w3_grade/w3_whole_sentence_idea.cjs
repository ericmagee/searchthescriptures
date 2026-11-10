// W3 idea for pkgFUN rev 3 (not a build): a refusal is a WHOLE sentence (or the whole remainder after "COUNTED, but/though/yet/however,") from a closed list.
// A longer sentence that only contains those words (reported speech, a reason, a correction) is not a refusal.
const fs=require('fs');
const W=[/^(?:that|this|it|the\s+count|counted)\s+(?:is|would\s+be|seems)\s+(?:not\s+(?:right|correct|true|accurate|so)|wrong|incorrect|mistaken|false|an?\s+error|in\s+error)(?:\s+here)?$/i,
 /^(?:that|this|it)\s+isn['’]t\s+(?:right|correct|true|accurate)$/i,
 /^(?:it|this|that|the\s+grant)\s+(?:should|must|ought\s+to|can|will|would)\s*(?:not|n['’]t)\s+be\s+counted(?:\s+(?:here|at\s+all))?$/i,/^(?:it|this|that|the\s+grant)\s+cannot\s+be\s+counted(?:\s+(?:here|at\s+all))?$/i,
 /^I\s+(?:do\s+not|don['’]t|cannot|can['’]t|will\s+not|won['’]t)\s+(?:agree|accept|count|concede)(?:\s+(?:it|this|that|here))?$/i,/^I\s+(?:refuse|disagree|object|protest)(?:\s+(?:to\s+)?(?:it|this|that))?$/i,
 /^(?:it|this|that|the\s+rule|ruling\s+\d+)\s+does\s+(?:not|n['’]t)\s+apply(?:\s+here)?$/i,/^(?:it|this|that)\s+is\s+(?:not|n['’]t|no)\s+(?:a\s+)?(?:close\s+)?concession(?:\s+(?:here|at\s+all))?$/i,
 /^(?:it|this|that)\s+is\s+(?:a\s+|only\s+a\s+|mere\s+)?courtesy$/i,/^no(?:,\s*it\s+is\s+(?:a\s+)?courtesy)?$/i,/^under\s+protest$/i,/^I\s+(?:maintain|keep|stand\s+by)\s+my\s+first\s+answer$/i,/^I\s+deny\s+(?:it|that\s+it\s+is\s+a\s+concession)$/i,
 /^the\s+enforcer(?:['’]s\s+note)?\s+is\s+(?:wrong|mistaken|incorrect|in\s+error)$/i];
const refuses=t=>{let c=String(t).replace(/"[^"\n]*"|“[^”\n]*”/g,' ').trim();if(!/^COUNTED\b/i.test(c)||/^COUNTED\s*\?/i.test(c))return true;c=c.replace(/^COUNTED[*_`"'”’]*\s*/i,'');
 return c.split(/[.;!?:]+(?:\s+|$)|\s+[-–—]+\s+|,\s+(?=(?:but|though|although|yet|however)\b)/).map(s=>s.replace(/^[\s,–—-]*(?:(?:but|though|although|yet|however|and)[\s,]+)?/i,'').replace(/[\s,.]+$/,'')).filter(Boolean).some(s=>W.some(r=>r.test(s)));};
module.exports=refuses;
if(require.main===module){const J=f=>JSON.parse(fs.readFileSync(__dirname+'/'+f,'utf8'));const src=fs.readFileSync(__dirname+'/w3_plant_FUN.cjs','utf8');const ev=n=>eval(src.split('\n').find(l=>l.startsWith('const '+n+'=')).replace('const '+n+'=','').replace(/;\s*$/,''));
 const good=[...ev('GOOD'),...J('w3_good2.json')],bad=[...ev('BAD'),...J('w3_bad2.json')];let a=0,b=0;for(const g of good)if(refuses(g)){a++;console.log('GOOD read as refusal |',g);}for(const x of bad)if(!refuses(x)){b++;console.log('BAD read as answered |',x);}
 console.log(good.length+' correct answers, '+a+' read as refusal; '+bad.length+' refusals, '+b+' read as answered');}
