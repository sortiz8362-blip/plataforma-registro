import { cuentaUsuario } from './auth.js';
import { mostrarNotificacion, traducirError } from './notificaciones.js';

const formularioLogin = document.getElementById('formulario-login');
const formulario2FA = document.getElementById('formulario-2fa');
const tituloLogin = document.getElementById('titulo-login');
const subtituloLogin = document.getElementById('subtitulo-login');
const cajaEnlaces = document.getElementById('caja-enlaces-extra');
const btnCancelar2FA = document.getElementById('btn-cancelar-2fa');
const btnVerificar2FA = document.getElementById('btn-verificar-2fa');

let retoMfaId = null; 

formularioLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const correo = document.getElementById('correo-login').value;
    const clave = document.getElementById('clave-login').value;

    try {
        try { await cuentaUsuario.deleteSession('current'); } catch (e) {}

        const sesion = await cuentaUsuario.createEmailPasswordSession(correo, clave);

        if (sesion.mfa) {
            // Generamos el desafío para la app de Autenticador (totp)
            const reto = await cuentaUsuario.createMfaChallenge('totp');
            retoMfaId = reto.$id; 

            formularioLogin.style.display = 'none';
            cajaEnlaces.style.display = 'none';
            tituloLogin.innerText = "Autenticación 2FA";
            subtituloLogin.innerText = "Abre tu app y escribe el código de 6 dígitos.";
            
            document.querySelector('label[for="codigo-2fa-login"]').innerText = "Código de Seguridad (App)";
            
            formulario2FA.style.display = 'flex';
            
            mostrarNotificacion("Se requiere código de seguridad.", "info");
            return; 
        }

        const usuario = await cuentaUsuario.get();
        if (usuario.emailVerification === true) {
            mostrarNotificacion("¡Inicio de sesión exitoso!", "exito");
            setTimeout(() => { window.location.href = "home.html"; }, 1500);
        } else {
            mostrarNotificacion("Tu correo aún no ha sido verificado.", "error");
            await cuentaUsuario.deleteSession('current');
        }

    } catch (error) {
        mostrarNotificacion(traducirError(error.message), "error");
    }
});

formulario2FA.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    
    const codigo = document.getElementById('codigo-2fa-login').value;

    if (codigo.length !== 6) {
        mostrarNotificacion("El código debe tener 6 dígitos.", "error");
        return;
    }

    try {
        btnVerificar2FA.innerText = "Verificando...";
        btnVerificar2FA.disabled = true;

        await cuentaUsuario.updateMfaChallenge(retoMfaId, codigo);

        const usuario = await cuentaUsuario.get();
        if (usuario.emailVerification === true) {
            mostrarNotificacion("¡Verificación completada con éxito!", "exito");
            setTimeout(() => { window.location.href = "home.html"; }, 1500);
        } else {
            mostrarNotificacion("Tu correo no ha sido verificado.", "error");
            await cuentaUsuario.deleteSession('current');
        }

    } catch (error) {
        mostrarNotificacion("Código incorrecto o expirado.", "error");
        btnVerificar2FA.innerText = "Verificar Código";
        btnVerificar2FA.disabled = false;
        document.getElementById('codigo-2fa-login').value = '';
    }
});

btnCancelar2FA.addEventListener('click', async (evento) => {
    evento.preventDefault();
    try { await cuentaUsuario.deleteSession('current'); } catch(e) {}
    
    formulario2FA.style.display = 'none';
    formularioLogin.style.display = 'flex';
    cajaEnlaces.style.display = 'block';
    tituloLogin.innerText = "Accede a tu cuenta";
    subtituloLogin.innerText = "Ingresa tus credenciales para continuar";
    document.getElementById('codigo-2fa-login').value = '';
    btnVerificar2FA.innerText = "Verificar Código";
    btnVerificar2FA.disabled = false;
});