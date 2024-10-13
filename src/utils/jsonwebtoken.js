import jwt from "jsonwebtoken";
import configObject from "../config/dotConfig.js";

const {private_key} = configObject;
// Funcion que genera el token.
 const generateToken = (user) => {
    const token = jwt.sign({user}, private_key, {expiresIn:"1h"});

    return token;
};

export default generateToken;