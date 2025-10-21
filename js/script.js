// Глобальные переменные для хранения имён
let player1Name = "";
let player2Name = "";
let symbols = ["X", "O"];
let currentIndex = 0;

// Код закрытия формы, открытия игры
const buttonStart = document.querySelector("#button-form");
const formValidate = document.querySelector("#form");
const blockGame = document.querySelector(".block-center");

// Ошибки при валидации
const blockWarningLimit = document.getElementById("block-form__limit");
const blockWarningDouble = document.getElementById("block-error__double");
const blockWarningZero = document.getElementById("block-error__zero");

// Имена игроков
const player1Input = document.getElementById("player1-form");
const player2Input = document.getElementById("player2-form");

// Таблица
const tabel = document.querySelector("#tabel");

// Логика валидации
buttonStart.addEventListener("click", function (event) {
  event.preventDefault();

  // Получить значения ПРИ КАЖДОМ клике - без пробелов с 2 сторон
  const player1Value = player1Input.value.trim();
  const player2Value = player2Input.value.trim();

  // Валидация формы проверка на длинну / пустоту /
  if (player1Value.length == 0 || player2Value.length == 0) {
    blockWarningZero.style.display = "block";
  } else if (player1Value.length >= 50 || player2Value.length >= 50) {
    blockWarningLimit.style.display = "block";
  } else if (player1Value === player2Value) {
    blockWarningDouble.style.display = "block";
  } else {
    // Показать / Скрыть
    formValidate.style.display = "none";
    blockGame.style.display = "block";

    // Отобразить имена игроков
    const nameElements = document.querySelectorAll(".name-gamers p");
    nameElements[0].textContent = `Игрок 1: ${player1Value}`;
    nameElements[1].textContent = `Игрок 2: ${player2Value}`;

    // В блоке else после валидации:
    player1Name = player1Value; // сохраняем имя 1 игрока
    player2Name = player2Value; // сохраняем имя 2 игрока
    symbols[currentIndex]; // начинаем с х

    // Обновляем надпись кто ходит
    currentPlayer.textContent = `Ходит: ${player1Name}`;

    // Инициализация статистики для новых игроков
    stats = loadStats(); // Загружаем текущую статистику
    if (!stats[player1Name]) {
      stats[player1Name] = { wins: 0, losses: 0, draws: 0 };
    }
    if (!stats[player2Name]) {
      stats[player2Name] = { wins: 0, losses: 0, draws: 0 };
    }
    localStorage.setItem("stats", JSON.stringify(stats));
  }

  updateStats();
  initGame(); // вызов функции
});

// Статистика подеда / ничья / поражение

function loadStats() {
  const savedStats = localStorage.getItem("stats");
  return savedStats ? JSON.parse(savedStats) : {};
}

let stats = {};

function updateStats() {
  stats = loadStats();
  if (!stats[player1Name]) {
    stats[player1Name] = { wins: 0, losses: 0, draws: 0 };
  }
  if (!stats[player2Name]) {
    stats[player2Name] = { wins: 0, losses: 0, draws: 0 };
  }
  localStorage.setItem("stats", JSON.stringify(stats));
}

function updateGameResult(winnerName, loserName) {
  stats = loadStats();
  stats[winnerName].wins += 1;
  stats[loserName].losses += 1;
  localStorage.setItem("stats", JSON.stringify(stats));
}

function updateDraw(drawsName1, drawsName2) {
  stats = loadStats();
  stats[drawsName1].draws += 1;
  stats[drawsName2].draws += 1;
  localStorage.setItem("stats", JSON.stringify(stats));
}

// Логика ячеек + Таблица ячеек

let currentPlayer = document.querySelector("#currentPlayer");

let arrGame = [
  ["", "", ""], // первая строка
  ["", "", ""], // вторая строка
  ["", "", ""], // третья строка
];

function initGame() {
  const cells = document.querySelectorAll(".game-cell");
  cells.forEach((cell) => {
    cell.addEventListener("click", HandleCellClick);
  });
}

let isGameActive = true;

function switchPlayer() {
  currentIndex = currentIndex === 0 ? 1 : 0;
  const nextPlayer = currentIndex === 0 ? player1Name : player2Name;
  currentPlayer.textContent = `Ходит: ${nextPlayer}`;
}

function HandleCellClick() {
  if (!isGameActive) return;
  const row = this.dataset.row;
  const col = this.dataset.col;
  if (arrGame[row][col].length === 0) {
    arrGame[row][col] = symbols[currentIndex];
    this.textContent = symbols[currentIndex];
    checkWin();
    switchPlayer(); // просто вызываем функцию смены игрока
  }
}

// Логика Победа / Ничья

function handleWin(winnerSymbol) {
  isGameActive = false;
  tableShow();
  blockGame.style.display = "none";
  if (winnerSymbol === "X") {
    updateGameResult(player1Name, player2Name);
    alert(`Игра окончена победитель ${player1Name}`);
  } else {
    updateGameResult(player2Name, player1Name);
    alert(`Игра окончена победитель ${player2Name}`);
  }
}

function checkWin() {
  // Проверка на 3 горизонтали
  for (let i = 0; i < arrGame.length; i++) {
    const element = arrGame[i];
    if (
      element[0] !== "" &&
      element[0] === element[1] &&
      element[1] === element[2]
    ) {
      handleWin(element[0]);
    }
  }

  // Проверка на 3 вертикалии
  for (let j = 0; j < arrGame.length; j++) {
    if (
      arrGame[0][j] !== "" &&
      arrGame[0][j] === arrGame[1][j] &&
      arrGame[1][j] === arrGame[2][j]
    ) {
      handleWin(arrGame[0][j]);
    }
  }

  // Проверка на 2 диагонали

  if (
    arrGame[0][0] !== "" &&
    arrGame[0][0] == arrGame[1][1] &&
    arrGame[1][1] == arrGame[2][2]
  ) {
    handleWin(arrGame[0][0]);
  }
  // Справа вниз
  if (
    arrGame[0][2] !== "" &&
    arrGame[0][2] === arrGame[1][1] &&
    arrGame[1][1] === arrGame[2][0]
  ) {
    handleWin(arrGame[0][2]);
  }
  // ==============================

  let allFilled = arrGame.flat().every((cell) => cell !== "");
  if (allFilled) {
    isGameActive = false;
    tableShow();
    blockGame.style.display = "none";
    updateDraw(player1Name, player2Name);
    alert("ничья");
  }
}

//  Таблица показать

function tableShow() {
  tabel.style.display = "block";
  updateTable();
}

// Играть заново
const newGames = document.querySelector("#againGame");

newGames.addEventListener("click", function (event) {
  blockGame.style.display = "block";
  tabel.style.display = "none";
  const cells = document.querySelectorAll(".game-cell");
  cells.forEach((element) => {
    element.textContent = "";
  });
  arrGame = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  isGameActive = true;
  currentIndex = 0;
  currentPlayer.textContent = `Ходит: ${player1Name}`;
});

// Новая игра

const startGames = document.querySelector("#startGames");

startGames.addEventListener("click", function (event) {
  event.preventDefault();
  blockGame.style.display = "none";
  tabel.style.display = "none";
  formValidate.style.display = "block";
  player1Input.value = "";
  player2Input.value = "";
  player1Name = "";
  player2Name = "";

  const cells = document.querySelectorAll(".game-cell");
  cells.forEach((element) => {
    element.textContent = "";
  });
  arrGame = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  isGameActive = true;
  currentIndex = 0;

  blockWarningZero.style.display = "none";
  blockWarningLimit.style.display = "none";
  blockWarningDouble.style.display = "none";
});

function updateTable() {
  // 1. Найти контейнер таблицы
  const tabelContainer = document.querySelector(".tabel");

  // 2. Удалить старые строки (кроме заголовков)
  const oldRows = document.querySelectorAll(".tabel-resault");
  oldRows.forEach((row) => {
    if (!row.classList.contains("tabel-resaults")) {
      row.remove();
    }
  });

  // 3. Загрузить актуальную статистику
  stats = loadStats();

  // 4. Для КАЖДОГО игрока создать строку
  for (const playerName in stats) {
    const playerStats = stats[playerName];

    // Создать строку
    const rowDiv = document.createElement("div");
    rowDiv.className = "tabel-resault";

    // Создать и заполнить ячейки РЕАЛЬНЫМИ данными
    const nameP = document.createElement("p");
    nameP.className = "tabel-resault__elem";
    nameP.textContent = playerName; // реальное имя игрока

    const winsP = document.createElement("p");
    winsP.className = "tabel-resault__elem";
    winsP.textContent = playerStats.wins; // победы игрока

    const defeatP = document.createElement("p");
    defeatP.className = "tabel-resault__elem";
    defeatP.textContent = playerStats.losses; // поражения игрока

    const drawP = document.createElement("p");
    drawP.className = "tabel-resault__elem";
    drawP.textContent = playerStats.draws; // ничьи игрока

    // Добавить ячейки в строку
    rowDiv.appendChild(nameP);
    rowDiv.appendChild(winsP);
    rowDiv.appendChild(defeatP);
    rowDiv.appendChild(drawP);

    // Добавить строку в таблицу
    tabelContainer.appendChild(rowDiv);
  }
}
