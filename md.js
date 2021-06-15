const marked = require("marked")

let a = [
    {
     "type": "list",
     "raw": "- list 1\n    - sub list 1\n        - item 1\n            1. sample 1\n            2. sample 2\n- list 2\n\n",
     "ordered": false,
     "start": "",
     "loose": false,
     "items": [
      {
       "type": "list_item",
       "raw": "- list 1\n    - sub list 1\n        - item 1\n            1. sample 1\n            2. sample 2\n",
       "task": false,
       "loose": false,
       "text": "list 1\n  - sub list 1\n      - item 1\n          1. sample 1\n          2. sample 2",
       "tokens": [
        {
         "type": "text",
         "raw": "list 1",
         "text": "list 1",
         "tokens": [
          {
           "type": "text",
           "raw": "list 1",
           "text": "list 1"
          }
         ]
        },
        {
         "type": "list",
         "raw": "  - sub list 1\n      - item 1\n          1. sample 1\n          2. sample 2",
         "ordered": false,
         "start": "",
         "loose": false,
         "items": [
          {
           "type": "list_item",
           "raw": "  - sub list 1\n      - item 1\n          1. sample 1\n          2. sample 2",
           "task": false,
           "loose": false,
           "text": "sub list 1\n  - item 1\n      1. sample 1\n      2. sample 2",
           "tokens": [
            {
             "type": "text",
             "raw": "sub list 1",
             "text": "sub list 1",
             "tokens": [
              {
               "type": "text",
               "raw": "sub list 1",
               "text": "sub list 1"
              }
             ]
            },
            {
             "type": "list",
             "raw": "  - item 1\n      1. sample 1\n      2. sample 2",
             "ordered": false,
             "start": "",
             "loose": false,
             "items": [
              {
               "type": "list_item",
               "raw": "  - item 1\n      1. sample 1\n      2. sample 2",
               "task": false,
               "loose": false,
               "text": "item 1\n  1. sample 1\n  2. sample 2",
               "tokens": [
                {
                 "type": "text",
                 "raw": "item 1",
                 "text": "item 1",
                 "tokens": [
                  {
                   "type": "text",
                   "raw": "item 1",
                   "text": "item 1"
                  }
                 ]
                },
                {
                 "type": "list",
                 "raw": "  1. sample 1\n  2. sample 2",
                 "ordered": true,
                 "start": 1,
                 "loose": false,
                 "items": [
                  {
                   "type": "list_item",
                   "raw": "  1. sample 1\n",
                   "task": false,
                   "loose": false,
                   "text": "sample 1",
                   "tokens": [
                    {
                     "type": "text",
                     "raw": "sample 1",
                     "text": "sample 1",
                     "tokens": [
                      {
                       "type": "text",
                       "raw": "sample 1",
                       "text": "sample 1"
                      }
                     ]
                    }
                   ]
                  },
                  {
                   "type": "list_item",
                   "raw": "  2. sample 2",
                   "task": false,
                   "loose": false,
                   "text": "sample 2",
                   "tokens": [
                    {
                     "type": "text",
                     "raw": "sample 2",
                     "text": "sample 2",
                     "tokens": [
                      {
                       "type": "text",
                       "raw": "sample 2",
                       "text": "sample 2"
                      }
                     ]
                    }
                   ]
                  }
                 ]
                }
               ]
              }
             ]
            }
           ]
          }
         ]
        }
       ]
      },
      {
       "type": "list_item",
       "raw": "- list 2\n",
       "task": false,
       "loose": false,
       "text": "list 2",
       "tokens": [
        {
         "type": "text",
         "raw": "list 2",
         "text": "list 2",
         "tokens": [
          {
           "type": "text",
           "raw": "list 2",
           "text": "list 2"
          }
         ]
        }
       ]
      }
     ]
    },
    {
     "type": "list",
     "raw": "1. item list 1\n    - sample 1\n    - sample 2\n2. item list 2\n\n",
     "ordered": true,
     "start": 1,
     "loose": false,
     "items": [
      {
       "type": "list_item",
       "raw": "1. item list 1\n    - sample 1\n    - sample 2\n",
       "task": false,
       "loose": false,
       "text": "item list 1\n - sample 1\n - sample 2",
       "tokens": [
        {
         "type": "text",
         "raw": "item list 1",
         "text": "item list 1",
         "tokens": [
          {
           "type": "text",
           "raw": "item list 1",
           "text": "item list 1"
          }
         ]
        },
        {
         "type": "list",
         "raw": " - sample 1\n - sample 2",
         "ordered": false,
         "start": "",
         "loose": false,
         "items": [
          {
           "type": "list_item",
           "raw": " - sample 1\n",
           "task": false,
           "loose": false,
           "text": "sample 1",
           "tokens": [
            {
             "type": "text",
             "raw": "sample 1",
             "text": "sample 1",
             "tokens": [
              {
               "type": "text",
               "raw": "sample 1",
               "text": "sample 1"
              }
             ]
            }
           ]
          },
          {
           "type": "list_item",
           "raw": " - sample 2",
           "task": false,
           "loose": false,
           "text": "sample 2",
           "tokens": [
            {
             "type": "text",
             "raw": "sample 2",
             "text": "sample 2",
             "tokens": [
              {
               "type": "text",
               "raw": "sample 2",
               "text": "sample 2"
              }
             ]
            }
           ]
          }
         ]
        }
       ]
      },
      {
       "type": "list_item",
       "raw": "2. item list 2\n\n",
       "task": false,
       "loose": false,
       "text": "item list 2",
       "tokens": [
        {
         "type": "text",
         "raw": "item list 2",
         "text": "item list 2",
         "tokens": [
          {
           "type": "text",
           "raw": "item list 2",
           "text": "item list 2"
          }
         ]
        }
       ]
      }
     ]
    }
   ]

let textParser = {
    "text":(itm,options={})=>{
        // todo look for math here 
        return itm.text
    },
    "strong":(itm,options={})=>{
        return ` \\textbf{${itm.text}} `
    },
    "link":(itm,options={})=>{
        let url = itm.href
        if(options.baseImgUrl){
            // if image does not have a base url, then add one 
        }
        // \href{http://www.overleaf.com}{Something Linky}
        return `\\href{${url}}{${itm.text}}`
    },
    "del":(itm,options={})=>{
        // not supported
        return itm.text
    },
    "codespan":(itm,options={})=>{
        // inline code
        return `\\verb|${itm.text}|`
    },
    "image":(itm,options={})=>{},
    "strong":(itm,options={})=>{}
}

let parsers = {
    heading: (itm,options={}) => {
        let title = `section`
        if(itm.depth==2){ title = 'sub'+title }
        else if (itm.depth >= 3){ title = 'subsub'+title  }
        return `\\${title}{${itm.text}} `
    },
    paragraph: (itm,options={}) => {

     },
    list: (itm,options={}) => {

     },
    blockquote: (itm,options={}) => {

    },
    code:(itm,options={})=>{
        return `
\\begin{lstlisting}
${itm.text}
\\end{lstlisting}
`
    }
}

let toLatex = (mdString, options = {}) => {
    try {
        let packagesRequired= [
            {name:"hyperref"},
            {name:"listings"},

        ]
        let tokens = marked.lexer(mdString)
        let parts = []
        tokens.map(item=>{
            if(parsers[item.type]){
                parts.push(parsers[item.type](item))
            }
        })
        console.log(parts)
        let doc = `
\\documentclass[a4paper,12pt]{article} 
\\begin{document}


\\end{document}`


        return doc
    } catch (error) {

    }
}

let sample = `
# Title of the article 

## Subtitle of the article 

some text will come here 

this is another paragraph 

this is another paragraph with a list
- sample list 1
- sammple list 2
- sample list 3

numbered list
1. sample
2. sample 3
3. sample4
`

console.log(toLatex(sample))


module.exports = {
    toLatex: toLatex
}
