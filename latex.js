var AdmZip = require('adm-zip');
const axios = require('axios').default;

var md = require('./md')
let downloadDependencies = async (mdString, options) => {
    // given a md string (in string), get add image dependencies and download it as a zip folder
    let tex = md.toLatex(mdString, options)
    let imgBuffers = await downloadImage(tex.images)
    let finalTexFile = ` 
\\documentclass[a4paper,11pt]{article} 
${tex.packages}
\\begin{document}
${tex.content}
\\end{document}
    `
    var zip = new AdmZip();
    zip.addFile("main.tex",finalTexFile)
    imgBuffers.map(img=>{
        zip.addFile("images/"+img.fileName,img.image)
    })
    
    var zipFileContents = zip.toBuffer();
    return zipFileContents
    // zip.writeZip("sample.zip");
}

downloadImage = async (images) => {
    let data = []
    let err = []
    for (let image of images) {
        let imData = await getBase64Image(image)
        data.push(imData)
    }
    return data
}

getBase64Image = async (image) => {
    // image {url,fileName}
    let imgData = await axios.get(image.link, {responseType: 'arraybuffer'})
    let fileType = imgData["headers"]["content-type"]
    let parts = fileType.split("/")
    let fileName = image.name+"."+parts[1]
    return{image:imgData.data,fileType:fileType,fileName:fileName,name:image.name}
}

module.exports = {
    downloadDependencies: downloadDependencies
}