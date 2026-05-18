<template>
  <Transition name="stats-popup">
    <div v-if="store.showStats" class="stats-overlay" @click.self="store.showStats = false">
      <div class="stats-card">

        <!-- Header -->
        <div class="stats-header">
          <h2 class="stats-title">Battle Records</h2>
          <button class="close-btn" @click="store.showStats = false" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Summary stats -->
        <div class="stat-row">
          <div class="stat-box">
            <span class="stat-num">{{ store.stats.totalGames }}</span>
            <span class="stat-lbl">Games</span>
          </div>
          <div class="stat-box">
            <span class="stat-num">{{ winRate }}%</span>
            <span class="stat-lbl">Win Rate</span>
          </div>
          <div class="stat-box">
            <span class="stat-num">{{ store.stats.currentStreak }}</span>
            <span class="stat-lbl">Streak</span>
          </div>
          <div class="stat-box">
            <span class="stat-num">{{ store.stats.maxStreak }}</span>
            <span class="stat-lbl">Best Streak</span>
          </div>
        </div>

        <!-- Guess distribution -->
        <div class="section">
          <p class="section-label">Guess Distribution</p>
          <div class="dist-chart">
            <div
              v-for="(count, i) in store.stats.guessDist"
              :key="i"
              class="dist-row"
            >
              <span class="dist-idx">{{ i + 1 }}</span>
              <div class="dist-bar-wrap">
                <div
                  class="dist-bar"
                  :class="{ 'dist-bar-filled': count > 0 }"
                  :style="{ width: barWidth(i) }"
                >
                  <span class="dist-count">{{ count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Yesterday's servant -->
        <div class="section">
          <p class="section-label">Yesterday's Servant</p>
          <div v-if="store.yesterdayServant" class="yesterday-card">
            <img
              :src="store.yesterdayServant.face"
              :alt="store.yesterdayServant.name"
              class="yesterday-face"
              @error="(e) => ((e.target as HTMLImageElement).style.opacity = '0.2')"
            />
            <div class="yesterday-info">
              <p class="yesterday-name">{{ store.yesterdayServant.name }}</p>
              <div class="yesterday-tags">
                <span class="y-tag class-tag" :class="'np-' + store.yesterdayServant.npCard">
                  {{ formatClass(store.yesterdayServant.className) }}
                </span>
                <span class="y-tag">{{ '★'.repeat(store.yesterdayServant.rarity) }}</span>
                <span class="y-tag">{{ store.yesterdayServant.attribute }}</span>
              </div>
            </div>
          </div>
          <p v-else class="no-data">No data available</p>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useServantStore } from '../stores/servantStore'

const store = useServantStore()

const winRate = computed(() => {
  if (!store.stats.totalGames) return 0
  return Math.round((store.stats.totalWins / store.stats.totalGames) * 100)
})

function barWidth(i: number): string {
  const max = Math.max(...store.stats.guessDist, 1)
  const pct = (store.stats.guessDist[i] / max) * 100
  return `max(18px, ${pct}%)`
}

function formatClass(cls: string): string {
  const map: Record<string, string> = {
    alterEgo: 'Alter Ego',
    moonCancer: 'Moon Cancer',
    loreGrandCaster: 'Grand Caster',
  }
  return map[cls] ?? cls.charAt(0).toUpperCase() + cls.slice(1)
}
</script>

<style scoped>
.stats-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 18, 0.72);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: 1rem;
}

.stats-card {
  background: var(--surface-2, #262630);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  max-width: 420px;
  width: 100%;
  box-shadow: var(--shadow-3);
  animation: popIn 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.stats-title {
  font-family: var(--font-title);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}

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
}
.close-btn:hover { background: var(--surface-3); color: var(--text-primary); }

/* Summary stat boxes */
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 1.5rem;
}

.stat-box {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-num {
  font-family: var(--font-title);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
}

.stat-lbl {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-align: center;
  line-height: 1.2;
}

/* Section */
.section { margin-bottom: 1.25rem; }
.section:last-child { margin-bottom: 0; }

.section-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
}

/* Guess distribution chart */
.dist-chart {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.dist-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dist-idx {
  width: 14px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  text-align: right;
  flex-shrink: 0;
}

.dist-bar-wrap {
  flex: 1;
  height: 22px;
  background: var(--surface-1);
  border-radius: var(--radius-xs);
  overflow: hidden;
}

.dist-bar {
  height: 100%;
  min-width: 18px;
  background: var(--wrong-border);
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 6px;
  transition: width 0.5s ease;
}

.dist-bar-filled {
  background: var(--primary-dim);
}

.dist-count {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--on-primary, #1c1200);
}

.dist-bar:not(.dist-bar-filled) .dist-count {
  color: var(--text-muted);
}

/* Divider */
.divider {
  height: 1px;
  background: var(--divider);
  margin: 0 0 1.25rem;
}

/* Yesterday's servant */
.yesterday-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px 14px;
}

.yesterday-face {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  background: var(--surface-3);
  flex-shrink: 0;
}

.yesterday-info { flex: 1; }

.yesterday-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.yesterday-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.y-tag {
  font-size: 0.68rem;
  padding: 2px 8px;
  border-radius: var(--radius-xs);
  background: var(--surface-3);
  color: var(--text-muted);
}

.np-buster { background: rgba(220,53,69,.15); color: #e87676; }
.np-arts   { background: rgba(70,130,220,.15); color: #82b8f5; }
.np-quick  { background: rgba(60,160,80,.15);  color: #82c896; }

.no-data {
  font-size: 0.82rem;
  color: var(--text-muted);
  text-align: center;
  padding: 1rem 0;
}

/* Transition */
.stats-popup-enter-active { animation: popIn 0.3s ease; }
.stats-popup-leave-active { transition: opacity 0.2s ease; }
.stats-popup-leave-to    { opacity: 0; }
</style>
