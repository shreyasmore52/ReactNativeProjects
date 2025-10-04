const express = require("express");
const envFile = require("dotenv");
envFile.config();
const { userRouter } = require("./routes/user");
const pool = require("./db");
const app = express();
// parse JSON
app.use(express.json());

// Routes
app.use("/api/v1/user", userRouter);

app.get("/", function(req,res){
    res.json({
        msg: "hello from backend"
    })
})

app.listen(3004);