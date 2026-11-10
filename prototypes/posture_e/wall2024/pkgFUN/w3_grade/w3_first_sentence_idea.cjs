// W3 sketch for pkgFUN rev 5 (not a build): ENFORCED refusal = the FIRST sentence after COUNTED only, cut at . or ! (not : ; - ?), whole-sentence lists P and B of fun4_ref.cjs together,
// or the whole remainder after "COUNTED, but/though/yet/however". A first sentence ending in "?" is never a refusal. A listed sentence later is only NOTED.
const fs=require('fs');const src=fs.readFileSync(__dirname+'/../fun4_ref.cjs','utf8');const body=src.slice(src.indexOf('module.exports=t=>{')+19);
const lists=new Function(body.slice(0,body.indexOf('let c=String(t)'))+'return [P,B];')();const ALL=[...lists[0],...lists[1]];
const prep=t=>String(t).replace(/"[^"\n]*"|“[^”\n]*”/g,' ').replace(/[*_\x60\[\]]+/g,' ').trim().replace(/^COUNTED["'”’]*\s*/i,'');
const clean=s=>s.replace(/^[\s,.:;–—-]*(?:(?:but|though|although|yet|however|and|still|so|then)[\s,]+)?/i,'').replace(/[\s,.]+$/,'');
const enforced=t=>{const c=prep(t);const m=c.match(/^[\s,.:;–—-]*([^.!?]*)([.!?]|$)/);if(!m||m[2]==='?')return false;const s=clean(m[1]);return !!s&&ALL.some(r=>r.test(s));};
const noted=t=>!enforced(t)&&require(__dirname+'/../fun4_ref.cjs')(t);
module.exports={enforced,noted};
if(require.main===module){const ev=(f,n)=>{const s=fs.readFileSync(__dirname+'/'+f,'utf8');const i=s.indexOf('const '+n+'=[');return eval(s.slice(i+('const '+n+'=').length,s.indexOf('];',i)+1));};const J=f=>JSON.parse(fs.readFileSync(__dirname+'/'+f,'utf8'));
 const good=[...ev('w3_plant_FUN.cjs','GOOD'),...J('w3_good2.json'),...ev('w3_plant_FUN3.cjs','GOOD'),...J('w3_good4.json')],bad=[...ev('w3_plant_FUN.cjs','BAD'),...J('w3_bad2.json'),...ev('w3_plant_FUN3.cjs','BAD'),...J('w3_bad4.json')];
 const gw=good.filter(enforced),bm=bad.filter(x=>!enforced(x));console.log('W3 tables: '+good.length+' correct answers, '+gw.length+' read as refusal; '+bad.length+' refusals, '+bm.length+' read CURED ('+bm.filter(noted).length+' of them noted)');gw.forEach(x=>console.log('  GOOD refused | '+x));bm.forEach(x=>console.log('  BAD cured'+(noted(x)?' (noted)':'')+' | '+x));
 let n=0,cr=0,rc=0,nt=0;const strip=s=>String(s).replace(/^(?:[\s*_\x60"'“”‘’>\[\]]+|[-•]\s+|\d{1,2}[.)]\s+|(?:ANSWER|RESPONSE)\s*:\s*)+/i,'');for(const l of fs.readFileSync(__dirname+'/../w2_testset/cases.txt','utf8').split('\n')){if(!l||l.startsWith('#'))continue;const [exp,cat,txt]=l.split('|');const c=strip(txt.replace(/\\n/g,'\n').split('\n')[0]);if(!/^COUNTED\b/.test(c))continue;n++;const r=enforced(c);if(exp==='CURED'&&r){cr++;console.log('  W2 correct refused | '+txt);}if(exp==='UNCURED'&&!r){rc++;if(noted(c))nt++;console.log('  W2 refusal cured'+(noted(c)?' (noted)':'')+' | '+txt);}}
 console.log('W2 set, '+n+' cases that open with COUNTED on the RESPONSE line: '+cr+' correct refused; '+rc+' refusals read CURED ('+nt+' noted)');}
