const { Router } = require("express");
const userRouter = Router();
const { userAuthMiddleware, JWT_SECRET } = require("../Middleware/userAuthMiddleware"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db");

userRouter.post("/verify", userAuthMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Token is valid",
    user: req.user, // comes from middleware
  });
});

userRouter.post("/signUp", async function(req,res){
    const {email, password ,firstname, lastname} = req.body;
     
    try{
         const checkUser = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
         if(checkUser.rows.length > 0){
            return res.json({
                meg:"User Exists"
            });
         }
             const hashPass = await bcrypt.hash(password, 5);
             const result = await pool.query(
                "INSERT INTO users (email, password, firstname, lastname) VALUES ($1,$2,$3,$4) RETURNING *",
                [email, hashPass, firstname, lastname]);

             res.json({
                msg: "user creted",
                user: result.rows[0]
             });
            
    }catch(e){
            console.error("Signup error:", e);
            res.status(500).json({ error: "Server error" });       
    }
});

userRouter.post("/logIn", async function(req,res){
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const foundUser = user.rows[0];
    try{
        if(!foundUser){
            return res.json({
                msg: "User not exits"
            });
        }
        const checkPass = await bcrypt.compare(password, foundUser.password);
        if(checkPass){
            const token = jwt.sign({
            userId : foundUser.id
            },JWT_SECRET);

            return res.json({
            msg: "Logged in", 
            token: token
            });
        }
     
    } catch(e){
         console.error("Login error:", e);
        res.status(500).json({ error: "Server error" });
    }

});

userRouter.get("/profile", userAuthMiddleware ,async function(req,res){
    try{
        console.log("userID",req.userId);
        const data = await pool.query(
            "SELECT firstname FROM users WHERE id=$1", [req.userId]);
      if (data.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
        res.json({
           msg: "Welcome home!", 
           user: data.rows[0] 
        });

    }catch(e){
        console.error("Error on ->", e);   
        res.status(500).json({ error: e.message });
    }
});



module.exports = {userRouter};
