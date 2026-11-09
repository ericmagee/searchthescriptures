/* pkgVP1 part 1 (W3): the E-OOR code checks of Judge Enforcer Build (s435; rulings 428, 439, 443), read again on the line the judge wrote in place of a flagged OUT-OF-ROUND CONCESSIONS line. */
function vp1Oor2024(to,R){const res=(c,why)=>({status:c?'CURED':'UNCURED',why});const t=String(to==null?'':to).replace(/\\+"/g,'"').replace(/[*_`]+/g,'').replace(/^\s*(?:[-•]\s*)?/,'').trim();
 if(/^STRUCK\b/i.test(t))return res(true,'the row is struck');if(!R||typeof R!=='object')return null;
 const m=t.match(/^(DEFENDER|CHALLENGER)\s*\|\s*\[?((?:CR|DR)[1-4])\]?\s*\|\s*([\s\S]+)$/);if(!m)return res(false,'the replaced line is not in the form <SIDE> | [<round>] | "<sentence>"');
 const N=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`\[\]]/g,'').replace(/\s+/g,' ').trim();const NQ=s=>N(s).replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
 const rd=m[2];let sent=m[3].trim();const counted=/(?:\||--)\s*COUNTED\.?\s*$/.test(sent);sent=sent.replace(/\s*(?:\||--)\s*COUNTED\.?\s*$/,'');{const q=sent.match(/^["“]([\s\S]*?)["”](?:\s*(?:--|—|–)\s[\s\S]*|\s+[A-Z(\[][\s\S]*)?$/);sent=q?q[1]:sent.split(/\s(?:--|—|–)\s/)[0];}
 if(/^(CR3|DR3)$/.test(rd))return res(false,'the replaced line names ['+rd+'], a link round; the section lists ground granted outside the two link rounds');
 if(rd.slice(0,2)!==(m[1]==='DEFENDER'?'CR':'DR'))return res(false,'the replaced line names '+m[1]+' but the round ['+rd+'] is the other side\'s');
 if(typeof R[rd]!=='string')return null;const q=NQ(sent);if(q.split(' ').length>=4&&!NQ(R[rd]).includes(q.slice(0,240)))return res(false,'the replaced sentence is not found verbatim in ['+rd+']');
 if(counted&&!/^(CR4|DR4)$/.test(rd))return res(false,'COUNTED ends a line from ['+rd+']; only a close-round concession enters the counts');
 return res(true,'the replaced line passes the code checks: its round is ['+rd+'], its side\'s own and not a link round, and its sentence is found verbatim there');}
