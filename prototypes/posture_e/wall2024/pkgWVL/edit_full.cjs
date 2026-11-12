// pkgWVL (ASK 140 option 2, Eric 16:41 CST 11-12): full version. (a) second pass over the close: a row "[Ln] <verses>:" or "[Ln] On <verses>:"
// names each listed verse as a layer of its link; skipped when that verse and link already have a candidate; the finder's exclusions apply
// (a row that refuses the verse, the opponent's footing, a row naming only the opponent's link). (b) only if asked (Eric not yet answered): verbs "rest no weight on", "rest nothing [now] on".
module.exports=(s,verbs)=>{const R=(a,b)=>{const k=s.split(a).length-1;if(k!==1)throw 'anchor x'+k+': '+a;s=s.replace(a,()=>b);};
R("if(!W.length)continue;let hd='?';","if(!W.length)continue;for(const ps of [0,1]){let hd='?';");
R("let hit=null;for(const cl of ","let hit=null;if(!ps)for(const cl of ");
R("if(!hit)continue;const cq=","if(!hit&&ps&&j===0){const r0=ss[0],lt=r0.match(new RegExp('^\\\\[L\\\\d\\\\]\\\\s+(?:On\\\\s+)?('+LIST+')\\\\s*:(?!\\\\d)')),n0=(r0.match(own)||[])[1]||hd;if(lt&&find(w,lt[1])>=0&&!NEG.test(r0)&&!ATT.test(r0)&&!OS.test(lt[1])&&!(opp.test(r0)&&!own.test(r0))&&!out.some(c=>c.side===sd&&c.n===n0&&c.why.includes('] withdrew '+w.ref+' or')))hit=r0;} /* pkgWVL: second pass; a layer row \"[L3] <verses>:\" of the close names the verse as a layer of the link, unless that verse and link are already named */ if(!hit)continue;const cq=");
R("break;}}}}\n return out;","break;}}}}}\n return out;");
if(verbs)R("|(?:do\\\\s+not|no\\\\s+longer)\\\\s+rest","|rest\\\\s+(?:no\\\\s+weight|nothing)\\\\s+(?:now\\\\s+)?on|(?:do\\\\s+not|no\\\\s+longer)\\\\s+rest /* pkgWVL verbs */".replace(' /* pkgWVL verbs */',''));
return s;};
