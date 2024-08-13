function schemaGen() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result1 = " ";
  for (let i = 0; i < 6; i++) {
    if (i == 2) {
      result1 += "-";
    } else {
      result1 += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
  }
  return result1;
}

function userName(length = 3) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    let hasNumber = false;
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const randomChar = characters.charAt(randomIndex);
  
      if (/\d/.test(randomChar)) {
        // Si el carácter es un número, marca hasNumber como true
        hasNumber = true;
      }
  
      randomString += randomChar;
    }
  
    // Si no se generó un número en la cadena, reemplaza un carácter aleatorio con un número
    if (!hasNumber) {
      const randomIndex = Math.floor(Math.random() * length);
      const randomNumber = Math.floor(Math.random() * 10); // Genera un número del 0 al 9
      randomString = randomString.substring(0, randomIndex) + randomNumber + randomString.substring(randomIndex + 1);
    }
  
    return randomString; // Agregar esta línea para devolver la cadena generada
  }

module.exports = { schemaGen, userName };
