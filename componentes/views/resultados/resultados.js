import { mostrarInicio } from "../../../index.js";

export async function resultado() {
  const contenedor = document.createElement("div");
  contenedor.className = "resultados";

  const podio = document.createElement("div");
  podio.className = "podio";

  const botones = document.createElement("div");
  botones.className = "botones-podio";

  // Botón para volver al inicio
  const botonInicio = document.createElement("button");
  botonInicio.textContent = "🏠 Inicio";
  botonInicio.className = "boton-inicio";
  botonInicio.onclick = () => {
    mostrarInicio();
  };

  // Botón para ver todos los resultados
  const botonVerResultados = document.createElement("button");
  botonVerResultados.textContent = "📋 Ver todos los resultados";
  botonVerResultados.className = "boton-resultados";
  botonVerResultados.onclick = () => {
    verTodosLosResultados(); // Debes definir esta función
  };

  botones.appendChild(botonInicio);
  botones.appendChild(botonVerResultados);

  const idPartida = localStorage.getItem("id_partida");

  try {
    const response = await fetch(
      `https://backend-game-mnte.onrender.com/api/partidas/resultados/${idPartida}`
    );
    const data = await response.json();

    if (data.success && data.podio.length > 0) {
      data.podio.forEach((jugador, i) => {
        const columna = document.createElement("div");
        columna.className = `columna puesto-${i + 1}`;

        columna.innerHTML = `
          <div class="medalla">${i + 1}</div>
          <h3>${jugador.nombre}</h3>
          <p>${jugador.puntos_obtenidos} pts</p>
          <p>${jugador.correctas || "-"} correctas</p>
        `;

        podio.appendChild(columna);
      });
    } else {
      podio.innerHTML =
        "<p>No hay suficientes datos para mostrar el podio.</p>";
    }
  } catch (error) {
    console.error("Error al obtener podio:", error);
    podio.innerHTML = "<p>Error al cargar los resultados.</p>";
  }

  contenedor.appendChild(podio);
  contenedor.appendChild(botones);
  return contenedor;
}

async function verTodosLosResultados() {
  const mainContent = document.querySelector("#root");
  const contenedorResultados = document.createElement("div");
  contenedorResultados.className = "resultados-todos";

  const idPartida = localStorage.getItem("id_partida");

  try {
    const response = await fetch(
      `https://backend-game-mnte.onrender.com/api/partidas/resultados/${idPartida}`
    );
    const data = await response.json();

    if (data.success && data.resultados.length > 0) {
      data.resultados.forEach((resultado, index) => {
        const resultadoDiv = document.createElement("div");
        resultadoDiv.className = "resultado-item";

        resultadoDiv.innerHTML = `
          <h4>#${index + 1} - ${resultado.nombre}</h4>
          <p>🎯 Puntos: ${resultado.puntos_obtenidos}</p>
          <p>✅ Correctas: ${resultado.correctas || "-"}</p>
          <p>🗓️ Fecha: ${new Date(resultado.fecha).toLocaleDateString()}</p>
        `;

        contenedorResultados.appendChild(resultadoDiv);
      });
    } else {
      contenedorResultados.innerHTML = "<p>No hay resultados disponibles.</p>";
    }
  } catch (error) {
    console.error("Error al obtener resultados:", error);
    contenedorResultados.innerHTML = "<p>Error al cargar los resultados.</p>";
  }

  mainContent.innerHTML = "";
  mainContent.appendChild(contenedorResultados);
}
