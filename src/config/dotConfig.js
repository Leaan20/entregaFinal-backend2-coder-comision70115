import dotenv from 'dotenv';
import program from '../utils/commander.js';

const { mode } = program.opts();

// Cargar el archivo de entorno directamente
dotenv.config({ path: './.env.desarrollo' });


const configObject = {
    mongo_url: process.env.MONGO_URL,
    secret_cookie: process.env.SECRET_COOKIE,
    private_key: process.env.PRIVATE_KEY,
    port: process.env.PORT
};

console.log('MONGO_URL:', configObject.mongo_url);
console.log('PRIVATE_KEY:', configObject.private_key);
console.log('SECRET_COOKIE:', configObject.secret_cookie);
console.log(mode);

export default configObject;