import { pantalla_carga } from "../carga/cargaView.js";
import { preguntas } from "./preguntas.js";

export function juego(nivel) {
  const container = document.createElement("div");
  container.className = "juego-container";

  // Iniciar directamente el juego con el nivel seleccionado
  iniciarJuego(nivel);

  async function iniciarJuego(nivel) {
    // Mostrar pantalla de carga primero
    const carga = pantalla_carga();
    container.innerHTML = "";
    container.appendChild(carga.element);

    // Esperar 10 segundos
    await carga.promise;

    // Continuar con el juego
    document.body.className = "juego";
    container.innerHTML = "";

    const preguntasFiltradas = preguntas.filter((p) => p.nivel === nivel);
    let indice = 0;
    let puntaje = 0;

    function mostrarPregunta() {
      if (indice >= preguntasFiltradas.length) {
        mostrarFinal(puntaje, preguntasFiltradas.length);
        return;
      }

      const actual = preguntasFiltradas[indice];
      container.innerHTML = "";

      const titulo = document.createElement("h2");
      titulo.className = "pregunta";
      titulo.textContent = `Pregunta ${indice + 1}: ${actual.texto}`;
      container.appendChild(titulo);

      const opcionesContainer = document.createElement("div");
      opcionesContainer.className = "opciones";
      container.appendChild(opcionesContainer);

      actual.opciones.forEach((opcion, i) => {
        const btn = document.createElement("button");
        btn.className = "btn-opcion";
        btn.textContent = opcion;
        btn.onclick = () => {
          const correcta = i === actual.correcta;
          btn.classList.add(correcta ? "correcta" : "incorrecta");

          if (correcta) puntaje++;

          const botones = opcionesContainer.querySelectorAll("button");
          botones.forEach((b) => (b.disabled = true));

          setTimeout(() => {
            indice++;
            mostrarPregunta();
          }, 1500);
        };
        opcionesContainer.appendChild(btn);
      });
    }

    mostrarPregunta();
  }

  function guardarPuntaje(puntaje, nivel) {
    const puntajes = JSON.parse(localStorage.getItem('puntajes')) || {};
    const puntajesNivel = puntajes[nivel] || [];
    
    puntajesNivel.push({
      puntaje: puntaje,
      fecha: new Date().toISOString()
    });

    // Mantener solo los últimos 10 puntajes para evitar acumular muchos datos
    if (puntajesNivel.length > 10) {
      puntajesNivel.shift();
    }

    puntajes[nivel] = puntajesNivel;
    localStorage.setItem('puntajes', JSON.stringify(puntajes));
  }

  function obtenerMejoresPuntajes(nivel) {
    const puntajes = JSON.parse(localStorage.getItem('puntajes')) || {};
    const puntajesNivel = puntajes[nivel] || [];
    
    // Ordenar de mayor a menor y tomar los primeros 3
    return puntajesNivel
      .sort((a, b) => b.puntaje - a.puntaje)
      .slice(0, 3);
  }

  function mostrarFinal(correctas, total) {
    container.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.className = "pregunta";
    titulo.textContent = "🎉 ¡Nivel terminado!";
    container.appendChild(titulo);

    const mensaje = document.createElement("div");
    mensaje.className = "mensaje-final";
    mensaje.textContent = `Obtuviste ${correctas} de ${total} preguntas correctas.`;
    container.appendChild(mensaje);

    // Guardar el puntaje actual
    guardarPuntaje(correctas, nivel);

    // Obtener los mejores puntajes
    const mejoresPuntajes = obtenerMejoresPuntajes(nivel);

    // Gráfico de resultados actuales
    const graficaActualDiv = document.createElement("div");
    graficaActualDiv.className = "grafica";
    const tituloActual = document.createElement("h3");
    tituloActual.textContent = "Tu resultado:";
    graficaActualDiv.appendChild(tituloActual);
    
    const canvasActual = document.createElement("canvas");
    canvasActual.id = "graficoResultadosActual";
    graficaActualDiv.appendChild(canvasActual);
    container.appendChild(graficaActualDiv);

    const incorrectas = total - correctas;
    new Chart(canvasActual, {
      type: "bar",
      data: {
        labels: ["Correctas", "Incorrectas"],
        datasets: [{
          label: "Respuestas",
          data: [correctas, incorrectas],
          backgroundColor: ["#2ecc71", "#e74c3c"],
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
            max: total,
          },
        },
      },
    });

    // Gráfico de mejores puntajes (solo si hay datos)
    if (mejoresPuntajes.length > 0) {
      const mejoresDiv = document.createElement("div");
      mejoresDiv.className = "grafica";
      const tituloMejores = document.createElement("h3");
      tituloMejores.textContent = "Mejores puntajes:";
      mejoresDiv.appendChild(tituloMejores);
      
      const canvasMejores = document.createElement("canvas");
      canvasMejores.id = "graficoMejoresPuntajes";
      mejoresDiv.appendChild(canvasMejores);
      container.appendChild(mejoresDiv);

      // Preparar datos para el gráfico
      const labels = mejoresPuntajes.map((_, i) => `Top ${i + 1}`);
      const data = mejoresPuntajes.map(p => p.puntaje);
      const fechas = mejoresPuntajes.map(p => new Date(p.fecha).toLocaleDateString());

      new Chart(canvasMejores, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: "Puntaje",
            data: data,
            backgroundColor: [
              "#f1c40f", // Oro
              "#95a5a6", // Plata
              "#cd7f32"  // Bronce
            ],
          }],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
              max: total,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                afterLabel: function(context) {
                  const index = context.dataIndex;
                  return `Fecha: ${fechas[index]}`;
                }
              }
            }
          }
        },
      });
    }

    const reiniciarBtn = document.createElement("button");
    reiniciarBtn.textContent = "Volver al inicio";
    reiniciarBtn.className = "btn-opcion";
    reiniciarBtn.onclick = () => {
      window.location.reload();
    };
    container.appendChild(reiniciarBtn);
  }

  return container;
}