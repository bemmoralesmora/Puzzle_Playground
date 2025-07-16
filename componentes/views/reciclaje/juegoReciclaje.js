// Datos del juego
import { resultado } from "../resultados/resultados.js";
import { guardarResultadoPartida } from "../memoria/memoriaView.js";
const niveles = [
  {
    nivel: 1,
    objetos: [
      { emoji: "🍎", tipo: "organico" },
      { emoji: "🥫", tipo: "metal" },
      { emoji: "📰", tipo: "papel" },
      { emoji: "🍌", tipo: "organico" },
      { emoji: "🧃", tipo: "plastico" },
    ],
  },
  {
    nivel: 2,
    objetos: [
      { emoji: "🥤", tipo: "plastico" },
      { emoji: "📦", tipo: "papel" },
      { emoji: "🍐", tipo: "organico" },
      { emoji: "🥫", tipo: "metal" },
      { emoji: "🍇", tipo: "organico" },
      { emoji: "🧴", tipo: "plastico" },
    ],
  },
  {
    nivel: 3,
    objetos: [
      { emoji: "🍞", tipo: "organico" },
      { emoji: "🥫", tipo: "metal" },
      { emoji: "📚", tipo: "papel" },
      { emoji: "🍊", tipo: "organico" },
      { emoji: "🧃", tipo: "plastico" },
      { emoji: "🥡", tipo: "plastico" },
      { emoji: "🗞️", tipo: "papel" },
    ],
  },
];

const tipos = ["organico", "papel", "plastico", "metal"];

// Estado del jugador
let jugador = {
  nombre: "",
  avatar: "",
  codigo: "",
  nivel: 1,
  vidas: 3,
  tiempoTotal: 0,
  puntos: 0,
};

let historial = [];
let intervaloGlobal;
let basuraActual = [];
let intervaloTiempo;

// Funciones del juego
function cargarJuego() {
  const root = document.querySelector("#root");
  root.innerHTML = "";

  const tituloPrincipal = document.createElement("h1");
  tituloPrincipal.className = "titulo-general";
  tituloPrincipal.textContent = "♻️ Clasifica la Basura";

  root.appendChild(tituloPrincipal);

  const juego = crearBasura(jugador, pasarNivel, perderVida, finalizarJuego);
  root.appendChild(juego);

  iniciarTemporizador(jugador, perderVida, finalizarJuego);
}

function pasarNivel() {
  jugador.nivel++;
  jugador.puntos += 10;
  cargarJuego();
}

function perderVida() {
  jugador.vidas--;
  jugador.puntos = Math.max(0, jugador.puntos - 5);
  actualizarVidas(jugador);
  if (jugador.vidas <= 0) {
    finalizarJuego();
  } else {
    cargarJuego();
  }
}

function finalizarJuego() {
  clearInterval(intervaloGlobal);
  clearInterval(intervaloTiempo);

  historial.push({
    nombre: jugador.nombre,
    avatar: jugador.avatar,
    codigo: jugador.codigo,
    nivel: jugador.nivel,
    tiempo: jugador.tiempoTotal,
    puntos: jugador.puntos,
  });

  // Guardar en el backend
  guardarResultadoPartida(jugador.puntos);

  // Mostrar podio
  const root = document.getElementById("root");
  root.innerHTML = "";

  const finalDiv = document.createElement("div");
  finalDiv.className = "jr-final-screen";

  const titulo = document.createElement("h2");
  titulo.textContent = "🎉 ¡Juego terminado!";
  titulo.className = "jr-final-title";

  const puntosTexto = document.createElement("p");
  puntosTexto.textContent = `⭐ Puntos obtenidos: ${jugador.puntos}`;

  const tiempoTexto = document.createElement("p");
  tiempoTexto.textContent = `⏱️ Tiempo total: ${jugador.tiempoTotal} segundos`;

  const botonPodio = document.createElement("button");
  botonPodio.textContent = "Ver Podio";
  botonPodio.className = "jr-btn-podio";
  botonPodio.addEventListener("click", async () => {
    const vista = await resultado();
    root.innerHTML = "";
    root.appendChild(vista);
  });

  finalDiv.appendChild(titulo);
  finalDiv.appendChild(puntosTexto);
  finalDiv.appendChild(tiempoTexto);
  finalDiv.appendChild(botonPodio);

  root.appendChild(finalDiv);

  // Reiniciar estado para la siguiente partida
  jugador.nivel = 1;
  jugador.vidas = 3;
  jugador.tiempoTotal = 0;
  jugador.puntos = 0;
}

function crearBasura(jugador, pasarNivel, perderVida, finalizarJuego) {
  clearInterval(intervaloTiempo);

  let contenedor = document.createElement("div");
  contenedor.className = "jr-game-container";

  // Header: tiempo y vidas
  const header = document.createElement("div");
  header.className = "jr-game-header";

  const tiempoSpan = document.createElement("span");
  tiempoSpan.id = "tiempo";
  tiempoSpan.textContent = `⏱️ Tiempo: 30s`;

  const vidasSpan = document.createElement("span");
  vidasSpan.id = "vidas";
  vidasSpan.textContent = "❤️".repeat(jugador.vidas);

  header.appendChild(tiempoSpan);
  header.appendChild(vidasSpan);
  contenedor.appendChild(header);

  // Título del nivel
  const tituloNivel = document.createElement("h2");
  tituloNivel.className = "jr-level-title";
  tituloNivel.textContent = `🧪 Nivel ${jugador.nivel}`;
  contenedor.appendChild(tituloNivel);

  // Botes de reciclaje
  const contenedorBotes = document.createElement("div");
  contenedorBotes.className = "jr-bins-container";

  tipos.forEach((tipo) => {
    let bote = document.createElement("div");
    bote.className = `jr-bin jr-bin-${tipo}`;
    bote.dataset.tipo = tipo;
    bote.textContent = tipo.toUpperCase();

    bote.addEventListener("dragover", (e) => e.preventDefault());

    bote.addEventListener("drop", (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text");
      const basura = document.getElementById(id);
      if (basura) {
        e.target.appendChild(basura);
        basura.style.fontSize = "1.6rem";
      }
    });

    contenedorBotes.appendChild(bote);
  });

  contenedor.appendChild(contenedorBotes);

  // Zona de basura
  const contenedorBasura = document.createElement("div");
  contenedorBasura.className = "jr-trash-container";
  contenedorBasura.id = "zona-basura";

  basuraActual = cargarObjetosDelNivel(jugador.nivel);
  basuraActual.forEach((item, index) => {
    let basura = document.createElement("div");
    basura.className = "jr-trash-item";
    basura.textContent = item.emoji;
    basura.setAttribute("draggable", "true");
    basura.dataset.tipo = item.tipo;
    basura.id = `basura-${index}`;

    basura.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text", basura.id);
    });

    contenedorBasura.appendChild(basura);
  });

  contenedor.appendChild(contenedorBasura);

  // Botón Verificar
  const btn = document.createElement("button");
  btn.textContent = "✅ Verificar";
  btn.className = "jr-check-button";
  btn.addEventListener("click", () =>
    verificarClasificacion(jugador, pasarNivel, perderVida, finalizarJuego)
  );
  contenedor.appendChild(btn);

  return contenedor;
}

function cargarObjetosDelNivel(nivelActual) {
  const data = niveles.find((n) => n.nivel === nivelActual);
  return data ? data.objetos : niveles[niveles.length - 1].objetos;
}

function verificarClasificacion(
  jugador,
  pasarNivel,
  perderVida,
  finalizarJuego
) {
  let algunBoteLleno = false;
  let correcto = true;

  tipos.forEach((tipo) => {
    const bote = document.querySelector(`.jr-bin-${tipo}`);
    const hijos = bote.querySelectorAll(".jr-trash-item");

    if (hijos.length > 0) {
      algunBoteLleno = true;
    }

    hijos.forEach((b) => {
      if (b.dataset.tipo !== tipo) {
        correcto = false;
      }
    });
  });

  if (!algunBoteLleno) {
    alert("⚠️ ¡Por favor, clasifica al menos un objeto antes de verificar!");
    return;
  }

  if (correcto) {
    alert(`✅ ¡Nivel ${jugador.nivel} superado!`);
    pasarNivel();
  } else {
    alert("❌ Clasificación incorrecta. Intenta de nuevo.");
    perderVida();
  }
}

function actualizarVidas(jugador) {
  const vidasSpan = document.getElementById("vidas");
  if (vidasSpan) {
    vidasSpan.textContent = "❤️".repeat(jugador.vidas);
  }
}

function iniciarTemporizador(jugador, perderVida, finalizarJuego) {
  let tiempoRestante = 30;
  const tiempoSpan = document.getElementById("tiempo");
  if (!tiempoSpan) return;

  tiempoSpan.textContent = `⏱️ Tiempo: ${tiempoRestante}s`;

  intervaloTiempo = setInterval(() => {
    tiempoRestante--;
    tiempoSpan.textContent = `⏱️ Tiempo: ${tiempoRestante}s`;

    if (tiempoRestante <= 0) {
      clearInterval(intervaloTiempo);
      jugador.vidas--;
      actualizarVidas(jugador);
      if (jugador.vidas <= 0) {
        alert("⏰ Tiempo agotado. Reiniciando juego.");
        finalizarJuego();
      } else {
        alert("⏰ Tiempo agotado. Intenta de nuevo.");
        perderVida();
      }
    }
  }, 1000);
}

function mostrarResultados(datos) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  const contenedor = document.createElement("div");
  contenedor.className = "jr-results-container";

  const titulo = document.createElement("h2");
  titulo.textContent = "📊 Resultados Finales";
  titulo.className = "jr-results-title";

  const lista = document.createElement("ul");
  lista.className = "jr-results-list";

  // Ordenar por puntos descendente
  const ordenados = [...datos].sort((a, b) => b.puntos - a.puntos);

  ordenados.forEach((jugador, index) => {
    const item = document.createElement("li");
    item.innerHTML = `🏅 Lugar #${index + 1} - ${jugador.nombre} ${
      jugador.avatar
    } - Nivel: ${jugador.nivel} - Tiempo: ${jugador.tiempo}s - ⭐ Puntos: ${
      jugador.puntos
    }`;
    item.className = "jr-results-item";

    lista.appendChild(item);
  });

  const botonDescargar = document.createElement("button");
  botonDescargar.textContent = "⬇️ Descargar Resultados";
  botonDescargar.className = "jr-download-button";
  botonDescargar.addEventListener("click", () => {
    exportarResultadosCSV(ordenados);
  });

  contenedor.appendChild(titulo);
  contenedor.appendChild(lista);
  contenedor.appendChild(botonDescargar);
  root.appendChild(contenedor);
}

function exportarResultadosCSV(datos, nombreArchivo = "resultados.csv") {
  const encabezado = Object.keys(datos[0]).join(",");
  const filas = datos.map((fila) => Object.values(fila).join(","));
  const contenido = [encabezado, ...filas].join("\n");

  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Iniciar la aplicación
function cargarReciclaje() {
  jugador.nombre = "Anónimo";
  jugador.avatar = "😀";
  jugador.codigo = "X";

  intervaloGlobal = setInterval(() => {
    jugador.tiempoTotal++;
  }, 1000);

  cargarJuego();
}

export { cargarReciclaje };
