import { cuentaUsuario } from './auth.js';

const formularioLogin = document.getElementById('formulario-login');

formularioLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const correo = document.getElementById('correo-login').value;
    const clave = document.getElementById('clave-login').value;

    try {
        // 1. Creamos la sesión con los datos ingresados
        await cuentaUsuario.createEmailPasswordSession(correo, clave);

        // 2. Obtenemos los datos del usuario activo para revisar su estado
        const usuario = await cuentaUsuario.get();

        // 3. Verificamos si el correo es real y fue confirmado
        if (usuario.emailVerification === true) {
            alert("¡Inicio de sesión exitoso!");
            window.location.href = "home.html"; 
        } else {
            // Si no ha verificado, mostramos alerta y cerramos la sesión por seguridad
            alert("Tu correo aún no ha sido verificado. Por favor revisa tu bandeja de entrada o spam.");
            await cuentaUsuario.deleteSession('current');
        }

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Error al iniciar sesión: " + error.message);
    }
});