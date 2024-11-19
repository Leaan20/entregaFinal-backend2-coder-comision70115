// Imports

import express from "express";
import { engine } from "express-handlebars";
//Server de socket.io
import { Server } from "socket.io";
//importamos nuestro archivo de socket
import socketHandler from "./socket/socketHandler.js";
// importamos cookieParser cookie-parser
import cookieParser from "cookie-parser";
// importamos los modulos de passport y initializePassport con la estrategia
import passport from "passport";
import initializePassport from "./config/config.js";
//importamos el objeto de configuracion
import configObject from "./config/dotConfig.js";
// importamos la conexion de mongoose.
import DataBase from "./database.js";
// generamos la instancia con el patron Singleton
const DBInstance = DataBase.getInstance();

const { secret_cookie, port } = configObject;
const app = express();
// Routes
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/sessions.router.js";


// Middleware

// Utilizaremos el formato Json.
app.use(express.json());
// para url complejas
app.use(express.urlencoded({extended:true}));
// Nuestros archivos estaticos
app.use(express.static("src/public"));

//cookie
app.use(cookieParser(secret_cookie));

//inicializamos nuestro passport
app.use(passport.initialize());
initializePassport();


// Rutas
// Al utilizar estas rutas, evitamos repeticiones en el codigo de cada router.
app.use("/api/products", productRouter );
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);

// Handlebars , configuracion.
app.engine("handlebars", engine());

// Renderizar los archivos que tengan esa extension.
app.set("view engine", "handlebars");

// Donde se encuentran los archivos a renderizar.
app.set("views", "./src/views");


// Ruta de inicio
app.get("/", (req,res) => {
    res.render("index");
});

// ruta para obtener la cookie en mi front
app.get('/config', (req, res) => {
    res.json({
        secret_cookie: secret_cookie
    });
});


// Creamos nuestro servidor.

// utilizamos una referencia de nuestro servidor.
const httpServer = app.listen(port, () => {
    // Este lo dejo para ingresar mas rapido al navegador.
    console.log(`servidor escuchando desde el puerto: http://localhost:${port}`);
});

// Configuramos el servidor con socket, io se recomienda para la instancia del backend.
const io = new Server(httpServer);

//Funcion que maneja el socket y actualiza los productos
socketHandler(io);
