class CardDeck {
    static generate(pairsCount) {
        let selectedIcons = ICONS.slice(0, pairsCount);
        let cards = [...selectedIcons, ...selectedIcons];
        return this.shuffle(cards);
    }

    static shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    static createDOMCard(icon, index, onClickCallback, levelId = 1) {
        const card = document.createElement('div');
        card.className = `card ${levelId === 10 ? 'card-level-10' : ''}`;
        card.dataset.index = index;
        card.dataset.icon = icon;
        
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Memory card, face down');
        card.tabIndex = 0;

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const cardBack = document.createElement('div');
        cardBack.className = 'card-face card-back';
        
        // Premium back design
        cardBack.innerHTML = `
            <div class="card-back-content">
                <div class="corner corner-tl">◇</div>
                <div class="corner corner-tr">◇</div>
                <div class="center-emblem">✦</div>
                <div class="center-text">INFINITY</div>
                <div class="corner corner-bl">◇</div>
                <div class="corner corner-br">◇</div>
            </div>
            <div class="holo-shimmer"></div>
        `;
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-face card-front';
        cardFront.innerHTML = `
            <div class="card-front-content">
                <div class="card-icon">${icon}</div>
            </div>
            <div class="holo-shimmer"></div>
        `;

        cardInner.appendChild(cardBack);
        cardInner.appendChild(cardFront);
        card.appendChild(cardInner);

        card.addEventListener('click', () => {
            card.classList.add('pressed');
            setTimeout(() => card.classList.remove('pressed'), 150);
            onClickCallback(card);
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.add('pressed');
                setTimeout(() => card.classList.remove('pressed'), 150);
                onClickCallback(card);
            }
        });

        return card;
    }
}

