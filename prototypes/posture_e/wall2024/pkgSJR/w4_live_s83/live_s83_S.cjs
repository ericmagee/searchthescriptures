const b=require('/mnt/project-files/wall2024/fetchback_live_s83.json');const B=Object.fromEntries(b.nodes.map(n=>[n.name,n]));
module.exports={BUILD:B['SJ Re-ask Build'].parameters.jsCode,PICK:B['SJ Re-ask Pick'].parameters.jsCode,IF_EXPR:B['SJ Re-ask?'].parameters.conditions.conditions[0].leftValue,B};
