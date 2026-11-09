// pkgVP1 library text (W3): the pieces are plain files, read as they stand.
const fs=require("fs"),p=n=>fs.readFileSync(__dirname+"/"+n,"utf8");
exports.FN=p("lib_fn.js");exports.ITEMS_LINE=p("lib_items_line.js");exports.CURE_LINE=p("lib_cure_line.js");exports.MSG=p("lib_msg.js");
