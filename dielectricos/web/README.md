# Clasificación de dieléctricos

Presentación web de doce diapositivas, con diseño inspirado en Clorinde, núcleo cristalino animado, fondos detallados y once transiciones distintas.

**En línea:** [Abrir presentación](https://natch1623.github.io/Tecnologia-electrica/dielectricos/).

## Uso

Abre `index.html` directamente para usarla sin conexión. Las referencias académicas enlazan a sitios externos.

Desde la raíz del repositorio también puedes ejecutar:

```powershell
python -m http.server 5186 --bind 127.0.0.1 --directory dielectricos/web
```

Controles: flechas y espacio para navegar, `M` para índice, `N` para notas, `F` para pantalla completa y `?` para ayuda. En móvil, desliza horizontalmente. La barra inferior está oculta.

El énfasis de ideas, las gráficas y la aplicación del campo eléctrico se muestran automáticamente. Los efectos se cancelan al salir de la diapositiva. Se respetan las preferencias de movimiento reducido. `?plano=1` abre la vista plana.

## Archivos

- `contenido.js`: textos, notas, fuentes y tiempos previstos.
- `app.js`: estructura y navegación.
- `styles.css`, `kinetic.css`, `ornate.js` y `ornate.css`: diseño y fondos.
- `motion.js` y `motion.css`: explicaciones automáticas.
- `electric.js` y `electric.css`: énfasis Electro.
- `transitions.js` y `transitions.css`: cambios de diapositiva.
- `construct.css`: núcleo animado de portada.

No requiere instalación ni compilación. Los PDF del curso, documentos de trabajo e imágenes de referencia no forman parte del sitio publicado.

## Gráficos explicativos

Cada diapositiva tiene una combinación de fondo propia. Los modelos moleculares comparan sin campo y con campo al mismo tiempo. Hay esquemas de los cuatro mecanismos, partículas de cada estado físico, gráficas P–E con guías, comparaciones de dirección/posición y una red amorfa de vidrio. Son esquemas cualitativos y su movimiento se ralentiza para la exposición. Implementación en phenomena.js y phenomena.css.

## Transiciones orgánicas

Las once transiciones y la apertura se dibujan con curvas, fibras luminosas, pliegues que se estrechan y rayos ramificados. Sustituyen la escenografía geométrica anterior. `organic.js` dibuja la luz y `transitions.js` coordina navegación, limpieza y cancelación. No se copian los gráficos científicos.
