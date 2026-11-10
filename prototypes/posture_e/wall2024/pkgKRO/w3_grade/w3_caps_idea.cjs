// W3 sketch beside the grade of pkgKRO rev 1 (not a package): reader-level count of a variant that takes only the keyword in CAPITALS.
const fs=require('fs');
const strict=rp=>{const c0=String(rp).replace(/^[\s*_\x60"'“”‘’>]+/,'');return /^COUNTED[*_\x60"'”’]*\s*(?:$|[.:;,!]|--|—|–)/.test(c0)&&!/\b(?:not|never|no|nor|cannot|neither|none)\b|n['’]t\b/i.test(c0.split(/[.;!?](?:\s|$)/)[0]);};
const kro=rp=>{const c0=String(rp).replace(/^[\s*_\x60"'“”‘’>]+/,'');return strict(rp)||(/(?<![A-Za-z])COUNTED(?![A-Za-z])/i.test(rp)&&!/^NOT\s+COUNTED\b/i.test(c0)&&!/\bTOUCHES\s+NO\s+LINK\b/i.test(rp));};
const caps=rp=>strict(rp)||(/(?<![A-Za-z])COUNTED(?![A-Za-z])/.test(rp)&&!/\bNOT\s+COUNTED\b/.test(rp)&&!/\bTOUCHES\s+NO\s+LINK\b/i.test(rp));
const sets=[];
for(const f of ['pkgFUN/w2_testset/cases.txt','pkgFUN/w4_grade6/w4_all59.txt']){for(const l of fs.readFileSync(f,'utf8').split('\n').filter(l=>l&&!l.startsWith('#'))){const p=l.split('|');sets.push([p[0],p.slice(2,p.length-2).join('|').replace(/\\n/g,'\n').split('\n')[0],f]);}}
for(const f of fs.readdirSync('pkgFUN/w3_grade').filter(x=>/^w3_good.*json$/.test(x)))for(const t of JSON.parse(fs.readFileSync('pkgFUN/w3_grade/'+f)))sets.push(['CURED',t.split('\n')[0],'w3good']);
for(const t of JSON.parse(fs.readFileSync('pkgKRO/w3_grade/w3_bad_kro.json')))sets.push(['UNCURED',t,'w3badkro']);
for(const t of JSON.parse(fs.readFileSync('pkgKRO/w3_grade/w3_good_kro.json')))sets.push(['CURED',t,'w3goodkro']);
const tally=(nm,f)=>{let gr=0,gl=0,rc=0,g=0,r=0;for(const [e,t] of sets){if(e==='CURED'){g++;if(!f(t)){gr++;if(strict(t))gl++;}}else{r++;if(f(t))rc++;}}console.log(nm.padEnd(18),'correct',g,'not cured',gr,'(cured by live:',gl+')','| refusals',r,'read CURED',rc);};
tally('live strict',strict);tally('pkgKRO rev 1',kro);tally('capitals variant',caps);
for(const [e,t] of sets)if(e==='CURED'&&kro(t)&&!caps(t))console.log('  capitals variant does not cure this correct answer (live does not either):',JSON.stringify(t));
for(const [e,t] of sets)if(e==='UNCURED'&&kro(t)&&!caps(t))console.log('  capitals variant keeps refusing:',JSON.stringify(t));
