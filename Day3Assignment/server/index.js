const express = require ("express");
const envFile = require("dotenv");
envFile.config();

const app = express();
app.use(express.json())

app.get('/', function (req,res){
    res.json({
        message: "welcome to backend "
    })
});

app.listen(process.env.PORT);



