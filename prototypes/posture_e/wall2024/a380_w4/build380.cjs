// ASK 380 (W1 plan rev 2, Wall 7946; clarification 7949): split "; REMOVED FOR: " off a tried line's why in both places; lower section prints one seat line per unfilled removed seat; "ALTERNATE: none" prints as "no alternate".
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const N=W.nodes.find(n=>n.name==='Format Markdown');let c=N.parameters.jsCode;
const rep=(a,b)=>{const k=c.split(a).length-1;if(k!==1)throw new Error('anchor count '+k+': '+a.slice(0,80));c=c.replace(a,()=>b);};
// 1. header parse
rep("TR.push({ seat: m[1].trim(), alt: m[2].trim(), result: m[4].trim(), why: m[5] || '' }); });",
    "TR.push({ seat: m[1].trim(), alt: m[2].trim(), result: m[4].trim(), why: String(m[5] || '').split(/(?:^|; )REMOVED FOR: /)[0], rf: String(m[5] || '').split(/(?:^|; )REMOVED FOR: /)[1] || '' }); }); /* ASK 380: the clause after \"REMOVED FOR: \" (after \"; \" or as the whole WHY) is the removed seat's reason, not the alternate's */");
// 2. lower parse
rep("if(m)TRIED.push({seat:m[1],alt:m[2],model:m[3],result:m[4],why:m[5]||''});}));",
    "if(m)TRIED.push({seat:m[1],alt:m[2],model:m[3],result:m[4],why:String(m[5]||'').split(/(?:^|; )REMOVED FOR: /)[0],rf:String(m[5]||'').split(/(?:^|; )REMOVED FOR: /)[1]||''});})); /* ASK 380 */");
// 3. lower print: seat line (source a: the header judge line's reason; source b: the clause), "no alternate" form
rep(" TRIED.forEach(x=>{t += '- ' + nm(x.seat) + ': alternate ' + (x.alt==='none'?'none':(ALTN[x.alt]||nm(x.alt)) + ' (' + x.model + ')') + ' tried, ' + x.result + (x.why ? ': ' + x.why : '') + '.\\n';});",
    " const SL=new Set(); /* ASK 380 (W1 7949): one seat line per removed seat that has tried lines and is not in drv_removed; reason from its judge line, else from the clause */\n TRIED.forEach(x=>{if(!SL.has(x.seat)&&!DRM.some(d=>d.seat===x.seat)){SL.add(x.seat);const jj=J.find(q=>q.judge_seat===x.seat);const ra=jj&&!isCounted(jj)?notCountedWhy(jj).replace(/^NOT COUNTED: /,''):'';const rb=ra?'':((TRIED.find(y=>y.seat===x.seat&&y.rf)||{}).rf||'');if(ra||rb)t += '- ' + nm(x.seat) + ' was not counted: ' + (ra||rb) + '.\\n';}\n  t += '- ' + nm(x.seat) + ': ' + (x.alt==='none'?'no alternate, ':'alternate ' + (ALTN[x.alt]||nm(x.alt)) + ' (' + x.model + ') tried, ') + x.result + (x.why ? ': ' + x.why : '') + '.\\n';});");
if(/\b(terra|ernie|haiku|sonnet|gemini|chatgpt|sol62|hydrogen|argon|spark|ember|grok|luna|qwen)\b/i.test(c.split('ASK 380')[1]||''))console.log('WARN name near ASK 380');
N.parameters.jsCode=c;fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('ok',c.length);
