import { cuentaUsuario, almacenamiento } from './auth.js';
import { mostrarNotificacion } from './notificaciones.js';

// --- CONFIGURACIÓN DE STORAGE ---
// Reemplaza esto con el ID real de tu Bucket de Appwrite
const BUCKET_ID = '699b81fa00096e6e68ad'; 

// Elementos de la UI
const interfazDrive = document.getElementById('interfaz-drive');
const spanNombreNav = document.getElementById('nombre-usuario-nav');
const btnSubir = document.getElementById('btn-subir-archivo');
const inputOculto = document.getElementById('input-archivo-oculto');

// 1. GUARDIÁN DE RUTAS (Bloquea a los que no tienen sesión)
async function protegerRuta() {
    try {
        const usuario = await cuentaUsuario.get();
        interfazDrive.style.display = 'flex'; // Mostramos la UI
        spanNombreNav.innerText = usuario.name;
    } catch (error) {
        window.location.href = "sign-in.html"; // Expulsamos al login
    }
}

// 2. LÓGICA PARA SUBIR ARCHIVOS
// Cuando hacen clic en el botón azul, simulamos un clic en el input invisible
btnSubir.addEventListener('click', () => {
    inputOculto.click(); 
});

// Cuando el usuario elige un archivo en su computadora
inputOculto.addEventListener('change', async (evento) => {
    const archivoSeleccionado = evento.target.files[0];
    
    if (!archivoSeleccionado) return; // Si canceló la ventana, no hacemos nada

    try {
        btnSubir.innerText = "Subiendo...";
        btnSubir.disabled = true;

        // Le pedimos a Appwrite que guarde el archivo en el Bucket
        await almacenamiento.createFile(
            BUCKET_ID, 
            window.AppwriteID.unique(), // Genera un ID único para el archivo
            archivoSeleccionado
        );

        mostrarNotificacion(`¡${archivoSeleccionado.name} subido con éxito!`, "exito");

    } catch (error) {
        console.error("Error al subir:", error);
        mostrarNotificacion("Error al subir el archivo.", "error");
    } finally {
        // Restauramos el botón
        btnSubir.innerText = "☁️ Subir Archivo";
        btnSubir.disabled = false;
        inputOculto.value = ''; // Limpiamos el input
    }
});

// Arrancamos el guardián al cargar la página
protegerRuta();