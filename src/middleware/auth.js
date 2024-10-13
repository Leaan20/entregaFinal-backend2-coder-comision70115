//Permitira el acceso o no , segun seas usuario admin o usuario user.
// al ser middleware los parametros req,res,next son estrictamente necesarios.

// admin
export function soloAdmin(req,res,next){
    if(req.user.role === "admin") {
        next();
    } else {
        res.status(403).send("Acceso denegado, solo para administradores");
    }
}

// user 

export function soloUser(req,res,next){
    if(req.user.role === "user"){
        next();
    } else {
        res.status(403).send("Acceso solo para usuarios comunes.");
    }
}