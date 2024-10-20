// importamos el CartRepository
import CartRepository from "../repositories/cart.repository.js";

//implementamos la logica en el service

class CartService {
    //Creamos un carrito
    async create() {
        try {
            const newCart = await CartRepository.createCart();
            return newCart;
        } catch (error) {
            throw new Error("No fue posible crear el carrito")
        }
    }

    // Obtener un carrito por su id
    async getCartById(id){
        try {
            const cart = await CartRepository.getCartById(id);
            console.log(cart);
            
            return cart;
        } catch (error) {
            throw new Error("Error al encontrar el carrito");
        }
    }

    // Eliminar un carrito
    async deleteCart(cid){
        try {
            return await CartRepository.deleteCartByid(cid);

        } catch (error) {
            throw new Error("Error al eliminar el carrito");
        }
    }

    // Vaciar carrito
    async cleanCart(cid){
        try{
            const cart = await CartRepository.getCartById(cid);

            if(!cart || cart.products.legth === 0){
                throw new Error("Error al encontrar el carrito");
            }
            // Vaciamos el array de productos
            cart.products = [];
    
            // Guardamos  el carrito
            await cart.save();
    
            return cart;  // Devuelve el carrito vacío

        } catch (error) {
            throw new Error("Error al vaciar el carrito");
        }
    }

    async addProduct(cid, pid, quantity = 1){
        try {
            const cart = await CartRepository.getCartById(cid);

            const productExist = cart.products.find(item => item.product.toString() === pid);

            if (productExist) {
                // Aumentar la cantidad con el valor pasado en quantity
                productExist.quantity += quantity;
            } else {
                // Añadir el producto con la cantidad especificada
                cart.products.push({ product: pid, quantity });
            }
            cart.markModified("products");

            const updated = await CartRepository.updateCart(cid,cart);
            return updated;
            

        } catch (error) {
            throw new Error("Error al agregar el producto al carrito");
        }
    }


    // Actualizar info del carrito
    async updatedCart(cid,cartData){
        try {

            //verificamos si existe el carrito
            const cart = await CartRepository.getCartById(cid);
            
            if(!cart){
                throw new Error("Error al encontrar el carrito");
            }

             // Iteramos sobre el array de productos que se envían en la solicitud
        for (const item of cartData.products) {
            const productInCart = cart.products.find(prod => prod.product.toString() === item.product);

            if (productInCart) {
                // Si el producto existe, actualizamos su cantidad
                productInCart.quantity = item.quantity;
            } else {
                // Si el producto no existe, lo añadimos al carrito
                cart.products.push({ product: item.product, quantity: item.quantity });
            }
        }

        // Guardamos el carrito actualizado
        const updatedCart = await CartRepository.updateCart(cid, cart);
        return updatedCart;

        } catch (error) {
            throw new Error("Error al actualizar el carrito" + error.message);
        }
    }
    
    // Actualizar solo la cantidad del producto.

    async updateProductQuantity(cid, pid, quantity){
        try {
            //verificamos si existe el carrito
            const cart = await CartRepository.getCartById(cid);
            if(!cart){
                throw new Error("Error al encontrar el carrito");
            }

            const productExist = cart.products.find(item => item.product._id.toString() === pid);

            if(!productExist){
                throw new Error("El producto no existe en el carrito.");
            }
           // Actualizamos la cantidad del producto existente
            productExist.quantity = quantity;

            // Guardamos el carrito actualizado
            const updatedCart = await CartRepository.updateCart(cid, cart);
            return updatedCart;

        } catch (error) {
            throw new Error("Error al actualizar el carrito");
        }
    }

    //Eliminar un producto del carrito
    async deleteProduct(cid, pid){
        try {
            // Actualizamos el carrito utilizando el operador $pull
            const result = await CartRepository.productDelete([
                { _id: cid },
                { $pull: { products: { product: pid } } }
            ]);
            
            
            if (result.matchedCount === 0) {
                // No se encontró el carrito o el producto
                return false;
            }
            return true;


        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito.");
        }
    }
}

export default new CartService();