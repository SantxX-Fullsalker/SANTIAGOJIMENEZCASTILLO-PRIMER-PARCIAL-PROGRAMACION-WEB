// 1) Esperamos a que el botón "calcular" sea presionado.
document.getElementById("calcular").addEventListener("click", function() {
    // 2) Obtenemos los valores ingresados en los campos del HTML.
    let a = parseFloat(document.getElementById("a").value);
    let b = parseFloat(document.getElementById("b").value);
    let c = parseFloat(document.getElementById("c").value);
    let d = parseFloat(document.getElementById("d").value);
    let e = parseFloat(document.getElementById("e").value);
    let xMin = parseFloat(document.getElementById("xMin").value);
    let xMax = parseFloat(document.getElementById("xMax").value);

    // 3) Inicializamos variables para:
    //    - yMin y yMax (mínimo y máximo de Y).
    //    - cortes (para contar cuántas veces la función cruza cerca de Y=0).
    let yMin = Infinity;
    let yMax = -Infinity;
    let cortes = 0;
    // Variable para guardar el valor anterior de la función
    let prevY = null;

    // 4) Seleccionamos la tabla donde se mostrarán los valores
    let tablaValores = document.getElementById("tablaValores");
    tablaValores.innerHTML = "";

    // 5) Preparar un array para Google Charts (primera fila con encabezados).
    let chartData = [];
    chartData.push(["X", "Y"]);

    // 6) Validamos los valores de los imputs
    if ( isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || 
    isNaN(xMin) || isNaN(xMax) ) {
    alert("Error: Todos los valores deben ser números válidos.");
    return; // Detener la ejecución si hay error
    }

    // Validamos que xMin < xMax
    if (xMin >= xMax) {
    alert("Error: El valor mínimo de X debe ser menor que el valor máximo.");
    return;
    }

    // 7) Recorremos X desde xMin hasta xMax en incrementos de 0.1.
    for (let x = xMin; x <= xMax; x += 0.1) {
        // 8) Calculamos Y usando la función indicada.
        //    y = sin((2/sqrt(c)) + b) + cos(a - (3x/2)) - sin(x - sqrt(sin(e+2))) + cos(sqrt(d)/2)
        let y = Math.sin((2 / Math.sqrt(c)) + b)
              + Math.cos(a - (3 * x / 2))
              - Math.sin(x - Math.sqrt(Math.sin(e + 2)))
              + Math.cos(Math.sqrt(d) / 2);

        // 9) Actualizamos yMin y yMax.
        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;

        // 10) Determinamos cambio de signo.
        if (prevY !== null) {
            // Si y es positivo y prevY negativo (o viceversa), hay un cruce
            if ((y > 0 && prevY < 0) || (y < 0 && prevY > 0)) {
                cortes++;
            }
        }
        // Guardamos este y como prevY para la próxima iteración
        prevY = y;

        // 11) Agregamos la fila a la tabla de valores en el HTML.
        let fila = `<tr><td>${x.toFixed(2)}</td><td>${y.toFixed(6)}</td></tr>`;
        tablaValores.innerHTML += fila;

        // 12) Agregamos los datos a nuestro array para Google Charts.
        chartData.push([parseFloat(x.toFixed(2)), parseFloat(y.toFixed(6))]);
    }

    // 13) Mostramos los resultados en pantalla (mínimo, máximo y cortes).
    document.getElementById("yMin").textContent = yMin.toFixed(6);
    document.getElementById("yMax").textContent = yMax.toFixed(6);
    document.getElementById("cortes").textContent = cortes;

    // 14) Llamamos a la función que dibuja el gráfico, enviándole los datos.
    drawChart(chartData);
});

// 15) Función para dibujar el gráfico con Google Charts.
function drawChart(chartData) {
    // Creamos la DataTable a partir del array chartData.
    let data = new google.visualization.arrayToDataTable(chartData);

    // Opciones de configuración del gráfico.
    let options = {
        title: 'Gráfico de la Función',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    // Dibujamos el gráfico de líneas en el div "chart_div".
    let chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

