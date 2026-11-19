// ASK 431 patch (W1 builds W3's plan a431_w3/plan_rev1.md): the judges' GLOSS CHECK (__GLOSS, L2 Count Plan line 182) reads word (Gnnnn), meaning "gloss".
// Both separator patterns (numd and n0) change from \)?\s*(?:,|:|means|is|meaning|=)?\s*$ to \)?\s*(?:[,:=]\s*)?(?:means|is|meaning)?\s*$ . The old text must occur exactly twice.
const OLD=String.raw`\)?\s*(?:,|:|means|is|meaning|=)?\s*$`;const NEW=String.raw`\)?\s*(?:[,:=]\s*)?(?:means|is|meaning)?\s*$`;
module.exports=function(src){const k=src.split(OLD).length-1;if(k!==2)throw new Error('ASK 431: separator found '+k+' times');return src.split(OLD).join(NEW);};module.exports.OLD=OLD;module.exports.NEW=NEW;
