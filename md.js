const marked = require("marked")

let genImageName = (text)=>{
    return `image_${ Math.floor((Math.random() * 10000) + 1)}`
}

let textParser = {
    "text": (itm, options = {}) => {
        //console.log(itm.text)
        let txt = itm.text
        .replace("\\","\\textbackslash}")
        .replace(/&amp;/g,"\\&")
        .replace(/&lt;/gm,`\\textless`)
        .replace(/&gt;/gm,`\\textgreater`)
        .replace(/&quot;/g,'"')
        .replace(/&apos;/g,"'")
        .replace(/&#39;/g,"'")
        .replace("%","\\%")
        .replace("{","\\{")
        .replace("}","\\}")
        .replace("^","\\textasciicircum")
        .replace("~","\\textasciitilde")
        .replace("#","\\#")
        .replace("_","\\_")
        //   $ 
        // console.log(txt)
        return { text: txt }
    },
    "strong": (itm, options = {}) => {
        return { text:  `\\textbf{${itm.text}} ` }
    },
    "link": (itm, options = {}) => {
        let url = itm.href
        if (options.baseUrl) {
            // if url does not have a base url, then add one 
        }
        return { text: `\\href{${url}}{${itm.text}}` }
    },
    "del": (itm, options = {}) => {
        // not supported
        return { text: itm.text }
    },
    "codespan": (itm, options = {}) => {
        // inline code
        return { text: `\\verb|${itm.text}|` }
    },
    "image": (itm, options = {}) => {
        let imgName = genImageName(itm.text)
        let fig= `
\\begin{figure}
    \\includegraphics{${imgName}}
    \\caption{${itm.text}}
\\end{figure}`
        return {
            text:fig,
            image:{
                link:itm.href,
                name:imgName
            }
        }
    },
    "escape":(itm,options={}) =>{
        return {text:``}
    },
    "em":(itm,options={}) =>{
        // todo modify this
        return {text:`${itm.text}`}
    },
    "displayMath":(itm,options={})=>{
        return itm.text
    }
}

let parsers = {
    heading: (itm, options = {}) => {
        let title = `section`
        if (itm.depth == 2) { title = 'sub' + title }
        else if (itm.depth >= 3) { title = 'subsub' + title }
        return { text: `\\${title}{${itm.text}} ` }
    },
    paragraph: (itm, options = {}) => {
        let para = itm.tokens.map(it=>{return textParser[it.type](it)})
        // console.log(para)
        let pText = []
        let imgArr = []
        para.map(p=>{
            pText.push(p.text)
            if(p.image){imgArr.push(p.image)}
        })
        return { text:pText.join(""),images:imgArr }
    },
    list: (itm, options = {}) => {
        let processTextTokens = (tkns)=>{
            let pa = tkns.map(tk=>{return textParser[tk.type](tk)})
            return pa.map(p=>{return p.text}).join("")
        }
        let processList = (obj) => {
            let command = "itemize"
            if (obj.ordered) { command = "enumerate" }
            let steps = ``
            obj.items.map(item => {
                let currItem = `  \\item `
                item.tokens.map(tkn => {
                    if (tkn.type == "text") {
                        // normal text , include it after the item keyword
                        currItem += processTextTokens(tkn.tokens)
                    }
                    if (tkn.type == "list") {
                        // list needs to be processsed recuursively 
                        let subList = processList(tkn)
                        currItem += "\n" + subList
                    }
                })
                steps += `${currItem} \n`
            })
            let str = ["\\begin{" + command + "}", steps, "\\end{" + command + "}"].join("\n")
            return str
        }
        return { text: processList(itm) }
    },
    blockquote: (itm, options = {}) => {
        return { text: ["\\begin{displayquote}", '``' + itm.text + '``', "\\end{displayquote}"].join("\n") }
    },
    code: (itm, options = {}) => {
        return { text: ["\\begin{lstlisting}",itm.text, "\\end{lstlisting}"].join("\n") }
    },
    space:(itm,options={}) =>{
        return {text:`\\newline`}
    }
}

// const tokenizer = {
//     paragraph(src) {
//       const match = src.match(/\$\$(.*?)\$\$/);
//       if (match) {
//         return {
//           type: 'displayMath',
//           raw: match[0],
//           text: match[1].trim()
//         };
//       }
//       // return false to use original  tokenizer
//       return false;
//     }
//   };
  
// marked.use({ tokenizer });

let toLatex = (mdString, options = {}) => {
    try {
        let packagesRequired = [
            { name: "hyperref",
        "config":`\\hypersetup{
colorlinks=true,
urlcolor=blue,
linkcolor=blue}` },
            { name: "listings" },
            { name: "csquotes" },
            {name:"graphicx"}
        ]
        let tokens = marked.lexer(mdString)
        console.log(JSON.stringify(tokens,null,2))
        let parts = []
        tokens.map(item => {
            // console.log(item.type)
            if (parsers[item.type]) {
                parts.push(parsers[item.type](item))
            }
        })
        let packages = packagesRequired.map(pkg => { 
            let pk =  `\\usepackage{${pkg.name}} \n`
            if(pkg.config){
                pk += "\n"+pkg.config+"\n"
            }
            return pk
         }).join("")
         let imgArr = []
         parts.map(pt => { if(pt.image){imgArr.push(pt.image)} })
         let data = {
             content:parts.map(pt => { return pt.text }).join("\n"),
             packages:packages,
             images:imgArr
         }
        return data
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    toLatex: toLatex
}