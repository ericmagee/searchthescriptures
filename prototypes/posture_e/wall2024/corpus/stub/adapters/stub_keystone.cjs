// Stub "old" reader: case-insensitive KEYSTONE, no normalisation. Exists only to test the driver.
module.exports={name:'stub.keystone',form:'KEYSTONE',scope:'line',read:l=>{const m=l.match(/KEYSTONE:\s*(D\d+)\s*--\s*(STANDS|BROKEN|WITHDRAWN)/i);return m?{link:m[1],grade:m[2]}:null;}};
