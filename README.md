# Classroom Clone

Un clon de Google Classroom desarrollado con el stack MERN (usando MySQL en lugar de MongoDB) y Prisma como ORM. Se integra con Google APIs para autenticación y almacenamiento en Google Drive.

## Tecnologías utilizadas

- **Frontend:** Vite, React, TypeScript
- **Backend:** Node.js, Express, TypeScript, MVC
- **Base de datos:** MySQL con Prisma ORM
- **Autenticación y almacenamiento:** Google APIs (OAuth, Google Drive)

## Configuración y ejecución

### Backend
1. Configurar las variables de entorno en `.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   REDIRECT_URL=your-redirect-url
   PORT=your-port
   DATABASE_URL=mysql://user:password@host:port/database
   ```
2. Instalar dependencias y ejecutar el servidor:
   ```sh
   bun install
   bun run dev
   ```

### Frontend
1. Instalar dependencias y ejecutar:
   ```sh
   bun install
   bun run dev
   ```

## Contribución
Las contribuciones son bienvenidas. Si deseas colaborar, por favor abre un issue o envía un pull request.

## Licencia
Este proyecto se encuentra bajo la licencia MIT.
