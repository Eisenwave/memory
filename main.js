// CONSTANTS ===================================================================

const ICONS = [
    "apple",
    "asparagus",
    "aubergine",
    "avocado",
    "bacon",
    "baguette",
    "banana",
    "beans",
    "beer",
    "biscuit",
    "blueberries",
    "bread",
    "broccoli",
    "butter",
    "cabbage",
    "cake",
    "can",
    "candy",
    "carrot",
    "cauliflower",
    "cereals",
    "cheese",
    "cherries",
    "chili",
    "chives",
    "chocolate",
    "coffee-maker",
    "cookies",
    "corn",
    "croissant",
    "cucumber",
    "cupcake",
    "doughnut",
    "egg",
    "fig",
    "fish",
    "frappe",
    "fries",
    "gingerbread",
    "grapes",
    "ham",
    "hamburger",
    "hazelnut",
    "hot-dog",
    "ice-cream",
    "jam",
    "jawbreaker",
    "kebab-1",
    "kebab-2",
    "lemon",
    "meat",
    "milk",
    "octopus",
    "olives",
    "orange",
    "pancakes",
    "peach",
    "pear",
    "pepper",
    "pie",
    "pineapple",
    "pizza",
    "pretzel",
    "pudding",
    "radish",
    "ramen",
    "raspberry",
    "salad",
    "salami",
    "sandwich",
    "sausage",
    "shrimp",
    "steak",
    "strawberry",
    "sushi",
    "taco",
    "toast",
    "tomato",
    "watermelon",
    "whiskey",
    "wine",
];

const CARD_PATH = "cards";
const BACKGROUND = "background.svg";
const ICON_EXT = ".svg";
const MATCH_RATE_PLACEHOLDER = "N/A";

const E_BOARD_TABLE = document.getElementById("board-table");
const E_STASH = document.getElementById("stash");
const E_MOVE_COUNTER = document.getElementById("move-counter");
const E_PAIR_COUNTER = document.getElementById("pair-counter");
const E_MATCH_RATE = document.getElementById("match-rate");

const A_FLIPPED = "data-flipped";

// GLOBAL VARIABLES ============================================================

let boardWidth = 0;
let boardCards = 0;

let chosen = Array(null, null);

// UTILITY =====================================================================

function back(array) {
    return array[array.length - 1];
}

function swap(array, i, j) {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        swap(array, i, j)
    }
}

function chooseCardIds(size) {
    let cardIds = [...ICONS];
    shuffle(cardIds);
    cardIds = cardIds.slice(0, size);
    cardIds = [...cardIds, ...cardIds];
    shuffle(cardIds);
    return cardIds;
}

// GAME LOGIC ==================================================================

function createCard(icon) {
    let card = document.createElement("img");
    card.id = "card-" + icon;
    card.alt = icon;
    card.constSrc = CARD_PATH + "/" + icon + ICON_EXT;
    card.src = card.src = card.constSrc;
    card.className = "card";
    card.flipped = true;
    card.draggable = false;
    card.onclick = event => clickCard(event.target);
    card.setAttribute(A_FLIPPED, "true");
    return card;
}

function addCardToBoard(card) {
    if (boardCards++ % boardWidth === 0) {
        let row = document.createElement('tr');
        E_BOARD_TABLE.appendChild(row);
    }

    let row = back(E_BOARD_TABLE.childNodes);
    let cell = document.createElement('td');
    row.appendChild(cell);
    cell.appendChild(card);
}

function flip(card) {
    card.setAttribute(A_FLIPPED, card.getAttribute(A_FLIPPED) === "false");
    let flipped = card.getAttribute(A_FLIPPED) === "true";

    card.src = flipped ? card.constSrc : BACKGROUND;

    if (flipped) {
        card.classList.add("flipped");
    } else {
        card.classList.remove("flipped");
    }
}

function clickCard(card) {
    if (card.stashed || card.getAttribute(A_FLIPPED) === "true" && chosen[1] === null) {
        return;
    }

    if (chosen[0] === null) {
        flip(card);
        chosen[0] = card;
    } else if (chosen[1] === null) {
        flip(card);
        chosen[1] = card;
    } else {
        ++E_MOVE_COUNTER.innerText;
        choosePair(chosen[0], chosen[1]);
        updateMatchRate();

        flip(chosen[0]);
        flip(chosen[1]);
        chosen[0] = null;
        chosen[1] = null;
    }
}

function updateMatchRate() {
    let matchRatio = (+E_PAIR_COUNTER.innerText) / (+E_MOVE_COUNTER.innerText);
    E_MATCH_RATE.innerText = (matchRatio * 100).toFixed(0) + "%";
}

function choosePair(first, second) {
    if (first.constSrc !== second.constSrc) {
        return;
    }

    ++E_PAIR_COUNTER.innerText;

    let stashedCard = first.cloneNode(false);
    E_STASH.appendChild(stashedCard);
    stashedCard.active = false;
    stashedCard.classList.add("stashed")

    for (let card of [first, second]) {
        card.stashed = true;
        card.classList.add("hidden");
    }
}

function resetBoard(size) {
    clearBoard();

    boardWidth = Math.sqrt(size) * 2;

    for (let id of chooseCardIds(size)) {
        let card = createCard(id);
        flip(card);
        addCardToBoard(card);
    }
}

function clearBoard() {
    for (let child of [...E_BOARD_TABLE.childNodes, ...E_STASH.childNodes]) {
        child.remove();
    }
    boardCards = 0;
    E_MOVE_COUNTER.innerText = E_PAIR_COUNTER.innerText = "0";
    E_MATCH_RATE.innerText = MATCH_RATE_PLACEHOLDER;
    chosen[0] = chosen[1] = null;
}

// INIT ========================================================================

resetBoard(9);
E_MATCH_RATE.innerText = MATCH_RATE_PLACEHOLDER;
