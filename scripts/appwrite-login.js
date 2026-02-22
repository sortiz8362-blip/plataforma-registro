import { cuentaUsuario } from './auth.js';
import { mostrarNotificacion, traducirError } from './notificaciones.js';

// Elementos de la interfaz
const formularioLogin = document.getElementById('formulario-login');
const formulario2FA = document.getElementById('formulario-2fa');
const tituloLogin = document.getElementById('titulo-login');
const subtituloLogin = document.getElementById('subtitulo-login');
const cajaEnlaces = document.getElementById('caja-enlaces-extra');
const btnCancelar2FA = document.getElementById('btn-cancelar-2fa');
const btnVerificar2FA = document.getElementById('btn-verificar-2fa');

// Variable global para guardar el ID del desafío 2FA
let retoMfaId = null; 

// --- EVENTO 1: Cuando envían Correo y Contraseña ---
formularioLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const correo = document.getElementById('correo-login').value;
    const clave = document.getElementById('clave-login').value;

    try {
        // Por si acaso quedó una sesión colgada por error
        try { await cuentaUsuario.deleteSession('current'); } catch (e) {}

        // 1. Iniciamos sesión
        const sesion = await cuentaUsuario.createEmailPasswordSession(correo, clave);

        // 2. Verificamos si la cuenta tiene el 2FA activado (mfa: true)
        if (sesion.mfa) {
            // Le decimos a Appwrite que genere el desafío para la app (totp)
            const reto = await cuentaUsuario.createMfaChallenge('totp');
            retoMfaId = reto.$id; // Guardamos el ID del reto para resolverlo después

            // Magia de UI: Cambiamos la vista sin recargar la página
            formularioLogin.style.display = 'none';
            cajaEnlaces.style.display = 'none';
            tituloLogin.innerText = "Autenticación 2FA";
            subtituloLogin.innerText = "Abre tu app y escribe el código de 6 dígitos.";
            formulario2FA.style.display = 'flex';
            
            mostrarNotificacion("Se requiere código de seguridad.", "info");
            return; // Detenemos el código aquí hasta que llene el form 2FA
        }

        // 3. Si no tiene 2FA, sigue su camino normal y verificamos el correo
        const usuario = await cuentaUsuario.get();
        if (usuario.emailVerification === true) {
            mostrarNotificacion("¡Inicio de sesión exitoso!", "exito");
            setTimeout(() => { window.location.href = "home.html"; }, 1500);
        } else {
            mostrarNotificacion("Tu correo aún no ha sido verificado. Revisa tu bandeja.", "error");
            await cuentaUsuario.deleteSession('current');
        }

    } catch (error) {
        console.error("Error original de login:", error);
        mostrarNotificacion(traducirError(error.message), "error");
    }
});

// --- EVENTO 2: Cuando envían el Código de 6 dígitos ---
formulario2FA.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    
    const codigo = document.getElementById('codigo-2fa-login').value;

    if (codigo.length !== 6) {
        mostrarNotificacion("El código debe tener exactamente 6 dígitos.", "error");
        return;
    }

    try {
        btnVerificar2FA.innerText = "Verificando...";
        btnVerificar2FA.disabled = true;

        // Le enviamos el código a Appwrite para resolver el desafío
        await cuentaUsuario.updateMfaChallenge(retoMfaId, codigo);

        // Si el código fue correcto, el login está completo. Verificamos el correo por seguridad.
        const usuario = await cuentaUsuario.get();
        if (usuario.emailVerification === true) {
            mostrarNotificacion("¡Verificación completada con éxito!", "exito");
            setTimeout(() => { window.location.href = "home.html"; }, 1500);
        } else {
            mostrarNotificacion("Tu correo no ha sido verificado.", "error");
            await cuentaUsuario.deleteSession('current');
        }

    } catch (error) {
        console.error("Error en 2FA:", error);
        mostrarNotificacion("Código incorrecto o expirado. Intenta de nuevo.", "error");
        btnVerificar2FA.innerText = "Verificar Código";
        btnVerificar2FA.disabled = false;
        document.getElementById('codigo-2fa-login').value = ''; // Limpiamos el input
    }
});

// --- EVENTO 3: Botón para cancelar el 2FA y regresar al login normal ---
btnCancelar2FA.addEventListener('click', async (evento) => {
    evento.preventDefault();
    
    // Eliminamos la sesión incompleta
    try { await cuentaUsuario.deleteSession('current'); } catch(e) {}
    
    // Restauramos el diseño original
    formulario2FA.style.display = 'none';
    formularioLogin.style.display = 'flex';
    cajaEnlaces.style.display = 'block';
    tituloLogin.innerText = "Accede a tu cuenta";
    subtituloLogin.innerText = "Ingresa tus credenciales para continuar";
    document.getElementById('codigo-2fa-login').value = '';
    btnVerificar2FA.innerText = "Verificar Código";
    btnVerificar2FA.disabled = false;
});