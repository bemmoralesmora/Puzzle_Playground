export function pantalla_carga() {
  let pantalla_carga = document.createElement("div");
  pantalla_carga.className = "pantalla_carga";

  let cargando = document.createElement("div");
  cargando.className = "cargando";
  cargando.textContent = "Cargando...";
  pantalla_carga.appendChild(cargando);

  let infoJuego = document.createElement("div");
  infoJuego.className = "info-juego";

  let infoPartida = document.createElement("div");
  infoPartida.className = "info-partida"; // Este será nuestro contenedor
  infoJuego.appendChild(infoPartida);

  pantalla_carga.appendChild(infoJuego);

  return {
    element: pantalla_carga,
    promise: new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 10000); // 10 segundos
    }),
    // Añadimos función para actualizar información
    actualizarInfo: (info) => {
      infoPartida.innerHTML = `
        <p>Juego: ${info.nombreJuego || "N/A"}</p>
        <p>Jugadores: ${info.jugadoresConectados || 0}/${
        info.jugadoresRequeridos || 0
      }</p>
        <p>Nivel: ${info.nivel || "N/A"}</p>
        <p>Dificultad: ${info.dificultad || "N/A"}</p>
        <p>${info.mensaje || ""}</p>
      `;
    },
  };
}
