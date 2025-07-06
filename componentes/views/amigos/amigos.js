import { pantalla_carga } from "../carga/cargaView.js";
import { juego } from "../preguntasView/preguntasView.js";

async function verificarCodigoPartida(codigo) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/partidas/validar/${codigo}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Si usas autenticación
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Error al validar partida");
    }

    // Asegurarse que la respuesta tiene la estructura esperada
    if (!data.partida || !data.partida.id) {
      throw new Error("La respuesta del servidor no es válida");
    }

    return data.partida;
  } catch (error) {
    console.error("Error al validar partida:", error);
    throw error;
  }
}

function jugar_amigos() {
  let juega_amigos = document.createElement("div");
  juega_amigos.className = "juega_amigos";

  let imagen_principal = document.createElement("div");
  imagen_principal.className = "imagen_principal";
  juega_amigos.appendChild(imagen_principal);

  let img_principal = document.createElement("img");
  img_principal.src = "../../componentes/assets/amigos.png";
  imagen_principal.appendChild(img_principal);

  // Crear contenedor de partidas públicas
  let partidas_publicas = document.createElement("div");
  partidas_publicas.className = "partidas_publicas";

  let titulo_partidas_publicas = document.createElement("h2");
  titulo_partidas_publicas.textContent = "Partidas Públicas";
  partidas_publicas.appendChild(titulo_partidas_publicas);

  let contenedor_partidas_publicas = document.createElement("div");
  contenedor_partidas_publicas.className = "contenedor_partidas_publicas";
  partidas_publicas.appendChild(contenedor_partidas_publicas);

  let partida_creada = document.createElement("div");
  partida_creada.className = "partida_creada";
  contenedor_partidas_publicas.appendChild(partida_creada);

  let nombre_partida = document.createElement("h1");
  nombre_partida.className = "nombre_partida";
  nombre_partida.textContent = "nombre partida";
  partida_creada.appendChild(nombre_partida);

  let num_jugadores_partida = document.createElement("div");
  num_jugadores_partida.className = "num_j_partidas";
  num_jugadores_partida.textContent = "1/5";
  partida_creada.appendChild(num_jugadores_partida);

  let nombres_juego = document.createElement("div");
  nombres_juego.className = "nombres_juego";
  nombres_juego.textContent = "juego";
  partida_creada.appendChild(nombres_juego);

  let nivel_partida = document.createElement("div");
  nivel_partida.className = "nivel_partida";
  nivel_partida.textContent = "nivel";
  partida_creada.appendChild(nivel_partida);

  let dificultad_partida = document.createElement("div");
  dificultad_partida.className = "dificultad_partida";
  dificultad_partida.textContent = "difi";
  partida_creada.appendChild(dificultad_partida);

  let unirse_partida_publica = document.createElement("button");
  unirse_partida_publica.className = "unirse_pp";
  unirse_partida_publica.textContent = "unirse";
  partida_creada.appendChild(unirse_partida_publica);

  juega_amigos.appendChild(partidas_publicas);

  // Crear contenedor de partidas privadas
  let partidas_privadas = document.createElement("div");
  partidas_privadas.className = "partidas_privadas";

  let titulo_partidas_privadas = document.createElement("h2");
  titulo_partidas_privadas.textContent = "Partidas Privadas";
  partidas_privadas.appendChild(titulo_partidas_privadas);

  let ingresar_partida_privada = document.createElement("input");
  ingresar_partida_privada.className = "ingresar_partida_p";
  ingresar_partida_privada.placeholder = "Ingresa tu código";
  partidas_privadas.appendChild(ingresar_partida_privada);

  let boton_ir = document.createElement("button");
  boton_ir.className = "boton_ir";
  boton_ir.textContent = "ir";

  // Modifica tu función jugar_amigos() así:
  boton_ir.addEventListener("click", async () => {
    const codigo = ingresar_partida_privada.value.trim();

    if (!codigo) {
      alert("Por favor ingresa un código de partida");
      return;
    }

    // Asegúrate de que el contenedor principal existe
    const mainContent = document.querySelector(".contenido-principal");
    if (!mainContent) {
      console.error("No se encontró el contenedor principal");
      return;
    }

    // Limpiar y mostrar carga
    mainContent.innerHTML = "";
    const carga = pantalla_carga();
    mainContent.appendChild(carga.element);

    // Resto de tu lógica...
  });

  partidas_privadas.appendChild(boton_ir);
  juega_amigos.appendChild(partidas_privadas);

  return juega_amigos;
}

export { jugar_amigos };
