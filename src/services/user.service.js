// importamos el repository y las funciones de bcrypt.
import UserRepository from "../repositories/user.repository.js";
import {createHash, isValidPassword} from "../utils/utils.js";

// El servicio se va a encargar de formar la logica abtraida utilizando el repository para enlazar con la DB a traves del DAO.

class UserServices {

    async registerUser(userData){

        try {
            // Verificamos que exista el usuario
            const existingUser = await UserRepository.getUserByEmail(userData.email);

            if(existingUser) throw new Error("El usuario ya existe");

            // Crear un carrito para el usuario y asociar el id al usuario.
            
            //hasheamos el pass
            userData.password = createHash(userData.password);
            // creamos el usuario
            return await UserRepository.createUser(userData);

        } catch (error) {
            console.log(error);

            return ({message: "No es posible registrar al nuevo usuario", error: error});

        }
    }

    async loginUser(email,password){
        try {
            // verificamos si esta registrado el email.
            const user = await UserRepository.getUserByEmail(email);
            //Si no hay un usuario o si la contraseña no coincide.
            if(!user || !isValidPassword(password,user)) throw new Error("Credenciales invalidas");

            // si esta registrado , retornamos el user
            return user;

        } catch (error) {
            console.log(error);

            return ({message: "Error al intentar loguearse", error: error});
        }
    }

    async getUserById(id){
        try {
            //retornamos el user encontrado.
            const user = await UserRepository.getUserById(id);
            return user;

        } catch (error) {
            return ({message: "Error al obtener el usuario", error: error});
        }

    }

    // Se pueden implementar metodos para actualizar y borrar users.
}

//exportamos la instancia.
export default new UserServices();