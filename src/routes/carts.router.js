// Router de carts
// cart controller
import CartController from "../controllers/cart.controller.js";
import {Router} from "express";
import passport from "passport";
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


// Ruta para finalizar compra
cartRouter.post("/:cid/purchase",passport.authenticate("current", { session: false }) ,(req, res, next) => {
    console.log("Usuario autenticado:", req.user); // Debería mostrar el usuario si está autenticado
    next(); // Continúa al siguiente middleware
}, cartController.purchaseCart);





export default cartRouter;