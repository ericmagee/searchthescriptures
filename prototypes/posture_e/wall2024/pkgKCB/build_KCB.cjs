// pkgKCB (W3; coordinator 00:20Z 11-10, from my note on Wall 3831: a K-S3 answer "COUNTED, but that is wrong." reads CURED).
// Base: pkgLIB/strip_FCD (pkgFUK rev 3 + pkgFCD) with pkgKNL rev 5's knlNone2024 (pkgKNL5/knl5_fn.js) = pkgLIB/strip_KCB_base. Candidate: pkgLIB/strip_KCB.
// So the package carries pkgFUK rev 3, pkgFCD and pkgKNL rev 5, whichever of them is written last.
// Fix (cureVerdicts, the K-S3 COUNTED reading; 26 library files). pkgFUK rev 3 reads COUNTED as CURED when it is the first word, followed by the end or punctuation,
// with no negation in its first sentence. Added: the whole answer must hold
//   (1) no word of refusal or reservation: but, however, though, although, yet, except, unless, wrong*, error*, erroneous, mistak*, incorrect*, inaccurate, false*,
//       refus*, withdraw*/withdrew, retract*, disagree*, protest*, object*, reject*, disput*, deny/denied/denies/denial;
//   (2) no negation followed within two words by right, correct, true, accurate, agree*, accept*, concession, conceded, appl*, counted, count, stand*, valid, hold*, held.
// "not/no/never/n't + dispute, contest, deny, object(ion), doubt, challenge" is read first as no refusal ("COUNTED. I do not dispute it." stays CURED).
// Any answer refused here is UNCURED and asked once by the pkgFUK follow-up (NO REASON section), as every other uncountable K-S3 answer is.
//   node pkgKCB/build_KCB.cjs strip    -> pkgLIB/strip_KCB_base, pkgLIB/strip_KCB, pkgKCB/plan_KCB.json
//   FB=/mnt/project-files/wall2024/fetchback_live_s94.json node gate/pack.cjs pkgLIB/strip_KCB pkgLIB_KCB
//   node pkgFUK/parent_on.cjs /mnt/project-files/wall2024/fetchback_live_s94.json pkgLIB_KCB pkgLIB/strip_KCB pkgKCB/parent_s94_KCB.json
const fs=require('fs'),path=require('path'),cr=require('crypto');const W=path.resolve(__dirname,'..');
const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const sub=(s,a,b,what)=>{const n=s.split(a).length-1;if(n!==1)die(what+': '+n+' hits for '+JSON.stringify(a.slice(0,90)));return s.split(a).join(b);};
const A3=String.raw`&&!/\b(?:not|never|no|nor|cannot|neither|none)\b|n['’]t\b/i.test(c0.split(/[.;!?](?:\s|$)/)[0]))return res('CURED','answered: the close concession is counted',[rp]);} /* pkgFUK rev 3 A (W3 3817): COUNTED only as the first word of the answer, with no negation in its sentence */`;
const A4=String.raw`&&!/\b(?:not|never|no|nor|cannot|neither|none)\b|n['’]t\b/i.test(c0.split(/[.;!?](?:\s|$)/)[0])&&(h0=>!/\b(?:but|however|though|although|yet|except|unless|wrong\w*|error\w*|erroneous\w*|mistak\w*|incorrect\w*|inaccurate\w*|false\w*|refus\w*|withdr[ae]w\w*|retract\w*|disagree\w*|protest\w*|object\w*|reject\w*|disput\w*|den(?:y|ied|ies|ial)\w*)\b/i.test(h0)&&!/(?:\b(?:not|never|no|nor|cannot|neither)\b|n['’]t\b)\s+(?:\S+\s+){0,2}?(?:right|correct|true|accurate|agree\w*|accept\w*|concession|conceded|appl\w*|counted|count|stand\w*|valid|hold\w*|held)\b/i.test(h0))(c0.replace(/(?:\b(?:not|no|never)\b|n['’]t\b)\s+(?:dispute[sd]?|contest(?:ed|s)?|den(?:y|ied|ies)|object(?:ion|ions|ed|s)?|doubt(?:ed|s)?|challenge[sd]?)\b/gi,' ')))return res('CURED','answered: the close concession is counted',[rp]);} /* pkgFUK rev 3 A (W3 3817): COUNTED only as the first word of the answer, with no negation in its sentence */ /* pkgKCB (W3): and no word of refusal or reservation anywhere in the answer ("COUNTED, but that is wrong.") */`;
const NEW=fs.readFileSync(W+'/pkgKNL5/knl5_fn.js','utf8');const HEAD='function knlNone2024(',NEXT='function kfLines(';
const A=W+'/pkgLIB/strip_FCD',B0=W+'/pkgLIB/strip_KCB_base',B=W+'/pkgLIB/strip_KCB';
if(process.argv[2]!=='strip')die('mode strip');for(const x of [B0,B])if(fs.existsSync(x))die(x+' exists');fs.mkdirSync(B0+'/patched',{recursive:true});fs.mkdirSync(B+'/patched',{recursive:true});
const plan={base:'pkgLIB/strip_FCD + pkgKNL5/knl5_fn.js',library:{}};let knl=0;
for(const f of fs.readdirSync(A+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(A+'/patched/'+f,'utf8');let s=s0;const did=[];
 const i=s.indexOf(HEAD);if(i>=0){if(s.indexOf(HEAD,i+1)>=0)die(f+': knlNone2024 twice');const j=s.indexOf(NEXT,i);if(j<0)die(f+': no kfLines after knlNone2024');s=s.slice(0,i)+NEW+s.slice(j);knl++;did.push('KNL5');}
 fs.writeFileSync(B0+'/patched/'+f,s);
 if(s.includes("if(x.rule==='K-S3'){const rp=respOf(x)")){s=sub(s,A3,A4,f+' A');did.push('KCB');}
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');fs.writeFileSync(B+'/patched/'+f,s);plan.library[f]={strip_FCD:h(s0),patched:h(s),changes:did};}
for(const f of fs.readdirSync(A).filter(f=>!fs.statSync(A+'/'+f).isDirectory())){fs.copyFileSync(A+'/'+f,B0+'/'+f);fs.copyFileSync(A+'/'+f,B+'/'+f);}
fs.writeFileSync(__dirname+'/plan_KCB.json',JSON.stringify(plan,null,1)+'\n');const n=Object.values(plan.library);
console.log('strip_KCB_base and strip_KCB: '+n.length+' files; knlNone2024 replaced in '+knl+'; K-S3 reading changed in '+n.filter(x=>x.changes.includes('KCB')).length);
