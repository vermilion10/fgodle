<template>
  <div class="guess-grid">
    <!-- Header row -->
    <div class="grid-row header-row">
      <div class="cell cell-servant">Servant</div>
      <div class="cell">Class</div>
      <div class="cell">Rarity</div>
      <div class="cell hide-on-mobile">Attribute</div>
      <div class="cell">Gender</div>
      <div class="cell hide-on-mobile">Alignment</div>
      <div class="cell">NP Card</div>
      <div class="cell">NP Target</div>
    </div>

    <!-- Guess rows -->
    <TransitionGroup name="list">
      <div
        v-for="(row, idx) in store.guesses"
        :key="row.servant.id"
        class="grid-row guess-row fade-in"
        :style="{ '--delay': idx * 0.05 + 's' }"
      >
        <!-- Servant face + name -->
        <div class="cell cell-servant">
          <img
            :src="row.servant.face"
            :alt="row.servant.name"
            class="servant-face"
            loading="lazy"
            @error="(e) => ((e.target as HTMLImageElement).style.opacity = '0.2')"
          />
          <span class="servant-name">{{ row.servant.name }}</span>
        </div>

        <!-- Class -->
        <div class="cell" :class="resultClass(row.results.className.result)">
          <span class="class-badge" :class="'np-' + row.servant.npCard">
            {{ formatClass(row.servant.className) }}
          </span>
          <span class="result-icon">{{ resultIcon(row.results.className.result) }}</span>
        </div>

        <!-- Rarity -->
        <div class="cell" :class="resultClass(row.results.rarity.result)">
          <span class="rarity-stars">{{ '★'.repeat(Number(row.results.rarity.value)) }}</span>
          <span v-if="row.results.rarity.result === 'partial'" class="hint-arrow">
            {{ Number(row.results.rarity.value) < (store.todayAnswer?.rarity ?? 0) ? '▲' : '▼' }}
          </span>
          <span class="result-icon">{{ resultIcon(row.results.rarity.result) }}</span>
        </div>

        <!-- Attribute -->
        <div class="cell hide-on-mobile" :class="resultClass(row.results.attribute.result)">
          <span class="attr-badge" :class="'attr-' + row.results.attribute.value">
            {{ formatAttr(String(row.results.attribute.value)) }}
          </span>
          <span class="result-icon">{{ resultIcon(row.results.attribute.result) }}</span>
        </div>

        <!-- Gender -->
        <div class="cell" :class="resultClass(row.results.gender.result)">
          <span class="gender-icon">{{ genderIcon(String(row.results.gender.value)) }}</span>
          <span class="result-icon">{{ resultIcon(row.results.gender.result) }}</span>
        </div>

        <!-- Alignment -->
        <div class="cell hide-on-mobile" :class="resultClass(row.results.alignment.result)">
          <span class="align-text">{{ row.results.alignment.value }}</span>
          <span class="result-icon">{{ resultIcon(row.results.alignment.result) }}</span>
        </div>

        <!-- NP Card -->
        <div class="cell" :class="resultClass(row.results.npCard.result)">
          <span class="np-badge" :class="'np-' + row.results.npCard.value">
            {{ formatNpCard(String(row.results.npCard.value)) }}
          </span>
          <span class="result-icon">{{ resultIcon(row.results.npCard.result) }}</span>
        </div>

        <!-- NP Target -->
        <div class="cell" :class="resultClass(row.results.npTarget.result)">
          <span class="np-tar-text">
            {{ formatNpTarget(String(row.results.npTarget.value)) }}
          </span>
          <span class="result-icon">{{ resultIcon(row.results.npTarget.result) }}</span>
        </div>
      </div>
    </TransitionGroup>

    <!-- Empty placeholder rows -->
    <div
      v-for="i in emptyRows"
      :key="'empty-' + i"
      class="grid-row guess-row empty-row"
    >
      <div class="cell cell-servant">
        <div class="servant-face-placeholder"></div>
        <span class="placeholder-text">—</span>
      </div>
      <div class="cell"><span class="placeholder-dash">—</span></div>
      <div class="cell"><span class="placeholder-dash">—</span></div>
      <div class="cell hide-on-mobile"><span class="placeholder-dash">—</span></div>
      <div class="cell"><span class="placeholder-dash">—</span></div>
      <div class="cell hide-on-mobile"><span class="placeholder-dash">—</span></div>
      <div class="cell"><span class="placeholder-dash">—</span></div>
      <div class="cell"><span class="placeholder-dash">—</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useServantStore } from '../stores/servantStore'
import type { GuessResult } from '../types/servant'

const store = useServantStore()

const emptyRows = computed(() => {
  return Math.max(0, store.maxGuesses - store.guesses.length)
})

function resultClass(result: GuessResult) {
  return {
    'cell-correct': result === 'correct',
    'cell-partial': result === 'partial',
    'cell-wrong': result === 'wrong',
  }
}

function resultIcon(result: GuessResult) {
  return result === 'correct' ? '✓' : result === 'partial' ? '~' : '✗'
}

function formatClass(cls: string): string {
  const map: Record<string, string> = {
    alterEgo: 'Alter Ego',
    moonCancer: 'Moon Cancer',
    loreGrandCaster: 'Grand Caster',
  }
  return map[cls] ?? cls.charAt(0).toUpperCase() + cls.slice(1)
}

function formatAttr(attr: string): string {
  const map: Record<string, string> = {
    sky: '☀ Sky',
    earth: '🌿 Earth',
    human: '👤 Human',
    star: '★ Star',
    beast: '🔥 Beast',
  }
  return map[attr] ?? attr
}

function genderIcon(g: string) {
  return g === 'female' ? '♀ Female' : g === 'male' ? '♂ Male' : '⚧ Unknown'
}

function formatNpCard(card: string) {
  return card.charAt(0).toUpperCase() + card.slice(1)
}

function formatNpTarget(target: string) {
  const map: Record<string, string> = {
    aoe: 'AoE',
    single: 'Single',
    support: 'Support'
  }
  return map[target] ?? target
}
</script>

<style scoped>
.guess-grid {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.grid-row {
  display: grid;
  grid-template-columns: 220px repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 6px;
  min-width: 860px;
}

/* Header */
.header-row .cell {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--gold);
  font-family: var(--font-title);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  text-align: center;
}

/* Cells */
.cell {
  background: var(--bg-card);
  border: 1px solid var(--wrong-border);
  border-radius: var(--radius-sm);
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.78rem;
  text-align: center;
  transition: all 0.3s ease;
  min-height: 72px;
  animation: fadeIn 0.4s ease var(--delay, 0s) both;
}

.cell-correct {
  background: var(--correct-bg);
  border-color: var(--correct-border);
  box-shadow: 0 0 10px rgba(67, 160, 71, 0.2);
}

.cell-partial {
  background: var(--partial-bg);
  border-color: var(--partial-border);
  box-shadow: 0 0 10px rgba(251, 140, 0, 0.2);
}

.cell-wrong {
  background: var(--wrong);
  border-color: var(--wrong-border);
}

.result-icon {
  font-size: 0.65rem;
  font-weight: 700;
  opacity: 0.7;
}

.cell-correct .result-icon { color: var(--correct-border); }
.cell-partial .result-icon { color: var(--partial-border); }
.cell-wrong .result-icon { color: var(--text-muted); }

/* Servant cell */
.cell-servant {
  flex-direction: row !important;
  justify-content: flex-start !important;
  gap: 10px;
  text-align: left !important;
  padding: 8px 12px;
}

.servant-face {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border);
  background: var(--wrong);
  flex-shrink: 0;
}

.servant-face-placeholder {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--wrong);
  border: 2px solid var(--wrong-border);
  flex-shrink: 0;
}

.servant-name {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.3;
}

.placeholder-text, .placeholder-dash {
  color: var(--text-muted);
  font-size: 0.8rem;
}

/* Badges */
.class-badge {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 20px;
  font-weight: 500;
}

.rarity-stars {
  color: var(--gold);
  font-size: 0.75rem;
  letter-spacing: -1px;
}

.hint-arrow {
  color: var(--partial-border);
  font-size: 0.8rem;
  font-weight: 700;
}

.attr-badge {
  font-size: 0.72rem;
  font-weight: 500;
  white-space: nowrap;
}

.attr-sky     { color: #64b5f6; }
.attr-earth   { color: #a5d6a7; }
.attr-human   { color: #ce93d8; }
.attr-star    { color: var(--gold); }
.attr-beast   { color: #ef9a9a; }

.gender-icon {
  font-size: 0.78rem;
}

.align-text {
  font-size: 0.7rem;
  text-align: center;
  color: var(--text-secondary);
  line-height: 1.3;
}

.bool-yes { color: #81c784; font-size: 0.75rem; }
.bool-no  { color: var(--text-muted); font-size: 0.75rem; }

.np-badge {
  font-size: 0.72rem;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 4px;
}

.np-buster { background: rgba(220, 53, 69, 0.2); color: #ff5252; border: 1px solid rgba(255, 82, 82, 0.4); }
.np-arts   { background: rgba(13, 110, 253, 0.2); color: #64b5f6; border: 1px solid rgba(100, 181, 246, 0.4); }
.np-quick  { background: rgba(25, 135, 84, 0.2); color: #81c784; border: 1px solid rgba(129, 199, 132, 0.4); }

.np-tar-text {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Transition */
.list-enter-active { animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* Mobile styling */
@media (max-width: 768px) {
  .hide-on-mobile {
    display: none !important;
  }
  .grid-row {
    grid-template-columns: 140px repeat(5, minmax(60px, 1fr));
    min-width: unset;
  }
  .header-row .cell {
    font-size: 0.55rem;
    padding: 6px 4px;
  }
  .cell {
    padding: 6px 4px;
  }
  .cell-servant {
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
  }
  .servant-name {
    font-size: 0.65rem;
  }
}
</style>
