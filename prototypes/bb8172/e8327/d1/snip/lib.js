// BB-8327 D1 and D2 (WALL-1908 as amended; his word at BB-8342): the chain-stating net, K-C. Source: e8327/s_net.js.
const NET_STATE=[
 /\b(?:do|does|did)\s+not\s+(?:\S+\s+){0,4}?(?:state|name|deny|assert)s?\b/i,
 /\bin\s+(?:its|their)\s+own\s+words\s+(?:state|name|assert|deny)s?\s+no\b/i,
 /\bnot\s+stated\b/i,
 /\bunstated\b/i,
 /\b(?:never|neither|nor)\s+(?:names?|states?)\b/i,
 /\bnone\s+of\s+(?:those|them|these|the)\b[^;.]*?\b(?:states?|names?)\b/i,
 /\bno\s+(?:verse|witness|row|passage)s?\s+(?:\S+\s+){0,3}?(?:states?|names?)\b/i,
 /\bnames?\s+no\b/i,
 /\bnames?\b[^;.]{0,60}?\b(?:rather\s+than|not)\b[^;.]{0,30}?\bbegett/i,
 /\bstating\b[^;.]{0,40}?\bin\s+(?:its|their)\s+own\s+words\b/i];
// A clause that reports what a side itself stated or granted is that side's statement, not the judge's ground.
const NET_REPORT=/\b(?:stated|granted|says|said|conceded|argued|admitted)\s+that\b/i;
// 1909 (b): a clause that answers a side's own claim that a named verse says what it does not ("the challenger reads Matthew 1:16
// as saying that Joseph begat Jesus, but the verse does not state that") is the judge answering an overclaim, not the stating test.
const NET_CLAIM=/\b(?:challenger|defender)\s+(?:reads|read|claims|claimed|says|said|argues|argued|takes|took|holds|asserts|asserted|presses|pressed)\b[^;]{0,160}?\b(?:as\s+(?:saying|stating|meaning)|to\s+(?:say|state|mean))\b/i;
const NET_PLURAL=/\b(?:rows|verses|witnesses|speeches|they|these|those|them|none|neither|read\s+together|idiom)\b|\bno\s+(?:verse|witness|row)\b|\b(?:\d?\s?[A-Z][a-z]+\s+\d+:\d+)[^;.]{0,40}?\band\s+(?:\d?\s?[A-Z][a-z]+\s+)?\d+:\d+/;
const NET_HEAD=/^(RESULT|KEYSTONE|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:/;
const NET_SKIP=/^(?:CLAUSE|CITATION CHECK|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK|COLLISION POINTS)\b/i;
// The side whose rows are set aside: read from the subject, the words just before the stating ground; else the C side.
function netSide(cl,at){const sub=cl.slice(Math.max(0,at-90),at);if(/\bneither\s+side|\bboth\s+(?:sides|chains)|\beither\s+way\b/i.test(cl))return 'BOTH';
 const d=sub.search(/\bdefender/i),c=sub.search(/\bchallenger/i);if(d<0&&c<0)return 'CHALLENGER';return d>c?'DEFENDER':'CHALLENGER';}
function netUnwrap(text){let t=String(text||'');const s=t.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const j=JSON.parse(s.slice(0,i+1));if(j&&typeof j.reasoning==='string')return j.reasoning;}catch(e){}}return t;}
function netLines(text,links){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');const L=Array.isArray(links)?new Set(links.map(x=>String(x).toUpperCase())):null;
 let inOOR=false,first=true;
 for(const raw of T.split('\n')){const line=raw.trim();if(!line)continue;const u=line.toUpperCase();
  if(/^OUT-OF-ROUND CONCESSIONS\b/.test(u)){inOOR=true;continue;}
  if(inOOR){if(/^(?:DEFENDER|CHALLENGER)\s*\|/.test(u)||/^NONE\b/.test(u))continue;inOOR=false;}
  if(/^(?:DEFENDER|CHALLENGER)\s*\|/.test(u)||line[0]==='['){first=false;continue;}
  let item=null,vs=false;
  const mc=u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+)(?:\s+VS\.?\s+(C\d+))?\b/);
  const mh=u.match(NET_HEAD);
  if(mc){item=mc[1]+(mc[2]?' vs '+mc[2]:'');vs=!!mc[2]&&(!L||L.has(mc[2]));}
  else if(mh)item=mh[1];
  else if(first)item='REASONING';
  first=false;
  if(!item||NET_SKIP.test(u))continue;
  const clauses=line.split(/;|(?<=[.!?])\s+(?=[A-Z\[])|\s--\s|\s—\s/);
  for(const cl of clauses){if(!NET_STATE.some(rx=>rx.test(cl)))continue;
   const hit=NET_STATE.find(rx=>rx.test(cl));const at=cl.search(hit);if(NET_REPORT.test(cl.slice(0,at))||NET_CLAIM.test(cl.slice(0,at)))continue;
   if(!vs&&!NET_PLURAL.test(cl))continue;
   out.push({item,side:netSide(cl,at),line});break;}}
 return out;}
// BB-8327 D1 (q3): the chain a K-C line set aside, quoted from the judge's prompt; both chains on a collision line.
// DEFENDER: the numbered lines under its first "DECLARED CHAIN" heading. CHALLENGER: the premises the ledger lists against it
// ("AGAINST THE CHALLENGER, answered in [DR3]:"), which are the challenger's links as [DR3] answers them. Neither found: said so.
function drvChainOf(ptext,side){const t=String(ptext||'');const cut=s=>{s=s.replace(/[*_`#]+/g,'').replace(/\s+/g,' ').trim();return s.length>110?s.slice(0,107)+'...':s;};
 if(side==='DEFENDER'){const i=t.search(/DECLARED CHAIN\b/);if(i<0)return null;const L=[];
  for(const l of t.slice(i).split('\n').slice(1)){const m=l.match(/^\s*(\d+)[.)]\s+(\S.*)$/);if(m){L.push('LINK '+m[1]+' -- '+cut(m[2]));continue;}if(L.length&&l.trim())break;}
  return L.length?{where:'DECLARED CHAIN',links:L}:null;}
 const i=t.indexOf('AGAINST THE CHALLENGER, answered in [DR3]:');if(i<0)return null;const k=t.indexOf('A verse marked NOT NAMED',i);
 const L=t.slice(i,k<0?t.length:k).split('\n').map(l=>l.trim()).filter(l=>/^premise \d+/.test(l)).map(l=>{const m=l.match(/^premise (\d+)(?: \(LINK \d+\))?:\s*(.*)$/);return 'C'+m[1]+' -- '+cut(m[2].replace(/\s*NOT NAMED:.*$/,''));});
 return L.length?{where:'LEDGER [DR3]',links:L}:null;}
function drvChains(ptext,x){const sides=(/ vs C\d+$/.test(x.link)||x.side==='BOTH')?['DEFENDER','CHALLENGER']:[x.side||'CHALLENGER'];
 return sides.map(sd=>{const c=drvChainOf(ptext,sd);return sd+' CHAIN'+(c?' ('+c.where+'): '+c.links.join('; '):': not found in the prompt; weigh its links as the rounds give them');}).join(' || ');}
