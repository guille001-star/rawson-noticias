# El Faro de Rawson 🗞️

Sitio de noticias de Rawson, Chubut — la capital provincial. HTML + CSS + JS puro:
sin frameworks, sin base de datos, hospedable gratis en GitHub Pages.

## Características
- Portada periodística: nota principal, secciones, policiales, opinión, deportes
- Fecha/hora en vivo, clima real de Rawson y cotización del dólar (APIs gratuitas)
- Espacios de publicidad en medidas IAB (970×90, 300×250) listos para AdSense
- Modo oscuro, buscador, menú móvil, barra de progreso de lectura
- Datos estructurados (schema.org) para Google Noticias

## Desarrollo local
Abrí `index.html` con la extensión Live Server de VS Code, o:
    python -m http.server 8000
y entrá a http://localhost:8000

## Publicar una nota
1. Copiar `articulos/plantilla.html` → `articulos/AAAA-MM-DD-titulo-corto.html`
2. Editar título, bajada, firma, fecha, cuerpo y foto (guardar fotos en `assets/img/`)
3. Enlazarla desde la portada y hacer commit

## Publicidad
Cada bloque `<div class="ad ...">` marca un espacio. Para AdSense, reemplazar ese
div por el bloque `<ins class="adsbygoogle">` que te da Google. Los banners de
anunciantes locales van como imágenes en `assets/img/publicidad/`.

## Publicar en GitHub Pages
Settings → Pages → Branch: `main` → carpeta `/ (root)` → Save.