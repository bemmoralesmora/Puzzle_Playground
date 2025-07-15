async function perfil(idUsuario) {
  const perfil = document.createElement("div");
  perfil.className = "perfil";

  // Fetch de la info del usuario
  let userInfo, logrosInfo, partidasInfo;

  try {
    const [resUsuario, resLogros, resPartidas] = await Promise.all([
      fetch(`https://backend-game-mnte.onrender.com/api/usuarios/${idUsuario}`),
      fetch(
        `https://backend-game-mnte.onrender.com/api/usuarios/logros/${idUsuario}`
      ),
      fetch(
        `https://backend-game-mnte.onrender.com/api/usuarios/partidas/${idUsuario}`
      ),
    ]);

    if (!resUsuario.ok) throw new Error("Usuario no encontrado");

    userInfo = await resUsuario.json();
    logrosInfo = await resLogros.json();
    partidasInfo = await resPartidas.json();

    console.log("✅ Datos usuario:", userInfo);
    console.log("✅ Datos logros:", logrosInfo);
    console.log("✅ Datos partidas:", partidasInfo);
  } catch (error) {
    console.error("Error al cargar el perfil:", error.message);
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "No se pudo cargar el perfil.";
    perfil.appendChild(errorMsg);
    return perfil;
  }

  // --- Estructura del perfil (sin cambios de estilo) ---
  const user = document.createElement("div");
  user.className = "user";
  perfil.appendChild(user);

  const datos = document.createElement("div");
  datos.className = "datos";
  user.appendChild(datos);

  const datos_user = document.createElement("div");
  datos_user.className = "datos_user";
  datos.appendChild(datos_user);

  const estados_iconos = document.createElement("div");
  estados_iconos.className = "estados_iconos";
  datos_user.appendChild(estados_iconos);

  const tag = document.createElement("div");
  tag.className = "tag";
  estados_iconos.appendChild(tag);

  const icono_1 = document.createElement("div");
  icono_1.className = "icono_1";
  estados_iconos.appendChild(icono_1);

  const icono_2 = document.createElement("div");
  icono_2.className = "icono_2";
  estados_iconos.appendChild(icono_2);

  const datos_personales = document.createElement("div");
  datos_personales.className = "datos_personales";
  datos_user.appendChild(datos_personales);

  const nombre = document.createElement("h1");
  nombre.className = "nombre";
  nombre.textContent =
    userInfo.nombre_perfil || userInfo.nombre_login || "Sin nombre";
  datos_personales.appendChild(nombre);

  const descripcion = document.createElement("h2");
  descripcion.className = "descripcion";
  descripcion.textContent = userInfo.descripcion || "Sin descripción";
  datos_personales.appendChild(descripcion);

  const followers = document.createElement("h3");
  followers.className = "followers";
  followers.textContent = `Seguidores: ${userInfo.seguidores}`;
  datos_user.appendChild(followers);

  const img_perfil = document.createElement("div");
  img_perfil.className = "img_perfil";
  datos.appendChild(img_perfil);

  const img_perfil_img = document.createElement("img");
  img_perfil_img.className = "img_perfil_img";
  img_perfil_img.src =
    userInfo.imagen_perfil ||
    "https://cdn.shopify.com/s/files/1/0607/2306/9147/files/catnap.png";
  img_perfil_img.alt = "Imagen de perfil";
  img_perfil.appendChild(img_perfil_img);

  // --- Partidas ---
  const texto_partidas = document.createElement("div");
  texto_partidas.className = "texto_partidas";
  texto_partidas.textContent = "Partidas";
  user.appendChild(texto_partidas);

  const info_partidas = document.createElement("div");
  info_partidas.className = "info_partidas";
  user.appendChild(info_partidas);

  const victorias = document.createElement("h1");
  victorias.className = "victorias";
  victorias.textContent = `Victorias: ${userInfo.victorias}`;
  info_partidas.appendChild(victorias);

  const derrotas = document.createElement("h1");
  derrotas.className = "derrotas";
  derrotas.textContent = `Derrotas: ${userInfo.derrotas}`;
  info_partidas.appendChild(derrotas);

  const total_partidas = document.createElement("h1");
  total_partidas.className = "total_partidas";
  total_partidas.textContent = `Total: ${userInfo.total_partidas}`;
  info_partidas.appendChild(total_partidas);

  // --- Logros ---
  const logros = document.createElement("div");
  logros.className = "logros";
  perfil.appendChild(logros);

  const logros_obtenidos = document.createElement("div");
  logros_obtenidos.className = "logros_obtenidos";
  logros.appendChild(logros_obtenidos);

  logrosInfo.forEach((logro) => {
    const logroItem = document.createElement("div");
    logroItem.className = "logro";

    const titulo = document.createElement("h4");
    titulo.textContent = logro.nombre_logro;

    const descripcion = document.createElement("p");
    descripcion.textContent = logro.descripcion_logro;

    logroItem.appendChild(titulo);
    logroItem.appendChild(descripcion);
    logros_obtenidos.appendChild(logroItem);
  });

  const estadisticas_titulo = document.createElement("h1");
  estadisticas_titulo.className = "estadisticas_titulo";
  estadisticas_titulo.textContent = "Estadísticas";
  logros.appendChild(estadisticas_titulo);

  const estadisticas = document.createElement("div");
  estadisticas.className = "estadisticas";
  estadisticas.textContent = `Puntos: ${userInfo.puntos}`;
  logros.appendChild(estadisticas);

  return perfil;
}

export { perfil };
