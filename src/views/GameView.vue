<template>
  <main class="game-view">
    <!-- Loading -->
    <div v-if="store.loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Summoning servant data...</p>
      <p class="loading-sub">Connecting to Chaldea database</p>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Connection Failed</h3>
      <p>{{ store.error }}</p>
      <button class="btn-retry" @click="store.fetchServants()">Retry</button>
    </div>

    <!-- Game -->
    <template v-else>
      <!-- Hero section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="hero-grail">🔍</span>
            FGO<span class="accent">dle</span>
          </h1>
          <p class="hero-subtitle">Guess today's Fate/Grand Order servant</p>

          <div class="mode-toggle">
            <button
              class="mode-btn"
              :class="{ active: store.gameMode === 'daily' }"
              @click="store.startNewGame('daily')"
            >
              Daily
            </button>
            <button
              class="mode-btn"
              :class="{ active: store.gameMode === 'unlimited' }"
              @click="store.startNewGame('unlimited')"
            >
              Unlimited
            </button>
          </div>

          <div class="hero-progress">
            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: progressPct + '%' }"
                :class="store.gameOver ? (store.won ? 'fill-win' : 'fill-lose') : ''"
              ></div>
            </div>
            <span class="progress-label">
              {{ store.guesses.length }} / {{ store.maxGuesses }}
              {{ store.gameOver ? (store.won ? '— Victory!' : '— Game Over') : 'guesses' }}
            </span>
          </div>
        </div>
      </section>

      <!-- Search -->
      <section class="search-section">
        <SearchBar />
        <p class="search-hint" v-if="!store.gameOver">
          💡 Type a servant name to start guessing
        </p>
      </section>

      <!-- Clue Legend -->
      <section class="legend">
        <div class="legend-item">
          <span class="legend-dot dot-correct"></span>
          <span>Correct</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot dot-partial"></span>
          <span>Close (±1 rarity)</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot dot-wrong"></span>
          <span>Wrong</span>
        </div>
      </section>

      <!-- Guess Grid -->
      <section class="grid-section">
        <GuessGrid />
      </section>
    </template>

    <!-- Result Modal -->
    <ResultModal />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useServantStore } from '../stores/servantStore'
import SearchBar from '../components/SearchBar.vue'
import GuessGrid from '../components/GuessGrid.vue'
import ResultModal from '../components/ResultModal.vue'

const store = useServantStore()

onMounted(() => {
  store.fetchServants()
})

const progressPct = computed(() => {
  return (store.guesses.length / store.maxGuesses) * 100
})
</script>

<style scoped>
.game-view {
  flex: 1;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem 1.25rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Loading */
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 6rem 0;
}

.loading-spinner {
  width: 56px;
  height: 56px;
  border: 3px solid var(--border);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.loading-text {
  font-family: var(--font-title);
  font-size: 1.1rem;
  color: var(--gold);
}

.loading-sub {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Error */
.error-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 0;
  text-align: center;
}

.error-icon { font-size: 3rem; }

.error-state h3 {
  font-family: var(--font-title);
  color: var(--text-primary);
  font-size: 1.4rem;
}

.error-state p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.btn-retry {
  margin-top: 0.5rem;
  padding: 10px 24px;
  background: var(--gold);
  color: #1a1000;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-title);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.2s ease;
}

.btn-retry:hover {
  background: var(--gold-light);
  box-shadow: var(--shadow-gold);
}

/* Hero */
.hero {
  text-align: center;
  padding: 1rem 0 0;
}

.hero-title {
  font-family: var(--font-title);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 900;
  letter-spacing: 4px;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 40px rgba(201, 168, 76, 0.2);
}

.hero-grail {
  color: var(--gold);
  margin-right: 0.2em;
  filter: drop-shadow(0 0 12px var(--gold-glow));
}

.accent { color: var(--gold); }

.hero-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

/* Mode toggle */
.mode-toggle {
  display: inline-flex;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 4px;
  margin-bottom: 1.5rem;
}

.mode-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 6px 16px;
  font-family: var(--font-title);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
}

.mode-btn:hover {
  color: var(--text-primary);
}

.mode-btn.active {
  background: var(--gold);
  color: #1a1000;
  box-shadow: var(--shadow-gold);
}

/* Progress */
.hero-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 320px;
  margin: 0 auto;
}

.progress-track {
  width: 100%;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
  border-radius: 2px;
  transition: width 0.5s ease;
}

.fill-win { background: linear-gradient(90deg, #2e7d32, #66bb6a); }
.fill-lose { background: linear-gradient(90deg, #7f0000, #b71c1c); }

.progress-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 1px;
}

/* Search section */
.search-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.search-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Legend */
.legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  border: 1px solid transparent;
}

.dot-correct { background: var(--correct-bg); border-color: var(--correct-border); }
.dot-partial { background: var(--partial-bg); border-color: var(--partial-border); }
.dot-wrong   { background: var(--wrong); border-color: var(--wrong-border); }

/* Grid section */
.grid-section {
  width: 100%;
}
</style>
