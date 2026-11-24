// ASK 595 follow-on (option A, pressed 01:58 CST): make whole the QR DROPPED-reply store (2,000), the reversed-close quotations shown to judges (500 and 400), and the MLS block reader (LIB 2277, 1,500).
// Usage: node buildcuts.cjs <engine in> <child in> <engine out> <child out>
const fs=require('fs');const lp=require('/mnt/project-files/ask588/w4/build/libpatch.js');
const [ein,cin,eout,cout]=process.argv.slice(2);
const nodeEd=(W,name,pairs)=>{const n=W.nodes.find(x=>x.name===name);let c=n.parameters.jsCode;const before=lp.md5(c);for(const [a,b,k] of pairs){const got=c.split(a).length-1;if(got!==k)throw new Error(name+': "'+a.slice(0,60)+'" occurs '+got+' times, expected '+k);c=c.split(a).join(b);}n.parameters.jsCode=c;return name+' '+before.slice(0,8)+'->'+lp.md5(c).slice(0,8);};
const LIBED=[
 {line:3564,a:"String(__x.closing_q).slice(0,400)",b:"String(__x.closing_q)",what:'E-REVCLOSE send-back closing quote whole'},
 {line:3564,a:"String(__x.earlier_q).slice(0,400)",b:"String(__x.earlier_q)",what:'E-REVCLOSE send-back earlier quote whole'},
 {line:2277,a:"return out.join('\\n').slice(0,1500);}return null;}",b:"return out.join('\\n');}return null;}",what:'mlsBlock returns the block whole'}];
const rep={};
const E=JSON.parse(fs.readFileSync(ein,'utf8'));
rep.engine_nodes=[
 nodeEd(E,'QR Final',[["String(c.first_text==null?'(none)':c.first_text).slice(0,2000)","String(c.first_text==null?'(none)':c.first_text)",1],["String(second).slice(0,2000)","String(second)",1]]),
 nodeEd(E,'QR Follow Final',[["String(t==null?'(none)':t).slice(0,2000)","String(t==null?'(none)':t)",1]]),
 nodeEd(E,'Panel Build',[["String(x.closing_q).slice(0,500)","String(x.closing_q)",2],["String(x.earlier_q).slice(0,500)","String(x.earlier_q)",2]]),
 nodeEd(E,'Build Independent Verdict',[["String(x.closing_q).slice(0,500)","String(x.closing_q)",2],["String(x.earlier_q).slice(0,500)","String(x.earlier_q)",2]])];
rep.engine_lib=lp.apply(E,JSON.parse(JSON.stringify(LIBED)));fs.writeFileSync(eout,JSON.stringify(E));
const C=JSON.parse(fs.readFileSync(cin,'utf8'));rep.child_lib=lp.apply(C,JSON.parse(JSON.stringify(LIBED)));fs.writeFileSync(cout,JSON.stringify(C));
console.log(JSON.stringify(rep,null,1));
