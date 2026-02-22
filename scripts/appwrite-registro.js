// Importamos tu configuración (cuentaUsuario) y la herramienta ID de Appwrite
import { cuentaUsuario } from './auth.js';
import { ID } from "https://cdn.jsdelivr.net/npm/appwrite@14.0.0/+esm";

// Seleccionamos el formulario usando su ID (el que pusimos en el HTML)
const formularioRegistro = document.getElementById('formulario-registro');

// Escuchamos cuando el usuario hace clic en el botón de "submit"
formularioRegistro.addEventListener('submit', async (evento) => {
    // Evitamos que la página se recargue de golpe
    evento.preventDefault(); 

    // Obtenemos los valores que el usuario escribió en los inputs
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const clave = document.getElementById('clave').value;

    try {
        // Le pedimos a Appwrite que cree un nuevo usuario
        // El orden estricto de Appwrite es: ID único, correo, contraseña, nombre
        const respuesta = await cuentaUsuario.create(
            ID.unique(), 
            correo, 
            clave, 
            nombre
        );

        console.log("¡Usuario registrado con éxito!", respuesta);
        alert("¡Registro exitoso! Ya puedes iniciar sesión.");
        
        // Redirigimos al usuario a la pantalla de inicio de sesión
        window.location.href = "sign-in.html";

    } catch (error) {
        // Si hay un error (ej. correo ya existe o contraseña corta), lo mostramos
        console.error("Error al registrar:", error);
        alert("Hubo un problema: " + error.message);
    }
});