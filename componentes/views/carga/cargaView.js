export function pantalla_carga() {
  let pantalla_carga = document.createElement("div");
  pantalla_carga.className = "pantalla_carga";

  let cargando = document.createElement("div");
  cargando.className = "cargando";
  cargando.textContent = "Cargando...";
  pantalla_carga.appendChild(cargando);

  let infoJuego = document.createElement("div");
  infoJuego.className = "info-juego";

  // 🔧 Declarar aquí para que actualizarInfo tenga acceso
  let infoPartida = document.createElement("div");
  infoPartida.className = "info-partida";

  infoJuego.appendChild(infoPartida);
  pantalla_carga.appendChild(infoJuego);

  return {
    element: pantalla_carga,
    promise: new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    }),
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
