import { Client, Account, Storage } from "https://cdn.jsdelivr.net/npm/appwrite@14.0.0/+esm";

const client = new Client();

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1') 
    .setProject('699b21280010506011f2');             

const cuentaUsuario = new Account(client);

// NUEVO: Inicializamos el servicio de almacenamiento
const almacenamiento = new Storage(client);

// Exportamos ambas herramientas
export { client, cuentaUsuario, almacenamiento };