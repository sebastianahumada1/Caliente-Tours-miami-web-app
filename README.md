# Caliente Tours Miami — Miami Yacht Rentals

Landing page moderna para alquiler de yates de lujo en Miami, construida con Next.js 15, React 19, TypeScript, Tailwind CSS v4, y tecnologías de vanguardia.

## 🚤 Gestión de Yates

Los yates se gestionan mediante un archivo JSON dinámico. **[Ver guía completa →](./YACHT_MANAGEMENT.md)**

- Datos centralizados en `/public/data/yachts.json`
- Agregar/editar yates sin tocar código
- Soporte para 30+ yates
- Imágenes organizadas por carpetas

## 🚀 Stack Tecnológico

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Estilos**: Tailwind CSS v4, Radix UI, shadcn/ui
- **Animaciones**: GSAP + ScrollTrigger, View Transitions API, Lenis
- **Mapas**: Mapbox GL JS + Directions API
- **Formularios**: react-hook-form + Zod
- **Backend**: Supabase (Postgres + Auth + Storage) + Resend (emails)
- **Hosting**: Vercel

## 📦 Instalación

1. **Clonar el repositorio** (o descargar el proyecto)

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
Copia `env.example.txt` a `.env.local` y completa las siguientes variables:

```env
# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=tu_token_de_mapbox

# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Resend
RESEND_API_KEY=tu_api_key_de_resend
RESEND_FROM_EMAIL=noreply@calientetoursmiami.com
```

4. **Preparar imágenes**:
Coloca las imágenes en `/public`:
- `bg-miami.jpg` - Imagen de fondo del hero (1920x1080 o mayor)
- `boats/` - Carpeta con imágenes de yates (ver [YACHT_MANAGEMENT.md](./YACHT_MANAGEMENT.md) para estructura completa)

5. **Ejecutar en desarrollo**:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta ESLint
- `npm run type-check` - Verifica tipos TypeScript

## 🎨 Características Principales

### Hero con Carrusel Doble de Barcos

El componente `BoatsHero` incluye:
- **Marquee infinito** en dos filas (trasera más lenta hacia izquierda, frontal más rápida hacia derecha)
- **Efecto bobbing** con CSS keyframes (animación de balanceo)
- **Pausa on hover** para mejor UX
- **Parallax y sombras** para profundidad
- **Soporte para prefers-reduced-motion**

**Ajustes rápidos** (en `BoatsHero.tsx`):
- Velocidad fila trasera: `speed={22}` (línea del componente Marquee)
- Velocidad fila frontal: `speed={16}`
- Posición bottom: `bottom="18%"` (trasera) y `bottom="8%"` (frontal)
- Scale: `scale={0.9}` (trasera) y `scale={1}` (frontal)
- Opacity: `opacity={0.85}` (trasera) y `opacity={1}` (frontal)
- Gap entre barcos: `gap="2rem"`
- Delay bobbing: Incrementa por índice (`index * 0.2s`)

### View Transitions API

Habilitada en `next.config.js`:
```js
experimental: {
  viewTransition: true,
}
```

Las transiciones se activan automáticamente entre páginas. Para usarlas en componentes, usa:
```tsx
style={{ viewTransitionName: 'unique-name' }}
```

### Lenis (Smooth Scrolling)

Integrado globalmente en `LenisProvider`. Se desactiva automáticamente si el usuario tiene `prefers-reduced-motion` activado.

**Para habilitar/deshabilitar**:
- Edita `app/providers/LenisProvider.tsx`
- Ajusta `duration`, `easing`, `smoothWheel`, etc.

### GSAP + ScrollTrigger

Configurado en `lib/gsap/setup.ts`. Ejemplo de uso en `Fleet.tsx`:
- Pin suave del título cuando entra la sección de flota
- Se respeta `prefers-reduced-motion`

**Para agregar más animaciones GSAP**:
1. Importa `gsap` y `ScrollTrigger` desde `@/lib/gsap/setup`
2. Crea ScrollTriggers en `useEffect`
3. Limpia con `ScrollTrigger.getAll().forEach(trigger => trigger.kill())`

### Migrar Bobbing a GSAP

Actualmente el bobbing usa CSS keyframes. Para migrarlo a GSAP:

1. En `BoatsHero.tsx`, importa GSAP:
```tsx
import { gsap } from "@/lib/gsap/setup";
```

2. Reemplaza la animación CSS con GSAP en un `useEffect`:
```tsx
useEffect(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const boatElements = document.querySelectorAll('.boat-item');
  boatElements.forEach((boat, index) => {
    gsap.to(boat, {
      y: -8,
      scale: 1.02,
      duration: 1.9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: index * 0.2,
    });
  });
}, []);
```

3. Remueve la clase `bobbing` y el `animationDelay` del JSX.

### Mapbox

Componente `MapRoutes` con:
- Mapa interactivo de Miami
- Marcadores de puntos de pickup
- Ruta demo usando Directions API (Miami Beach Marina ↔️ Bayside)

**Para agregar más rutas**:
1. Edita `lib/mapbox/client.ts` y agrega puntos a `demoRoutes`
2. El componente cargará automáticamente las rutas

### Formulario de Contacto

- Validación con Zod
- Envío de email vía Resend
- Guardado en Supabase (tabla `contacts`)
- Manejo de errores y estados de carga

**Setup de Supabase**:
1. Crea una tabla `contacts` con:
   - `id` (uuid, primary key)
   - `name` (text)
   - `email` (text)
   - `phone` (text)
   - `date` (text)
   - `guests` (integer)
   - `message` (text, nullable)
   - `created_at` (timestamp)

## 📁 Estructura del Proyecto

```
/
├── app/
│   ├── (sections)/          # Secciones de la landing
│   │   ├── Fleet.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── FAQs.tsx
│   │   └── ContactForm.tsx
│   ├── api/
│   │   └── contact/         # API route para formulario
│   ├── components/
│   │   ├── BoatsHero.tsx    # Hero con carrusel
│   │   └── MapRoutes.tsx    # Mapa de rutas
│   ├── providers/
│   │   └── LenisProvider.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/                  # Componentes shadcn/ui
├── lib/
│   ├── forms/
│   │   └── validators.ts    # Schemas Zod
│   ├── gsap/
│   │   └── setup.ts
│   ├── mapbox/
│   │   └── client.ts
│   └── utils.ts
├── public/
│   ├── boats/               # Imágenes de barcos
│   └── bg-miami.jpg
└── ...
```

## ♿ Accesibilidad

- Componentes Radix UI (accesibles por defecto)
- ARIA labels donde corresponde
- Contraste AA
- Soporte para `prefers-reduced-motion`
- Navegación por teclado
- Textos alternativos en imágenes

## 🔍 SEO

- Metadata configurada en `layout.tsx`
- `sitemap.ts` generado automáticamente
- `robots.txt` configurado
- OG tags para redes sociales

## 🚢 Próximos Pasos

1. **Conectar CMS** (Sanity/Contentful) para contenido dinámico
2. **Integrar analytics** (Vercel Analytics o PostHog)
4. **Optimizar imágenes** con next/image
5. **Agregar más rutas** en el mapa
6. **Implementar autenticación** con Supabase Auth (si es necesario)

## 📝 Notas

- El proyecto está configurado para Vercel, pero puede desplegarse en cualquier plataforma compatible con Next.js
- Las imágenes de barcos deben ser PNG con transparencia para mejor efecto visual
- El formulario funciona sin claves (simula envío), pero requiere Resend y Supabase para funcionar completamente
- Lighthouse: Objetivo ≥90 en Accessibility y Best Practices

## 📄 Licencia

Privado - Caliente Tours Miami

