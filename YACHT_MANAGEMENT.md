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

Todos los yates se gestionan desde el archivo:
```
/public/data/yachts.json
```

Cada yate tiene la siguiente estructura:

```json
{
  "id": 1,
  "name": "FlyBridge 70Ft",
  "slug": "flybridge-70ft",
  "description": "Descripción del yate",
  "maxPeople": 13,
  "priceRange": "<1000",
  "mainImage": "/boats/boat1.png",
  "images": {
    "cabin": ["/boats/boat1/cabin/interior1.jpeg"],
    "deck": ["/boats/boat1/deck/deck1.jpeg"],
    "yacht": ["/boats/boat1/yacht/yacht1.jpeg"],
    "charter": ["/boats/boat1/Charter/charter1.png"],
    "services": ["/boats/boat1/services/service1.png"]
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

1. Crea una carpeta para tu yate en `/public/boats/`
   - Ejemplo: `/public/boats/azimut-85/`

2. Organiza las imágenes en subcarpetas:
   ```
   /public/boats/azimut-85/
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
   ├── Charter/
   │   ├── charter1.png
   │   └── charter2.png
   └── services/
       └── service1.png
   ```

### Paso 2: Agregar al JSON

Abre `/public/data/yachts.json` y agrega tu yate al array `yachts`:

```json
{
  "yachts": [
    // ... yates existentes ...
    {
      "id": 6,
      "name": "Azimut 85",
      "slug": "azimut-85",
      "description": "Luxury yacht perfect for extended trips",
      "maxPeople": 16,
      "priceRange": "<3000",
      "mainImage": "/boats/azimut-85/main.png",
      "images": {
        "cabin": [
          "/boats/azimut-85/cabin/interior1.jpeg",
          "/boats/azimut-85/cabin/interior2.jpeg",
          "/boats/azimut-85/cabin/interior3.jpeg"
        ],
        "deck": [
          "/boats/azimut-85/deck/deck1.jpeg",
          "/boats/azimut-85/deck/deck2.jpeg"
        ],
        "yacht": [
          "/boats/azimut-85/yacht/yacht1.jpeg"
        ],
        "charter": [
          "/boats/azimut-85/Charter/charter1.png",
          "/boats/azimut-85/Charter/charter2.png"
        ],
        "services": [
          "/boats/azimut-85/services/service1.png"
        ]
      },
      "specs": {
        "length": "85ft",
        "type": "Motor Yacht",
        "year": 2024
      }
    }
  ]
}
```

### Paso 3: ¡Listo!

Recarga la página y tu nuevo yate aparecerá automáticamente. 🎉

---

## 📁 Estructura de Carpetas Recomendada

```
public/
└── boats/
    ├── flybridge-70ft/
    │   ├── main.png
    │   ├── cabin/
    │   ├── deck/
    │   ├── yacht/
    │   ├── Charter/
    │   └── services/
    ├── azimut-85/
    │   └── ... (misma estructura)
    └── sunseeker-90/
        └── ... (misma estructura)
```

**Convención de nombres:**
- Usa slugs en minúsculas con guiones: `flybridge-70ft`, `azimut-85`
- Mantén la misma estructura de carpetas para todos los yates
- Usa formatos de imagen modernos (WebP recomendado, JPEG/PNG aceptable)

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
| `priceRange` | string | Rango de precio | `"<1000"` o `"<2000"` o `"<3000"` o `">4000"` |
| `mainImage` | string | Ruta de imagen principal | `"/boats/boat1.png"` |
| `images` | object | Objeto con arrays de rutas | Ver estructura abajo |
| `specs` | object | Especificaciones técnicas | Ver estructura abajo |

### Estructura de `images`

```json
"images": {
  "cabin": [],    // Array de rutas (puede estar vacío)
  "deck": [],     // Array de rutas (puede estar vacío)
  "yacht": [],    // Array de rutas (puede estar vacío)
  "charter": [],  // Array de rutas (puede estar vacío)
  "services": []  // Array de rutas (puede estar vacío)
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
  "priceRange": "<1000",
  "mainImage": "/boats/boat1.png",
  "images": {
    "cabin": [
      "/boats/boat1/cabin/interior1.jpeg",
      "/boats/boat1/cabin/interior2.jpeg",
      "/boats/boat1/cabin/interior3.jpeg"
    ],
    "deck": [
      "/boats/boat1/deck/deck1.jpeg",
      "/boats/boat1/deck/deck2.jpeg"
    ],
    "yacht": [
      "/boats/boat1/yacht/yacht1.jpeg"
    ],
    "charter": [
      "/boats/boat1/Charter/charter1.png"
    ],
    "services": [
      "/boats/boat1/services/service1.png"
    ]
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
  "priceRange": "<1000",
  "mainImage": "/boats/express-cruiser-55/main.png",
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

- `"<1000"` - Menos de $1,000 USD
- `"<2000"` - Menos de $2,000 USD
- `"<3000"` - Menos de $3,000 USD
- `">4000"` - Más de $4,000 USD

**Importante:** Usa exactamente estos valores para que los filtros funcionen correctamente.

---

## ⚠️ Notas Importantes

1. **IDs únicos:** Cada yate debe tener un ID único
2. **Slugs únicos:** Los slugs también deben ser únicos
3. **Rutas de imágenes:** Todas las rutas deben empezar con `/` y ser relativas a `/public`
4. **JSON válido:** Asegúrate de que el JSON esté bien formateado (usa un validador online si tienes dudas)
5. **Arrays vacíos:** Si no tienes imágenes para una categoría, usa `[]` en lugar de omitir el campo
6. **Ubicación del JSON:** El archivo DEBE estar en `/public/data/yachts.json` para que Next.js pueda servirlo como archivo estático
7. **Reiniciar servidor:** Después de editar el JSON, recarga la página (no necesitas reiniciar el servidor)

---

## 🛠️ Troubleshooting

### Error: "Failed to load yachts data"

1. **Verifica la ubicación del archivo:** Debe estar en `/public/data/yachts.json` (NO en `/data/yachts.json`)
2. **Verifica que el JSON sea válido:** Ejecuta `node -e "require('./public/data/yachts.json')"`
3. **Reinicia el servidor de desarrollo:** `npm run dev`
4. **Limpia el cache:** Recarga con Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows)

### El yate no aparece

1. Verifica que el JSON esté bien formateado
2. Verifica que el `priceRange` sea uno de los valores válidos
3. Abre la consola del navegador para ver errores
4. Verifica que las rutas de las imágenes sean correctas

### Las imágenes no cargan

1. Verifica que las imágenes estén en `/public/boats/`
2. Verifica que las rutas en el JSON coincidan exactamente con los nombres de archivo
3. Verifica que las extensiones (.png, .jpeg, .jpg) estén correctas

### Los filtros no funcionan

1. Verifica que el `priceRange` sea exactamente uno de estos: `"<1000"`, `"<2000"`, `"<3000"`, `">4000"`
2. Las comillas son importantes: debe ser un string

---

## 📞 Necesitas Ayuda?

Si tienes problemas o preguntas, contacta al desarrollador del proyecto.

---

**Última actualización:** Noviembre 2025

