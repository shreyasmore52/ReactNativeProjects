const jwt = require("jsonwebtoken");
const JWTKey = process.env.JWT_User_Key;

function userMiddelware(req,res,next){

    try{
        const authHeader  = req.headers.authorization;

        if (!authHeader ) {
            return res.status(401).json({ 
                error: "No token provided" 
            });
        }
        const token = authHeader.split(" ")[1];
        const verifyToken = jwt.verify(token, JWTKey);

        if(verifyToken){
            req.userId = verifyToken.userId;
            next();
        }

    }catch(e){
        return res.json({
            error: "Invalid token: " + e.message 
        })
    }
}

module.exports = {
    userMiddelware,
    JWTKey
}