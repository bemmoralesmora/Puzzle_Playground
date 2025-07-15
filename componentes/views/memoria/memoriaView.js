import { resultado } from "../resultados/resultados.js";

function memoriaGame() {
  let gameContainer = document.querySelector("#root");
  gameContainer.className = "memory-game-container";

  // Crear pantalla de bienvenida
  let welcomeScreen = document.createElement("div");
  welcomeScreen.className = "welcome-screen";

  let gameTitle = document.createElement("h1");
  gameTitle.textContent = "Puzzle Playground";

  let gameDescription = document.createElement("p");
  gameDescription.textContent = "¡Pon a prueba tu memoria!";

  let startButton = document.createElement("button");
  startButton.id = "start-game-btn";
  startButton.textContent = "Comenzar";

  // Agregar elementos a la pantalla de bienvenida
  welcomeScreen.appendChild(gameTitle);
  welcomeScreen.appendChild(gameDescription);
  welcomeScreen.appendChild(startButton);

  // Agregar pantalla al contenedor principal
  gameContainer.appendChild(welcomeScreen);

  // Evento para comenzar el juego
  startButton.onclick = () => {
    welcomeScreen.remove();
    startGameSession(gameContainer);
  };

  return gameContainer;
}

let remainingLives = 5;
let scorePoints = 0;

function updateLivesDisplay(gameHeader) {
  // Eliminar vidas actuales
  const currentLives = gameHeader.querySelectorAll(".life-icon");
  currentLives.forEach((img) => img.remove());

  // Total de vidas (5)
  const totalLives = 5;

  for (let i = 0; i < totalLives; i++) {
    let lifeIcon = document.createElement("img");
    lifeIcon.className = "life-icon";

    if (i < remainingLives) {
      lifeIcon.src = "../../componentes/assets/img/img.png";
    } else {
      lifeIcon.src =
        "https://img.freepik.com/vector-premium/icono-corazon-pixelado-vacio-vacio-vacio-ausencia-amor-soledad-anhelo-emociones-vacias-simbolo-digital-pixel-art-retro-nostalgia-icono-linea-vectorial-negocios-publicidad_855332-1962.jpg";
      lifeIcon.style.opacity = "0.5";
    }

    gameHeader.appendChild(lifeIcon);
  }
}

function startGameSession(gameContainer) {
  gameContainer.innerHTML = "";

  let gameHeader = document.createElement("div");
  gameHeader.className = "game-header";
  gameContainer.appendChild(gameHeader);

  let headerTitle = document.createElement("h1");
  headerTitle.textContent = "Puzzle Playground";
  headerTitle.className = "game-header-title";
  gameHeader.appendChild(headerTitle);

  updateLivesDisplay(gameHeader);

  let timerDisplay = document.createElement("div");
  timerDisplay.className = "game-timer";
  timerDisplay.textContent = "Tiempo: 00";
  gameHeader.appendChild(timerDisplay);

  let scoreDisplay = document.createElement("div");
  scoreDisplay.className = "score-display";
  scoreDisplay.innerHTML = `
      <div class="score-box">
          <span class="score-label">Puntos</span>
          <span class="score-value">${scorePoints}</span>
      </div>
  `;
  gameHeader.appendChild(scoreDisplay);

  let gameBoard = document.createElement("div");
  gameBoard.className = "memory-board";
  gameContainer.appendChild(gameBoard);

  let currentLevel = 1;

  const levelButton = document.createElement("button");
  levelButton.className = "level-button";
  levelButton.textContent = `Nivel ${currentLevel + 1}`;

  // Inicialmente deshabilitado
  levelButton.disabled = true;
  levelButton.style.opacity = "0.6";
  levelButton.style.cursor = "default";

  gameContainer.appendChild(levelButton);

  generateLevel(currentLevel, gameBoard, gameHeader, levelButton);
}

function updateScoreDisplay(gameHeader) {
  const scoreBox = gameHeader.querySelector(".score-display .score-value");
  if (scoreBox) {
    scoreBox.textContent = scorePoints;
  }
}

function createCard(value) {
  let card = document.createElement("div");
  card.className = "memory-card";
  card.dataset.value = value;

  let cardFront = document.createElement("div");
  cardFront.className = "card-front";

  let cardBack = document.createElement("div");
  cardBack.className = "card-back";

  let cardImage = document.createElement("img");
  cardImage.src = `../../componentes/assets/img/${value}`;
  cardImage.alt = "carta";
  cardImage.className = "card-image";

  cardBack.appendChild(cardImage);

  card.appendChild(cardFront);
  card.appendChild(cardBack);

  return card;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateLevel(level, gameBoard, gameHeader, levelButton) {
  if (level > 5) return;

  gameBoard.innerHTML = "";

  const cardCount = 4 + (level - 1) * 2;

  let timeLimit = 8 + level * 2 + Math.floor(cardCount / 2);
  startGameTimer(timeLimit, () => {
    remainingLives--;
    updateLivesDisplay(gameHeader);

    if (remainingLives > 0) {
      showLifeLostMessage(() => {
        generateLevel(level, gameBoard, gameHeader, levelButton);
      });
    } else {
      showGameOverMessage();
    }
  });

  const columns = Math.ceil(Math.sqrt(cardCount));
  gameBoard.style.gridTemplateColumns = `repeat(${columns}, auto)`;

  const images = [
    "amarillo.png",
    "azul.png",
    "flor.png",
    "protaAzul.png",
    "rosa.png",
    "verde.png",
  ];

  let cardValues = images.slice(0, cardCount / 2);
  let cardPairs = cardValues.concat(cardValues);
  shuffleArray(cardPairs);

  let flippedCards = [];
  let matchedPairs = 0;

  cardPairs.forEach((value) => {
    const card = createCard(value);

    card.addEventListener("click", () => {
      if (
        card.classList.contains("flipped") ||
        flippedCards.length === 2 ||
        card.classList.contains("matched")
      )
        return;

      card.classList.add("flipped");
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;

        if (card1.dataset.value === card2.dataset.value) {
          card1.classList.add("matched");
          card2.classList.add("matched");
          card1.style.opacity = "0.5";
          card2.style.opacity = "0.5";

          matchedPairs++;

          flippedCards = [];

          if (matchedPairs === cardCount / 2) {
            let pointsEarned = 10 + (level - 1) * 2;
            scorePoints += pointsEarned;

            let lifePenalty = 5 - remainingLives;
            scorePoints -= lifePenalty;

            if (scorePoints < 0) scorePoints = 0;

            updateScoreDisplay(gameHeader);

            const button = document.querySelector(".level-button");
            clearInterval(gameTimer);
            if (level < 5) {
              levelButton.disabled = false;
              levelButton.style.opacity = "1";
              levelButton.style.cursor = "pointer";
              levelButton.textContent = `Nivel ${level + 1}`;

              levelButton.onclick = () => {
                generateLevel(level + 1, gameBoard, gameHeader, levelButton);
                levelButton.disabled = true;
                levelButton.style.opacity = "0.6";
                levelButton.style.cursor = "default";
              };
            } else {
              button.textContent = "🎉 ¡Completado!";
              button.disabled = true;
              button.style.opacity = "0.6";
              button.style.cursor = "default";

              showVictoryMessage();
            }
          }
        } else {
          setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            flippedCards = [];
          }, 1000);
        }
      }
    });

    gameBoard.appendChild(card);
  });
}

let gameTimer;

function startGameTimer(initialTime, timeoutCallback) {
  clearInterval(gameTimer);
  let timeLeft = initialTime;
  const timerElement = document.querySelector(".game-timer");
  timerElement.textContent = `Tiempo: ${timeLeft}s`;
  timerElement.classList.remove("time-critical");

  gameTimer = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 5) {
      timerElement.classList.add("time-critical");
    }

    timerElement.textContent = `Tiempo: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(gameTimer);
      timeoutCallback();
    }
  }, 1000);
}

async function showVictoryMessage() {
  const livesLost = 5 - remainingLives;
  const maxLevel = 5;
  const efficiency = Math.round((scorePoints / (100 + maxLevel * 2)) * 100);

  const victoryPopup = document.createElement("div");
  const popupContainer = document.createElement("div");
  const popupTitle = document.createElement("h1");
  const popupMessage = document.createElement("p");
  const statsGrid = document.createElement("div");
  const podium = document.createElement("button");

  victoryPopup.className = "victory-popup";
  popupContainer.className = "victory-container";
  statsGrid.className = "stats-grid";
  podium.className = "restart-button";

  popupTitle.textContent = "🎉 ¡Felicidades! 🎉";
  popupMessage.textContent = "¡Completaste todos los niveles del juego!";
  podium.textContent = "Ver Podio";

  const createStatElement = (icon, value, title) => {
    const statElement = document.createElement("div");
    const iconElement = document.createElement("span");
    const valueElement = document.createElement("span");
    const titleElement = document.createElement("span");

    statElement.className = "stat-element";
    iconElement.className = "stat-icon";
    valueElement.className = "stat-value";
    titleElement.className = "stat-title";

    iconElement.textContent = icon;
    valueElement.textContent = value;
    titleElement.textContent = title;

    statElement.appendChild(iconElement);
    statElement.appendChild(valueElement);
    statElement.appendChild(titleElement);

    return statElement;
  };

  statsGrid.appendChild(createStatElement("🏆", scorePoints, "Puntos totales"));
  statsGrid.appendChild(createStatElement("💔", livesLost, "Vidas perdidas"));
  statsGrid.appendChild(
    createStatElement("📈", `${efficiency}%`, "Eficiencia")
  );
  statsGrid.appendChild(
    createStatElement("🚀", `${maxLevel}/5`, "Nivel alcanzado")
  );

  podium.onclick = async () => {
    victoryPopup.remove();
    remainingLives = 5;
    scorePoints = 0;
    const mainContent = document.querySelector("#root");
    mainContent.innerHTML = "";

    const vistaResultados = await resultado();
    mainContent.appendChild(vistaResultados);
  };

  popupContainer.appendChild(popupTitle);
  popupContainer.appendChild(popupMessage);
  popupContainer.appendChild(statsGrid);
  popupContainer.appendChild(podium);

  // Suponiendo que ya tienes el id_partida y el token
  fetch(
    "https://backend-game-mnte.onrender.com/api/partidas/guardar-resultado",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"), // o como guardes tu token
      },
      body: JSON.stringify({
        id_partida: localStorage.getItem("id_partida"), // guarda esto antes de jugar
        id_login: localStorage.getItem("userId"),
        puntos_obtenidos: scorePoints,
      }),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("Puntos guardados:", data);
    })
    .catch((err) => console.error("Error al guardar puntos:", err));

  victoryPopup.appendChild(popupContainer);
  document.body.appendChild(victoryPopup);
}

function showLifeLostMessage(callback) {
  const lifeLostPopup = document.createElement("div");
  lifeLostPopup.className = "life-lost-popup";
  lifeLostPopup.innerHTML = `
      <h2>💔 ¡Perdiste una vida!</h2>
      <p>¡Inténtalo de nuevo!</p>
      <button id="retry-level-btn">Reintentar nivel</button>
  `;

  document.body.appendChild(lifeLostPopup);

  document.querySelector("#retry-level-btn").onclick = () => {
    lifeLostPopup.remove();
    callback();
  };
}

function showGameOverMessage() {
  const gameOverPopup = document.createElement("div");
  gameOverPopup.className = "game-over-popup";

  gameOverPopup.innerHTML = `
      <h1>💔 ¡Game Over!</h1>
      <p>Se te acabaron las vidas, pero puedes volver a intentarlo.</p>
      <button id="restart-game-btn">Reiniciar Juego</button>
  `;

  document.body.appendChild(gameOverPopup);

  document.querySelector("#restart-game-btn").onclick = () => {
    gameOverPopup.remove();
    remainingLives = 5;
    scorePoints = 0;
    const gameContainer = document.querySelector("#root");
    gameContainer.innerHTML = "";
    memoriaGame();
  };
}

memoriaGame();

export { memoriaGame };
