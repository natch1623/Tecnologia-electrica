# Guía de la presentación — Módulo D · NFPA 70E-2021

## 1. De qué trata la presentación

La exposición corresponde al **Módulo D del Taller NFPA 70E**, edición 2021. Cubre tres bloques:

1. **Capítulo 2 (Arts. 200–250): mantenimiento.** Sostiene que, para NFPA 70E, el mantenimiento no busca que el equipo dure: es una **barrera de seguridad para las personas**. Un equipo mal mantenido tarda más en despejar una falla, libera más energía incidente y deja sin validez las tablas de EPP y las etiquetas de arco.
2. **Capítulo 3, Artículo 320: baterías.** Presenta los peligros propios de un banco de baterías: choque y arco en corriente continua, electrolito e hidrógeno. Explica por qué **una batería no se puede desenergizar** y qué controles exige la norma.
3. **Caso 4: peritaje técnico.** Reconstruye un accidente **hipotético** en un banco de 250 V CC de un centro de datos: un arco dentro de la cadena, sin interruptor que lo despeje, que enciende hidrógeno en una celda sin apagallamas. El peritaje identifica las barreras que fallaron, las causas raíz y las medidas de control.

**Idea central que recorre toda la exposición:**
> El mantenimiento controla el **tiempo**; el tiempo controla la **energía**. Y en un peritaje la pregunta no es quién se equivocó, sino **qué barreras fallaron**.

**Hilo conductor:** mantenimiento → energía → corriente continua → hidrógeno → peritaje.

## 2. Formato y duración

- **30 min de exposición + 10 min de preguntas**, 5 integrantes con unos 6 min cada uno.
- **19 slides principales** (18 del plan + 1 de cierre) y **5 de respaldo** (R1–R5), que solo se muestran si preguntan.
- Es una **página web** (HTML, CSS y JavaScript) ubicada en `presentacion/web/`. Se abre con un servidor local:
  ```bash
  python -m http.server 5173 --directory "presentacion/web"
  ```
  y luego se entra a `http://localhost:5173`.

### Controles

| Tecla | Acción |
| --- | --- |
| → · Espacio · clic | Avanzar (si la slide tiene estados, primero los recorre) |
| ← | Retroceder un estado o una slide |
| M | Índice de slides, respaldo incluido |
| N | Notas del orador en la misma pantalla |
| P | Vista de presentador en otra ventana (notas, cronómetro y siguiente slide, sincronizada) |
| F | Pantalla completa |
| T | Reloj de 30 s de la pregunta de control |
| A · B · C · D | Responder la pregunta de control |
| ? · H | Ayuda |

## 3. Concepto visual (inspirado en Skirk, Genshin Impact)

El manual completo está en **`CONCEPTO-DISENO.md`**. En resumen:

- **Pantalla viva:** estrellas con parallax, nebulosa, partículas y anillos geométricos que cambian según el bloque: orden violeta (mantenimiento), pulsos de energía, trazas de circuito (CC), burbujas (H₂), brasas y grietas carmesí (accidente) y vuelta al verde hielo (controles).
- **Hilo conductor:** una sola línea atraviesa toda la exposición y se transforma en el elemento central de cada slide: el eje de tiempos se inclina y se vuelve la recta E ∝ t, luego la cadena causal, la onda CA/CC, la cadena serie del banco, el triángulo del fuego, la línea de tiempo con el pico de las 02:38 y el vector del accidente.
- **Transiciones con significado:** corte de espada al iniciar bloque, apertura desde el anillo o el reloj, borde senoidal en CA/CC, zoom dentro de la celda 119, estallido desde el arco hacia las barreras y reconstrucción por franjas cuando vuelve el orden.
- **Escenas con estados:** → recorre primero los estados internos (los rombos junto al contador indican cuántos hay) y ← los retrocede. Slides con clic: 04 (condiciones), 11 (250 V / 281 V), 16 (restaurar barreras), 17 (niveles) y 18 (opciones).
- **Portada:** sigilo estelar propio de ocho puntas; no se usa arte oficial del juego.
- **Tipografía:** Cinzel para portada y cierre, Outfit para títulos y textos, JetBrains Mono para numerales de la norma y datos.
- **Código de colores fijo en toda la presentación:**

| Color | Significado |
| --- | --- |
| Violeta | Mantenimiento |
| Rojo carmesí | Peligro / accidente |
| Verde hielo | Controles / lo correcto |
| Azul hielo | Acentos y datos |

- **Elementos fijos en cada slide:** el numeral de NFPA 70E en la esquina superior derecha, el integrante a cargo y su tiempo objetivo abajo a la izquierda, el contador abajo a la derecha y una barra de progreso.

## 4. Slide por slide

### Bloque I — Integrante 1: el mantenimiento como requisito de seguridad

**01 · Cuando el mantenimiento es una barrera de seguridad** · 0:30 · *Portada*
Presenta el tema, la norma (edición 2021) y los tres bloques: Capítulo 2, Capítulo 3 y Caso 4. Lleva los nombres de los integrantes. Mensaje de apertura: *"un equipo mal mantenido cambia la energía de un accidente"*.

**02 · Ruta de la exposición** · 0:45 · *Cap. 2 · Art. 320*
Una línea con cinco pasos en numerales romanos: Mantenimiento, Energía, Corriente continua, Hidrógeno y Peritaje, con el integrante responsable de cada uno. Anticipa que al final habrá una pregunta de control.

**03 · ¿Qué es mantenimiento para NFPA 70E?** · 1:30 · *200.1 · 205.3*
Parafrasea la definición de 200.1(3): preservar o restaurar el equipo *para la seguridad de los empleados*. Tres ideas de 205.3: se mantiene según el fabricante o normas de consenso, el propietario es responsable y hay que documentar. Compara en dos columnas **confiabilidad** (que el equipo dure) con **seguridad** (que falle de forma predecible).

**04 · Mantenimiento dentro del programa** · 1:30 · *110.4(D) · 110.5(C)*
Muestra las seis condiciones de la "condición normal de operación" de 110.4(D) y resalta la n.º 2, *adecuadamente mantenido*. Si falla una sola, las estimaciones "No" de la Tabla 130.5(C) dejan de aplicar. Recuerda que 110.5(C) obliga al programa a considerar la condición de mantenimiento.

**05 · Qué se mantiene y por qué** · 1:45 · *205 · 225 · 240 · 250*
Una tabla presenta el Capítulo 2 como un sistema de barreras: protección contra sobrecorriente, envolventes, baterías, EPP y herramientas, e información. Al lado, el **historial del Caso 4**: alarma de falla a tierra inhibida desde hace 5 meses, extractor disparado hace 19 días y detector de H₂ sin calibrar desde hace 26 meses. Cierra con la transición al Integrante 2.

### Bloque II — Integrante 2: tiempo de despeje y energía incidente

**06 · La variable que el mantenimiento controla: el tiempo** · 2:00 · *210.5 NI · 130.5(G)*
Cita la Nota Informativa de 210.5: mantenimiento inadecuado → mayor tiempo de apertura → mayor energía incidente. Resume la relación con la fórmula **E ∝ t**. Una línea de tiempo muestra los tiempos típicos de despeje: 0,5, 1,5, 3, 5 y 20–30 ciclos, este último en rojo por el retardo de tiempo corto.

**07 · De un mecanismo trabado a 16 cal/cm²** · 2:00 · *130.5(G) · Tabla 130.7(C)(15)(a)*
Ejemplo ilustrativo con dos barras animadas. Si el interruptor principal despeja en 3 ciclos, la energía es de **1,6 cal/cm²**. Si el mecanismo está trabado y despeja el respaldo en 30 ciclos, sube a **16 cal/cm²**. Una línea marca el EPP de categoría 2 (8 cal/cm²): el trabajador queda subprotegido y la etiqueta no lo advierte.

**08 · Cuando la tabla y la etiqueta dejan de valer** · 2:00 · *110.4(D) · 130.5(H) · 130.7(C)(15)*
La **cadena causal de 7 eslabones**: estado del equipo → condición eléctrica → comportamiento ante la falla → tiempo de despeje → energía → exposición → consecuencia. Los dos primeros eslabones van en violeta porque son los que controla el mantenimiento. Debajo, tres consecuencias normativas. Cierra adelantando que en un banco de baterías a veces no hay ningún interruptor dentro de la cadena.

### Bloque III — Integrante 3: Artículo 320, corriente continua

**09 · Artículo 320: umbrales y evaluación obligatoria** · 1:30 · *320.1 · 320.3(A)(1)–(2)*
Tres números grandes: **>50 V**, el alcance del artículo; **100 V CC**, el umbral de exposición; y **"Antes"**, porque se exige una evaluación de riesgos antes de cualquier trabajo. Frase de cierre: *"Una batería no se puede desenergizar"*.

**10 · CA vs. CC: por qué el arco en CC no se apaga** · 1:30 · *Art. 320 · Anexo D.5*
Compara dos formas de onda. La senoidal de CA tiene cruces por cero marcados. La línea recta de CC tiene un arco que parpadea. Tres razones: no hay cruce por cero, no hay dispositivo dentro de la cadena y la fuente no se desconecta.

**11 · Tablas de CC: fronteras, probabilidad y EPP** · 2:00 · *Tablas 130.4(E)(b) · 130.5(C) · 130.7(C)(15)(b)*
Aplica tres tablas al banco:
- **Choque:** frontera limitada de 1,0 m; en la restringida, "evitar el contacto".
- **Probabilidad de arco:** **SÍ** al trabajar en celdas en serie.
- **EPP:** **categoría 3**, frontera de 1,8 m, con un arco supuesto de 2 s.

Una franja de advertencia señala la ambigüedad entre **250 V nominales y 281 V en flotación**: con 281 V correspondería la categoría 4. La posición del grupo es hacer el análisis de energía incidente y documentarlo.

**12 · Caso 4: la instalación** · 1:00 · *Caso 4 · 205.2*
Diagrama del banco: dos niveles de celdas (1→62 abajo, 63→125 arriba), el cable puente entre niveles, el interruptor de CC de 400 A **fuera de la cadena** y la UPS-2. Un punto rojo pulsante marca el contacto del cable con el bastidor. A la derecha, la ficha técnica: 125 celdas, 250/281/291 V, ≈ 8,5 kA y bus no puesto a tierra. Lleva la etiqueta "escenario hipotético".

### Bloque IV — Integrante 4: electrolito e hidrógeno

**13 · El otro peligro: electrolito e hidrógeno** · 2:00 · *320.3(B) · 320.3(D)*
Corte de una celda ventilada: placas, electrolito, burbujas de gas que suben, espacio superior con H₂ + O₂ y el **apagallamas** ("el gas sale, la llama no entra"). A la derecha, el EPP químico que exige 320.3(B)(1) y tres datos: LII del 4 %, objetivo de ventilación menor al 1 % y energía mínima de ignición de 0,02 mJ. La carga de igualación genera más gas.

**14 · Barreras contra la explosión** · 1:30 · *240.1 · 320.3(C) · 320.3(D)*
El **triángulo del fuego aplicado al hidrógeno**. El oxígeno siempre está presente; el combustible se controla con ventilación y la ignición con el apagallamas. Tres barreras numeradas: ventilación mantenida y probada (240.1), apagallamas en cada celda (320.3(D)) y eliminación de fuentes de ignición (320.3(C)). Mensaje: *el EPP no protege contra la onda de presión de una celda*.

**15 · Caso 4: línea de tiempo y evidencias** · 2:30 · *Caso 4 · 110.5(J)*
Arriba, las **condiciones latentes**: alarma inhibida (−5 meses), extractor detenido (−19 días) e igualación (−20 h). En el centro, la línea de tiempo de la noche, de 01:30 a 02:41, con el hito en rojo a las **02:38: arco de ≈ 0,9 s y detonación en la celda 119**. Abajo, cinco evidencias: la matraca fundida, el cable puente desgastado, los tapones no originales, el lavaojos vacío y el registro del BMS. Cierra con la transición al peritaje.

### Bloque V — Integrante 5: el peritaje

**16 · Cadena causal y barreras que fallaron** · 2:00 · *Análisis de barreras*
Modelo de **"queso suizo"** con 8 barreras en perspectiva, atravesadas por un rayo rojo que marca la trayectoria del accidente. Las cuatro primeras, en violeta, son de mantenimiento. Abajo, el diagrama del banco con el **lazo de falla animado**: celda 118 → 63 → cable puente → bastidor → matraca, con ≈ 126 V, varios kA y ningún interruptor. Incluye la energía calculada con D.5.1. Mensaje: *el EPP fue la última barrera, no la primera*.

**17 · Causa raíz y jerarquía de controles** · 2:00 · *110.5(H)(3)*
**Pirámide invertida** de la jerarquía de controles (eliminación → sustitución → ingeniería → concientización → administrativos → EPP), con una medida del caso en cada nivel. El EPP va en rojo, en la base. A la derecha, las **tres causas raíz**:
- **CR1:** el mantenimiento no se trataba como barrera de seguridad (110.5(C)).
- **CR2:** el plan de mantenimiento de baterías estaba incompleto (240.1, 240.2, 320.3(D)).
- **CR3:** no había procedimiento ni competencia específicos para baterías (320.3(A)(2), 110.6, 110.7).

**18 · Pregunta de control** · 2:00 · *Pregunta de control*
Slide interactiva: *"En el Caso 4, ¿cuál medida habría evitado el arco con mayor confiabilidad?"*. Cuatro opciones (A–D) y un reloj de 30 s que se activa con **T** o con un clic. Al avanzar o elegir una opción se revela la **respuesta B**: detector de falla a tierra operativo y verificación de tensión polo–bastidor. La explicación indica que B elimina el lazo de falla y está en los niveles altos de la jerarquía, mientras que el EPP está en el último.

**19 · Conclusiones** · 0:30 · *Módulo D*
Tres ideas para llevarse, en letra grande: el mantenimiento controla el tiempo y el tiempo la energía; una batería nunca está desenergizada; importa qué barreras fallaron, no quién se equivocó. Termina con **"¿Preguntas?"** y abre el turno de 10 min.

### Slides de respaldo (solo si preguntan)

| Slide | Contenido |
| --- | --- |
| **R1 · Cálculo Anexo D.5.1** | Fórmulas del método de máxima potencia y una tabla con la reconstrucción del evento (≈ 2,3 y 7,7 cal/cm²) y la planificación a 250, 281 y 291 V (≈ 10–12 cal/cm²) |
| **R2 · Tabla 130.7(C)(15)(b)** | La tabla de EPP para CC completa, con las dos filas de la ambigüedad 250 V / 281 V resaltadas |
| **R3 · Hidrógeno por Faraday** | Orden de magnitud: ≈ 0,46 L de H₂ por A·h por celda; sin ventilación, la sala de 72 m³ llega al 1 % en ≈ 12 h (supuesto de 1 A) |
| **R4 · Cinco porqués** | Las tres líneas causales (A: arco, B: explosión, C: exposición) que llevan a CR1, CR2 y CR3 |
| **R5 · Referencias** | NFPA 70E-2021, NFPA 70B, IEEE 1584, 450, 1635 y 1657, IEC TS 60479-1, NFPA 1, normas ASTM y DOE |

## 5. Pendientes para las próximas sesiones

- Reemplazar "Integrante 1…5" por los nombres reales en la portada.
- Descargar las fuentes dentro del proyecto para que la presentación funcione sin internet.
- Ajustar las etiquetas del "queso suizo" (slide 16), que ocupan dos o tres líneas, y la frase final de la slide 18.
- Opcional: agregar una imagen propia (de Skirk o de una sala de baterías) con permiso de uso.
- Verificar los numerales contra el texto oficial en inglés de NFPA 70E, porque el PDF entregado es una traducción automática.
