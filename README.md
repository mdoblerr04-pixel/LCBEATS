# LC WORLD MUSIC - LANDING PAGE V2.0

Código fuente completo de la landing page para **LC WORLD MUSIC**.

## Estructura del Proyecto
- `index.html`: Punto de entrada HTML con tipografías oficiales (Rubik Dirt, Teko, Inter, Oswald).
- `index.tsx`: Renderizado principal de la aplicación React.
- `index.css`: Hoja de estilos complementaria.
- `App.tsx`: Ensamblado de secciones (Hero, Canales Sello/Evento mini-desplegables, Catálogo LC BEATS y Spotify, Servicios, Footer).
- `constants.ts`: Enlaces, portadas de playlists, banners y logotipo oficial.
- `types.ts`: Modelos de TypeScript.
- `components/`:
  - `Hero.tsx`: Cabecera principal con lema institucional.
  - `SocialSection.tsx`: Mini-desplegables de Canales Sello (Instagram/YouTube) y Canales Evento (Flyer Instagram y YT Evento Próximamente).
  - `BeatList.tsx`: Módulo de Catálogo con playlists LC BEATS y Spotify.
  - `Services.tsx`: Tiers de servicios y producción musical con CTAs enlazados a Google Forms.
  - `Icons.tsx`: Iconografía SVG vectorial.
- `dist/`: Build de producción listo para alojar en cualquier servidor web estático (Vercel, Netlify, Cloudflare Pages, Apache, Nginx).

## Ejecución Local
```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```
