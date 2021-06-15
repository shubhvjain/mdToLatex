const marked = require("marked")

let textParser = {
    "text": (itm, options = {}) => {
        // todo look for math here 
        return { text: itm.text }
    },
    "strong": (itm, options = {}) => {
        return { text: ` \\textbf{${itm.text}} ` }
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
        return {text:""}
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
        return { text: itm.text }
    },
    list: (itm, options = {}) => {
        let processList = (obj) => {
            let command = "itemize"
            if (obj.ordered) { command = "enumerate" }
            let steps = ``
            obj.items.map(item => {
                let currItem = `\\item `
                item.tokens.map(tkn => {
                    if (tkn.type == "text") {
                        // normal text , include it after the item keyword
                        currItem += tkn.text
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
        return { text: ["\\begin{lstlisting}", itm.text, "\\end{lstlisting}"].join("\n") }
    }
}

let toLatex = (mdString, options = {}) => {
    try {
        let packagesRequired = [
            { name: "hyperref" },
            { name: "listings" },
            { name: "csquotes" }
        ]
        let tokens = marked.lexer(mdString)
        let parts = []
        tokens.map(item => {
            if (parsers[item.type]) {
                //console.log(parsers[item.type](item))
                parts.push(parsers[item.type](item))
            }
        })
        //console.log(parts)
        //  console.log()
        let doc = `\\documentclass[a4paper,12pt]{article} 

${packagesRequired.map(pkg => { return `\\usepackage{${pkg.name}} \n` }).join("")}
\\begin{document}

${parts.map(pt => { return pt.text }).join("\n")}

\\end{document}`
        return doc
    } catch (error) {
        console.log(error)
    }
}

let sample = `# Title of the article 
## Subtitle of the article 
this is another paragraph 
this is another paragraph with a list
- sample list 1
- sammple list 2
- sample list 3

> sample

numbered list
1. sample
2. sample 3
3. sample4

**this** para [contains](link) inline ~~things~~. this will be used here  \`code here\` ![img](somethinghere)

![sample](/sample)

\`\`\`
some code here
then more here
more ;
\`\`\`

- list 1
	- sub list 1
		- item 1
			1. sample 1
            2. sample 2
- list 2

1. item list 1
	- sample 1
	- sample 2
2. item list 2


`

console.log(toLatex(sample))


module.exports = {
    toLatex: toLatex
}
