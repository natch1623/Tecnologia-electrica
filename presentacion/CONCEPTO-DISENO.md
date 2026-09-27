# Concepto maestro — Presentación NFPA 70E-2021 (Módulo D)

Manual de diseño y funcionamiento. Todo lo que se construya en `presentacion/web/` sigue estas reglas.

## 1. Idea central

> **El mantenimiento controla el tiempo. El tiempo controla la energía. En el peritaje importa identificar qué barreras fallaron.**

Hilo narrativo: mantenimiento → energía incidente → corriente continua → baterías → hidrógeno → accidente hipotético → peritaje → barreras → controles.

Es una **experiencia web interactiva**, no un PowerPoint convertido a HTML.

## 2. Identidad visual

Inspiración: estética abisal de Skirk (Genshin Impact), **sin usar el personaje ni arte oficial**. Se traduce en vacío cósmico, precisión, geometría, cortes luminosos, partículas, profundidad y movimiento cinematográfico.

| Color | Significado (fijo) |
| --- | --- |
| Violeta `#a58bff` | Mantenimiento |
| Carmesí `#ff4d6d` | Peligro / accidente |
| Verde hielo `#5ef0c8` | Control / barrera efectiva |
| Azul hielo `#8fe3ff` | Datos / acentos |
| Blanco `#ece9f7` | Información principal |
| Negro azulado `#07060f` | Espacio y fondo |

El color tiene significado; nunca se usa solo porque combina.

## 3. Regla estética

**No:** tarjetas, grids de cajas, bordes redondeados, gradientes púrpura genéricos, iconos en círculos, sombras exageradas, bloques de texto, layouts idénticos, elementos estáticos.

**Sí:** líneas, puntos, coordenadas, tipografía, diagramas SVG, partículas, perspectiva, máscaras, recortes, profundidad, movimiento y espacio negativo. El contenido existe dentro de un espacio, no dentro de cajas.

## 4. La pantalla está viva (con sutileza)

Capas: estrellas → nebulosa → partículas → geometría → diagramas → contenido. Titilan, derivan, respiran y reaccionan al cursor (parallax). "Esta pantalla está viva", no "mira cuántos efectos tiene".

## 5. El diseño evoluciona con el peligro

| Bloque | Slides | Ambiente (`data-mood`) |
| --- | --- | --- |
| I · Mantenimiento | 01–05 | `maint`: violeta + hielo, lento, ordenado |
| II · Energía | 06–08 | `energy`: más pulsos, rayas de energía |
| III · Corriente continua | 09–12 | `dc`: partículas que recorren trazas de circuito |
| IV · Hidrógeno | 13–14 | `h2`: burbujas ascendentes |
| V · Accidente | 15–16 | `crisis`: entra el carmesí, brasas, grietas |
| V · Análisis y control | 17–18 | `order`: vuelve el orden en verde hielo |
| Cierre | 19 | `calm` |

## 6–7. Diagramas protagonistas

Técnicamente correctos primero, animados después. Interactivos: se seleccionan, revelan, aíslan y muestran flujo, falla y consecuencia (slides 04, 07, 10, 11, 12, 13, 14, 15, 16, 17).

## 8. Transiciones con significado (`data-tx`)

| Transición | Uso |
| --- | --- |
| `slash` | Corte de espada: inicio de bloque |
| `rift` | Grieta diagonal |
| `cleave` | Tajo diagonal de luz: la slide se parte en dos mitades con filo luminoso que se separan, esquirlas salen del corte y la siguiente aparece en la brecha (02 → 03) |
| `expand` | Se abre desde un punto del contenido (anillo, frontera, reloj) |
| `sweep` | Barrido por propagación (cadena causal, trayectoria) |
| `wave` | Borde senoidal (CA/CC) |
| `absorb` | Zoom dentro de la celda 119 (banco → corte de celda) |
| `rise` | Emerge desde abajo, como el gas |
| `scan` | Reconstrucción por franjas (forense) |
| `fracture` | La slide saliente se parte en fragmentos reales (con su contenido) que salen despedidos desde el punto del arco (accidente → barreras) |
| `reconstruct` | Las franjas se reordenan (vuelve el orden) |
| `dissolve` | Fundido sereno |

Reglas de las transiciones:

- En los barridos (`slash`, `rift`, `sweep`, `wave`, `rise`) la slide saliente se recorta con la forma complementaria: el corte es un borde real entre dos escenas, y una línea de luz del color del bloque viaja sobre él (`#fx`). `slash` añade el filo.
- Retroceder rebobina la transición de la slide que se abandona; si no es reversible, fundido corto.
- Los diagramas entran con significado: el banco se arma en el orden de la cadena serie, la pirámide de la fuente a la persona, el pulso de la cadena causal llega a cada eslabón cuando este cambia de color.

## 9. El contenido se transforma: el hilo conductor

Una sola línea (`#thread`) atraviesa toda la presentación y se convierte en un elemento real de cada slide:

órbita del sigilo → ruta → frontera confiabilidad/seguridad → anillo de 110.4(D) → vector que cruza las barreras → eje de tiempos de despeje → **recta E ∝ t** → cadena causal → horizonte → onda CA / traza CC → frontera de arco → **cadena serie del banco** → trayectoria del gas → triángulo del fuego → línea de tiempo del accidente (con el pico de las 02:38) → **vector del accidente** → pirámide de controles → reloj → horizonte final.

## 10. Composición distinta en cada slide

01 cinemático · 02 ruta · 03 tipográfico · 04 radial · 05 barreras · 06 timeline · 07 cuantitativo · 08 cadena · 09 números gigantes · 10 ondas · 11 fronteras · 12 banco · 13 corte · 14 triángulo · 15 forense · 16 barreras espaciales · 17 jerarquía · 18 interacción · 19 minimalista.

## 11. Interacción

Controles: `→`/Espacio/clic avanzar · `←` retroceder · `M` índice · `N` notas · `P` presentador · `F` pantalla completa · `T` reloj 30 s · `A–D` respuesta · `?`/`H` ayuda.

Cada slide puede tener **estados internos** (`data-s`): `→` avanza el estado antes de cambiar de slide y `←` lo retrocede. Elementos con `data-at="k"` aparecen desde el estado k; con `data-only="k"`, solo en el estado k.

## 12. Tecnología

HTML + CSS + JavaScript sin dependencias (funciona con `python -m http.server`). SVG para diagramas, Canvas para el ambiente, Web Animations API para transiciones. Respeta `prefers-reduced-motion`.

| Archivo | Rol |
| --- | --- |
| `js/ambient.js` | Estrellas, nebulosa, partículas por bloque, geometría, parallax |
| `js/thread.js` | Geometría compartida (`GEO`) y el hilo que se transforma |
| `js/scenes.js` | Construcción y estados de cada diagrama |
| `js/main.js` | Navegación, estados, transiciones, cromo, notas, presentador |

## 13. Principio técnico

**NFPA 70E + ingeniería + coherencia física primero; animación y estética después.** Si una trayectoria recorre el banco, corresponde al modelo eléctrico; si una tabla muestra valores, son los de la referencia normativa.

## 14. Resultado buscado

"Esto parece una experiencia interactiva de ingeniería diseñada específicamente para este caso." La estética de Skirk aporta el lenguaje; NFPA 70E aporta la lógica.
