import { palabrasPorNivel } from "./palabras.js";

let resultados = [];

export function cargarAhorcado() {
  let nivel = 1;
  let vidasIniciales = 5;
  let palabrasGanadas = 0;
  let puntos = 0;

  const contenedor = document.createElement("div");
  contenedor.className = "juego-ahorcado-container";

  const titulo = document.createElement("h2");
  titulo.className = "juego-ahorcado-titulo";
  contenedor.appendChild(titulo);

  const palabraElemento = document.createElement("div");
  palabraElemento.className = "juego-ahorcado-palabra";
  contenedor.appendChild(palabraElemento);

  const letrasDiv = document.createElement("div");
  letrasDiv.className = "juego-ahorcado-letras-container";
  contenedor.appendChild(letrasDiv);

  const vidasElemento = document.createElement("div");
  vidasElemento.className = "juego-ahorcado-vidas";
  contenedor.appendChild(vidasElemento);

  const timerElemento = document.createElement("div");
  timerElemento.className = "juego-ahorcado-temporizador";
  contenedor.appendChild(timerElemento);

  const puntosElemento = document.createElement("div");
  puntosElemento.className = "juego-ahorcado-puntos";
  contenedor.appendChild(puntosElemento);

  const resumenDiv = document.createElement("div");
  resumenDiv.className = "juego-ahorcado-resumen";
  contenedor.appendChild(resumenDiv);

  function iniciarNivel() {
    letrasDiv.innerHTML = "";
    resumenDiv.innerHTML = "";
    titulo.textContent = `Nivel ${nivel}`;

    let palabras = palabrasPorNivel[nivel] || palabrasPorNivel[5];
    let palabra = palabras[Math.floor(Math.random() * palabras.length)];
    let palabraOculta = Array(palabra.length).fill("_");
    let letrasUsadas = [];
    let vidas = vidasIniciales;
    const TIEMPO_BASE = 80;
    let tiempo = Math.max(TIEMPO_BASE - nivel * 2, 5);
    let tiempoInicial = tiempo;

    let intervalo;

    palabraElemento.textContent = palabraOculta.join(" ");
    actualizarVidas(vidas);
    actualizarTemporizador(tiempo);
    actualizarPuntos();

    function actualizarPuntos() {
      puntosElemento.textContent = `⭐ Puntos: ${puntos}`;
    }

    intervalo = setInterval(() => {
      tiempo--;
      actualizarTemporizador(tiempo);
      if (tiempo <= 0) {
        clearInterval(intervalo);
        guardarResultado(
          "Tiempo agotado",
          palabra,
          nivel,
          tiempoInicial,
          vidas
        );
        mostrarResumen();
      }
    }, 1000);

    for (let i = 65; i <= 90; i++) {
      let letra = String.fromCharCode(i);
      let boton = document.createElement("button");
      boton.textContent = letra;
      boton.className = "juego-ahorcado-letra-btn";

      boton.addEventListener("click", function () {
        if (letrasUsadas.includes(letra) || vidas <= 0) return;

        letrasUsadas.push(letra);
        boton.disabled = true;

        if (palabra.includes(letra)) {
          for (let j = 0; j < palabra.length; j++) {
            if (palabra[j] === letra) {
              palabraOculta[j] = letra;
            }
          }
          palabraElemento.textContent = palabraOculta.join(" ");
        } else {
          vidas--;
          actualizarVidas(vidas);
        }

        if (!palabraOculta.includes("_")) {
          clearInterval(intervalo);
          puntos += 10;
          actualizarPuntos();
          guardarResultado(
            "Correcto",
            palabra,
            nivel,
            tiempoInicial - tiempo,
            vidas
          );
          palabrasGanadas++;
          if (palabrasGanadas >= 3) {
            alert("¡Subiste de nivel!");
            nivel++;
            palabrasGanadas = 0;
          } else {
            alert("¡Palabra correcta!");
          }
          iniciarNivel();
        } else if (vidas === 0) {
          clearInterval(intervalo);
          guardarResultado(
            "Sin vidas",
            palabra,
            nivel,
            tiempoInicial - tiempo,
            vidas
          );
          mostrarResumen();
        }
      });

      letrasDiv.appendChild(boton);
    }
  }

  function actualizarVidas(vidas) {
    vidasElemento.textContent =
      "❤️".repeat(vidas) + "🤍".repeat(vidasIniciales - vidas);
  }

  function actualizarTemporizador(tiempo) {
    timerElemento.textContent = `⏱️ ${tiempo}s`;
  }

  function guardarResultado(
    estado,
    palabra,
    nivel,
    tiempoUsado,
    vidasRestantes
  ) {
    resultados.push({
      palabra,
      nivel,
      estado,
      tiempoUsado,
      vidasRestantes,
      puntos,
    });
  }

  function mostrarResumen() {
    letrasDiv.innerHTML = "";
    palabraElemento.textContent = "";
    titulo.textContent = "🏁 Fin del juego";
    vidasElemento.textContent = "";
    timerElemento.textContent = "";

    const tabla = document.createElement("table");
    tabla.className = "juego-ahorcado-tabla";
    tabla.innerHTML = `
            <tr>
                <th>Lugar</th>
                <th>Nivel</th>
                <th>Palabra</th>
                <th>Estado</th>
                <th>Tiempo usado</th>
                <th>Vidas restantes</th>
                <th>Puntos</th>
            </tr>
        `;

    resultados.forEach((r, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
                <td>${index + 1}</td>
                <td>${r.nivel}</td>
                <td>${r.palabra}</td>
                <td>${r.estado}</td>
                <td>${r.tiempoUsado}s</td>
                <td>${r.vidasRestantes}</td>
                <td>${r.puntos}</td>
            `;
      tabla.appendChild(fila);
    });

    const botonDescargar = document.createElement("button");
    botonDescargar.className = "juego-ahorcado-descargar-btn";
    botonDescargar.textContent = "📥 Descargar resultados";
    botonDescargar.onclick = () => descargarCSV();

    resumenDiv.appendChild(tabla);
    resumenDiv.appendChild(botonDescargar);
  }

  function descargarCSV() {
    const encabezado =
      "Lugar,Nivel,Palabra,Estado,Tiempo usado,Vidas restantes,Puntos\n";
    const filas = resultados
      .map(
        (r, index) =>
          `${index + 1},${r.nivel},${r.palabra},${r.estado},${r.tiempoUsado},${
            r.vidasRestantes
          },${r.puntos}`
      )
      .join("\n");

    const csv = encabezado + filas;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resultados_ahorcado.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  iniciarNivel();
  return contenedor;
}
