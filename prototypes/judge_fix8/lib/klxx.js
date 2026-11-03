// judge_fix8 R11 (run 32306, Worker_E B1, Worker_G1 #8: the defender's round 1 rested "overshadow" on "the Greek Old Testament ... (Exodus
// 40:35)"; GLM and ChatGPT named it; Gemini wrote "No citation errors or Septuagint references occurred"). lxxScan reads the debaters' rounds for a
// sentence that rests a reading on the Septuagint (Septuagint, LXX, the Greek Old Testament or Greek translation) beside a verse reference and
// does not itself refuse it as footing. The scan is served to the judges with the pre-check; K-LXX (TRIAL) marks a judge whose text says no
// Septuagint reading or reference occurred while the scan found one. Cure: a STATEMENT for the item naming the Septuagint (or LXX, or the Greek
// Old Testament) with the round and words of the round quoted, or a RESTATED CITATION CHECK line that names it.
const LXX_RX=/\bSeptuagint\b|\bLXX\b|\bGreek\s+Old\s+Testament\b|\bGreek\s+(?:translation|version)\s+of\s+the\s+(?:Old\s+Testament|Hebrew)\b/i;
const LXX_REFUSE=/\bnot\s+(?:the\s+Hebrew|footing|a\s+KJV)|\bis\s+not\b|\brefus|\bno\s+weight\b|\bstrik|\bwithdr[ae]w|\bnot\s+(?:rest|stand)|\bcannot\b|\bnever\b/i;
function lxxScan(R){const out=[];for(const rk of ['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4']){const t=String((R&&R[rk])||'');if(!t)continue;
  for(const s0 of t.replace(/[*_]+/g,'').split(/\n+|(?<=[.!?]["”’']?)\s+(?=[A-Z\[(])/)){const s=s0.trim();if(!LXX_RX.test(s)||LXX_REFUSE.test(s))continue;const ref=(s.match(/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/)||[])[0];if(!ref)continue;
   out.push({round:rk,ref,s:s.replace(/\s+/g,' ').slice(0,200)});}}
 return out;}
function lxxLine(R){const L=lxxScan(R);return 'SEPTUAGINT SCAN (computed by the system, not by a model): '+(L.length?L.map(x=>'['+x.round+'] rests a reading on the Greek Old Testament at '+x.ref+': "'+x.s.replace(/"/g,"'")+'"').join('; ')+'. A Septuagint reading is a citation error for either side: name it at the citation check.':'no round rests a reading on the Septuagint.');}
const LXX_DENY=/\bno\b[^.\n]{0,60}\b(?:Septuagint|LXX)\b[^.\n]{0,60}\b(?:occurred|occur|found|appear(?:ed|s)?|made|cited|used|references?|readings?)\b|\b(?:Septuagint|LXX)\b[^.\n]{0,40}\b(?:none|not\s+(?:cited|used|found|occur))\b|\bno\s+(?:Septuagint|LXX)\b/i;
function drvLxx(text,ptext){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};const L=lxxScan(ciRounds(ptext));if(!L.length)return {items,marks};
 const T=netUnwrap(text).replace(/[*_`]+/g,'');const m=T.match(LXX_DENY);if(!m)return {items,marks};const side=/^C/.test(L[0].round)?'DEFENDER':'CHALLENGER';
 const line=(T.split('\n').find(l=>LXX_DENY.test(l))||m[0]).trim();
 items.push({rule:'K-LXX',side,link:'CITATION CHECK',line,lxx:L});
 marks.push('[AUDIT v27: DEBATE RULE VIOLATION (K-LXX) -- CITATION CHECK: the text says no Septuagint reading occurred ("'+m[0].replace(/[\[\]"]/g,'').slice(0,120)+'"), but the system scan found '+L.map(x=>'['+x.round+'] at '+x.ref).join(', ')+'. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');
 return {items,marks};}
