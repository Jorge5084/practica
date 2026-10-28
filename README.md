# Mi día — frontend para Azure App Service

Lista de tareas en HTML, CSS y JavaScript. Permite agregar, completar, filtrar y eliminar tareas. Guarda los datos en localStorage: cada navegador tiene su propia lista y no hay sincronización entre dispositivos.

El servidor Node.js solo entrega archivos estáticos. No hay API, base de datos, dependencias externas ni paso de compilación.

## Qué necesitas

- Cuenta GitHub con permiso para crear un repositorio y ejecutar GitHub Actions.
- Suscripción Azure for Students activa con permiso para crear App Services.
- Para probar localmente: una versión LTS vigente de Node.js, de versión 22 o superior.

## Probar en tu computadora

Abre una terminal dentro de esta carpeta y ejecuta:

```sh
npm start
```

Abre http://localhost:3000. No necesitas ejecutar npm install porque el proyecto no tiene dependencias. Para ver únicamente la interfaz también puedes abrir public/index.html, aunque la prueba recomendada usa el servidor.

## 1. Subir a GitHub

1. Crea un repositorio llamado `tareas-azure` en GitHub.
2. En la opción **Add file → Upload files**, sube el contenido de esta carpeta. Conserva la carpeta `public`.
3. Confirma los cambios en la rama `main`.

La raíz del repositorio debe contener `package.json`, `server.js`, `README.md` y la carpeta `public`. No subas el ZIP ni una carpeta adicional que envuelva todo el proyecto.

## 2. Crear App Service

En https://portal.azure.com:

1. Busca **App Services** y selecciona **Create → Web App**.
2. Selecciona la suscripción **Azure for Students**.
3. Crea un grupo de recursos, por ejemplo `rg-tareas-demo`.
4. Asigna un nombre único a la aplicación, por ejemplo `tareas-tu-nombre-123`.
5. En **Publish**, selecciona **Code**.
6. En **Runtime stack**, selecciona una versión **Node.js LTS** vigente, 22 o superior.
7. En **Operating System**, selecciona **Linux**.
8. Selecciona una región permitida para tu suscripción.
9. En **App Service plan → Pricing plan**, selecciona **Free F1** si está disponible. Revisa que el portal muestre el plan gratuito antes de crear. Si no aparece, comprueba otra región admitida; otros planes pueden consumir el crédito de Students.
10. Revisa el resumen y crea la aplicación. Para esta demo no necesitas base de datos ni servicios adicionales.

Las regiones, cuotas y planes disponibles dependen de tu suscripción; el portal indica qué puedes crear.

## 3. Conectar GitHub

1. Abre el App Service creado.
2. Ve a **Deployment Center / Centro de implementación**.
3. Selecciona **GitHub** como origen y autoriza tu cuenta cuando Azure lo solicite.
4. Selecciona tu usuario u organización, el repositorio `tareas-azure` y la rama `main`.
5. Usa **GitHub Actions** como proveedor de compilación. Mantén Node.js en una versión LTS compatible con la elegida en App Service.
6. Configura la autenticación que ofrezca el portal. Si ofrece identidad administrada con OpenID Connect y tienes permisos, úsala. Sigue la configuración del portal para tu suscripción.
7. Guarda. Azure generará un archivo `.github/workflows/…yml` en tu repositorio con los datos de tu aplicación.

No se incluye un workflow prefabricado porque Azure debe completarlo con el nombre real de tu App Service y su autenticación.

## 4. Configurar inicio y comprobar

1. En App Service, abre **Settings → Configuration → General settings** o **Configuration → Stack settings**, según la interfaz.
2. En **Startup Command**, escribe `node server.js` y guarda. Reinicia la aplicación si se solicita.
3. En GitHub abre **Actions** y espera a que el despliegue termine en verde.
4. En el resumen del App Service pulsa **Browse / Examinar** para abrir el dominio predeterminado que Azure asignó.
5. Agrega una tarea, márcala como completada y recarga para comprobar el guardado.

El servidor usa `process.env.PORT`, tal como requiere App Service. El proyecto no necesita variables de entorno adicionales. Si ves una página por defecto o un error de inicio, revisa que `server.js` y `package.json` estén en la raíz del repositorio y consulta **Log stream / Flujo de registros**.

## Actualizaciones automáticas

Cambia, por ejemplo, el título en `public/index.html` y confirma el cambio en `main`. GitHub Actions volverá a desplegar el sitio automáticamente.

## Referencias oficiales

- https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs
- https://learn.microsoft.com/en-us/azure/app-service/configure-language-nodejs
- https://learn.microsoft.com/en-us/azure/app-service/deploy-github-actions

Este paquete está preparado para desplegar; todavía no está publicado en una cuenta Azure ni subido a GitHub.
