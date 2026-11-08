const X=' quote marks inside the sentence do not end the six words: quote across them, leaving them out';
const FN="function kwiCut2024(t,i){const old=t.slice(i).split(/(?<=[.!?])\\s|\\n/)[0].slice(0,220).trim();if(((old.match(/\"/g)||[]).length%2)===0)return old;"
 +"const ln=t.slice(i).split('\\n')[0];let q=false;for(let k=0;k<ln.length;k++){const c=ln[k];const nx=ln.slice(k+1);"
 +"if(c==='\"'){q=!q;if(!q&&/[.!?]$/.test(ln.slice(0,k))&&/^(?:\\s|$)/.test(nx)){const r=ln.slice(0,k+1).trim();return r.length<=300?r:old;}continue;}"
 +"if(!q&&/[.!?]/.test(c)&&/^[\\u201d')\\]]*(?:\\s|$)/.test(nx)){const r=(ln.slice(0,k+1)+(nx.match(/^[\\u201d')\\]]*/)||[''])[0]).trim();return r.length<=300?r:old;}}return old;}\n"
 +"function kwiSq2024(s){let o=false;return String(s).replace(/[\"\\u201c\\u201d]/g,c=>c==='\\u201c'?'\\u2018':c==='\\u201d'?'\\u2019':((o=!o)?'\\u2018':'\\u2019'));}\n";
module.exports=[
 ['eng.fn','function kwLines421(text,R){',FN+'function kwLines421(text,R){',1],
 ['eng.cut',"let s=t.slice(m.index).split(/(?<=[.!?])\\s|\\n/)[0].slice(0,220).trim();if(/^\\s*(?:it|that","let s=kwiCut2024(t,m.index);if(/^\\s*(?:it|that",1],
 ['eng.sq',"items.push({rule:'K-W',side,link:id,line:'['+rk+'] '+lab+': \"'+s+'\"'});","items.push({rule:'K-W',side,link:id,line:'['+rk+'] '+lab+': \"'+kwiSq2024(s)+'\"'});",1],
 ['txt.paren','(six words in a row, or all of it when shorter)','(six words in a row, or all of it when shorter;'+X+')',0],
 ['txt.rule','of what follows its verb (all of it when shorter), or the item stays uncured','of what follows its verb (all of it when shorter;'+X+'), or the item stays uncured',0],
];
