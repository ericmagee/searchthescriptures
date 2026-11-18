// ASK 410 harness: the live readers, copied from the live nodes (engine 36fcf36b).
// E-ASSUME: Assume Check Record's line regex LN and its verse-words test (VP4N, vp4Quotes of Assume Check Build).
// D4: Judge Enforcer Record's ENFORCER line regex (seat-first form and bare-number mapping included).
const VP4N=s=>String(s==null?'':s).toLowerCase().replace(/[“”"’‘'*_`\[\]()]/g,'').replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
const vp4Quotes=b=>[...String(b||'').matchAll(/"([^"\n]{2,})"|“([^”\n]{2,})”/g)].map(m=>m[1]||m[2]);
const LN=/^[\s>*_-]*ASSUME-CHECK\s*:\s*\**\s*(DEFENDER|CHALLENGER)\s+PREMISE\s+(\d+)\s*\**\s*--\s*FACT\s+(\d+)\s*["“](.*?)["”]\s*--\s*(STATED|NOT STATED|INFERRED ACT)\s*(?:--\s*(.*?))?[\s*_]*$/i;
// premises as Assume Check Build sent them, read back from the prompt text
function premsOf(user){const out=[];const re=/######## (DEFENDER|CHALLENGER) PREMISE (\d+) \(listed against the \w+, LINK (\d+)\) ########\nASSUMES: ([^\n]*)\n[\s\S]*?THE ANSWERING BLOCK, \[(\w+)\] LINK \d+:\n([\s\S]*?)(?=\n\n######## (?:DEFENDER|CHALLENGER) PREMISE |\s*$)/g;
 for(const m of user.matchAll(re))out.push({side:m[1],n:+m[2],link:+m[3],assumes:m[4],answer_round:m[5],block:m[6],quotes:vp4Quotes(m[6])});return out;}
function parseEA(user,txt){const prem=premsOf(user);const ds=[];
 for(const line of String(txt||'').split('\n')){const s=line.trim();if(!s)continue;const m=s.match(LN);if(!m)continue;
  const x={side:m[1].toUpperCase(),n:+m[2],k:+m[3],fact:m[4],answer:m[5].toUpperCase(),rest:(m[6]||'').trim()};
  if(x.answer==='STATED'){const p=prem.find(y=>y.side===x.side&&y.n===x.n);const q=[...x.rest.matchAll(/["“](.+?)["”]/g)].map(z=>z[1]);const qs=p?VP4N(p.quotes.join(' | ')):'';
   x.found=q.length>0&&q.every(z=>{const v=VP4N(z);return v.split(' ').length>=2&&qs.includes(v);});if(!x.found)x.answer='STATED (verse words not found in the block)';}
  ds.push(x);}
 // premise reading (gold file model_scoring): NOT STATED if any line NOT STATED; INFERRED ACT if all INFERRED ACT; else STATED; no line = FORM failure
 return prem.map(p=>{const mine=ds.filter(x=>x.side===p.side&&x.n===p.n);let reading=null;
  if(mine.length)reading=mine.some(x=>x.answer==='NOT STATED')?'NOT STATED':mine.every(x=>x.answer==='INFERRED ACT')?'INFERRED ACT':'STATED';
  return {side:p.side,n:p.n,link:p.link,assumes:p.assumes,lines:mine.length,reading,notfound:mine.filter(x=>/not found/.test(x.answer)).length,answers:mine.map(x=>x.answer)};});}
function parseD4(txt,rowIds){const V={};
 for(const l of String(txt||'').split('\n')){let t=l.replace(/[*_`]+/g,'').trim();
  {const sf=t.match(/^ENFORCER\s*:\s*(?:(?:JUDGE|SEAT)\s+)?([A-Za-z][\w.-]*)\s*\(\s*(?:(?:ITEM|ANSWER|ID)\s+)?([BVKYHZPRS]\d+(?:\.\d+)?)\s*\)\s*((?:--|—|–|-)[\s\S]*)$/i);if(sf&&!/^[BVKYHZPRS]\d/i.test(sf[1]))t='ENFORCER: '+sf[2]+' ('+sf[1]+') '+sf[3];}
  const m=t.match(/^ENFORCER\s*:\s*(?:(?:ITEM|ANSWER|ID)\s+)?([BVKYHZPRS]\d+(?:\.\d+)?)(?:\s*(?:\(\s*[A-Za-z][\w.-]*\s*\)|,\s*[A-Za-z][\w.-]*))?\s*(?:--|—|–|-)\s*(AGREE|DISAGREE|NO ANSWER)\s*(?:--|—|–|-)?\s*(?:RIGHT\s*:\s*(MEETS|MISSES|NOT VOID|VOID|BROKEN|STANDS|UNDERDETERMINED|COUNTED|SPARED|DOES NOT FOLLOW|FOLLOWS|TRUE|OVERSTATED|SAME GROUND|DIFFERENT GROUND)\s*(?:--|—|–|-)?)?\s*(.*)$/i);
  if(!m)continue;let id=m[1].toUpperCase();
  if(!/\./.test(id)){const c=rowIds.filter(x=>x.toUpperCase()===id||x.toUpperCase().startsWith(id+'.'));if(c.length===1)id=c[0].toUpperCase();}
  if(!V[id])V[id]={v:m[2].toUpperCase(),right:(m[3]||'').toUpperCase()};}
 return V;}
module.exports={VP4N,vp4Quotes,LN,premsOf,parseEA,parseD4};
