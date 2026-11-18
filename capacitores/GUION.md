# Guion de la presentación — El Capacitor (15 minutos)

**Curso:** Teoría Electromagnética I (0864) · Lic. en Ing. Electromecánica · UTP · II Semestre 2026
**Ubicación en el programa:** Tema 3) Materiales Eléctricos → a) ii) Dieléctricos → **iii) El Capacitor**
**Bibliografía base:** Sadiku, *Elementos de Electromagnetismo* (cap. 5–6); Hayt, *Teoría Electromagnética* (cap. 6); Cheng, *Fundamentos de Electromagnetismo para Ingeniería*.

El guion tiene tres partes: **(1)** lo que se dice slide por slide (15 min, 13 escenas), **(2)** los problemas resueltos completos, como respaldo o anexo, y **(3)** preguntas que puede hacer el profesor, con su respuesta.

**Cómo leer este guion**

- **[→]** = pulsar flecha derecha. El texto que sigue se dice **después** de pulsar; entre paréntesis, lo que aparece en pantalla.
- **Reloj** = minuto en que empieza la slide · duración. Calculado con la narración del video de ensayo (unas 130 palabras por minuto).
- No se deducen fórmulas en vivo: van escritas en la slide y se narran. El detalle está en la Parte 2.
- La narración de esta parte es la misma del video `capacitores/video/ensayo-capacitores.mp4`; se edita en `capacitores/video/narracion.json` y se regenera con `guion_desde_narracion.py`.

**Hilo conductor:** *la capacitancia depende solo de la geometría y del material; todo capacitor se resuelve con Q → E → V → C; el dieléctrico es donde ocurre la magia y donde está el límite; en el circuito manda i = C dv/dt; dentro del chip, el mismo capacitor mide nanómetros; y la energía vive en el campo.*

---
# Parte 1 · Guion slide por slide

| Bloque | Slides | Tema | Reloj |
| --- | --- | --- | --- |
| I | 01–03 | Qué es un capacitor y cómo se calcula | 0:00 → 2:11 |
| II | 04–05 | Las geometrías | 2:11 → 4:24 |
| III | 06–07 | El dieléctrico y su límite | 4:24 → 7:37 |
| IV | 08–11 | El capacitor en el circuito y en el chip | 7:37 → 13:16 |
| V | 12–13 | Energía y cierre | 13:16 → 14:57 |

Duración total con transiciones y pausas: **14:57**.

---

## Bloque I — Qué es un capacitor y cómo se calcula

### 01 · Portada · reloj 0:00 · 0:34

**En pantalla:** Portada: las placas se encienden, cae el campo y aparece la pregunta de la Tierra.

> "Buenos días. Hoy cerramos materiales eléctricos con el dispositivo que junta todo lo que hemos visto: carga, campo, potencial, dieléctricos y energía. El capacitor. Una pregunta para empezar: si tratamos a la Tierra como una esfera conductora, la Tierra es un capacitor. ¿De cuánto creen que es su capacitancia? Se los respondo en unos minutos."

### 02 · Definición · reloj 0:34 · 0:55

**En pantalla:** Transición: el título se deshace en carga que se separa en las placas. Diagrama con +Q, −Q, líneas de campo y C = Q/V.

> "Fíjense: la carga se separó. Eso es un capacitor: dos conductores separados por un dieléctrico, con cargas iguales y opuestas, más Q y menos Q. Entre ellos hay un campo E y, por lo tanto, una diferencia de potencial V. La capacitancia se define como C igual a Q sobre V, y se mide en faradios: un coulomb por voltio."

**[→]** *(Se duplica la carga: el doble de líneas, 2Q y 2V; C no cambia.)*

> "Ahora dupliquemos la carga: el doble de líneas de campo, el doble de voltaje, y la capacitancia no se movió. Esa es la idea clave: la capacitancia depende solo de la geometría y del material, igual que la resistencia depende del largo, del área y de la conductividad, y no de la corriente."

### 03 · El procedimiento · reloj 1:29 · 0:42

**En pantalla:** Transición: superficie gaussiana que se expande. Constelación Q → E → V → C.

> "Esa superficie que acaban de ver es una superficie gaussiana, y es la llave del método. Todo capacitor se resuelve con la misma receta. Uno: supongo más Q y menos Q en los conductores. Dos: con la Ley de Gauss, usando una superficie que respete la simetría, saco el campo E. Tres: integro E de un conductor al otro para obtener V. Cuatro: divido Q entre V. Si la Q no se cancela, hay un error: es una autocomprobación gratis."

---

## Bloque II — Las geometrías

### 04 · Placas paralelas · reloj 2:11 · 1:14

**En pantalla:** Transición: un punto de luz recorre la integral de línea y se vuelve la cota d. C = εA/d con tres perillas; 22,1 pF.

> "Primer caso: placas paralelas. El punto de luz recorrió la integral de línea y se convirtió en la separación d. Con Gauss, el campo entre las placas es uniforme: Q sobre épsilon A. Como E es constante, V es E por d. Dividimos y queda C igual a épsilon A sobre d. Empezamos con cien centímetros cuadrados y cuatro milímetros de aire: veintidós picofaradios. Movamos las tres perillas."

**[→]** *(Perilla 1: el área crece a 200 cm²; 44,3 pF.)*

> "Duplico el área y la capacitancia se duplica: cuarenta y cuatro picofaradios."

**[→]** *(Perilla 2: la separación baja a 2 mm; 88,5 pF.)*

> "Reduzco la separación a la mitad y vuelve a duplicarse: ochenta y ocho coma cinco picofaradios."

**[→]** *(Perilla 3: entra el vidrio (εr = 5); 443 pF. A 1000 V: Q = 0,443 µC, E = 0,5 MV/m.)*

> "Y lleno el espacio con vidrio, de épsilon erre igual a cinco: cuatrocientos cuarenta y tres picofaradios. Guarden este capacitor: a mil voltios guarda cero coma cuatro cuatro tres microcoulombs, con un campo de medio megavoltio por metro."

### 05 · Coaxial, esfera y la Tierra · reloj 3:25 · 0:59

**En pantalla:** Transición: las placas se enrollan en el coaxial y se inflan en la esfera. Fórmulas de ambos.

> "Mismo método, otras simetrías. En el coaxial, la gaussiana es un cilindro, el campo cae como uno sobre ro y aparece un logaritmo: C igual a dos pi épsilon L sobre el logaritmo natural de b sobre a. Un cable real da unos cien picofaradios por metro. En la esfera, el campo cae como uno sobre r al cuadrado; y si el cascarón exterior se va al infinito, queda cuatro pi épsilon cero a."

**[→]** *(Aparece la Tierra: a = 6370 km, C ≈ 709 µF.)*

> "Y la respuesta del inicio: con un radio de seis mil trescientos setenta kilómetros, la Tierra tiene unos setecientos nueve microfaradios. Menos que un electrolítico que cabe en la mano. La capacitancia no se gana con tamaño: se gana acercando los conductores y con un buen dieléctrico."

---

## Bloque III — El dieléctrico y su límite

### 06 · El dieléctrico por dentro · reloj 4:24 · 1:40

**En pantalla:** Transición: el espacio entre placas se cristaliza. Dipolos al azar y la pregunta: ¿cómo un material que no conduce dispara la capacitancia?

> "Y aquí está la verdadera magia. Muchos piensan que un capacitor es solo dos placas separadas por nada. Pero lo importante ocurre en ese espacio. Si dejamos aire, funciona; si metemos un dieléctrico, la capacitancia se dispara. ¿Cómo lo logra un material que, en teoría, no conduce electricidad?"

**[→]** *(Los dipolos se alinean. Dos tarjetas: polarización electrónica o iónica y orientación de dipolos.)*

> "A escala microscópica, los átomos son neutros, pero sus centros de carga pueden desplazarse. Con el campo ocurren dos cosas. En la polarización electrónica o iónica, la nube de electrones se deforma un poco respecto al núcleo. Y en los materiales polares, las moléculas que ya son dipolos giran y se alinean con el campo, como pequeñas brújulas eléctricas. Los dos mecanismos crean un campo interno que se opone al de las placas."

**[→]** *(Cargas ligadas en las caras, D = ε0E + P y barras: 22,1 libre, 17,7 neutralizada, 4,4 produce campo.)*

> "El resultado aparece en las caras: cargas ligadas, negativas junto a la placa positiva y positivas junto a la negativa. En nuestro capacitor de vidrio, de veintidós coma un microcoulombs por metro cuadrado de carga libre, la polarización neutraliza diecisiete coma siete: solo un quinto produce campo. Con la misma carga hay menos voltaje, así que las placas guardan más carga por cada voltio: la capacitancia sube épsilon erre veces."

### 07 · La grieta de aire y el límite del material · reloj 6:04 · 1:34

**En pantalla:** Transición: una fisura recorre el hielo. Lámina de aire de 0,1 mm sobre 1,9 mm de vidrio; 1000 V, E en el aire 2,08 MV/m.

> "Pero el material también tiene defectos. Supongamos una lámina de aire de una décima de milímetro entre el vidrio y la placa. Como las capas están apiladas, D es el mismo en las dos, y el aire, con épsilon erre igual a uno, soporta cinco veces más campo que el vidrio. A mil voltios son dos coma cero ocho megavoltios por metro, y el aire rompe cerca de tres. Subamos la tensión."

**[→]** *(1200 V: 2,5 MV/m en el aire.)*

> "Mil doscientos voltios: dos coma cinco megavoltios por metro en el aire, mientras el vidrio sigue tranquilo."

**[→]** *(1440 V: 3 MV/m; la grieta se vuelve carmesí y se ioniza.)*

> "Mil cuatrocientos cuarenta voltios: tres megavoltios por metro. El aire se ioniza aunque el vidrio esté lejos de su límite. Es una descarga parcial: no falla el aislante, falla la burbuja."

**[→]** *(Panel: rigidez dieléctrica y tipos de capacitor (cerámica, poliéster, tantalio, electrolítico).)*

> "Y eso nos lleva al límite de cualquier material: la rigidez dieléctrica. Si superamos el campo máximo, rompemos la estructura molecular, el aislante se ioniza y se vuelve conductor: el capacitor explota o hace cortocircuito. Por eso elegir entre cerámica, poliéster, tantalio o electrolítico no es solo cuestión de tamaño: es entender las fronteras físicas de cada material."

---

## Bloque IV — El capacitor en el circuito y en el chip

### 08 · Respuesta en DC · reloj 7:37 · 1:26

**En pantalla:** Transición: las placas se encogen hasta el símbolo y nace un circuito RC con interruptor abierto. i = C dv/dt.

> "Ahora llevemos el capacitor al circuito. Todo parte de una ecuación: i igual a C por la derivada del voltaje respecto al tiempo. La corriente no depende del voltaje, sino de qué tan rápido cambia. Tiene lógica: la carga almacenada es C por v; si v no cambia, la carga no cambia y no hay flujo."

**[→]** *(Se cierra el interruptor: la corriente fluye y se apaga; se dibujan v_C(t) e i(t), con τ, 63 % y 5τ.)*

> "Cerramos el interruptor de este circuito RC. En el primer instante el capacitor está descargado, toda la tensión cae en la resistencia y la corriente es máxima: V sobre R. A medida que entra carga, el capacitor desarrolla su propio voltaje, que se opone a la fuente, y la corriente baja. Es una exponencial con constante de tiempo tau igual a R C: en un tau llega al sesenta y tres por ciento, y en cinco tau, al noventa y nueve."

**[→]** *(Cargado: i = 0, circuito abierto; bloquea la componente continua.)*

> "Cuando su voltaje iguala al de la fuente, la derivada es cero y la corriente también. El capacitor se comporta como un circuito abierto, y tiene sentido, porque entre las placas hay un dieléctrico. Por eso sirve para bloquear la componente continua, separar etapas y almacenar carga."

### 09 · Respuesta en AC · reloj 9:04 · 1:27

**En pantalla:** Transición: la batería se vuelve fuente senoidal, la resistencia se aplana y la exponencial ondula. v e i desfasadas 90°.

> "Cambiemos la fuente por una senoidal. Como el voltaje nunca deja de cambiar, nunca hay estado estable. Derivando, la corriente es omega C V eme por coseno: una senoide adelantada noventa grados. ¿Por qué adelantada? Porque la corriente sigue la pendiente del voltaje: cuando el voltaje cruza por cero es cuando más rápido cambia, y ahí la corriente es máxima."

**[→]** *(X_C = 1/(2πfC) y tabla para 100 µF: 26,5 Ω · 1,59 Ω · 0,159 Ω.)*

> "De ahí sale la reactancia capacitiva: X C igual a uno sobre dos pi f C. A mayor frecuencia, menor oposición. Con cien microfaradios: veintiséis coma cinco ohmios a sesenta hertz, uno coma cincuenta y nueve a un kilohertz y cero coma ciento cincuenta y nueve a diez kilohertz. En continua, la reactancia es infinita."

**[→]** *(Aparece p(t): doble de frecuencia, promedio cero. 100 µF, 120 V, 60 Hz → 4,52 A, 543 var.)*

> "Un detalle de potencia: la potencia instantánea oscila al doble de la frecuencia y su promedio es cero. El capacitor no consume energía: la absorbe y la devuelve. Con cien microfaradios a ciento veinte voltios y sesenta hertz circulan cuatro coma cincuenta y dos amperios, y unos quinientos cuarenta y tres voltamperios reactivos."

### 10 · Aplicaciones y corriente de desplazamiento · reloj 10:31 · 1:11

**En pantalla:** Transición: la onda de corriente entra al dieléctrico como líneas de campo que laten. Lista de aplicaciones.

> "Esa dependencia con la frecuencia es la base de sus aplicaciones. En un filtro RC desvía las altas frecuencias a tierra y deja pasar las bajas. En el acople deja pasar la señal y bloquea la continua. Con una bobina forma un circuito LC que resuena y sirve para sintonizar. Y en un banco de capacitores, su reactiva cancela la de los motores y mejora el factor de potencia."

**[→]** *(Corriente de desplazamiento: i = A ∂D/∂t = (εA/d) dv/dt = C dv/dt.)*

> "Pero queda una pregunta de teoría electromagnética: si ninguna carga cruza el dieléctrico, ¿cómo circula corriente en alterna? La respuesta es la corriente de desplazamiento de Maxwell: un campo D que varía equivale a una corriente. Para placas paralelas, i es A por la derivada de D, que es épsilon A sobre d por la derivada de v: C por dv dt: la misma ecuación del inicio, ahora desde los campos. Y con dieléctrico pasa épsilon erre veces más corriente."

### 11 · Capacitores en semiconductores · reloj 11:41 · 1:35

**En pantalla:** Transición: las placas se acercan de milímetros a nanómetros («un millón de veces más delgado»). Capacitor MOS: compuerta, SiO₂ y silicio; C_ox = ε_ox/t_ox.

> "¿Y dónde están la mayoría de los capacitores del mundo? Dentro de los chips. Acabamos de reducir la separación un millón de veces, de milímetros a nanómetros. Esto es un capacitor MOS: una compuerta de metal, un óxido aislante y el silicio debajo. Su capacitancia por área es épsilon del óxido sobre su espesor: con dos nanómetros de dióxido de silicio da uno coma siete microfaradios por centímetro cuadrado. La compuerta de cada transistor es un capacitor, y en una memoria DRAM cada bit es un capacitor de unos veinte femtofaradios."

**[→]** *(Unión pn: la zona de agotamiento (W) es el dieléctrico y se ensancha con la polarización inversa: varactor.)*

> "En una unión pn también hay un capacitor: la zona de agotamiento, sin portadores libres, hace de dieléctrico. Si aumento la polarización inversa, esa zona se ensancha y la capacitancia baja: es el varactor, un capacitor controlado por voltaje que sintoniza los circuitos LC que vimos."

**[→]** *(El óxido se vuelve high-k (HfO₂, εr ≈ 25) y más grueso: misma C sin efecto túnel.)*

> "Y aquí también hay un límite: con pocos nanómetros de óxido, los electrones lo atraviesan por efecto túnel. La solución fue cambiar el dieléctrico por uno de alta permitividad, como el óxido de hafnio, con épsilon erre cerca de veinticinco: la misma capacitancia con un óxido seis veces más grueso."

---

## Bloque V — Energía y cierre

### 12 · Energía almacenada · reloj 13:16 · 0:50

**En pantalla:** Transición: las placas vuelven a escala humana y las líneas de campo se ensanchan hasta llenar el volumen. W = ½CV² y W = ½∫D·E dv.

> "Falta la energía. Cargar un capacitor cuesta trabajo, porque cada carga nueva sube contra el voltaje que dejaron las anteriores. Integrando sale un medio de C V al cuadrado. Y en lenguaje de campos, es la integral de un medio de D punto E en el volumen: la energía no está en las placas, está en el campo, con densidad un medio de épsilon E al cuadrado."

**[→]** *(Comprobación: 221 µJ por circuito = 221 µJ por campos.)*

> "Comprobemos con el capacitor de vidrio: un medio de C V al cuadrado da doscientos veintiún microjoules; un medio de épsilon E al cuadrado, por el volumen, otra vez doscientos veintiún microjoules. Las dos fórmulas coinciden."

### 13 · Cierre · reloj 14:06 · 0:51

**En pantalla:** Transición: la luz se drena y se divide en tres estrellas. Tres ideas.

> "Me quedo con tres ideas. Uno: la capacitancia depende solo de la geometría y del material. Dos: su comportamiento depende del tiempo, porque i es C dv dt: abierto en continua, conduce en alterna. Tres: la energía está en el campo, y donde el campo se concentra, ahí falla el aislamiento."

**[→]** *(Seguridad (100 µF a 480 V guardan 11,5 J) y «Gracias · Preguntas».)*

> "Y una regla de seguridad: un capacitor desconectado puede seguir cargado. Cien microfaradios a cuatrocientos ochenta voltios guardan once coma cinco joules. Siempre se descarga y se verifica antes de tocarlo. Muchas gracias. ¿Preguntas?"

---

# Parte 2 · Problemas resueltos

Constante: ε₀ = 8,854 × 10⁻¹² F/m.

## Problema 1 · Placas paralelas con dieléctrico

Un capacitor de placas paralelas tiene A = 200 cm², d = 2 mm y vidrio de εr = 5 entre las placas. Se conecta a 1000 V. Halle C, Q, E, D, P, ρps y la energía.

1. C = ε₀εrA/d = (8,854×10⁻¹²)(5)(0,02)/(0,002) = **4,43 × 10⁻¹⁰ F = 443 pF**
2. Q = CV = (4,43×10⁻¹⁰)(1000) = **0,443 µC**
3. E = V/d = 1000/0,002 = **5 × 10⁵ V/m** (de la placa + a la −)
4. D = εE = (8,854×10⁻¹²)(5)(5×10⁵) = **2,21 × 10⁻⁵ C/m²**. Comprobación: ρs = Q/A = 0,443×10⁻⁶/0,02 = 2,21×10⁻⁵ ✓
5. P = (εr − 1)ε₀E = (4)(8,854×10⁻¹²)(5×10⁵) = **1,77 × 10⁻⁵ C/m²**; ρps = P·an = 1,77×10⁻⁵ C/m² en cada cara, con signo opuesto a la placa adyacente.
6. W = ½CV² = ½(4,43×10⁻¹⁰)(10⁶) = **2,21 × 10⁻⁴ J**. Por campos: w = ½εE² = 5,53 J/m³; v = A·d = 4×10⁻⁵ m³; W = 2,21×10⁻⁴ J ✓

## Problema 2 · Cable coaxial

Conductor interior a = 1 mm, pantalla b = 3,5 mm, polietileno εr = 2,25. Halle C por metro.

1. Gauss en ρ (a < ρ < b): D·2πρL = Q → E = Q/(2πεLρ) aρ
2. V = −∫ᵦᵃ E dρ = Q/(2πεL) · ln(b/a)
3. C/L = 2πε/ln(b/a) = 2π(8,854×10⁻¹²)(2,25)/ln(3,5) = 1,2517×10⁻¹⁰/1,2528 = **99,9 pF/m ≈ 100 pF/m**

Nota: el campo es máximo en ρ = a: Emáx = V/(a·ln(b/a)).

## Problema 3 · Capacitancia de la Tierra

C = 4πε₀a = 4π(8,854×10⁻¹²)(6,37×10⁶) = **7,09 × 10⁻⁴ F ≈ 709 µF**

## Problema 4 · Dieléctrico en capas (burbuja de aire)

El capacitor del Problema 1 tiene, en lugar de 2 mm de vidrio, 1,9 mm de vidrio (εr = 5) y una lámina de aire de 0,1 mm. V = 1000 V. Halle E en cada capa, el voltaje en el aire y la tensión a la que el aire rompe (Er,aire ≈ 3 MV/m).

1. D es normal y continua: ε₀E_aire = 5ε₀E_vidrio → E_aire = 5E_vidrio
2. V = E_vidrio·d_v + E_aire·d_a = D/ε₀ · (d_v/εr + d_a/1)
   D/ε₀ = 1000/(1,9×10⁻³/5 + 0,1×10⁻³) = 1000/(0,48×10⁻³) = 2,083×10⁶ V/m
3. **E_aire = 2,08 MV/m**; **E_vidrio = 0,417 MV/m** (sin burbuja era 0,5 MV/m en todo el espesor)
4. V_aire = (2,083×10⁶)(0,1×10⁻³) = **208 V**: el 5 % del espesor soporta el 21 % del voltaje.
5. Ruptura: E_aire = 3×10⁶ → V = 1000 × (3×10⁶/2,083×10⁶) = **1440 V**
6. C = A/(d_v/ε_v + d_a/ε₀) = ε₀(0,02)/(0,48×10⁻³) = **369 pF** (bajó de 443 pF)

## Problema 5 · Capacitancia por Laplace (placas)

V(0) = 0, V(d) = V₀; d²V/dx² = 0 → V = V₀x/d; E = −(V₀/d)ax; en la placa de x = d: ρs = D·an = (εV₀/d) (con an = −ax, apuntando hacia el dieléctrico); Q = εV₀A/d → **C = εA/d**.

## Problema 6 · Fuerza entre placas (aire)

A = 200 cm², d = 2 mm, aire, V = 1000 V. E = 5×10⁵ V/m.
F = ½ε₀E²A = ½(8,854×10⁻¹²)(2,5×10¹¹)(0,02) = **0,0221 N** (atractiva).

---

## Problema 7 · Carga de un circuito RC (DC)

R = 10 kΩ, C = 100 µF, V = 12 V, capacitor inicialmente descargado.

1. τ = RC = (10×10³)(100×10⁻⁶) = **1 s**
2. i(0) = V/R = 12/10 000 = **1,2 mA** (el capacitor descargado se comporta como un cortocircuito)
3. v_C(t) = V(1 − e^(−t/τ)) → v_C(τ) = 12(1 − e⁻¹) = **7,59 V** (63 %)
4. v_C(5τ) = 12(1 − e⁻⁵) = **11,92 V** (99,3 %): en la práctica, cargado
5. En régimen permanente dv/dt = 0 → i = C dv/dt = **0**: circuito abierto.

## Problema 8 · Reactancia y potencia reactiva (AC)

C = 100 µF, V = 120 V (eficaz), f = 60 Hz.

1. X_C = 1/(2πfC) = 1/(2π · 60 · 100×10⁻⁶) = **26,5 Ω**
2. I = V/X_C = 120/26,5 = **4,52 A**
3. Q = V·I = 120 · 4,52 ≈ **543 var** (capacitiva). Potencia activa promedio: **0 W**.
4. Misma C a 1 kHz: X_C = **1,59 Ω**; a 10 kHz: **0,159 Ω**. Si f → 0, X_C → ∞ (caso DC).
5. Desfase: v = V_m sen ωt → i = C dv/dt = ωC V_m cos ωt: la corriente **adelanta 90°**.

## Problema 9 · Corriente de desplazamiento en el capacitor de vidrio

El capacitor del Problema 1 (443 pF, A = 200 cm²) con 1000 V eficaces a 60 Hz.

1. I = ωCV = 2π · 60 · 443×10⁻¹² · 1000 = **0,167 mA**
2. Densidad de corriente de desplazamiento: J_d = ∂D/∂t → |J_d| = I/A = 1,67×10⁻⁴ / 0,02 = **8,35 mA/m²**
3. Comprobación: i = A ∂D/∂t = A ε ∂E/∂t = (εA/d) dv/dt = C dv/dt. Con aire (εr = 1) la corriente sería 5 veces menor.

---
## Problema 10 · Capacitor MOS y dieléctrico high-k

Óxido de compuerta de SiO₂ (εr = 3,9) con t_ox = 2 nm.

1. C_ox = ε₀εr / t_ox = (8,854×10⁻¹²)(3,9)/(2×10⁻⁹) = 1,73×10⁻² F/m² = **1,73 µF/cm²**
2. Compuerta de 1 µm × 1 µm (10⁻¹² m²): C = 1,73×10⁻² · 10⁻¹² = **17 fF**, del orden de una celda DRAM (~20 fF).
3. Misma C con HfO₂ (εr ≈ 25): t = εr ε₀ / C_ox = 25 · 8,854×10⁻¹² / 1,73×10⁻² ≈ **12,8 nm**, unas **6,4 veces** más grueso: el efecto túnel se reduce drásticamente.

---
# Parte 3 · Preguntas probables y respuesta corta

**¿Si duplico el voltaje, cambia la capacitancia?**
No. Se duplica Q; C = Q/V queda igual. Solo cambia si cambia la geometría o el material.

**¿Por qué el dieléctrico aumenta C si no conduce?**
Porque se polariza. Las cargas ligadas en sus caras cancelan parte de la carga libre, el campo baja, V baja con la misma Q, y C sube en un factor εr.

**¿Qué cambia si meto el dieléctrico con la fuente conectada (V constante) en vez de con Q constante?**
Con V constante, E = V/d no cambia y la fuente entrega más carga: Q sube εr veces. Con Q constante, E y V bajan εr veces. En ambos casos C sube εr veces. La energía: con V constante sube (½CV²); con Q constante baja (Q²/2C).

**¿Dónde está la energía de un capacitor?**
En el campo eléctrico, distribuida en el volumen del dieléctrico con densidad ½εE² (o ½D·E).

**¿Por qué en un coaxial el aislante falla junto al conductor interior?**
Porque E ∝ 1/ρ: el campo es máximo en ρ = a.

**¿Por qué una burbuja de aire es peligrosa en un aislante?**
Porque D normal es continua: en el material de menor ε (el aire) el campo es εr veces mayor, y además el aire tiene menor rigidez dieléctrica. El aire se ioniza (descarga parcial) aunque el sólido esté dentro de su límite.

**¿Por qué despreciamos el efecto de borde?**
Porque si d es mucho menor que las dimensiones de las placas, casi todo el campo es uniforme entre ellas; las líneas curvas del borde aportan poco. En la realidad la capacitancia es un poco mayor que εA/d.

**¿Cuándo uso Gauss y cuándo Laplace?**
Gauss cuando hay simetría y supongo la carga. Laplace cuando conozco los potenciales de los conductores o la simetría no basta para sacar E directamente; resuelvo V, luego E, luego ρs = Dn.

**¿Capas en serie o en paralelo?**
Capas apiladas paralelas a las placas (E atraviesa las dos) → serie: 1/C = d₁/(ε₁A) + d₂/(ε₂A). Materiales lado a lado (E paralelo a la interfaz) → paralelo: C = ε₁A₁/d + ε₂A₂/d.

**¿Cuáles son los mecanismos de polarización de un dieléctrico?**
Polarización electrónica o iónica: el campo deforma la nube electrónica (o desplaza iones) y separa los centros de carga. Orientación: en materiales polares, los dipolos permanentes giran y se alinean con el campo. Ambos crean un campo interno opuesto al de las placas.

**¿Qué es la rigidez dieléctrica?**
El campo máximo que soporta un aislante antes de romperse. Si se supera, la estructura molecular se rompe, el material se ioniza y conduce (cortocircuito). El aire ronda los 3 MV/m.

**¿Por qué un capacitor es un circuito abierto en DC?**
Porque i = C dv/dt: cuando el voltaje deja de cambiar, la corriente es cero. Físicamente, entre las placas hay un aislante.

**¿Por qué en AC la corriente adelanta 90°?**
Porque la corriente sigue la pendiente del voltaje: es máxima cuando el voltaje cruza por cero (donde más rápido cambia) y nula en el pico.

**¿El capacitor consume potencia en AC?**
No: p(t) oscila al doble de la frecuencia con promedio cero. Absorbe energía en un cuarto de ciclo y la devuelve en el siguiente; solo intercambia potencia reactiva.

**Si ninguna carga cruza el dieléctrico, ¿cómo hay corriente en AC?**
Por la corriente de desplazamiento de Maxwell: un D que varía en el tiempo equivale a una densidad de corriente ∂D/∂t. Para placas paralelas, A ∂D/∂t = C dv/dt, la misma corriente que circula por los cables.

**¿Dónde hay capacitores en un semiconductor?**
En la compuerta de todo transistor MOS (metal, óxido y silicio forman un capacitor de placas paralelas), en cada celda de memoria DRAM y en toda unión pn, cuya zona de agotamiento hace de dieléctrico.

**¿Qué es un varactor?**
Un diodo en polarización inversa usado como capacitor variable: al aumentar el voltaje inverso, la zona de agotamiento W se ensancha y C = εA/W disminuye. Sirve para sintonizar circuitos LC con voltaje.

**¿Por qué se usan dieléctricos high-k en los transistores?**
Porque con óxidos de pocos nanómetros los electrones atraviesan por efecto túnel. Con un εr mayor (HfO₂ ≈ 25 frente a 3,9 del SiO₂) se obtiene la misma C con un óxido varias veces más grueso.
