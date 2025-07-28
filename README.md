# Retro Console Emulator (Web)

Esta demo muestra una interfaz inspirada en **RETRA** con un emulador NES integrado. Incluye un solo juego de prueba y varias pantallas para seleccionar consola, skin y juego antes de iniciar.

## Uso

Abre `index.html` en un navegador moderno. Pulsa **Start** y sigue las pantallas hasta llegar al juego. Solo la primera consola y el primer juego son funcionales. Los controles táctiles permiten jugar desde dispositivos móviles.

## Archivos

- `index.html`: estructura de todas las pantallas y el canvas de emulación.
- `style.css`: estilos con tipografía retro y animaciones básicas.
- `script.js`: lógica de navegación entre pantallas y carga del emulador.
- `jsnes.min.js`: versión minificada del emulador jsnes.
- `rom.js`: ROM de ejemplo embebido en base64.

## Advertencia Legal

El ROM incluido es solo un ejemplo vacío para pruebas. Sustitúyelo por un ROM que poseas legalmente.

## Despliegue en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com) y vincula tu repositorio.
2. Selecciona el tipo de proyecto **Static**. No necesita comando de build.
3. Define la carpeta `./` como salida y despliega.
4. Opcionalmente, ejecuta `npm start` para probar localmente con `vercel dev`.
