import { palabrasPorNivel } from "./palabras.js";
import { guardarResultadoPartida } from "../memoria/memoriaView.js";
import { resultado } from "../resultados/resultados.js";

let resultados = [];

export function cargarAhorcado() {
  let nivel = 1;
  let vidasIniciales = 5;
  let palabrasGanadas = 0;
  let puntos = 0;

  const contenedor = document.createElement("div");
  contenedor.className = "ahorcado-container";

  // Cabecera del juego
  const cabecera = document.createElement("div");
  cabecera.className = "ahorcado-cabecera";
  contenedor.appendChild(cabecera);

  const titulo = document.createElement("h2");
  titulo.className = "ahorcado-titulo";
  titulo.innerHTML = `Nivel <span class="nivel-numero">${nivel}</span>`;
  cabecera.appendChild(titulo);

  // Contador de puntos con efecto neón
  const puntosElemento = document.createElement("div");
  puntosElemento.className = "ahorcado-puntos";
  puntosElemento.innerHTML = `⭐ <span class="puntos-numero">${puntos}</span> puntos`;
  cabecera.appendChild(puntosElemento);

  // Área de juego principal
  const areaJuego = document.createElement("div");
  areaJuego.className = "ahorcado-area-juego";
  contenedor.appendChild(areaJuego);

  // Panel izquierdo (temporizador y vidas)
  const panelIzquierdo = document.createElement("div");
  panelIzquierdo.className = "ahorcado-panel-izquierdo";
  areaJuego.appendChild(panelIzquierdo);

  const timerElemento = document.createElement("div");
  timerElemento.className = "ahorcado-temporizador";
  timerElemento.innerHTML =
    '<i class="fas fa-clock"></i> <span class="tiempo-numero">0</span>s';
  panelIzquierdo.appendChild(timerElemento);

  const vidasElemento = document.createElement("div");
  vidasElemento.className = "ahorcado-vidas";
  panelIzquierdo.appendChild(vidasElemento);

  // Panel central (palabra)
  const panelCentral = document.createElement("div");
  panelCentral.className = "ahorcado-panel-central";
  areaJuego.appendChild(panelCentral);

  const palabraElemento = document.createElement("div");
  palabraElemento.className = "ahorcado-palabra";
  panelCentral.appendChild(palabraElemento);

  // Panel derecho (letras)
  const panelDerecho = document.createElement("div");
  panelDerecho.className = "ahorcado-panel-derecho";
  areaJuego.appendChild(panelDerecho);

  const letrasDiv = document.createElement("div");
  letrasDiv.className = "ahorcado-letras-container";
  panelDerecho.appendChild(letrasDiv);

  // Resumen (se muestra al final)
  const resumenDiv = document.createElement("div");
  resumenDiv.className = "ahorcado-resumen";
  contenedor.appendChild(resumenDiv);

  // Elemento de progreso (barra de nivel)
  const barraProgreso = document.createElement("div");
  barraProgreso.className = "ahorcado-barra-progreso";
  const barraProgresoRelleno = document.createElement("div");
  barraProgresoRelleno.className = "ahorcado-barra-progreso-relleno";
  barraProgreso.appendChild(barraProgresoRelleno);
  contenedor.appendChild(barraProgreso);

  function actualizarBarraProgreso() {
    const porcentaje = (palabrasGanadas / 3) * 100;
    barraProgresoRelleno.style.width = `${porcentaje}%`;
  }

  function iniciarNivel() {
    letrasDiv.innerHTML = "";
    resumenDiv.innerHTML = "";
    titulo.innerHTML = `Nivel <span class="nivel-numero">${nivel}</span>`;
    barraProgresoRelleno.style.width = "0%";

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
      puntosElemento.innerHTML = `⭐ <span class="puntos-numero">${puntos}</span> puntos`;
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

    // Crear teclado visual
    const filasLetras = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["Z", "X", "C", "V", "B", "N", "M"],
    ];

    filasLetras.forEach((fila) => {
      const filaDiv = document.createElement("div");
      filaDiv.className = "ahorcado-fila-letras";

      fila.forEach((letra) => {
        const boton = document.createElement("button");
        boton.textContent = letra;
        boton.className = "ahorcado-letra-btn";
        boton.dataset.letra = letra;

        boton.addEventListener("click", function () {
          if (letrasUsadas.includes(letra) || vidas <= 0) return;

          letrasUsadas.push(letra);
          boton.disabled = true;
          boton.classList.add("usada");

          if (palabra.includes(letra)) {
            boton.classList.add("correcta");
            for (let j = 0; j < palabra.length; j++) {
              if (palabra[j] === letra) {
                palabraOculta[j] = letra;
              }
            }
            palabraElemento.textContent = palabraOculta.join(" ");

            // Efecto visual para letra correcta
            boton.animate(
              [
                { transform: "scale(1)", backgroundColor: "#4ade80" },
                { transform: "scale(1.1)", backgroundColor: "#86efac" },
                { transform: "scale(1)", backgroundColor: "#4ade80" },
              ],
              {
                duration: 300,
                iterations: 1,
              }
            );
          } else {
            boton.classList.add("incorrecta");
            vidas--;
            actualizarVidas(vidas);

            // Efecto visual para letra incorrecta
            boton.animate(
              [
                { transform: "translateX(0px)", backgroundColor: "#f87171" },
                { transform: "translateX(-5px)", backgroundColor: "#fca5a5" },
                { transform: "translateX(5px)", backgroundColor: "#fca5a5" },
                { transform: "translateX(0px)", backgroundColor: "#f87171" },
              ],
              {
                duration: 300,
                iterations: 1,
              }
            );
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
            actualizarBarraProgreso();

            // Efecto de confeti al acertar palabra
            if (palabrasGanadas >= 3) {
              nivel++;
              palabrasGanadas = 0;
              mostrarAnimacionNivel();
            } else {
              mostrarAnimacionAcierto();
              setTimeout(() => iniciarNivel(), 1500);
            }
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

        filaDiv.appendChild(boton);
      });

      letrasDiv.appendChild(filaDiv);
    });
  }

  function actualizarVidas(vidas) {
    vidasElemento.innerHTML = "";
    for (let i = 0; i < vidasIniciales; i++) {
      const corazon = document.createElement("i");
      corazon.className = "fas fa-heart";
      corazon.textContent = "❤️";
      corazon.style.color = i < vidas ? "#ef4444" : "#d1d5db";
      vidasElemento.appendChild(corazon);
    }
  }

  function actualizarTemporizador(tiempo) {
    const tiempoNumero = timerElemento.querySelector(".tiempo-numero");
    tiempoNumero.textContent = tiempo;

    // Cambiar color según el tiempo restante
    if (tiempo <= 10) {
      timerElemento.style.color = "#ef4444";
      tiempoNumero.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.2)" },
          { transform: "scale(1)" },
        ],
        {
          duration: 1000,
          iterations: 1,
        }
      );
    } else {
      timerElemento.style.color = "#10b981";
    }
  }

  function mostrarAnimacionAcierto() {
    const confetti = document.createElement("div");
    confetti.className = "ahorcado-confetti";
    panelCentral.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 1000);
  }

  function mostrarAnimacionNivel() {
    const nivelUp = document.createElement("div");
    nivelUp.className = "ahorcado-nivel-up";
    nivelUp.innerHTML = `
      <div class="nivel-up-contenido">
        <i class="fas fa-trophy"></i>
        <h3>¡Subiste de nivel!</h3>
        <p>Ahora estás en nivel ${nivel}</p>
      </div>
    `;
    contenedor.appendChild(nivelUp);

    setTimeout(() => {
      nivelUp.remove();
      iniciarNivel();
    }, 2500);
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
    vidasElemento.innerHTML = "";
    timerElemento.innerHTML = "";

    const resumenContenido = document.createElement("div");
    resumenContenido.className = "ahorcado-resumen-contenido";

    const tituloResumen = document.createElement("h3");
    tituloResumen.textContent = "Resumen de Partida";
    tituloResumen.className = "ahorcado-resumen-titulo";
    resumenContenido.appendChild(tituloResumen);

    const puntosFinales = document.createElement("div");
    puntosFinales.className = "ahorcado-puntos-finales";
    puntosFinales.innerHTML = `Total de puntos: <span>${puntos}</span>`;
    resumenContenido.appendChild(puntosFinales);

    const tabla = document.createElement("table");
    tabla.className = "ahorcado-tabla";
    tabla.innerHTML = `
      <thead>
        <tr>
          <th>#</th>
          <th>Palabra</th>
          <th>Estado</th>
          <th>Puntos</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = tabla.querySelector("tbody");
    resultados.forEach((r, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${index + 1}</td>
        <td>${r.palabra}</td>
        <td><span class="estado ${r.estado.toLowerCase().replace(" ", "-")}">${
        r.estado
      }</span></td>
        <td>${r.estado === "Correcto" ? "+10" : "0"}</td>
      `;
      tbody.appendChild(fila);
    });

    resumenContenido.appendChild(tabla);

    // Guardar puntos al backend
    guardarResultadoPartida(puntos);

    const botonesContainer = document.createElement("div");
    botonesContainer.className = "ahorcado-resumen-botones";

    const botonPodio = document.createElement("button");
    botonPodio.className = "ahorcado-boton-ver-podio";
    botonPodio.innerHTML = '<i class="fas fa-trophy"></i> Ver Podio';
    botonPodio.onclick = async () => {
      const root = document.querySelector("#root");
      root.innerHTML = "";
      const vista = await resultado();
      root.appendChild(vista);
    };

    botonesContainer.appendChild(botonPodio);
    resumenContenido.appendChild(botonesContainer);

    resumenDiv.appendChild(resumenContenido);
  }

  iniciarNivel();
  return contenedor;
}
