const fs=require('fs');const c=fs.readFileSync(__dirname+'/new/Cure Check.js','utf8');const i=c.indexOf('function orcLines');const j=c.indexOf('function knLines');
const f=new Function(c.slice(i,j)+';return orcLines;')();
const t="REASONING...\nOUT-OF-ROUND CONCESSIONS\nDEFENDER | [CR2] | I withdraw it.\nDEFENDER | [CR4] | I grant that \"till\" bounds the abstinence.\nDEFENDER | CR4 | I concede the verse is silent on a legal heir. COUNTED\nCHALLENGER | [DR4] | I grant the register. COUNTED.\nDEFENDER CHAIN MARK: FOOTED -- x\nDEFENDER | [CR4] | after the section";
console.log(JSON.stringify(f(t)));console.log(JSON.stringify(f("no section here")));
