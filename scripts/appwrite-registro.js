import { cuentaUsuario } from './auth.js';
import { ID } from "https://cdn.jsdelivr.net/npm/appwrite@14.0.0/+esm";

const formularioRegistro = document.getElementById('formulario-registro');

formularioRegistro.addEventListener('submit', async (evento) => {
    evento.preventDefault(); 

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const clave = document.getElementById('clave').value;

    try {
        // 1. Creamos el usuario
        await cuentaUsuario.create(ID.unique(), correo, clave, nombre);

        // 2. Appwrite requiere que el usuario inicie sesión para enviarle el correo de verificación
        await cuentaUsuario.createEmailPasswordSession(correo, clave);

        // 3. Generamos dinámicamente la URL base (sirve tanto para Live Server como para labs.saov.page)
        const urlVerificacion = window.location.origin + '/verificacion-correo.html';
        
        // 4. Solicitamos a Appwrite que envíe el correo
        await cuentaUsuario.createVerification(urlVerificacion);

        alert("¡Registro exitoso! Te hemos enviado un correo para verificar tu cuenta. Por favor revisa tu bandeja de entrada.");
        
        // 5. Cerramos la sesión temporal que abrimos en el paso 2
        await cuentaUsuario.deleteSession('current');

        // Redirigimos al inicio de sesión
        window.location.href = "sign-in.html";

    } catch (error) {
        console.error("Error al registrar:", error);
        alert("Hubo un problema: " + error.message);
    }
});