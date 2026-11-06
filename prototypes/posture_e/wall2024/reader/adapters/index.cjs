// All adapters, in a stable order. Files starting with _ are helpers.
const fs=require('fs'),path=require('path');
module.exports=fs.readdirSync(__dirname).filter(f=>/\.cjs$/.test(f)&&!/^_|^index/.test(f)).sort().map(f=>require(path.join(__dirname,f)));
