const container = document.getElementById("cards-container");
const arcanaFilter = document.getElementById("arcanaFilter");
const suitFilter = document.getElementById("suitFilter");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

let allCards = [];

function formatImageName(name) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "_") + ".jpg";
}

function createCardHTML(card) {
    const imageName = formatImageName(card.name);
    const imagePath = `./images/${imageName}`;
    const backImage = "./images/back.jpg";

    return `
        <div class="card">
            <div class="card-inner">
                <div class="card-front">
                    <img src="${backImage}">
                </div>

                <div class="card-back">
                    <img src="${imagePath}" 
                         onerror="this.src='https://via.placeholder.com/300x400?text=${encodeURIComponent(card.name)}'">

                    <p><strong>Nome:</strong> ${card.name}</p>
                    <p><strong>Deck:</strong> ${card.type}</p>
                    <p><strong>Significado:</strong> ${card.meaning_up}</p>
                    <p><strong>Reverso:</strong> ${card.meaning_rev}</p>
                </div>
            </div>

            <h2 class="card-title">${card.name}</h2>
        </div>
    `;
}

function renderCards(cards) {
    const counter = document.getElementById("counter");

    if (cards.length === 0) {
        container.innerHTML = "<p>Nenhuma carta encontrada 🔮</p>";
        counter.innerText = "0 cartas encontradas";
        return;
    }

    let html = "";

    cards.forEach(card => {
        html += createCardHTML(card);
    });

    container.innerHTML = html;
    counter.innerText = `${cards.length} cartas encontradas`;
}

function applyFilters() {
    const arcana = arcanaFilter.value;
    const suit = suitFilter.value;
    const search = searchInput.value.toLowerCase().trim();

    let filtered = allCards;

    if (arcana !== "all") {
        filtered = filtered.filter(card => card.type === arcana);
    }

    if (suit !== "all") {
        filtered = filtered.filter(card => card.suit === suit);
    }

    if (search !== "") {
        filtered = filtered.filter(card =>
            card.name.toLowerCase().includes(search)
        );
    }

    renderCards(filtered);
}

async function loadCards() {
    try {
        const response = await fetch("https://tarotapi.dev/api/v1/cards");
        const data = await response.json();

        allCards = data.cards;

        renderCards(allCards);

    } catch (error) {
        console.error("Erro:", error);
    }
}

arcanaFilter.addEventListener("change", applyFilters);
suitFilter.addEventListener("change", applyFilters);
searchBtn.addEventListener("click", applyFilters);

loadCards();