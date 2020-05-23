var marked = require('marked');

let contents = []; // Array that will hold the headings from the MarkDown

let levelMembers = [];
let levelMember = [];


function add (inputText, navigation) {

  fileContents = inputText;

  var markedFile = marked.lexer(fileContents);
  
  // This loop walks through the MarkDown that has been read into a JSON structure and pulls out all the headings into the "contents" array.

  //console.log(JSON.stringify(markedFile,null,2))
  for (var i = 0; i < markedFile.length; i = i + 1) {  
    if (markedFile[i].type === "heading"){
      if (markedFile[i].depth !== 1){
        contents.push(markedFile[i].depth - 2 + "|" + markedFile[i].text)
      }
    }
  }  

  // Looking for headings!
  if (contents.length === 0){
    console.log("No headings found in document!");
    throw new Error("No headings found in document!");
  }

  var hasContents = false;
  
  for (var i = 0; i < contents.length; i = i + 1) {      
    contentsSplit = contents[i].split("|");
    if(contentsSplit[1].toUpperCase() === "CONTENTS"){
      hasContents = true;
      break;
    }
  }

  if(hasContents === true){
    console.log("Document already has Contents section!");
    throw new Error("Document already has Contents section!");
  }

  // This code starts to build the new MarkDown document
  var rawContents = ""
  for (var i = 0; i < contents.length; i = i + 1) {  
    //console.log(contents[i])
    contentsSplit = contents[i].split("|");
    rawContents = rawContents + '  '.repeat(contentsSplit[0]) + "* [" + contentsSplit[1] + "](#"+contentsSplit[1].toLowerCase().replace(/\./g,"").replace(/ /g,"-") + ")\n"
  }
  rawContents = rawContents + "\n";

  var newMarkDown = "";
  for (var i = 0; i < markedFile.length; i = i + 1) {  
    if (markedFile[i].type === "heading"){
      if (markedFile[i].depth === 1){
        newMarkDown = newMarkDown + markedFile[i].raw;
        newMarkDown = newMarkDown + "## Contents\n\n";
        newMarkDown = newMarkDown + rawContents;
      } else {
        newMarkDown = newMarkDown + markedFile[i].raw;
      }
    } else {
      // This switch section is accommodating any issues found with marked translation!
      switch(markedFile[i].type){
        case "blockquote":
          newMarkDown = newMarkDown + markedFile[i].raw + "\n";
          break;
        default:
          newMarkDown = newMarkDown + markedFile[i].raw;
      }
      
    }
  }  
  //console.log(newMarkDown)
  if (navigation !== undefined){
    markedFile = marked.lexer(newMarkDown);

    //console.log(contents)

    // This code section build a JSON to hold the required navigation entry points.  Structure is:
    //  {
    //    "lowestLevel": "number",
    //    "data": {
    //      "[Level Nº]": {
    //        "[Heading Label]": {
    //
    //        }
    //      }
    //    }
    //  }
    navigation = {};
    navigation.lowestLevel = 0;
    navigation.data = {} ;   
    currentParent = []  ; 
    for (var i = 0; i < contents.length; i = i + 1) {  
      if (navigation.data[contents[i].split("|")[0]] === undefined){ // Defines heading level in data section of JSON if it does not already exist.
        navigation.data[contents[i].split("|")[0]] = [];
      }      
      if (contents[i].split("|")[0] > navigation.lowestLevel) { // Increments the lowestLevel value if this heading is lower on the levels
        navigation.lowestLevel = Number(contents[i].split("|")[0]);
      }
      //console.log(JSON.stringify(navigation,null,2))
      //process.exit()
      //navigation.data[contents[i].split("|")[0]].push([contents[i].split("|")[1]] = {}) // Adds this heading to the JSON structure
      headingJSON = {}
      headingJSON[[contents[i].split("|")[1]]] = {}
      headingJSON[[contents[i].split("|")[1]]].insertBefore = {};
      // console.log(headingJSON)
      
      currentParent[contents[i].split("|")[0]] = contents[i].split("|")[1]
      if (contents[i].split("|")[0] !== "0"){
        headingJSON[[contents[i].split("|")[1]]]["parent"] = currentParent[contents[i].split("|")[0]-1]      ;
      }

      // console.log("\nProcessing: " + contents[i])
      for (var j = i + 1; j < contents.length; j = j + 1) {  
        // console.log("\tHeading: " + contents[j].split("|")[1])
        // console.log("\t\tLevel: " + contents[j].split("|")[0])
        // Looking for next peer!
        if (contents[j].split("|")[0] < contents[i].split("|")[0] ){          
          // console.log("\t\tHit a higher level!")
          headingJSON[[contents[i].split("|")[1]]].insertBefore.Heading = contents[j].split("|")[1];
          headingJSON[[contents[i].split("|")[1]]].insertBefore.Level = Number(contents[j].split("|")[0]);
          // console.log("\t\tFound place: " + contents[j].split("|")[1] )
          break;
        }
        if (contents[j].split("|")[0] === contents[i].split("|")[0]){  // Peer found.  Insert Navigation before this peer.          
          // console.log("\t\tCurrentHeading(Peer): " + contents[i].split("|")[1])
          // console.log("\t\tCurrentLevel(Peer): " + contents[i].split("|")[0])
          headingJSON[[contents[i].split("|")[1]]].insertBefore.Heading = contents[j].split("|")[1];
          headingJSON[[contents[i].split("|")[1]]].insertBefore.Level = Number(contents[j].split("|")[0]);
          // console.log("\t\tFound place: " + contents[j].split("|")[1] )
          break      
          //navigation.data[contents[i].split("|")[0]][contents[i].split("|")[1]]["insertBefore"] = contents[j].split("|")[1]
          //console.log("Next Peer of " + contents[i].split("|")[1] + " is: " + contents[j].split("|")[1] )          
        }
      }        
      
      // console.log("\n\tinsertBefore: " + headingJSON[[contents[i].split("|")[1]]]["insertBefore"])
      if (headingJSON[[contents[i].split("|")[1]]].insertBefore.Heading === undefined){ // No peer found!
        // console.log("\t\tNot peer for " + contents[i].split("|")[1])
        // console.log("\tCurrentHeading(Child): " + contents[i].split("|")[1])
        // console.log("\tCurrentLevel(Child): " + contents[i].split("|")[0])
        for (var j = i + 1; j < contents.length; j = j + 1) {  // Looking for lowest last child!            
          if (contents[j].split("|")[0] <= contents[i].split("|")[0]){
            // console.log("\tCurrentHeading(Child): " + contents[i].split("|")[1])
            // console.log("\tCurrentLevel(Child): " + contents[i].split("|")[0])
            headingJSON[[contents[i].split("|")[1]]]["insertBefore"]["Heading"] = contents[j].split("|")[1];
            headingJSON[[contents[i].split("|")[1]]]["insertBefore"]["Level"] = Number(contents[j].split("|")[0]);
            // console.log("\tinsertBefore:" + contents[j].split("|")[1] )      
            //console.log("Entry point for " + contents[i].split("|")[1] + " is: " + contents[j-1].split("|")[1])
            break;
          }
        }
      }

        if (headingJSON[[contents[i].split("|")[1]]].insertBefore.Heading === undefined){ // No peer or lowest child found!
          headingJSON[[contents[i].split("|")[1]]].insertBefore.Heading = "[EOF]";
        }      
      
      navigation.data[contents[i].split("|")[0]].push(headingJSON);
      
    }
    

    // console.log(JSON.stringify(navigation,null,2))
        
    for (var i = navigation.lowestLevel; i >= 0; i = i - 1) {
      //console.log(Object.values(navigation.data[i]))

      for (var j = 0; j < Object.values(navigation.data[i]).length; j = j + 1) {
        //console.log(Object.values(Object.values(Object.values(navigation.data[i]))[j])[0])
        // console.log("Processing: " + Object.keys(Object.values(Object.values(navigation.data[i]))[j])[0])
        insertBeforeHeading = Object.values(Object.values(Object.values(navigation.data[i]))[j])[0].insertBefore.Heading;
        parent = Object.values(Object.values(Object.values(navigation.data[i]))[j])[0].parent;
        insertBeforeLevel =  Object.values(Object.values(Object.values(navigation.data[i]))[j])[0].insertBefore.Level;

        
        if ( insertBeforeHeading !== "[EOF]"){     
          if (i !== 0) {
            // console.log("I will add a link to " + parent + " above section " + insertBeforeHeading);            
            markDownHeading = "#".repeat(insertBeforeLevel + 2) + " " + insertBeforeHeading;
            // console.log(markDownHeading)
            searchRegEx = new RegExp("#".repeat(insertBeforeLevel + 2) + ".*" + insertBeforeHeading + "\s*[\n]","g");
            // console.log(searchRegEx)
            newMarkDown = newMarkDown.replace(searchRegEx, ":arrow_up_small: _Up to [Section " + parent + "](" + bookmark(parent) + ")._  \n" + markDownHeading + "\n");
          } else {
            // console.log("I will add a link to Contents above section " + insertBeforeHeading);
            markDownHeading = "#".repeat(insertBeforeLevel + 2) + " " + insertBeforeHeading;
            searchRegEx = new RegExp("#".repeat(insertBeforeLevel + 2) + ".*" + insertBeforeHeading + "\s*[\n]","g");
            newMarkDown = newMarkDown.replace(searchRegEx, "**:arrow_up_small: _Back to [Table of Contents](#contents)._**  \n" + markDownHeading + "\n");
          }
          
        } else {
          if (i !== 0) {
            // console.log("I will add a link to " + parent + " at the end of the document.");
            newMarkDown = newMarkDown + "\n\n:arrow_up_small: _Up to [Section " + parent + "](" + bookmark(parent) + ")._  ";
          } else {
            // console.log("I will add a link to Contents at the end of the document.");
            newMarkDown = newMarkDown + "\n\n**:arrow_up_small: _Back to [Table of Contents](#contents)._**  ";
          }
        }       
      }     
    }
    
    // This code is making sure there is a new line before each heading after the navigation aids have been added.
    searchRegEx = new RegExp("_.*[\n]#","g");
    newMarkDown = newMarkDown.replace(searchRegEx, function (foundStr){
      // console.log(foundStr)
      return foundStr.replace("\n","\n\n");
    })

    // This code is making sure there is no additional line between navigation aids at the end of the document!
    searchRegEx = new RegExp("_.*[\n][\n]\\**:arrow_up_small:","g");
    newMarkDown = newMarkDown.replace(searchRegEx, function (foundStr){
      // console.log(foundStr)
      return foundStr.replace("\n","");
    });

    
  }  
    
  // This section accommodates the need to have a blank line at the end of a MarkDown
  if ((fileContents.lastIndexOf("\n") + 1) === fileContents.length ){
    if ((newMarkDown.lastIndexOf("\n") + 1) !==  newMarkDown.length){
      newMarkDown = newMarkDown + "\n";
    }
  }
  contents = []
  return (newMarkDown);  
}

function remove (inputText, navigation) {
  // NEW CODE STARTS HERE!
  
  fileContents = inputText;

  var markedFile = marked.lexer(inputText);

  // This loop walks through the MarkDown that has been read into a JSON structure and pulls out all the headings into the "contents" array.

  //console.log(JSON.stringify(markedFile,null,2))
  for (var i = 0; i < markedFile.length; i = i + 1) {  
    if (markedFile[i].type === "heading"){
      if (markedFile[i].depth !== 1){
        contents.push(markedFile[i].depth - 2 + "|" + markedFile[i].text);
      }
    }
  }
  
  var hasContents = false;
  for (var i = 0; i < contents.length; i = i + 1) {      
    contentsSplit = contents[i].split("|");
    if(contentsSplit[1].toUpperCase() === "CONTENTS"){
      hasContents = true;
      break;
    }
  }

  if(hasContents === false && navigation === undefined){
    console.log("Document has no existing Contents section!");
    throw new Error("Document has no existing Contents section!");
  }
  
  var newMarkDown = "";
  inContentsSection = false;
  for (var i = 0; i < markedFile.length; i = i + 1) {
    if (markedFile[i].type === "heading"){
      //console.log(markedFile[i].text.toUpperCase())
      if (markedFile[i].text.toUpperCase() == "CONTENTS"){
        inContentsSection = true
      } else {
        inContentsSection = false
        newMarkDown = newMarkDown + markedFile[i].raw      
      }
    } else {
      if (inContentsSection == false) {
        switch(markedFile[i].type){
          case "blockquote":
            newMarkDown = newMarkDown + markedFile[i].raw + "\n"
            break
          default:
            newMarkDown = newMarkDown + markedFile[i].raw
        }        
      }      
    }
  }
  //console.log (newMarkDown)

  if (navigation !== undefined){    
    newMarkDown = newMarkDown.replace(/:arrow_up_small: _Up to \[Section .*\)._  [\n]*/g,"")
    newMarkDown = newMarkDown.replace(/[\n]*\*\*:arrow_up_small: _Back to \[Table of Contents\]\(#contents\)._\*\*  /g,"")
  }

  // This section accommodates the need to have a blank line at the end of a MarkDown
  if ((fileContents.lastIndexOf("\n") + 1) == fileContents.length ){
    if ((newMarkDown.lastIndexOf("\n") + 1) !==  newMarkDown.length){
      newMarkDown = newMarkDown + "\n"
    }
  }  
  
  contents = []
  return (newMarkDown);
  
}

function extractJsonHeadings(obj, level) {
  //console.log("<---------------------------------------------------------------------------------------------- Loop " + counter)
  for (const i in obj) {
    if (Array.isArray(obj[i]) || typeof obj[i] === 'object') {      
      contents.push(level + '|' +  i)      
      extractJsonHeadings(obj[i], level + 1);            
    } else {
      //console.log(indent + i + ': ' + obj[i]);
    }
  }  
  return contents
}

function addNavigationAids(obj, level, parent) {
  //console.log("<---------------------------------------------------------------------------------------------- Loop " + counter)
  
  levelMembers[level] = 0      
  for (const j in obj) {
    if (j !== "raw"){
      levelMembers[level] = levelMembers[level] + 1
    }
  }      
  
  levelMember[level] = 1   
  for (const i in obj) {  
    if (Array.isArray(obj[i]) || typeof obj[i] === 'object') {
      // console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HERE: " + parent + ">>" + i)      
      // console.log("Level: " + level + ", Level Members: " + levelMembers[level] + ", Current Member: " + levelMember[level])
      // console.log("|" + parent + "|")
      if (parent !== null){        
        obj[i].raw = obj[i].raw + ":arrow_up_small: _Up to [Section " + parent + "](" + bookmark(parent) + ")._  \n"
        obj[i].raw = obj[i].raw + "**:arrow_up_small: _Back to [Contents](#contents)._**\n  \n"
      }
             
      x = addNavigationAids(obj[i], level + 1, i);                  
      //console.log ("Processed \"" + i + "\". Moving on! " + levelMember[level] + " + 1 !")
      levelMember[level] = levelMember[level] + 1
    }    
  }  
  return contents
}

function removeNavigationAids(obj) {
  //console.log("<---------------------------------------------------------------------------------------------- Loop " + counter)
  
  for (const i in obj) {  
    if (Array.isArray(obj[i]) || typeof obj[i] === 'object') {
      obj[i].raw = obj[i].raw.replace(/:arrow_up_small: _Up to \[Section .*\)._  [\n]/g,"")
      obj[i].raw = obj[i].raw.replace(/\*\*:arrow_up_small: _Back to \[Contents\]\(#contents\)._\*\*[\n][\n][\n]/g,"")
      removeNavigationAids(obj[i]);      
    }    
  }  
  return contents;
}

function buildJSON(position, level ) {
  
  return;
}

function bookmark(heading){
  return ("#" + heading.toLowerCase().replace(/\./g,"").replace(/ /g,"-"));
}

module.exports.add = add;
module.exports.remove = remove;
