const express = require('express');
const md = require("./md")
const latex = require("./latex")
const app = express();
app.use(express.json({limit: '25mb'}))
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET")
    return res.status(200).json({})
  }
  next();
})

app.get("/", (req, res) => { res.json({ "hello": "Hello world" })})

app.post('/', async (req, res) => {
  try {
    if (!req.body.options) { throw new Error("Options not provided") }
    if (!req.body.data) { throw new Error("Data not provided") }
    let options = req.body.options
    let data = req.body.data
    if (typeof data != "string") { throw new Error("Invalid data") }
    let tex = md.toLatex(data, options)
    res.json(tex)

  } catch (error) {
    console.log(error)
    console.log("Error: " + error.message)
    res.json({ "error": error.message })
  }
});

app.post('/dep', async (req, res) => {
  try {
    if (!req.body.options) { throw new Error("Options not provided") }
    if (!req.body.data) { throw new Error("Data not provided") }
    let options = req.body.options
    let data = req.body.data
    if (typeof data != "string") { throw new Error("Invalid data") }
    let zipFileContents = await  latex.downloadDependencies(data,options)
    const fileName = 'uploads.zip';
    const fileType = 'application/zip';
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Type': fileType,
    })
    return res.end(zipFileContents);
  } catch (error) {
    console.log(error)
    console.log("Error: " + error.message)
    res.json({ "error": error.message })
  }
})

const port = process.env.PORT || 3220
app.set('port', port)
app.listen(port, () => console.log(`App started on port ${port}.`))