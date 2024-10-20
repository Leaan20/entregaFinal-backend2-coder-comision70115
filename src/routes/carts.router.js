// Router de carts
// cart controller
import CartController from "../controllers/cart.controller.js";
import {Router} from "express";
import jwt from "jsonwebtoken";
import configObject from "../config/dotConfig.js";
const  {secret_cookie, private_key} = configObject;

const cartRouter = Router();



//instanciamos nuestro controlador.
const cartController = new CartController



// GET

// Ruta para ver un carrito específico con los productos que hay dentro
cartRouter.get('/:cid', cartController.getCart);

// POST

// Crear un nuevo carrito
cartRouter.post("/", cartController.newCart);

// POST

// Agregar un producto a un carrito específico
cartRouter.post("/:cid/products/:pid", cartController.addProductToCart);

// DELETE

// Eliminar un producto del carrito. 
cartRouter.delete("/:cid/products/:pid", cartController.deleteProductInCart);

// Eliminar todos los productos del carrito (vaciar)
cartRouter.delete("/:cid",cartController.cartClean);

// PUT

// Actualizar el carrito con un arreglo de productos.
// Recibira el arreglo con los productos (que tenemos cargados en nuestra coleccion de products).
// el formato sera con product(con el Id que nos da MongoDB) y su cantidad (quantity), luego el resto de la informacion sera accesible o visible a partir del populate en nuestro manager.
cartRouter.put("/:cid", cartController.updateCart);



// Actualiza solo la cantidad del mismo producto.

cartRouter.put("/:cid/products/:pid", cartController.updateQuantity);

// Ruta para enviar informacion al front.
cartRouter.get("/user/cart", (req,res) => {
    const token = req.cookies[secret_cookie];

    if(!token){
        res.status(401).json({message: "No se encuentra la cookie o no estas autorizado a accederla", })
    }

    try {
        const decodedToken = jwt.verify(token, private_key);

        const cid = decodedToken.user.cart;

        res.status(200). json({cid});
    } catch (error) {
        res.status(401).send({message: "Token invalido"});
    }
})

export default cartRouter;