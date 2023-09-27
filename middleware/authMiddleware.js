// Import jsonwebtoken
import jwt from "jsonwebtoken";
// Import model user
import Admin from "../models/Admin.js";
import User from "../models/User.js";

const verifyAuth = async ( req, res, next ) => {
    // Request authorization
    const { authorization } = req.headers
    let token;
    // Verify if there is an authorization
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            // Keep the value in a let and later decoded
            token = authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);


            const findAdmin = await Admin.findById(decoded.id).select("-password -token -verified").populate('rol');

            const findUser = await User.findById(decoded.id).select("-password -token").populate('rol');

            if (findAdmin) {
                  // Save decoded value in a request user
                req.user = findAdmin
            }
            
            if (findUser) {
                req.user = findUser
            }
            return next();
        } catch (error) {
            console.log(error);
            return res.status(401).json({ msg: 'Token inválido' });
        }  
    } 
    if (!token) {
        res.status(403).json({ msg: 'Token inválido o inexistente' });
    }
    next();
}

export default verifyAuth;