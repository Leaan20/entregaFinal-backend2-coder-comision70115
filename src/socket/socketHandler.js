import ProductServices from "../services/product.service.js";
// Pasamos nuestro Socket a un archivo externo


// abrimos el servidor con la conexion desde el back
// acuerdo de conexion. recibimos el socket de cliente como parametro para poder recibir y enviar mensajes.

export default function socketHandler(io) {
    io.on('connection', async (socket) => {

        // enviamos los productos al cliente.
        socket.emit("products", await ProductServices.getProducts());

        // Eliminamos el producto.
        socket.on("productDelete", async (id) => {
            await ProductServices.deleteProduct(id);

            // volvemos a enviar la lista actualizada.
            socket.emit("products", await ProductServices.getProducts());
        });

        // recibimos el nuevo producto:
        socket.on("newProduct", async (data) => {
            await ProductServices.addProduct(data);

            // volvemos a enviar la lista actualizada.
            const updatedProducts = await ProductServices.getProducts();
            io.emit('updateProducts', updatedProducts);
        });

    });
}