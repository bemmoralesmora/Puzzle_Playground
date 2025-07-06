import io from "socket.io-client";

let socket = null;

const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "wss://backend-game-mnte.onrender.com" // Usa wss:// para WebSocket Secure
    : "ws://localhost:3000"; // ws:// para desarrollo

export function conectarSocket(idUsuario) {
  socket = io(SOCKET_URL, {
    auth: { idUsuario },
    transports: ["websocket"],
    withCredentials: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect_error", (err) => {
    console.error("Error de conexión Socket.io:", err.message);
  });

  return socket;
}

// Resto del código permanece igual...
export function unirsePartida({ codigoPartida, idUsuario }) {
  return new Promise((resolve, reject) => {
    if (!socket) {
      reject(new Error("Socket no conectado"));
      return;
    }

    socket.emit("unirse_partida", { codigoPartida, idUsuario }, (response) => {
      if (response.error) {
        reject(new Error(response.mensaje));
      } else {
        resolve(response);
      }
    });
  });
}

export function escucharEventos(socket, callbacks) {
  socket.on("actualizar_jugadores", callbacks.onActualizarJugadores);
  socket.on("partida_lista", callbacks.onPartidaLista);
  socket.on("error_partida", callbacks.onErrorPartida);
}

export function desconectarSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
