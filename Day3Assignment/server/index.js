const express = require ("express");
const envFile = require("dotenv");
envFile.config();
const { userRouter } = require("./routes/user");
const app = express();
app.use(express.json())

//set Up Routes
app.use("/api/v1/user", userRouter);


app.listen(process.env.PORT);



