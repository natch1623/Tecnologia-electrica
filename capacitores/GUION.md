# Guion de la presentación — El Capacitor (15 minutos)

**Curso:** Teoría Electromagnética I (0864) · Lic. en Ing. Electromecánica · UTP · II Semestre 2026
**Ubicación en el programa:** Tema 3) Materiales Eléctricos → a) ii) Dieléctricos → **iii) El Capacitor**
**Bibliografía base:** Sadiku, *Elementos de Electromagnetismo* (cap. 5–6); Hayt, *Teoría Electromagnética* (cap. 6); Cheng, *Fundamentos de Electromagnetismo para Ingeniería*.

El guion tiene tres partes: **(1)** lo que se dice slide por slide (15 min), **(2)** los problemas resueltos completos, como respaldo o anexo, y **(3)** preguntas que puede hacer el profesor, con su respuesta.

**Cómo leer este guion**

- **[→]** = avanzar o revelar el siguiente elemento de la slide. El texto que sigue se dice **después** de pulsar.
- **Reloj** = minuto en que debe empezar la slide · duración.
- Las frases en *cursiva* son **transiciones obligatorias**: se dicen casi textuales.
- Ritmo de referencia: ~130 palabras por minuto. Si al llegar a una slide van más de 20 s atrasados, recorten lo marcado *(opcional)*.
- No se deducen fórmulas en vivo: las deducciones van escritas en la slide y se narran. El detalle está en la Parte 2.

**Hilo conductor:** *la capacitancia no depende de la carga ni del voltaje; depende solo de la geometría y del material. Todo capacitor se resuelve igual: Q → E → V → C.*

| Bloque | Slides | Tema | Reloj |
| --- | --- | --- | --- |
| I | 01–03 | Qué es un capacitor y cómo se calcula | 0:00 → 4:00 |
| II | 04–05 | Placas, coaxial y esfera | 4:00 → 8:00 |
| III | 06–07 | El dieléctrico y la burbuja de aire | 8:00 → 11:30 |
| IV | 08–09 | Energía, aplicaciones y cierre | 11:30 → 15:00 |

Si se presenta en grupo de cuatro, cada bloque es un integrante (~4 min cada uno, el III un poco menos).

---

# Parte 1 · Guion slide por slide

## Bloque I — Qué es un capacitor

### 01 · Portada · reloj 0:00 · 0:45

**En pantalla:** "El Capacitor — geometría, dieléctrico y energía", foto de un banco de capacitores de corrección de factor de potencia.

> "Buenos días. Hoy cerramos materiales eléctricos con el dispositivo que junta todo lo del tema: carga, campo, potencial, dieléctricos y energía. El capacitor.
>
> Una pregunta para empezar: si tratamos a la Tierra como una esfera conductora, es un capacitor. ¿De cuánto? Se los respondo en unos minutos."

### 02 · Definición · reloj 0:45 · 1:45

**En pantalla:** dos conductores con +Q y −Q, líneas de campo, **C = Q/V**. Tiene **1 estado**.

> "Un capacitor son dos conductores separados por un dieléctrico —que puede ser simplemente aire o vacío—, con cargas iguales y opuestas, más Q y menos Q. Las líneas de campo nacen en la carga positiva y mueren en la negativa, así que entre los conductores hay un campo E y, por tanto, una diferencia de potencial V.
>
> La capacitancia se define como **C = Q sobre V**. La unidad es el faradio, un coulomb por voltio, y en la práctica trabajamos con micro, nano y picofaradios, porque un faradio es muchísimo.
>
> ¿Por qué podemos hablar de *la* diferencia de potencial entre las placas? Por lo que ya vimos de conductores: en equilibrio el campo dentro es cero, la carga se va a la superficie y toda la superficie queda al mismo potencial. Y por la condición de frontera, justo en la cara del conductor la componente normal de D es igual a la densidad de carga: **Dn = ρs**. Esa ecuación la vamos a usar varias veces."

**[→]** *(se resalta: "C no depende de Q ni de V")*

> "Y esta es la idea clave de toda la exposición: si duplico Q, el campo se duplica, el voltaje se duplica, y la razón entre los dos no cambia. **C depende solo de la geometría y del material.** Es exactamente lo mismo que pasa con la resistencia: R no depende de la corriente que pase, depende del largo, del área y de la conductividad del conductor."

### 03 · El procedimiento · reloj 2:30 · 1:30

**En pantalla:** cuatro pasos en línea: **±Q → E (Gauss) → V = −∫E·dl → C = Q/V**.

> "¿Cómo se calcula C? Todos los capacitores se resuelven con la misma receta de cuatro pasos.
>
> Uno: supongo que un conductor tiene más Q y el otro menos Q. No necesito saber cuánto; la dejo como letra.
>
> Dos: con la Ley de Gauss saco el campo E. Para eso escojo una superficie gaussiana que respete la simetría: un plano, un cilindro o una esfera. Por eso los casos clásicos son esos tres.
>
> Tres: integro E a lo largo de un camino de un conductor al otro para obtener V. Ojo con el signo: V es menos la integral de E·dl, yendo de la placa negativa a la positiva, para que salga positivo.
>
> Cuatro: divido Q entre V.
>
> Y aquí hay un truco: si al dividir **la Q no se cancela, hay un error.** Es una autocomprobación gratis, úsenla en el parcial.
>
> Hay también un camino inverso, que viene del tema anterior: supongo el voltaje, resuelvo la ecuación de Laplace, ∇²V = 0, saco E con el gradiente, y la carga con ρs = Dn. Cuando conozco los potenciales y no las cargas, conviene más. Llega al mismo resultado."

*Transición:* *"Apliquemos la receta a las tres geometrías clásicas."*

---

## Bloque II — Las tres geometrías

### 04 · Placas paralelas · reloj 4:00 · 1:45

**En pantalla:** placas de área A y separación d; tres líneas: E = Q/(εA) · V = Qd/(εA) · **C = εA/d**. Abajo, el ejemplo numérico.

> "Primer caso: dos placas de área A separadas una distancia d. Suponemos que d es mucho menor que el tamaño de las placas, así las líneas de campo son rectas y despreciamos lo que pasa en los bordes.
>
> Con Gauss, igual que con la lámina infinita, el campo entre las placas es uniforme: ρs sobre ε, que es Q sobre εA, y apunta de la placa positiva a la negativa. Como E es constante, la integral es simplemente E por d: V es Q·d sobre εA. Dividimos, la Q se cancela, y queda **C = εA/d**.
>
> Léanla como ingenieros: más área, más capacitancia; más separación, menos; mejor dieléctrico, más. Esas son las tres perillas que tiene un fabricante."

**[→]** *(aparece el ejemplo)*

> "Un caso concreto que vamos a usar toda la exposición: 200 cm² de placa, 2 mm de vidrio con εr = 5, conectado a mil voltios. ε₀ por 5 por 0,02 entre 0,002: **C = 443 pF**. La carga es 0,443 microcoulombs, y el campo, mil voltios entre dos milímetros, **0,5 MV/m**. Con aire en lugar de vidrio serían 88,5 pF: cinco veces menos. Guarden estos números, que vuelven."

### 05 · Coaxial y esférico · reloj 5:45 · 2:15

**En pantalla:** dos columnas.

| | Coaxial | Esférico |
| --- | --- | --- |
| E | Q/(2πεLρ) — cae como 1/ρ | Q/(4πεr²) — cae como 1/r² |
| C | **2πεL / ln(b/a)** | **4πε / (1/a − 1/b)** |

Tiene **1 estado** (la Tierra).

> "Mismo método, otras simetrías.
>
> El coaxial: un conductor interior de radio a y una pantalla de radio b, de largo L. La gaussiana es un cilindro de radio ρ entre los dos: D por 2πρL igual a Q, así que E cae como **1 sobre ρ**. Al integrar 1/ρ aparece un logaritmo, y C queda 2πεL sobre ln(b/a). Con un conductor de 1 mm, una pantalla de 3,5 mm y polietileno, εr = 2,25, salen **unos 100 pF por metro**, que es justo el valor que trae la hoja técnica de un coaxial comercial. Y un detalle que retomamos al final: como E va con 1/ρ, el campo es máximo pegado al conductor interior.
>
> La esfera: esfera interior de radio a, cascarón de radio b. La gaussiana es una esfera de radio r; E cae como **1 sobre r²**, igual que el de una carga puntual. Integrando, C es 4πε entre (1/a − 1/b). Y si mando el cascarón exterior al infinito, 1/b se va a cero y queda **4πε₀a**: la capacitancia de una esfera aislada."

**[→]** *(aparece la Tierra)*

> "Respuesta a la pregunta del inicio: radio 6370 km… **unos 709 microfaradios**. Todo el planeta tiene menos capacitancia que un electrolítico que cabe en la mano. Moraleja: la capacitancia no se gana con tamaño, **se gana acercando los conductores y metiendo un buen dieléctrico.**"

*Transición:* *"En las tres fórmulas aparece ε. Veamos qué hace el material por dentro."*

---

## Bloque III — El dieléctrico

### 06 · ¿Por qué el dieléctrico aumenta C? · reloj 8:00 · 1:45

**En pantalla:** placas con cargas libres; dentro, dipolos alineados y cargas de polarización ±ρps en las caras. **D = ε₀E + P**. Tabla del ejemplo: D = 22,1 µC/m², P = 17,7 µC/m².

> "Meto el dieléctrico entre las placas, manteniendo la misma carga. El campo polariza el material: cada molécula se vuelve un pequeño dipolo alineado con E. Dentro del volumen, la punta positiva de un dipolo queda junto a la negativa del siguiente y se cancelan. Pero en las caras no hay con qué cancelar, y aparecen **cargas ligadas**: negativas pegadas a la placa positiva, positivas pegadas a la negativa.
>
> Esas cargas ligadas cancelan parte de la carga libre. El campo neto baja εr veces, el voltaje baja εr veces con la misma Q, y entonces **C sube en un factor εr**.
>
> En nuestro capacitor de vidrio: la carga libre es 22,1 microcoulombs por metro cuadrado, y la polarización neutraliza 17,7. Solo un quinto sobrevive para producir campo. Eso es εr = 5 en números.
>
> Por eso usamos D = ε₀E + P: la Ley de Gauss para D solo ve la carga libre. D es igual a ρs sin importar qué material haya, y al final dividimos entre ε para obtener E.
>
> *(opcional)* Si en vez de mantener la carga mantengo la fuente conectada, el voltaje no cambia y es la fuente la que entrega εr veces más carga. Distinto camino, mismo resultado: C sube εr veces."

### 07 · Dos dieléctricos: la burbuja de aire · reloj 9:45 · 1:45

**En pantalla:** izquierda, capas apiladas (serie: C = A/(d₁/ε₁ + d₂/ε₂)); derecha, lado a lado (paralelo: C = (ε₁A₁ + ε₂A₂)/d). Debajo, la burbuja. Tiene **1 estado**.

> "Con dos materiales mandan las condiciones de frontera. Si están apilados, E atraviesa la interfaz y se conserva D normal: equivale a dos capacitores en serie. Si están lado a lado, se conserva E tangencial: dos capacitores en paralelo.
>
> En la serie hay una trampa: mismo D, distinto ε, entonces **el campo es mayor en el material de menor permitividad.**"

**[→]** *(aparece la burbuja)*

> "Volvamos a nuestro capacitor de vidrio, pero con un defecto: entre el vidrio y la placa quedó una lámina de aire de **0,1 mm**, el 5 % del espesor, por mal pegado o por una burbuja.
>
> Como D es el mismo en las dos capas y el aire tiene εr = 1, el campo en el aire es cinco veces el del vidrio. Resolviendo, sale **2,08 MV/m** en el aire, cuatro veces los 0,5 que había sin defecto. Esa lámina de una décima de milímetro se queda con 208 de los mil voltios.
>
> El aire rompe cerca de 3 MV/m. Si subo la tensión a **1440 voltios**, el aire se ioniza, aunque el vidrio siga muy por debajo de su límite.
>
> Eso es una **descarga parcial**, y es como envejecen los aislamientos de motores, cables y transformadores: no falla el aislante, falla la burbuja."

*Transición:* *"Sabemos cuánta carga guarda. Falta saber cuánta energía."*

---

## Bloque IV — Energía y cierre

### 08 · Energía almacenada · reloj 11:30 · 1:45

**En pantalla:** **W = ½CV² = Q²/(2C)** · **W = ½∫D·E dv** · **w = ½εE²**. Comprobación: 221 µJ = 221 µJ.

> "Cargar un capacitor cuesta trabajo. Al principio pasar carga de una placa a la otra es fácil, pero cada carga nueva tiene que subir contra el voltaje que ya dejaron las anteriores, q sobre C. Integrando de cero a Q sale Q² sobre 2C, que es lo mismo que **W = ½CV²**. El ½ aparece porque el voltaje fue creciendo durante la carga.
>
> Pero en lenguaje de campos hay otra forma de escribirlo: W es la integral de ½ D·E en todo el volumen. **La energía no está en las placas; está en el campo**, repartida en el dieléctrico, con densidad ½εE² joules por metro cúbico.
>
> Comprobemos con el vidrio. ½CV²: ½ por 443 pF por un millón, **221 microjoules**. Por campos: ½εE² da 5,53 J/m³, por un volumen de 4×10⁻⁵ m³, otra vez **221 microjoules**. Las dos fórmulas coinciden, como debe ser.
>
> *(opcional)* Y esa misma densidad, ½εE², es la presión con que se atraen las placas."

### 09 · Aplicaciones y cierre · reloj 13:15 · 1:45

**En pantalla:** tres tarjetas (corrección de factor de potencia · arranque de motores monofásicos · cables de potencia y aislamiento) y debajo las tres ideas finales.

> "¿Dónde se lo van a encontrar como electromecánicos?
>
> En los bancos de **corrección de factor de potencia**, que compensan la potencia reactiva de los motores de una planta. En el capacitor de **arranque de los motores monofásicos**, que desfasa la corriente de un devanado para que el motor arranque. Y en los **cables de potencia**, que son coaxiales: conductor, aislante y pantalla. Tienen capacitancia por metro, y como el campo va con 1/ρ, es máximo junto al conductor, que es donde se diseña el aislamiento. Las pruebas de descargas parciales en mantenimiento buscan justo las burbujas que vimos.
>
> Y una regla de seguridad: un capacitor desconectado puede seguir cargado. Un banco de 100 µF a 480 V guarda 11,5 joules. Se descarga y se verifica antes de tocar.
>
> Tres ideas para llevarse: **C depende solo de la geometría y del material. Todo capacitor se resuelve con Q, Gauss, V y dividir. Y la energía está en el campo: donde el campo se concentra, ahí falla el aislamiento.**
>
> Gracias. Preguntas."

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
