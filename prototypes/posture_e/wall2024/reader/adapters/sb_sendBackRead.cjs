// Send Back Record (pkgKIND/final, live since pkgKIND): the SENDBACK reply regex (id variants of WALL-2024 2243 A).
const fs=require('fs'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','..','pkgKIND','final','Send_Back_Record.js'),'utf8');
const m=src.match(/l\.match\((\/SENDBACK(?:\\\/|[^/\n])+\/[a-z]*)\)/);if(!m)throw new Error('SENDBACK regex not found');const RX=eval(m[1]);
module.exports={name:'Send Back Record: SENDBACK reply',form:'REPLY',scope:'line',read(l){const s=String(l).replace(/\\n/g,'\n').replace(/\\"/g,'"').replace(/[*_`]+/g,'').trim();const r=s.match(RX);if(!r)return null;
 return {form:'REPLY',kind:'SENDBACK',id:r[1].replace(/\s+/g,'').toUpperCase(),answer:/^KEEP$/i.test(r[2].trim())?'KEEP':'CHANGE',to:(r[3]||'').trim(),sentence:(r[4]||'').trim()};}};
