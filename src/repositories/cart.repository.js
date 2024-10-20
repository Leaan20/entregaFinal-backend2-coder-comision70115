// importamos el DAO de cart
import CartDAO from "../dao/cart.dao.js";

// Creamos el repository de cart

class CartRepository {
    async createCart(){
        return await CartDAO.save();
    }

    async getCartById(cid){
        return await CartDAO.findById(cid);
    }

    async addProductToCart(cid,cartData){
        return await CartDAO.update(cid,cartData);
    }

    // Actualizamos info del carrito.
    async updateCart(cid,cartData){
        return await CartDAO.update(cid,cartData);
    }

    //que pueda solo modificar la cantidad

    async deleteCartByid(cid){
        return await CartDAO.delete(cid);
    }

    //que pueda borrar el producto del carrito.

    async productDelete(cartData){
        const cid = cartData[0];
        const update = cartData[1];
        return await CartDAO.updateOne(cid, update);
    }
}

export default new CartRepository();