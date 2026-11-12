const fs=require('fs');
const w=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s151.json','utf8'));
module.exports={w};
