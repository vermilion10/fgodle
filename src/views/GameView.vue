<template>
  <main class="game-view">
    <!-- Loading -->
    <div v-if="store.loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Summoning servant data…</p>
      <p class="loading-sub">Connecting to Chaldea database</p>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="error-state">
      <div class="error-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
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
            FGO<span class="accent">dle</span>
          </h1>
          <p class="hero-subtitle">Guess today's Fate/Grand Order servant</p>

          <!-- Mode toggle - M3 Segmented Button -->
          <div class="mode-toggle" role="group" aria-label="Game mode">
            <button
              class="mode-btn"
              :class="{ active: store.gameMode === 'daily' }"
              @click="store.startNewGame('daily')"
            >
              <span class="mode-icon"><i class="fa-solid fa-calendar-day"></i></span> Daily
            </button>
            <button
              class="mode-btn"
              :class="{ active: store.gameMode === 'unlimited' }"
              @click="store.startNewGame('unlimited')"
            >
              <span class="mode-icon"><i class="fa-solid fa-infinity"></i></span> Unlimited
            </button>
          </div>

          <!-- Difficulty selector (Unlimited only) -->
          <Transition name="fade-slide">
            <div v-if="store.gameMode === 'unlimited'" class="difficulty-row">
              <button
                class="diff-chip"
                :class="{ active: store.difficulty === 'easy', 'diff-easy': store.difficulty === 'easy' }"
                @click="store.setDifficulty('easy')"
              >Easy · 12</button>
              <button
                class="diff-chip"
                :class="{ active: store.difficulty === 'normal', 'diff-normal': store.difficulty === 'normal' }"
                @click="store.setDifficulty('normal')"
              >Normal · 8</button>
              <button
                class="diff-chip"
                :class="{ active: store.difficulty === 'hard', 'diff-hard': store.difficulty === 'hard' }"
                @click="store.setDifficulty('hard')"
              >Hard · 5</button>
            </div>
          </Transition>

          <!-- Progress -->
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
              <template v-if="store.gameOver">
                &mdash; {{ store.won ? 'Victory!' : 'Game Over' }}
              </template>
              <template v-else>guesses</template>
            </span>
          </div>
        </div>
      </section>

      <!-- Search -->
      <section class="search-section">
        <SearchBar />
        <p class="search-hint" v-if="!store.gameOver">Type a servant name to guess</p>
      </section>

      <!-- Clue Legend -->
      <section class="legend">
        <div class="legend-item">
          <span class="legend-pip pip-correct"></span>
          <span>Correct</span>
        </div>
        <div class="legend-item">
          <span class="legend-pip pip-partial"></span>
          <span>Close (±1 rarity)</span>
        </div>
        <div class="legend-item">
          <span class="legend-pip pip-wrong"></span>
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
  padding: 1.75rem 1.25rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Loading */
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 6rem 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 2.5px solid var(--border-medium);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.loading-text {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
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
  gap: 0.75rem;
  padding: 4rem 0;
  text-align: center;
}

.error-icon { font-size: 2.5rem; color: var(--text-muted); }

.error-state h3 {
  font-size: 1.2rem;
  color: var(--text-primary);
  font-weight: 600;
}

.error-state p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.btn-retry {
  margin-top: 0.5rem;
  padding: 9px 22px;
  background: var(--primary);
  color: var(--on-primary);
  border: none;
  border-radius: var(--radius-xl);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-retry:hover { opacity: 0.88; }

/* Hero */
.hero {
  text-align: center;
  padding-top: 0.5rem;
}

.hero-title {
  font-family: var(--font-title);
  font-size: clamp(2.2rem, 7vw, 3.5rem);
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.4rem;
  letter-spacing: 2px;
}

.accent { color: var(--primary); }

.hero-subtitle {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

/* Mode toggle - M3 Segmented Button */
.mode-toggle {
  display: inline-flex;
  background: var(--surface-1);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-xl);
  padding: 3px;
  margin-bottom: 1rem;
  gap: 2px;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 7px 18px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.mode-icon {
  font-size: 0.9em;
}

.mode-btn:hover {
  color: var(--text-primary);
  background: var(--border-subtle);
}

.mode-btn.active {
  background: var(--primary-bg);
  color: var(--primary);
}

/* Difficulty - M3 Filter Chips */
.difficulty-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.diff-chip {
  padding: 6px 14px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-medium);
  background: transparent;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.diff-chip:hover { border-color: var(--border-medium); color: var(--text-secondary); background: var(--border-subtle); }

.diff-chip.diff-easy.active   { background: rgba(74,143,86,.14); color: var(--correct-text); border-color: var(--correct-border); }
.diff-chip.diff-normal.active { background: rgba(160,113,42,.14); color: var(--partial-text); border-color: var(--partial-border); }
.diff-chip.diff-hard.active   { background: rgba(155,54,54,.14); color: #e09090; border-color: #9b5050; }

/* Fade-slide transition */
.fade-slide-enter-active { transition: all 0.25s ease; }
.fade-slide-leave-active { transition: all 0.18s ease; }
.fade-slide-enter-from   { opacity: 0; transform: translateY(-6px); }
.fade-slide-leave-to     { opacity: 0; transform: translateY(-6px); }

/* Progress */
.hero-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: 300px;
  margin: 0 auto;
}

.progress-track {
  width: 100%;
  height: 3px;
  background: var(--border-medium);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.fill-win  { background: var(--correct-border); }
.fill-lose { background: #7a3030; }

.progress-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Search section */
.search-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.search-hint {
  font-size: 0.78rem;
  color: var(--text-muted);
}

/* Legend */
.legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.legend-pip {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-xs);
}

.pip-correct { background: var(--correct-border); opacity: 0.75; }
.pip-partial { background: var(--partial-border); opacity: 0.75; }
.pip-wrong   { background: var(--wrong-border); }

/* Grid section */
.grid-section { width: 100%; }
</style>
