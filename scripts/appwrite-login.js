import { cuentaUsuario } from './auth.js';
import { mostrarNotificacion, traducirError } from './notificaciones.js';

const formularioLogin = document.getElementById('formulario-login');

formularioLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const correo = document.getElementById('correo-login').value;
    const clave = document.getElementById('clave-login').value;

    try {
        // SOLUCIÓN A TU PRIMER ERROR: Intentamos cerrar cualquier sesión fantasma antes de iniciar
        try {
            await cuentaUsuario.deleteSession('current');
        } catch (e) {
            // Ignoramos si da error aquí (significa que no había sesión, lo cual es lo ideal)
        }

        // 1. Creamos la sesión
        await cuentaUsuario.createEmailPasswordSession(correo, clave);

        // 2. Revisamos los datos del usuario
        const usuario = await cuentaUsuario.get();

        // 3. Verificamos el correo
        if (usuario.emailVerification === true) {
            mostrarNotificacion("¡Inicio de sesión exitoso!", "exito");
            
            // Damos 1.5 segundos para que se vea la notificación antes de redirigir
            setTimeout(() => {
                window.location.href = "home.html"; 
            }, 1500);
        } else {
            mostrarNotificacion("Tu correo aún no ha sido verificado. Revisa tu bandeja.", "error");
            await cuentaUsuario.deleteSession('current');
        }

    } catch (error) {
        console.error("Error original de login:", error);
        // Usamos nuestro traductor para mostrar el mensaje en español
        const mensajeTraducido = traducirError(error.message);
        mostrarNotificacion(mensajeTraducido, "error");
    }
});