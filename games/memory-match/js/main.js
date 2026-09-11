document.addEventListener('DOMContentLoaded', () => {
    const screens = {
        menu: document.getElementById('start-menu'),
        levels: document.getElementById('level-select-screen'),
        how: document.getElementById('how-to-play-screen'),
        settings: document.getElementById('settings-screen'),
        playing: document.getElementById('playing-screen'),
        pause: document.getElementById('pause-screen'),
        complete: document.getElementById('level-complete-screen'),
        gameOver: document.getElementById('game-over-screen')
    };

    const game = new MemoryGame();
    let currentLevelId = 1;

    function showScreen(screenName) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        if (screens[screenName]) {
            screens[screenName].classList.add('active');
        }
    }

    function updateMenuProgression() {
        const saveData = SaveSystem.get();
        const maxLevel = Math.max(...saveData.unlockedLevels);
        const percent = Math.floor((maxLevel / 10) * 100);
        const html = `
            <div>LEVEL ${maxLevel} — UNLOCKED</div>
            <div class="progression-bar">
                <div class="progression-fill" style="width: ${percent}%;"></div>
            </div>
            <div style="font-size: 0.9rem; margin-top: 5px;">${percent}% Completion</div>
        `;
        document.getElementById('menu-progression').innerHTML = html;
    }

    function initMenu() {
        updateMenuProgression();

        document.getElementById('btn-play').addEventListener('click', () => {
            audio.init();
            audio.playClick();
            currentLevelId = 1;
            startGame(currentLevelId);
        });

        document.getElementById('btn-exit-game').addEventListener('click', () => {
            audio.playClick();
            game.cleanup();
            updateMenuProgression();
            showScreen('menu');
        });

        document.getElementById('btn-pause-top').addEventListener('click', () => {
            audio.playClick();
            game.pauseTimer();
            showScreen('pause');
        });

        document.getElementById('btn-level-select').addEventListener('click', () => {
            audio.init();
            audio.playClick();
            renderLevelGrid();
            showScreen('levels');
        });

        document.getElementById('btn-how-to-play').addEventListener('click', () => {
            audio.playClick();
            showScreen('how');
        });

        document.getElementById('btn-settings').addEventListener('click', () => {
            audio.playClick();
            updateSoundButton();
            showScreen('settings');
        });

        document.getElementById('btn-back-menu-from-levels').addEventListener('click', () => {
            audio.playClick();
            showScreen('menu');
        });
        document.getElementById('btn-back-menu-from-how').addEventListener('click', () => {
            audio.playClick();
            showScreen('menu');
        });
        document.getElementById('btn-back-menu-from-settings').addEventListener('click', () => {
            audio.playClick();
            showScreen('menu');
        });

        document.getElementById('btn-toggle-sound').addEventListener('click', () => {
            audio.init();
            const isEnabled = audio.toggle();
            updateSoundButton();
            if (isEnabled) audio.playClick();
        });

        // Pause menu was updated to btn-pause-top earlier

        document.getElementById('btn-resume').addEventListener('click', () => {
            audio.playClick();
            game.resumeTimer();
            showScreen('playing');
        });

        document.getElementById('btn-restart-pause').addEventListener('click', () => {
            audio.playClick();
            startGame(currentLevelId);
        });

        document.getElementById('btn-back-menu-from-pause').addEventListener('click', () => {
            audio.playClick();
            game.cleanup();
            updateMenuProgression();
            showScreen('menu');
        });

        // Hint
        document.getElementById('btn-hint').addEventListener('click', () => {
            audio.playClick();
            game.useHint();
        });

        // Complete menu
        document.getElementById('btn-next-level').addEventListener('click', () => {
            audio.playClick();
            if (currentLevelId < 10) {
                currentLevelId++;
                startGame(currentLevelId);
            } else {
                showScreen('menu');
            }
        });

        document.getElementById('btn-retry-level').addEventListener('click', () => {
            audio.playClick();
            startGame(currentLevelId);
        });

        document.getElementById('btn-level-select-complete').addEventListener('click', () => {
            audio.playClick();
            renderLevelGrid();
            showScreen('levels');
        });

        document.getElementById('btn-main-menu-complete').addEventListener('click', () => {
            audio.playClick();
            showScreen('menu');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && screens.playing.classList.contains('active')) {
                audio.playClick();
                game.pauseTimer();
                showScreen('pause');
            }
        });
    }

    function updateSoundButton() {
        const btn = document.getElementById('btn-toggle-sound');
        btn.textContent = audio.enabled ? 'ON' : 'OFF';
        if(audio.enabled) {
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
        } else {
            btn.classList.add('btn-secondary');
            btn.classList.remove('btn-primary');
        }
    }

    function renderLevelGrid() {
        const grid = document.getElementById('level-grid');
        grid.innerHTML = '';
        const saveData = SaveSystem.get();

        LEVELS.forEach(level => {
            const card = document.createElement('div');
            const isUnlocked = saveData.unlockedLevels.includes(level.id);
            const stars = saveData.stars[level.id] || 0;
            const starStr = isUnlocked && saveData.completedLevels.includes(level.id) ? '⭐'.repeat(stars) : '';
            
            card.className = `level-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            card.innerHTML = `
                <h3>LEVEL ${level.id}</h3>
                <p>${level.pairs} Pairs</p>
                <p>${starStr}</p>
            `;

            if (isUnlocked) {
                card.addEventListener('click', () => {
                    audio.playClick();
                    currentLevelId = level.id;
                    startGame(currentLevelId);
                });
            }

            grid.appendChild(card);
        });
    }

    function startGame(levelId) {
        showScreen('playing');
        game.startLevel(levelId);
    }

    game.onLevelComplete = (result) => {
        SaveSystem.updateLevelProgress(result.levelId, result.score, result.time, result.moves, result.stars);
        
        document.getElementById('complete-title').textContent = result.levelId === 10 ? '🏆 MEMORY MASTER' : 'LEVEL COMPLETE!';
        document.getElementById('stars-display').textContent = '⭐'.repeat(result.stars);
        document.getElementById('score-display').textContent = result.score;
        document.getElementById('complete-time-display').textContent = document.getElementById('time-display').textContent;
        document.getElementById('complete-moves-display').textContent = result.moves;
        
        const saveData = SaveSystem.get();
        document.getElementById('best-score-display').textContent = saveData.bestScores[result.levelId] || result.score;

        if (result.levelId >= 10) {
            document.getElementById('btn-next-level').style.display = 'none';
        } else {
            document.getElementById('btn-next-level').style.display = 'inline-block';
        }

        // Notify InfinityPlay if applicable
        if (window.parent && window.parent.InfinityPlay) {
            try {
                // If InfinityPlay has a progress API
                // window.parent.InfinityPlay.addXP(result.score);
            } catch (e) {}
        }

        showScreen('complete');
    };

    game.onGameOver = () => {
        showScreen('gameOver');
    };

    document.getElementById('btn-retry-gameover').addEventListener('click', () => {
        audio.playClick();
        startGame(currentLevelId);
    });

    document.getElementById('btn-main-menu-gameover').addEventListener('click', () => {
        audio.playClick();
        game.cleanup();
        showScreen('menu');
    });

    initMenu();
});

