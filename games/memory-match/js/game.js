class MemoryGame {
    constructor() {
        this.board = document.getElementById('game-board');
        this.movesDisplay = document.getElementById('moves-display');
        this.timeDisplay = document.getElementById('time-display');
        this.levelDisplay = document.getElementById('level-display');
        this.hintCountDisplay = document.getElementById('hint-count');
        this.comboDisplay = document.getElementById('combo-display');
        this.livesDisplay = document.getElementById('lives-display');
        
        this.state = {
            level: null,
            cards: [],
            flippedCards: [],
            matchedPairs: 0,
            moves: 0,
            lives: 5,
            timeElapsed: 0,
            hintsLeft: 0,
            timerInterval: null,
            isLocked: false,
            combo: 0
        };
        
        this.onLevelComplete = null;
        this.onGameOver = null;
    }

    startLevel(levelId) {
        this.cleanup();
        const levelConfig = LEVELS.find(l => l.id === levelId);
        this.state.level = levelConfig;
        
        this.state.hintsLeft = 5; // 5 lifelines total
        this.hintCountDisplay.textContent = this.state.hintsLeft;
        this.levelDisplay.textContent = levelId;
        
        this.state.lives = 5;
        this.livesDisplay.textContent = this.state.lives;

        this.board.style.gridTemplateColumns = `repeat(${levelConfig.grid[0]}, 1fr)`;
        
        const cardIcons = CardDeck.generate(levelConfig.pairs);
        
        cardIcons.forEach((icon, index) => {
            const cardElement = CardDeck.createDOMCard(icon, index, (card) => this.handleCardClick(card), levelId);
            this.board.appendChild(cardElement);
            this.state.cards.push(cardElement);
        });
        
        this.updateTimeDisplay();
        this.movesDisplay.textContent = '0';
        this.comboDisplay.classList.remove('visible');
    }

    handleCardClick(card) {
        if (this.state.isLocked) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

        if (this.state.timeElapsed === 0 && !this.state.timerInterval) {
            this.startTimer();
        }

        audio.playFlip();
        card.classList.add('flipped');
        card.setAttribute('aria-label', `Card showing ${card.dataset.icon}`);
        this.state.flippedCards.push(card);

        if (this.state.flippedCards.length === 2) {
            this.state.moves++;
            this.movesDisplay.textContent = this.state.moves;
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.state.flippedCards;
        const match = card1.dataset.icon === card2.dataset.icon;

        if (match) {
            this.state.matchedPairs++;
            this.state.combo++;
            
            if (this.state.combo > 1) {
                this.showCombo(this.state.combo);
            }

            audio.playMatch();
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.state.flippedCards = [];

            if (this.state.matchedPairs === this.state.level.pairs) {
                this.completeLevel();
            }
        } else {
            this.state.isLocked = true;
            this.state.combo = 0;
            this.state.lives--;
            this.livesDisplay.textContent = this.state.lives;
            audio.playMismatch();
            
            card1.classList.add('mismatch');
            card2.classList.add('mismatch');

            if (this.state.lives <= 0) {
                this.pauseTimer();
                if (this.onGameOver) {
                    setTimeout(() => this.onGameOver(), 500);
                }
                return;
            }

            setTimeout(() => {
                card1.classList.remove('flipped', 'mismatch');
                card2.classList.remove('flipped', 'mismatch');
                card1.setAttribute('aria-label', 'Memory card, face down');
                card2.setAttribute('aria-label', 'Memory card, face down');
                this.state.flippedCards = [];
                this.state.isLocked = false;
            }, 1000);
        }
    }

    showCombo(count) {
        this.comboDisplay.textContent = `COMBO x${count}`;
        this.comboDisplay.classList.add('visible');
        setTimeout(() => {
            this.comboDisplay.classList.remove('visible');
        }, 1500);
    }

    startTimer() {
        this.state.timerInterval = setInterval(() => {
            this.state.timeElapsed++;
            this.updateTimeDisplay();
        }, 1000);
    }

    pauseTimer() {
        clearInterval(this.state.timerInterval);
        this.state.timerInterval = null;
    }

    resumeTimer() {
        if (this.state.timeElapsed > 0 && !this.state.timerInterval && this.state.matchedPairs < this.state.level.pairs) {
            this.startTimer();
        }
    }

    updateTimeDisplay() {
        const minutes = Math.floor(this.state.timeElapsed / 60);
        const seconds = this.state.timeElapsed % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    useHint() {
        if (this.state.hintsLeft <= 0 || this.state.isLocked || this.state.flippedCards.length > 0) return;
        
        this.state.hintsLeft--;
        this.hintCountDisplay.textContent = this.state.hintsLeft;
        
        const unmatched = this.state.cards.filter(c => !c.classList.contains('matched'));
        if (unmatched.length === 0) return;

        this.state.isLocked = true;
        unmatched.forEach(c => c.classList.add('flipped'));
        
        setTimeout(() => {
            unmatched.forEach(c => c.classList.remove('flipped'));
            this.state.isLocked = false;
        }, 1000);
    }

    completeLevel() {
        this.pauseTimer();
        audio.playComplete();
        
        let score = 1000 * this.state.level.id;
        
        // Time bonus
        if (this.state.timeElapsed < this.state.level.timeTarget) {
            score += (this.state.level.timeTarget - this.state.timeElapsed) * 10;
        }
        
        // Moves bonus (ideal moves = pairs)
        const extraMoves = this.state.moves - this.state.level.pairs;
        if (extraMoves <= 0) {
            score += 500; // Perfect!
        } else {
            score -= extraMoves * 5;
        }
        
        score = Math.max(0, score);
        
        let stars = 1;
        if (this.state.moves <= this.state.level.pairs + 2 && this.state.timeElapsed <= this.state.level.timeTarget) stars = 3;
        else if (this.state.moves <= this.state.level.pairs * 1.5) stars = 2;

        if (this.onLevelComplete) {
            this.onLevelComplete({
                levelId: this.state.level.id,
                score,
                time: this.state.timeElapsed,
                moves: this.state.moves,
                stars
            });
        }
    }

    cleanup() {
        this.pauseTimer();
        this.board.innerHTML = '';
        this.state = {
            level: null,
            cards: [],
            flippedCards: [],
            matchedPairs: 0,
            moves: 0,
            timeElapsed: 0,
            hintsLeft: 0,
            timerInterval: null,
            isLocked: false,
            combo: 0
        };
    }
}

