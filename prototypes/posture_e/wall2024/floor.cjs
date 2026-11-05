// WALL-2024 candidate, position 1 (the floor), written from the definition in
// /mnt/project-files/w3/wall2024_fixture_expectations.md BEFORE it was run, and committed before the run.
// Definition: a press is UNPROVEN when its MEANS sentence asserts what a named person believed or knew,
// and no single layer quote holds both a verb of that kind and its object for the same person.
// Three conditions: polarity (an asserted, not denied, belief), actor (a person, not a text), same quote.
// Agreed stop rule: if this turns a MUST-HOLD press or misses a MUST-TURN press, it is dropped, not tuned.
const MIND=/\b(thought|think|thinks|thinking|believed|believe|believes|supposed|suppose|supposes|knew|know|knows|knowing|known|accounted|account|counted|esteemed|reckoned|considered|took|take|takes|taken)\b/gi;
const TOOK_TO_BE=/^(took|take|takes|taken)$/i; // a "take" verb counts only in the form "took ... to be"
const NEG=/\b(not|no|never|nor|none|without|neither)\b/i;
const PERSON=/^(he|she|they|him|her|joseph|mary|the husband|the man|a husband|a man|the father|his father|elisabeth|zacharias|adam|eve|jacob|abraham|david|herod|jesus|the child|the wife)$/i;
const TEXT_SUBJECT=/\b(verse|verses|text|row|rows|record|matthew|luke|mark|john|paul|narrator|law|canon|chapter|gospel|word|line|lexicon|greek|hebrew)\b/i;
const STOP=new Set('a an the of to and or but that which who whom this these those his her him he she it its they them their be is was were been being by with for from in on at as so not no into unto upon than then there here what when where whose would should could shall will may might must have has had do does did own same one'.split(' '));
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z\s']/g,' ');
const stem=w=>w.replace(/'s$/,'').slice(0,5);
function claims(means){ // positive belief claims about a person: [{verb, actor, object}]
 const out=[];const m=String(means||'');let x;MIND.lastIndex=0;
 while((x=MIND.exec(m))){const verb=x[1];const before=m.slice(0,x.index);const after=m.slice(x.index+verb.length);
  if(TOOK_TO_BE.test(verb)&&!/^\s+.{0,40}?\bto be\b/i.test(after))continue;
  const pre=before.trim().split(/\s+/).slice(-3).join(' ');
  if(NEG.test(pre))continue;                                   // polarity: denied, not asserted
  if(/\bof\s*$/i.test(before)||/\b(verb|word|sense)\s+of\s*$/i.test(before))continue; // "a verb of knowing" names a word, asserts nothing
  const subjWords=before.trim().split(/\s+/);const last1=(subjWords.slice(-1)[0]||'').replace(/[^A-Za-z]/g,'');const last2=subjWords.slice(-2).join(' ').replace(/[^A-Za-z ]/g,'');
  let actor=null;if(PERSON.test(last1))actor=last1;else if(PERSON.test(last2))actor=last2;
  if(!actor){const clause=before.split(/[,;:]|\bwhich\b|\bthat\b|\bso\b/i).pop();const w=clause.trim().split(/\s+/).map(z=>z.replace(/[^A-Za-z]/g,''));const p=w.find(z=>PERSON.test(z));if(p&&!TEXT_SUBJECT.test(clause))actor=p;}
  if(!actor)continue;                                          // actor: a person, not a text
  const obj=after.split(/[,;.]|\bso\b|\bwhich\b|\band\b/i)[0];
  const objWords=norm(obj).split(/\s+/).filter(w=>w&&!STOP.has(w)&&w.length>=3&&!/^(be|to)$/.test(w));
  out.push({verb,actor,object:objWords});}
 return out;}
function layerQuotes(e){const q=[];if(e.quote)q.push({kind:'L1',text:e.quote});
 (e.l2||[]).forEach(x=>q.push({kind:'L2',text:x.text}));
 (e.l3||[]).forEach(x=>{const m=String(x.text).match(/["“]([^"”]+)["”]/);q.push({kind:'L3',text:m?m[1]:x.text});});return q;}
function held(c,quotes){ // one quote holds a verb of that kind AND every object word
 for(const q of quotes){const t=norm(q.text);MIND.lastIndex=0;const hasVerb=MIND.test(q.text);MIND.lastIndex=0;if(!hasVerb)continue;
  const words=t.split(/\s+/).map(stem);if(c.object.every(o=>words.includes(stem(o))))return q;}
 return null;}
function floor(e){const cs=claims(e.means);const fails=[];
 for(const c of cs){const q=held(c,layerQuotes(e));if(!q)fails.push(c);}
 return {claims:cs,fails,cls:fails.length?'UNPROVEN':null};}
module.exports={floor,claims,layerQuotes};
