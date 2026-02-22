import { cuentaUsuario } from './auth.js';
import { mostrarNotificacion, traducirError } from './notificaciones.js';

// Elementos de la interfaz
const spanNombre = document.getElementById('perfil-nombre');
const spanCorreo = document.getElementById('perfil-correo');
const badge2fa = document.getElementById('badge-2fa');

const btnIniciar2FA = document.getElementById('btn-iniciar-2fa');
const contenedorQR = document.getElementById('contenedor-qr');
const imagenQR = document.getElementById('imagen-qr');
const inputCodigo = document.getElementById('codigo-2fa');
const btnConfirmar2FA = document.getElementById('btn-confirmar-2fa');
const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

// Función que arranca al abrir la página
async function cargarPerfil() {
    try {
        // 1. Obtenemos los datos del usuario logueado
        const usuario = await cuentaUsuario.get();
        
        // Llenamos la interfaz con sus datos
        spanNombre.innerText = usuario.name;
        spanCorreo.innerText = usuario.email;

        // 2. Verificamos si ya tiene el 2FA activado (mfa = Multi-Factor Authentication)
        if (usuario.mfa) {
            badge2fa.innerText = "Activo";
            badge2fa.className = "etiqueta-estado estado-activo";
            btnIniciar2FA.style.display = "none"; // Ocultamos el botón porque ya está activo
        }

    } catch (error) {
        // Si hay error (ej. no ha iniciado sesión), lo mandamos al login
        console.error("No hay sesión activa:", error);
        window.location.href = "sign-in.html";
    }
}

// Evento: Botón para generar el QR
btnIniciar2FA.addEventListener('click', async () => {
    try {
        btnIniciar2FA.innerText = "Generando código...";
        btnIniciar2FA.disabled = true;

        // Le pedimos a Appwrite que prepare el 2FA (tipo TOTP = contraseñas temporales)
        const autenticador = await cuentaUsuario.createAuthenticator('totp');
        
        // Appwrite nos da un 'uri'. Lo convertimos a imagen QR usando una API pública y gratuita
        const urlImagenQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(autenticador.uri)}`;
        
        imagenQR.src = urlImagenQR;
        
        // Ocultamos el botón y mostramos la zona del QR
        btnIniciar2FA.style.display = "none";
        contenedorQR.style.display = "block";
        
        mostrarNotificacion("Código generado. Escanéalo con tu celular.", "info");

    } catch (error) {
        btnIniciar2FA.innerText = "Configurar 2FA";
        btnIniciar2FA.disabled = false;
        mostrarNotificacion(traducirError(error.message), "error");
    }
});

// Evento: Botón para confirmar el código de 6 dígitos
btnConfirmar2FA.addEventListener('click', async () => {
    const codigoSecreto = inputCodigo.value;

    if (codigoSecreto.length !== 6) {
        mostrarNotificacion("El código debe tener 6 dígitos.", "error");
        return;
    }

    try {
        btnConfirmar2FA.innerText = "Verificando...";
        btnConfirmar2FA.disabled = true;

        // Le mandamos el código a Appwrite para que confirme que escaneamos bien el QR
        await cuentaUsuario.verifyAuthenticator('totp', codigoSecreto);

        // Si todo sale bien, actualizamos la interfaz
        contenedorQR.style.display = "none";
        badge2fa.innerText = "Activo";
        badge2fa.className = "etiqueta-estado estado-activo";
        
        mostrarNotificacion("¡Seguridad 2FA activada con éxito!", "exito");

    } catch (error) {
        btnConfirmar2FA.innerText = "Verificar y Activar";
        btnConfirmar2FA.disabled = false;
        mostrarNotificacion("Código incorrecto o expirado. Intenta de nuevo.", "error");
    }
});

// Evento: Cerrar sesión
btnCerrarSesion.addEventListener('click', async (evento) => {
    evento.preventDefault();
    try {
        await cuentaUsuario.deleteSession('current');
        window.location.href = "sign-in.html";
    } catch (error) {
        mostrarNotificacion("Error al cerrar sesión.", "error");
    }
});

// Ejecutamos la carga inicial
cargarPerfil();