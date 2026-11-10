// pkgFUN rev 10 (W1; rev 9 + W3 Wall 4090: refusal entries whose subject or object is a bare count noun move to note only; E4 dropped (W2 Wall 4091: next-line refusals cured), TOUCHES NO LINK reads as s105. operator ASK 2 option 3, 05:40Z 11-10: record-only pkgKRO now, enforcement later; this is the later enforcement, offline).
// Base: the live library with pkgKRO rev 2 + pkgKSL rev 2 (pkgLIB/strip_KRO2_KSL). Shared Library only (26 library files carry the K-S3 line).
//  E1 enforce: the pkgKRO rev 2 COUNTED cure is withheld when the rev 7 whole-answer reader reads the whole answer (with pkgKSL's lines under it)
//     as one listed refusal; the answer then falls through to UNCURED as before pkgKRO. Other notes stay record-only.
//  E2 quotation-only rest (W3 rev 7 case 3): "does text follow" is asked with quotations kept as words.
//  E3 "Yes." / "Agreed." alone on the RESPONSE line with COUNTED opening the next line is read from COUNTED (W3 Wall 4076).
//  E4 "TOUCHES NO LINK:" with its reason on the next line is read with that line (W3 Wall 4076).
//  E5 pkgKSL's other-item stop keeps a line that also names this item's own number (W1 KSL rev 2 grade, H4).
//   node pkgFUN/build_FUN8.cjs [base strip] [out strip]
const fs=require('fs'),path=require('path'),cr=require('crypto');const W=path.resolve(__dirname,'..');
const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const sub=(s,a,b,what)=>{const n=s.split(a).length-1;if(n!==1)die(what+': '+n+' hits for '+JSON.stringify(a.slice(0,90)));return s.split(a).join(b);};
const A=path.resolve(W,process.argv[2]||'pkgLIB/strip_KRO2_KSL'),B=path.resolve(W,process.argv[3]||'pkgLIB/strip_KRO2_KSL_FUN10');if(fs.existsSync(B))die(B+' exists');fs.mkdirSync(B+'/patched',{recursive:true});
const E=[
 ['E3a',String.raw`if(x.rule==='K-S3'){const rp=respOf(x)||'';{const c0=String(rp+__ks3Cont(o,rp))`,
        String.raw`if(x.rule==='K-S3'){const rp=respOf(x)||'';{const __yc=__ks3Cont(o,rp),__yes=/^[\s*_]*(?:yes|agreed|correct|confirmed)[\s*_.!]*$/i.test(rp)&&/^[\s.]*[*_]*COUNTED[*_]*\s*(?:[.!:;,–—-]|$)/.test(__yc);const c0=String(__yes?__yc.replace(/^[\s.]+/,''):rp+__yc)`],
 ['E3b',String.raw`(/(?<![A-Za-z])COUNTED(?![A-Za-z])/i.test(rp)&&!/^NOT\s+COUNTED\b/i.test(c0)`,String.raw`(/(?<![A-Za-z])COUNTED(?![A-Za-z])/i.test(__yes?c0:rp)&&!/^NOT\s+COUNTED\b/i.test(c0)`],
 ['E2',String.raw`const rest=m?/[A-Za-z0-9]/.test(pre.slice(m[0].length)):false;`,
       String.raw`const __q=String(t).replace(/"[^"\n]*"|“[^”\n]*”/g,' Q ').replace(/[*_\x60\[\]]+/g,' ').trim().replace(/^COUNTED["'”’]*\s*/i,''),__mq=__q.match(/^[\s,.:;!–—-]*([^.!?]*)([.!?]+|$)/);const rest=__mq?/[A-Za-z0-9]/.test(__q.slice(__mq[0].length)):false; /* pkgFUN rev 10 E2 */`],
 ['E1a',String.raw`if(__r7&&__r7.enf)__n.push('the rev 7 reader reads the whole answer as a refusal');else if(__r7&&__r7.note)`,String.raw`if(__r7&&__r7.note)`],
 ['E1b',String.raw`return res('CURED','answered: the close concession is counted'+(__n.length?`,String.raw`if(!(__r7&&__r7.enf))return res('CURED','answered: the close concession is counted'+(__n.length?`],
 ['E6',String.raw`const B=[/^(?:the\s+count|that\s+count|this\s+count|my\s+count|counted)\s+(?:is|would`,String.raw`const B=[/^counted\s+(?:is|would`],
 ['E7',String.raw`/^I\s+(?:do\s+not|don['’]t|cannot|can['’]t|will\s+not|won['’]t)\s+accept\s+(?:this|the|that)\s+count$/i,`,''],
 ['E8',String.raw`(?:withdraw|retract|reverse|take\s+back)\s+(?:the\s+count|my\s+count(?:\s+of\s+(?:it|this|that|the\s+grant))?)(?:\s+after\s+all)?$/i`,String.raw`(?:withdraw|retract|reverse|take\s+back)\s+(?:the|my)\s+count(?:\s+of\s+(?:it|this|that|the\s+grant)(?:\s+after\s+all)?|\s+after\s+all)$/i`],
 ['E9',String.raw`/^on\s+reflection,?\s+(?:no|I\s+(?:withdraw|retract)\s+(?:it|that|the\s+count|my\s+count))$/i`,String.raw`/^on\s+reflection,?\s+(?:no|I\s+(?:withdraw|retract)\s+(?:it|that))$/i`],
 ['E10',String.raw`||B.some(r=>r.test(s)));`,String.raw`||B.concat([/^(?:the|that|this)\s+count\s+(?:is|would\s+be|seems)\s+(?:not\s+(?:right|correct|true|accurate|so)|wrong|incorrect|mistaken|false|an?\s+error|in\s+error)(?:\s+here)?$/i,/^I\s+(?:do\s+not|don['’]t|cannot|can['’]t|will\s+not|won['’]t)\s+accept\s+(?:this|the|that)\s+count$/i,/^(?:on\s+reflection,?\s+)?I\s+(?:withdraw|retract|reverse|take\s+back)\s+(?:the|my)\s+count$/i]).some(r=>r.test(s))); /* pkgFUN rev 10: a bare count noun (the judge's own count) is note only */`],
 ['E5',String.raw`const own=(L.match(/#\s*(\d+)/)||[])[1];for(const m of t.matchAll(`,String.raw`const own=(L.match(/#\s*(\d+)/)||[])[1];if(!(own&&new RegExp('(?:#|\\b(?:item|point|no\\.|number)\\s*#?)\\s*'+own+'\\b','i').test(t)))for(const m of t.matchAll(`]];
const plan={base:A,library:{}};
for(const f of fs.readdirSync(A+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(A+'/patched/'+f,'utf8');let s=s0;const did=[];
 const has=s.includes(E[0][1]);if(has){if(s.includes('pkgFUN rev 10'))die(f+' already has rev 10');for(const [id,a,b] of E){s=sub(s,a,b,f+' '+id);did.push(id);}}
 else if(E.some(e=>s.includes(e[1])))die(f+': partial anchors');
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');fs.writeFileSync(B+'/patched/'+f,s);plan.library[f]={base:h(s0),patched:h(s),changes:did};}
for(const x of fs.readdirSync(A))if(x!=='patched'&&!fs.existsSync(B+'/'+x))fs.cpSync(A+'/'+x,B+'/'+x,{recursive:true});
fs.writeFileSync(B+'/plan_FUN10.json',JSON.stringify(plan,null,1)+'\n');const ch=Object.entries(plan.library).filter(e=>e[1].changes.length);console.log(B+': '+Object.keys(plan.library).length+' files, '+ch.length+' changed');
