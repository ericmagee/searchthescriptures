/* pkgETC (W2; coordinator 14:20Z on Eric 08:19 CST; 33311 rows 13335, 13350): a DeepSeek enforcer verdict whose "right:" label contradicts the ruling its
   own reason concludes. Returns the concluded ruling (string) when they contradict, else null. Quoted words are masked first, so a quote is never read as
   the enforcer's conclusion. Only an explicit conclusion counts: "the correct/right ruling is R", or "so/therefore/thus/hence ... is R" not followed by "but". */
const ETC=(rule,tag,why)=>{if(!tag||!why)return null;
 const w=String(why).replace(/"[^"]*"|“[^”]*”/g,' ').replace(/(^|[\s(])'[^']{3,}?'(?=[\s,.;:)]|$)/g,'$1 ');
 const R='(?:not\\s+|does\\s+not\\s+)?(?:counted|unexhibited|spared|void|meets|misses|broken|stands|underdetermined|follows|follow|true|overstated)';
 const NX='\\b(?!\\s+(?:follows|does\\s+not\\s+follow))';
 const P=[new RegExp('(?:correct|right|proper|true)\\s+(?:ruling|grade|reading|result)\\s+(?:is|would\\s+be|was)\\s+('+R+')'+NX,'i'),
  new RegExp('\\b(?:so|therefore|thus|hence)\\b[^.;]{0,80}?\\b(?:is|are|stands|remains|should\\s+be|must\\s+be)\\s+('+R+')'+NX+'(?![^.;]*\\bbut\\b)','i'),
  new RegExp('\\b(?:so|therefore|thus|hence)\\b[^.;]{0,80}?\\b(?:it|the\\s+answer|the\\s+grade|the\\s+line|the\\s+keystone|the\\s+collision|the\\s+result|the\\s+conclusion)\\s+((?:does\\s+not\\s+)?(?:meets|misses|stands|follows|follow))'+NX+'(?![^.;]*\\bbut\\b)','i')];
 let c=null;for(const p of P){const m=w.match(p);if(m){c=m[1].toUpperCase().replace(/\s+/g,' ');break;}}if(!c)return null;
 const neg=/^(?:NOT|DOES NOT) /.test(c);const base=c.replace(/^(?:NOT|DOES NOT) /,'').replace(/^UNEXHIBITED$/,'COUNTED').replace(/^FOLLOW$/,'FOLLOWS');
 const B3=['BROKEN','STANDS','UNDERDETERMINED'];const F={'E-ANS':['MEETS','MISSES'],'E-COL':B3,'E-HOLD':B3,'E-KEY':B3,'E-PREM':['COUNTED','SPARED','VOID'],'E-RES':['FOLLOWS'],'E-SYN':['TRUE','OVERSTATED'],'E-VOID':['VOID']}[rule];
 if(!F||!F.includes(base))return null;const t=String(tag).toUpperCase().replace(/\s+/g,' ');
 if(neg)return base===t?c:null;
 if(base===t)return null;if(t==='NOT VOID'&&(base==='SPARED'||base==='COUNTED'))return null;return c;};
