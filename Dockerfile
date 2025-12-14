# Usamos una versión LTS de Node ligera (Alpine Linux)
FROM node:20-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los archivos de definición de dependencias
# Esto aprovecha el caché de Docker: si no cambias dependencias, no se reinstalan
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Si usas TypeScript, aquí deberías agregar el paso de build, por ejemplo:
# RUN npm run build

# Exponemos el puerto que usa Fastify
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
