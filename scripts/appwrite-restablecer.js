import { cuentaUsuario } from './auth.js';
import { mostrarNotificacion, traducirError } from './notificaciones.js';

const formularioRestablecer = document.getElementById('formulario-restablecer');
const mensajeEstado = document.getElementById('mensaje-estado');
const cajaLogin = document.getElementById('caja-login');
const btnActualizar = document.getElementById('btn-actualizar');

// Extraemos los tokens secretos que Appwrite puso en la URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
const secret = urlParams.get('secret');

// Si alguien entra a esta página sin venir del correo, ocultamos el formulario
if (!userId || !secret) {
    formularioRestablecer.style.display = 'none';
    mensajeEstado.innerText = "El enlace de recuperación es inválido o ha expirado.";
    mensajeEstado.style.color = "#ef4444";
}

formularioRestablecer.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const nuevaClave = document.getElementById('nueva-clave').value;
    const confirmarClave = document.getElementById('confirmar-clave').value;

    // Validación local: verificamos que ambas contraseñas sean iguales
    if (nuevaClave !== confirmarClave) {
        mostrarNotificacion("Las contraseñas no coinciden. Intenta de nuevo.", "error");
        return; // Detenemos la ejecución aquí
    }

    try {
        btnActualizar.innerText = "Actualizando...";
        btnActualizar.disabled = true;

        // Le enviamos a Appwrite el ID, el secreto de la URL y la contraseña 2 veces
        await cuentaUsuario.updateRecovery(userId, secret, nuevaClave, confirmarClave);
        
        mostrarNotificacion("¡Contraseña actualizada con éxito!", "exito");
        
        // Ocultamos el formulario y mostramos el botón para ir a login
        formularioRestablecer.style.display = 'none';
        mensajeEstado.innerText = "Tu contraseña ha sido cambiada. Ya puedes iniciar sesión.";
        mensajeEstado.style.color = "#10b981"; // Verde éxito
        cajaLogin.style.display = "block";

    } catch (error) {
        console.error("Error al restablecer:", error);
        mostrarNotificacion(traducirError(error.message), "error");
        btnActualizar.innerText = "Actualizar Contraseña";
        btnActualizar.disabled = false;
    }
});