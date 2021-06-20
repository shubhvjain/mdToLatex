const marked = require("marked")

let genImageName = (text) => {
    return `image_${Math.floor((Math.random() * 10000) + 1)}`
}

let escapeMath = (eq = "") => {
    let eq1 = eq
        .replace(/&amp;/g, "\\&")
        .replace(/&lt;/gm, `\\textless `)
        .replace(/&gt;/gm, `\\textgreater `)
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#39;/g, "'")
        .replace("%", "\\%")
        .replace("~", "\\textasciitilde ")
        .replace("#", "\\#")
        // .replace("_", "\\_")
    return eq1
}

let getInlineMath = (text) => {
    let stack = []
    let phrases = []
    let found = false
    for (let index = 0; index < text.length; index++) {
        let char = text[index];
        if (char == "$") {
            if (found) {
                if (text[index - 1] == "\\") { stack.push(char) }
                else {
                    let oriText = "$" + stack.join("") + "$"
                    phrases.push({
                        type: "inlineMath",
                        origText: oriText,
                        escText: escapeMath(oriText),
                        id: "math" + Math.floor((Math.random() * 1000000) + 1)
                    })
                    stack = []
                    found = false
                }
            } else { found = true }
        } else {
            if (found) { stack.push(char) } else { }
        }
    }
    // console.log(stack, phrases, found)
    return phrases
}

let getDisplayMath = (text) => {
    let displayMath = [...text.matchAll(/\$\$(.*?)\$\$/ig)];
    let phrases = []
    displayMath.map(itm => {
        let origText = itm[1]
        let escText = escapeMath(origText)
        phrases.push({
            id: "displayMath" + Math.floor((Math.random() * 1000000) + 1),
            type: "displayMath",
            origText: origText,
            escText: escText
        })
    })
    return phrases
}


let textParser = {
    "text": (itm, options = {}) => {
        let text = itm.text
        let dMath = getDisplayMath(text)
        dMath.map(math => { text = text.replace(math.origText, math.id) })
        let iMaths = getInlineMath(text)
        iMaths.map(math => { text = text.replace(math.origText, math.id) })
        let txt = text
            .replace("\\", "\\textbackslash ")
            .replace(/&amp;/g, "\\&")
            .replace(/&lt;/gm, `\\textless `)
            .replace(/&gt;/gm, `\\textgreater `)
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&#39;/g, "'")
            .replace("%", "\\%")
            .replace("{", "\\{")
            .replace("}", "\\}")
            .replace("^", "\\textasciicircum ")
            .replace("~", "\\textasciitilde ")
            .replace("#", "\\#")
            .replace("_", "\\_")
        iMaths.map(math => { txt = txt.replace(math.id, math.escText) })
        dMath.map(math => { txt = txt.replace(math.id, math.escText) })
        return { text: txt }
    },
    "strong": (itm, options = {}) => {
        return { text: `\\textbf{${itm.text}} ` }
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
        let fig = `\\includegraphics[max size={0.8\\textwidth}{\\textheight}]{${imgName}}`
        let imgLink = itm.href
        if (imgLink.charAt(0) == "/" && options.baseImgUrl) {
            imgLink = options.baseImgUrl + imgLink
        }
        return {
            text: fig,
            image: { link: imgLink, name: imgName }
        }
    },
    "escape": (itm, options = {}) => {
        return { text: `` }
    },
    "em": (itm, options = {}) => {
        // todo modify this
        return { text: `${itm.text}` }
    },
    "br": (itm, options = {}) => {
        return ``
    }
}

let parsers = {
    heading: (itm, options = {}) => {
        let title = `section`
        if (itm.depth == 2) { title = 'sub' + title }
        else if (itm.depth >= 3) { title = 'subsub' + title }
        return { text: `\\${title}{${itm.text}} \n ` }
    },
    paragraph: (itm, options = {}) => {
        let para = itm.tokens.map(it => { return textParser[it.type](it, options) })
        // console.log(para)
        let pText = []
        let imgArr = []
        para.map(p => {
            pText.push(p.text)
            if (p.image) { imgArr.push(p.image) }
        })
        return { text: pText.join(""), images: imgArr }
    },
    list: (itm, options = {}) => {
        let images = []
        let processTextTokens = (tkns) => {
            let pa = tkns.map(tk => { return textParser[tk.type](tk, options) })
            pa.map(p => { if (p.image) { images = images.concat(p.image) } })
            return pa.map(p => { return p.text }).join("")
        }
        let processList = (obj) => {
            let command = "itemize"
            if (obj.ordered) { command = "enumerate" }
            let steps = ``
            obj.items.map(item => {
                let currItem = `\n  \\item `
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
                steps += `${currItem}`
            })
            let str = ["\n\\begin{" + command + "}", steps, "\\end{" + command + "}", "\n"].join("\n")
            return str
        }
        let list = processList(itm)
        return { text: list + "\n", images: images }
    },
    blockquote: (itm, options = {}) => {
        return { text: ["\\begin{displayquote}", '``' + itm.text + '``', "\\end{displayquote}", "\n"].join("\n") }
    },
    code: (itm, options = {}) => {
        return { text: ["\\begin{lstlisting}", itm.text, "\\end{lstlisting}"].join("\n") }
    },
    space: (itm, options = {}) => {
        return { text: `\\newline` }
    }
}

let getRequiredPackages = () => {
    let packagesRequired = [
        {
            name: "{hyperref}",
            "config": `\\hypersetup{
    colorlinks=true,
    urlcolor=blue,
    linkcolor=blue
    }` },
        { name: "{listings}" },
        { name: "{csquotes}" },
        { name: "{graphicx}", config: `\\graphicspath{ {./images/} }` },
        { name: "[export]{adjustbox}" }
    ]
    let packages = packagesRequired.map(pkg => {
        let pk = `\\usepackage${pkg.name} \n`
        if (pkg.config) {pk += "\n" + pkg.config + "\n"}
        return pk
    }).join("")
    return packages
}

let getMDToken = (mdString) => {
    return marked.lexer(mdString)
}

let toLatex = (mdString, options = {}) => {
    try {
        let tokens = getMDToken(mdString)
        // console.log(JSON.stringify(tokens,null,2))
        let parts = []
        tokens.map(item => {
            if (parsers[item.type]) { parts.push(parsers[item.type](item, options)) }
        })
        // console.log(parts)
        let imgArr = []
        //  console.log(parts)
        parts.map(pt => { if (pt.images) { imgArr = imgArr.concat(pt.images) } })
        let data = {
            content: parts.map(pt => { return pt.text }).join(""),
            packages: getRequiredPackages(),
            images: imgArr
        }
        return data
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    toLatex: toLatex
}