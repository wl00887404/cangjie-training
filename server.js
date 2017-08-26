const express = require('express')

const app = express();

app.use(express.static('./build'))

app.listen(8081,()=>console.log("http://localhost:8081/"))
