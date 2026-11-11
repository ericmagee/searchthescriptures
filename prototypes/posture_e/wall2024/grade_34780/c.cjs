const {r,out}=require('./x.cjs');
const j=out('Judge Contradiction Record')[0];console.log('JCC',JSON.stringify(j.jcc).slice(0,5000));
const p=j.jcc_log[0].prompt_sent||'';console.log('PROMPT head',p.slice(0,2500));
const c=out('Close Enforcer Record')[0];const cp=c.cec_log[0].prompt_sent;
for(const q of ['I grant the challenger\'s reading that this "coming together" is the taking of Matthew 1:24.','The finding in Matthew 1:18 stands before the coming together, and the coming together is distinct from the taking in 1:24.'])console.log('IN ROUNDS',cp.split('######## THE DEFENDER')[1].split(q).length-1);
console.log('reply',JSON.stringify(c.cec_log.map(x=>x.reply_text||x.reply||Object.keys(x))).slice(0,1500));
