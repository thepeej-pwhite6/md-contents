var fs = require('fs');
var mdcontents = require(__dirname + '/md-contents.js');

const clArgs = process.argv.slice(2);

var msg = "\nUsage:\n";
msg = msg + "\t[filename] [add/remove] [options]\n";
msg = msg + "\nWhere:\n";
msg = msg + "\t[filename]\tis the MarkDown file to process including relative path.\n";
msg = msg + "\t[add/remove]\tadd for adding contents section, remove for removing contents section.\n";
msg = msg + "\t[options]\tis one of the following:\n";
msg = msg + "\t\t-n\tAdd navigation aids\n";
msg = msg + "\nExample:\n";
msg = msg + "\tmd-contents \"./md-content-test.md\" add";

if (clArgs.length & 2){
} else {
  console.log(msg);
  process.exit(-1);
}

for (var i = 1; i < clArgs.length; i = i + 1) {  
  switch (clArgs[i]){
    case "-n":
      navigation = true;
    case "add":    
    case "remove":    
      break;
    default:
      console.log(msg);
      process.exit(-1);
  }
}

inputFile = clArgs[0]

try {
  var fileContents = fs.readFileSync(inputFile, 'utf8');
} catch(err){
  console.log(err.message);
  process.exit(-1);
}

switch (clArgs[1]){  
  case "add":    
    try {
      if (navigation === true){
        newMarkDown = mdcontents.add(fileContents, true);
      } else {
        newMarkDown = mdcontents.add(fileContents);
      }      
    } catch (err) {      
      process.exit(-1)
    }
    break;
  case "remove":      
    try {
      if (navigation === true){
        newMarkDown = mdcontents.remove(fileContents, true);
      } else {
        newMarkDown = mdcontents.remove(fileContents);
      }
    } catch (err) {      
      process.exit(-1)
    }
    break;
}

fs.writeFileSync(inputFile, newMarkDown);  
