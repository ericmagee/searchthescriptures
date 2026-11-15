const vp4List=(t,side)=>{t=String(t||"");const i=t.search(/UNSUPPORTED-L4 PREMISES/i);if(i<0)return [];let body=t.slice(t.indexOf("\n",i)+1);const e=body.search(/\n[ \t]*(?:#{1,3}\s|---[ \t]*\n|\*\*[A-Z][A-Z\x27 -]{4,}\*\*)/);if(e>=0)body=body.slice(0,e);const out=[];
 for(const p of body.split(/\n(?=[ \t]*\**[ \t]*\d+[.)]\s)/)){const m=p.match(/^\s*\**\s*(\d+)[.)]\s+([\s\S]*)$/);if(!m)continue;const txt=m[2];
  const a=txt.match(/ASSUMES\s*:\s*([\s\S]*?)\s*(?:ROWS GIVE\s*:|\nPRESSED WITH|$)/i);if(!a)continue;const r=txt.match(/ROWS GIVE\s*:\s*([\s\S]*?)\s*(?:\nPRESSED WITH|$)/i);const lk=txt.match(/^\s*\**\s*LINK\s+(\d+)/i);
  out.push({side,n:+m[1],link:lk?+lk[1]:+m[1],assumes:a[1].replace(/\s+/g," ").trim(),rows_give:r?r[1].replace(/\s+/g," ").trim():""});}
 return out;};