const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");


const { userRouter } = require("./routes/userRouter");
const pool = require("./db"); 

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use("/user", userRouter);


app.get("/", (req, res) => {
  res.json({
    msg: "Hello from backend!"
  });
});



app.listen(3000);
