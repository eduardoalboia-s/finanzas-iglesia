# Guía de Despliegue en HostGator (cPanel)

Esta guía te explicará paso a paso cómo subir tu aplicación **IglesiaApp** a un hosting compartido HostGator que soporte Node.js.

## Requisitos Previos
1.  **Acceso a cPanel:** Debes tener un plan de hosting que incluya cPanel (ej: Plan Personal, Emprendedor o Negocios de HostGator).
2.  **Soporte Node.js:** En tu cPanel, busca la sección "Software". Deberías ver un ícono llamado **"Setup Node.js App"**. Si no está, contacta a soporte para que lo activen o considera un VPS.
3.  **Base de Datos MySQL:** Acceso para crear bases de datos.

---

## Paso 1: Preparar la Aplicación (En tu PC)

1.  **Construir el proyecto:**
    Antes de subir nada, es recomendable construir la aplicación localmente para asegurar que no hay errores.
    ```bash
    npm run build
    ```
    *Si el build es exitoso, verás una carpeta `.next`.*

2.  **Comprimir los archivos:**
    Selecciona todos los archivos de tu proyecto **EXCEPTO** las carpetas `node_modules`, `.git` y `.next` (la carpeta `.next` la subiremos, pero a veces es mejor reconstruir en el servidor si tienes recursos, pero en hosting compartido es mejor subirla ya construida si el servidor tiene poca RAM. **Estrategia recomendada para HostGator: Subir todo y construir allá si es posible, o subir la carpeta `.next` construida localmente**).

    **Archivos vitales a incluir en el ZIP:**
    *   `package.json`
    *   `package-lock.json`
    *   `next.config.ts`
    *   `server.js` (Lo acabamos de crear)
    *   `prisma/` (Carpeta completa con el schema)
    *   `public/` (Imágenes y estáticos)
    *   `app/`, `components/`, `lib/`, `hooks/` (Todo tu código fuente)
    *   `.env` (Opcional, pero mejor crearlo en el servidor por seguridad)

    *Nota: Si subes la carpeta `.next` desde tu PC, asegúrate de que tu PC y el servidor tengan arquitecturas compatibles (generalmente Linux). Si usas Windows, es mejor intentar hacer el build en el servidor.*

---

## Paso 2: Crear la Base de Datos en cPanel

1.  Entra a cPanel -> **"Bases de Datos MySQL"**.
2.  Crea una nueva base de datos (ej: `usuario_iglesia_db`).
3.  Crea un nuevo usuario (ej: `usuario_admin`).
4.  Añade el usuario a la base de datos y dale **TODOS LOS PRIVILEGIOS**.
5.  Anota estos datos. Tu `DATABASE_URL` será algo así:
    `mysql://usuario_admin:tu_contraseña@localhost:3306/usuario_iglesia_db`

---

## Paso 3: Subir los Archivos

1.  Entra a cPanel -> **"Administrador de Archivos"**.
2.  Crea una carpeta para tu app (ej: `iglesia-app`) fuera de `public_html` si es posible, o dentro si prefieres.
3.  Sube tu archivo ZIP y descomprímelo.

---

## Paso 4: Configurar Node.js en cPanel

1.  Ve a **"Setup Node.js App"**.
2.  Haz clic en **"Create Application"**.
3.  Configura lo siguiente:
    *   **Node.js Version:** Selecciona la versión recomendada (ej: 20.x o 18.x).
    *   **Application Mode:** `Production`.
    *   **Application Root:** La carpeta donde subiste los archivos (ej: `iglesia-app`).
    *   **Application URL:** El dominio o subdominio donde se verá la web (ej: `finanzas.tuiglesia.com`).
    *   **Application Startup File:** Escribe `server.js`.
4.  Haz clic en **"Create"**.

---

## Paso 5: Instalar Dependencias

1.  Una vez creada la app, verás un botón **"Run NPM Install"**. Haz clic en él.
    *   *Esto instalará todas las librerías necesarias. Puede tardar unos minutos.*
    *   *Si falla por memoria, tendrás que subir la carpeta `node_modules` desde tu PC (pero debe ser generada en Linux).*

2.  **Configurar Variables de Entorno:**
    *   En la misma pantalla de configuración de Node.js, busca la sección "Environment Variables".
    *   Añade las siguientes variables (copia los valores de tu `.env` local y ajusta la DB):
        *   `DATABASE_URL`: `mysql://usuario:pass@localhost:3306/db_name`
        *   `AUTH_SECRET`: (Genera uno nuevo largo y seguro)
        *   `RESEND_API_KEY`: (Tu clave de Resend)
        *   `NEXTAUTH_URL`: `https://finanzas.tuiglesia.com`

---

## Paso 6: Base de Datos y Build (Consola)

Necesitamos ejecutar comandos para configurar la base de datos (Prisma).

1.  En la pantalla de la App Node.js, verás un comando arriba que dice "Enter to the virtual environment". Copialo.
    *   Ejemplo: `source /home/usuario/nodevenv/iglesia-app/20/bin/activate && cd /home/usuario/iglesia-app`
2.  Ve al inicio de cPanel y abre **"Terminal"**.
3.  Pega el comando para entrar al entorno virtual.
4.  Ejecuta la migración de base de datos:
    ```bash
    npx prisma migrate deploy
    ```
    *Esto creará las tablas en tu base de datos MySQL de HostGator.*

5.  Construye la aplicación (si no subiste la carpeta `.next`):
    ```bash
    npm run build
    ```

---

## Paso 7: Reiniciar y Disfrutar

1.  Vuelve a "Setup Node.js App".
2.  Haz clic en el botón **"Restart"**.
3.  Visita tu URL. ¡Tu aplicación debería estar en línea!

---

### Solución de Problemas Comunes

*   **Error 500 / App no inicia:** Revisa el archivo `stderr.log` en la carpeta de tu aplicación.
*   **Error de Memoria en Build:** Si `npm run build` falla en el servidor, haz el build en tu PC (`npm run build`), y sube la carpeta `.next` generada al servidor.
