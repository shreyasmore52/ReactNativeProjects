const { Router } = require("express");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const { userMiddelware, JWTKey } = require("../middelware/authentication");
const bcrypt = require("bcrypt");
const pool = require("../db");


userRouter.post("/signUp", async function(req,res){
    const {Email, password ,firstname, lastname} = req.body;
     
    try{
         const checkUser = await pool.query("SELECT * FROM users WHERE email=$1", [Email]);
         if(checkUser.rows.length > 0){
            return res.json({
                meg:"User Exists"
            });
         }
             const hashPass = await bcrypt.hash(password, 5);
             const result = await pool.query(
                "INSERT INTO users (email, password, firstname, lastname) VALUES ($1,$2,$3,$4) RETURNING *",
                [Email, hashPass, firstname, lastname]);

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
    const { Email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email=$1", [Email]);
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
            },JWTKey);

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

userRouter.get("/home", userMiddelware,async function(req,res){
    try{
        const data = await pool.query(
            "SELECT firstname FROM users WHERE id=$1", [req.userId]);
        res.json({
           msg: "Welcome home!", 
           user: data.rows[0] 
        });

    }catch(e){
        console.error("Error on ->", e);   
        res.status(500).json({ error: e.message });
    }
});

module.exports = {
    userRouter : userRouter
}