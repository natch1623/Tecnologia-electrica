# Taller NFPA 70E — Módulo D: Mantenimiento (Cap. 2) y Baterías (Art. 320) + Peritajes técnicos

Sep 26, 2026 · @BRYAN RODRIGUEZ

## 1. Resumen ejecutivo

El Módulo D demuestra una idea central: **en NFPA 70E el mantenimiento no es una actividad de conservación del activo, sino una barrera de seguridad para las personas**. Un equipo mal mantenido cambia su comportamiento ante una falla, alarga el tiempo de despeje, aumenta la energía liberada y deja sin validez la evaluación de riesgo con la que se eligió el EPP.

El trabajo se organiza en tres bloques:

1. **Capítulo 2 (Arts. 200–250):** el mantenimiento se define como la preservación o restauración de la condición del equipo *para la seguridad de los empleados* (200.1). Se enfatizan 205.3, 205.4, 210.5 y su Nota Informativa (mantenimiento inadecuado → mayor tiempo de apertura → mayor energía incidente), 225.x, 240.x (baterías, ventilación, lavaojos) y 250.x (EPP y herramientas).
2. **Capítulo 3, Artículo 320:** umbrales de 100 V CC (320.3(A)(1)), evaluación de riesgos obligatoria antes de cualquier trabajo en baterías (320.3(A)(2)), control de acceso, señalización, electrolito, herramientas aisladas, apagallamas y ventilación de celdas (320.3(D)).
3. **Caso 4 como peritaje técnico:** accidente hipotético en un banco de 250 V CC de un centro de datos. La cadena causal reconstruida es: falla a tierra preexistente no detectada (alarma inhibida) + herramienta no aislada + cubiertas retiradas → arco CC sin dispositivo que lo despeje → ignición de hidrógeno en una celda con apagallamas faltante → proyección de electrolito. Las causas raíz son fallas del programa de seguridad eléctrica (110.5(C), 110.5(H), 110.5(I)) y del mantenimiento del Capítulo 2 (240.1, 240.2, 250.1) y del Art. 320 (320.3(A)(5), 320.3(D)).

Como producto adicional se incluye (Anexo) un **peritaje del caso dictado en la reunión del 21 de septiembre** (tablero de 480 V en una empresa manufacturera), que no forma parte del taller.

**Convención de etiquetas usada en todo el documento:**

| Etiqueta | Significado |
| --- | --- |
| **\[NFPA 70E\]** | Requisito o texto de la norma (edición 2021, documento adjunto). |
| **\[Fuente externa\]** | Otra norma, organismo o publicación técnica. |
| **\[Supuesto del caso\]** | Dato creado para construir el escenario hipotético. |
| **\[Análisis\]** | Interpretación técnica del grupo a partir de los datos disponibles. |

**Advertencia de edición.** El taller menciona "NFPA 70E 2020"; esa edición no existe. El documento entregado es la **edición 2021** (ediciones vigentes: 2018, 2021 y 2024). Además, el PDF es una traducción automática ("Machine Translated by Google"): traduce *arc flash* como "ceniza de arco". En la exposición usar **"relámpago de arco" o "arco eléctrico"**, y verificar los numerales en el texto oficial en inglés antes de citarlos en la defensa. **\[Análisis\]**

**Nota sobre el trabajo escrito.** El taller admite hasta 35 % de plagio o uso de IA, verificado manualmente. Este documento es material de preparación: el grupo debe redactar el trabajo final con sus propias palabras y con los datos que decida mantener.

## 2. Interpretación de las instrucciones del taller

El taller pide **enseñar** (Learning by Teaching), no leer la norma: el grupo actúa como facilitador y debe dejar a la audiencia capaz de aplicar el Módulo D a un caso.

### 2.1 Qué solicita el taller (literal)

| Requisito del taller | Dónde se cumple en este documento |
| --- | --- |
| 30 min de exposición + 10 min de preguntas y discusión | Secciones 10 y 11 (tiempos por diapositiva e integrante) |
| Explicación teórica del artículo asignado y sus requisitos técnicos | Sección 4 (4A y 4B) |
| Un caso práctico o escenario de aplicación real en la industria | Caso 4 (Sección 5) + ejemplos industriales en 4A y 4B |
| Una pregunta de control o ejercicio de análisis para la audiencia | Sección 12 |
| Trabajo escrito (máx. 35 % de plagio/IA) | Todo el documento, a reescribir por el grupo |

### 2.2 Qué corresponde al Módulo D

El taller asigna dos puntos clave, y ambos son el eje de la exposición:

1. **Mantenimiento y seguridad (Arts. 200–250):** "impacto del mantenimiento deficiente en los tiempos de disparo de los interruptores y en la energía incidente del relámpago de arco".
2. **Requisitos de seguridad para baterías (Art. 320):** "peligros específicos de electrolito, hidrógeno, arcos en CC y choque eléctrico en bancos de baterías de alta tensión".

**\[Análisis\]** El taller dice "alta tensión" para las baterías; en términos de NFPA 70E, un banco de 250 V CC es de **baja tensión** (menos de 1000 V). Lo relevante es que supera el umbral de 100 V CC de 320.3(A)(1). Conviene aclararlo si surge la pregunta, sin corregir públicamente al docente.

### 2.3 Qué exige el Caso 4

Escenario literal: "Mantenimiento en un banco de baterías de respaldo de 250 V CC de un centro de datos". Desafío literal: **explicar los peligros específicos de corriente continua según el Artículo 320 y las medidas de control requeridas para evitar choque y explosión por gas hidrógeno.**

Por tanto, el mínimo evaluable es: (a) peligros de CC (choque y arco), (b) peligros de hidrógeno y electrolito, (c) medidas de control para choque y (d) medidas de control para explosión. El formato de peritaje es un valor agregado solicitado por el grupo; **no debe desplazar esos cuatro puntos**, que deben quedar explícitos en una diapositiva.

### 2.4 Qué exige la rúbrica y cómo se ataca

| Criterio (peso) | Descriptor de excelencia | Estrategia del grupo |
| --- | --- | --- |
| Dominio técnico de la norma (30 %) | Entendimiento profundo sin lectura literal | Cada integrante cita numerales y explica el *porqué*; diapositivas con palabras clave, no texto |
| Resolución del caso práctico (30 %) | Aplica los pasos de la norma; identifica fronteras, EPP o procedimientos sin errores | Caso 4 con fronteras de la Tabla 130.4(E)(b), categoría de EPP de la Tabla 130.7(C)(15)(b), EPP químico de 320.3(B) y controles de 320.3(C)–(D) |
| Claridad pedagógica (20 %) | Recursos visuales claros; explica energía incidente y jerarquía de controles en lenguaje accesible | Cadena causal, línea de tiempo, análisis de barreras, jerarquía de controles |
| Respuesta a preguntas y debate (20 %) | Responde con precisión sustentando en el articulado | Banco de 20 preguntas difíciles con respuestas (Sección 13) |

### 2.5 Puntos que probablemente generen preguntas

- **Edición y numeración.** El Módulo A del taller cita 110.1 como "programa" y 110.2 como "entrenamiento" (numeración de 2018). En la edición 2021 adjunta, 110.1 es *Prioridad*, 110.5 es el *Programa de Seguridad Eléctrica* y 110.6 los *Requisitos de capacitación*. Hay que citar la numeración 2021.
- **"¿Se puede desenergizar una batería?"** No: una batería siempre tiene tensión en bornes. Solo se puede aislar de la carga o seccionar la cadena. Es la pregunta más probable.
- **250 V nominal frente a tensión real.** En flotación, un banco de 250 V nominal opera por encima de 250 V; la Tabla 130.7(C)(15)(b) tiene su corte justamente en 250 V.
- **Quién despeja un cortocircuito dentro de la cadena.** Generalmente ningún dispositivo de protección; de ahí el supuesto de 2 s de la tabla.
- **Relación Caso 3 ↔ Caso 4.** El Caso 3 (interruptor sin mantenimiento por 8 años) pertenece a otro grupo, pero usa el mismo principio del Capítulo 2; hay que conectarlo sin invadirlo.
- **Qué es requisito y qué es buena práctica.** El profesor puede preguntar si algo "lo dice la norma"; por eso se etiqueta cada afirmación.

## 3. Distribución del trabajo entre los 5 integrantes

Cada integrante tiene **6 minutos**, una parte teórica con numerales propios y una parte del Caso 4. Así ninguno queda solo con la introducción ni solo con el caso. El hilo conductor es: *mantenimiento → comportamiento del equipo → energía → baterías → accidente → causas → prevención*.

| Integrante | Tema | Artículos NFPA 70E | Parte del Caso 4 | Tiempo |
| --- | --- | --- | --- | --- |
| I1 | Capítulo 2 como sistema de seguridad: qué exige y a quién | 200.1, 205.1–205.15, 110.4(D), 110.5(C), 250.1–250.4 | Antecedentes e historial de mantenimiento del banco | 6 min |
| I2 | Mantenimiento, tiempo de despeje y energía incidente | 205.4, 210.3, 210.5 (NI), 225.1–225.3, 130.5(B), 130.5(G), 130.5(H) | Cadena causal y cálculo de energía incidente del caso | 6 min |
| I3 | Art. 320 (I): peligros eléctricos en CC — choque y arco | 320.1–320.3(A), Tablas 130.4(E)(b), 130.5(C), 130.7(C)(15)(b), Anexo D.5 | Descripción de la instalación y peligros eléctricos | 6 min |
| I4 | Art. 320 (II): electrolito, hidrógeno, ventilación y herramientas | 320.3(B), 320.3(C), 320.3(D), 320.3(A)(3)–(6), 240.1, 240.2 | Secuencia de hechos, evidencias y mecanismo de ignición | 6 min |
| I5 | Peritaje: causa raíz, controles y conclusiones | 110.5(H)(1)–(3), 110.5(I), 110.5(J), 110.6, 110.7, 130.2 | Causa raíz, recomendaciones, pregunta de control y cierre | 6 min |

### Detalle por integrante

**Integrante 1 — "El mantenimiento es un requisito de seguridad"**

- **Subtemas:** alcance del Capítulo 2 (200.1); persona calificada para mantenimiento (205.1); diagrama unifilar actualizado (205.2); mantenimiento según fabricante o normas de consenso (205.3); cubiertas, enclavamientos, espacios, rótulos (205.7–205.12); mantenimiento de EPP y herramientas (250.1–250.4); "condición normal de operación" (110.4(D)) y "condición de mantenimiento" en el programa (110.5(C)).
- **Conceptos a explicar:** diferencia entre mantenimiento para confiabilidad y mantenimiento para seguridad; por qué el Capítulo 2 no prescribe métodos (200.1(2)) y remite a NFPA 70B, ANSI/NETA MTS e IEEE 3007.2.
- **Ejemplo industrial:** una planta que abre un tablero de 480 V para medir; la tabla de EPP supone "equipo mantenido adecuadamente": si no lo está, el supuesto se cae.
- **Visuales:** mapa de la norma (Cap. 1–2–3); tabla "equipo → artículo → qué se mantiene".
- **Caso 4:** presenta el historial de mantenimiento del banco (alarmas inhibidas, ventilador fuera de servicio, calibraciones vencidas).
- **Transición a I2:** "Si el equipo no está en la condición que la norma supone, ¿qué cambia físicamente cuando ocurre una falla? Eso lo explica mi compañero."

**Integrante 2 — "Tiempo de despeje: la variable que el mantenimiento controla"**

- **Subtemas:** 205.4 (dispositivos de sobrecorriente mantenidos y documentados); 210.5 y su Nota Informativa; 225.1–225.3 (fusibles, interruptores de caja moldeada, prueba después de fallas); 130.5(B)(1)–(2) y 130.5(G) (el análisis de energía incidente debe considerar el tiempo de despeje *incluyendo su condición de mantenimiento*); revisión ≤ 5 años (130.5(G) y 130.5(H)).
- **Conceptos:** energía incidente (cal/cm²); proporcionalidad aproximada entre energía y duración del arco; frontera de relámpago de arco (1,2 cal/cm², 130.5(E)(1)).
- **Ejemplo industrial:** interruptor de caja moldeada con grasa endurecida que no dispara en instantáneo; la falla la despeja el interruptor aguas arriba con retardo de tiempo corto (20–30 ciclos, Nota Informativa n.º 1 de la Tabla 130.7(C)(15)(a)).
- **Visuales:** cadena causal de 7 eslabones; gráfico de barras "energía vs. tiempo de despeje".
- **Caso 4:** calcula la energía incidente del evento con el Anexo D.5.1 y muestra que dentro de la cadena no hay interruptor que despeje la falla.
- **Transición a I3:** "En corriente alterna el interruptor es el protagonista. En un banco de baterías, a veces no hay ninguno. Entremos al Artículo 320."

**Integrante 3 — "Corriente continua: choque y arco"**

- **Subtemas:** alcance del Art. 320 (baterías estacionarias > 50 V); definiciones (320.2: batería, celda, celda piloto, VRLA, celda ventilada, corriente de cortocircuito prospectiva); umbrales 50 V/5 mA CA y 100 V CC (320.3(A)(1)); evaluación de riesgos obligatoria (320.3(A)(2)); fronteras de choque en CC (Tabla 130.4(E)(b)); probabilidad de arco en tareas con baterías (Tabla 130.5(C)); categoría de EPP para CC (Tabla 130.7(C)(15)(b)); método de máxima potencia (Anexo D.5.1).
- **Conceptos:** ausencia de cruce por cero en CC; arco sostenido; la batería no se "apaga"; corriente de cortocircuito limitada por la resistencia interna.
- **Ejemplo industrial:** UPS de centro de datos, banco de 125 celdas de plomo-ácido; subestación eléctrica con banco de 125 V o 250 V CC para control.
- **Visuales:** comparación de formas de onda CA/CC; arquitectura del banco (celdas, conectores, puentes entre niveles, gabinete de desconexión).
- **Caso 4:** describe la instalación y los peligros eléctricos del banco.
- **Transición a I4:** "La batería no solo es un peligro eléctrico: también es un reactor químico que produce hidrógeno."

**Integrante 4 — "Electrolito e hidrógeno"**

- **Subtemas:** EPP para manejo de electrolito y lavaojos (320.3(B)); herramientas con mangos aislados, contacto accidental y herramientas antichispa (320.3(C)); apagallamas y ventilación de celdas (320.3(D)); acceso, iluminación, prendas conductoras, alarmas anuales y letreros (320.3(A)(3)–(6)); ventilación y lavaojos como mantenimiento (240.1, 240.2).
- **Conceptos:** generación de H₂ en sobrecarga e igualación; límite inferior de inflamabilidad; energía mínima de ignición; por qué el apagallamas evita que una chispa externa encienda la mezcla dentro de la celda.
- **Ejemplo industrial:** sala de baterías con extractor fuera de servicio tras una carga de igualación.
- **Visuales:** corte de una celda ventilada con el apagallamas; diagrama del triángulo del fuego aplicado al H₂; línea de tiempo del accidente.
- **Caso 4:** narra la secuencia de hechos y las evidencias.
- **Transición a I5:** "Ya sabemos qué pasó. Ahora, como peritos, respondemos por qué pasó y qué barreras fallaron."

**Integrante 5 — "El peritaje: por qué pasó y cómo se evita"**

- **Subtemas:** procedimiento de evaluación de riesgos (110.5(H)(1)); error humano (110.5(H)(2)); jerarquía de controles (110.5(H)(3)); plan de trabajo e informe previo (110.5(I)); investigación de incidentes (110.5(J)); capacitación (110.6); contratistas (110.7); permiso de trabajo energizado (130.2).
- **Conceptos:** peligro vs. riesgo; causa inmediata vs. causa básica vs. causa raíz; análisis de barreras; modelo de causalidad de pérdidas.
- **Ejemplo industrial:** gestión de alarmas inhibidas sin control de cambios.
- **Visuales:** análisis de barreras ("queso suizo"); jerarquía de controles aplicada al caso; tabla de recomendaciones.
- **Caso 4:** causa raíz, recomendaciones, conclusiones y pregunta de control.

**Preguntas (10 min):** I5 modera y asigna. Normas por tema: I1–I2 responden mantenimiento y energía; I3 CC y tablas; I4 químico e hidrógeno; I5 causa raíz y programa.

## 4A. Mantenimiento y seguridad (Capítulo 2, Arts. 200–250)

La tesis de esta sección es que **toda evaluación de riesgo eléctrico supone un equipo en buen estado; el Capítulo 2 es lo que hace verdadero ese supuesto.**

### 4A.1 Qué es "mantenimiento" para NFPA 70E

- **\[NFPA 70E\] 200.1(1):** el Capítulo 2 cubre los requisitos prácticos de mantenimiento *relacionados con la seguridad*; identifica solo el mantenimiento *directamente asociado con la seguridad de los empleados*.
- **\[NFPA 70E\] 200.1(2):** no prescribe métodos ni procedimientos de prueba; deja al empleador elegir el método.
- **\[NFPA 70E\] 200.1(3):** mantenimiento es la preservación o restauración de la condición del equipo y las instalaciones *para la seguridad de los empleados que trabajan expuestos a riesgos eléctricos*.
- **\[NFPA 70E\] 205.3:** el equipo se mantiene según las instrucciones del fabricante o las normas de consenso de la industria *para reducir el riesgo asociado con fallas*; el propietario (o su representante designado) es responsable del mantenimiento **y de la documentación**. La Nota Informativa remite a NFPA 70B, ANSI/NETA MTS e IEEE 3007.2.
- **\[Fuente externa\]** Desde la edición 2023, NFPA 70B dejó de ser una práctica recomendada y pasó a ser una norma (*Standard for Electrical Equipment Maintenance*), con requisitos de programa de mantenimiento y frecuencias basadas en la condición del equipo.

**\[Análisis\]** La frase "para reducir el riesgo asociado con fallas" es la clave del módulo: la norma no pide mantener para que el equipo dure, sino para que **falle de forma predecible**.

### 4A.2 Los requisitos del Capítulo 2 organizados por barrera de seguridad

| Barrera | Artículos | Qué exige |
| --- | --- | --- |
| Competencia | 205.1 | Mantenimiento solo por personas calificadas, capacitadas en los procedimientos y pruebas específicos |
| Información | 205.2, 205.10–205.12 | Diagrama unifilar legible y actualizado; identificación de componentes, circuitos y tensiones; letreros legibles |
| Protección contra sobrecorriente | 205.4, 210.5, 225.1–225.3 | Mantener y **documentar** según fabricante o normas; soportar o interrumpir la falla disponible; probar interruptores tras fallas cercanas a su capacidad |
| Conductores y aislamiento | 205.13, 205.14, 210.3, 210.4 | Conducir la corriente nominal sin sobrecalentamiento y soportar la corriente de falla; aislamiento íntegro |
| Envolventes y resguardos | 205.7, 205.8, 210.1, 210.2, 215.1, 230.1, 230.2 | Cubiertas y puertas en su lugar con todos los sujetadores; cerraduras y enclavamientos operativos |
| Espacios y acceso | 205.5, 205.9 | Espacios de trabajo y vías de escape despejados |
| Puesta a tierra | 205.6 | Continuidad eléctrica de canalizaciones, bandejas y envolventes |
| Baterías | 240.1, 240.2 | Ventilación examinada y mantenida para evitar mezclas explosivas, **incluida la prueba funcional** de detección y alarma; lavaojos operativo |
| EPP y herramientas | 250.1–250.4 | EPP y herramientas en condición segura; inspección visual antes del primer uso y a intervalos ≤ 1 año; prueba del aislamiento ≤ 3 años; instrumentos de prueba con verificación funcional |

### 4A.3 Mantenimiento dentro del programa de seguridad eléctrica (Capítulo 1)

El Capítulo 2 no funciona solo; el Capítulo 1 lo convierte en condición de trabajo:

- **\[NFPA 70E\] 110.5(C):** el programa de seguridad eléctrica debe incluir elementos que consideren **la condición de mantenimiento** de los equipos.
- **\[NFPA 70E\] 110.4(D):** existe "condición normal de operación" solo si el equipo está correctamente instalado, **adecuadamente mantenido**, usado según instrucciones, con puertas cerradas y cubiertas aseguradas, y **sin evidencia de falla inminente** (arco, sobrecalentamiento, partes sueltas, daño o deterioro).
- **\[NFPA 70E\] 130.4(B) y 130.5(B):** la estimación de probabilidad y severidad del choque y del arco debe considerar el diseño del equipo, su dispositivo de protección y **su condición de mantenimiento**.
- **\[NFPA 70E\] 130.5(G):** el análisis de energía incidente debe considerar las características del dispositivo de sobrecorriente y su tiempo de despeje, **incluida su condición de mantenimiento**; se actualiza cuando hay cambios y se revisa a intervalos ≤ 5 años.

### 4A.4 Efecto del deterioro sobre el tiempo de disparo

**\[NFPA 70E\] Nota Informativa de 210.5:** *el mantenimiento incorrecto o inadecuado puede resultar en un mayor tiempo de apertura del dispositivo de protección contra sobrecorriente, aumentando así la energía incidente.* Esta es la frase literal que sostiene el primer punto del Módulo D.

| Modo de deterioro | Efecto sobre el dispositivo | Efecto sobre el despeje | Requisito relacionado |
| --- | --- | --- | --- |
| Lubricante endurecido, polvo o corrosión en el mecanismo | El mecanismo se traba o abre más lento | Retardo o no apertura; despeja el dispositivo aguas arriba | 205.3, 205.4 |
| Deriva de calibración térmica o magnética | El umbral de disparo sube | La corriente de arco (menor que la franca) cae en la zona de tiempo largo | 205.4, 210.5 |
| Unidad de disparo o transformadores de corriente dañados | Sin disparo por protección propia | Despeje por respaldo con retardo intencional | 205.4 |
| Fusible reemplazado por uno no limitador | Pierde la limitación de corriente | Despeje en varios ciclos en vez de medio ciclo | 225.1 |
| Interruptor que ya interrumpió fallas severas sin prueba | Contactos erosionados, cámara dañada | Puede no interrumpir la siguiente falla | 225.3 |
| Batería de control de una subestación deteriorada | Sin tensión suficiente para la bobina de disparo | El interruptor no abre; despeja el respaldo | 205.3; IEEE 450 **\[Fuente externa\]** |
| Conexiones flojas u oxidadas | Calentamiento localizado | Aumenta la probabilidad de iniciar la falla | 210.3, 205.13 |

**\[NFPA 70E\] Nota Informativa n.º 1 de la Tabla 130.7(C)(15)(a):** tiempos típicos de despeje: 0,5 ciclo (fusible o interruptor limitador), 1,5 ciclos (caja moldeada < 1000 V con instantáneo), 3 ciclos (caja aislada con instantáneo), 5 ciclos (interruptor de 1–35 kV con relé instantáneo), 20 a 30 ciclos (baja tensión con retardo de tiempo corto).

### 4A.5 Relación entre corriente de falla, despeje y energía incidente

**\[Fuente externa\]** En los modelos de IEEE 1584 la energía incidente es **proporcional a la duración del arco**, para una misma corriente de arco y distancia de trabajo. Lo mismo ocurre en el método de máxima potencia para CC del Anexo D.5.1 de NFPA 70E.

**\[Análisis\]** De ahí la cadena que se defenderá en la exposición:

> Estado del equipo → condición eléctrica (aislamiento, conexiones, mecanismo) → comportamiento ante la falla (dispara o no, cuándo) → tiempo de despeje → energía liberada (cal/cm²) → exposición del trabajador (distancia, EPP) → consecuencia (quemadura, lesión por explosión, muerte).

**\[Análisis\]** El mantenimiento influye poco en la corriente de falla *disponible*, que depende de la fuente y de la impedancia del sistema. Influye mucho en la **probabilidad** de que la falla se inicie y en el **tiempo** que dura. Una paradoja útil para la defensa: una corriente de arco *menor* puede producir *más* energía si cae por debajo del umbral instantáneo y el interruptor la despeja en su zona de tiempo largo.

**Ejemplo ilustrativo \[Supuesto del caso\]:** un tablero de 480 V tiene 1,6 cal/cm² a 455 mm cuando el interruptor principal despeja en 0,05 s (3 ciclos). Si el mecanismo está trabado y la falla la despeja el respaldo en 0,5 s (30 ciclos), la energía se acerca a **16 cal/cm²** (10 veces más) con la misma corriente. **\[Análisis\]** Un trabajador vestido para 8 cal/cm² (categoría 2) quedaría subprotegido sin que ninguna etiqueta lo advierta.

### 4A.6 Consecuencias de usar equipos sin el mantenimiento requerido

1. **Se invalida la condición normal de operación (110.4(D)).** Las estimaciones "No" de la Tabla 130.5(C) (por ejemplo, operar un interruptor con puertas cerradas) dejan de aplicar.
2. **Se invalidan las tablas de EPP.** La Tabla 130.7(C)(15)(a) y la (b) solo valen dentro de parámetros máximos de corriente y tiempo de despeje; fuera de ellos se requiere análisis de energía incidente (130.7(C)(15)).
3. **Las etiquetas quedan inexactas.** 130.5(H) exige actualizarlas cuando la revisión identifica un cambio; un despeje más lento es un cambio.
4. **El interruptor puede no interrumpir** la falla disponible (210.5, 225.3).
5. **Aumenta la probabilidad de iniciar la falla** por aislamiento degradado o conexiones calientes (210.3, 210.4).
6. **Fallan barreras secundarias:** enclavamientos (205.8), cubiertas (205.7), ventilación de baterías (240.1), lavaojos (240.2), EPP (250.1).

**Puente con el Caso 3 (otro grupo) \[Análisis\]:** un interruptor de caja moldeada sin mantenimiento en 8 años no tiene tiempo de despeje conocido. El análisis de energía incidente debe considerar la condición de mantenimiento (130.5(G)) y la tabla supone un despeje máximo; ninguno de los dos métodos es válido hasta probar el interruptor o suponer el despeje del respaldo.

### 4A.7 Relación entre el estado real del equipo y el análisis de riesgo

**\[Análisis\]** El estudio de arco se calcula con el equipo *como fue diseñado*; el trabajador se expone al equipo *como está*. La brecha se cierra con: verificación de campo de ajustes de protección, resultados de pruebas (205.4), revisión del estudio ≤ 5 años (130.5(G)), etiquetas actualizadas (130.5(H)) e inspección previa a la tarea buscando evidencia de falla inminente (110.4(D)(6)).

### 4A.8 Ejemplos industriales

- **Planta manufacturera \[Supuesto\]:** interruptor principal de 1600 A de un tablero de 480 V sin pruebas de disparo por inyección primaria en 6 años. En la prueba, el instantáneo no actúa; el estudio de arco etiquetado (categoría 2) no es válido hasta corregirlo.
- **Subestación de distribución \[Supuesto\]:** banco de 125 V CC de control con celdas sulfatadas; ante una falla en 13,8 kV la bobina de disparo no opera y la falla la despeja la protección del transformador aguas arriba, con mayor retardo.
- **Centro de datos \[Supuesto\]:** extractor de la sala de baterías con disparo térmico sin orden de trabajo; se enlaza con el Caso 4.

## 4B. Requisitos de seguridad para baterías (Capítulo 3, Artículo 320)

Un banco de baterías es **simultáneamente una fuente eléctrica que no se puede apagar y un reactor químico que genera gas inflamable**. El Art. 320 exige tratar ambos peligros juntos en la misma evaluación de riesgos.

### 4B.1 Ubicación del Art. 320 en la norma

- **\[NFPA 70E\] 300.x:** el Capítulo 3 complementa, no reemplaza, los Capítulos 1 y 2. Art. 310 celdas electrolíticas, **320 baterías y salas de baterías**, 330 láseres, 340 electrónica de potencia, 350 laboratorios de I+D, 360 condensadores.
- **\[NFPA 70E\] 320.1 Alcance:** requisitos para la protección de empleados que trabajan con **baterías estacionarias expuestas que superan 50 V nominales**.
- **\[NFPA 70E\] 320.2 Definiciones clave:** *batería* (dos o más celdas en serie o paralelo), *celda*, *celda piloto*, *electrolito*, *tensión nominal*, *celda ventilada o inundada*, *celda VRLA*, *sala de baterías*, *personal autorizado* y **corriente de cortocircuito prospectiva** (la mayor corriente de falla teórica con impedancia cero y protecciones que no operan).
- **\[NFPA 70E\] Nota Informativa de 320.1:** remite a NFPA 1 (cap. 52), NFPA 70 (art. 480), IEEE 450, 937, 1106, 1184, 1188, 1657, IEEE/ASHRAE 1635 y OSHA 1910.305(j)(7) y 1926.441.

### 4B.2 Requisitos de 320.3 (resumen verificado)

| Numeral | Requisito |
| --- | --- |
| 320.3(A)(1) | Umbrales de exposición: **CA 50 V y 5 mA; CC 100 V**, salvo que se implementen controles apropiados |
| 320.3(A)(2) | **Evaluación de riesgos antes de cualquier trabajo** en un sistema de baterías: peligros químicos, de choque y de arco, según la tarea (Nota Inf.: Anexo F.7 y Figura F.7) |
| 320.3(A)(3)(a) | Solo personal autorizado accede a la sala o recinto de baterías |
| 320.3(A)(3)(b) | No ingresar sin iluminación que permita trabajar con seguridad |
| 320.3(A)(4) | No usar objetos conductores (joyas) al trabajar en el sistema de baterías |
| 320.3(A)(5) | La instrumentación de alarmas por condición anormal (si existe) **se prueba anualmente** |
| 320.3(A)(6) | Letreros: peligro eléctrico (choque por tensión de batería, arco por corriente de cortocircuito prospectiva, peligro térmico); peligro químico (gas explosivo, prohibición de llama y de fumar, quemadura química por electrolito); aviso de EPP; prohibición de acceso no autorizado |
| 320.3(B)(1) | Si se maneja electrolito líquido: gafas y protector facial apropiados para el peligro eléctrico **y** químico; guantes y delantal para el químico; lavaojos portátil o fijo **dentro del área de trabajo** |
| 320.3(B)(2) | Actividades sin manejo de electrolito: gafas de seguridad. Leer densidad con hidrómetro de bulbo puede considerarse manejo de electrolito |
| 320.3(C)(1) | Herramientas con mangos **listados como aislados para la tensión máxima de trabajo** |
| 320.3(C)(2) | Mantener terminales y conductores libres de contacto no intencional con herramientas, equipos de prueba, envases de líquidos y objetos extraños |
| 320.3(C)(3) | Herramientas antichispa cuando la evaluación de riesgos (110.5(H)) lo justifique |
| 320.3(D) | Aberturas de ventilación de las celdas sin obstrucción; **apagallamas** inspeccionados (instalación correcta, sin obstrucción) y reemplazados según el fabricante |
| 240.1 (Cap. 2) | Ventilación natural o forzada examinada y mantenida para evitar mezclas explosivas, con **prueba funcional de detección y alarma** |
| 240.2 (Cap. 2) | Lavaojos y duchas de cuerpo en condición de funcionamiento |

### 4B.3 Choque eléctrico en corriente continua

- **\[NFPA 70E\]** Umbral de 100 V CC en baterías (320.3(A)(1)). En la Tabla 130.4(E)(b), para **50 V–300 V CC**: frontera de aproximación limitada de 3,0 m (conductor móvil) y 1,0 m (parte fija expuesta); frontera restringida: **"evitar el contacto"**.
- **\[Fuente externa\]** IEC TS 60479-1 indica que, para una misma magnitud, la CC es fisiológicamente menos propensa a producir fibrilación ventricular que la CA de 50/60 Hz, y que la sensación de "no poder soltar" es menos marcada. Los efectos más severos suelen darse al cerrar o abrir el circuito, y el paso prolongado de corriente produce efectos electrolíticos en tejido.
- **\[Análisis\]** Eso no hace segura la CC: a 250–290 V y con piel húmeda, la corriente de contacto puede llegar a cientos de miliamperios. Además, el choque suele ser el disparador de un segundo peligro: el sobresalto hace caer la herramienta sobre los bornes.
- **\[Análisis\]** Muchos sistemas de UPS operan con el bus de CC **no puesto a tierra**. Tocar un solo polo parece inofensivo, *salvo que ya exista una falla a tierra en otro punto de la cadena*. Por eso verificar el estado del detector de falla a tierra es parte del trabajo seguro.

### 4B.4 Arco eléctrico en corriente continua

**Por qué es distinto \[Fuente externa/Análisis\]:**

1. **No hay cruce por cero.** En CA la corriente pasa por cero 120 veces por segundo (60 Hz) y el arco tiende a extinguirse y reencenderse; en CC el arco puede mantenerse mientras la tensión supere la tensión de arco y el hueco no crezca demasiado.
2. **Casi nunca hay dispositivo que lo despeje.** Un cortocircuito entre celdas de la misma cadena no pasa por el interruptor del gabinete: la corriente solo la limita la resistencia interna de las celdas y los conectores.
3. **La fuente no se desconecta.** Aunque se abra el interruptor de CC, las celdas siguen energizadas.
4. **Los dispositivos de maniobra deben tener capacidad nominal en CC.** Un interruptor calificado solo para CA puede no interrumpir un arco de CC.

**Lo que dice la norma:**

- **\[NFPA 70E\] Tabla 130.5(C)**, probabilidad de arco en baterías:
  - "Sí" (cualquier condición): trabajar en conductores energizados de **celdas conectadas en serie**, incluidas pruebas eléctricas; retirar cubiertas atornilladas como **cubiertas de terminales**; insertar o retirar cubiertas de conectores entre celdas; trabajar en equipos alimentados directamente por la fuente de CC.
  - "Sí" (condición anormal): mantenimiento y pruebas en celdas individuales en bastidor abierto; insertar o retirar celdas.
  - "No" (condición normal): prueba de tensión en celdas individuales; retiro de cubiertas **no conductoras** de conectores entre celdas.
  - "No" (cualquier condición): mantenimiento en **una sola celda** o unidades multicelda en bastidor abierto.
- **\[NFPA 70E\] Tabla 130.7(C)(15)(b)**, baterías y otras fuentes de CC (arco máximo de 2 s, distancia de trabajo mínima 455 mm):

| Tensión | Corriente de falla disponible | Categoría EPP | Frontera de arco |
| --- | --- | --- | --- |
| ≥ 100 V y ≤ 250 V | < 4 kA | 2 | 900 mm |
| ≥ 100 V y ≤ 250 V | ≥ 4 kA y < 7 kA | 2 | 1,2 m |
| ≥ 100 V y ≤ 250 V | ≥ 7 kA y < 15 kA | 3 | 1,8 m |
| > 250 V y ≤ 600 V | < 1,5 kA | 2 | 900 mm |
| > 250 V y ≤ 600 V | ≥ 1,5 kA y < 3 kA | 2 | 1,2 m |
| > 250 V y ≤ 600 V | ≥ 3 kA y < 7 kA | 3 | 1,8 m |
| > 250 V y ≤ 600 V | ≥ 7 kA y < 10 kA | 4 | 2,5 m |

Notas de la tabla **\[NFPA 70E\]**: la ropa expuesta a electrolito debe estar evaluada para protección contra electrolito (ASTM F1296) y tener clasificación de arco (ASTM F1891); se asumen **2 s de arco** si no hay dispositivo de sobrecorriente o no se conoce el despeje; la corriente de cortocircuito de la celda debe obtenerse del fabricante; los valores son al aire libre, y dentro de un recinto conviene protección adicional. Fuera de los parámetros se requiere análisis de energía incidente (130.7(C)(15)).

- **\[NFPA 70E\] Anexo D.5.1, método de máxima potencia** (sistemas de CC hasta 1000 V, conservador):

```latex
I_{arc} = 0.5 \cdot I_{bf} \qquad IE_m = 0.01 \cdot V_{sys} \cdot I_{arc} \cdot \frac{T_{arc}}{D^{2}}
```

donde IE\_m es la energía incidente (cal/cm²), V\_sys la tensión del sistema (V), I\_bf la corriente de falla franca (A), T\_arc el tiempo de arco (s) y D la distancia de trabajo (cm). **\[NFPA 70E\] D.5.3:** un enfoque conservador estima la corriente de cortocircuito de la batería como **10 veces la capacidad de 1 minuto** (a 1,75 V por celda, 25 °C, densidad 1,215); el fabricante puede dar un valor más preciso.

### 4B.5 Electrolito

- **\[Fuente externa\]** Plomo-ácido: solución diluida de ácido sulfúrico (corrosiva). Níquel-cadmio: hidróxido de potasio (alcalino, especialmente dañino para los ojos). Ion-litio: electrolito orgánico inflamable, con riesgo de fuga térmica y gases tóxicos.
- **\[NFPA 70E\] 320.3(B):** EPP químico y lavaojos cuando se maneja electrolito líquido. La Nota Informativa aclara que VRLA y baterías selladas presentan poco o ningún riesgo de electrolito en mantenimiento normal.
- **\[Análisis\]** El electrolito también es un **peligro eléctrico indirecto**: las fugas y la humedad ácida sobre bastidores y tapas crean caminos de fuga y corrosión que pueden terminar en una falla a tierra.

### 4B.6 Hidrógeno: generación, acumulación, ventilación e ignición

- **\[Fuente externa\]** En plomo-ácido, la sobrecarga electroliza el agua: se libera H₂ en la placa negativa y O₂ en la positiva. La generación aumenta con la **carga de igualación**, la temperatura y las celdas defectuosas. En VRLA la recombinación reduce el gas, pero una **fuga térmica** puede liberarlo.
- **\[Fuente externa\]** H₂: límite inferior de inflamabilidad ≈ 4 % en volumen en aire; energía mínima de ignición del orden de 0,02 mJ (muy por debajo de una chispa de herramienta); más liviano que el aire, se acumula en techos y bolsillos. Los códigos de incendio (NFPA 1 cap. 52; IEEE/ASHRAE 1635 como guía) limitan la concentración tradicionalmente a **1 % en volumen (≈ 25 % del LII)** mediante ventilación. Verificar la edición aplicable.
- **\[Análisis\] Orden de magnitud por ley de Faraday:** cada amperio-hora de corriente de gasificación produce por celda n = 3600/(2 × 96 485) ≈ 0,0187 mol de H₂ ≈ **0,46 L a 25 °C**. Con 125 celdas y 1 A de gasificación sostenida se generan ≈ 57 L/h. En una sala de 72 m³ sin ventilación, el 1 % (720 L) se alcanzaría en ≈ 12–13 h. **La corriente de 1 A es un supuesto ilustrativo**; el valor real depende de la tecnología, la temperatura y el régimen de carga.
- **Fuentes de ignición:** arco por herramienta o por conectar o desconectar bajo carga, descarga electrostática, llama abierta, cigarrillos, equipos no aptos, superficies calientes. **\[NFPA 70E\] 320.3(A)(6)** exige el letrero de prohibición de llama y de fumar.
- **Apagallamas \[NFPA 70E\] 320.3(D):** el tapón con apagallamas deja salir el gas y **evita que una llama externa se propague al interior de la celda**, donde hay mezcla H₂/O₂. Si falta o está obstruido, una chispa en la superficie puede producir explosión interna y rotura del recipiente.
- **Ventilación \[NFPA 70E\] 240.1:** mantener el sistema y **probar funcionalmente** la detección y alarma asociadas.

### 4B.7 EPP y medidas de control por peligro

| Peligro | Eliminación / sustitución | Ingeniería | Concientización | Administrativo | EPP |
| --- | --- | --- | --- | --- | --- |
| Choque CC | Seccionar la cadena en tramos < 100 V si el diseño lo permite **\[Análisis\]** | Cubiertas de terminales, mantas aislantes, herramientas aisladas (320.3(C)(1)) | Letreros (320.3(A)(6)) | Acceso autorizado (320.3(A)(3)), sin joyas (320.3(A)(4)), plan de trabajo (110.5(I)) | Guantes aislantes de caucho con protectores de cuero |
| Arco CC | Sustituir tareas en caliente por monitoreo en línea **\[Análisis\]** | Exponer un borne a la vez; barreras; detector de falla a tierra operativo (320.3(A)(5)) | Etiqueta de arco (130.5(H)) | Permiso de trabajo energizado (130.2) | Según Tabla 130.7(C)(15)(b) o análisis de energía incidente |
| Electrolito | VRLA o celdas selladas **\[Análisis\]** | Bandejas de contención | Letrero de peligro químico | Procedimiento de manejo de electrolito | Gafas + protector facial, guantes y delantal químicos (320.3(B)(1)) |
| Hidrógeno | Cargadores con compensación de temperatura **\[Fuente externa\]** | Ventilación con detección y alarma (240.1); apagallamas (320.3(D)) | "No fumar, no llama" | Medir H₂ antes de entrar; herramientas antichispa si se justifica (320.3(C)(3)) | Ropa con clasificación de arco (no es EPP contra explosión) |
| Térmico | — | Monitoreo de temperatura | Letrero de peligro térmico | Inspecciones termográficas | Guantes de cuero |

**\[Análisis\]** El EPP no protege contra la onda de presión ni las esquirlas de una explosión de celda; por eso el control del hidrógeno debe estar en los niveles superiores de la jerarquía (ingeniería y mantenimiento), no en el EPP.

### 4B.8 Procedimiento seguro de mantenimiento (marco)

1. **Planificar:** evaluación de riesgos de la batería (320.3(A)(2); Figura F.7), plan de trabajo e informe previo (110.5(I)) y permiso de trabajo energizado si la tarea cruza la frontera restringida y no está exenta (130.2(A) y 130.2(C)).
2. **Verificar la sala:** iluminación, ventilación funcionando, lectura de H₂, lavaojos operativo, letreros, acceso restringido.
3. **Verificar el sistema:** alarmas del monitor de baterías activas (no inhibidas); **medir la tensión de cada polo respecto al bastidor** para descartar una falla a tierra preexistente **\[Análisis\]**; seccionar la cadena si el diseño lo permite.
4. **Preparar al trabajador:** retirar joyas y relojes; EPP de arco y químico según la tarea; guantes aislantes probados.
5. **Ejecutar:** herramientas con mangos aislados listados; **una cubierta de conector a la vez**; mantas aislantes sobre bornes adyacentes; torque según el fabricante; no apoyar herramientas sobre las celdas.
6. **Cerrar:** reinstalar cubiertas, registrar resistencias y torques (205.3, 205.4), normalizar alarmas y documentar.

### 4B.9 Diferencias relevantes entre trabajar en CA y en CC

| Aspecto | Sistemas CA | Bancos de baterías CC |
| --- | --- | --- |
| Condición de trabajo eléctricamente segura | Se logra con desconexión, bloqueo y verificación (Art. 120) | **No se logra en los bornes**: la batería siempre tiene tensión; solo se aísla o se secciona |
| Extinción del arco | Cruce por cero ayuda | Sin cruce por cero; arco sostenido |
| Protección que despeja la falla | Normalmente existe | A menudo ninguna dentro de la cadena; la tabla asume 2 s |
| Fronteras de choque | Tabla 130.4(E)(a) | Tabla 130.4(E)(b) |
| Tabla de EPP de arco | 130.7(C)(15)(a) | 130.7(C)(15)(b) |
| Método de cálculo | IEEE 1584 | Anexo D.5 (máxima potencia; Ammerman et al.) |
| Peligros adicionales | Principalmente eléctricos | Químico (electrolito), explosivo (H₂) y térmico |
| Puesta a tierra típica | Sistemas puestos a tierra | UPS con bus de CC a menudo aislado; una sola falla a tierra puede pasar inadvertida |

## 5. Caso 4 — Peritaje técnico de un accidente en un banco de baterías de 250 V CC

**Dictamen en una línea:** el accidente fue un arco eléctrico de CC dentro de la cadena de baterías, sin dispositivo de protección capaz de despejarlo, que encendió hidrógeno en una celda con apagallamas faltante. Fue posible porque **cuatro barreras de mantenimiento ya estaban fuera de servicio** antes de que el técnico tomara la llave.

> Todo el escenario es **hipotético**. Los datos de instalación, personas, fechas, lecturas y registros son **\[Supuesto del caso\]** salvo que se indique **\[NFPA 70E\]** o **\[Fuente externa\]**. Ningún dato corresponde a una empresa real.

### 1. Identificación del caso

| Campo | Contenido |
| --- | --- |
| Expediente | PT-C4-2026-01 **\[Supuesto\]** |
| Tipo | Peritaje técnico de accidente eléctrico con lesiones (arco en CC, ignición de hidrógeno y proyección de electrolito) |
| Solicitante | Gerencia de Operaciones del Centro de Datos Alfa (ficticio) y su aseguradora **\[Supuesto\]** |
| Peritos | Equipo técnico del Módulo D (5 integrantes) |
| Fecha del evento | 14 de agosto de 2026, 02:38 h **\[Supuesto\]** |
| Lugar | Sala de Baterías B, UPS-2, Centro de Datos Alfa **\[Supuesto\]** |
| Norma de referencia | NFPA 70E, edición 2021 (documento adjunto) |
| Alcance | Determinar causas técnicas, evaluar cumplimiento de NFPA 70E y emitir recomendaciones. **No** determina responsabilidad legal ni culpa individual. |

### 2. Antecedentes

**\[Supuesto\]** El banco alimenta la UPS-2, que respalda dos salas de servidores. En la inspección trimestral anterior se detectaron tres conexiones entre celdas con resistencia más de 20 % por encima de la línea base (C-40/41, C-77/78 y C-118/119). Se abrió una orden de trabajo correctiva **para reapriete**, asignada a un contratista, y se programó una **carga de igualación** el día anterior para corregir celdas con densidad baja. La alarma de falla a tierra del monitor de baterías estaba **inhibida desde hacía 5 meses** por "falsas alarmas" y el extractor de la sala había disparado por sobrecarga térmica **19 días antes**, sin orden de trabajo.

### 3. Descripción de la instalación

**\[Supuesto\]** Sala dedicada de 6 m × 4 m × 3 m (72 m³), piso con resina antiácido, acceso con tarjeta. Ventilación mecánica por un extractor de techo con detector de H₂ en cielo raso (alarma al BMS en 1 % y 2 % en volumen). Lavaojos **portátil** tipo botella en la pared (no hay lavaojos fijo). El bus de CC de la UPS es **no puesto a tierra** y tiene detector de falla a tierra en el monitor de baterías. El gabinete de desconexión de baterías tiene un interruptor de caja moldeada bipolar de 400 A con capacidad nominal en CC de 600 V, a 6 m de los bastidores.

### 4. Descripción del banco de 250 V CC

**\[Supuesto\]** 125 celdas de plomo-ácido **ventiladas (inundadas)**, aleación plomo-calcio, 2 V nominales por celda (250 V nominales), 800 Ah (régimen de 8 h). Dos bastidores metálicos de dos niveles, puestos a tierra. La cadena recorre el nivel inferior (celdas 1–62) y regresa por el superior (celdas 63–125); el cambio de nivel lo hace un **cable puente** que baja por el borde del bastidor. Conectores entre celdas de cobre plomado, atornillados, con **cubiertas de conector** atornilladas. Cada celda tiene tapón de ventilación con apagallamas.

### 5. Características técnicas relevantes

| Parámetro | Valor | Etiqueta |
| --- | --- | --- |
| Tensión nominal | 250 V CC | \[Supuesto\] |
| Tensión de flotación | 2,25 V/celda → ≈ 281 V | \[Supuesto\] |
| Tensión de igualación | 2,33 V/celda → ≈ 291 V | \[Supuesto\] |
| Corriente de cortocircuito prospectiva en bornes | ≈ 8,5 kA (dato del fabricante, equivalente a ≈ 10 × capacidad de 1 min) | \[Supuesto\]; método de D.5.3 \[NFPA 70E\] |
| Frontera limitada / restringida de choque | 1,0 m (parte fija) / evitar contacto | \[NFPA 70E\] Tabla 130.4(E)(b) |
| Categoría EPP por tabla (100–250 V, 7–15 kA) | 3; frontera de arco 1,8 m | \[NFPA 70E\] Tabla 130.7(C)(15)(b) |
| Etiqueta de arco en la sala | No existía | \[Supuesto\] |

**\[Análisis\]** La corriente de cortocircuito de un tramo parcial de la cadena es del mismo orden que la de la cadena completa: la tensión y la resistencia interna crecen en la misma proporción con el número de celdas. Por eso un cortocircuito entre pocas decenas de celdas sigue siendo de varios kA.

### 6. Actividad de mantenimiento en curso

**\[Supuesto\]** Mantenimiento correctivo: (a) medición de resistencia de conexiones con micro-óhmetro; (b) **reapriete de tres conexiones** con llave de torque y matraca de 1/2" de acero sin aislamiento; (c) lectura de densidad de celdas piloto con **hidrómetro de bulbo**. Las tareas (a) y (b) implican trabajar dentro de la frontera restringida sobre celdas en serie; la (c) se considera manejo de electrolito (Nota Inf. de 320.3(B)(2)).

### 7. Personal involucrado

| Persona | Función | Condición relevante **\[Supuesto\]** |
| --- | --- | --- |
| T1 — técnico electricista del contratista | Ejecutor del reapriete | 12 años en baja tensión CA; primer trabajo en bancos inundados; última capacitación NFPA 70E hace 4 años |
| T2 — auxiliar técnico del contratista | Registro de lecturas y densidades | 8 meses de experiencia; sin capacitación en baterías |
| S1 — supervisor de turno del centro de datos | Autorizó el acceso | No participó en la planificación; no verificó alarmas inhibidas |
| Coordinador del contratista | Emitió la orden de trabajo | Ausente; orden genérica "reapriete de conexiones" |

### 8. Condiciones de trabajo existentes

**\[Supuesto\]** Turno nocturno, ventana de mantenimiento de 01:30 a 04:00 h. Iluminación adecuada. Extractor **detenido**. Detector de H₂ con calibración vencida hace 26 meses. Carga de igualación terminada 20 h antes. T1 con camisa de algodón de manga larga, gafas de seguridad, guantes de nitrilo, **anillo y reloj metálico**; sin guantes aislantes, sin protector facial ni ropa con clasificación de arco. T2 sin delantal ni protector facial. No hubo evaluación de riesgos de la batería, plan de trabajo escrito ni permiso de trabajo energizado.

### 9. Secuencia cronológica de los hechos

| Hora | Hecho | Fuente de evidencia |
| --- | --- | --- |
| 01:30 | S1 autoriza el acceso con la orden de trabajo genérica | Registro de acceso |
| 01:45 | Conversación verbal entre T1 y T2; no se completa plan ni informe previo | Entrevistas |
| 01:55 | T1 retira **todas** las cubiertas de conectores del nivel superior (celdas 63–125) "para agilizar" | CCTV, cubiertas en el piso |
| 02:10 | Medición de resistencia; T2 registra | Hoja de campo |
| 02:25 | T2 toma densidades con hidrómetro de bulbo | Hoja de campo |
| 02:38:14 | T1 reaprieta C-118/119, junto al larguero del bastidor; la cabeza de la matraca toca el larguero mientras el dado está en el borne positivo de la celda 118 | CCTV |
| 02:38:14–15 | Destello, arco sostenido ≈ 0,9 s, sonido de detonación en la celda 119; salpicadura de electrolito | CCTV (fotogramas) |
| 02:39 | T1 retrocede; T2 busca el lavaojos: la botella está **vacía** | Entrevistas; botella |
| 02:40 | T2 lleva a T1 al lavamanos a 15 m (≈ 1 min de retraso) | CCTV |
| 02:41 | UPS registra "falla de batería"; la alarma de falla a tierra no se anuncia (inhibida) | Registro del BMS |
| 02:50–03:10 | Atención de emergencia y traslado | Registro de seguridad |

### 10. Descripción técnica del accidente

**\[Análisis\]** El cable puente entre niveles (celdas 62/63) tenía el aislamiento desgastado contra el borde del bastidor y estaba **en contacto sólido con el bastidor puesto a tierra**: una falla a tierra franca preexistente. Al tocar la matraca simultáneamente el borne positivo de la celda 118 y el larguero, se cerró un lazo: celda 118 → celdas 117…63 → cable puente → bastidor → matraca. Tensión del lazo ≈ 56 celdas × 2,25 V ≈ **126 V CC**, con corriente de varios kA limitada solo por la resistencia interna y los contactos. **Ningún dispositivo de sobrecorriente estaba en ese lazo**: el interruptor de 400 A está fuera de la cadena. El arco se mantuvo ≈ 0,9 s hasta que la matraca fue expulsada y el hueco se alargó.

El plasma y las partículas incandescentes alcanzaron el tapón de la celda 119, que **no tenía apagallamas original** (reemplazado por un tapón genérico). La mezcla H₂/O₂ del espacio superior de la celda, enriquecida por la igualación reciente y la falta de extracción, se encendió: la tapa se fracturó y proyectó electrolito.

**Consecuencias \[Supuesto\]:** T1 con quemaduras de segundo grado en mano y antebrazo derechos (agravadas bajo el anillo) y en parte del rostro; irritación química ocular bilateral. T2 con salpicadura química leve en antebrazo. Daños: celda 119 rota, dos conectores fundidos, larguero con picaduras. Sin incendio propagado.

### 11. Evidencias disponibles

**\[Supuesto\]** Todas bajo cadena de custodia:

1. Video de CCTV con marca de tiempo (duración del arco por conteo de fotogramas).
2. Registros del BMS y del monitor de baterías: alarma de falla a tierra inhibida desde marzo; disparo del extractor 19 días antes; última lectura de H₂ 0,4 % (sensor sin calibración vigente).
3. Matraca con marcas de fusión en la cabeza; dado con cráteres.
4. Larguero del bastidor y borne positivo de la celda 118 con picaduras por arco.
5. Cable puente con aislamiento desgastado y marcas de contacto; continuidad de ≈ 0 Ω con el bastidor medida **después** del evento.
6. Tapón genérico de la celda 119 y otros tres tapones no originales; un apagallamas obstruido con residuos.
7. Botella de lavaojos vacía, con fecha de vencimiento superada.
8. Camisa de algodón quemada de T1.
9. Registros de mantenimiento, orden de trabajo, capacitación y contratos.
10. Declaraciones de T1, T2, S1 y del coordinador.

### 12. Identificación de peligros eléctricos

Choque eléctrico en CC (hasta 291 V en igualación); arco eléctrico en CC con corriente prospectiva ≈ 8,5 kA; peligro térmico por conexiones de alta resistencia; peligro químico por electrolito; peligro de explosión por H₂; peligro mecánico por proyección de fragmentos. Detalle en la Sección 6.

### 13. Análisis del riesgo

**\[NFPA 70E\]** Reapretar conexiones de celdas en serie con cubiertas retiradas es tarea con probabilidad de arco **"Sí"** (Tabla 130.5(C)). **\[Análisis\]** La severidad es alta (quemaduras de segundo grado a distancias cortas; potencial de explosión de celda). Con cubiertas retiradas en 63 conexiones, una falla a tierra oculta y herramienta no aislada, la probabilidad efectiva era muy alta. Cálculo de energía incidente en la Sección 6.

### 14. Medidas de control existentes

| Control previsto | Estado encontrado |
| --- | --- |
| Ventilación mecánica | Fuera de servicio 19 días |
| Detector de H₂ | Instalado, calibración vencida |
| Detector de falla a tierra | Instalado, **alarma inhibida** |
| Apagallamas | Faltante en 4 celdas, uno obstruido |
| Lavaojos | Vacío y vencido |
| Cubiertas de conectores | Retiradas en bloque |
| Control de acceso | Operativo |
| Letreros | Solo "Peligro alto voltaje"; sin advertencia química ni de arco |

### 15. Controles omitidos o insuficientes

Evaluación de riesgos de la batería (320.3(A)(2)); plan de trabajo e informe previo (110.5(I)); permiso de trabajo energizado (130.2(A)(1)); herramientas con mangos aislados listados (320.3(C)(1)); retiro de joyas (320.3(A)(4)); EPP de arco y químico (130.7, 320.3(B)(1)); verificación de falla a tierra antes de trabajar; exposición de una conexión a la vez (320.3(C)(2)); gestión de alarmas inhibidas.

### 16. Causas inmediatas

- **Actos inseguros:** usar matraca de acero sin aislamiento; retirar todas las cubiertas del nivel; trabajar con anillo y reloj; no usar EPP de arco ni guantes aislantes.
- **Condiciones inseguras:** falla a tierra franca preexistente en el cable puente; celda con tapón sin apagallamas; extractor detenido; lavaojos vacío.

### 17. Causas básicas o subyacentes

- **Factores del trabajo:** mantenimiento del Cap. 2 y del Art. 320 no ejecutado (240.1, 240.2, 250.1, 320.3(A)(5), 320.3(D)); inspección del bastidor que no incluye el enrutamiento de cables; orden de trabajo genérica; herramientas inadecuadas provistas.
- **Factores personales:** capacitación vencida y sin formación específica en baterías (110.6).

### 18. Factores humanos y organizacionales (solo los justificables)

- **Normalización de la desviación:** alarma inhibida 5 meses sin control de cambios; se justifica por el registro del BMS.
- **Presión de tiempo:** ventana de 2,5 h y retiro de cubiertas "para agilizar"; se justifica por la declaración y el CCTV.
- **Transferencia de conocimiento CA → CC:** el técnico aplicó hábitos de tableros de CA ("un solo polo no hace nada"); se justifica por la entrevista.
- **No se afirma** fatiga ni consumo de sustancias: no hay evidencia.

### 19. Relación con NFPA 70E

El accidente se explica por la ausencia simultánea de: evaluación de riesgos (110.5(H), 320.3(A)(2)), condición de mantenimiento integrada al programa (110.5(C)), mantenimiento de baterías y EPP (Cap. 2) y controles específicos de baterías (320.3(A)–(D)).

### 20. Artículos y secciones aplicables

| Numeral | Requisito | Cumplimiento |
| --- | --- | --- |
| 110.5(C) | Programa considera la condición de mantenimiento | No |
| 110.5(H)(1)–(3) | Evaluación de riesgos y jerarquía de controles | No |
| 110.5(I) | Plan de trabajo e informe previo | No |
| 110.6 | Capacitación (reentrenamiento ≤ 3 años) | No |
| 110.7 | Responsabilidades del empleador anfitrión y del contratista | Parcial |
| 130.2(A) | Permiso de trabajo energizado | No |
| 130.4, Tabla 130.4(E)(b) | Evaluación de riesgo de choque; frontera restringida | No |
| 130.5, Tabla 130.7(C)(15)(b) | Evaluación de riesgo de arco; EPP | No |
| 130.5(H) | Etiquetado | No |
| 205.3, 205.13 | Mantenimiento y conductores libres de daño y de conexión a tierra | No |
| 240.1 | Ventilación y prueba funcional de alarmas | No |
| 240.2 | Lavaojos operativo | No |
| 250.1, 250.2 | EPP y herramientas en condición segura | No |
| 320.3(A)(2), (4), (5), (6) | Evaluación, prendas conductoras, alarmas anuales, letreros | No |
| 320.3(B)(1) | EPP químico y lavaojos en el área | No |
| 320.3(C)(1)–(2) | Herramientas aisladas; evitar contacto no intencional | No |
| 320.3(D) | Apagallamas y ventilación de celdas | No |

### 21. Medidas de prevención que debieron implementarse

Corregir la falla a tierra y reactivar la alarma **antes** del trabajo; restablecer la ventilación y verificar H₂; reemplazar apagallamas; seccionar la cadena si el diseño lo permitía; exponer una conexión a la vez con mantas aislantes; herramientas aisladas; EPP completo; lavaojos operativo; permiso de trabajo energizado y plan de trabajo.

### 22. EPP requerido

- **Arco (Tabla 130.7(C)(15)(b), 100–250 V, 7–15 kA):** categoría 3 → ropa con clasificación de arco ≥ 25 cal/cm² (camisa, pantalón u overol, chaqueta y pantalón de traje, capucha), guantes con clasificación de arco o guantes aislantes con protectores de cuero, casco, gafas, protección auditiva y calzado de cuero (Tabla 130.7(C)(15)(c)).
- **Choque:** guantes aislantes de caucho de clase adecuada a la tensión con protectores de cuero **\[Fuente externa\]**: clase 0 cubre hasta 1500 V CC según ASTM D120.
- **Químico (320.3(B)(1)):** gafas y protector facial aptos para peligro eléctrico y químico; guantes y delantal químicos; ropa evaluada para electrolito (nota de la Tabla 130.7(C)(15)(b)).
- **\[Análisis\]** Por la tensión real en flotación (≈ 281 V > 250 V), se recomienda el análisis de energía incidente del Anexo D.5 en lugar de la tabla. Ver Sección 6.

### 23. Procedimientos de trabajo seguro

Ver 4B.8 y Sección 8. Mínimo: evaluación de riesgos, verificación de alarmas y falla a tierra, verificación de ventilación y H₂, EPP, una conexión expuesta a la vez, herramientas aisladas, sin joyas, registro de torque y resistencia.

### 24. Controles de ingeniería

Protección mecánica del cable puente (pasacables y canaleta aislante); cubiertas de conectores con ventanas de medición; detector de falla a tierra con alarma no inhibible localmente; interbloqueo del extractor con alarma de H₂; lavaojos fijo; interruptores de seccionamiento de la cadena en tramos < 100 V **\[Análisis\]**.

### 25. Controles administrativos

Procedimiento escrito de mantenimiento de baterías; gestión de cambios para inhibir alarmas; permiso de trabajo energizado; control de contratistas (110.7); matriz de competencias (IEEE 1657 **\[Fuente externa\]**); plan de mantenimiento con pruebas anuales de alarmas (320.3(A)(5)).

### 26. Recomendaciones correctivas (inmediatas)

1. Bloquear el acceso a la sala hasta restablecer ventilación y medir H₂.
2. Reparar el cable puente y verificar el aislamiento de todos los cables al bastidor.
3. Reemplazar la celda 119 y todos los tapones sin apagallamas; limpiar y neutralizar tapas.
4. Reactivar y probar la alarma de falla a tierra.
5. Reponer y habilitar el lavaojos; instalar uno fijo.
6. Retirar herramientas no aisladas del kit del contratista.

### 27. Recomendaciones preventivas (sistémicas)

1. Integrar al programa de seguridad eléctrica la **condición de mantenimiento** de baterías (110.5(C)).
2. Plan de mantenimiento según IEEE 450 **\[Fuente externa\]** con pruebas anuales de alarmas (320.3(A)(5)) y de ventilación (240.1).
3. Capacitación específica en baterías y reentrenamiento ≤ 3 años (110.6).
4. Evaluación de riesgos de batería con la Figura F.7 para cada tarea.
5. Etiquetado de arco y químico según 130.5(H) y 320.3(A)(6).
6. Auditoría del programa (110.5(M)) e investigación de casi accidentes (110.5(J)).

### 28. Conclusiones técnicas

1. El evento fue un **arco en CC dentro de la cadena**, ≈ 126 V y varios kA, sin dispositivo de protección en el lazo.
2. La falla a tierra preexistente fue condición necesaria; su no detección se debió a una **alarma inhibida**, contrario a 320.3(A)(5) y 110.5(C).
3. La explosión de la celda 119 requirió la falta de apagallamas (320.3(D)) y fue agravada por la ventilación detenida (240.1).
4. La lesión ocular empeoró por el lavaojos inoperativo (240.2, 320.3(B)(1)).
5. El EPP usado no correspondía ni al peligro de arco ni al químico.
6. La causa raíz es organizacional: **el programa no trataba el mantenimiento como barrera de seguridad** ni exigía evaluación de riesgos específica de baterías.

### 29. Limitaciones del peritaje

- Escenario hipotético: los valores numéricos son supuestos coherentes, no mediciones.
- La corriente de arco real y la concentración local de H₂ no pueden determinarse sin datos del fabricante y mediciones al momento del evento.
- El Anexo D.5.1 es un método conservador al aire libre; la energía real puede ser menor.
- La continuidad cable–bastidor se midió después del evento; no se puede excluir que el daño se agravara durante el arco.
- No se dispone de informes médicos: la descripción de lesiones es cualitativa.
- Se usó una traducción automática de NFPA 70E; los numerales deben verificarse con el texto oficial.

### 30. Preguntas que podrían formular el profesor y la audiencia

Ver Secciones 12 y 13. Las más probables: ¿por qué no se desenergizó el banco?, ¿por qué el interruptor no disparó?, ¿qué categoría de EPP corresponde si la tensión real supera 250 V?, ¿el hidrógeno se encendió en la sala o dentro de la celda?, ¿el accidente habría ocurrido sin la falla a tierra?

## 6. Análisis de peligros y riesgos del banco de 250 V CC

El banco presenta **seis peligros distintos**, y cada uno tiene su propio control; confundirlos (por ejemplo, creer que la ropa de arco protege contra la explosión de una celda) es el error conceptual más común.

### 6.1 Peligro vs. riesgo (definiciones operativas)

- **Peligro:** fuente de daño potencial. Ejemplo: 281 V CC en bornes; H₂ en el espacio superior de la celda.
- **Riesgo:** combinación de la probabilidad de que ocurra la lesión y su severidad (enfoque de 110.5(H)(1) y 130.5(A)). Ejemplo: probabilidad alta de contacto de herramienta × severidad de quemadura de segundo grado.

### 6.2 Matriz de peligros, mecanismos y controles

| Peligro | Mecanismo en el banco | Consecuencia | Control principal | Norma |
| --- | --- | --- | --- | --- |
| Choque eléctrico CC | Contacto con dos puntos a distinta tensión, o con un polo y tierra si existe una falla a tierra | Paso de corriente por el cuerpo; caída o sobresalto | Evitar contacto; cubiertas; guantes aislantes; verificar falla a tierra | 320.3(A)(1), Tabla 130.4(E)(b) |
| Arco eléctrico CC | Herramienta metálica que une bornes o borne y bastidor | Quemaduras, proyección de metal fundido, destello | Herramientas aisladas; un borne expuesto a la vez; EPP de arco | 320.3(C), Tablas 130.5(C) y 130.7(C)(15)(b) |
| Cortocircuito sostenido | Sin dispositivo de protección dentro de la cadena | Arco de larga duración (se asumen 2 s) | Seccionamiento; barreras | Nota (2) Tabla 130.7(C)(15)(b) |
| Electrolito | Salpicadura al usar hidrómetro, rotura de recipiente o manipulación | Quemadura química, lesión ocular | EPP químico; lavaojos en el área | 320.3(B), 240.2 |
| Hidrógeno (incendio/explosión) | Acumulación en sala o celda + fuente de ignición | Explosión de celda, incendio, fragmentos | Ventilación mantenida; detección; apagallamas; sin fuentes de ignición | 240.1, 320.3(D), 320.3(A)(6) |
| Térmico | Conexiones de alta resistencia; fuga térmica en VRLA | Quemaduras por contacto; inicio de falla | Medición de resistencia; termografía; torque | 320.3(A)(6), 205.3 |

### 6.3 Evaluación del riesgo de choque

- **\[NFPA 70E\] Tabla 130.4(E)(b), 50–300 V CC:** frontera limitada 1,0 m (parte fija expuesta); frontera restringida "evitar el contacto". Reapretar un borne con herramienta es cruzar la frontera restringida.
- **\[Análisis\]** Tensiones de exposición posibles: entre bornes adyacentes, 2,25 V (bajo); entre extremos de la cadena, ≈ 281 V (291 V en igualación); entre un borne y el bastidor, 0 V si el bus está aislado y sano, **o hasta la tensión del tramo si hay una falla a tierra**. Este último es el escenario del accidente.
- **\[Análisis\]** En bastidores de dos niveles, bornes físicamente cercanos pueden estar separados por decenas de celdas en el circuito. Por eso "lo que tengo al lado" no indica la tensión real.

### 6.4 Evaluación del riesgo de arco: reconstrucción del evento

Método del Anexo D.5.1 **\[NFPA 70E\]**. Datos **\[Supuesto del caso\]**: V\_sys = 126 V (tramo de 56 celdas en flotación); I\_bf ≈ 8,5 kA (fabricante); T\_arc ≈ 0,9 s (CCTV).

```latex
I_{arc} = 0.5 \cdot 8500 = 4250\ \text{A}
```

| Distancia al arco | Energía incidente estimada | Interpretación **\[Análisis\]** |
| --- | --- | --- |
| 45,5 cm (rostro y torso, distancia de trabajo de la tabla) | ≈ 2,3 cal/cm² | Supera 1,2 cal/cm² (umbral de quemadura de segundo grado que define la frontera de arco en 130.5(E)(1)) |
| 25 cm (antebrazo y mano) | ≈ 7,7 cal/cm² | Consistente con quemaduras de segundo grado en mano y antebrazo |

**\[Análisis\]** Los resultados son **coherentes** con las lesiones descritas, pero el Anexo D.5.1 es conservador (máxima potencia, arco al aire libre). En una investigación real se necesitarían la curva de descarga y la resistencia interna del fabricante, la longitud del hueco y las fotos del arco para refinar el cálculo.

### 6.5 Evaluación del riesgo de arco: cómo debió planificarse la tarea

Para planificar no se usa el tramo que falló, sino **el peor caso razonable**: cadena completa en flotación y sin dispositivo que despeje (2 s).

| Base de planificación | V (V) | I\_arc (A) | T (s) | IE a 45,5 cm | Frontera de arco (1,2 cal/cm²) |
| --- | --- | --- | --- | --- | --- |
| Tensión nominal | 250 | 4250 | 2 | ≈ 10,3 cal/cm² | ≈ 1,33 m |
| Tensión de flotación | 281 | 4250 | 2 | ≈ 11,5 cal/cm² | ≈ 1,41 m |
| Tensión de igualación | 291 | 4250 | 2 | ≈ 11,9 cal/cm² | ≈ 1,44 m |

**\[Análisis\]** Comparación con la Tabla 130.7(C)(15)(b):

- Si se toma la **tensión nominal de 250 V** → fila 100–250 V, 7–15 kA → **categoría 3 (25 cal/cm²), frontera 1,8 m**.
- Si se toma la **tensión real de flotación (281 V)** → fila > 250–600 V, 7–10 kA → **categoría 4 (40 cal/cm²), frontera 2,5 m**.
- El cálculo del Anexo D.5.1 da ≈ 11–12 cal/cm², cubierto por categoría 3.

**Posición del grupo:** la tabla es ambigua justo en el límite de 250 V. Lo técnicamente defendible es **hacer el análisis de energía incidente (130.5(G))** con datos del fabricante y documentarlo, en vez de elegir la fila más conveniente. Con los datos supuestos, ropa de ≥ 25 cal/cm² queda con margen.

### 6.6 Evaluación del peligro de hidrógeno

- **Probabilidad \[Análisis\]:** aumentada por la igualación reciente (más gasificación), el extractor detenido (sin dilución) y el sensor sin calibrar (sin advertencia confiable).
- **Severidad \[Análisis\]:** una ignición dentro de una celda rompe el recipiente y proyecta electrolito y fragmentos; una ignición en la sala con concentración cercana al LII puede producir una deflagración con daño estructural.
- **Dato que falta:** la concentración local cerca de los tapones al momento del evento. El sensor de techo (0,4 %) **no representa** la concentración en el espacio superior de una celda.

### 6.7 Evaluación del peligro químico

- **\[NFPA 70E\] 320.3(B)(2) Nota Inf.:** leer densidad con hidrómetro de bulbo puede considerarse manejo de electrolito → aplican los requisitos de 320.3(B)(1). T2 no los cumplía.
- **\[Análisis\]** El tiempo entre la salpicadura y el lavado es decisivo en lesiones oculares; el retraso de ≈ 1 min por el lavaojos vacío es un factor agravante documentable.

### 6.8 Matriz de riesgo resumida (antes y después de controles)

| Peligro | Riesgo en condición encontrada | Riesgo con controles de la Sección 8 |
| --- | --- | --- |
| Choque CC | Alto (falla a tierra oculta, sin guantes) | Bajo |
| Arco CC | Muy alto (sin herramientas aisladas, cubiertas retiradas) | Medio-bajo (el EPP solo mitiga) |
| Electrolito | Alto (sin protector facial ni lavaojos) | Bajo |
| Hidrógeno | Alto (sin ventilación ni apagallamas) | Bajo |
| Térmico | Medio | Bajo |

La escala es cualitativa y la define el grupo **\[Análisis\]**; NFPA 70E no prescribe una matriz numérica.

## 7. Análisis de causa raíz

**Conclusión:** el accidente no ocurrió "por falta de EPP". El EPP fue la **última** de ocho barreras y la única que dependía por completo del trabajador; las siete anteriores eran responsabilidad del programa y del mantenimiento, y ya estaban fallidas.

### 7.1 Metodología aplicada

Se combinan tres técnicas reconocidas, cada una con un propósito:

1. **Análisis de barreras** (guía de análisis de causa raíz del DOE de EE. UU., DOE-NE-STD-1004-92; modelo de "queso suizo" de Reason) **\[Fuente externa\]**: identifica qué defensas debían impedir el evento y por qué fallaron.
2. **Modelo de causalidad de pérdidas** (Bird y Germain) **\[Fuente externa\]**: ordena la causalidad en *falta de control → causas básicas → causas inmediatas → incidente → pérdida*.
3. **Cinco porqués** en cada línea causal: baja desde el hecho físico hasta la decisión organizacional.

**Regla de parada \[Análisis\]:** una causa se considera **raíz** cuando es un fallo del sistema de gestión que, si se corrige, evita esta y otras fallas similares, y cuando está bajo el control de la organización.

### 7.2 Análisis de barreras

| # | Barrera | Tipo | Estado | Numeral |
| --- | --- | --- | --- | --- |
| 1 | Aislamiento del cable puente respecto al bastidor | Ingeniería | Fallida (desgaste no inspeccionado) | 205.13 |
| 2 | Detección y alarma de falla a tierra | Ingeniería | Fallida (inhibida) | 320.3(A)(5), 110.5(C) |
| 3 | Ventilación con detección de H₂ | Ingeniería | Fallida (extractor detenido, sensor vencido) | 240.1 |
| 4 | Apagallamas de las celdas | Ingeniería | Fallida (tapón genérico) | 320.3(D) |
| 5 | Evaluación de riesgos, plan de trabajo y permiso | Administrativa | Ausente | 320.3(A)(2), 110.5(I), 130.2 |
| 6 | Exposición mínima (una conexión a la vez, mantas) | Práctica de trabajo | Fallida | 320.3(C)(2) |
| 7 | Herramientas aisladas, sin joyas | Práctica / equipo | Fallida | 320.3(C)(1), 320.3(A)(4) |
| 8 | EPP de arco y químico; lavaojos | EPP / mitigación | Fallida | 130.7, 320.3(B), 240.2 |

**\[Análisis\]** Las barreras 1 a 4 son **barreras de mantenimiento**: si cualquiera de las dos primeras hubiera funcionado, no habría existido el lazo de falla; si la 4 hubiera funcionado, no habría explotado la celda.

### 7.3 Clasificación de causas

| Categoría | Hallazgo en el Caso 4 |
| --- | --- |
| Peligro | 126–291 V CC con ≈ 8,5 kA prospectivos; H₂ en celdas; electrolito ácido |
| Riesgo | Probabilidad alta de contacto de herramienta en tarea "Sí" de la Tabla 130.5(C), con severidad alta |
| Causa inmediata | Matraca metálica que unió el borne de la celda 118 con el bastidor puesto a tierra |
| Acto inseguro | Herramienta no aislada; retiro de todas las cubiertas; anillo y reloj; EPP inadecuado |
| Condición insegura | Falla a tierra franca en el cable puente; celda sin apagallamas; extractor detenido; lavaojos vacío |
| Causa básica — factor personal | Sin formación específica en baterías; reentrenamiento vencido (110.6) |
| Causa básica — factor del trabajo | Orden de trabajo genérica; herramientas inadecuadas en el kit; ventana corta |
| Falla de procedimiento | No existía procedimiento escrito para trabajo en baterías ni evaluación de riesgos (320.3(A)(2)) |
| Falla de mantenimiento | Alarmas sin prueba anual (320.3(A)(5)); ventilación sin prueba funcional (240.1); apagallamas no inspeccionados (320.3(D)); lavaojos (240.2); inspección que no cubría cables sobre bordes metálicos |
| Falla de capacitación | Transferencia de hábitos de CA a CC; no conocía la implicación de una falla a tierra en un bus aislado |
| Falla de supervisión | El anfitrión autorizó el acceso sin verificar alarmas inhibidas ni plan de trabajo (110.7) |
| Falla de diseño o ingeniería | Cable puente enrutado sobre borde metálico sin protección; alarma inhibible sin registro; lavaojos solo portátil |
| Falla del programa de seguridad eléctrica | El programa no incluía la condición de mantenimiento (110.5(C)), ni gestión de cambios de alarmas, ni auditoría eficaz (110.5(M)) |

### 7.4 Cinco porqués (tres líneas causales)

**Línea A — ¿Por qué hubo un arco?**

1. Porque la matraca unió un borne con el bastidor.
2. ¿Por qué eso cerró un circuito? Porque existía una falla a tierra franca en el cable puente.
3. ¿Por qué no se detectó? Porque la alarma de falla a tierra estaba inhibida.
4. ¿Por qué estaba inhibida? Porque se desactivó por "falsas alarmas" sin investigar la causa ni fijar plazo.
5. ¿Por qué se permitió? Porque el programa **no tenía gestión de cambios para inhibir alarmas de seguridad ni pruebas anuales exigidas** (110.5(C), 320.3(A)(5)). → **Causa raíz 1.**

**Línea B — ¿Por qué explotó la celda 119?**

1. Porque la mezcla H₂/O₂ del interior se encendió.
2. ¿Por qué pudo entrar la llama? Porque el tapón no tenía apagallamas.
3. ¿Por qué? Porque se reemplazó por un tapón genérico en un mantenimiento anterior.
4. ¿Por qué no se detectó? Porque la inspección no verificaba apagallamas ni ventilación.
5. ¿Por qué? Porque el plan de mantenimiento no incorporaba los requisitos de 240.1 y 320.3(D). → **Causa raíz 2.**

**Línea C — ¿Por qué el trabajador estaba expuesto sin protección?**

1. Porque usaba herramientas no aisladas, joyas y ropa de algodón.
2. ¿Por qué? Porque no se hizo evaluación de riesgos ni plan de trabajo.
3. ¿Por qué? Porque la orden de trabajo era genérica y no existía procedimiento de baterías.
4. ¿Por qué no se exigió? Porque el anfitrión no verificó la competencia ni los procedimientos del contratista.
5. ¿Por qué? Porque el programa no definía requisitos para contratistas ni competencias en baterías (110.6, 110.7). → **Causa raíz 3.**

### 7.5 Causas raíz determinadas

1. **CR1 — Mantenimiento no tratado como barrera de seguridad:** el programa no integraba la condición de mantenimiento (110.5(C)) y permitía inhibir alarmas sin control.
2. **CR2 — Plan de mantenimiento incompleto para baterías:** omitía ventilación, detección, apagallamas y lavaojos (240.1, 240.2, 320.3(D)).
3. **CR3 — Ausencia de procedimiento y competencia específicos para baterías:** sin evaluación de riesgos (320.3(A)(2)), plan de trabajo (110.5(I)) ni control de contratistas (110.6, 110.7).

### 7.6 Cadena causal: mantenimiento → accidente

| Eslabón | En el Caso 4 | Qué dato real se necesitaría |
| --- | --- | --- |
| 1. Estado del equipo | Aislamiento del cable puente desgastado; alarma inhibida; apagallamas faltante; extractor detenido | Registros de inspección; historial del BMS |
| 2. Condición eléctrica | Falla a tierra franca en celdas 62/63; bus aislado ya referenciado a tierra sin saberlo | Resistencia de aislamiento polo–tierra previa al evento |
| 3. Comportamiento ante la falla | Lazo interno de la cadena; el interruptor de 400 A no ve la corriente | Diagrama unifilar de CC (205.2) |
| 4. Tiempo de despeje | Sin dispositivo; el arco termina por expulsión de la herramienta (≈ 0,9 s) | Video con fotogramas; ensayo de laboratorio |
| 5. Energía liberada | ≈ 2,3 cal/cm² a 45,5 cm; ≈ 7,7 cal/cm² a 25 cm (D.5.1) | Resistencia interna y corriente de cortocircuito del fabricante |
| 6. Exposición | Mano a < 25 cm; rostro a ≈ 45 cm; sin EPP de arco; hidrógeno cercano | Reconstrucción de la postura |
| 7. Consecuencia | Quemaduras de segundo grado; lesión química ocular | Informe médico |

**\[Análisis\]** El caso muestra una variante importante del primer punto del Módulo D: el mantenimiento no solo alarga el tiempo de disparo de un interruptor; en baterías **puede crear un circuito de falla que ningún interruptor protege**. En ambos casos el resultado es el mismo: más tiempo de arco y más energía.

### 7.7 Qué no se puede afirmar

- No se afirma "negligencia" ni "intención": son calificaciones jurídicas, no técnicas.
- No se atribuye culpa individual a T1: los actos inseguros fueron facilitados por condiciones del sistema.
- No se afirma que el H₂ de la sala superara el LII: el dato no existe.

## 8. Medidas de control y prevención

Esta sección responde literalmente al desafío del Caso 4: **medidas de control requeridas para evitar choque y explosión por gas hidrógeno**, ordenadas según la jerarquía de 110.5(H)(3).

### 8.1 Jerarquía de controles aplicada al banco

**\[NFPA 70E\] 110.5(H)(3)** establece el orden: (1) eliminación, (2) sustitución, (3) controles de ingeniería, (4) concientización, (5) controles administrativos, (6) EPP. La Nota Inf. n.º 1 señala que los tres primeros son los más efectivos porque actúan en la fuente y dependen menos del error humano.

| Nivel | Medida | Peligro que controla | Base |
| --- | --- | --- | --- |
| 1. Eliminación | Hacer la tarea sin exposición: medir resistencias con monitoreo en línea; reemplazar reapriete periódico por termografía y medición continua | Choque, arco | 110.1 **\[NFPA 70E\]**; **\[Análisis\]** |
| 2. Sustitución | Seccionar la cadena en tramos < 100 V antes de intervenir; tecnología VRLA donde sea compatible | Choque; electrolito; H₂ | 320.3(A)(1) **\[NFPA 70E\]**; **\[Análisis\]** |
| 3. Ingeniería | Protección mecánica de cables; cubiertas con ventanas de medición; detector de falla a tierra no inhibible; extractor interbloqueado con alarma de H₂; apagallamas; lavaojos fijo | Choque, arco, H₂, químico | 205.13, 240.1, 320.3(D), 240.2 |
| 4. Concientización | Letreros eléctricos, de arco y químicos; etiqueta de arco | Todos | 320.3(A)(6), 130.5(H) |
| 5. Administrativos | Evaluación de riesgos, plan e informe previo, permiso, procedimiento escrito, pruebas anuales de alarmas, gestión de cambios, control de contratistas | Todos | 320.3(A)(2), 110.5(I), 130.2, 320.3(A)(5), 110.7 |
| 6. EPP | Categoría 3 o según análisis; guantes aislantes; EPP químico | Arco, choque, químico | Tabla 130.7(C)(15)(b), 320.3(B)(1) |

### 8.2 Controles para evitar el choque eléctrico

1. **Verificar ausencia de falla a tierra** antes de iniciar: alarma activa y medición polo–bastidor **\[Análisis\]**.
2. **Seccionar** la cadena en tramos < 100 V si el diseño lo permite **\[Análisis\]** sobre el umbral de 320.3(A)(1).
3. **Mantener cubiertas** y exponer una sola conexión; mantas aislantes sobre las adyacentes (320.3(C)(2)).
4. **Herramientas con mangos aislados listados** para la tensión máxima de trabajo (320.3(C)(1)).
5. **Sin objetos conductores** (320.3(A)(4)).
6. **Guantes aislantes** con protectores de cuero, inspeccionados antes de usar (250.2).
7. **Acceso restringido** a personal autorizado (320.3(A)(3)(a)).

### 8.3 Controles para evitar la explosión por hidrógeno

1. **Ventilación operativa y mantenida**, con prueba funcional de detección y alarma (240.1).
2. **Medir H₂** antes de entrar y durante tareas prolongadas **\[Análisis\]**; no trabajar si hay alarma.
3. **No programar tareas en bornes inmediatamente después de una igualación** sin verificar ventilación **\[Análisis\]**.
4. **Apagallamas instalados y sin obstrucción**, reemplazados según el fabricante (320.3(D)).
5. **Eliminar fuentes de ignición:** herramientas aisladas; herramientas antichispa si la evaluación lo justifica (320.3(C)(3)); no conectar ni desconectar bajo carga; prohibición de llama y de fumar (320.3(A)(6)).
6. **Control de la carga:** cargador con compensación de temperatura y alarmas de sobretensión **\[Fuente externa\]** (la Nota Inf. de 320.3(A)(5) menciona alarmas de sobretensión y sobretemperatura).

### 8.4 Plan de mantenimiento mínimo derivado del caso

| Actividad | Frecuencia | Base |
| --- | --- | --- |
| Prueba de alarmas de condición anormal (falla a tierra, tensión, temperatura) | Anual | 320.3(A)(5) **\[NFPA 70E\]** |
| Prueba funcional de ventilación, detección y alarma de H₂ | Según fabricante y programa; incluida en el mantenimiento | 240.1 **\[NFPA 70E\]** |
| Inspección de apagallamas y aberturas de ventilación | En cada inspección de la batería | 320.3(D) **\[NFPA 70E\]** |
| Inspección de lavaojos | Operativo siempre; periodicidad según ANSI/ISEA Z358.1 | 240.2 **\[NFPA 70E\]**; **\[Fuente externa\]** |
| Inspección visual de EPP y herramientas | Antes de cada uso y a intervalos ≤ 1 año | 250.2(A) **\[NFPA 70E\]** |
| Prueba del aislamiento de EPP y herramientas | ≤ 3 años o según su norma | 250.2(B) **\[NFPA 70E\]** |
| Inspecciones de batería (tensiones, densidad, temperatura, resistencia de conexiones) | Mensual, trimestral y anual | IEEE 450 **\[Fuente externa\]** |
| Revisión del análisis de energía incidente y etiquetas | ≤ 5 años o ante cambios | 130.5(G), 130.5(H) **\[NFPA 70E\]** |
| Reentrenamiento en prácticas de trabajo seguras | ≤ 3 años | 110.6 **\[NFPA 70E\]** |

### 8.5 Lista de verificación previa al trabajo en el banco (propuesta del grupo)

- [ ] Evaluación de riesgos de la batería completada (320.3(A)(2))
- [ ] Plan de trabajo e informe previo documentados (110.5(I))
- [ ] Permiso de trabajo energizado si aplica (130.2)
- [ ] Alarmas del monitor de baterías activas; ninguna inhibida
- [ ] Tensión polo–bastidor medida en ambos polos
- [ ] Extractor funcionando; lectura de H₂ registrada
- [ ] Apagallamas presentes y limpios
- [ ] Lavaojos operativo en el área (320.3(B)(1))
- [ ] Herramientas aisladas listadas; sin joyas
- [ ] EPP de arco y químico según la tarea
- [ ] Una sola conexión expuesta a la vez; mantas aislantes disponibles

**\[Análisis\]** Esta lista se ubica en el nivel administrativo de la jerarquía; no reemplaza las correcciones de ingeniería de 8.1.

## 9. Conclusiones

1. **El Capítulo 2 es un requisito de seguridad, no de confiabilidad.** 200.1 define el mantenimiento en función de la seguridad de los empleados, y 205.3 lo vincula a reducir el riesgo asociado con fallas.
2. **El mantenimiento controla la variable tiempo.** La Nota Informativa de 210.5 y 130.5(G) establecen que la condición de mantenimiento afecta el tiempo de despeje y, con él, la energía incidente. Un equipo sin mantenimiento deja sin validez tanto la etiqueta como las tablas de EPP.
3. **Las baterías no se pueden desenergizar.** Por eso el Art. 320 exige evaluación de riesgos antes de cualquier trabajo (320.3(A)(2)) y controles que asumen tensión permanente: herramientas aisladas, sin joyas, contacto evitado y acceso restringido.
4. **El arco en CC es más persistente y a menudo no tiene quien lo despeje.** La Tabla 130.7(C)(15)(b) supone 2 s de arco cuando no hay protección o no se conoce el despeje.
5. **El hidrógeno se controla con mantenimiento, no con EPP.** Ventilación mantenida y probada (240.1), apagallamas (320.3(D)) y eliminación de fuentes de ignición son las barreras reales.
6. **En el Caso 4, cuatro barreras de mantenimiento fallaron antes que el trabajador.** La causa raíz fue un programa que no integraba la condición de mantenimiento (110.5(C)) ni un procedimiento específico para baterías.
7. **Un peritaje serio diferencia hechos, supuestos y análisis**, y declara lo que no puede afirmar.

## 10. Estructura de la presentación (30 min + 10 min de preguntas)

**18 diapositivas, 5 bloques de 6 minutos.** Regla de diseño: máximo 6 líneas por diapositiva, un recurso visual dominante y el numeral de NFPA 70E siempre visible en una esquina.

| # | Título | Responsable | Tiempo |
| --- | --- | --- | --- |
| 1 | Cuando el mantenimiento es una barrera de seguridad | I1 | 0:30 |
| 2 | Ruta de la exposición | I1 | 0:45 |
| 3 | ¿Qué es mantenimiento para NFPA 70E? | I1 | 1:30 |
| 4 | Mantenimiento dentro del programa | I1 | 1:30 |
| 5 | Qué se mantiene y por qué | I1 | 1:45 |
| 6 | La variable que el mantenimiento controla: el tiempo | I2 | 2:00 |
| 7 | De un mecanismo trabado a 16 cal/cm² | I2 | 2:00 |
| 8 | Cuando la tabla y la etiqueta dejan de valer | I2 | 2:00 |
| 9 | Artículo 320: umbrales y evaluación obligatoria | I3 | 1:30 |
| 10 | CA vs. CC: por qué el arco en CC no se apaga | I3 | 1:30 |
| 11 | Tablas de CC: fronteras, probabilidad y EPP | I3 | 2:00 |
| 12 | Caso 4: la instalación | I3 | 1:00 |
| 13 | El otro peligro: electrolito e hidrógeno | I4 | 2:00 |
| 14 | Barreras contra la explosión | I4 | 1:30 |
| 15 | Caso 4: línea de tiempo y evidencias | I4 | 2:30 |
| 16 | Cadena causal y barreras que fallaron | I5 | 2:00 |
| 17 | Causa raíz y jerarquía de controles | I5 | 2:00 |
| 18 | Pregunta de control y conclusiones | I5 | 2:00 |

### Detalle por diapositiva

**D1 — Cuando el mantenimiento es una barrera de seguridad** (I1, 0:30)

- **Objetivo:** presentar tema, grupo y norma.
- **Visual:** título, Módulo D, "NFPA 70E 2021, Cap. 2 y Art. 320", nombres. Foto de sala de baterías (propia o de banco de imágenes libre).
- **No colocar:** índice largo ni objetivos en párrafo.
- **Oral:** "Vamos a demostrar que un equipo mal mantenido cambia la energía de un accidente."

**D2 — Ruta de la exposición** (I1, 0:45)

- **Objetivo:** anticipar la estructura.
- **Visual:** flecha de 5 pasos: Mantenimiento → Energía → CC → Hidrógeno → Peritaje, con el nombre del integrante bajo cada paso.
- **No colocar:** texto de cada sección.
- **Oral:** qué aprenderá la audiencia y que al final habrá una pregunta de control.

**D3 — ¿Qué es mantenimiento para NFPA 70E?** (I1, 1:30)

- **Objetivo:** fijar la definición de 200.1 y la responsabilidad de 205.3.
- **Visual:** cita corta parafraseada de 200.1(3) en recuadro; tres íconos: "fabricante o normas de consenso", "propietario responsable", "documentación".
- **No colocar:** la lista completa 205.1–205.15.
- **Recurso:** esquema "confiabilidad vs. seguridad" (dos columnas).
- **Oral:** diferencia entre mantener para que el equipo dure y mantener para que falle de forma predecible.

**D4 — Mantenimiento dentro del programa** (I1, 1:30)

- **Objetivo:** vincular el Cap. 2 con 110.5(C) y 110.4(D).
- **Visual:** las 6 condiciones de 110.4(D) como lista de verificación con la n.º 2 resaltada.
- **No colocar:** todo el texto de 110.5.
- **Oral:** si una condición falla, las estimaciones "No" de la Tabla 130.5(C) no aplican.

**D5 — Qué se mantiene y por qué** (I1, 1:45)

- **Objetivo:** mostrar el Cap. 2 como conjunto de barreras.
- **Visual:** tabla de 5 filas: Protección contra sobrecorriente (205.4, 225) · Envolventes (205.7) · Baterías (240) · EPP (250) · Información (205.2, 205.12).
- **No colocar:** los 11 ítems de 250.1.
- **Caso 4:** mencionar el historial de mantenimiento del banco (alarma inhibida, extractor detenido).
- **Oral:** transición a I2.

**D6 — La variable que el mantenimiento controla: el tiempo** (I2, 2:00)

- **Objetivo:** explicar la Nota Inf. de 210.5 y 130.5(G).
- **Visual:** línea de tiempo de despeje con marcas de 0,5, 1,5, 3, 5 y 30 ciclos (Nota Inf. n.º 1, Tabla 130.7(C)(15)(a)).
- **No colocar:** ecuaciones de IEEE 1584.
- **Oral:** energía ≈ proporcional al tiempo; modos de deterioro (mecanismo trabado, deriva, fusible no limitador).

**D7 — De un mecanismo trabado a 16 cal/cm²** (I2, 2:00)

- **Objetivo:** ejemplo numérico.
- **Visual:** gráfico de dos barras: 1,6 cal/cm² (0,05 s) vs. 16 cal/cm² (0,5 s), con una línea horizontal en 8 cal/cm² ("EPP categoría 2").
- **No colocar:** datos de corriente y distancia en exceso; basta una nota "ejemplo ilustrativo".
- **Oral:** el trabajador queda subprotegido sin que ninguna etiqueta lo advierta.

**D8 — Cuando la tabla y la etiqueta dejan de valer** (I2, 2:00)

- **Objetivo:** consecuencias de usar equipos sin mantenimiento.
- **Visual:** cadena causal de 7 eslabones (estado → condición → comportamiento → despeje → energía → exposición → consecuencia).
- **No colocar:** el Caso 3 completo (es de otro grupo).
- **Caso 4:** adelantar que en la batería no hay interruptor dentro de la cadena.
- **Oral:** transición a I3.

**D9 — Artículo 320: umbrales y evaluación obligatoria** (I3, 1:30)

- **Objetivo:** alcance y requisitos generales.
- **Visual:** tres tarjetas: "> 50 V nominales (320.1)", "100 V CC (320.3(A)(1))", "Evaluación antes de cualquier trabajo (320.3(A)(2))".
- **No colocar:** todas las definiciones de 320.2.
- **Oral:** la batería no se puede desenergizar; por eso la evaluación es obligatoria.

**D10 — CA vs. CC: por qué el arco en CC no se apaga** (I3, 1:30)

- **Objetivo:** diferencia física.
- **Visual:** dos formas de onda (senoidal con cruces por cero vs. línea recta) y un rayo de arco sobre cada una.
- **No colocar:** teoría de plasma.
- **Oral:** sin cruce por cero, sin dispositivo en la cadena, fuente que no se desconecta.

**D11 — Tablas de CC: fronteras, probabilidad y EPP** (I3, 2:00)

- **Objetivo:** aplicar las tablas al banco.
- **Visual:** tres recuadros: Tabla 130.4(E)(b) (1,0 m / evitar contacto); Tabla 130.5(C) ("Sí" en celdas en serie); Tabla 130.7(C)(15)(b) (categoría 3, 1,8 m).
- **No colocar:** las tablas completas escaneadas.
- **Oral:** mencionar la ambigüedad de 250 V nominal vs. 281 V en flotación.

**D12 — Caso 4: la instalación** (I3, 1:00)

- **Objetivo:** presentar el escenario.
- **Visual:** diagrama de arquitectura del banco (ver Sección 14, diagrama 1), con la etiqueta "Escenario hipotético".
- **No colocar:** la ficha técnica completa.
- **Oral:** transición a I4.

**D13 — El otro peligro: electrolito e hidrógeno** (I4, 2:00)

- **Objetivo:** peligros químicos.
- **Visual:** corte de una celda ventilada (placas, electrolito, espacio con H₂/O₂, tapón con apagallamas) y datos "LII 4 %" y "objetivo < 1 %".
- **No colocar:** reacciones químicas completas.
- **Oral:** igualación = más gas; EPP químico de 320.3(B).

**D14 — Barreras contra la explosión** (I4, 1:30)

- **Objetivo:** controles de hidrógeno.
- **Visual:** triángulo del fuego con H₂: combustible (ventilación, 240.1), oxígeno (siempre presente), ignición (apagallamas 320.3(D), herramientas 320.3(C)).
- **No colocar:** normas de incendio completas.
- **Oral:** por qué el EPP no protege de una explosión.

**D15 — Caso 4: línea de tiempo y evidencias** (I4, 2:30)

- **Objetivo:** reconstrucción de hechos.
- **Visual:** línea de tiempo horizontal 01:30 → 02:41 con 6 hitos y miniaturas de evidencias (matraca fundida, cable desgastado, tapón genérico, botella vacía).
- **No colocar:** declaraciones textuales.
- **Oral:** transición a I5: "ya sabemos qué pasó; ahora, por qué".

**D16 — Cadena causal y barreras que fallaron** (I5, 2:00)

- **Objetivo:** análisis de barreras.
- **Visual:** 8 rebanadas de "queso suizo" con los agujeros alineados; las 4 primeras en color "mantenimiento".
- **No colocar:** la tabla completa de clasificación de causas.
- **Oral:** el EPP fue la última barrera, no la primera.

**D17 — Causa raíz y jerarquía de controles** (I5, 2:00)

- **Objetivo:** causas raíz y recomendaciones.
- **Visual:** pirámide invertida de 6 niveles (110.5(H)(3)) con una medida del caso en cada nivel; al lado, CR1, CR2 y CR3.
- **No colocar:** las 12 recomendaciones.
- **Oral:** los tres primeros niveles actúan en la fuente.

**D18 — Pregunta de control y conclusiones** (I5, 2:00)

- **Objetivo:** cumplir el requisito de pregunta de control y cerrar.
- **Visual:** pregunta de control (ver Sección 12, P1) y tres conclusiones en una línea cada una.
- **No colocar:** bibliografía (va en el trabajo escrito o en una diapositiva de respaldo).
- **Oral:** dar 30 s para responder, discutir la respuesta y abrir el turno de preguntas.

**Diapositivas de respaldo (no se proyectan salvo que pregunten):** R1 cálculo D.5.1 completo; R2 Tabla 130.7(C)(15)(b) completa; R3 generación de H₂ por Faraday; R4 clasificación de causas; R5 referencias.

## 11. Guion oral de cada integrante

Cada guion dura ≈ 6 minutos a ritmo de exposición (≈ 130 palabras por minuto). Son guías para hablar, **no para leer**: cada integrante debe reformularlas con sus palabras. Las frases en *cursiva* son transiciones obligatorias.

### Integrante 1 (D1–D5)

"Buenos días. Somos el grupo del Módulo D: mantenimiento, Capítulo 2, y requisitos especiales, Capítulo 3, de NFPA 70E, edición 2021. Queremos demostrarles una idea: un equipo mal mantenido no solo se daña más; cuando falla, libera más energía sobre el trabajador.

La exposición tiene cinco pasos. Yo explico qué entiende la norma por mantenimiento. Mi compañero les muestra cómo el mantenimiento cambia el tiempo de disparo y la energía incidente. Luego entramos a las baterías del Artículo 320: primero el peligro eléctrico en corriente continua y después el químico, el hidrógeno. Terminamos con un peritaje de un accidente en un banco de 250 voltios de un centro de datos.

Empecemos. El artículo 200.1 dice que el Capítulo 2 cubre solo el mantenimiento directamente asociado con la seguridad de los empleados. Y define mantenimiento como preservar o restaurar la condición del equipo para la seguridad de quien trabaja expuesto. Fíjense: no dice 'para que el equipo dure'. El 205.3 agrega que se mantiene según el fabricante o las normas de consenso, para reducir el riesgo asociado con fallas, y que el propietario es responsable del mantenimiento y de la documentación.

¿Por qué importa esto en el Capítulo 1? Porque el 110.5(C) obliga a que el programa de seguridad eléctrica considere la condición de mantenimiento. Y el 110.4(D) dice que un equipo está en condición normal de operación solo si, entre otras cosas, está adecuadamente mantenido y no hay evidencia de falla inminente. Si esa condición falla, muchas de las tareas que la Tabla 130.5(C) considera de baja probabilidad de arco dejan de serlo.

El Capítulo 2 se puede leer como un conjunto de barreras: protección contra sobrecorriente, envolventes, puesta a tierra, información actualizada, baterías con su ventilación y lavaojos en el artículo 240, y el mismo EPP en el artículo 250. En nuestro caso veremos un banco con la alarma de falla a tierra inhibida desde hacía cinco meses y el extractor detenido hacía diecinueve días.

*Si el equipo no está en la condición que la norma supone, ¿qué cambia físicamente cuando ocurre la falla? Eso lo explica mi compañero.*"

### Integrante 2 (D6–D8)

"Gracias. Hay una frase del Capítulo 2 que resume todo el módulo. Es la Nota Informativa del 210.5: el mantenimiento incorrecto o inadecuado puede aumentar el tiempo de apertura del dispositivo de protección y, con eso, la energía incidente.

¿Por qué el tiempo? Porque en los modelos de cálculo, la energía incidente es prácticamente proporcional a la duración del arco. Si duplico el tiempo, duplico la energía. La propia norma, en la Nota Informativa de la Tabla 130.7(C)(15)(a), da tiempos típicos: medio ciclo para un fusible limitador, uno y medio para un interruptor de caja moldeada con disparo instantáneo, y veinte o treinta ciclos cuando el interruptor tiene retardo de tiempo corto.

¿Cómo se alarga el tiempo? Grasa endurecida que traba el mecanismo; calibración que se corre y hace que la corriente de arco caiga en la zona de tiempo largo; un fusible limitador reemplazado por uno que no lo es, que el 225.1 prohíbe; o un interruptor que ya interrumpió fallas severas y nunca se probó, como pide el 225.3.

Veamos un ejemplo ilustrativo. Un tablero de 480 voltios tiene 1,6 calorías por centímetro cuadrado si el interruptor despeja en 3 ciclos. Si el mecanismo está trabado y despeja el respaldo en 30 ciclos, la energía sube a unas 16. El trabajador vestido con categoría 2, es decir 8 calorías, queda subprotegido y la etiqueta no le avisa.

Por eso el 130.5(G) dice que el análisis de energía incidente debe considerar el tiempo de despeje incluyendo la condición de mantenimiento, y revisarse al menos cada cinco años. Y las tablas de EPP solo valen dentro de sus tiempos máximos. Cuando el equipo no se mantiene, la tabla y la etiqueta dejan de valer. La cadena es esta: estado del equipo, condición eléctrica, comportamiento ante la falla, tiempo de despeje, energía, exposición y consecuencia.

*En corriente alterna el interruptor es el protagonista. En un banco de baterías, muchas veces no hay ninguno dentro de la cadena. Pasemos al Artículo 320.*"

### Integrante 3 (D9–D12)

"El Artículo 320 aplica a baterías estacionarias de más de 50 voltios nominales. Tiene un dato que deben recordar: el umbral en corriente continua es 100 voltios; por encima, se requieren controles. Y un requisito que no es opcional: antes de cualquier trabajo en una batería se hace una evaluación de riesgos de los peligros químicos, de choque y de arco. Es el 320.3(A)(2).

¿Por qué tanto énfasis? Porque una batería no se puede desenergizar. Puedo abrir el interruptor, pero las celdas siguen con tensión en sus bornes.

Segundo, el arco en continua. En alterna la corriente pasa por cero 120 veces por segundo y eso ayuda a que el arco se apague. En continua no hay cruce por cero. Y si el cortocircuito ocurre entre celdas de la misma cadena, la corriente no pasa por ningún interruptor: solo la limita la resistencia interna de las celdas.

Ahora las tablas. La 130.4(E)(b), para 50 a 300 voltios en continua, fija la frontera limitada en 1 metro para partes fijas y la restringida en 'evitar el contacto'. La 130.5(C) dice que trabajar en conductores de celdas en serie tiene probabilidad de arco 'sí'. Y la 130.7(C)(15)(b), para 100 a 250 voltios y entre 7 y 15 kiloamperios, da categoría 3 y frontera de arco de 1,8 metros, suponiendo 2 segundos de arco porque no hay quien lo despeje.

Ojo con un detalle: 250 voltios es la tensión nominal, pero en flotación el banco trabaja cerca de 281. Justo por encima del límite de la fila. Lo discutiremos en el caso.

Nuestro escenario es un centro de datos con un banco de 125 celdas de plomo-ácido inundadas, en dos bastidores de dos niveles, con el bus de continua no puesto a tierra y un interruptor de 400 amperios a seis metros.

*Pero una batería no es solo un peligro eléctrico. También es un pequeño reactor químico que produce hidrógeno.*"

### Integrante 4 (D13–D15)

"Las baterías de plomo-ácido inundadas tienen electrolito de ácido sulfúrico diluido. Cuando se sobrecargan, sobre todo en una carga de igualación, el agua se descompone: sale hidrógeno de un lado y oxígeno del otro. El hidrógeno se enciende a partir de 4 % en el aire y con una energía mínima muy pequeña, menor que la de una chispa de herramienta.

El 320.3(B) pide, si se maneja electrolito, gafas y protector facial para peligro eléctrico y químico, guantes y delantal, y un lavaojos dentro del área. Incluso leer la densidad con hidrómetro de bulbo cuenta como manejo de electrolito.

Contra la explosión hay tres barreras. La ventilación, que según el 240.1 se mantiene y se prueba con su detección y alarma. El apagallamas en cada celda, que según el 320.3(D) debe estar instalado y sin obstrucción: deja salir el gas pero no deja entrar una llama. Y el control de fuentes de ignición: herramientas aisladas, antichispa si la evaluación lo justifica, y prohibido fumar o usar llama.

Ahora, lo que pasó. A la 01:55 el técnico retiró todas las cubiertas del nivel superior para agilizar. A las 02:38, reapretando la conexión entre las celdas 118 y 119 con una matraca de acero sin aislamiento, la cabeza tocó el larguero del bastidor. Hubo un destello y un arco de casi un segundo, según el video. Casi al mismo tiempo, una detonación dentro de la celda 119, que tenía un tapón genérico sin apagallamas. Se rompió la tapa y saltó electrolito. El auxiliar fue al lavaojos: estaba vacío. Perdieron cerca de un minuto hasta llegar a un lavamanos.

Las evidencias: la matraca fundida, picaduras en el larguero y en el borne, un cable puente con el aislamiento desgastado contra el bastidor, cuatro tapones no originales y la alarma de falla a tierra inhibida en el registro.

*Ya sabemos qué pasó. Ahora, como peritos, vamos a responder por qué pasó.*"

### Integrante 5 (D16–D18)

"Si tocar el bastidor con una llave en un bus aislado no debería producir nada, ¿por qué hubo un arco? Porque el cable puente entre niveles ya estaba haciendo contacto con el bastidor. Había una falla a tierra preexistente. La matraca cerró el circuito a través de 56 celdas, unos 126 voltios, con varios kiloamperios, y ningún interruptor estaba en ese lazo. Con el método del Anexo D.5.1, eso da unas 2,3 calorías por centímetro cuadrado a la cara y casi 8 en la mano: coherente con las quemaduras de segundo grado.

Hicimos un análisis de barreras. Había ocho. Las cuatro primeras eran de mantenimiento: aislamiento del cable, alarma de falla a tierra, ventilación y apagallamas. Todas estaban fallidas antes de que el técnico tomara la llave. El EPP era la última barrera, no la primera.

Con cinco porqués llegamos a tres causas raíz. Una: el programa no trataba el mantenimiento como barrera de seguridad, como exige el 110.5(C), y permitía inhibir alarmas sin control. Dos: el plan de mantenimiento no incluía ventilación, apagallamas ni lavaojos, que piden el 240 y el 320.3(D). Tres: no había procedimiento ni competencia específica para baterías, ni control del contratista.

Las recomendaciones siguen la jerarquía del 110.5(H)(3): primero eliminar o sustituir, por ejemplo con monitoreo en línea o seccionando la cadena; luego ingeniería, como proteger el cable y hacer la alarma no inhibible; y solo al final el EPP.

Antes de las conclusiones, una pregunta para ustedes. \[Pregunta P1 de la Sección 12.\] Les damos 30 segundos.

&#91;Discusión.\]

Cerramos con tres ideas. El mantenimiento controla el tiempo, y el tiempo controla la energía. Una batería nunca está desenergizada. Y en un peritaje la pregunta no es quién se equivocó, sino qué barreras fallaron. Muchas gracias; quedamos atentos a sus preguntas."

### Consejos de ejecución para todos

- Mirar a la audiencia, no a la pantalla; señalar el numeral de la esquina al citarlo.
- Si se olvida un número, decir el concepto y el numeral: "la tabla de CC, 130.7(C)(15)(b), da categoría 3".
- Ensayar las transiciones: son lo que más evalúa "claridad pedagógica".
- Cronometrar dos ensayos completos; recortar ejemplos, nunca los numerales.

## 12. Preguntas para la audiencia

**P1 es la pregunta de control oficial** (D18). Las demás sirven para interacción durante la exposición o para el turno de preguntas.

### Pregunta de control (P1)

**P1. En el Caso 4, ¿cuál de estas medidas habría evitado el arco con mayor confiabilidad?**

- a) EPP de categoría 4 para el técnico.
- b) Detector de falla a tierra operativo y verificación de tensión polo–bastidor antes de iniciar.
- c) Etiqueta de arco en el bastidor.
- d) Permiso de trabajo energizado firmado.

**Respuesta: b.** Sin la falla a tierra preexistente, tocar el bastidor con la matraca no cerraba ningún circuito: se elimina el lazo de falla. (a) solo mitiga la lesión y no protege contra la explosión de la celda; (c) informa pero no controla; (d) es administrativo y habría ayudado solo si la evaluación detectaba la alarma inhibida. **Punto de discusión:** b está en los niveles de ingeniería y mantenimiento de la jerarquía de 110.5(H)(3); a está en el último.

### Preguntas conceptuales

**P2. ¿Por qué la Nota Informativa de 210.5 relaciona mantenimiento con energía incidente?** Respuesta: porque el mantenimiento inadecuado puede aumentar el tiempo de apertura del dispositivo de protección y la energía incidente crece con la duración del arco. Error típico: decir que aumenta la corriente de falla disponible; depende sobre todo de la fuente y la impedancia.

**P3. ¿Verdadero o falso? "Si abro el interruptor de CC del gabinete, el banco de baterías queda en condición de trabajo eléctricamente segura."** Respuesta: **falso.** El interruptor aísla la carga, pero las celdas mantienen tensión en sus bornes. Por eso el Art. 320 exige evaluación de riesgos y controles para trabajo con tensión (320.3(A)(2), 320.3(C)).

**P4. ¿Qué hace un apagallamas y qué numeral lo exige?** Respuesta: permite la salida de gases de la celda e impide que una llama externa se propague al interior, donde hay mezcla H₂/O₂. Lo exige 320.3(D): instalado correctamente, sin obstrucción y reemplazado según el fabricante.

### Preguntas de aplicación

**P5. Un técnico debe medir la tensión de cada celda de un banco de 250 V con puntas aisladas y sin retirar cubiertas no conductoras. ¿Probabilidad de arco según la Tabla 130.5(C)?** Respuesta: **"No"** en condición normal: prueba de tensión en celdas individuales y retiro de cubiertas no conductoras de conectores. Condición: que el equipo esté en condición normal según 110.4(D). Si el equipo está en condición anormal, cambia la evaluación.

**P6. El mismo banco, pero ahora se retiran cubiertas atornilladas de terminales y se reaprietan conexiones de celdas en serie. ¿Probabilidad?** Respuesta: **"Sí"** (Tabla 130.5(C)): trabajar en conductores energizados de celdas en serie y retirar cubiertas atornilladas de terminales. Se requieren medidas de protección adicionales.

**P7. Banco de 125 V CC, corriente de falla disponible de 5 kA. ¿Categoría de EPP y frontera de arco por tabla?** Respuesta: Tabla 130.7(C)(15)(b), fila 100–250 V, 4–7 kA → **categoría 2, frontera 1,2 m**, siempre que el arco no supere 2 s y la distancia de trabajo sea ≥ 455 mm.

### Preguntas sobre el caso

**P8. En el Caso 4, ¿por qué no disparó el interruptor de 400 A?** Respuesta: porque el lazo de falla (celdas 63–118, cable puente, bastidor, matraca) estaba **dentro de la cadena**; la corriente nunca pasó por el interruptor, que está entre la batería y la UPS.

**P9. ¿Por qué la camisa de algodón no fue la causa raíz?** Respuesta: porque es una causa inmediata (acto o condición). La causa raíz es por qué el trabajador llegó sin EPP adecuado ni herramientas aisladas: sin evaluación de riesgos, sin procedimiento y sin control del contratista.

### Preguntas "¿qué habría ocurrido si…?"

**P10. ¿Qué habría ocurrido si la celda 119 hubiera tenido su apagallamas?** Respuesta **\[Análisis\]:** el arco habría ocurrido igual (lo causó la falla a tierra), pero muy probablemente sin explosión interna ni proyección de electrolito. La lesión química ocular se habría evitado o reducido. Muestra que cada barrera controla un peligro distinto.

**P11. ¿Qué habría ocurrido si el extractor hubiera funcionado?** Respuesta **\[Análisis\]:** menor concentración de H₂ en la sala y alrededor de los tapones, pero la mezcla dentro de la celda existe siempre en una celda ventilada. La ventilación reduce el riesgo en la sala; el apagallamas protege el interior de la celda. Se necesitan ambas.

**P12. ¿Qué habría ocurrido si el técnico hubiera usado EPP de categoría 3 pero la misma matraca de acero?** Respuesta **\[Análisis\]:** el arco y la explosión habrían ocurrido igual. Las quemaduras por arco probablemente se habrían evitado (≈ 2–8 cal/cm² frente a 25 cal/cm² de la ropa), pero la protección ocular química dependía de gafas y protector facial adecuados (320.3(B)(1)). El EPP mitiga; no evita el evento.

**P13. ¿Qué habría ocurrido si el banco fuera VRLA en lugar de inundado?** Respuesta **\[Análisis/Fuente externa\]:** menor gasificación y electrolito inmovilizado, por lo que el peligro químico de manejo disminuye (Nota Inf. de 320.3(B)(2)). El peligro de choque y arco sería el mismo, y aparecería el riesgo de fuga térmica si la carga o la temperatura no se controlan.

## 13. Preguntas difíciles del profesor y respuestas

20 preguntas. Cada respuesta tiene la **idea central** (primera frase) y el **sustento**; quien responda debe decir primero la idea central y luego el numeral.

**1. ¿Por qué citan la edición 2021 si el taller dice 2020?** Porque la edición 2020 no existe: NFPA 70E se publicó en 2018, 2021 y 2024, y el documento entregado es la 2021. Los numerales citados son de ese texto. Además, la numeración del Art. 110 cambió respecto a 2018: el programa es 110.5 y la capacitación 110.6.

**2. ¿El Capítulo 2 dice cada cuánto hay que mantener un interruptor?** No, en general. 200.1(2) deja al empleador elegir el método y 205.3 remite a instrucciones del fabricante o normas de consenso (NFPA 70B, ANSI/NETA MTS, IEEE 3007.2). Sí hay intervalos explícitos en otros puntos: inspección visual de EPP ≤ 1 año y prueba de aislamiento ≤ 3 años (250.2), alarmas de baterías anuales (320.3(A)(5)), revisión del análisis de energía incidente y etiquetas ≤ 5 años (130.5(G), 130.5(H)).

**3. Si un interruptor no ha tenido mantenimiento, ¿puedo usar la Tabla 130.7(C)(15)(a)?** No con seguridad. La tabla vale dentro de un tiempo de despeje máximo; con un equipo no mantenido ese tiempo es desconocido, y 130.7(C)(15) exige análisis de energía incidente fuera de los parámetros. Además, 110.4(D) no se cumple. Opciones: probar el interruptor antes de trabajar, o calcular suponiendo que despeja el dispositivo aguas arriba.

**4. ¿Por qué no desenergizaron el banco antes del mantenimiento?** Porque una batería no se puede desenergizar: sus celdas siempre tienen tensión. Lo que sí se puede hacer es aislarla de la carga y del cargador y **seccionar** la cadena en tramos de menor tensión. El trabajo en bornes es por definición trabajo energizado, justificado por inviabilidad debida al diseño del equipo (110.4(B)), y por eso exige evaluación de riesgos y controles (320.3(A)(2), 130.2).

**5. ¿Se necesitaba permiso de trabajo eléctrico energizado?** Para el reapriete, sí. 130.2(A)(1) lo exige cuando se trabaja dentro de la frontera restringida, que en 50–300 V CC es "evitar el contacto" (Tabla 130.4(E)(b)). La exención de 130.2(C)(1) cubre pruebas, diagnóstico y medición de tensión, no el reapriete. Aun con exención, el trabajador necesita prácticas seguras y EPP según el Capítulo 1.

**6. El banco es de 250 V nominal, pero en flotación está en 281 V. ¿Qué fila de la tabla usan?** Es una zona gris y la tratamos como tal. Con 250 V nominal corresponde categoría 3 (1,8 m); con 281 V, categoría 4 (2,5 m). Nuestra posición es hacer el análisis de energía incidente de 130.5(G) con el Anexo D.5: con los datos supuestos da ≈ 11,5 cal/cm² a 455 mm, cubierto por categoría 3. Lo importante es documentar la decisión.

**7. ¿Por qué la tabla de CC supone 2 segundos de arco?** Porque en baterías frecuentemente no existe dispositivo de sobrecorriente en el lazo de falla, o no se conoce su tiempo de despeje. La nota (2) de la Tabla 130.7(C)(15)(b) lo establece y agrega que, si el tiempo de despeje se conoce y es menor, un análisis de energía incidente puede dar un resultado más representativo.

**8. ¿Cómo obtienen la corriente de cortocircuito si la placa no la indica?** Se pide al fabricante, como recomienda la Nota Inf. n.º 1 de 320.3(A)(6), porque depende de conexiones serie y paralelo, temperatura, estado de carga y cables. Como estimación conservadora, D.5.3 permite suponer 10 veces la capacidad de 1 minuto (a 1,75 V/celda, 25 °C). En nuestro caso, 8,5 kA es un supuesto.

**9. ¿Qué tan confiable es el método del Anexo D.5.1?** Es conservador por diseño: supone máxima potencia (tensión de arco igual a la mitad de la del sistema) y arco al aire libre, válido hasta 1000 V CC. Sirve para planificar EPP con margen; para reconstruir un accidente da un orden de magnitud. El Anexo D.5.2 remite a un método más detallado (Ammerman et al.).

**10. ¿Puede sostenerse un arco con solo 126 V CC?** Sí, con corrientes de kA y huecos cortos. En CC el arco se mantiene mientras la tensión de la fuente supere la tensión del arco y el hueco no crezca demasiado; no hay cruce por cero que lo apague. Por eso NFPA 70E fija el umbral de baterías en 100 V CC y la fila de la tabla empieza en 100 V. En el caso, el arco terminó cuando la herramienta fue expulsada y el hueco se alargó.

**11. En su caso, ¿cuál es el peligro y cuál el riesgo?** El peligro es la fuente de daño: tensión de 126–291 V CC con ≈ 8,5 kA prospectivos, H₂ y electrolito. El riesgo es la combinación de probabilidad y severidad: probabilidad alta de contacto (tarea "Sí" en la Tabla 130.5(C), falla a tierra oculta, herramienta no aislada) y severidad alta (quemaduras, explosión de celda).

**12. ¿No fue simplemente un error humano del técnico?** El error humano existió, pero es una causa inmediata. 110.5(H)(2) obliga a que la evaluación de riesgos considere el potencial de error humano; es decir, la norma espera que el sistema lo prevea. El técnico tocó el bastidor; el sistema permitió que el bastidor estuviera en un circuito de falla y que él llegara sin herramientas aisladas. Por eso las causas raíz son organizacionales.

**13. El hidrógeno es un peligro químico. ¿Por qué está en una norma eléctrica?** Porque el trabajo eléctrico aporta la fuente de ignición. El Art. 320 exige que la evaluación de riesgos de la batería incluya el peligro químico (320.3(A)(2)), letreros de gas explosivo (320.3(A)(6)) y apagallamas (320.3(D)); el 240.1 exige mantener la ventilación. NFPA 70E no reemplaza los códigos de incendio (NFPA 1 cap. 52), pero integra el peligro a las prácticas de trabajo.

**14. ¿Qué diferencia hay entre el Art. 240 y el Art. 320?** El 240 (Capítulo 2) es **mantenimiento**: mantener y probar la ventilación y sus alarmas, y mantener operativos los lavaojos. El 320 (Capítulo 3) son **prácticas de trabajo**: evaluación de riesgos, acceso, EPP, herramientas, letreros y apagallamas. En el caso fallaron ambos.

**15. ¿Las herramientas antichispa habrían evitado el arco?** No. Las herramientas antichispa (por ejemplo, de bronce o cobre-berilio) reducen chispas por impacto mecánico, pero son **conductoras**: si unen dos puntos con tensión, forman arco igual. Lo que evita el arco eléctrico son los mangos aislados listados (320.3(C)(1)) y evitar el contacto (320.3(C)(2)). Las antichispa se exigen solo cuando la evaluación lo justifica (320.3(C)(3)).

**16. Un bus de CC no puesto a tierra, ¿es más seguro o más peligroso?** Ambas cosas. Es más seguro frente a una **primera** falla a tierra: tocar un solo polo no cierra circuito. Es más peligroso si esa primera falla **no se detecta**, porque el sistema queda referenciado a tierra sin que nadie lo sepa, y la siguiente falla produce un cortocircuito. Por eso la detección de falla a tierra y su prueba anual (320.3(A)(5)) son barreras críticas.

**17. ¿Qué EPP químico exige la norma y qué pasa con la ropa de arco?** 320.3(B)(1): gafas y protector facial apropiados para el peligro eléctrico y químico, guantes y delantal para el químico, y lavaojos en el área. La nota (1) de la Tabla 130.7(C)(15)(b) agrega que la ropa expuesta a electrolito debe estar evaluada para protección contra electrolito (ASTM F1296) y tener clasificación de arco (ASTM F1891).

**18. ¿Por qué el umbral de choque es 100 V en CC y 50 V en CA?** Porque, para la misma tensión, la CC es fisiológicamente menos propensa a causar fibrilación y el efecto de "no poder soltar" es menor (IEC TS 60479-1). La norma lo refleja en 320.3(A)(1). No significa que la CC sea inocua: por encima de 100 V exige controles, y a 250–290 V la corriente de contacto puede ser peligrosa.

**19. ¿Cómo determinarían la duración real del arco en un peritaje real?** Cruzando fuentes: video con conteo de fotogramas, registros del monitor o la UPS con resolución de milisegundos (caída de tensión del bus), morfología del daño (profundidad de cráteres, masa de metal fundido) y, si hace falta, un ensayo de laboratorio con la misma herramienta y celdas. En nuestro caso, 0,9 s es un supuesto basado en video.

**20. ¿Cuáles son las limitaciones de su peritaje?** Es hipotético: los números son supuestos coherentes, no mediciones. No tenemos la resistencia interna real del fabricante, la concentración local de H₂ ni los informes médicos. D.5.1 sobreestima. La continuidad del cable se midió después del evento. Y usamos una traducción automática de la norma, por lo que los numerales deben verificarse en el texto oficial. Declararlo es parte del rigor del peritaje.

## 14. Diagramas, imágenes y recursos visuales

Diez diagramas cubren toda la exposición; cada uno tiene una sola idea. Paleta sugerida: gris para el equipo, **naranja para "mantenimiento"**, rojo para peligro, verde para controles; la misma en todas las diapositivas.

| # | Diagrama | Diapositiva | Integrante |
| --- | --- | --- | --- |
| 1 | Arquitectura del banco de baterías | D12 | I3 |
| 2 | Flujo de energía y lazo de falla | D12, D16 | I3, I5 |
| 3 | Identificación de peligros | D13 | I4 |
| 4 | Cadena causal del accidente | D8, D16 | I2, I5 |
| 5 | Jerarquía de controles | D17 | I5 |
| 6 | Línea de tiempo | D15 | I4 |
| 7 | Diagrama causa-efecto (Ishikawa) | Respaldo R4 | I5 |
| 8 | Flujo de investigación pericial | D16 o respaldo | I5 |
| 9 | Condición segura vs. encontrada | D15 | I4 |
| 10 | Medidas preventivas | D17 | I5 |

### Qué debe mostrar cada diagrama

**1. Arquitectura del banco.** Vista frontal de dos bastidores de dos niveles. Nivel inferior con celdas 1→62 de izquierda a derecha; nivel superior con 63→125 de derecha a izquierda. Cable puente vertical en el extremo derecho entre 62 y 63, pasando junto al larguero. Salidas (+) y (−) hacia un gabinete con interruptor de CC de 400 A, y de ahí a la UPS. Rótulos: "250 V nominal / 281 V flotación", "bus no puesto a tierra", "detector de falla a tierra". Marcar con un punto rojo el contacto cable–bastidor.

**2. Flujo de energía y lazo de falla.** Sobre el diagrama 1, flecha verde de operación normal (celdas → interruptor → UPS). Flecha roja del lazo de falla: celda 118 → celdas 117…63 → cable puente → bastidor → matraca → celda 118. Recuadro: "126 V, varios kA, ningún interruptor en el lazo".

**3. Identificación de peligros.** Corte lateral de una celda con seis íconos rodeándola: rayo (choque), destello (arco), gota (electrolito), nube H₂ (explosión), termómetro (térmico), fragmento (mecánico). Cada ícono con su numeral (Tabla 130.4(E)(b), Tabla 130.7(C)(15)(b), 320.3(B), 320.3(D) y 240.1, 320.3(A)(6)).

**4. Cadena causal.** Siete cajas horizontales conectadas por flechas: Estado del equipo → Condición eléctrica → Comportamiento ante la falla → Tiempo de despeje → Energía liberada → Exposición → Consecuencia. Debajo de cada caja, en letra pequeña, el dato del Caso 4 (Sección 7.6). Las dos primeras cajas en naranja (mantenimiento).

**5. Jerarquía de controles.** Pirámide invertida de seis niveles de 110.5(H)(3): eliminación, sustitución, ingeniería, concientización, administrativos, EPP. En cada nivel, una medida del caso (Sección 8.1). Flecha lateral: "más efectivo ↑ / depende del trabajador ↓".

**6. Línea de tiempo.** Eje horizontal de 01:30 a 02:50. Hitos: acceso (01:30), sin plan (01:45), retiro de cubiertas (01:55), densidades (02:25), **arco y explosión (02:38)**, lavaojos vacío (02:39), alarma UPS (02:41). Arriba, en naranja, las condiciones latentes previas: alarma inhibida (−5 meses), extractor detenido (−19 días), igualación (−20 h).

**7. Diagrama causa-efecto.** Espina de pescado con efecto "Arco + explosión de celda 119". Espinas (6M): Mano de obra (capacitación vencida, hábitos de CA), Método (sin evaluación ni plan), Máquina/equipo (cable desgastado, apagallamas faltante), Materiales/herramientas (matraca no aislada), Medio ambiente (sin ventilación, H₂ post-igualación), Medición/gestión (alarma inhibida, sensor sin calibrar).

**8. Flujo de investigación pericial.** Diagrama de flujo vertical: Asegurar la escena → Preservar evidencias con cadena de custodia → Recopilar registros (BMS, mantenimiento, capacitación) → Entrevistas → Reconstrucción física y cálculos → Análisis de barreras y causa raíz → Contraste con NFPA 70E → Conclusiones y limitaciones → Recomendaciones. Nota al pie: "110.5(J) exige que el programa incluya investigación de incidentes".

**9. Condición segura vs. encontrada.** Tabla visual de dos columnas con ✓ y ✗: alarma de falla a tierra activa ✗; extractor funcionando ✗; apagallamas en todas las celdas ✗; lavaojos operativo ✗; herramientas aisladas ✗; una conexión expuesta ✗; EPP de arco y químico ✗; evaluación y plan ✗; acceso autorizado ✓; iluminación ✓.

**10. Medidas preventivas.** Tres columnas: Correctivas inmediatas, Preventivas de ingeniería y Preventivas de gestión, cada una con 3–4 íconos y numerales (Secciones 5.26, 5.27 y 8).

### Imágenes recomendadas

- Foto propia o de banco libre de una sala de baterías con bastidores (D1, D12). Evitar fotos de lesiones.
- Fotografía de catálogo de un tapón con apagallamas (D13), citando al fabricante.
- Foto de herramientas con mangos aislados frente a herramientas comunes (D14).
- Todas las imágenes con fuente en pie de foto; no usar fotos de accidentes reales sin fuente.

### Diagramas del Caso 4 listos para la exposición

Los tres diagramas usan los datos supuestos del caso. Sus textos se pueden editar directamente en el documento; para PowerPoint, basta una captura de cada uno.

&#91;embedded content: Diagrama 4 · cadena causal del Caso 4 · 7 eslabones\]

Los dos primeros eslabones, en color, son los que creó el mantenimiento deficiente. Desde ahí la cadena ya no tenía ningún dispositivo que cortara la falla. Diapositivas D8 y D16.

&#91;embedded content: Diagrama 6 · línea de tiempo · 3 condiciones latentes y 7 hitos\]

Las tres condiciones de arriba ya existían antes de que el técnico entrara; la noche del evento solo aportó el disparador. Diapositiva D15.

&#91;embedded content: Análisis de barreras · 8 barreras alineadas · modelo de queso suizo\]

El peligro atraviesa las ocho barreras porque todas tenían su agujero en el mismo lugar. Las cuatro primeras, en color, eran responsabilidad del mantenimiento y fallaron antes que el trabajador. Diapositiva D16.

## 15. Referencias bibliográficas (APA 7)

La fuente normativa principal es NFPA 70E 2021, consultada en la traducción automática entregada en clase. Las demás referencias se citan en el texto como **\[Fuente externa\]**. Antes de entregar, verificar año de edición y DOI de cada norma en el catálogo del editor: aquí se omiten los DOI para no citar identificadores no verificados.

### Normas y documentos oficiales

ASTM International. (2014). *Standard specification for rubber insulating gloves* (ASTM D120-14a).

Institute of Electrical and Electronics Engineers. (2005). *IEEE recommended practice for maintenance, testing, and replacement of valve-regulated lead-acid (VRLA) batteries for stationary applications* (IEEE Std 1188-2005).

Institute of Electrical and Electronics Engineers. (2010). *IEEE recommended practice for the maintenance of industrial and commercial power systems* (IEEE Std 3007.2-2010).

Institute of Electrical and Electronics Engineers. (2018). *IEEE guide for performing arc-flash hazard calculations* (IEEE Std 1584-2018).

Institute of Electrical and Electronics Engineers. (2018). *IEEE recommended practice for personnel qualifications for installation and maintenance of stationary batteries* (IEEE Std 1657-2018).

Institute of Electrical and Electronics Engineers. (2020). *IEEE recommended practice for maintenance, testing, and replacement of vented lead-acid batteries for stationary applications* (IEEE Std 450-2020).

Institute of Electrical and Electronics Engineers & American Society of Heating, Refrigerating and Air-Conditioning Engineers. (2018). *IEEE/ASHRAE guide for the ventilation and thermal management of batteries for stationary applications* (IEEE/ASHRAE Std 1635-2018).

International Electrotechnical Commission. (2005). *Effects of current on human beings and livestock — Part 1: General aspects* (IEC TS 60479-1:2005).

International Safety Equipment Association. (2014). *American national standard for emergency eyewash and shower equipment* (ANSI/ISEA Z358.1-2014).

InterNational Electrical Testing Association. (2019). *Standard for maintenance testing specifications for electrical power equipment and systems* (ANSI/NETA MTS-2019).

National Fire Protection Association. (2020). *NFPA 1: Fire code* (2021 ed.). NFPA.

National Fire Protection Association. (2020). *NFPA 70E: Standard for electrical safety in the workplace* (2021 ed.). NFPA.

National Fire Protection Association. (2022). *NFPA 70: National Electrical Code* (2023 ed.). NFPA.

National Fire Protection Association. (2022). *NFPA 70B: Standard for electrical equipment maintenance* (2023 ed.). NFPA.

Occupational Safety and Health Administration. (s. f.). *Electrical — Wiring methods, components, and equipment for general use: Storage batteries* (29 CFR 1910.305(j)(7)). U.S. Department of Labor.

Occupational Safety and Health Administration. (s. f.). *Batteries and battery charging* (29 CFR 1926.441). U.S. Department of Labor.

U.S. Department of Energy. (1992). *Root cause analysis guidance document* (DOE-NE-STD-1004-92).

U.S. Department of Energy. (2013). *Electrical safety* (DOE-HDBK-1092-2013).

### Artículos científicos y libros

Ammerman, R. F., Gammon, T., Sen, P. K., & Nelson, J. P. (2010). DC-arc models and incident-energy calculations. *IEEE Transactions on Industry Applications, 46*(5), 1810–1819.

Bird, F. E., & Germain, G. L. (1985). *Practical loss control leadership*. International Loss Control Institute.

Crowl, D. A., & Louvar, J. F. (2011). *Chemical process safety: Fundamentals with applications* (3.ª ed.). Prentice Hall.

Doan, D. R. (2010). Arc flash calculations for exposures to DC systems. *IEEE Transactions on Industry Applications, 46*(6), 2299–2302.

Reason, J. (1997). *Managing the risks of organizational accidents*. Ashgate.

### Material del curso

Guía y taller práctico de aprendizaje: NFPA 70E 2021 \[Documento del curso\]. (2026).

Modelo de informe pericial técnico, expediente EXP-2026-9876 \[Documento del curso\]. (2026).

## 16. Checklist final de cumplimiento de la rúbrica

### Requisitos del taller

- [ ] Exposición ajustada a 30 min (ensayada dos veces con cronómetro)
- [ ] 10 min de preguntas con moderador (I5) y reparto por tema
- [ ] Explicación teórica del Cap. 2 y del Art. 320 con sus requisitos técnicos
- [ ] Caso práctico industrial (Caso 4) desarrollado
- [ ] Pregunta de control para la audiencia (P1) con respuesta y discusión
- [ ] Trabajo escrito redactado por el grupo (≤ 35 % de coincidencia o IA)

### Dominio técnico de la norma (30 %)

- [ ] Cada integrante cita al menos 3 numerales sin leerlos
- [ ] Se explica la Nota Inf. de 210.5 y 130.5(G) (mantenimiento → despeje → energía)
- [ ] Se explican 110.4(D) y 110.5(C)
- [ ] Se explican 320.3(A)(1)–(6), 320.3(B), 320.3(C) y 320.3(D)
- [ ] Se usa la numeración 2021, no la de 2018
- [ ] Se dice "relámpago de arco", no "ceniza de arco"

### Resolución del caso práctico (30 %)

- [ ] Peligros de CC explicados: choque y arco (lo pide el Caso 4)
- [ ] Peligro de hidrógeno y electrolito explicado (lo pide el Caso 4)
- [ ] Controles contra choque y contra explosión explícitos (Sección 8.2 y 8.3)
- [ ] Fronteras de choque en CC (Tabla 130.4(E)(b)) sin errores
- [ ] Categoría de EPP (Tabla 130.7(C)(15)(b)) y discusión 250 V vs. 281 V
- [ ] EPP químico de 320.3(B)(1)
- [ ] Supuestos del caso etiquetados como tales

### Claridad pedagógica (20 %)

- [ ] Diapositivas con ≤ 6 líneas y un visual dominante
- [ ] Cadena causal, línea de tiempo, barreras y jerarquía de controles presentes
- [ ] Energía incidente explicada con el ejemplo de 1,6 → 16 cal/cm²
- [ ] Transiciones ensayadas entre integrantes

### Respuesta a preguntas y debate (20 %)

- [ ] Todos leyeron las 20 preguntas difíciles
- [ ] Cada respuesta empieza con la idea central y cierra con el numeral
- [ ] Diapositivas de respaldo R1–R5 listas
- [ ] El grupo sabe declarar las limitaciones del caso sin ponerse a la defensiva

## Anexo. Peritaje técnico del caso de la reunión (tablero de 480 V, empresa manufacturera)

**Este anexo no forma parte del taller.** Desarrolla el caso dictado en la sesión del 21 de septiembre de 2026 con la misma estructura pericial. **Dictamen en una línea:** con los hechos dictados, el incumplimiento demostrable es la falta de evaluación de riesgo de arco, de etiqueta de arco y de EPP con clasificación de arco; la ausencia de candado y etiqueta de bloqueo **no es por sí sola una no conformidad** en una medición de tensión, que por definición se hace con el equipo energizado.

### A.1 Identificación

| Campo | Contenido |
| --- | --- |
| Solicitante | Compañía aseguradora (enunciado) |
| Perito | Ingeniero electricista idóneo (enunciado) |
| Fecha de inspección | Tres días después del evento (enunciado) |
| Lugar | Tablero de distribución de 480 V en una empresa manufacturera alimentada en media tensión trifásica (enunciado) |
| Objeto | Determinar la naturaleza del evento (choque o arco), sus causas técnicas y el cumplimiento de NFPA 70E |
| Norma | NFPA 70E 2021 |

### A.2 Hechos del enunciado (lo único que se da por cierto)

1. Empresa manufacturera, suministro trifásico en media tensión.
2. Técnico electricista **calificado** realizaba una **medición de rutina** en un tablero de distribución **energizado a 480 V**.
3. Ocurrió un evento que "pudo haber sido" una descarga o un arco eléctrico.
4. El perito es contratado por la aseguradora **tres días después**.
5. Al llegar: no había etiqueta ni candado (bloqueo/etiquetado); no había señalización de energía incidente; el trabajador no portaba EPP con clasificación de arco adecuado; vestía camisa de algodón común, sin chaqueta ni traje de protección contra arco.

**\[Análisis\]** Sobre la definición de media tensión dictada en clase (1 kV a 115 kV): el rango depende de la norma que se cite. Por ejemplo, ANSI C84.1 **\[Fuente externa\]** clasifica como media tensión a los sistemas mayores de 1 kV y menores de 100 kV. Conviene citar explícitamente la norma usada. Para este peritaje el dato relevante no es la clase de tensión de la acometida, sino que el tablero de 480 V está aguas abajo de un transformador cuya potencia e impedancia fijan la corriente de falla disponible.

### A.3 Datos faltantes que el perito debe solicitar

| Dato | Por qué es necesario |
| --- | --- |
| Tipo de equipo (panelboard, switchboard, CCM, switchgear) | Cambia la fila de la Tabla 130.7(C)(15)(a): de categoría 2 (900 mm) a categoría 4 (6 m) |
| Potencia y %Z del transformador; corriente de falla disponible en el tablero | Requisito de la tabla y del análisis de energía incidente |
| Dispositivo de protección aguas arriba, ajustes y **historial de mantenimiento** | Tiempo de despeje (130.5(G)); vínculo con el Cap. 2 |
| Registros del relé o del interruptor (disparos, hora) | Distingue arco (disparo por falla) de choque (sin disparo) |
| Informe médico (lesiones, marcas de entrada y salida, distribución de quemaduras) | Diferencial choque vs. arco |
| Instrumento de medición usado (categoría de medición, estado de puntas) | 110.8 |
| Existencia de estudio de arco, programa de seguridad eléctrica, plan de trabajo | 130.5, 110.5, 110.5(I) |
| Estado de la escena en los tres días | Validez de las evidencias |

### A.4 Determinación del tipo de evento (diagnóstico diferencial)

**\[Análisis\]** El enunciado deja abierta la naturaleza del evento; el perito debe resolverla con evidencia física:

| Indicador | Sugiere choque eléctrico | Sugiere relámpago de arco |
| --- | --- | --- |
| Lesiones | Marcas de entrada y salida; lesión interna; posible arritmia | Quemaduras térmicas en superficies expuestas (rostro, manos, antebrazos); ropa encendida |
| Equipo | Sin daño o daño mínimo | Hollín, perlas de cobre, picaduras en barras, puntas o multímetro fundidos |
| Protecciones | Normalmente sin disparo | Disparo del interruptor o fusión de fusibles registrada |
| Testigos | Trabajador "se quedó pegado" o fue proyectado | Destello, estruendo, onda de presión |
| Ropa | Poco daño | Algodón quemado o carbonizado en frente y mangas |

Pueden coexistir: un contacto con la punta puede iniciar un arco fase-tierra o fase-fase.

### A.5 Análisis de los hallazgos frente a NFPA 70E

**Hallazgo 1 — "No había candado ni etiqueta de bloqueo".**

- **\[NFPA 70E\]** La medición de tensión es una tarea que exige el equipo energizado; el trabajo energizado se permite cuando la tarea es inviable desenergizada (110.4(B)), y la medición de tensión por persona calificada está **exenta de permiso de trabajo energizado** (130.2(C)(1)), siempre que se usen prácticas seguras y EPP del Capítulo 1.
- **\[Análisis\]** La ausencia de bloqueo **es esperable** durante la medición. Solo sería no conformidad si la tarea real incluía trabajo que podía hacerse desenergizado (por ejemplo, ajustar conexiones), en cuyo caso aplica 110.3 y el Art. 120. El perito debe establecer qué se hacía exactamente.

**Hallazgo 2 — "No había señalización de energía incidente".**

- **\[NFPA 70E\] 130.5(H):** los tableros que probablemente requieran examen, ajuste, servicio o mantenimiento energizados deben tener etiqueta con tensión nominal, frontera de arco y al menos energía incidente con distancia de trabajo, o categoría de EPP, o clasificación mínima de la ropa, o EPP específico del sitio. Una "medición de rutina" confirma que el tablero se examina energizado.
- **\[Análisis\]** No conformidad demostrada; sugiere además que no existía evaluación de riesgo de arco (130.5) ni análisis documentado (130.5(D)).

**Hallazgo 3 — EPP inadecuado y camisa de algodón común.**

- **\[NFPA 70E\]** Si la evaluación de riesgo de arco indica que se requiere EPP, se selecciona por análisis de energía incidente (130.5(G)) o por categoría (130.7(C)(15)). La Tabla 130.7(C)(15)(c) exige ropa con clasificación de arco desde la categoría 1. Las prendas inflamables que no se funden solo se admiten como capas inferiores de un sistema con clasificación de arco (130.7(C)).
- **\[NFPA 70E\] Tabla 130.5(C):** para CA, "trabajo en conductores energizados, incluidas las pruebas eléctricas" tiene probabilidad de arco **"Sí"**. Por tanto se requerían medidas de protección adicionales.
- **\[Análisis\]** El algodón común no tiene clasificación de arco: puede encenderse y seguir ardiendo, lo que agrava la quemadura. No es correcto decir que es "altamente inflamable" en términos genéricos; lo técnicamente preciso es que **no está clasificado para arco**.

### A.6 Fronteras y EPP que debieron aplicarse (condicionado al tipo de tablero)

- **Choque \[NFPA 70E\] Tabla 130.4(E)(a), 151–750 V:** frontera limitada 1,0 m (parte fija expuesta); frontera restringida 0,3 m. La medición cruza la frontera restringida → guantes aislantes con protectores de cuero y herramientas o puntas aisladas.
- **Arco \[NFPA 70E\] Tabla 130.7(C)(15)(a):**

| Si el equipo es… | Parámetros máximos | Categoría | Frontera de arco |
| --- | --- | --- | --- |
| Panelboard > 240 V hasta 600 V | 25 kA; 0,03 s | 2 | 900 mm |
| CCM clase 600 V | 65 kA; 0,03 s | 2 | 1,5 m |
| CCM clase 600 V | 42 kA; 0,33 s | 4 | 4,3 m |
| Switchgear o switchboard clase 600 V | 35 kA; hasta 0,5 s | 4 | 6 m |

**\[Análisis\]** Sin conocer el tipo de equipo, la corriente disponible y el tiempo de despeje, **no se puede afirmar qué categoría correspondía**; sí se puede afirmar que el algodón común no cumplía ninguna. Si el interruptor aguas arriba no tenía mantenimiento, ni la tabla ni un estudio serían válidos (130.5(G), Nota Inf. de 210.5): vínculo directo con el Módulo D.

- **Instrumento \[NFPA 70E\] 110.8(B):** clasificado para el circuito, aprobado para el propósito y usado según el fabricante; la Nota Inf. remite a UL 61010-1 y UL 61010-2-033.

### A.7 Causas

- **Causa inmediata (probable, a confirmar):** contacto accidental de la punta o de la mano con partes energizadas, o deslizamiento de la punta entre fases o hacia tierra.
- **Condiciones inseguras:** tablero sin etiqueta de arco; posible falta de barreras aislantes temporales; posible instrumento no adecuado (a verificar).
- **Actos inseguros:** trabajo energizado sin EPP de arco ni ropa clasificada.
- **Causas básicas:** sin evaluación de riesgos (110.5(H)); sin plan de trabajo ni informe previo (110.5(I)); EPP no provisto o no exigido.
- **Causa raíz probable:** programa de seguridad eléctrica inexistente o no implementado (110.5(A)); estudio de arco no realizado (130.5).

### A.8 Recomendaciones

1. **Eliminación y sustitución:** instalar medidores permanentes o puertos de prueba de tensión para que las mediciones de rutina no requieran abrir el tablero **\[Análisis\]** (jerarquía de 110.5(H)(3)).
2. **Ingeniería:** evaluar ajustes de mantenimiento o reducción de energía en el interruptor aguas arriba **\[Fuente externa\]** y verificar su mantenimiento (205.4).
3. **Concientización:** etiquetas de arco según 130.5(H).
4. **Administrativos:** estudio de arco documentado y revisado ≤ 5 años (130.5(G)); programa de seguridad eléctrica (110.5); plan e informe previo (110.5(I)); investigación del incidente (110.5(J)).
5. **EPP:** dotación por categoría o por energía incidente, con guantes aislantes y careta o capucha con clasificación de arco.

### A.9 Conclusiones

1. La medición de rutina era trabajo energizado permitido, exento de permiso, **pero no exento** de evaluación de riesgos ni de EPP.
2. La ausencia de etiqueta de arco y de EPP con clasificación de arco son no conformidades demostradas con los hechos dictados.
3. La ausencia de bloqueo no es no conformidad para una medición; se debe aclarar la tarea real.
4. La naturaleza del evento (choque, arco o ambos) no puede determinarse con el enunciado: requiere las evidencias de A.4.

### A.10 Limitaciones

- Tres días de demora: la escena pudo alterarse (limpieza, reenergización, reparación). Debe consultarse si se preservó.
- Enunciado incompleto (la grabación se interrumpe antes del análisis).
- Sin datos de corriente de falla, protección, tipo de equipo ni informe médico.

### A.11 Observaciones al modelo de informe pericial entregado (para mejorar el propio)

| En el modelo dice | Precisión técnica sugerida **\[Análisis\]** |
| --- | --- |
| "Art. 110.5 / 130.2 exige desenergizar obligatoriamente… mediante LOTO" | La condición de trabajo eléctricamente segura está en 110.3 y el Art. 120; 110.5 es el programa y 130.2 el permiso. El trabajo energizado se permite en los casos de 110.4 |
| "Causa raíz directa" | Usar "causa inmediata"; la causa raíz es por definición sistémica |
| "Algodón altamente inflamable" | "Ropa sin clasificación de arco" |
| "Exponiendo intencionalmente al trabajador" | La intención no es determinable técnicamente; el perito describe condiciones, no intenciones |
| "Ley industrial internacional" | NFPA 70E es una norma de consenso; su obligatoriedad depende de su adopción por la autoridad competente |
| Sin apartado de limitaciones ni datos faltantes | Agregar limitaciones, supuestos y evidencias con cadena de custodia |
