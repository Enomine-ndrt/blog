const jwt = require('jsonwebtoken');

const authenticate = (req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1];
    try{
        const verified =  jwt.verify(token,'faztxyz123');
        req.verifiedUser = verified.user;
        next();
    }catch(e){
        console.log(e);
        next();
    }

}

module.exports = {
    authenticate,
}
