require("dotenv").config();
const express = require("express")
require("./db/conn")
const StudentRouter = require("../src/routers/studentRouters");

const app = express()
const port = process.env.PORT || 3002

app.use(express.json());
app.use('/api/v1', StudentRouter)

app.listen(port, () => {
    console.log(`connection is setup at ${port}`);
})

// app.listen(port, '192.168.1.13', () => {
//     console.log(`connection is setup at ${port}`);
// })