const { Router } = require("express");
const userRouter = Router;
const jwt = require("jsonwebtoken");

userRouter.post("/signUp", function(req,res){
    const data = "l";
});

userRouter.post("/logIn", function(req,res){

});

userRouter.get("/home", function(req,res){

});

module.exports = {
    userRouter : userRouter
}