// Loads the live reader library (n8n 83ef4d98, Alternate Merge node, the shared library above the node body) so the
// adapters call the exact old readers, not copies. Source: pkgKY/patched/Alternate_Merge.js (W2 b6861d0, reproduced by W1).
const fs=require('fs'),path=require('path');
const SRC=path.join(__dirname,'..','..','pkgKY','patched','Alternate_Merge.js');
const src=fs.readFileSync(SRC,'utf8');
const cut=src.indexOf('\nconst AM=$(');if(cut<0)throw new Error('library end marker not found');
const lib=src.slice(0,cut);
const NAMES=['rcLines','sbLabel','KF_LINE','KR_LINE','SB_FORM','SB_ROW','GATE_LINE','CURE_KEY','CI_LINE','CI_PRESSED','ciForm','cureJText','cureLines','kagRow','selfLines421','kcmtGrade2024','krulLines2024','KRUL_BAD','gateRead2024','gateLineFor2024','sbApply2024'];
const L=new Function('$','$input',lib+'\nreturn {'+NAMES.map(n=>n+':typeof '+n+'!=="undefined"?'+n+':undefined').join(',')+'};')(()=>{throw new Error('$ not available offline');},null);
for(const n of NAMES)if(L[n]===undefined)throw new Error('missing '+n);
// Inline regexes inside sbApply2024, read from its source so they stay the live ones.
const sb=String(L.sbApply2024);
const grab=name=>{const m=sb.match(new RegExp('const '+name+'=(/(?:\\\\/|[^/\\n])+/[a-z]*);'));if(!m)throw new Error('inline '+name+' not found');return eval(m[1]);};
L.GR=grab('GR');L.PR=grab('PR');L.FR=grab('FR');
{const m=sb.match(/P\.key\.u\.match\((\/\^KEYSTONE(?:\\\/|[^/\n])+\/[a-z]*)\)/);if(!m)throw new Error('keyChecks KEYSTONE regex not found');L.KEY_RX=eval(m[1]);}
{const s=String(L.cureLines);const m=s.match(/CORRECTED RESULT'&&\(m=r\.match\((\/(?:\\\/|[^/\n])+\/[a-z]*)\)/);if(!m)throw new Error('CORRECTED RESULT regex not found');L.CR_RX=eval(m[1]);}
L.SOURCE=SRC;
module.exports=L;
