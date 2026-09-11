const SAVE_KEY = 'infinityplay_memory_match';

const defaultSaveData = {
    unlockedLevels: [1],
    completedLevels: [],
    bestScores: {},
    bestTimes: {},
    bestMoves: {},
    stars: {},
    settings: {
        sound: true
    }
};

class SaveSystem {
    static load() {
        try {
            const data = localStorage.getItem(SAVE_KEY);
            if (data) {
                return { ...defaultSaveData, ...JSON.parse(data) };
            }
        } catch (e) {
            console.error('Failed to load save data', e);
        }
        return { ...defaultSaveData };
    }

    static save(data) {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save data', e);
        }
    }

    static get() {
        return this.load();
    }

    static updateLevelProgress(level, score, time, moves, stars) {
        const data = this.load();
        
        if (!data.completedLevels.includes(level)) {
            data.completedLevels.push(level);
        }
        
        const nextLevel = level + 1;
        if (nextLevel <= 10 && !data.unlockedLevels.includes(nextLevel)) {
            data.unlockedLevels.push(nextLevel);
        }

        if (!data.bestScores[level] || score > data.bestScores[level]) {
            data.bestScores[level] = score;
        }

        if (!data.bestTimes[level] || time < data.bestTimes[level]) {
            data.bestTimes[level] = time;
        }

        if (!data.bestMoves[level] || moves < data.bestMoves[level]) {
            data.bestMoves[level] = moves;
        }

        if (!data.stars[level] || stars > data.stars[level]) {
            data.stars[level] = stars;
        }

        this.save(data);
    }
    
    static toggleSound() {
        const data = this.load();
        data.settings.sound = !data.settings.sound;
        this.save(data);
        return data.settings.sound;
    }
}

