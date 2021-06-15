const marked = require("marked")

let textParser = {
    "text": (itm, options = {}) => {
        // todo look for math here 
        return itm.text
    },
    "strong": (itm, options = {}) => {
        return ` \\textbf{${itm.text}} `
    },
    "link": (itm, options = {}) => {
        let url = itm.href
        if (options.baseUrl) {
            // if url does not have a base url, then add one 
        }
        return `\\href{${url}}{${itm.text}}`
    },
    "del": (itm, options = {}) => {
        // not supported
        return itm.text
    },
    "codespan": (itm, options = {}) => {
        // inline code
        return `\\verb|${itm.text}|`
    },
    "image": (itm, options = {}) => { },
    "strong": (itm, options = {}) => { }
}

let parsers = {
    heading: (itm, options = {}) => {
        let title = `section`
        if (itm.depth == 2) { title = 'sub' + title }
        else if (itm.depth >= 3) { title = 'subsub' + title }
        return `\\${title}{${itm.text}} `
    },
    paragraph: (itm, options = {}) => {

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
            let str = ["\\begin{"+command+"}",steps,"\\end{" + command + "}" ].join("\n") 
            return str
        }
        return processList(itm)
    },
    blockquote: (itm, options = {}) => {

    },
    code: (itm, options = {}) => {
        return  ["\\begin{lstlisting}",itm.text,"\\end{lstlisting}"].join("\n") 
    }
}

let toLatex = (mdString, options = {}) => {
    try {
        let packagesRequired = [
            { name: "hyperref" },
            { name: "listings" },
        ]
        let tokens = marked.lexer(mdString)
        let parts = []
        tokens.map(item => {
            if (parsers[item.type]) {
                parts.push(parsers[item.type](item))
            }
        })
        // console.log(parts)
        //  console.log()
        let doc = `\\documentclass[a4paper,12pt]{article} 

${packagesRequired.map(pkg => { return `\\usepackage{${pkg.name}} \n` }).join("")}
\\begin{document}

${parts.join("\n")}

\\end{document}`


        return doc
    } catch (error) {

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

**this** para [contains](link) inline ~~things~~. this ^will^ be used here  \`code here\` ![img](somethinghere)

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
