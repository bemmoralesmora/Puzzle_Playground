import { mostrarInicio, cargarContenidoPrincipal } from "../../../index.js";
import { escucharEventos, getSocket } from "../../../socketManager.js";

export async function resultado() {
  const contenedor = document.createElement("div");
  contenedor.className = "resultados";

  const podio = document.createElement("div");
  podio.className = "podio";

  const botones = document.createElement("div");
  botones.className = "botones-podio";

  const botonInicio = document.createElement("button");
  botonInicio.textContent = "Inicio";
  botonInicio.className = "boton-inicio";
  botonInicio.onclick = () => {
    const mainContent = document.querySelector("#root");
    mainContent.innerHTML = "";
    mainContent.appendChild(cargarContenidoPrincipal());
  };

  const botonVerResultados = document.createElement("button");
  botonVerResultados.textContent = "Todos los resultados";
  botonVerResultados.className = "boton-resultados";
  botonVerResultados.onclick = () => {
    verTodosLosResultados();
  };

  const botonGuardar = document.createElement("button");
  botonGuardar.textContent = "Guardar imagen";
  botonGuardar.className = "boton-guardar";
  botonGuardar.onclick = () => {
    html2canvas(contenedor).then((canvas) => {
      const link = document.createElement("a");
      link.download = "podio.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  botones.appendChild(botonInicio);
  botones.appendChild(botonVerResultados);
  botones.appendChild(botonGuardar); // 📸

  const idPartida = localStorage.getItem("id_partida");

  try {
    const response = await fetch(
      `https://backend-game-mnte.onrender.com/api/partidas/podio/${idPartida}`
    );
    const data = await response.json();

    if (data.success && data.podio.length > 0) {
      renderizarPodio(data.podio, podio);
    } else {
      podio.innerHTML =
        "<p>No hay suficientes datos para mostrar el podio.</p>";
    }
  } catch (error) {
    console.error("Error al obtener podio:", error);
    podio.innerHTML = "<p>Error al cargar los resultados.</p>";
  }

  // Escuchar actualizaciones en tiempo real del podio
  const socket = getSocket();
  if (socket) {
    escucharEventos(socket, {
      onActualizarPodio: (nuevoPodio) => {
        renderizarPodio(nuevoPodio, podio);
      },
    });
  }

  contenedor.appendChild(podio);
  contenedor.appendChild(botones);
  return contenedor;
}

// 👇 Función para renderizar el podio
function renderizarPodio(podioData, podioDiv) {
  podioDiv.innerHTML = "";
  podioData.forEach((jugador, i) => {
    const columna = document.createElement("div");
    columna.className = `columna puesto-${i + 1}`;
    columna.innerHTML = `
      <div class="medalla">${i + 1}</div>
      <h3>${jugador.nombre}</h3>
      <p>${jugador.puntos_obtenidos} pts</p>
      <p>${jugador.correctas || "-"} correctas</p>
    `;
    podioDiv.appendChild(columna);
  });
}

async function verTodosLosResultados() {
  const mainContent = document.querySelector("#root");
  const contenedorResultados = document.createElement("div");
  contenedorResultados.className = "resultados-todos";

  const idPartida = localStorage.getItem("id_partida");

  const botonInicio = document.createElement("button");
  botonInicio.textContent = "Inicio";
  botonInicio.className = "boton-inicio";
  botonInicio.onclick = async () => {
    const mainContent = document.querySelector("#root");
    mainContent.innerHTML = "";
    mainContent.appendChild(cargarContenidoPrincipal());
  };

  const botonGuardar = document.createElement("button");
  botonGuardar.textContent = "Guardar imagen";
  botonGuardar.className = "boton-guardar";
  botonGuardar.onclick = () => {
    html2canvas(contenedorResultados).then((canvas) => {
      const link = document.createElement("a");
      link.download = "resultados_partida.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  contenedorResultados.appendChild(botonInicio);
  contenedorResultados.appendChild(botonGuardar); // 📸

  const renderizarResultados = (resultados) => {
    contenedorResultados
      .querySelectorAll(".resultado-item")
      .forEach((e) => e.remove());
    resultados.forEach((resultado, index) => {
      const resultadoDiv = document.createElement("div");
      resultadoDiv.className = "resultado-item";
      resultadoDiv.innerHTML = `
        <h4>#${index + 1} - ${resultado.nombre}</h4>
        <p>🎯 Puntos: ${resultado.puntos_obtenidos}</p>
      `;
      contenedorResultados.appendChild(resultadoDiv);
    });
  };

  try {
    const response = await fetch(
      `https://backend-game-mnte.onrender.com/api/partidas/resultados/${idPartida}`
    );
    const data = await response.json();

    if (data.success && data.resultados.length > 0) {
      renderizarResultados(data.resultados);
    } else {
      contenedorResultados.innerHTML += "<p>No hay resultados disponibles.</p>";
    }
  } catch (error) {
    console.error("Error al obtener resultados:", error);
    contenedorResultados.innerHTML += "<p>Error al cargar los resultados.</p>";
  }

  // Escuchar actualizaciones del podio
  const socket = getSocket();
  if (socket) {
    escucharEventos(socket, {
      onActualizarPodio: (nuevoPodio) => {
        renderizarResultados(nuevoPodio);
      },
    });
  }

  mainContent.innerHTML = "";
  mainContent.appendChild(contenedorResultados);
}
