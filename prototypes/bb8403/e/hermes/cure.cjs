const CURE_BK={mt:'mat',mk:'mar',lk:'luk',jn:'joh',ex:'exo',ro:'rom'};
function cureRefs(t){const out=[];const s=String(t||'');let last=null;const re=/(?:((?:[1-3]\s)?[A-Z][a-z]+)\.?\s+)?(\d{1,3}):(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?((?:\s*,\s*(?:\d{1,3}:)?\d{1,3}(?:\s*[-–]\s*\d{1,3})?)*)/g;let m;
 while((m=re.exec(s))){let bk=last;if(m[1]){const b=m[1].toLowerCase().replace(/\s+/g,' ');const n=b.match(/^([1-3]) (.+)$/);const base0=n?n[2]:b;bk=(n?n[1]+' ':'')+(CURE_BK[base0]||base0.slice(0,3));last=bk;}
  if(!bk)continue;const add=(c,v1,v2)=>{if(!v2||v2<v1||v2-v1>30)v2=v1;for(let v=v1;v<=v2;v++)out.push({key:bk+' '+c+':'+v,pos:m.index});};
  let ch=+m[2];add(ch,+m[3],m[4]?+m[4]:0);
  for(const p of (m[5]||'').split(',').map(x=>x.trim()).filter(Boolean)){const q=p.match(/^(?:(\d{1,3}):)?(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?$/);if(!q)continue;if(q[1])ch=+q[1];add(ch,+q[2],q[3]?+q[3]:0);}}
 return out;}
function cureNamed(line,LR,w){w=w>0?w:0;const p=String(line||'').match(/\(([^)]*\d+:\d+[^)]*)\)/);if(!p)return [];const want=new Set(cureRefs(p[1]).map(r=>r.key));if(!want.size)return [];
 const heads=[];const hr=/^[ \t>*#_-]*LINK\s+\d+/gmi;let h;while((h=hr.exec(LR)))heads.push(h.index);
 const span=(pos)=>{let a=0,b=LR.length;for(const x of heads){if(x<=pos)a=x;else{b=x;break;}}const lo=Math.max(a,pos-300),hi=Math.min(b,pos+1200);return {t:LR.slice(Math.max(a,lo-w),Math.min(b,hi+w)),l:LR.slice(Math.max(a,lo-w),lo),r:LR.slice(hi,Math.min(b,hi+w))};};
 const by={};for(const r of cureRefs(LR))if(want.has(r.key))(by[r.key]=by[r.key]||[]).push(span(r.pos));
 return Object.keys(by).map(k=>({ref:k,blocks:by[k].map(x=>x.t),left:by[k].map(x=>x.l),right:by[k].map(x=>x.r)}));}
module.exports={cureRefs,cureNamed};