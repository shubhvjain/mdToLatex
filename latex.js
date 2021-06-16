var AdmZip = require('adm-zip');
var md = require('./md')
let downloadDependencies = async (mdString,options) =>{
    // given a md string (in string), get add image dependencies and download it as a zip folder
    let tex = md.toLatex(mdString,{})
    




    var zip = new AdmZip();
    // add local file
    //  zip.addLocalFile("./uploads/29/0046.xml");
    zip.addFile("sample.txt", "this is some text")
    // get everything as a buffer
    var zipFileContents = zip.toBuffer();
    return zipFileContents
}

module.exports= {
    downloadDependencies:downloadDependencies
}