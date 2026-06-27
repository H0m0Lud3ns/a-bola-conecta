# FestivalGallery — Integración en abolaconecta.com.br

Paquete listo para insertar en el bundle React del home de abolaconecta.com.br.

## Contenido del paquete

- `FestivalGallery.react.tsx` — Componente React (TypeScript) con dos variantes.
- `festival-gallery.css` — Estilos para ambas variantes. Colar en el bundle CSS o importar como módulo.
- `web/*.jpg` — 7 logos optimizados para web (400x400).
- `festivais.json` — Inventario editable con metadatos completos.

## Dos variantes

### `variant="strip"` — Banda fija debajo del hero

Carrusel infinito horizontal con marquee CSS, pausa en hover. Logos en monocromo dorado/sepia sobre fondo marrón del site. Ideal para captar credibilidad imediato.

```tsx
import { FestivalGallery } from './components/FestivalGallery';

<FestivalGallery variant="strip" />
```

### `variant="grid"` — Sección dedicada "Trajetória"

Grid responsivo con nombre + meta + categoría en cada card. Premio (Curta-se) destacada con estrella + borde. Ideal para aprofundar.

```tsx
<FestivalGallery
  variant="grid"
  title="Trajetória"
  subtitle="O documentário circulou em mostras, festivais e espaços acadêmicos no Brasil e fora do país."
/>
```

## Props disponibles

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `variant` | `'strip' \| 'grid'` | `'strip'` | Layout del componente |
| `title` | `string` | `'Premiações e exibições'` | Solo visible en variant="grid" |
| `subtitle` | `string` | Texto padrão | Solo visible en variant="grid" |
| `imagesBase` | `string` | `'/assets/festivais/web'` | Path base donde están los logos |
| `showPremio` | `boolean` | `true` | Si true, incluye la card del Curta-se destacada |

## Sugerencias de ubicación en el home actual

El home de abolaconecta.com.br tiene esta estructura (visto el 2026-06-27):

```
Hero / Manifesto
↓
Por onde você entra na Gondwana? (3 caminhos)
↓
Depoimentos
↓
O que se move no portal (blog)
↓
Newsletter
```

### Opción A+B (recomendada)

1. **Strip justo después del hero**, antes de "Caminhos para conectar":
   ```tsx
   <Hero />
   <FestivalGallery variant="strip" />
   <CaminhosSection />
   ```

2. **Grid antes del footer**, después de la newsletter o reemplazándola:
   ```tsx
   <BlogSection />
   <FestivalGallery variant="grid" title="Trajetória" />
   <Newsletter />
   ```

## Performance

- Logos totales: ~190 KB para los 7 en web (400x400 cada uno).
- Animación marquee es CSS puro (sin JS), respeta `prefers-reduced-motion`.
- Hover pausa la animación.
- Logos en blanco/negro en la variante strip (filter grayscale) — solo el card do Curta-se ganha destaque.
- `loading="lazy"` en las imágenes.

## Mantenimiento

Si llegan nuevos logos de festivales:

1. Bajar el JPG original (mínimo 1080x1080) a `festivais/`.
2. Generar versión web 400x400 a `festivais/web/`.
3. Agregar entrada nueva en `festivais.json` y en el array `FESTIVAIS` de `FestivalGallery.react.tsx`.
4. Rebuild del bundle.

## Datos sensibles

- El componente NO incluye logos de festivales internacionales en posiciones destacadas.
- La mención de "no exterior" en el subtítulo es histórica (lo que ya pasó), no promesa operacional futura.
- Para queries de prensa sobre exibiciones específicas, linkear a `/imprensa/` que tiene la lista completa.
