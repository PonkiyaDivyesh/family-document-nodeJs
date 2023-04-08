require("dotenv").config();
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

require("./db/conn")
const userRouter = require("./routers/userRouters");

const app = express()
const port = process.env.PORT || 3002

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', userRouter)

app.listen(port, () => {
    console.log(`connection is setup at ${port}`);
})

// app.listen(port, '192.168.1.13', () => {
//     console.log(`connection is setup at ${port}`);
// })