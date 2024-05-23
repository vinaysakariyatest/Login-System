var jwt = require('jsonwebtoken');

exports.check_token= async(req,res,next)=>{
    jwt.verify(req.headers.authorization,process.env.SECRET_KEY,next)
}