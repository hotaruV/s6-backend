function generarSlug(texto) {
    return texto
        .toString() // Asegurarse de que el texto es una cadena
        .normalize('NFD') // Normalizar a la forma de descomposición Unicode (separar caracteres compuestos)
        .replace(/[\u0300-\u036f]/g, '') // Eliminar los caracteres diacríticos (acentos y otros)
        .toLowerCase() // Convertir a minúsculas
        .trim() // Eliminar espacios en blanco al principio y al final
        .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales, mantener solo letras, números, espacios y guiones
        .replace(/\s+/g, '-') // Reemplazar espacios con guiones
        .replace(/-+/g, '-'); // Reemplazar múltiples guiones consecutivos por uno solo
}

module.exports = { generarSlug };