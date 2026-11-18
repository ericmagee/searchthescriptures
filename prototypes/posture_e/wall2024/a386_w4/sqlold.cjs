// today's judgment_result_word, ported to JS line for line
function sqlWord(raw,seat,cst){const m=raw.match(/\[AUDIT v21: CORRECTED RESULT -- SEAT: ([^;\]]*); ORIGINAL: (\w+); COUNTED: (\w+) \([A-Z]+-[0-9]\)(?:; RETRACTED: ([^\]]*))?\]/);
 if(!m||m[1]!==seat||m[2]===m[3]){const r=raw.match(/RESULT[ \t*_]*:[ \t*_]*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/);return r?r[1]:null;}
 if(m[3]==='BROKEN')return 'CHALLENGER WINS';if(m[3]!=='HELD')return 'UNDERDETERMINED';const ret=(m[4]||'').trim().split(/\s*,\s*/);
 const re=/(?:^|\n|\\n)[ \t*_>-]*(D[0-9]+ vs C[0-9]+)[^\n\\]*?:[ \t*_]*CHALLENGER LINK BROKEN/g;let x,clb=false;while((x=re.exec(raw)))if(ret.indexOf(x[1])<0)clb=true;
 return ((cst||'SELF-SUPPORTED')!=='SELF-SUPPORTED'||clb)?'DEFENDER WINS':'UNDERDETERMINED';}
module.exports={sqlWord};
