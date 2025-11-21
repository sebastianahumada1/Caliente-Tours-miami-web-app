# 🚤 Yacht Management Guide

Esta guía te explica cómo administrar los yates en el sitio web de Caliente Tours Miami.

## 📋 Tabla de Contenidos
- [Estructura de Datos](#estructura-de-datos)
- [Agregar un Nuevo Yate](#agregar-un-nuevo-yate)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Campos Requeridos](#campos-requeridos)
- [Ejemplos](#ejemplos)

---

## 🗂️ Estructura de Datos

Todos los yates se almacenan en la tabla `boats` de tu proyecto Supabase.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | integer | Identificador incremental único |
| `name` | text | Nombre comercial del yate |
| `slug` | text | Identificador URL-friendly (único) |
| `description` | text | Descripción corta usada en el hero |
| `max_people` | integer | Capacidad máxima |
| `price_range` | text | Rangos permitidos: `"< $1.000"`, `"$1.000-$1.500"`, `"$1.500-$2.000"`, `"$2.000-$2.500"` |
| `main_image` | text | Clave en Supabase Storage (`boats/tu-archivo.png`) |
| `more_photos_url` | text | URL externa opcional para “More photos” |
| `images` | jsonb | Objeto con arrays de claves por categoría |
| `specs` | jsonb | Objeto con especificaciones técnicas |

Ejemplo de registro (`Row`) tal como se guarda en Supabase:

```json
{
  "id": 1,
  "name": "FlyBridge 70Ft",
  "slug": "flybridge-70ft",
  "description": "Aicon 85 is the Perfect Yacht for the Bahamas and Overnight",
  "max_people": 13,
  "price_range": "< $1.000",
  "main_image": "boats/boat1.png",
  "more_photos_url": "https://calientetoursmiami.smugmug.com/55--PINK-AZIMUT-",
  "images": {
    "cabin": ["boats/boat1/cabin/interior1.jpeg"],
    "deck": ["boats/boat1/deck/deck1.jpeg"],
    "yacht": ["boats/boat1/yacht/yacht1.jpeg"],
    "charter": ["boats/boat1/charter/charter1.png"],
    "services": ["boats/boat1/services/service1.png"]
  },
  "specs": {
    "length": "70ft",
    "type": "FlyBridge",
    "year": 2023
  }
}
```

---

## ➕ Agregar un Nuevo Yate

### Paso 1: Preparar las Imágenes

1. Abre Supabase → `Storage` → bucket público `boats`.
2. Crea una carpeta (opcional) para tu yate, por ejemplo `boats/azimut-85/`.
3. Sube los archivos manteniendo subcarpetas si lo necesitas:
   ```
   boats/azimut-85/
   ├── main.png              (imagen principal)
   ├── cabin/
   │   ├── interior1.jpeg
   │   ├── interior2.jpeg
   │   └── interior3.jpeg
   ├── deck/
   │   ├── deck1.jpeg
   │   └── deck2.jpeg
   ├── yacht/
   │   └── yacht1.jpeg
   ├── charter/
   │   ├── charter1.png
   │   └── charter2.png
   └── services/
       └── service1.png
   ```

### Paso 2: Crear el registro en Supabase

1. Ve a tu proyecto Supabase → `Table Editor` → tabla `boats`.
2. Haz clic en **Insert Row** y completa los campos:
   - `name`, `slug`, `description`, `max_people`, `price_range`, `main_image`.
   - `images`: pega un objeto JSON con tus rutas.
   - `more_photos_url`: opcional, agrega un enlace externo para abrir una galería.
   - `specs`: pega un objeto JSON con la información técnica.

Ejemplo de payload para `images` y `specs`:

```json
{
  "images": {
    "cabin": [
      "boats/azimut-85/cabin/interior1.jpeg",
      "boats/azimut-85/cabin/interior2.jpeg",
      "boats/azimut-85/cabin/interior3.jpeg"
    ],
    "deck": [
      "boats/azimut-85/deck/deck1.jpeg",
      "boats/azimut-85/deck/deck2.jpeg"
    ],
    "yacht": [
      "boats/azimut-85/yacht/yacht1.jpeg"
    ],
    "charter": [
      "boats/azimut-85/charter/charter1.png",
      "boats/azimut-85/charter/charter2.png"
    ],
    "services": [
      "boats/azimut-85/services/service1.png"
    ]
  },
  "specs": {
    "length": "85ft",
    "type": "Motor Yacht",
    "year": 2024
  }
}
```

¿Prefieres SQL? Ejecuta este ejemplo (ajusta los valores):

```sql
insert into boats
  (name, slug, description, max_people, price_range, main_image, more_photos_url, images, specs)
values
  (
    'Azimut 85',
    'azimut-85',
    'Luxury yacht perfect for extended trips',
    16,
    '<3000',
    'boats/azimut-85/main.png',
    'https://example.com/full-gallery',
    jsonb_build_object(
      'cabin', ARRAY['boats/azimut-85/cabin/interior1.jpeg', 'boats/azimut-85/cabin/interior2.jpeg', 'boats/azimut-85/cabin/interior3.jpeg'],
      'deck', ARRAY['boats/azimut-85/deck/deck1.jpeg', 'boats/azimut-85/deck/deck2.jpeg'],
      'yacht', ARRAY['boats/azimut-85/yacht/yacht1.jpeg'],
      'charter', ARRAY['boats/azimut-85/charter/charter1.png', 'boats/azimut-85/charter/charter2.png'],
      'services', ARRAY['boats/azimut-85/services/service1.png']
    ),
    jsonb_build_object(
      'length', '85ft',
      'type', 'Motor Yacht',
      'year', 2024
    )
  );
```

### Paso 3: ¡Listo!

Recarga la página y tu nuevo yate aparecerá automáticamente. 🎉

---

## 📁 Organización en Supabase Storage

```
boats/
├── flybridge-70ft/
│   ├── main.png
│   ├── cabin/
│   ├── deck/
│   ├── yacht/
│   ├── charter/
│   └── services/
├── azimut-85/
│   └── ... (misma estructura)
└── sunseeker-90/
    └── ... (misma estructura)
```

**Convenciones:**
- Usa slugs en minúsculas con guiones: `flybridge-70ft`, `azimut-85`.
- Mantén carpetas coherentes (cabin, deck, yacht, charter, services) para ubicar fácilmente los assets.
- Los buckets son públicos, por lo que puedes pegar la clave `boats/...` directamente en Supabase y el frontend generará la URL pública.

---

## 📝 Campos Requeridos

### Campos Obligatorios

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | number | ID único del yate | `1` |
| `name` | string | Nombre del yate | `"FlyBridge 70Ft"` |
| `slug` | string | URL-friendly identifier | `"flybridge-70ft"` |
| `description` | string | Descripción breve | `"Perfect for day trips"` |
| `maxPeople` | number | Capacidad máxima | `13` |
| `priceRange` | string | Rango de precio | `"< $1.000"` o `"$1.000-$1.500"` o `"$1.500-$2.000"` o `"$2.000-$2.500"` |
| `mainImage` | string | Clave de Storage | `"boats/boat1.png"` |
| `images` | object | Objeto con arrays de claves | Ver estructura abajo |
| `specs` | object | Especificaciones técnicas | Ver estructura abajo |

### Estructura de `images`

```json
"images": {
  "cabin": [],    // Array de claves (puede estar vacío)
  "deck": [],     // Array de claves (puede estar vacío)
  "yacht": [],    // Array de claves (puede estar vacío)
  "charter": [],  // Array de claves (puede estar vacío)
  "services": []  // Array de claves (puede estar vacío)
}
```

**Nota:** Si no tienes imágenes para una categoría, deja el array vacío: `[]`

### Estructura de `specs`

```json
"specs": {
  "length": "70ft",
  "type": "FlyBridge",
  "year": 2023
}
```

---

## 💡 Ejemplos

### Ejemplo 1: Yate Completo (con todas las imágenes)

```json
{
  "id": 1,
  "name": "FlyBridge 70Ft",
  "slug": "flybridge-70ft",
  "description": "Aicon 85 is the Perfect Yacht for the Bahamas and Overnight",
  "maxPeople": 13,
  "priceRange": "< $1.000",
  "mainImage": "boats/boat1.png",
  "images": {
    "cabin": ["boats/boat1/cabin/interior1.jpeg"],
    "deck": ["boats/boat1/deck/deck1.jpeg"],
    "yacht": ["boats/boat1/yacht/yacht1.jpeg"],
    "charter": ["boats/boat1/charter/charter1.png"],
    "services": ["boats/boat1/services/service1.png"]
  },
  "specs": {
    "length": "70ft",
    "type": "FlyBridge",
    "year": 2023
  }
}
```

### Ejemplo 2: Yate Básico (sin imágenes de interior)

```json
{
  "id": 7,
  "name": "Express Cruiser 55",
  "slug": "express-cruiser-55",
  "description": "Fast and comfortable day cruiser",
  "maxPeople": 8,
  "priceRange": "< $1.000",
  "mainImage": "boats/express-cruiser-55/main.png",
  "images": {
    "cabin": [],
    "deck": [],
    "yacht": [],
    "charter": [],
    "services": []
  },
  "specs": {
    "length": "55ft",
    "type": "Express Cruiser",
    "year": 2022
  }
}
```

---

## 🔍 Rangos de Precio

Los yates se filtran por estos rangos:

- `"< $1.000"` - Menos de $1.000 USD
- `"$1.000-$1.500"` - Entre $1.000 y $1.499 USD
- `"$1.500-$2.000"` - Entre $1.500 y $1.999 USD
- `"$2.000-$2.500"` - Entre $2.000 y $2.499 USD

**Importante:** Usa exactamente estos valores para que los filtros funcionen correctamente.

---

## ⚠️ Notas Importantes

1. **IDs automáticos:** La columna `id` puede ser `serial`; deja que Supabase la asigne cuando sea posible.
2. **Slugs únicos:** Los slugs deben ser únicos para evitar conflictos en la UI.
3. **Claves de Storage:** Usa claves relativas al bucket, por ejemplo `boats/tu-imagen.png` (sin `https://`).
4. **JSON válido:** `images` y `specs` deben contener JSON válido (usa un validador si es necesario).
5. **Arrays vacíos:** Si no tienes imágenes para una categoría, usa `[]` en lugar de omitir el campo.
6. **Permisos:** Asegúrate de tener habilitado `Row Level Security` y políticas de lectura pública para la tabla `boats`.
7. **Refrescar:** Los cambios en Supabase se reflejan al instante; solo recarga el sitio.

---

## 🛠️ Troubleshooting

### Error: "Supabase client not initialized" o "boats relation does not exist"

1. **Variables de entorno:** Confirma `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. **Tabla `boats`:** Verifica que la tabla exista y tenga los campos esperados.
3. **Políticas RLS:** Revisa que exista una política `SELECT` que permita lecturas públicas.
4. **Limpia caché:** Recarga con Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows).

### El yate no aparece

1. Confirma que el registro esté insertado en `boats`.
2. Verifica que `price_range` use uno de los valores válidos.
3. Abre la consola del navegador para ver errores.
4. Verifica que las rutas de las imágenes sean correctas.

### Las imágenes no cargan

1. Verifica en Supabase Storage que la clave exista en el bucket `boats`.
2. Asegúrate de que la clave guardada en la tabla coincida exactamente (`boats/...`).
3. Comprueba que el bucket sea público o que exista una política que permita lectura anónima.

### Los filtros no funcionan

1. Verifica que el `priceRange` sea exactamente uno de estos: `"< $1.000"`, `"$1.000-$1.500"`, `"$1.500-$2.000"`, `"$2.000-$2.500"`
2. Las comillas son importantes: debe ser un string

---

## 📞 Necesitas Ayuda?

Si tienes problemas o preguntas, contacta al desarrollador del proyecto.

---

**Última actualización:** Noviembre 2025

