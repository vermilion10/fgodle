<template>
  <Transition name="modal-fade">
    <div v-if="store.showAbout" class="modal-overlay" @click.self="store.showAbout = false">
      <div class="modal-card">

        <div class="modal-header">
          <h2 class="modal-title">FGO<span class="accent">dle</span></h2>
          <button class="close-btn" @click="store.showAbout = false" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <p class="intro-text">
            A Wordle-like guessing game for Fate/Grand Order servants. Test your knowledge by guessing today's servant or playing endlessly in Unlimited mode.
          </p>

          <section class="rule-section">
            <h3 class="section-label">Features</h3>
            <ul class="feature-list">
              <li><strong>Daily Mode</strong> - A new servant every day. Progress and streak saved locally.</li>
              <li><strong>Unlimited Mode</strong> - Random servants with Easy, Normal, or Hard difficulty.</li>
              <li><strong>Hint Rows</strong> <em>(Daily only)</em> - Rows 5 and 8 let you peek at the answer's attributes before guessing.</li>
              <li><strong>Reveal Animation</strong> - Card-flip reveal column by column, just like classic Wordle.</li>
              <li><strong>Detailed Clues</strong> - Rarity, Class, NP Card, NP Type, Attribute, Alignment, and Gender.</li>
              <li><strong>Share Your Result</strong> - Generate a shareable image with a QR code linking back to FGOdle.</li>
              <li><strong>Battle Records</strong> - Track your win rate, current streak, best streak, and guess distribution history. Open from the chart icon in the navbar.</li>
              <li><strong>Class Filter Chips</strong> - Quickly narrow your search by servant class - Saber, Archer, Lancer, and more.</li>
              <li><strong>Yesterday's Servant</strong> - Missed a day? Check what servant was featured yesterday inside Battle Records.</li>
              <li><strong>Light / Dark Mode</strong> - Switch between dark and warm light themes using the moon/sun icon in the navbar.</li>
              <li><strong>Always Up to Date</strong> - Servant data synced automatically from both JP and NA servers via GitHub Actions and Atlas Academy API.</li>
              <li><strong>Servant Archive</strong> - Browse the complete database of servants.</li>
              <li><strong>JP / NA Server Toggle</strong> - Instantly switch between the JP and NA server rosters.</li>
              <li><strong>Smart Search</strong> - Look up servants by name or alias without worrying about accents or diacritics.</li>
              <li><strong>Mobile Responsive</strong> - Fully scrollable grid and a mobile-optimized menu on any screen size.</li>
            </ul>
          </section>

          <section class="rule-section">
            <h3 class="section-label">Built with</h3>
            <div class="tech-tags">
              <span class="tech-tag">Vue 3</span>
              <span class="tech-tag">TypeScript</span>
              <span class="tech-tag">Vite</span>
              <span class="tech-tag">Pinia</span>
              <span class="tech-tag">GitHub Actions</span>
            </div>
          </section>

          <section class="rule-section">
            <h3 class="section-label">Credits</h3>
            <ul class="credit-list">
              <li><strong>Data Source</strong> - <a href="https://api.atlasacademy.io/" target="_blank" rel="noopener">Atlas Academy API</a></li>
              <li><strong>Game Concept</strong> - Inspired by the original Wordle and various fandom iterations</li>
              <li><strong>Animations</strong> - GIFs via <a href="https://tenor.com/" target="_blank" rel="noopener">Tenor</a></li>
              <li><strong>Developer</strong> - <a href="https://vermilion10.pages.dev/" target="_blank" rel="noopener">vermilion10</a></li>
            </ul>
          </section>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useServantStore } from '../stores/servantStore'
const store = useServantStore()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 250;
  padding: 1rem;
}

.modal-card {
  background: var(--surface-2);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  max-width: 520px;
  width: 100%;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-3);
  animation: popIn 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.75rem 1rem;
  border-bottom: 1px solid var(--divider);
  flex-shrink: 0;
}

.modal-title {
  font-family: var(--font-title);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}

.accent { color: var(--primary); }

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}
.close-btn:hover { background: var(--surface-3); color: var(--text-primary); }

.modal-body {
  overflow-y: auto;
  padding: 1.25rem 1.75rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.intro-text {
  font-size: 0.925rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.rule-section { }

.section-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
  padding-bottom: 7px;
  border-bottom: 1px solid var(--divider);
}

.feature-list, .credit-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-list li, .credit-list li {
  position: relative;
  padding-left: 14px;
  line-height: 1.55;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.feature-list li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--primary);
  font-weight: 700;
}
.credit-list li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--text-muted);
  font-weight: 700;
}

.feature-list strong, .credit-list strong { color: var(--text-primary); font-weight: 600; }

.credit-list a {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  border-bottom-color: rgba(200, 168, 90, 0.3);
  transition: border-color 0.15s;
}
.credit-list a:hover { border-bottom-color: var(--primary); }

.tech-tags { display: flex; flex-wrap: wrap; gap: 7px; }

.tech-tag {
  background: var(--surface-3);
  color: var(--text-secondary);
  padding: 4px 12px;
  border-radius: var(--radius-xs);
  font-size: 0.8rem;
  font-weight: 500;
}

/* Transition */
.modal-fade-enter-active { animation: popIn 0.3s ease; }
.modal-fade-leave-active { transition: opacity 0.18s ease; }
.modal-fade-leave-to    { opacity: 0; }
</style>
