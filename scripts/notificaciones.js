// Diccionario de traducciones para los errores de Appwrite
const traduccionesErrores = {
    "Creation of a session is prohibited when a session is active.": "Ya tienes una sesión activa. Por favor, recarga la página o intenta de nuevo.",
    "Invalid `password` param: Password must be between 8 and 265 characters long, and should not be one of the commonly used password.": "La contraseña es muy débil. Debe tener al menos 8 caracteres y no ser muy común.",
    "A user with the same email, phone, or id already exists in this project.": "Ya existe una cuenta registrada con este correo electrónico.",
    "Invalid credentials. Please check the email and password.": "El correo o la contraseña son incorrectos. Intenta de nuevo.",
    "User (role: guests) missing scope (account)": "Permisos insuficientes o sesión expirada.",
    "Rate limit for the current endpoint has been exceeded.": "Has hecho demasiados intentos. Por favor, espera un momento."
};

// Función para traducir el error
export function traducirError(mensajeOriginal) {
    for (const [ingles, espanol] of Object.entries(traduccionesErrores)) {
        // Si el error de Appwrite contiene el texto en inglés, devolvemos el español
        if (mensajeOriginal.includes(ingles)) {
            return espanol;
        }
    }
    // Si es un error nuevo que no tenemos en la lista, lo mostramos genérico pero lo imprimimos en consola
    console.warn("Error sin traducir:", mensajeOriginal);
    return "Ocurrió un error inesperado: " + mensajeOriginal;
}

// Función para crear y mostrar la ventana Toast en pantalla
export function mostrarNotificacion(mensaje, tipo = 'info') {
    // 1. Buscamos el contenedor, si no existe lo creamos en el momento
    let contenedor = document.getElementById('contenedor-notificaciones');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'contenedor-notificaciones';
        document.body.appendChild(contenedor);
    }

    // 2. Creamos el elemento visual (div) de la notificación
    const notificacion = document.createElement('div');
    notificacion.classList.add('notificacion', tipo);
    notificacion.innerText = mensaje;

    // 3. Lo agregamos a la pantalla
    contenedor.appendChild(notificacion);

    // 4. Lo programamos para que desaparezca automáticamente después de 4.5 segundos
    setTimeout(() => {
        notificacion.classList.add('ocultar');
        // Esperamos a que termine la animación de salida para borrarlo del HTML
        setTimeout(() => {
            notificacion.remove();
        }, 400); 
    }, 4500);
}