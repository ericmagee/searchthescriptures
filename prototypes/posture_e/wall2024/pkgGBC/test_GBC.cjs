// pkgGBC (narrow) tests: gbcFlip copied byte for byte (with rcLines) from the patched node, on the stored 33006 and 33311 collision lines.
// No saved node inputs exist for 33006 or 33311, so the full gateCure2024 positive replay waits on W4 saving 33311.
const fs=require('fs');const {closure}=require('../pkgEPK/lib_extract.cjs');const DIR=process.argv[2]||'pkgGBC/patched';
let ok=0,bad=0;const t=(n,c,x)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n,x||'');}};
for(const node of ['Gate_Record','Alt_Gate_Record','Gate_Build','Alternate_Merge_Seat']){const code=fs.readFileSync(DIR+'/'+node+'.js','utf8');const gbcFlip=new Function(closure(code,['gbcFlip']).text+';return gbcFlip;')();
 const c06a='D2 vs C4 (Matthew 1:19): CHALLENGER LINK BROKEN (Commitment 5) -- Matthew 1:19 says "not willing to make her a publick example, was minded to put her away privily"; Matthew 1:18 says "she was found with child". GROUND: The challenger did not meet the pressed meaning about whose child occasioned the mercy.';
 const c06b='D2 vs C4 (Matthew 1:19): DEFENDER LINK BROKEN (Commitment 5) -- Matthew 1:19 says "being a just [man], and not willing to make her a publick example, was minded to put her away privily"; Matthew 1:20 says "fear not to take unto thee Mary thy wife". GROUND: The defender left the pressed meaning unanswered.';
 const k06='ANSWER GROUND|MATTHEW 1:19|DR3|D2 VS C4';
 t(node+' 33006 chatgpt G1: grade flipped (with the change DEFENDER LINK BROKEN, without it CHALLENGER LINK BROKEN): tied',gbcFlip(k06,'KEYSTONE: D6 -- BROKEN\n'+c06b,'KEYSTONE: D6 -- BROKEN\n'+c06a)===true);
 const c11a='D4 vs C4 (Matthew 1:25): CHALLENGER LINK BROKEN -- challenger claims Joseph knew Mary during espousal (Commitment 3) -- GROUND: [L1] Matthew 1:25 "And knew her not till she had brought forth her firstborn son" | [L2] heōs (G2193, until) | [L3] Matthew 1:18 "before they came together, she was found with child of the Holy Ghost."';
 const c11b=c11a.replace('[L3] Matthew 1:18 "before they came together, she was found with child of the Holy Ghost."','[L3] Genesis 4:1 "And Adam knew Eve his wife; and she conceived, and bare Cain"');
 t(node+' 33311 gemini G13: ground-only swap, grade unchanged: not tied (RECORD-ONLY)',gbcFlip('ANSWER GROUND|GENESIS 4:1|CR3|D4 VS C4',c11b,c11a)===false);
 t(node+' N1 the named collision is absent from one text: not tied',gbcFlip(k06,c06b,'KEYSTONE: D6 -- BROKEN')===false);
 t(node+' N2 a key with no collision part: not tied',gbcFlip('ANSWER GROUND|MATTHEW 1:19|DR3',c06b,c06a)===false);
 t(node+' N3 a flip on another collision does not tie this key',gbcFlip('ANSWER GROUND|MATTHEW 1:19|DR3|D3 VS C4',c06b,c06a)===false);}
console.log(ok+' OK, '+bad+' FAIL ('+DIR+')');process.exit(bad?1:0);
