/**
 * InfinityPlay - Main Application Entry Point
 * Orchestrates components, features, modals, and global events
 */

(function() {
  const App = {
    init() {
      // Load platform settings & themes
      this.loadSettings();

      // Initialize core modules
      window.InfinityPlay.Header.init();
      window.InfinityPlay.Sidebar.init();
      window.InfinityPlay.GameCard.renderTopGames();
      window.InfinityPlay.GameCard.renderAllGames();
      window.InfinityPlay.Leaderboard.init();
      window.InfinityPlay.Search.init();
      window.InfinityPlay.Filtering.init();
      window.InfinityPlay.Favorites.init();
      window.InfinityPlay.RecentlyPlayed.init();

      // Bind hero actions, modals, and avatar picker
      this.bindHeroBanner();
      this.bindModals();
      this.loadCurrentUser();
      this.bindAvatarPicker();

      console.log('⚡ InfinityPlay platform initialized successfully.');
    },

    bindHeroBanner() {
      const heroPlayBtn = document.getElementById('heroPlayBtn');
      if (heroPlayBtn) {
        heroPlayBtn.addEventListener('click', () => {
          this.launchGameModal('city-drive');
        });
      }

      // Carousel dots
      const dots = document.querySelectorAll('.carousel-dot');
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          dots.forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
          window.InfinityPlay.Helpers.showToast(`Featured slide ${index + 1} activated`, 'info');
        });
      });

      // Hero close button
      const heroCloseBtn = document.getElementById('heroCloseBtn');
      const heroBanner = document.getElementById('heroBanner');
      if (heroCloseBtn && heroBanner) {
        heroCloseBtn.addEventListener('click', () => {
          heroBanner.style.transition = 'all 0.3s ease';
          heroBanner.style.opacity = '0';
          heroBanner.style.transform = 'scale(0.98)';
          setTimeout(() => {
            heroBanner.style.display = 'none';
          }, 300);
        });
      }
    },

    bindModals() {
      // Close modal on overlay click or close button
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal || e.target.closest('.modal-close-btn')) {
            this.closeAllModals();
          }
        });
      });

      // Escape key closes modals
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeAllModals();
        }
      });

      // PostMessage listener for embedded games exiting
      window.addEventListener('message', (e) => {
        if (e.data && (e.data.type === 'exitGame' || e.data.type === 'busSimExit')) {
          const exitBtn = document.getElementById('gameFrameExitBtn');
          if (exitBtn) exitBtn.click();
          else this.closeAllModals();
        }
      });
    },

    closeAllModals() {
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
      });
    },

    /**
     * Opens the Game Details & Launch Modal
     */
    launchGameModal(gameId) {
      const game = window.InfinityPlay.gamesData.find(g => g.id === gameId);
      if (!game) return;

      // Track in recently played
      if (window.InfinityPlay.API) {
        window.InfinityPlay.API.addRecentlyPlayed(game.id);
      } else {
        window.InfinityPlay.Storage.addRecentlyPlayed(game.id);
      }

      const modal = document.getElementById('gameDetailsModal');
      const body = document.getElementById('gameModalBody');
      if (!modal || !body) return;

      const favs = window.InfinityPlay.Storage.getFavorites();
      const isFav = favs.includes(game.id);

      body.innerHTML = `
        <div style="position: relative; width: 100%; height: 200px; overflow: hidden; border-radius: 14px 14px 0 0; background: #080b14;">
          <img src="${game.topThumbnail || game.thumbnail}" alt="${game.name}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(8,10,18,0.2) 0%, rgba(15,21,40,0.95) 100%);"></div>
          <div style="position: absolute; bottom: 16px; left: 20px; right: 20px; display: flex; align-items: flex-end; justify-content: space-between;">
            <div>
              <span style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--color-cyan); letter-spacing: 0.05em;">
                ${game.category}
              </span>
              <h2 style="font-size: 1.6rem; font-weight: 900; color: #ffffff; line-height: 1.1; margin-top: 2px;">
                ${game.name}
              </h2>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.5); padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.1);">
              <span style="color: var(--color-gold);">★</span>
              <span style="font-weight: 700; color: #ffffff;">${game.rating.toFixed(1)}</span>
              <span style="color: var(--text-muted); font-size: 0.75rem;">(${game.playsFormatted})</span>
            </div>
          </div>
        </div>

        <div style="padding: 20px 24px; display: flex; flex-direction: column; gap: 16px;">
          <p style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.5;">
            ${game.description}
          </p>

          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${game.tags.map(t => `<span style="background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.3); color: #c4b5fd; font-size: 0.76rem; font-weight: 600; padding: 3px 10px; border-radius: 999px;">${t}</span>`).join('')}
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 10px; border: 1px solid var(--border-subtle); font-size: 0.82rem;">
            <div><span style="color: var(--text-muted);">Developer:</span> <strong style="color: #ffffff;">${game.developer}</strong></div>
            <div><span style="color: var(--text-muted);">Release:</span> <strong style="color: #ffffff;">${game.releaseDate}</strong></div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
            <button class="btn btn-ghost" id="modalFavBtn" style="gap: 6px;">
              <span style="color: ${isFav ? 'var(--color-pink)' : 'inherit'}; font-size: 1.1rem;">${isFav ? '❤' : '♡'}</span>
              <span>${isFav ? 'Saved to My Games' : 'Save to My Games'}</span>
            </button>

            <button class="btn btn-primary" id="modalStartPlayBtn" style="padding: 10px 28px; font-size: 0.95rem;">
              ▶ Play Now
            </button>
          </div>
        </div>
      `;

      // Modal favorite button handler
      const favBtn = document.getElementById('modalFavBtn');
      if (favBtn) {
        favBtn.addEventListener('click', async () => {
          const isNowFav = window.InfinityPlay.API
            ? await window.InfinityPlay.API.toggleFavorite(game.id)
            : window.InfinityPlay.Storage.toggleFavorite(game.id);
          favBtn.querySelector('span:first-child').style.color = isNowFav ? 'var(--color-pink)' : 'inherit';
          favBtn.querySelector('span:first-child').textContent = isNowFav ? '❤' : '♡';
          favBtn.querySelector('span:last-child').textContent = isNowFav ? 'Saved to My Games' : 'Save to My Games';
          window.InfinityPlay.GameCard.renderTopGames();
        });
      }

      // Modal start playing handler
      const startBtn = document.getElementById('modalStartPlayBtn');
      if (startBtn) {
        startBtn.addEventListener('click', () => {
          if (game.gameUrl && game.playMode === 'embed') {
            this.launchEmbeddedGame(game);
            return;
          }

          if (game.gameUrl) {
            startBtn.innerHTML = `⚡ Launching ${game.name}...`;
            startBtn.disabled = true;
            setTimeout(() => {
              window.location.href = game.gameUrl;
            }, 250);
            return;
          }

          startBtn.innerHTML = '⏳ Loading Game...';
          startBtn.disabled = true;
          setTimeout(() => {
            window.InfinityPlay.Helpers.showToast(`Now playing ${game.name}! Have fun!`, 'success');
            this.closeAllModals();
          }, 900);
        });
      }

      modal.classList.add('active');
    },

    /**
     * Launches an embedded game (iframe) in fullscreen overlay
     */
    launchEmbeddedGame(game) {
      this.closeAllModals();

      let overlay = document.getElementById('infinityGameFrameOverlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'infinityGameFrameOverlay';
        overlay.className = 'game-frame-overlay';
        overlay.innerHTML = `
          <div class="game-frame-header">
            <div class="game-frame-title">
              <span class="game-frame-icon">🎮</span>
              <span>${game.name}</span>
            </div>
            <div class="game-frame-controls">
              <button class="game-frame-btn game-frame-exit" id="gameFrameExitBtn" title="Exit to Dashboard">✕</button>
            </div>
          </div>
          <div class="game-frame-wrapper">
            <iframe class="game-frame" id="gameFrameIframe" frameborder="0" allow="autoplay; fullscreen"></iframe>
          </div>
        `;
        document.body.appendChild(overlay);
      }

      const iframe = document.getElementById('gameFrameIframe');
      if (iframe) {
        iframe.src = game.gameUrl;
      }

      const titleEl = overlay.querySelector('.game-frame-title span:last-child');
      if (titleEl) titleEl.textContent = game.name;

      const exitBtn = document.getElementById('gameFrameExitBtn');
      if (exitBtn) {
        const existing = exitBtn._handler;
        if (existing) exitBtn.removeEventListener('click', existing);
        const handler = () => {
          iframe.src = '';
          overlay.classList.remove('active');
          setTimeout(() => {
            overlay.style.display = 'none';
          }, 300);
          window.InfinityPlay.Helpers.showToast(`${game.name} closed. Back to dashboard.`, 'info');
        };
        exitBtn._handler = handler;
        exitBtn.addEventListener('click', handler);
      }

      overlay.style.display = 'flex';
      setTimeout(() => overlay.classList.add('active'), 10);

      if (window.InfinityPlay.API) {
        window.InfinityPlay.API.addRecentlyPlayed(game.id);
      } else {
        window.InfinityPlay.Storage.addRecentlyPlayed(game.id);
      }
    },

    /**
     * Opens Auth Modal (Sign In / Sign Up)
     */
    openAuthModal(mode = 'signin') {
      const modal = document.getElementById('authModal');
      if (!modal) return;

      const titleEl = document.getElementById('authModalTitle');
      const submitBtn = document.getElementById('authSubmitBtn');
      const switchText = document.getElementById('authSwitchText');
      const usernameGroup = document.getElementById('authUsernameGroup');

      if (mode === 'signup') {
        if (titleEl) titleEl.textContent = 'Create InfinityPlay Account';
        if (submitBtn) submitBtn.textContent = 'Create Account';
        if (usernameGroup) usernameGroup.style.display = 'flex';
        if (switchText) switchText.innerHTML = 'Already have an account? <a href="#" id="authSwitchLink" style="color: var(--color-cyan); font-weight: 600;">Sign In</a>';
      } else {
        if (titleEl) titleEl.textContent = 'Sign In to InfinityPlay';
        if (submitBtn) submitBtn.textContent = 'Sign In';
        if (usernameGroup) usernameGroup.style.display = 'none';
        if (switchText) switchText.innerHTML = 'New to InfinityPlay? <a href="#" id="authSwitchLink" style="color: var(--color-cyan); font-weight: 600;">Create Account</a>';
      }

      const switchLink = document.getElementById('authSwitchLink');
      if (switchLink) {
        switchLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.openAuthModal(mode === 'signin' ? 'signup' : 'signin');
        });
      }

      modal.classList.add('active');
    },

    fillDemoLogin(email, password) {
      const emailInput = document.getElementById('authEmailInput');
      const passInput = document.getElementById('authPasswordInput');
      if (emailInput) emailInput.value = email;
      if (passInput) passInput.value = password;
      window.InfinityPlay.Helpers.showToast(`Selected demo credentials for ${email}`, 'info');
    },

    async handleAuthSubmit(e) {
      if (e) e.preventDefault();
      const email = document.getElementById('authEmailInput')?.value;
      const password = document.getElementById('authPasswordInput')?.value;
      const username = document.getElementById('authUsernameInput')?.value;
      const submitBtn = document.getElementById('authSubmitBtn');

      if (submitBtn) {
        submitBtn.innerHTML = '⏳ Authenticating...';
        submitBtn.disabled = true;
      }

      try {
        let result;
        if (this.currentAuthMode === 'signup') {
          result = window.InfinityPlay.API 
            ? await window.InfinityPlay.API.register(username, email, password)
            : { success: true, user: { name: username || 'Gamer', email, level: 1, title: 'Rookie Gamer', xp: 100 } };
        } else {
          result = window.InfinityPlay.API 
            ? await window.InfinityPlay.API.login(email, password)
            : { success: true, user: { name: 'Tharun', email, level: 28, title: 'Pro Gamer', xp: 42800 } };
        }

        if (result.success && result.user) {
          this.updateUserUI(result.user);
          localStorage.setItem('infinityplay_current_user', JSON.stringify(result.user));
          window.InfinityPlay.Helpers.showToast(`Welcome back, ${result.user.name}! (Level ${result.user.level})`, 'success');
          this.closeAllModals();
        } else {
          window.InfinityPlay.Helpers.showToast(result.error || 'Authentication failed', 'warning');
        }
      } catch (err) {
        window.InfinityPlay.Helpers.showToast('Login error. Please try again.', 'warning');
      } finally {
        if (submitBtn) {
          submitBtn.innerHTML = this.currentAuthMode === 'signup' ? 'Create Account' : 'Sign In';
          submitBtn.disabled = false;
        }
      }
    },

    updateUserUI(user) {
      if (!user) return;
      // Header Avatar & Name
      const avatarCircle = document.querySelector('.avatar-circle');
      if (avatarCircle) {
        if (user.avatar && user.avatar.length > 2) {
          avatarCircle.innerHTML = `<img src="${user.avatar}" alt="${user.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        } else {
          avatarCircle.textContent = (user.name || 'T').charAt(0).toUpperCase();
        }
      }

      const profileName = document.querySelector('.profile-name');
      if (profileName) {
        profileName.textContent = user.name;
      }

      // Dropdown details
      const dropdownHeader = document.querySelector('#profileDropdown strong');
      if (dropdownHeader) {
        dropdownHeader.textContent = user.name;
      }
      const dropdownSub = document.querySelector('#profileDropdown span');
      if (dropdownSub) {
        dropdownSub.textContent = `Level ${user.level || 1} • ${user.title || 'Gamer'}`;
      }
    },

    // Audio SFX Synthesizer using Web Audio API
    playSound(type = 'click') {
      try {
        const settings = this.currentSettings || { soundEffects: true };
        if (!settings.soundEffects) return;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!this.audioCtx) this.audioCtx = new AudioContext();
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        const now = this.audioCtx.currentTime;

        if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
        } else if (type === 'switch') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(550, now);
          osc.frequency.setValueAtTime(880, now + 0.04);
          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === 'success') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
          osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
          osc.start(now);
          osc.stop(now + 0.28);
        }
      } catch (e) {
        // AudioContext ignored if blocked
      }
    },

    loadCurrentUser() {
      try {
        const saved = localStorage.getItem('infinityplay_current_user');
        if (saved) {
          const user = JSON.parse(saved);
          this.updateUserUI(user);
        }
      } catch (e) {
        // use default
      }
    },

    /**
     * Profile Modal & Editor
     */
    async openProfileModal(e) {
      if (e) e.preventDefault();
      this.closeDropdown();
      this.playSound('click');

      const modal = document.getElementById('profileModal');
      if (!modal) return;

      let currentUser;
      try {
        const saved = localStorage.getItem('infinityplay_current_user');
        currentUser = saved ? JSON.parse(saved) : {
          name: 'Tharun',
          email: 'tharun@infinityplay.io',
          level: 28,
          title: 'Pro Gamer',
          xp: 42800,
          avatar: 'T',
          bio: 'Always in the fast lane ⚡🏎'
        };
      } catch (err) {
        currentUser = { name: 'Tharun', email: 'tharun@infinityplay.io', level: 28, title: 'Pro Gamer', xp: 42800, avatar: 'T' };
      }

      // Populate UI
      const nameEl = document.getElementById('profileModalName');
      const emailEl = document.getElementById('profileModalEmail');
      const levelBadge = document.getElementById('profileModalLevelBadge');
      const rankBadge = document.getElementById('profileModalRankBadge');
      const avatarContainer = document.getElementById('profileModalAvatar');
      const inputName = document.getElementById('profileInputName');
      const inputBio = document.getElementById('profileInputBio');
      const xpText = document.getElementById('profileModalXpText');
      const xpFill = document.getElementById('profileModalXpFill');

      if (nameEl) nameEl.innerHTML = `${currentUser.name} <span style="font-size: 0.95rem; color: var(--color-cyan);">⚡</span>`;
      if (emailEl) emailEl.textContent = currentUser.email || 'tharun@infinityplay.io';
      if (levelBadge) levelBadge.textContent = `Level ${currentUser.level || 28} • ${currentUser.title || 'Pro Gamer'}`;
      if (rankBadge) rankBadge.textContent = '#3 Global';
      if (inputName) inputName.value = currentUser.name || 'Tharun';
      if (inputBio) inputBio.value = currentUser.bio || 'Always in the fast lane ⚡🏎';

      const xp = currentUser.xp || 42800;
      const nextXp = 50000;
      const pct = Math.min(100, Math.round((xp / nextXp) * 100));
      if (xpText) xpText.textContent = `${xp.toLocaleString()} / ${nextXp.toLocaleString()} XP (${pct}%)`;
      if (xpFill) xpFill.style.width = `${pct}%`;

      this.renderAvatarPreview(avatarContainer, currentUser.avatar, currentUser.name);
      this.setSelectedAvatar(currentUser.avatar || 'T');

      modal.classList.add('active');
    },

    renderAvatarPreview(container, avatar, name) {
      if (!container) return;
      if (avatar && (avatar.startsWith('assets/') || avatar.startsWith('http'))) {
        container.innerHTML = `<img src="${avatar}" alt="${name || 'Avatar'}" style="width:100%;height:100%;object-fit:cover;">`;
      } else {
        container.textContent = (name || 'T').charAt(0).toUpperCase();
      }
    },

    setSelectedAvatar(avatarVal) {
      this.selectedAvatar = avatarVal;
      document.querySelectorAll('#avatarSelector .avatar-choice').forEach(choice => {
        const choiceVal = choice.getAttribute('data-avatar');
        if (choiceVal === avatarVal) {
          choice.classList.add('active');
        } else {
          choice.classList.remove('active');
        }
      });
    },

    bindAvatarPicker() {
      const choices = document.querySelectorAll('#avatarSelector .avatar-choice');
      choices.forEach(choice => {
        choice.addEventListener('click', () => {
          this.playSound('click');
          const avatarVal = choice.getAttribute('data-avatar');
          this.setSelectedAvatar(avatarVal);
          const avatarContainer = document.getElementById('profileModalAvatar');
          const nameInput = document.getElementById('profileInputName');
          this.renderAvatarPreview(avatarContainer, avatarVal, nameInput ? nameInput.value : 'T');
        });
      });
    },

    async handleProfileSave(e) {
      if (e) e.preventDefault();
      const name = document.getElementById('profileInputName')?.value || 'Tharun';
      const bio = document.getElementById('profileInputBio')?.value || '';
      const avatar = this.selectedAvatar || 'T';

      const saved = localStorage.getItem('infinityplay_current_user');
      const currentUser = saved ? JSON.parse(saved) : { email: 'tharun@infinityplay.io', level: 28, title: 'Pro Gamer', xp: 42800 };

      const updatedUser = {
        ...currentUser,
        name,
        bio,
        avatar
      };

      const saveBtn = document.getElementById('profileSaveBtn');
      if (saveBtn) {
        saveBtn.innerHTML = '⏳ Saving...';
        saveBtn.disabled = true;
      }

      try {
        if (window.InfinityPlay.API) {
          await window.InfinityPlay.API.updateProfile(updatedUser);
        } else {
          localStorage.setItem('infinityplay_current_user', JSON.stringify(updatedUser));
        }

        this.updateUserUI(updatedUser);
        this.playSound('success');
        window.InfinityPlay.Helpers.showToast(`Profile updated: ${updatedUser.name}!`, 'success');
        this.closeAllModals();
      } catch (err) {
        window.InfinityPlay.Helpers.showToast('Failed to save profile changes.', 'warning');
      } finally {
        if (saveBtn) {
          saveBtn.innerHTML = 'Save Changes';
          saveBtn.disabled = false;
        }
      }
    },

    /**
     * Achievements Modal & Filtering
     */
    async openAchievementsModal(e) {
      if (e) e.preventDefault();
      this.closeDropdown();
      this.playSound('click');

      const modal = document.getElementById('achievementsModal');
      if (!modal) return;

      let list = [];
      if (window.InfinityPlay.API) {
        list = await window.InfinityPlay.API.getAchievements();
      } else {
        list = window.InfinityPlay.achievementsData || [];
      }
      this.allAchievements = list;

      const unlockedCount = list.filter(a => a.unlocked).length;
      const totalCount = list.length;
      const totalXp = list.filter(a => a.unlocked).reduce((acc, a) => acc + (a.xp || 0), 0);

      const unlockedEl = document.getElementById('achieveUnlockedCount');
      const totalEl = document.getElementById('achieveTotalCount');
      const xpEl = document.getElementById('achieveTotalXp');

      if (unlockedEl) unlockedEl.textContent = unlockedCount;
      if (totalEl) totalEl.textContent = totalCount;
      if (xpEl) xpEl.textContent = `${totalXp.toLocaleString()} XP`;

      this.currentAchieveFilter = 'all';
      this.renderAchievementsList('all');

      modal.classList.add('active');
    },

    filterAchievements(filterType, e) {
      if (e) e.preventDefault();
      this.playSound('click');
      this.currentAchieveFilter = filterType;

      document.querySelectorAll('.achieve-tab-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === filterType) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      this.renderAchievementsList(filterType);
    },

    renderAchievementsList(filterType = 'all') {
      const container = document.getElementById('achievementsListContainer');
      if (!container) return;

      let list = this.allAchievements || window.InfinityPlay.achievementsData || [];
      if (filterType === 'unlocked') {
        list = list.filter(a => a.unlocked);
      } else if (filterType === 'locked') {
        list = list.filter(a => !a.unlocked);
      }

      if (list.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
            <div style="font-size: 2.5rem; margin-bottom: 8px;">🎯</div>
            <p>No achievements found in this category.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = list.map(a => {
        const pct = Math.min(100, Math.round(((a.progress || 0) / (a.maxProgress || 1)) * 100));
        return `
          <div class="achievement-card ${a.unlocked ? 'unlocked' : 'locked'}">
            <div class="achievement-icon-box">
              <span>${a.icon}</span>
            </div>
            <div class="achievement-info">
              <div class="achievement-header-row">
                <span class="achievement-title">${a.title}</span>
                <span class="achievement-reward">+${a.xp} XP</span>
              </div>
              <div class="achievement-desc">${a.description}</div>
              <div class="achievement-progress-wrap">
                <div class="achievement-progress-bar">
                  <div class="achievement-progress-fill" style="width: ${pct}%;"></div>
                </div>
                <span class="achievement-progress-text">
                  ${a.unlocked ? '✓ Unlocked' : (a.progressText || `${a.progress}/${a.maxProgress}`)}
                </span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    },

    /**
     * Platform Settings Modal
     */
    async openSettingsModal(e) {
      if (e) e.preventDefault();
      this.closeDropdown();
      this.playSound('click');

      const modal = document.getElementById('settingsModal');
      if (!modal) return;

      let settings;
      if (window.InfinityPlay.API) {
        settings = await window.InfinityPlay.API.getSettings();
      } else {
        const local = localStorage.getItem('infinityplay_settings');
        settings = local ? JSON.parse(local) : {
          soundEffects: true,
          ambientMusic: false,
          neonGlow: true,
          accentColor: 'purple',
          performanceMode: false,
          notifications: true
        };
      }
      this.currentSettings = settings;

      // Update toggles
      this.updateSettingToggleUI('settingToggleSfx', settings.soundEffects);
      this.updateSettingToggleUI('settingToggleMusic', settings.ambientMusic);
      this.updateSettingToggleUI('settingToggleGlow', settings.neonGlow);
      this.updateSettingToggleUI('settingTogglePerf', settings.performanceMode);
      this.updateSettingToggleUI('settingToggleNotif', settings.notifications);

      // Update accent dot active state
      document.querySelectorAll('.accent-picker-row .accent-dot').forEach(dot => {
        if (dot.getAttribute('data-color') === settings.accentColor) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      modal.classList.add('active');
    },

    updateSettingToggleUI(id, isActive) {
      const toggle = document.getElementById(id);
      if (!toggle) return;
      if (isActive) {
        toggle.classList.add('active');
      } else {
        toggle.classList.remove('active');
      }
    },

    toggleSetting(key) {
      this.playSound('switch');
      if (!this.currentSettings) {
        this.loadSettings();
      }
      this.currentSettings[key] = !this.currentSettings[key];

      const toggleMap = {
        soundEffects: 'settingToggleSfx',
        ambientMusic: 'settingToggleMusic',
        neonGlow: 'settingToggleGlow',
        performanceMode: 'settingTogglePerf',
        notifications: 'settingToggleNotif'
      };

      if (toggleMap[key]) {
        this.updateSettingToggleUI(toggleMap[key], this.currentSettings[key]);
      }

      this.applySettingEffect(key, this.currentSettings[key]);

      if (window.InfinityPlay.API) {
        window.InfinityPlay.API.saveSettings(this.currentSettings);
      } else {
        localStorage.setItem('infinityplay_settings', JSON.stringify(this.currentSettings));
      }

      window.InfinityPlay.Helpers.showToast(`${this.getSettingLabel(key)}: ${this.currentSettings[key] ? 'Enabled' : 'Disabled'}`, 'info');
    },

    getSettingLabel(key) {
      const labels = {
        soundEffects: 'Sound Effects (SFX)',
        ambientMusic: 'Ambient Music',
        neonGlow: 'Neon Glow & Bloom',
        performanceMode: '60 FPS Performance Mode',
        notifications: 'Platform Notifications'
      };
      return labels[key] || key;
    },

    applySettingEffect(key, val) {
      if (key === 'neonGlow') {
        if (val) {
          document.documentElement.style.setProperty('--glow-purple', '0 0 25px rgba(139, 92, 246, 0.45)');
          document.documentElement.style.setProperty('--glow-cyan', '0 0 25px rgba(0, 240, 255, 0.45)');
        } else {
          document.documentElement.style.setProperty('--glow-purple', 'none');
          document.documentElement.style.setProperty('--glow-cyan', 'none');
        }
      }
    },

    setAccentTheme(color) {
      this.playSound('click');
      if (!this.currentSettings) this.loadSettings();
      this.currentSettings.accentColor = color;

      document.querySelectorAll('.accent-picker-row .accent-dot').forEach(dot => {
        if (dot.getAttribute('data-color') === color) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      this.applyAccentPalette(color);

      if (window.InfinityPlay.API) {
        window.InfinityPlay.API.saveSettings(this.currentSettings);
      } else {
        localStorage.setItem('infinityplay_settings', JSON.stringify(this.currentSettings));
      }

      window.InfinityPlay.Helpers.showToast(`Accent theme updated to ${color.toUpperCase()}!`, 'success');
    },

    applyAccentPalette(color) {
      const root = document.documentElement;
      const themes = {
        purple: {
          borderActive: 'rgba(139, 92, 246, 0.45)',
          glowPurple: '0 0 25px rgba(139, 92, 246, 0.45)',
          brand: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
        },
        cyan: {
          borderActive: 'rgba(0, 240, 255, 0.45)',
          glowPurple: '0 0 25px rgba(0, 240, 255, 0.45)',
          brand: 'linear-gradient(135deg, #0070f3 0%, #00f0ff 100%)'
        },
        pink: {
          borderActive: 'rgba(236, 72, 153, 0.45)',
          glowPurple: '0 0 25px rgba(236, 72, 153, 0.45)',
          brand: 'linear-gradient(135deg, #be185d 0%, #ec4899 100%)'
        },
        blue: {
          borderActive: 'rgba(59, 130, 246, 0.45)',
          glowPurple: '0 0 25px rgba(59, 130, 246, 0.45)',
          brand: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)'
        },
        gold: {
          borderActive: 'rgba(251, 191, 36, 0.45)',
          glowPurple: '0 0 25px rgba(251, 191, 36, 0.45)',
          brand: 'linear-gradient(135deg, #b45309 0%, #fbbf24 100%)'
        }
      };

      const theme = themes[color] || themes.purple;
      root.style.setProperty('--border-active', theme.borderActive);
      root.style.setProperty('--gradient-brand', theme.brand);
      if (this.currentSettings && this.currentSettings.neonGlow) {
        root.style.setProperty('--glow-purple', theme.glowPurple);
      }
    },

    loadSettings() {
      try {
        const local = localStorage.getItem('infinityplay_settings');
        this.currentSettings = local ? JSON.parse(local) : {
          soundEffects: true,
          ambientMusic: false,
          neonGlow: true,
          accentColor: 'purple',
          performanceMode: false,
          notifications: true
        };
        this.applyAccentPalette(this.currentSettings.accentColor || 'purple');
        this.applySettingEffect('neonGlow', this.currentSettings.neonGlow !== false);
      } catch (e) {
        this.currentSettings = {
          soundEffects: true,
          ambientMusic: false,
          neonGlow: true,
          accentColor: 'purple',
          performanceMode: false,
          notifications: true
        };
      }
    },

    clearRecentCache() {
      this.playSound('click');
      localStorage.removeItem('infinityplay_recent_games');
      const listEl = document.getElementById('recentGamesList');
      if (listEl) {
        listEl.innerHTML = `
          <div style="text-align:center;padding:24px;color:var(--text-muted);font-size:0.82rem;">
            No recently played games.
          </div>
        `;
      }
      window.InfinityPlay.Helpers.showToast('Recently played history cleared!', 'info');
    },

    resetAllSettings() {
      this.playSound('click');
      this.currentSettings = {
        soundEffects: true,
        ambientMusic: false,
        neonGlow: true,
        accentColor: 'purple',
        performanceMode: false,
        notifications: true
      };
      localStorage.setItem('infinityplay_settings', JSON.stringify(this.currentSettings));
      this.applyAccentPalette('purple');
      this.applySettingEffect('neonGlow', true);
      this.openSettingsModal();
      window.InfinityPlay.Helpers.showToast('All settings reset to default values!', 'success');
    },

    closeDropdown() {
      const menu = document.getElementById('profileDropdown');
      if (menu) menu.classList.remove('active');
    },

    logout(e) {
      if (e) e.preventDefault();
      localStorage.removeItem('infinityplay_current_user');
      const guestUser = { name: 'Tharun', level: 28, title: 'Pro Gamer', xp: 42800, avatar: 'T' };
      this.updateUserUI(guestUser);
      this.playSound('click');
      window.InfinityPlay.Helpers.showToast('Signed out successfully', 'info');
      this.closeDropdown();
    }
  };

  window.InfinityPlay = window.InfinityPlay || {};
  window.InfinityPlay.App = App;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }
})();
