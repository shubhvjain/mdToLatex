const marked  = require("marked")

let toLatex = (mdString)=>{

return ``

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

console.log(toLatex())


module.exports = {
toLatex : toLatex
}
