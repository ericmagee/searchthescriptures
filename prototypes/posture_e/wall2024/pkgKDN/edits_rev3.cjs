// pkgKDN rev 3 edits: [line offset from kwLines421, exact old text (occurs once on that line), new text]
module.exports=kw=>[[kw+2,"if(!t)continue;","if(!t)continue;let __pe=-1;/* pkgKDN rev 3 */"],
[kw+3,"for(const m of t.matchAll(RX)){const pg=","for(const m of t.matchAll(RX)){if(/do\\s+not\\s+rest$/i.test(m[0])&&(!/4$/.test(rk)||m.index<__pe))continue;/* pkgKDN rev 3: closing rounds only; not twice in one quoted sentence */const pg="],
[kw+3,"set\\s+aside|release))*\\s*(?:[.!?]|:?[ \\t]*(?:\\n|$))","set\\s+aside|release))*(?:\\s+on)?\\s*(?:[.!?]|:?[ \\t]*(?:\\n|$))"],
[kw+4,"const bd=x=>Math.max(t.lastIndexOf('\\n',x-1)+1,...[...t.slice(0,x).matchAll(/[.!?][\"\\u201d']?\\s+/g)].map(z=>z.index+z[0].length));",
 "const iq=p=>{const ln=t.slice(t.lastIndexOf('\\n',p-1)+1,p);return (ln.split('\"').length-1)%2===1||ln.split('\\u201c').length>ln.split('\\u201d').length;};const bd=x=>Math.max(t.lastIndexOf('\\n',x-1)+1,...[...t.slice(0,x).matchAll(/[.!?][\"\\u201d']?\\s+/g)].filter(z=>!iq(z.index+z[0].length)).map(z=>z.index+z[0].length));/* pkgKDN rev 3 (c) */"],
[kw+4,"if(/[A-Za-z0-9]/.test(pv))s=(tl(pv,Math.max(0,300-s.length))+' '+s).trim();}}/* pkgKDN: name what \"it\" is */",
 "if(/[A-Za-z0-9]/.test(pv))s=(tl(pv,Math.max(0,300-s.length))+' '+s).trim();else{const nx=t.slice(m.index+s.length).match(/^\\s*([^\\n]*?[.!?][\"\\u201d']?)(?=\\s|$)/);if(nx&&/[A-Za-z0-9]/.test(nx[1])&&s.length+1+nx[1].length<=300)s=s+' '+nx[1];}/* pkgKDN rev 3 (a) */}}/* pkgKDN: name what \"it\" is */"],
[kw+5,"items.push({rule:'K-W',side,link:id,","__pe=m.index+kwiCut2024(t,m.index).length;/* pkgKDN rev 3 (b) */items.push({rule:'K-W',side,link:id,"]];
