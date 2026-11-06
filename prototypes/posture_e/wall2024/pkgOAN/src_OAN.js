/* pkgOAN (W3 33160 grade, build 2): the Oracle's link round [DR3] quotes and answers the MEANS of every press of the defender's
   CHALLENGER'S UNSUPPORTED-L4 PREMISES list that closes [CR3]. The judges' ANSWER CHECK (ruling 412) grades each pressed verse against
   that MEANS; a [DR3] answer that names the verse but not its MEANS is graded MISSES and the premise is counted (Matthew 1:19, premise 2,
   runs 33129, 33149, 33160). OAN.harvest reads the presses by code; OAN.block tells the Oracle; OAN.check reads [DR3] back. */
const OAN=(()=>{
 const W=s=>String(s||'').toLowerCase().replace(/[‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
 function harvest(cr3){const t=String(cr3||'');let i=-1;for(const m of t.matchAll(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi))i=m.index;if(i<0)return [];
  const its=t.slice(i).split(/\n(?=\s*\**\s*\d+[.)]\s)/).filter(x=>/^\s*\**\s*\d+[.)]\s/.test(x));const out=[];
  for(const x of its){const n=+x.match(/^\s*\**\s*(\d+)/)[1];const pw=x.search(/PRESSED WITH\s*:/i);if(pw<0)continue;let k=0;
   for(const l of x.slice(pw).split('\n').slice(1)){const m=l.match(/^\s*[-*•]?\s*\**\s*([1-3]?\s*[A-Z][A-Za-z ]+?\s+\d+:\d+(?:[-–]\d+)?)\**\s*[\s\S]*?\s--\s*MEANS\s*:\s*([\s\S]+?)(?:\s+--\s+(?=\[L\d\]|PROVEN\b)|\s+\|\s+|$)/);
    if(!m)continue;const means=m[2].replace(/^["“]|["”]$/g,'').trim();if(W(means).split(' ').length<3)continue;k++;out.push({id:'P'+n+'.'+k,n,ref:m[1].replace(/\s+/g,' ').trim(),means});}}
  return out;}
 function block(P){if(!P.length)return '';
  return "THE DEFENDER'S PRESSES ON YOUR LINKS -- computed by the system from [CR3], not by a model: every verse of the CHALLENGER'S UNSUPPORTED-L4 PREMISES list with the meaning the defender claims for it (MEANS). "
   +"The judges grade your answer to each one against that MEANS (ANSWER CHECK, ruling 412): an answer that names the verse but does not meet the MEANS is graded MISSES, and the premise is counted against you.\n"
   +P.map(p=>p.id+' (LINK '+p.n+') '+p.ref+' -- MEANS: "'+p.means+'"').join('\n')
   +"\nUnder \"Answers to the presses\" of each LINK you keep (SUPPORTED or NARROWED), answer EVERY press of that link. For each press write first the line\n"
   +"MEANS [CR3] <id>: \"<the MEANS above, word for word>\"\n"
   +"and then the layers ([L1] to [L4]) that meet that meaning: show from the text why the verse does not carry it, or how your link holds with it. Naming or quoting the verse alone is not an answer. A LINK you concede needs no answers.";}
 /* a MEANS counts as quoted when one line of the link section holds 8 consecutive words of it (all of it when shorter), word for word; read
    by line, not by quotation marks, so a MEANS with quotes of its own ("thy father" with "my Father's") is read whole */
 const quotes=t=>{const o=[];let at=0;for(const l of String(t||'').split('\n')){o.push({q:l,at,end:at+l.length});at+=l.length+1;}return o;};
 const has=(q,means)=>{const a=W(q),b=W(means);if(!a||!b)return false;if(a.includes(b))return true;const bw=b.split(' ');const k=Math.min(8,bw.length);for(let i=0;i+k<=bw.length;i++)if((' '+a+' ').includes(' '+bw.slice(i,i+k).join(' ')+' '))return true;return false;};
 function sections(dr3){const t=String(dr3||'');const re=/^[\s#>*_-]*LINK\s+(\d+)\s*:\s*\**\s*(SUPPORTED|CONCEDED|NARROWED)/gim;const at=[];let m;while((m=re.exec(t)))at.push({n:+m[1],g:m[2].toUpperCase(),s:m.index});
  const out={};at.forEach((x,i)=>{if(out[x.n])return;out[x.n]={g:x.g,text:t.slice(x.s,i+1<at.length?at[i+1].s:t.length)};});return out;}
 function check(dr3,P){if(!Array.isArray(P)||!P.length)return {applies:false,pass:true,missing:[],unanswered:[],ok:[],conceded:[]};const S=sections(dr3);const r={applies:true,missing:[],unanswered:[],ok:[],conceded:[],sections:Object.keys(S).length};
  for(const p of P){const s=S[p.n];if(s&&s.g==='CONCEDED'){r.conceded.push(p.id);continue;}const T=s?s.text:String(dr3||'');const q=quotes(T).find(z=>has(z.q,p.means));
   if(!q){r.missing.push(p.id);continue;}const after=T.slice(q.at,q.end+900);const nx=after.slice(q.end-q.at).search(/\n\s*(?:[-*•]\s*)?\**\s*MEANS\s*\[CR3\]/i);const seg=nx>=0?after.slice(0,q.end-q.at+nx):after;
   if(/\[L[1-4]\]/.test(seg))r.ok.push(p.id);else r.unanswered.push(p.id);}
  r.pass=!r.missing.length&&!r.unanswered.length;return r;}
 return {harvest,block,check,sections};})();
