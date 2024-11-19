// importamos el UserServices, jwt
import UserServices from "../services/user.service.js";
import generateToken from "../utils/jsonwebtoken.js";
// importar DTO
import UserDTO from "../dto/user.dto.js";

// importamos CartService para crear un cart
import CartServices from "../services/cart.service.js";

import configObject from "../config/dotConfig.js";

const {secret_cookie}= configObject;

//El controlador se encarga de las peticiones solicitadas  y las respuestas que va a dar el servidor, delegando la logica al service

class UserController {

    async register(req,res){
        const {first_name, last_name, email, age, password} = req.body;

        try {
            //creamos un cart para asociarlo.
            const newCart = await CartServices.create();


            // Creamos el usuario
            const newUser = await UserServices.registerUser({    first_name,
            last_name,
            email,
            age,
            password,
            cart : newCart
            });
            // Una vez obtenemos el usuario, generamos el token.
            // que va a contener la informacion
            const token = generateToken({first_name: newUser.first_name, last_name:newUser.last_name, email: newUser.email, age: newUser.age, cart: newUser.cart});

            res.cookie(secret_cookie, token, {maxAge: 3600000, httpOnly:true});

            res.redirect("/login");

        } catch (error) {
            console.log(error);
            
            res.status(500).send(error);
        }

    }
    async login(req,res){
        const {email,password}= req.body;

        try {
            const user = await UserServices.loginUser(email,password);
             // Una vez obtenemos el usuario, generamos el token.
            // que va a contener la informacion
            
            const token = generateToken({first_name: user.first_name, last_name:user.last_name, email: user.email, age: user.age, role: user.role, cart: user.cart});

            res.cookie(secret_cookie, token, {maxAge: 3600000, httpOnly:true});

            res.redirect("/profile");

        } catch (error) {
            res.status(500).send({error:error});
        }
    }
    async current(req,res){
        if(req.user){
            const user = req.user;
            const userDTO = new UserDTO(user);

            res.render("current", {user: userDTO});
        } else {
            res.send("No autorizado");
        }
        
    }
    async logout(req,res){
        res.clearCookie(secret_cookie);
        res.redirect("/login");
    }
}

export default UserController;