// 1. Importamos las herramientas 'Client' (para conectar) y 'Account' (para el login/registro)
import { Client, Account } from "https://cdn.jsdelivr.net/npm/appwrite@14.0.0/+esm";

// 2. Inicializamos el cliente
const client = new Client();

// 3. Le pasamos tus credenciales exactas de Appwrite Pro
client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1') // Tu API Endpoint
    .setProject('699b21280010506011f2');             // Tu Project ID

// 4. Creamos una instancia de Account usando el cliente configurado
const cuentaUsuario = new Account(client);

// 5. Exportamos estas variables para poder usarlas en cualquier otro archivo JS de tu web
export { client, cuentaUsuario };