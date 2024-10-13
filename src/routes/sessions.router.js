// Router para sessiones
import { Router } from "express";
//passport
import passport from "passport";
import UserController from "../controllers/user.controller.js";
import { soloAdmin } from "../middleware/auth.js";

//instanciamos nuestro router de sessions.
const sessionRouter = Router();
// generamos una instancia de nuestro controlador.
const userController = new UserController();

// importaremos el UserController
// y generamos las rutas con el controlador y sus metodos.
// utilizamos los controladores para manejar las solicitudes y brindar respuestas del servidor.

// Register
sessionRouter.post("/register", userController.register);

// Login
sessionRouter.post("/login", userController.login);

// current
sessionRouter.get("/current", passport.authenticate("current", {session:false}),soloAdmin , userController.current);

// ruta para desloguearse
sessionRouter.get("/logout", userController.logout);



export default sessionRouter;