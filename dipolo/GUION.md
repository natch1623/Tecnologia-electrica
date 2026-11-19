# Potencial eléctrico producido por un dipolo eléctrico

**Guion de exposición para David Ruiz y Erika Delgado**  
**Tiempo previsto · 13 min 50 s. Reserva · 1 min 10 s. Límite · 15 min.**

Los tiempos son acumulados e incluyen las pausas, los cambios de escena y la demostración. Los párrafos en cursiva son indicaciones para quien expone. Abre la presentación en el navegador. Usa ← y → para avanzar o retroceder, y F para pantalla completa.

| Escena | Tema | Tiempo acumulado |
| --- | --- | --- |
| 1 | ¿Qué mide un voltímetro? | 00:00–01:10 |
| 2 | Geometría y convenciones | 01:10–02:35 |
| 3 | Potencial exacto | 02:35–04:25 |
| 4 | Plano mediador y campo eléctrico | 04:25–06:05 |
| 5 | Aproximación a gran distancia | 06:05–08:05 |
| 6 | Laboratorio de equipotenciales | 08:05–10:40 |
| 7 | Ejemplo numérico | 10:40–13:05 |
| 8 | Pregunta de cierre | 13:05–13:50 |
| | Reserva | 13:50–15:00 |

## 1. ¿Qué mide un voltímetro? · 00:00–01:10

David, Erika, pensemos en un voltímetro con sus dos puntas colocadas en los puntos A y B. Si la punta roja está en B y la negra en A, el instrumento indica la diferencia de potencial $V_B - V_A$. Un volt corresponde a un joule por coulomb. Así podemos comparar la energía potencial eléctrica por unidad de carga entre dos lugares.

Ahora imaginemos dos cargas muy próximas, una positiva y otra negativa, de igual magnitud. Si movemos una punta alrededor de ellas, ¿dónde esperamos que la lectura sea positiva, negativa o cero? Vamos a responderlo primero con la geometría y después con un mapa que podremos explorar.

*Hacer una pausa breve después de la pregunta. Para asignar un valor a $V(P)$ en el modelo se toma $V(\infty)=0$. En una medición se elige un punto físico de referencia.*

## 2. Geometría y convenciones · 01:10–02:35

Tenemos una carga más q y una carga menos q. Las separamos una distancia d y colocamos el origen O justo en el punto medio. Cada carga queda a d sobre dos de ese origen. El momento dipolar, p, apunta desde la carga negativa hacia la positiva. Su magnitud es q por d y se mide en coulomb metro.

Elegimos un punto P donde queremos conocer el potencial. Desde O hasta P tenemos la distancia r. Desde cada carga hasta P tenemos dos distancias, r sub más y r sub menos. Por último, theta es el ángulo entre el momento dipolar y la línea que va de O a P. Sobre el lado de la carga positiva podemos tener theta igual a cero. En el plano que corta el segmento por la mitad, theta vale noventa grados.

*Recorrer con el puntero los tres segmentos y señalar el sentido de $\vec p$. Dar unos segundos para que se distinga $r$ de $r_+$ y $r_-$.*

## 3. Potencial exacto · 02:35–04:25

El potencial de una carga puntual es k por la carga dividida entre la distancia a esa carga. Como el potencial es escalar, sumamos directamente los dos aportes con su signo. Para el dipolo obtenemos k por q multiplicado por uno sobre r sub más menos uno sobre r sub menos.

$$V_{\mathrm{exacto}}(P)=kq\left(\frac{1}{r_+}-\frac{1}{r_-}\right), \qquad k=\frac{1}{4\pi\varepsilon_0}\approx 8{,}99\times10^9\ \mathrm{N\,m^2/C^2}.$$

Si P está más cerca de más q, el primer término tiene mayor magnitud y el potencial es positivo. Si está más cerca de menos q, domina el término negativo. Cuando las distancias coinciden, los dos aportes se cancelan. Esta expresión vale también cerca de las cargas, siempre que P esté fuera de las dos posiciones puntuales. Aquí usamos el modelo en vacío y fijamos el cero del potencial en el infinito.

*Señalar los dos recíprocos al leer la expresión. Mostrar el cambio de signo usando un punto a cada lado del plano mediador.*

## 4. Plano mediador y campo eléctrico · 04:25–06:05

Imaginemos el plano perpendicular al eje del dipolo que pasa por el origen. Cualquier punto de ese plano queda a la misma distancia de ambas cargas. Con nuestra referencia, todo el plano tiene potencial cero. En el mapa veremos ese plano de canto, como una línea.

Ahora quedémonos en un punto de esa línea. El campo de más q apunta alejándose de la carga positiva y el de menos q apunta hacia la carga negativa. Las componentes paralelas al plano se cancelan. Las componentes perpendiculares apuntan en el mismo sentido y se suman. Por eso el campo atraviesa el plano, en dirección de la carga positiva hacia la negativa.

E es menos el gradiente de V. Al movernos dentro del plano, V permanece en cero. Al cruzarlo, pasamos de valores positivos a negativos. Ese cambio perpendicular al plano explica cómo un voltímetro puede marcar cero entre dos puntos del plano mientras una carga de prueba allí experimenta una fuerza.

*Señalar las direcciones de las dos contribuciones y dejar visibles a la vez $V=0$ y $\vec E\ne 0$.*

## 5. Aproximación a gran distancia · 06:05–08:05

Cuando r es mucho mayor que d, las dos distancias a las cargas son muy parecidas a r. Si nos quedamos solo con uno sobre r en cada término, ambos se cancelan porque la carga total es cero. Para obtener el primer aporte que sobrevive, conservamos la pequeña diferencia entre las distancias.

$$\frac{1}{r_+}\approx\frac{1}{r}+\frac{d\cos\theta}{2r^2},
\qquad
\frac{1}{r_-}\approx\frac{1}{r}-\frac{d\cos\theta}{2r^2}.$$

Al restar, los términos uno sobre r desaparecen y las dos correcciones se suman. Como p es q por d, queda k por p por coseno de theta dividido entre r al cuadrado.

$$V_{\mathrm{lejano}}(r,\theta)\approx k\frac{p\cos\theta}{r^2},\qquad r\gg d.$$

Con d y q fijas, si duplicamos r y mantenemos el ángulo, el potencial lejano pasa a la cuarta parte. Al girar hacia noventa grados llega a cero y al seguir hacia el lado negativo cambia de signo. Cerca de las cargas usamos la fórmula exacta.

*Subrayar los dos términos $1/r$ antes de cancelarlos. Mantener fijos el ángulo y el dipolo al hacer la comparación de distancias.*

## 6. Laboratorio de equipotenciales · 08:05–10:40

Cada curva de este mapa conecta puntos que tienen el mismo potencial. Vamos a seguir un punto de prueba cerca del lado positivo, sobre el plano mediador y luego del lado negativo. Antes de cruzar, ¿qué signo esperan que muestre la lectura?

*Mover la sonda lentamente y hacer tres pausas visibles. Leer en voz alta el signo o valor mostrado en cada región. En el plano mediador, detenerse hasta que se vea la lectura de cero.*

Acabamos de pasar de un valor positivo a cero y después a uno negativo. Si elegimos dos posiciones sobre una misma curva, ambas tienen el mismo valor de V. Si ponemos ahí las dos puntas del voltímetro, la diferencia de potencial es cero. Donde el campo tiene dirección definida, cruza estas curvas de forma perpendicular y apunta hacia donde disminuye V.

Veamos ahora el papel de la distancia. Mantengamos el ángulo fijo en un punto que esté fuera del plano mediador y alejemos la sonda. Cuando r aumenta respecto a d, el valor exacto y el aproximado se acercan. Si queremos juzgar la aproximación, conviene comparar los dos valores para el mismo punto.

*Pulsar «Ejemplo» para empezar en 0,20 m y 60°. Seleccionar «Plano mediador» para mostrar 90° y luego mover el ángulo a 120°. Para la comparación de distancias, volver a 60° y cambiar solamente r. Si el tiempo aprieta, mostrar solo el recorrido positivo → cero → negativo y pasar al cálculo.*

## 7. Ejemplo numérico · 10:40–13:05

Tomemos dos cargas de magnitud 2 nanocoulomb separadas 4 centímetros. El punto P está a 20 centímetros del centro, a 60 grados con respecto al momento dipolar. Empecemos convirtiendo todo al Sistema Internacional. Tenemos q igual a dos por diez a la menos nueve coulomb, d igual a cero coma cero cuatro metros y r igual a cero coma veinte metros.

Primero calculo las distancias a cada carga. En los dos casos aparece r cuadrado más d sobre dos al cuadrado. Para la positiva resto r por d por coseno de theta. Para la negativa sumo el mismo término. Las distancias resultan casi diecinueve y veintiún centímetros, respectivamente. Como P queda más cerca de la carga positiva, esperamos un voltaje positivo.

$$
\begin{aligned}
r_+&=\sqrt{r^2+(d/2)^2-rd\cos\theta}=0{,}190788\ \mathrm{m},\\
r_-&=\sqrt{r^2+(d/2)^2+rd\cos\theta}=0{,}210713\ \mathrm{m}.
\end{aligned}
$$

Al sustituir las distancias en la expresión exacta obtenemos 8,91 volts. Para la aproximación, el momento dipolar vale ocho por diez a la menos once coulomb metro. Con coseno de 60 igual a cero coma cinco, obtenemos 8,99 volts. La aproximación queda por encima del resultado exacto y el error relativo es aproximadamente 0,88 %.

$$
\begin{aligned}
p&=qd=8{,}00\times10^{-11}\ \mathrm{C\,m},\\
V_{\mathrm{exacto}}&=8{,}909076\ \mathrm{V},\quad
V_{\mathrm{lejano}}=8{,}987552\ \mathrm{V},\\
\text{Error relativo}&=100\frac{|V_{\mathrm{lejano}}-V_{\mathrm{exacto}}|}{|V_{\mathrm{exacto}}|}\approx0{,}88\,\%.
\end{aligned}
$$

*Mostrar la comparación. Calcular el porcentaje usando los valores sin redondear. Señalar que aquí $r/d=5$ y que el porcentaje corresponde a este punto.*

## 8. Pregunta de cierre · 13:05–13:50

Volvamos al voltímetro. Coloco sus dos puntas en distintos puntos del plano mediador. ¿Qué lectura espero? Si pongo una carga de prueba positiva al lado de una punta, ¿hacia dónde se movería al soltarla?

*Esperar entre cinco y ocho segundos.*

La lectura es cero porque los dos puntos tienen el mismo potencial. La carga de prueba comienza a acelerar en el sentido del campo, hacia el lado de la carga negativa. En un mismo lugar, la lectura del voltímetro nos habla de una diferencia de potencial, mientras que la fuerza sobre la carga nos habla de cómo cambia el potencial alrededor. Muchas gracias.

**Referencia de apoyo** · [MIT 8.02, capítulo 3 «Electric Potential», secciones 3.5 y 3.8.2](https://web.mit.edu/8.02t/www/802TEAL3D/visualizations/coursenotes/modules/guide03.pdf)


