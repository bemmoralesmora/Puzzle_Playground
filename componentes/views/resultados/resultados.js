function resultado() {
  const contenedor = document.createElement("div");
  contenedor.className = "resultados";

  const nombres = ["Jugador1", "Jugador2", "Jugador3", "Jugador4", "Jugador5"];
  const puntos = [24061, 19800, 17450, 16000, 14500];
  const correctas = [27, 24, 22, 20, 18];

  const podio = document.createElement("div");
  podio.className = "podio";

  for (let i = 0; i < 5; i++) {
    const columna = document.createElement("div");
    columna.className = `columna puesto-${i + 1}`;

    columna.innerHTML = `
        <div class="medalla">${i + 1}</div>
        <h3>${nombres[i]}</h3>
        <p>${puntos[i]} pts</p>
        <p>${correctas[i]} correctas</p>
      `;

    podio.appendChild(columna);
  }

  contenedor.appendChild(podio);
  return contenedor;
}

export { resultado };
