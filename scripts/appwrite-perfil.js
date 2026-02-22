import { cuentaUsuario } from './auth.js';
import { mostrarNotificacion, traducirError } from './notificaciones.js';

const spanNombre = document.getElementById('perfil-nombre');
const spanCorreo = document.getElementById('perfil-correo');
const badge2fa = document.getElementById('badge-2fa');

const btnIniciar2FA = document.getElementById('btn-iniciar-2fa');
const contenedorQR = document.getElementById('contenedor-qr');
const imagenQR = document.getElementById('imagen-qr');
const inputCodigo = document.getElementById('codigo-2fa');
const btnConfirmar2FA = document.getElementById('btn-confirmar-2fa');
const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
const textoClaveSecreta = document.getElementById('texto-clave-secreta');

async function cargarPerfil() {
    try {
        const usuario = await cuentaUsuario.get();
        
        spanNombre.innerText = usuario.name;
        spanCorreo.innerText = usuario.email;

        if (usuario.mfa) {
            badge2fa.innerText = "Activo";
            badge2fa.className = "etiqueta-estado estado-activo";
            btnIniciar2FA.style.display = "none";
        }
    } catch (error) {
        window.location.href = "sign-in.html";
    }
}

btnIniciar2FA.addEventListener('click', async () => {
    try {
        btnIniciar2FA.innerText = "Preparando seguridad...";
        btnIniciar2FA.disabled = true;

        const autenticador = await cuentaUsuario.createMfaAuthenticator('totp');
        
        const urlImagenQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(autenticador.uri)}`;
        imagenQR.src = urlImagenQR;
        
        textoClaveSecreta.innerText = autenticador.secret;
        
        btnIniciar2FA.style.display = "none";
        contenedorQR.style.display = "block";
        
        mostrarNotificacion("Escanea el QR o copia la clave manual.", "info");

    } catch (error) {
        console.error("Error al generar QR:", error);
        btnIniciar2FA.innerText = "Configurar 2FA";
        btnIniciar2FA.disabled = false;
        mostrarNotificacion(traducirError(error.message), "error");
    }
});

btnConfirmar2FA.addEventListener('click', async () => {
    const codigoSecreto = inputCodigo.value;

    if (codigoSecreto.length !== 6) {
        mostrarNotificacion("El código debe tener 6 dígitos.", "error");
        return;
    }

    try {
        btnConfirmar2FA.innerText = "Verificando...";
        btnConfirmar2FA.disabled = true;

        // 1. Validamos el código de la app
        await cuentaUsuario.updateMfaAuthenticator('totp', codigoSecreto);
        
        // 2. CORRECCIÓN: Encendemos la seguridad con la función en mayúsculas
        await cuentaUsuario.updateMFA(true);

        contenedorQR.style.display = "none";
        badge2fa.innerText = "Activo";
        badge2fa.className = "etiqueta-estado estado-activo";
        
        mostrarNotificacion("¡Seguridad 2FA activada con éxito!", "exito");

    } catch (error) {
        console.error("Error real al verificar 2FA:", error); 
        
        btnConfirmar2FA.innerText = "Verificar y Activar";
        btnConfirmar2FA.disabled = false;
        
        mostrarNotificacion(traducirError(error.message), "error");
    }
});

btnCerrarSesion.addEventListener('click', async (evento) => {
    evento.preventDefault();
    try {
        await cuentaUsuario.deleteSession('current');
        window.location.href = "sign-in.html";
    } catch (error) {
        mostrarNotificacion("Error al cerrar sesión.", "error");
    }
});

cargarPerfil();