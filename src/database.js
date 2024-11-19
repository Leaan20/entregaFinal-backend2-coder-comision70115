import mongoose from "mongoose";
import configObject from "./config/dotConfig.js";
// Singleton en la DB

const {mongo_url} = configObject;
// Utilizamos el metodo de mongoose para poder conectarnos a la DB
// El uso de then y catch para poder verificar la conexion.
class DataBase {
    static #instance; 
    //Se declara una variable estática y privada llamada #instancia. 

    constructor() {
        mongoose.connect(mongo_url); 
    }

    static getInstance() {
        if (this.#instance) {
            //Si ya tenemos una instancia, la retornamos: 
            return this.#instance;
        }
        //Caso contrario, la creamos: 
        this.#instance = new DataBase(); 
        return this.#instance;
    }

}

export default DataBase; 

