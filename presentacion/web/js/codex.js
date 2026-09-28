/* =========================================================
   Lector normativo · Módulo D · NFPA 70E-2021
   Clic en la referencia (arriba a la derecha) → se abren los artículos y tablas
   de esa diapositiva, con lo que dicen, cómo se leen y cómo aplican al Caso 4.
   Textos: paráfrasis de NFPA 70E-2021; valores de tablas verificados contra la norma.
   ========================================================= */
(() => {
  /* ---------- Entradas ----------
     kind: tipo de referencia · tone: color semántico (maint, danger, ctrl, ice)
     says: [etiqueta, texto] · table: { cols, rows, hot, num } · pick: selector de caso
     read: pasos de lectura (col = columna que ilumina) · caso · key (idea clave) */
  const E = {
    '200.1': {
      kind: 'Artículo', tone: 'maint', title: 'Alcance del Capítulo 2', short: 'Qué es mantener',
      says: [
        ['(1) Alcance', 'El Capítulo 2 solo cubre el mantenimiento <b>directamente asociado con la seguridad</b> de los empleados, no todo el mantenimiento de la planta.'],
        ['(2) Método', 'No prescribe procedimientos ni métodos de prueba: el empleador elige <b>cómo</b> mantener.'],
        ['(3) Definición', 'Mantener es preservar o restaurar la condición del equipo <b>para la seguridad de quien trabaja expuesto</b> a riesgos eléctricos.']
      ],
      key: 'La norma no pide que el equipo dure: pide que <b>falle de forma predecible</b>.',
      caso: 'El banco daba respaldo a la UPS-2 (funcionaba), pero no estaba en condición segura: alarma de falla a tierra inhibida, extractor detenido y detector de H₂ sin calibrar.'
    },
    '205.3': {
      kind: 'Artículo', tone: 'maint', title: 'Mantenimiento general', short: 'Fabricante · responsable · registro',
      says: [
        ['Cómo', 'Según las instrucciones del fabricante o normas de consenso de la industria, <b>para reducir el riesgo asociado con fallas</b>.'],
        ['Quién', 'El propietario del equipo, o su representante designado, es el responsable.'],
        ['Registro', 'Debe <b>mantener y documentar</b>: sin registro no se puede demostrar la condición del equipo.'],
        ['Nota inf.', 'Remite a NFPA 70B, ANSI/NETA MTS e IEEE 3007.2.']
      ],
      caso: 'La alarma se inhibió durante 5 meses por "falsas alarmas" sin orden de trabajo ni registro: no hay mantenimiento documentado que respalde el estado del banco.'
    },
    '110.4(D)': {
      kind: 'Artículo', tone: 'maint', title: 'Condición normal de operación', short: 'Seis condiciones a la vez',
      says: [['Regla', 'Un equipo está en condición normal de operación solo si cumple <b>las seis condiciones al mismo tiempo</b>. Varias estimaciones de la norma dependen de esto.']],
      table: {
        cols: ['#', 'Condición', 'Ejemplo de incumplimiento'],
        rows: [
          ['1', 'Correctamente instalado', 'Conexiones sin el par de apriete del fabricante'],
          ['2', 'Adecuadamente mantenido', 'Interruptor sin pruebas; alarma inhibida'],
          ['3', 'Usado según instrucciones del fabricante', 'Operado fuera de su capacidad'],
          ['4', 'Puertas cerradas y aseguradas', 'Tablero abierto durante la maniobra'],
          ['5', 'Cubiertas en su lugar y aseguradas', 'Faltan sujetadores o tapas'],
          ['6', 'Sin evidencia de falla inminente', 'Olor a quemado, zumbido, calor, partes sueltas']
        ],
        hot: [1], num: [0]
      },
      read: [
        { t: 'Recorre las seis filas: <b>todas</b> deben cumplirse.', col: 1 },
        { t: 'Si falla <b>una</b>, el equipo ya no está en condición normal.', col: 2 },
        { t: 'Entonces las estimaciones "No" de la Tabla 130.5(C) <b>dejan de aplicar</b>.' }
      ],
      caso: 'La condición 2 fallaba: alarma inhibida, extractor detenido y detector vencido. Ninguna estimación "No" podía darse por válida en ese banco.'
    },
    '110.5(C)': {
      kind: 'Artículo', tone: 'maint', title: 'Programa: condición de mantenimiento', short: 'El programa incluye el mantenimiento',
      says: [
        ['Requisito', 'El programa de seguridad eléctrica debe incluir elementos que consideren <b>la condición de mantenimiento</b> de los equipos.'],
        ['Efecto', 'El mantenimiento deja de ser un asunto del activo y pasa a ser una <b>condición de trabajo</b>: antes de exponer a alguien hay que saber en qué estado está el equipo.']
      ],
      caso: 'CR1 del peritaje: el mantenimiento no se trataba como barrera. Se permitía inhibir alarmas sin control de cambios.'
    },
    '205.4': {
      kind: 'Artículo', tone: 'maint', title: 'Dispositivos de sobrecorriente', short: '205.4 · 225',
      says: [
        ['205.4', 'Los dispositivos de protección contra sobrecorriente se mantienen según fabricante o normas de consenso, y <b>el mantenimiento, las pruebas y las inspecciones se documentan</b>.'],
        ['225.1', 'Los fusibles se reemplazan por otros equivalentes: un fusible no limitador en lugar de uno limitador cambia el tiempo de despeje.'],
        ['225.3', 'Un interruptor que interrumpió una falla cercana a su capacidad se inspecciona y prueba antes de volver a servicio.']
      ],
      key: 'El dispositivo de protección <b>decide el tiempo</b>; el tiempo decide la energía.'
    },
    '205.7': {
      kind: 'Artículo', tone: 'maint', title: 'Envolventes, resguardos y enclavamientos', short: '205.7 · 205.8',
      says: [
        ['205.7', 'Las envolventes y resguardos se mantienen de modo que <b>sigan conteniendo o protegiendo</b>: cubiertas en su lugar con todos sus sujetadores.'],
        ['205.8', 'Enclavamientos y cerraduras se mantienen operativos: son los que impiden abrir con el equipo energizado.']
      ],
      caso: 'En el banco, las cubiertas de terminales de las 62 celdas superiores se retiraron a la vez: la barrera física desapareció antes de empezar.'
    },
    '240.1': {
      kind: 'Artículo', tone: 'ctrl', title: 'Baterías: ventilación y lavaojos', short: '240.1 · 240.2',
      says: [
        ['240.1', 'Si el diseño requiere ventilación, la ventilación natural o forzada se <b>examina y mantiene</b> para evitar mezclas explosivas, <b>incluida la prueba funcional</b> de la detección y alarma asociadas.'],
        ['240.2', 'Lavaojos y duchas de cuerpo completo se mantienen <b>en condición de funcionamiento</b>.']
      ],
      key: 'La ventilación controla el <b>combustible</b> del triángulo del fuego: por eso es mantenimiento, no EPP.',
      caso: 'Extractor disparado 19 días sin orden de trabajo, detector de H₂ con 26 meses sin calibrar y lavaojos vacío: 240.1 y 240.2 fallaron a la vez.'
    },
    '250.1': {
      kind: 'Artículo', tone: 'maint', title: 'EPP y herramientas', short: '250.1 – 250.4',
      says: [
        ['250.1', 'El EPP y las herramientas se mantienen en condición segura y confiable.'],
        ['250.2', 'Inspección visual <b>antes del primer uso</b> y a intervalos de <b>≤ 1 año</b>.'],
        ['250.3', 'El aislamiento de herramientas y equipo de protección se prueba a intervalos de <b>≤ 3 años</b>.'],
        ['250.4', 'Los instrumentos de prueba se verifican funcionalmente.']
      ],
      caso: 'El técnico usó una matraca de acero sin aislar: la herramienta aislada ni siquiera estaba en el área de trabajo.'
    },
    '205.2': {
      kind: 'Artículo', tone: 'maint', title: 'Información: unifilar y rótulos', short: '205.2 · 205.12',
      says: [
        ['205.2', 'El diagrama unifilar, cuando existe, se mantiene <b>legible y actualizado</b>.'],
        ['205.10–205.12', 'Identificación de componentes, circuitos y tensiones, y letreros de advertencia <b>legibles</b>.']
      ],
      key: 'Quien trabaja decide con la información que ve: si el unifilar miente, la evaluación también.',
      caso: 'El unifilar debía mostrar que el interruptor de 400 A está a 6 m, en la salida hacia la UPS-2: fuera de la cadena de celdas.'
    },
    '210.5': {
      kind: 'Nota informativa', tone: 'danger', title: 'Nota Inf. de 210.5: tiempo de apertura', short: 'Mantenimiento → tiempo',
      says: [
        ['210.5', 'Los dispositivos de protección se mantienen para que puedan <b>soportar o interrumpir</b> la corriente de falla disponible.'],
        ['Nota inf.', 'Un mantenimiento incorrecto o inadecuado puede <b>aumentar el tiempo de apertura</b> del dispositivo y, con ello, <b>la energía incidente</b>.']
      ],
      key: 'Es la frase que sostiene el módulo: <b>mantenimiento → tiempo → energía</b>.'
    },
    '130.5(G)': {
      kind: 'Artículo', tone: 'danger', title: 'Análisis de energía incidente', short: 'Incluye la condición de mantenimiento',
      says: [
        ['Qué considera', 'Las características del dispositivo de sobrecorriente y su tiempo de despeje, <b>incluida su condición de mantenimiento</b>.'],
        ['Cuándo se actualiza', 'Cuando hay cambios importantes y, en todo caso, se revisa a intervalos de <b>≤ 5 años</b>.']
      ],
      key: 'El estudio se calcula con el equipo <b>como fue diseñado</b>; el trabajador se expone al equipo <b>como está</b>.'
    },
    '130.5(H)': {
      kind: 'Artículo', tone: 'danger', title: 'Etiquetado del equipo', short: 'La etiqueta se actualiza',
      says: [
        ['Contenido', 'La etiqueta indica tensión nominal, frontera de arco y la energía incidente con su distancia de trabajo, o la categoría de EPP.'],
        ['Actualización', 'Si la revisión del análisis identifica un cambio que la vuelve inexacta, <b>la etiqueta se actualiza</b>.']
      ],
      key: 'Un despeje más lento <b>es un cambio</b>: la etiqueta vieja subprotege sin avisar.'
    },
    '130.7(C)(15)': {
      kind: 'Artículo', tone: 'danger', title: 'Método de categorías de EPP', short: 'Solo dentro de sus parámetros',
      says: [
        ['Uso', 'Las Tablas 130.7(C)(15)(a) y (b) permiten elegir la categoría de EPP <b>sin cálculo</b>, pero solo dentro de sus parámetros.'],
        ['Límites', 'Cada fila supone una corriente de falla <b>máxima</b> y un tiempo de despeje <b>máximo</b>. Si el equipo los supera, se requiere un <b>análisis de energía incidente</b> (130.5(G)).']
      ],
      key: 'Un mecanismo trabado saca al equipo de la tabla: la categoría "de tabla" deja de ser válida.'
    },
    'T130.7a': {
      kind: 'Tabla', tone: 'ice', code: 'Nota Inf. 1 · Tabla 130.7(C)(15)(a)', title: 'Tiempos típicos de despeje (CA)', short: 'Quién despeja y cuánto tarda',
      says: [['Qué es', 'La nota de la tabla de EPP para CA da los tiempos típicos con los que cada tipo de dispositivo despeja una falla. A 60 Hz, un ciclo dura ≈ 16,7 ms.']],
      table: {
        cols: ['Dispositivo que despeja', 'Ciclos (60 Hz)', 'Tiempo'],
        rows: [
          ['Fusible o interruptor limitador de corriente', '0,5', '≈ 8 ms'],
          ['Caja moldeada < 1000 V, con disparo instantáneo', '1,5', '≈ 25 ms'],
          ['Caja aislada, con disparo instantáneo', '3', '≈ 50 ms'],
          ['Interruptor de 1–35 kV con relé instantáneo', '5', '≈ 83 ms'],
          ['Baja tensión con retardo de tiempo corto', '20–30', '≈ 330–500 ms']
        ],
        hot: [4], num: [1, 2]
      },
      read: [
        { t: 'Identifica <b>qué dispositivo</b> despeja realmente la falla.', col: 0 },
        { t: 'Lee sus ciclos: <b>ciclos ÷ 60</b> = segundos.', col: 1 },
        { t: 'Como <b>E ∝ t</b>, pasar de 3 a 30 ciclos multiplica la energía por 10.', col: 2 }
      ],
      caso: 'Ejemplo de la slide 07: si el principal se traba, despeja el respaldo con retardo (30 ciclos) y la energía sube de 1,6 a ≈ 16 cal/cm².'
    },
    '320.1': {
      kind: 'Artículo', tone: 'ice', title: 'Alcance del Artículo 320', short: 'Baterías > 50 V',
      says: [
        ['320.1', 'Protege a los empleados que trabajan con <b>baterías estacionarias expuestas de más de 50 V nominales</b>.'],
        ['Capítulo 3', 'Complementa, no reemplaza, los Capítulos 1 y 2: el banco sigue sujeto al programa (Cap. 1) y al mantenimiento (Cap. 2).'],
        ['320.2', 'Define batería, celda, celda piloto, celda ventilada y VRLA, sala de baterías y <b>corriente de cortocircuito prospectiva</b>.']
      ],
      caso: 'Banco de 125 celdas de plomo-ácido ventiladas, 250 V nominales: está de lleno dentro del alcance.'
    },
    '320.2': {
      kind: 'Artículo', tone: 'ice', title: 'Corriente de cortocircuito prospectiva', short: 'Definiciones de 320.2',
      says: [
        ['Definición', 'La mayor corriente que podría circular en una falla con <b>impedancia cero</b> y sin que opere ninguna protección.'],
        ['Para qué sirve', 'Es el dato de entrada de la Tabla 130.7(C)(15)(b) y del Anexo D.5. Lo da el fabricante; D.5.3 permite estimarla como ≈ 10 × la capacidad de 1 minuto.']
      ],
      caso: '≈ 8,5 kA en bornes (dato del fabricante): cae en la franja de 7–15 kA a 250 V y de 7–10 kA por encima de 250 V.'
    },
    '320.3(A)': {
      kind: 'Artículo', tone: 'ice', title: 'Procedimientos de seguridad · generales', short: '320.3(A)(1)–(6)',
      says: [
        ['(1) Umbrales', 'Hay exposición al peligro de choque desde <b>100 V CC</b> (en CA, 50 V y 5 mA), salvo que se implementen controles apropiados.'],
        ['(2) Evaluación', '<b>Antes de cualquier trabajo</b> en un sistema de baterías se evalúan los peligros químicos, de choque y de arco de la tarea.'],
        ['(3) Acceso', 'Solo personal autorizado; no entrar sin iluminación suficiente.'],
        ['(4) Joyas', 'No usar objetos conductores (anillos, relojes) al trabajar en el sistema.'],
        ['(5) Alarmas', 'La instrumentación de alarmas por condición anormal, si existe, <b>se prueba anualmente</b>.'],
        ['(6) Letreros', 'Peligro eléctrico, químico, gas explosivo, prohibido fumar y llama, EPP y acceso restringido.']
      ],
      key: 'Una batería <b>no se puede desenergizar</b>: por eso la evaluación va antes de todo.',
      caso: 'Fallaron (2) sin evaluación ni plan, (4) anillo y reloj metálico, y (5) la alarma de falla a tierra estaba inhibida, sin prueba anual.'
    },
    'D.5': {
      kind: 'Anexo', tone: 'ice', title: 'Anexo D.5 · arco en CC', short: 'Máxima potencia',
      formula: 'I<sub>arc</sub> = 0,5 · I<sub>bf</sub><br>IE = 0,01 · V · I<sub>arc</sub> · T / D²',
      says: [
        ['Variables', 'IE en cal/cm² · V tensión del sistema (V) · I<sub>bf</sub> corriente de falla franca (A) · T tiempo de arco (s) · D distancia de trabajo (cm).'],
        ['Método', 'D.5.1, máxima potencia: para CC hasta 1000 V; supone que el arco toma la mitad de la corriente franca. Es <b>conservador</b>.'],
        ['D.5.3', 'Si no hay dato del fabricante, I<sub>bf</sub> ≈ 10 × la capacidad de 1 minuto de la batería.']
      ],
      table: {
        cols: ['Escenario', 'V', 'T', 'IE a 45,5 cm'],
        rows: [
          ['Reconstrucción (tramo C-118 → 63)', '126', '0,9 s', '≈ 2,3'],
          ['Planificación nominal', '250', '2 s', '≈ 10,3'],
          ['Planificación flotación', '281', '2 s', '≈ 11,5']
        ],
        hot: [0], num: [1, 2, 3]
      },
      read: [
        { t: 'I<sub>arc</sub> = 0,5 × 8500 A = <b>4250 A</b>.', col: 0 },
        { t: 'Multiplica tensión × corriente × tiempo.', col: 1 },
        { t: 'Divide entre la distancia al cuadrado: <b>acercarse duplica y triplica</b> la energía.', col: 3 }
      ],
      caso: 'Con la mano a 25 cm en lugar de 45,5 cm, la reconstrucción pasa de ≈ 2,3 a ≈ 7,7 cal/cm².'
    },
    'T130.4b': {
      kind: 'Tabla', tone: 'ice', code: 'Tabla 130.4(E)(b)', title: 'Fronteras de choque en CC', short: 'Distancias de aproximación',
      says: [['Qué es', 'Da las fronteras de aproximación por choque para sistemas de corriente continua, medidas <b>desde la parte energizada hasta el trabajador</b>.']],
      table: {
        cols: ['Tensión nominal', 'Limitada · conductor móvil', 'Limitada · parte fija', 'Restringida'],
        rows: [
          ['< 50 V', 'No especificado', 'No especificado', 'No especificado'],
          ['50 V – 300 V', '3,0 m', '1,0 m', 'Evitar el contacto'],
          ['301 V – 1 kV', '3,0 m', '1,0 m', '0,3 m'],
          ['1,1 kV – 5 kV', '3,0 m', '1,5 m', '0,5 m'],
          ['5 kV – 15 kV', '3,0 m', '1,5 m', '0,7 m']
        ],
        hot: [1], num: [1, 2, 3]
      },
      pick: { label: 'TENSIÓN DEL BANCO', options: [{ t: '250 V nominal', row: 1 }, { t: '281 V flotación', row: 1 }, { t: '291 V igualación', row: 1 }] },
      read: [
        { t: 'Busca la fila por <b>tensión nominal</b>.', col: 0 },
        { t: 'Un banco es una <b>parte fija</b>: el conductor móvil es para líneas aéreas.', col: 2 },
        { t: 'Limitada: no calificados fuera. Restringida: solo calificados, con EPP de choque.', col: 3 }
      ],
      caso: 'Las tres tensiones del banco caen en la misma fila: frontera limitada de <b>1,0 m</b> y restringida <b>"evitar el contacto"</b>. La tabla sigue hasta 800 kV; se muestran las filas de interés.'
    },
    'T130.5C': {
      kind: 'Tabla', tone: 'danger', code: 'Tabla 130.5(C)', title: 'Probabilidad de arco · tareas en baterías', short: '¿Es probable un arco?',
      says: [['Qué es', 'Estima si una tarea puede iniciar un arco. <b>"Sí"</b> obliga a medidas de protección contra arco; <b>"No"</b> solo vale si se cumple la condición indicada.']],
      table: {
        cols: ['Tarea en sistemas de CC · baterías', 'Condición del equipo', '¿Probable?'],
        rows: [
          ['Trabajar en conductores energizados de celdas conectadas en serie, incluidas pruebas eléctricas', 'Cualquiera', 'Sí'],
          ['Retirar cubiertas atornilladas, como las de terminales de batería', 'Cualquiera', 'Sí'],
          ['Insertar o retirar cubiertas de conectores entre celdas', 'Cualquiera', 'Sí'],
          ['Trabajar en equipos alimentados directamente por la fuente de CC', 'Cualquiera', 'Sí'],
          ['Mantenimiento y pruebas en celdas individuales en bastidor abierto', 'Anormal', 'Sí'],
          ['Insertar o retirar celdas individuales en bastidor abierto', 'Anormal', 'Sí'],
          ['Prueba de tensión en celdas individuales', 'Normal', 'No'],
          ['Retirar cubiertas no conductoras de conectores entre celdas', 'Normal', 'No'],
          ['Mantenimiento en una sola celda o unidad multicelda en bastidor abierto', 'Cualquiera', 'No']
        ],
        hot: [0, 1], num: [2]
      },
      read: [
        { t: 'Ubica la <b>tarea</b> que se va a hacer.', col: 0 },
        { t: 'Revisa la <b>condición</b>: "Normal" exige las seis de 110.4(D).', col: 1 },
        { t: 'Si dice <b>Sí</b>: EPP de arco y medidas de protección.', col: 2 }
      ],
      caso: 'Reapretar conexiones entre celdas en serie y retirar cubiertas de terminales: <b>Sí</b>, en cualquier condición. Además, el banco no estaba en condición normal.'
    },
    'T130.7b': {
      kind: 'Tabla', tone: 'danger', code: 'Tabla 130.7(C)(15)(b)', title: 'Categorías de EPP de arco en CC', short: 'Categoría y frontera',
      says: [['Qué es', 'Para baterías, tableros de CC y otras fuentes de CC da la <b>categoría de EPP</b> y la <b>frontera de arco</b> sin calcular, con arco de <b>2 s</b> como máximo y distancia de trabajo ≥ <b>455 mm</b>.']],
      table: {
        cols: ['Tensión', 'Corriente de falla disponible', 'Categoría EPP', 'Frontera de arco'],
        rows: [
          ['100 – 250 V', '< 4 kA', '2', '900 mm'],
          ['100 – 250 V', '4 – 7 kA', '2', '1,2 m'],
          ['100 – 250 V', '7 – 15 kA', '3', '1,8 m'],
          ['> 250 – 600 V', '< 1,5 kA', '2', '900 mm'],
          ['> 250 – 600 V', '1,5 – 3 kA', '2', '1,2 m'],
          ['> 250 – 600 V', '3 – 7 kA', '3', '1,8 m'],
          ['> 250 – 600 V', '7 – 10 kA', '4', '2,5 m']
        ],
        hot: [2, 6], num: [1, 2, 3]
      },
      pick: { label: 'BANCO DEL CASO 4 · ≈ 8,5 kA', options: [{ t: '250 V nominal', row: 2 }, { t: '281 V flotación', row: 6 }] },
      read: [
        { t: 'Elige el bloque por <b>tensión</b>.', col: 0 },
        { t: 'Dentro del bloque, la fila por <b>corriente de falla disponible</b>.', col: 1 },
        { t: 'Lee la <b>categoría</b> y la <b>frontera de arco</b>.', col: 2 }
      ],
      caso: 'Nominal (250 V): Cat. 3 y 1,8 m. En flotación (281 V) salta a <b>Cat. 4 y 2,5 m</b>. Ante la ambigüedad, el grupo propone un análisis de energía incidente (130.5(G)).',
      notes: ['Se asume arco de 2 s si no hay dispositivo de sobrecorriente o no se conoce el despeje.', 'La ropa expuesta a electrolito debe estar evaluada contra electrolito (ASTM F1296) y tener clasificación de arco (ASTM F1891).', 'Valores al aire libre: dentro de un recinto conviene protección adicional.']
    },
    '320.3(B)': {
      kind: 'Artículo', tone: 'ice', title: 'Peligro del electrolito', short: 'EPP químico y lavaojos',
      says: [
        ['(1) Con electrolito', 'Si se maneja electrolito líquido: gafas y protector facial para el peligro eléctrico <b>y</b> químico; guantes y delantal químicos; y <b>lavaojos portátil o fijo dentro del área</b> de trabajo.'],
        ['(2) Sin electrolito', 'En tareas que no lo manejan, gafas de seguridad. Leer la densidad con un <b>hidrómetro de bulbo</b> puede considerarse manejo de electrolito.'],
        ['Nota inf.', 'Las baterías VRLA y selladas presentan poco o ningún riesgo de electrolito en mantenimiento normal.']
      ],
      key: 'El lavaojos no es un accesorio: es parte del requisito, y debe estar <b>dentro del área</b>.',
      caso: 'T2 leyó densidades con hidrómetro (manejo de electrolito) y el lavaojos estaba vacío y vencido: ≈ 1 min hasta un lavamanos a 15 m.'
    },
    '320.3(C)': {
      kind: 'Artículo', tone: 'ctrl', title: 'Herramientas y equipo', short: 'Aisladas · sin contacto',
      says: [
        ['(1) Aisladas', 'Las herramientas tienen mangos <b>listados como aislados</b> para la tensión máxima de trabajo.'],
        ['(2) Sin contacto', 'Terminales y conductores se mantienen libres de contacto no intencional con herramientas, equipos de prueba, envases y objetos extraños.'],
        ['(3) Antichispa', 'Herramientas antichispa cuando la evaluación de riesgos lo justifique.']
      ],
      caso: 'La matraca de acero sin aislar tocó el larguero con el dado en el borne + de la celda 118: cerró el lazo y encendió el arco.'
    },
    '320.3(D)': {
      kind: 'Artículo', tone: 'ctrl', title: 'Apagallamas y ventilación de celdas', short: 'El tapón es una barrera',
      says: [
        ['Ventilación', 'Las aberturas de ventilación de las celdas se mantienen <b>sin obstrucción</b>.'],
        ['Apagallamas', 'Donde existen, se inspeccionan para verificar que estén <b>instalados y sin obstrucción</b>, y se reemplazan según el fabricante.'],
        ['Cómo funciona', 'El tapón deja salir el gas pero <b>no deja entrar la llama</b> a la mezcla H₂/O₂ del interior de la celda.']
      ],
      key: 'Controla la <b>ignición</b> del triángulo del fuego, justo donde está la mezcla más peligrosa.',
      caso: '4 tapones no originales y 1 apagallamas obstruido. La celda 119 tenía un tapón genérico: la chispa del arco entró y la celda detonó.'
    },
    '110.5(J)': {
      kind: 'Artículo', tone: 'danger', title: 'Investigación de incidentes', short: 'Aprender del evento',
      says: [
        ['Requisito', 'El programa debe incluir la investigación de incidentes eléctricos y de casi accidentes.'],
        ['Objetivo', 'Identificar <b>qué barreras fallaron</b> y corregir el programa, no buscar culpables.']
      ],
      caso: 'El peritaje reconstruye la noche del 14 de agosto: condiciones latentes, hecho, consecuencias y evidencias.'
    },
    '110.5(H)(3)': {
      kind: 'Artículo', tone: 'ctrl', title: 'Jerarquía de controles', short: 'De la fuente a la persona',
      says: [['Regla', 'La evaluación de riesgos aplica los controles en orden: primero los que actúan <b>en la fuente</b>, al final el EPP.']],
      table: {
        cols: ['Nivel', 'Control', 'Ejemplo en el banco'],
        rows: [
          ['1', 'Eliminación', 'Seccionar la cadena en tramos < 100 V'],
          ['2', 'Sustitución', 'Monitoreo en línea en lugar de tareas en caliente'],
          ['3', 'Ingeniería', 'Detector de falla a tierra, ventilación, apagallamas'],
          ['4', 'Concientización', 'Letreros y etiquetas'],
          ['5', 'Administrativo', 'Evaluación, plan de trabajo, permiso'],
          ['6', 'EPP', 'Ropa de arco, guantes, careta química']
        ],
        hot: [2], num: [0]
      },
      read: [
        { t: 'Empieza por arriba: <b>más eficaz</b>.', col: 1 },
        { t: 'Los tres primeros dependen menos del error humano.', col: 0 },
        { t: 'El EPP solo <b>mitiga</b>: es la última barrera.', col: 2 }
      ],
      caso: 'La medida que habría evitado el arco con mayor confiabilidad (detector operativo) está en ingeniería y mantenimiento, no en EPP.'
    },
    '110.6': {
      kind: 'Artículo', tone: 'ctrl', title: 'Capacitación y contratistas', short: '110.6 · 110.7',
      says: [
        ['110.6', 'Capacitación en los peligros específicos de la tarea y <b>reentrenamiento a intervalos ≤ 3 años</b>.'],
        ['110.7', 'El empleador anfitrión y el contratista intercambian información de peligros y se coordinan; el anfitrión informa las condiciones conocidas del equipo.']
      ],
      caso: 'T1: 12 años en CA y su primer banco inundado. El anfitrión autorizó el acceso sin informar la alarma inhibida ni verificar un plan de trabajo.'
    }
  };

  // Referencias de cada diapositiva (por etiqueta: número o respaldo)
  const MAP = {
    '02': ['200.1', '320.1'],
    '03': ['200.1', '205.3'],
    '04': ['110.4(D)', '110.5(C)', 'T130.5C'],
    '05': ['205.4', '205.7', '240.1', '250.1', '205.2'],
    '06': ['210.5', '130.5(G)', 'T130.7a'],
    '07': ['130.5(G)', 'T130.7a'],
    '08': ['110.4(D)', '130.5(H)', '130.7(C)(15)'],
    '09': ['320.1', '320.3(A)'],
    '10': ['D.5', '320.3(A)'],
    '11': ['T130.4b', 'T130.5C', 'T130.7b'],
    '12': ['320.2', '205.2'],
    '13': ['320.3(B)', '320.3(D)'],
    '14': ['240.1', '320.3(C)', '320.3(D)'],
    '15': ['110.5(J)', '320.3(A)'],
    '16': ['320.3(A)', '320.3(C)', '240.1', '320.3(D)'],
    '17': ['110.5(H)(3)', '110.5(C)', '110.6'],
    'R1': ['D.5'],
    'R2': ['T130.7b'],
    'R4': ['110.5(C)', '240.1', '110.6']
  };

  const code = k => E[k].code || k;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- Capa ---------- */
  const root = document.createElement('div');
  root.className = 'codex';
  root.id = 'codex';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Lector normativo');
  root.innerHTML = `
    <div class="cx-stage">
      <p class="cx-brand"><span class="sparkle">✦</span>LECTOR NORMATIVO · NFPA 70E-2021</p>
      <button class="cx-back" type="button"><span class="ar">←</span> REGRESAR A LA PRESENTACIÓN <b class="cx-from"></b></button>
      <nav class="cx-rail" aria-label="Referencias de la diapositiva"><p class="cx-rl">EN ESTA DIAPOSITIVA</p><ol></ol></nav>
      <article class="cx-body" tabindex="-1"></article>
      <p class="cx-foot">↑ ↓ CAMBIAR REFERENCIA · ESC REGRESAR</p>
      <p class="cx-src">PARÁFRASIS DE NFPA 70E-2021 · VALORES DE TABLA SEGÚN LA NORMA · CASO 4 HIPOTÉTICO</p>
    </div>`;
  document.body.appendChild(root);
  const cxStage = root.querySelector('.cx-stage');
  const rail = root.querySelector('.cx-rail ol');
  const body = root.querySelector('.cx-body');
  const from = root.querySelector('.cx-from');

  let keys = [];
  let cur = 0;
  let onClose = null;
  let lastFocus = null;

  function fit() {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    cxStage.style.setProperty('--s', s);
  }
  addEventListener('resize', fit);
  fit();

  function renderTable(t, e) {
    const num = new Set(t.num || []);
    const hot = new Set(t.hot || []);
    return `<table class="cx-table">
      <thead><tr>${t.cols.map((c, i) => `<th data-c="${i}">${c}</th>`).join('')}</tr></thead>
      <tbody>${t.rows.map((r, ri) => `<tr class="${hot.has(ri) ? 'hot' : ''}" style="--i:${ri}" data-r="${ri}">${r.map((c, ci) =>
        `<td data-c="${ci}" class="${num.has(ci) ? 'num' : ''}${c === 'Sí' ? ' yes' : c === 'No' ? ' no' : ''}">${c}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
    ${t.hot?.length ? `<p class="cx-legend"><i></i>FILA${t.hot.length > 1 ? 'S' : ''} DEL CASO 4</p>` : ''}`;
  }

  function render() {
    const k = keys[cur];
    const e = E[k];
    rail.querySelectorAll('button').forEach((b, i) => { b.classList.toggle('cur', i === cur); b.setAttribute('aria-current', i === cur ? 'true' : 'false'); });
    body.dataset.tone = e.tone;
    body.innerHTML = `
      <p class="cx-kicker">${e.kind.toUpperCase()} · NFPA 70E-2021</p>
      <h2 class="cx-code">${code(k)}</h2>
      <p class="cx-title">${e.title}</p>
      ${e.formula ? `<p class="cx-formula">${e.formula}</p>` : ''}
      <section class="cx-says"><p class="cx-h">QUÉ DICE</p>
        ${e.says.map(([l, t], i) => `<div class="cx-say" style="--i:${i}"><b>${l}</b><p>${t}</p></div>`).join('')}
      </section>
      ${e.table ? `<section class="cx-tbl"><p class="cx-h">${e.kind === 'Tabla' ? 'LA TABLA' : 'EN TABLA'}</p>
        ${e.pick ? `<div class="cx-pick" role="group" aria-label="${esc(e.pick.label)}"><span>${e.pick.label}</span>${e.pick.options.map((o, i) => `<button type="button" data-row="${o.row}" class="${i === 0 ? 'on' : ''}">${o.t}</button>`).join('')}</div>` : ''}
        ${renderTable(e.table, e)}
        ${e.notes ? `<ul class="cx-notes">${e.notes.map(n => `<li>${n}</li>`).join('')}</ul>` : ''}
      </section>` : ''}
      ${e.read ? `<section class="cx-read"><p class="cx-h">CÓMO SE LEE</p><ol>
        ${e.read.map((r, i) => `<li tabindex="0" ${r.col !== undefined ? `data-col="${r.col}"` : ''} style="--i:${i}"><span class="n">${String(i + 1).padStart(2, '0')}</span><p>${r.t}</p></li>`).join('')}
      </ol></section>` : ''}
      ${e.key ? `<p class="cx-key">${e.key}</p>` : ''}
      ${e.caso ? `<section class="cx-caso"><p class="cx-h">EN EL CASO 4</p><p>${e.caso}</p></section>` : ''}`;
    body.scrollTop = 0;
    if (e.pick) pickRow(e.pick.options[0].row);
  }

  function pickRow(r) {
    body.querySelectorAll('.cx-table tbody tr').forEach(tr => tr.classList.toggle('pick', +tr.dataset.r === r));
  }

  body.addEventListener('click', ev => {
    const b = ev.target.closest('.cx-pick button');
    if (!b) return;
    b.parentElement.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    pickRow(+b.dataset.row);
  });
  // Cada paso de lectura ilumina la columna que usa
  const hcol = c => { const t = body.querySelector('.cx-table'); if (t) t.dataset.hcol = c ?? ''; };
  body.addEventListener('pointerover', ev => { const li = ev.target.closest('.cx-read li'); hcol(li?.dataset.col); });
  body.addEventListener('pointerleave', () => hcol());
  body.addEventListener('focusin', ev => { const li = ev.target.closest('.cx-read li'); if (li) hcol(li.dataset.col); });

  rail.addEventListener('click', ev => {
    const b = ev.target.closest('button');
    if (!b) return;
    cur = +b.dataset.i;
    render();
  });
  root.querySelector('.cx-back').addEventListener('click', () => close());

  function open(label, { mood, slideTitle, done } = {}) {
    keys = (MAP[label] || []).filter(k => E[k]);
    if (!keys.length) return false;
    cur = 0;
    onClose = done;
    lastFocus = document.activeElement;
    root.dataset.mood = mood || 'maint';
    from.textContent = label;
    from.title = slideTitle || '';
    rail.innerHTML = keys.map((k, i) =>
      `<li style="--i:${i}"><button type="button" data-i="${i}"><i class="d"></i><span class="c">${code(k)}</span><span class="s">${E[k].short}</span></button></li>`).join('');
    fit();
    render();
    root.classList.add('open');
    root.querySelector('.cx-back').focus({ preventScroll: true });
    return true;
  }

  function close() {
    if (!root.classList.contains('open')) return;
    root.classList.remove('open');
    lastFocus?.focus?.({ preventScroll: true });
    onClose?.();
  }

  // Devuelve true si la tecla se consumió
  function key(k) {
    if (!root.classList.contains('open') || k === 'Tab') return false;
    if (k === 'Escape' || k === 'Backspace') close();
    else if (k === 'ArrowDown' || k === 'ArrowRight') { cur = (cur + 1) % keys.length; render(); }
    else if (k === 'ArrowUp' || k === 'ArrowLeft') { cur = (cur - 1 + keys.length) % keys.length; render(); }
    else if (k === 'Enter' || k === ' ') {
      const a = document.activeElement;
      if (a && root.contains(a) && a.matches('button')) a.click();
      else return true;
    }
    return true;
  }

  window.Codex = {
    has: label => !!(MAP[label] || []).some(k => E[k]),
    open, close, key,
    isOpen: () => root.classList.contains('open')
  };
})();
