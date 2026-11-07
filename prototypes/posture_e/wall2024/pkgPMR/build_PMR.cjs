// pkgPMR (B5, W3 feedback rulings 2026-11-06 item 5; hermes 2 #5): the phantom mismatch row.
// 33175: the stored citation_check holds "WORDING DIFFERS FROM 2 Samuel 2:4" (CHALLENGER R3) with no quote. The round has no 2 Samuel 2:4. It reads
// '... (2 Samuel 7:12), carried in "the house and lineage of David" that Luke gives to Joseph (2:4)': the bare "(2:4)" took the book of the last
// full reference in its clause (2 Samuel), not the book the prose names beside it (Luke, without a possessive, so lastBook did not read it).
// Edit 1 (Citation Scan): a bare reference after a quotation also keeps, as its alt, the same chapter:verse in the last of the 66 books named as a
// plain word in its clause (quoted words masked; a name followed by its own chapter:verse is a reference, not a plain word; the person names
// John, James, Jude, Mark, Timothy, Titus and Philemon are not read). Quote Compare tries the alt only when the first reference fails (ruling 4),
// so a reference that matches is never moved; one that matches only the alt is bound to it, with rebound_from.
// Edit 2 (Build Save Body): every stored citation_check row that is not a match carries the quote it checked (up to 300 characters) and the alt
// it tried, so a mismatch row can be reviewed.
// Base: the live nodes of d5375c6e (fetchback_live_s12.json). Run from wall2024/: node pkgPMR/build_PMR.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const LIVE=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s12.json','utf8'));
const E={'Citation Scan':{
 helper:["const rounds=[['DEFENDER','R1',F.cr1]",
  "// pkgPMR (B5): a bare reference after a quotation keeps, as its alt, the same chapter:verse in the book named in plain words in its clause\n"
 +"const __PMX=new Set(['John','James','Jude','Mark','Timothy','Titus','Philemon']);const __PMW=/(?<![A-Za-z0-9])((?:[1-3]\\s)?[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?)(?![A-Za-z0-9])(?!\\.?\\s*\\d{1,3}:\\d)/g;\n"
 +"const __pmrAlt=(t,m,book)=>{const st=clauseAt(t,m.index);const mk=QMASK.get(String(t))||String(t);let nb=null;for(const x of mk.slice(st,m.index+m[0].length).matchAll(__PMW)){const i=BOOKS.indexOf(x[1]);if(i>=0&&i<66&&!__PMX.has(x[1]))nb=x[1];}\n"
 +" return nb&&nb!==book?{alt:{ref:nb+' '+m[3]+':'+m[4],book:nb,chapter:+m[3],verse:+m[4],from:'the book named in the prose beside the bare reference'}}:{};};\n"
 +"const rounds=[['DEFENDER','R1',F.cr1]"],
 alt:["items.push({ref,book,chapter:+m[3],v1,v2,...(PS.length>1?{parts:PS}:{}),quote,segs,side,round,order:'quote-first',",
  "items.push({ref,book,chapter:+m[3],v1,v2,...(PS.length>1?{parts:PS}:{}),quote,segs,side,round,order:'quote-first',...(m[2]?{}:__pmrAlt(t,m,book)),"]},
 'Build Save Body':{
 quote:["...(i.rebound_from?{rebound_from:i.rebound_from}:{})}))",
  "...(i.rebound_from?{rebound_from:i.rebound_from}:{}),...(/^MATCHES\\b/.test(String(i.status||''))?{}:{quote:String(i.quote==null?'':i.quote).slice(0,300),...(i.alt&&i.alt.ref?{alt:i.alt.ref}:{})})})) /* pkgPMR (B5): a row that is not a match carries the quote it checked */"]}};
const plan={source:'B5 (W3 feedback rulings item 5)',live:LIVE.versionId,nodes:[]};fs.mkdirSync('pkgPMR/base',{recursive:true});fs.mkdirSync('pkgPMR/patched',{recursive:true});
for(const [n,ed] of Object.entries(E)){const f=n.replace(/ /g,'_')+'.js';const s0=LIVE.nodes.find(z=>z.name===n).parameters.jsCode;let s=s0;const done=[];
 for(const [k,[a,b]] of Object.entries(ed)){const c=s.split(a).length-1;if(c!==1)throw new Error(n+' '+k+': anchor x'+c);s=s.split(a).join(b);done.push(k);}
 new Function('$','$input','$json','$execution',s);fs.writeFileSync('pkgPMR/base/'+f,s0);fs.writeFileSync('pkgPMR/patched/'+f,s);plan.nodes.push({name:n,file:f,base_sha:sha(s0),final_sha:sha(s),edits:done});console.log(n.padEnd(16),sha(s0),'->',sha(s),done.join(','));}
fs.writeFileSync('pkgPMR/plan_PMR.json',JSON.stringify(plan,null,1));
