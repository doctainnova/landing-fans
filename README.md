# 🧉 Fans del Mate — Landing

Landing pre-lanzamiento de **Fans del Mate**, la app para compartir mate y conocer gente
(rondas presenciales y virtuales, comunidad, mensajes, perfil y colaboraciones).

Sitio estático, sin build. Se despliega tal cual.

## Estructura
```
index.html        · la landing (una sola página)
styles.css        · estilos (paleta de marca yerba/selva)
script.js         · interacciones (reveal, nav, contadores, formularios, sticky CTA)
assets/           · favicon SVG, logos y og-cover
robots.txt        · SEO
sitemap.xml       · SEO
dist/             · versión auto-contenida (un solo archivo, opcional) — ignorada por git
```

## Deploy en Vercel
1. Entrá a [vercel.com/new](https://vercel.com/new) e importá este repo.
2. Framework Preset: **Other** (sitio estático, sin build). Root: `/`.
3. Deploy. Cada push a `main` redeploya solo.

## Pendientes antes del lanzamiento
- [ ] Conectar los formularios (lista de espera + colaboradores) a un backend/Formspree/Mailchimp.
- [ ] Poner el número real de WhatsApp (botón en la sección de colaboradores).
- [ ] Reemplazar el dominio placeholder `fansdelmate.com.ar` por el subdominio real
      en `index.html` (canonical, OG, JSON-LD), `robots.txt` y `sitemap.xml`.
- [ ] Al lanzar: cambiar los badges "Muy pronto" por los links reales de App Store / Google Play.

Hecho con 🧉 en Argentina.
