import { pantalla_carga } from "../carga/cargaView.js";
import { preguntas } from "./preguntas.js";
import { resultado } from "../resultados/resultados.js";

export function juego(nivel) {
  const container = document.createElement("div");
  container.className = "juego-container";

  iniciarJuego(nivel);

  async function iniciarJuego(nivel) {
    // Mostrar pantalla de carga primero
    const carga = pantalla_carga();
    container.innerHTML = "";
    container.appendChild(carga.element);

    // Esperar 10 segundos
    await carga.promise;

    // Continuar con el juego
    document.body.className = "juego";
    container.innerHTML = "";

    const preguntasFiltradas = preguntas.filter((p) => p.nivel === nivel);
    let indice = 0;
    let puntaje = 0;
    let tiempoRestante = 120; // 2 minutos
    let intervaloTiempo;

    // Panel de info superior (tiempo y puntos)
    const infoJuego = document.createElement("div");
    infoJuego.className = "info-juego";

    const tiempoDiv = document.createElement("div");
    tiempoDiv.className = "tiempo-juego";
    tiempoDiv.textContent = `⏳ Tiempo: ${tiempoRestante}s`;
    infoJuego.appendChild(tiempoDiv);

    const puntosDiv = document.createElement("div");
    puntosDiv.className = "puntos-juego";
    puntosDiv.textContent = `🏆 Puntos: ${puntaje}`;
    infoJuego.appendChild(puntosDiv);

    container.appendChild(infoJuego);

    // Temporizador global
    intervaloTiempo = setInterval(() => {
      tiempoRestante--;
      tiempoDiv.textContent = `⏳ Tiempo: ${tiempoRestante}s`;
      if (tiempoRestante <= 0) {
        clearInterval(intervaloTiempo);
        mostrarFinal(puntaje, preguntasFiltradas.length);
      }
    }, 1000);

    function mostrarPregunta() {
      if (indice >= preguntasFiltradas.length) {
        clearInterval(intervaloTiempo);
        mostrarFinal(puntaje, preguntasFiltradas.length);
        return;
      }

      const actual = preguntasFiltradas[indice];
      const preguntaDiv = document.createElement("div");
      preguntaDiv.className = "pregunta-container";

      const titulo = document.createElement("h2");
      titulo.className = "pregunta";
      titulo.textContent = `Pregunta ${indice + 1}: ${actual.texto}`;
      preguntaDiv.appendChild(titulo);

      const opcionesContainer = document.createElement("div");
      opcionesContainer.className = "opciones";
      preguntaDiv.appendChild(opcionesContainer);

      actual.opciones.forEach((opcion, i) => {
        const btn = document.createElement("button");
        btn.className = "btn-opcion";
        btn.textContent = opcion;
        btn.onclick = () => {
          const correcta = i === actual.correcta;
          btn.classList.add(correcta ? "correcta" : "incorrecta");

          if (correcta) {
            puntaje++;
            puntosDiv.textContent = `🏆 Puntos: ${puntaje}`;
          }

          const botones = opcionesContainer.querySelectorAll("button");
          botones.forEach((b) => (b.disabled = true));

          setTimeout(() => {
            indice++;
            container.removeChild(preguntaDiv);
            mostrarPregunta();
          }, 1500);
        };
        opcionesContainer.appendChild(btn);
      });

      container.appendChild(preguntaDiv);
    }

    mostrarPregunta();
  }

  function mostrarFinal(correctas, total, tiempoInicio) {
    container.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.className = "pregunta";
    titulo.textContent = "🎉 ¡Nivel terminado!";
    container.appendChild(titulo);

    const mensaje = document.createElement("div");
    mensaje.className = "mensaje-final";
    mensaje.textContent = `Obtuviste ${correctas} puntos.`;
    container.appendChild(mensaje);

    const tiempoTotal = Math.floor((Date.now() - tiempoInicio) / 1000);
    const tiempoDiv = document.createElement("div");
    tiempoDiv.className = "tiempo-final";
    tiempoDiv.textContent = `⏱️ Tiempo: ${tiempoTotal} segundos`;
    container.appendChild(tiempoDiv);

    // Enviar los puntos al backend
    fetch(
      "https://backend-game-mnte.onrender.com/api/partidas/guardar-resultado",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          id_partida: localStorage.getItem("id_partida"),
          id_login: localStorage.getItem("userId"),
          puntos_obtenidos: correctas,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Puntos guardados:", data);
      })
      .catch((err) => console.error("Error al guardar puntos:", err));

    const podioBtn = document.createElement("button");
    podioBtn.textContent = "Ver Podio";
    podioBtn.className = "btn-opcion";
    podioBtn.onclick = async () => {
      const mainContent = document.querySelector("#root");
      mainContent.innerHTML = "";

      const vistaResultados = await resultado();
      mainContent.appendChild(vistaResultados);
    };
    container.appendChild(podioBtn);
  }

  if (!nivel) {
    mostrarInicio();
  }

  return container;
}
