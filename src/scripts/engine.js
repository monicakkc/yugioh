
// definir o estado, criando uma constante como objeto
const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const playPauseBtn = document.getElementById('playPauseBtn');

// enumerar as cartas - listar para resgatar de maneira facil
const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        LoseOf: [1],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
};

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);


    if (fieldSide == state.playerSides.player1) {
        cardImage.classList.add("card");
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        });
    };
    
    return cardImage;
};

async function setCardsField(cardId) {
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();
    await showHiddenCardFieldsImages(true);
    await hiddenCardDetails();
    await drawCardInField(cardId, computerCardId);
    let duelResults = await checkDuelResults(cardId, computerCardId);
    await updateScore();
    await drawButton(duelResults);
};

async function showHiddenCardFieldsImages(value) {
    if (value == true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    } else {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";        
    }; 
};

async function hiddenCardDetails() {
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
    state.cardSprites.avatar.src = "./src/assets/icons/card-back.png"; 

};

async function showMessageCardDetails(msg1, msg2) {
    state.cardSprites.name.innerText = msg1;
    state.cardSprites.type.innerText = msg2;
    state.cardSprites.avatar.src = "./src/assets/icons/card-back.png";    
};

async function drawCardInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
};

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Draw"; //sempre inicializa como empate
    let playerCard = cardData[playerCardId];

    if(playerCard.winOf.includes(computerCardId)) {
        duelResults = "Win";
        state.score.playerScore++;
    };    

    if(playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "Lose";
        state.score.computerScore++;
    };
    await playAudio(duelResults);
    await showMessageCardDetails("Clique", "no botão");
    return duelResults;
};

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
};

async function updateScore() {
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore}  |  Lose : ${state.score.computerScore}`;
};

async function removeAllCardsImages() {
    let { computerBOX, player1BOX } = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
    
};

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage =  await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
};

async function resetDuel() {
    await showMessageCardDetails("Selecione", "uma carta");
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();

};

async function resetMusic() {
    if (bgm.paused) {
        bgm.play();  // Toca a música
        playPauseBtn.textContent = 'Pause Music'; // Muda o texto do botão
    } else {
        bgm.pause(); // Pausa a música
        playPauseBtn.textContent = 'Play Music'; // Muda o texto do botão
    }
};    


async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

    try {
        audio.play();
        
    } catch {};
};
function init() {
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
    const bgm = document.getElementById("bgm");

};

resetMusic();
init();
