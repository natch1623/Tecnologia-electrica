# Concepto · Defensa del perfil MI 815 (protección radiológica)

Presentación web de 16 diapositivas (16:9) para defender el perfil de proyecto. Usa el mismo motor y lenguaje que `presentacion/web` (espacio vivo, hilo conductor que se transforma, transiciones con corte de luz, notas y modo presentador), con la paleta sobria del encargo.

## Reglas del encargo

- Solo contenido del perfil; citas APA tal como están.
- Máximo 40 palabras visibles por diapositiva (la portada es la excepción: lleva todos los datos institucionales que pide el encargo).
- Notas del orador en cada diapositiva: quién habla, tiempo y guion. Katheryn 01–08 (9:00) · Douglas 09–16 (8:15) · total 17:15, máximo 18:00.
- Sin fotos de personas ni logos.

## Identidad visual

| Color | Uso |
| --- | --- |
| Azul marino `#13233A` | Espacio y fondo, tarjetas de vidrio |
| Crema `#F5F2EC` | Información principal |
| Ámbar `#E0A32E` | Optimización, aporte del estudio, énfasis |

Tipografía: títulos y frases en serif (Cormorant Garamond); texto y cifras en sans (Outfit, porque la serif no trae cifras alineadas y «H0» se leía «Ho»); rótulos en mono (JetBrains Mono).

## La pantalla está viva

El fondo emite ondas desde un punto de cada diapositiva (`data-anchor`) que se atenúan con la distancia, como una fuente de radiación. El ánimo (`data-mood`) cambia el ritmo: `calm`, `dose`, `order`, `field`, `flow`.

## Hilo conductor (`data-thread`, `js/thread.js`)

órbita de la fuente → límite de dosis (techo) → línea de tiempo de antecedentes → frontera vacío/respuesta → límite de la clínica → base de la justificación → escalera de objetivos → fiel de las hipótesis → eje de distancia → flujo de las fases → división población/instrumentos → integración → eje de meses → eje del presupuesto → núcleo del impacto → horizonte.

## Transiciones (`data-tx`)

`slash` (inicio de bloque) · `sweep` (dentro del bloque) · `rise` · `expand` (se abre desde un nodo, `data-origin`) · `dissolve`. Al retroceder se rebobina la de la diapositiva que se abandona.

## Movimiento (`js/motion.js` + bloque «Movimiento (capa 2)» de `styles.css`)

- Títulos y frases clave entran palabra por palabra (`data-split`; los `h2.title` se parten solos).
- Cifras que cuentan hasta su valor exacto: `data-count`, `data-dec`, `data-from`, `data-delay` (β = 0,446; 22,5 → 95 %; ≥ 60; B/. 3 685 y rubros).
- Paralaje leve de diagramas e imágenes con el cursor; luz que sigue al cursor en las tarjetas.
- Por diapositiva: órbitas en la portada, cuantos de dosis que caen en la 02, lunares que se llenan en la 03, pulsos que viajan del vacío a la respuesta en la 04, la pregunta que se abre en la 05, ondas en los objetivos (07), emisión, fotones absorbidos por el blindaje y reloj en la 09, ondas sincronizadas con el pulso de fases (10), validación en cadena (11), integración que recibe los flujos (12), cabezal que recorre el cronograma (13), brillo en el presupuesto (14), núcleo que emite hacia cada impacto (15) y «Optimizar» que se ilumina (16).

## Imágenes (`web/img/`, generadas con ChatGPT)

Sin personas, sin texto ni logotipos, en la paleta del encargo. Se revelan con un barrido ámbar, como una placa que se escanea, y tienen un acercamiento lento (Ken Burns).

| Archivo | Diapositiva |
| --- | --- |
| `sala-rayos-x.jpg` | 01 · fondo de la portada |
| `tubo-colimador.jpg` | 09 · el colimador coincide con la fuente del esquema |
| `delantales.jpg` | 10 · junto a los componentes del programa |
| `dosimetro-monitor.jpg` | 11 · detrás del censo |
| `cierre.jpg` | 16 · horizonte de cierre |

Los PNG originales están en `originales/`.

## Estados internos

`data-states="n"` en la sección; los elementos con `data-at="k"` aparecen desde el estado k. `→` avanza estados antes de cambiar de diapositiva.

## Controles

`→`/Espacio/clic avanzar · `←` retroceder · `M` índice · `N` notas · `P` presentador (otra ventana sincronizada, reloj de 18 min) · `F` pantalla completa · `?` ayuda.

## Archivos

| Archivo | Rol |
| --- | --- |
| `web/index.html` | Diapositivas y notas del orador (`aside.notes`) |
| `web/css/styles.css` | Estilo y composición de cada diapositiva |
| `web/js/ambient.js` | Fondo vivo |
| `web/js/thread.js` | Hilo que se transforma |
| `web/js/scenes.js` | Título de portada, cronograma y presupuesto desde datos |
| `web/js/main.js` | Navegación, transiciones, cromo, notas y presentador |
| `Perfil_MI815_Proteccion_Radiologica.pptx` | Respaldo en PowerPoint: cada diapositiva como imagen + notas del orador |
| `Presentacion_Perfil_MI815.pdf` | Las 16 diapositivas en su estado final (16:9) |
| `Guion_Perfil_MI815.pdf` | Guion A4: reparto del tiempo hasta 20:00 (17:15 de exposición + preguntas), guion por diapositiva y respuestas preparadas |

Publicada en https://natch1623.github.io/Tecnologia-electrica/perfil-mi815/ (workflow `.github/workflows/pages.yml`).

Servidor local: configuración `perfil-mi815` en `.claude/launch.json` (puerto 5176), o `python -m http.server 5176 --directory presentacion-mi815/web`.
