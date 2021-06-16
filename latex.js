var AdmZip = require('adm-zip');

let downloadDependencies = async (texFile,options) =>{
    // given a tex file (in string), get add image dependencies and download it as a zip folder
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