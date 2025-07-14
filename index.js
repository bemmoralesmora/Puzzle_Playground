import { inicio } from "./componentes/views/inicio/inicio.js";
import { header } from "./componentes/views/inicio/header.js";
import { footer } from "./componentes/views/inicio/footer.js";
import { Login } from "./componentes/views/login/loginView.js";
import { perfil } from "./componentes/views/perfil/perfil.js";
import { jugar_amigos } from "./componentes/views/amigos/amigos.js";
import { crear_partida } from "./componentes/views/crear_partida/crear_partida.js";
import { juego } from "./componentes/views/preguntasView/preguntasView.js";

// Elementos globales
const DOM = document.querySelector("#root");
const mainContent = document.createElement("main");
mainContent.className = "contenido-principal";

// Verificar el estado de sesión al cargar la aplicación
const checkAuth = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

function cargarContenidoPrincipal() {
  DOM.innerHTML = "";
  DOM.className = "dom";

  // Cargar estructura básica
  DOM.appendChild(header());
  mainContent.innerHTML = "";
  mainContent.appendChild(inicio());
  DOM.appendChild(mainContent);
  DOM.appendChild(footer());
}

function mostrarInicio() {
  mainContent.innerHTML = "";
  mainContent.appendChild(inicio());
}

async function mostrarPerfil() {
  console.log("▶️ mostrarPerfil llamado");

  mainContent.innerHTML = "";

  // Crear el contenedor que contendrá el perfil
  const contenedor = document.createElement("div");
  contenedor.id = "contenedor-perfil";
  mainContent.appendChild(contenedor);

  console.log("🧱 Contenedor:", contenedor);

  const idUsuario = localStorage.getItem("userId");
  console.log("🆔 ID Usuario:", idUsuario);

  if (!idUsuario) {
    console.error("No se encontró el ID del usuario.");
    contenedor.textContent = "No se puede cargar el perfil. ID no disponible.";
    return;
  }

  const perfilElement = await perfil(idUsuario);
  console.log("🧩 perfilElement:", perfilElement);

  if (perfilElement instanceof Node) {
    contenedor.innerHTML = "";
    contenedor.appendChild(perfilElement);
  } else {
    contenedor.textContent = "Error al cargar el perfil.";
  }
}

function mostrarJugarAmigos() {
  mainContent.innerHTML = "";
  mainContent.appendChild(jugar_amigos());
}

function mostrarCrearPartida() {
  mainContent.innerHTML = "";
  mainContent.appendChild(crear_partida());
}

// Nueva función para iniciar el juego con pantalla de carga
async function iniciarJuegoConCarga() {
  mainContent.innerHTML = "";
  const juegoContainer = juego();
  mainContent.appendChild(juegoContainer);
}

function cargarLogin() {
  DOM.innerHTML = "";
  DOM.className = "dom";
  DOM.appendChild(Login());
}

// Función principal de inicialización
function initApp() {
  if (checkAuth()) {
    cargarContenidoPrincipal();
  } else {
    cargarLogin();
  }
}

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("isLoggedIn");
  cargarLogin();
}

// Inicializar la aplicación
initApp();

export {
  cargarContenidoPrincipal,
  cerrarSesion,
  mostrarInicio,
  mostrarPerfil,
  mostrarJugarAmigos,
  mostrarCrearPartida,
  iniciarJuegoConCarga,
};
