// pkgWLD rev 2 (W2, 11-09): the answer reader missed a list item that names several verses, each with its quoted words, before the named verse
// (33617 CR3: "- **Isaiah 8:3** "I went ...", **Isaiah 8:18** "for signs ...", **Isaiah 7:16**, ..." under "Answers to the presses on LINK 4").
// The refs-only prefix now allows a quoted phrase after each verse and the opening bold of the verse itself. Base: live s71 (Panel Build, BIV).
// Run from wall2024/: node pkgWLD/rev2/build_WLD2.cjs [base=/mnt/project-files/wall2024/fetchback_live_s71.json]
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync(process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s71.json','utf8'));
const OLD=String.raw`[*_]*\s*(?:,|;|and|&)?\s*)*$/.test(before))return false;`;
const NEW=String.raw`[*_]*\s*(?:"[^"\n]{0,200}"|“[^”\n]{0,200}”)?\s*(?:,|;|and|&)?\s*)*[*_]*$/.test(before))return false; /* pkgWLD rev 2: verses with their quoted words may precede */`;
fs.mkdirSync('pkgWLD/rev2/patched',{recursive:true});const plan={};
for(const n of ['Panel Build','Build Independent Verdict']){const c0=W.nodes.find(z=>z.name===n).parameters.jsCode;const k=c0.split(OLD).length-1;if(k!==1)throw new Error(n+': anchor x'+k);
 const c=c0.replace(OLD,NEW);new Function('$','$input','$execution','return (async()=>{\n'+c+'\n})();');fs.writeFileSync('pkgWLD/rev2/patched/'+n.replace(/ /g,'_')+'.js',c);plan[n]={before:h(c0),after:h(c)};}
fs.writeFileSync('pkgWLD/rev2/plan_WLD2.json',JSON.stringify(plan,null,1)+'\n');console.log(JSON.stringify(plan));
