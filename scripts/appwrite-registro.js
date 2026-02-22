import { cuentaUsuario } from './auth.js';
import { ID } from "https://cdn.jsdelivr.net/npm/appwrite@14.0.0/+esm";
import { mostrarNotificacion, traducirError } from './notificaciones.js';

const formularioRegistro = document.getElementById('formulario-registro');

formularioRegistro.addEventListener('submit', async (evento) => {
    evento.preventDefault(); 

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const clave = document.getElementById('clave').value;

    try {
        await cuentaUsuario.create(ID.unique(), correo, clave, nombre);
        await cuentaUsuario.createEmailPasswordSession(correo, clave);

        const urlVerificacion = window.location.origin + '/verificacion-correo.html';
        await cuentaUsuario.createVerification(urlVerificacion);

        mostrarNotificacion("¡Registro exitoso! Revisa tu correo para verificar la cuenta.", "exito");
        
        await cuentaUsuario.deleteSession('current');

        // Retrasamos la redirección para que puedas ver el diseño del Toast
        setTimeout(() => {
            window.location.href = "sign-in.html";
        }, 3000);

    } catch (error) {
        console.error("Error original de registro:", error);
        // Usamos nuestro traductor para los errores como el de la contraseña débil
        const mensajeTraducido = traducirError(error.message);
        mostrarNotificacion(mensajeTraducido, "error");
    }
});