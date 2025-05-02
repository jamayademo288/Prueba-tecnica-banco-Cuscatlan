# Etapa 1: Compilación de la app Angular
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la app en modo producción
RUN npm run build --configuration production

# Etapa 2: Imagen ligera con NGINX para servir la app
FROM nginx:alpine

# Limpiar archivos existentes en el servidor
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos generados por Angular a la carpeta pública de NGINX
COPY --from=builder /app/dist/pokemon-app /usr/share/nginx/html

# Copiar configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto por defecto de NGINX
EXPOSE 80

# Iniciar NGINX en primer plano
CMD ["nginx", "-g", "daemon off;"]

