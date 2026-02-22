import { cuentaUsuario } from './auth.js';
import { mostrarNotificacion, traducirError } from './notificaciones.js';

const formularioRecuperar = document.getElementById('formulario-recuperar');

formularioRecuperar.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const correo = document.getElementById('correo-recuperacion').value;
    // Esta es la URL a la que Appwrite enviará al usuario cuando haga clic en el correo
    const urlRestablecer = window.location.origin + '/restablecer-clave.html';

    try {
        // Solicitamos a Appwrite que inicie la recuperación
        await cuentaUsuario.createRecovery(correo, urlRestablecer);
        
        mostrarNotificacion("Si el correo existe, recibirás un enlace en unos segundos.", "exito");
        
        // Limpiamos el input
        document.getElementById('correo-recuperacion').value = '';

    } catch (error) {
        console.error("Error al recuperar:", error);
        mostrarNotificacion(traducirError(error.message), "error");
    }
});