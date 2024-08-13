# Utiliza la imagen oficial de Node.js
FROM node:14

# Establece el directorio de trabajo en /home/app
WORKDIR /home/app

# Instala nodemon globalmente
RUN npm install -g nodemon

# Copia el contenido actual al directorio de trabajo en el contenedor
COPY . .

# Expone el puerto 3221 (asegúrate de que coincide con el puerto de tu aplicación)
EXPOSE 3221

# Comando para ejecutar la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]