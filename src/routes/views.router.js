import { Router } from "express";
import ProductService from "../services/product.service.js";
import CartService from "../services/cart.service.js";
const viewsRouter = Router();
import passport from "passport";
import { soloAdmin, soloUser } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import configObject from "../config/dotConfig.js";
//Instanciamos nuestro manager de productos.




const {secret_cookie, private_key} = configObject;
// Products

// Aplicamos paginate.
// ejemplo de busqueda : http://localhost:8080/products?category=higiene%20personal&limit=1&page=2&sort=price&order=asc


viewsRouter.get("/products", passport.authenticate("current", {session: false}), soloUser, async (req, res) => {
    try {

        const userCartId = req.user.cartId;
        // Obtener query params con valores predeterminados
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || 'price';
        const order = req.query.order === 'desc' ? -1 : 1;
        const category = req.query.category || '';

        // Filtro por categoría
        const filter = {};
        if (category) {
            filter.category = category;
        }

        // Configuración de paginación
        const options = {
            limit,
            page,
            sort: { [sort]: order },
            lean: true
        };

        // Obtener los productos paginados
        const products = await ProductService.paginateProducts(filter, options);

        // Validar si hay productos
        if (!products.docs || products.docs.length === 0) {
            return res.status(404).send({
                status: 'error',
                message: 'No se encontraron productos en esta página'
            });
        }

        // Imprimir productos para depuración
        console.log(products.docs);

        // Datos para la vista
        const payload = {
            payload: products.docs,
            cartId: userCartId,
            status: "success",
            pagination: {
                totalDocs: products.totalDocs,
                limit: products.limit,
                totalPages: products.totalPages,
                page: products.page,
                pagingCounter: products.pagingCounter,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage
            },
            query: {
                sort,
                category,
                limit
            }
        };

        // Renderizar la vista con los productos
        res.status(200).render("home", payload);

    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Hay un error del servidor, no podemos mostrar los productos");
    }
});


// Este router va a trabajar con websocket. para actualizar automaticamente la vista.

viewsRouter.get("/realtimeproducts", passport.authenticate("current", {session:false}), soloAdmin , (req,res) => {
    try {
        return res.render("realTimeProducts");

    } catch (error) {
        res.status(500).send("Hay un error en el servidor, intente mas tarde");
    }
});


// Carts

viewsRouter.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await CartService.getCartById(cid);
        if (!cart) {
            res.send(`No hay un carrito con el id ${cid}`);
            return;
        }
        // utilizamos el product(referenciado a cada elemento del array), en su array product. y sus distintas propiedades.
        const productInCart = cart.products.map(product => ({
            productId: product.product._id,
            quantity: product.quantity,
            title: product.product.title,
            price: product.product.price,
            category: product.product.category,
            thumbnails: product.product.thumbnails
        }));
        console.log('Contenido del carrito:', productInCart);
        res.render("cartView", { cart: productInCart });

    } catch (error) {
        res.status(500).send("Hay un error , no es posible mostrar el carrito.");
        throw error;

    }
});


////Sessions \\\\

//vista para el registro

viewsRouter.get("/register", (req,res) => {

    try {
        // Verificamos si ya hay un usuario autenticado.
        const token = req.cookies[secret_cookie];
        if (token) {
            const user = jwt.verify(token, private_key);
            if (user) {
                return res.redirect("/profile");
            }
        }
        // Si no hay un usuario autenticado , mostramos el registro.
        res.render("register");
    } catch (error) {
        console.log(error);
        res.status(500).send("No es posible acceder a la página de registro, intente más tarde.");
    }
});

// Vista para el login

viewsRouter.get("/login", (req, res) => {
    try {
        const token = req.cookies[secret_cookie];
        if (token) {
            const user = jwt.verify(token, private_key);
            if (user) {
                return res.redirect("/profile");
            }
        }
        res.render("login");
    } catch (error) {
        console.log(error);
        res.status(500).send("No podemos mostrar la página de login, disculpe las molestias 😢");
    }
});

// vista para el perfil

viewsRouter.get("/profile", passport.authenticate("current", { session: false }), (req, res) => {
    try {
        console.log(req.user);

        // Si el usuario es un "admin", renderizamos el profile con la opcion de ir a la administracion de productos, caso contrario , lo enviamos con el acceso a la tienda.
        if(req.user.role === "admin"){
            res.render("profile", { user: req.user, isAdmin : true });
            return;
        }
        res.render("profile", { user: req.user });
    } catch (error) {
        res.status(500).send("No es posible cargar el perfil");
    }
});


export default viewsRouter;