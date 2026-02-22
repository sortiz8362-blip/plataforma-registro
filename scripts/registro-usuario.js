// 1. Importamos tu configuración (cuentaUsuario) y la herramienta ID de Appwrite
import { cuentaUsuario } from './auth.js';
import { ID } from "https://cdn.jsdelivr.net/npm/appwrite@14.0.0/+esm";

// 2. Seleccionamos el formulario usando su ID
const formularioRegistro = document.getElementById('form-registro');

// 3. Escuchamos cuando el usuario hace clic en el botón de "submit" (Registrarse)
formularioRegistro.addEventListener('submit', async (evento) => {
    // Evitamos que la página se recargue automáticamente
    evento.preventDefault(); 

    // 4. Obtenemos los valores de los inputs
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // 5. Le decimos a Appwrite que cree un nuevo usuario
        // El formato es: ID único, correo, contraseña, nombre
        const respuesta = await cuentaUsuario.create(
            ID.unique(), 
            email, 
            password, 
            nombre
        );

        console.log("¡Usuario registrado con éxito!", respuesta);
        alert("¡Registro exitoso! Ya puedes iniciar sesión.");
        
        // 6. Si todo sale bien, lo enviamos a la página de inicio de sesión
        window.location.href = "sign-in.html";

    } catch (error) {
        // 7. Si hay un error (ej. contraseña muy corta, correo ya existe), lo mostramos
        console.error("Error al registrar:", error);
        alert("Hubo un problema: " + error.message);
    }
});