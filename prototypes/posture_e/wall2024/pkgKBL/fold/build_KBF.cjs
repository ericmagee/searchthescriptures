// pkgKBL fold (W1, 11-09; W3 grade 3490 note a, inside the approved Strong's-number [L2] form): the meaning in "word (G4905, Cohabit ...)" or
// "word (Cohabit ..., G4905)" may start with a capital letter. One substitution in the pkgKBL lb.strong line: the meaning's first letter [a-z] -> [A-Za-z].
// Base: live s75 (library strip_WLG = Shared Library ed1ec6fb07c0; non-library nodes from fetchback_live_s75). Run from wall2024/: node pkgKBL/fold/build_KBF.cjs
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const OLD=String.raw`(?:[GH]\d{1,5}\s*[,:;]\s*["“'‘]?[a-z][^()\n]{1,80}?|["“'‘]?[a-z][^()\n\d]{1,80}?["”'’]?\s*[,;]\s*[GH]\d{1,5})`;
/* rev 3 (W3 3535): a capital starts a meaning only as a title-case word that is not a layer tag or marker, a language, lexicon or source label, or a
   Bible book name or abbreviation; after a Strong's number the capitalized meaning also carries no digit (no verse reference). */
const CAPX=String.raw`(?!(?:Greek|Hebrew|Heb|Gr|Grk|Aramaic|Strong|Strongs|Thayer|Mounce|Vine|Vines|Gesenius|Brown|Lexicon|None|Link|Layer|Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation|Esdras|Tobit|Judith|Wisdom|Sirach|Ecclesiasticus|Baruch|Maccabees|Susanna|Manasses|Bel|Gen|Exod?|Lev|Num|Deut|Josh|Judg|Sam|Kgs|Chr|Neh|Esth|Psa?|Prov|Eccl?|Eccles|Isa|Jer|Lam|Ezek|Dan|Hos|Obad|Mic|Nah|Hab|Zeph|Hag|Zech|Mal|Matt?|Mt|Mk|Lk|Jn|Rom|Cor|Gal|Eph|Phil|Col|Thess|Tim|Tit|Philem|Heb|Jas|Pet|Rev|Esd|Tob|Jdt|Wis|Sir|Bar|Macc)\b)[A-Z][a-z]`;
const CAP1=String.raw`(?:[a-z]|(?![^()\n]*\d)`+CAPX+`)`, CAP2=String.raw`(?:[a-z]|`+CAPX+`)`;
const NEW=String.raw`(?:[GH]\d{1,5}\s*[,:;]\s*["“'‘]?`+CAP1+String.raw`[^()\n]{1,80}?|["“'‘]?`+CAP2+String.raw`[^()\n\d]{1,80}?["”'’]?\s*[,;]\s*[GH]\d{1,5})`;
const SRC='pkgLIB/'+(process.env.KBF_LIB_BASE||'strip_WLG')+'/patched/',DST='pkgLIB/strip_KBF/patched/',ND='pkgKBL/fold/patched/'; /* base library: live s75 = strip_WLG (Shared Library ed1ec6fb07c0) */
const W=JSON.parse(fs.readFileSync(process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s75.json','utf8'));
const plan={base:{library:SRC,nodes:process.argv[2]||'fetchback_live_s75.json'},library:{},nodes:{},tally:0};
const apply=(s0,f)=>{const n=s0.split(OLD).length-1;if(n>2)throw new Error(f+' x'+n);if(!n)return [s0,0];const s=s0.split(OLD).join(NEW);new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.tally+=n;return [s,n];};
fs.rmSync('pkgLIB/strip_KBF',{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});fs.rmSync(ND,{recursive:true,force:true});fs.mkdirSync(ND,{recursive:true});
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');const [s,n]=apply(s0,f);if(n)plan.library[f]={base:h(s0),patched:h(s),hits:n};fs.writeFileSync(DST+f,s);}
for(const nd of W.nodes){const c=nd.parameters&&nd.parameters.jsCode;if(!c||nd.name==='Shared Library'||!/function lbFoot/.test(c))continue;const [s,n]=apply(c,nd.name);if(!n)throw new Error(nd.name+': lb.strong line not found');
 const f=nd.name.replace(/ /g,'_')+'.js';fs.writeFileSync(ND+f,s);plan.nodes[nd.name]={base:h(c),patched:h(s),hits:n};}
fs.writeFileSync('pkgKBL/fold/plan_KBF.json',JSON.stringify(plan,null,1)+'\n');console.log('library',Object.keys(plan.library).length,'nodes',Object.keys(plan.nodes).length,'tally',plan.tally);
