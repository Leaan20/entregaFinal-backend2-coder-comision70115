// Router de products
import {Router} from "express";
//importamos el controller
import ProductController from "../controllers/product.controller.js";
const productRouter = Router();
// instanciamos nuestro controller para aplicar sus metodos en las rutas
const productController = new ProductController();


// GET

//http://localhost:8080/api/products?limit=(numero que da el limite a mostrar).

productRouter.get('/', productController.getProducts);

productRouter.get("/:pid", productController.getProduct);

// POST

productRouter.post("/", productController.newProduct);

// PUT

productRouter.put("/:pid", productController.productUpdate);

// DELETE

productRouter.delete("/:pid", productController.productDelete)

export default productRouter;