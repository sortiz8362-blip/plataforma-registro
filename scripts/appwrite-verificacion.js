import { cuentaUsuario } from './auth.js';

// Appwrite añade a la URL un "userId" y un "secret" cuando el usuario hace clic en el enlace del correo.
// Aquí extraemos esos datos de la barra de direcciones.
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
const secret = urlParams.get('secret');

const titulo = document.getElementById('titulo-verificacion');
const mensaje = document.getElementById('mensaje-verificacion');
const cajaLogin = document.getElementById('caja-login');

async function validarCuenta() {
    // Si la URL no tiene los datos necesarios, mostramos error
    if (!userId || !secret) {
        titulo.innerText = "Enlace Inválido";
        mensaje.innerText = "El enlace de verificación no es válido o está incompleto.";
        return;
    }

    try {
        // Le confirmamos a Appwrite que el código de verificación es el correcto
        await cuentaUsuario.updateVerification(userId, secret);
        
        // Actualizamos el diseño para indicar éxito
        titulo.innerText = "¡Correo Verificado!";
        titulo.style.color = "#10b981"; // Un tono verde para indicar éxito
        mensaje.innerText = "Tu cuenta ha sido confirmada correctamente. Ya puedes acceder a la plataforma.";
        cajaLogin.style.display = "block";

    } catch (error) {
        console.error("Error al verificar:", error);
        titulo.innerText = "Error en la verificación";
        titulo.style.color = "#ef4444"; // Un tono rojo para error
        mensaje.innerText = "Hubo un problema: " + error.message;
    }
}

// Ejecutamos la función automáticamente al cargar la página
validarCuenta();