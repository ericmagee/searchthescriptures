// ASK 386 offline replay: the section 8 decider over stored judgments, against today's SQL word and the body RESULT line.
const N=['__RL','cureUnwrap','cureSafe','rcObjEnd','cureJText','rcLines'];const X=require('./libpick.cjs')(process.argv[2]||'../rdf/fetchback_w384.json','Panel Cure Check',N);const K=X.get(...N);
const J=require(process.argv[3]||'../a384/judgments_all.json');
const RW=/(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/;
function rd386(i){const w=String(i.verdict||'').toUpperCase().replace(/-\d$/,'');
 if(!/^(HELD|BROKEN|PARTIAL)$/.test(w))return {word:null,why:'no verdict'};let r;
 if(w==='BROKEN')r='CHALLENGER WINS';else if(w==='PARTIAL')r='UNDERDETERMINED';
 else{if(!i.cst)return {word:null,why:'no challenge standing'};r=(i.cst!=='SELF-SUPPORTED'||i.col.some(z=>z.grade==='CHALLENGER LINK BROKEN'))?'DEFENDER WINS':'UNDERDETERMINED';}
 const tie=!i.col.some(z=>!z.grade)&&!i.col.some(z=>/LINK BROKEN$/.test(String(z.grade||'')))&&i.dst===i.cst&&i.cd===i.cc;
 if(tie&&(r==='DEFENDER WINS'||r==='CHALLENGER WINS'))return {word:'UNDERDETERMINED',tie:true};return {word:r,tie:false};}
function sqlWord(raw,seat,cst){const m=raw.match(/\[AUDIT v21: CORRECTED RESULT -- SEAT: ([^;\]]*); ORIGINAL: (\w+); COUNTED: (\w+) \([A-Z]+-[0-9]\)(?:; RETRACTED: ([^\]]*))?\]/);
 if(!m||m[1]!==seat||m[2]===m[3]){const r=raw.match(/RESULT[ \t*_]*:[ \t*_]*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/);return r?r[1]:null;}
 if(m[3]==='BROKEN')return 'CHALLENGER WINS';if(m[3]!=='HELD')return 'UNDERDETERMINED';const ret=(m[4]||'').trim().split(/\s*,\s*/);
 const re=/(?:^|\n|\\n)[ \t*_>-]*(D[0-9]+ vs C[0-9]+)[^\n\\]*?:[ \t*_]*CHALLENGER LINK BROKEN/g;let x,clb=false;while((x=re.exec(raw)))if(ret.indexOf(x[1])<0)clb=true;
 return ((cst||'SELF-SUPPORTED')!=='SELF-SUPPORTED'||clb)?'DEFENDER WINS':'UNDERDETERMINED';}
const DB={};for(const r of require('./dbcols.json'))DB[r[0]]={verdict_tag:r[1],defense_standing:r[2],challenge_standing:r[3],conceded_links:r[4],challenger_conceded_links:r[5],seat:r[6]};
const out=[];const cnt={};const inc=k=>cnt[k]=(cnt[k]||0)+1;
for(const j of J){const raw=j.v;let F={};try{const a=raw.indexOf('{');const b=K.rcObjEnd(raw,a);F=JSON.parse(raw.slice(a,b));}catch(e){}
 if(!F||!F.verdict_tag){F={};const g=(k,n)=>{const m=raw.match(new RegExp('"'+k+'"\\s*:\\s*'+(n?'(\\d+)':'"([A-Z-]+)"')));return m?(n?+m[1]:m[1]):undefined;};F={verdict_tag:g('verdict_tag'),defense_standing:g('defense_standing'),challenge_standing:g('challenge_standing'),conceded_links:g('conceded_links',1),challenger_conceded_links:g('challenger_conceded_links',1),_rx:true};}
 const head=F;if(DB[j.id]){F=DB[j.id];if(head.verdict_tag!==F.verdict_tag)inc('head verdict differs from column');}
 const t=K.cureJText(raw,true);const P=K.rcLines(t);const bodyRes=String(t).split('\n').map(l=>l.replace(/[*_`]+/g,'').trim()).filter(l=>/^RESULT\s*:/i.test(l));
 const bw=P.result?((P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null;
 const d=rd386({verdict:F.verdict_tag,cst:F.challenge_standing,dst:F.defense_standing,cd:F.conceded_links,cc:F.challenger_conceded_links,col:P.col});
 const s=sqlWord(raw,j.seat,F.challenge_standing);const unread=P.col.filter(z=>!z.grade).length;
 const eng=/recomputed after the cure|derived after the send-back/i.test(P.result?P.result.raw:'');const v25=/\[AUDIT v25:/.test(raw),v37=/\[AUDIT v37:/.test(raw);
 const path=v37?'b':v25?'a':'c';
 const r={id:j.id,seat:j.seat,verdict:F.verdict_tag,cst:F.challenge_standing,dst:F.defense_standing,cd:F.conceded_links,cc:F.challenger_conceded_links,path,sql:s,body:bw,dec:d.word,tie:d.tie,why:d.why||null,unread,nres:bodyRes.length,engLine:eng};out.push(r);
 inc('path '+path);if(d.word!==s)inc('dec != sql');if(d.word!==bw)inc('dec != body');if(d.word!==s)inc('dec != sql, path '+path);if(bodyRes.length>1)inc('body RESULT lines > 1');if(!bodyRes.length)inc('no body RESULT line');if(d.word==null)inc('dec null');if(unread)inc('seats with unread collisions');if(d.word!==s&&unread)inc('dec != sql with unread');}
require('fs').writeFileSync(__dirname+'/replay386_out.json',JSON.stringify(out));console.log(JSON.stringify(cnt,null,1));
module.exports={rd386,sqlWord};
