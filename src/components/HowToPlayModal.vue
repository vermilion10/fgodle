<template>
  <Transition name="modal-fade">
    <div v-if="store.showHowToPlay" class="modal-overlay" @click.self="store.showHowToPlay = false">
      <div class="modal-card">

        <div class="modal-header">
          <h2 class="modal-title">How to Play</h2>
          <button class="close-btn" @click="store.showHowToPlay = false" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <p class="intro-text">Guess the daily FGO servant in 8 attempts.</p>

          <!-- Rules -->
          <section class="htp-section">
            <h3 class="section-label">Rules</h3>
            <ul class="rules-list">
              <li>Each day a new servant is chosen for <strong class="accent">Daily Mode</strong></li>
              <li>Search and select any servant to make a guess</li>
              <li>You have <strong class="accent">8 attempts</strong> to guess correctly</li>
              <li>After each guess, cells reveal how close you are to the answer</li>
              <li><strong class="accent">Tip:</strong> The servant's Class badge color matches their NP Card type - Red = Buster, Blue = Arts, Green = Quick</li>
              <li>The daily servant resets at midnight every day</li>
            </ul>
          </section>

          <!-- Class filter hint -->
          <section class="htp-section">
            <h3 class="section-label"><i class="fa-solid fa-tag"></i> Class Filter Chips</h3>
            <p class="hint-intro">Above the search box, you'll find scrollable <strong class="accent">class chips</strong>. Tap a chip (Saber, Archer, etc.) to instantly filter the search dropdown to only show servants of that class. Tap again to deselect.</p>
          </section>

          <!-- Hint rows -->
          <section class="htp-section">
            <h3 class="section-label"><i class="fa-solid fa-lightbulb"></i> Hint Rows <span class="tag-badge">Daily only</span></h3>
            <p class="hint-intro">Rows <strong class="accent">5</strong> and <strong class="accent">8</strong> are special Hint Rows - they start locked.</p>
            <ul class="rules-list">
              <li>Reach <strong class="accent">row 5</strong> (after 4 guesses) → click <strong class="accent">1 cell</strong> to peek at the answer's exact value</li>
              <li>Reach <strong class="accent">row 8</strong> (final attempt) → reveal up to <strong class="accent">3 cells</strong></li>
              <li>Revealing hints is optional - you can skip and guess directly</li>
            </ul>
          </section>

          <!-- Cell colors -->
          <section class="htp-section">
            <h3 class="section-label">Cell Colors</h3>
            <div class="color-examples">
              <div class="color-example">
                <div class="example-cell cell-correct"><span>Saber</span><span class="ex-icon"><i class="fa-solid fa-check"></i></span></div>
                <div class="example-info">
                  <strong class="correct-label">Correct</strong>
                  <p>Matches the answer exactly</p>
                </div>
              </div>
              <div class="color-example">
                <div class="example-cell cell-partial"><span><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></span><span class="ex-icon">~</span></div>
                <div class="example-info">
                  <strong class="partial-label">Close (Rarity only)</strong>
                  <p>Within ±1 star of the answer</p>
                </div>
              </div>
              <div class="color-example">
                <div class="example-cell cell-wrong"><span>Lancer</span><span class="ex-icon"><i class="fa-solid fa-xmark"></i></span></div>
                <div class="example-info">
                  <strong class="wrong-label">Wrong</strong>
                  <p>Does not match the answer</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Attributes -->
          <section class="htp-section">
            <h3 class="section-label">Attributes Compared</h3>
            <div class="attr-grid">
              <div class="attr-card" v-for="attr in attributes" :key="attr.name">
                <span class="attr-icon" v-html="attr.icon"></span>
                <div>
                  <strong>{{ attr.name }}</strong>
                  <p>{{ attr.desc }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Game modes -->
          <section class="htp-section">
            <h3 class="section-label">Game Modes</h3>
            <div class="mode-cards">
              <div class="mode-card">
                <div class="mode-card-title"><i class="fa-solid fa-calendar-day"></i> Daily Mode</div>
                <p>A new servant every day, shared globally. Includes Hint Rows at rows 5 and 8. Progress is saved.</p>
              </div>
              <div class="mode-card">
                <div class="mode-card-title"><i class="fa-solid fa-infinity"></i> Unlimited Mode</div>
                <p>Guess randomly selected servants endlessly.</p>
                <ul class="diff-list">
                  <li><span class="diff-tag easy">Easy</span> 12 guesses</li>
                  <li><span class="diff-tag normal">Normal</span> 8 guesses</li>
                  <li><span class="diff-tag hard">Hard</span> 5 guesses</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Battle records -->
          <section class="htp-section">
            <h3 class="section-label"><i class="fa-solid fa-chart-bar"></i> Battle Records</h3>
            <p class="hint-intro">Tap the <strong class="accent">chart icon</strong> in the navbar to open your Battle Records. It tracks your win rate, current streak, best streak, guess distribution, and yesterday's servant - all stored locally on your device.</p>
          </section>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useServantStore } from '../stores/servantStore'
const store = useServantStore()

const attributes = [
  { icon: '<i class="fa-solid fa-khanda"></i>', name: 'Class',     desc: 'Saber, Archer, Rider, etc.' },
  { icon: '<i class="fa-solid fa-star"></i>', name: 'Rarity',    desc: '1–5 stars (orange if within ±1)' },
  { icon: '<i class="fa-solid fa-globe"></i>', name: 'Attribute', desc: 'Sky, Earth, Human, Star, or Beast' },
  { icon: '<i class="fa-solid fa-venus-mars"></i>', name: 'Gender',    desc: 'Male, Female, or Unknown' },
  { icon: '<i class="fa-solid fa-scale-balanced"></i>', name: 'Alignment', desc: 'Lawful/Chaotic/Neutral + Good/Evil/Balanced' },
  { icon: '<i class="fa-solid fa-clone"></i>', name: 'NP Card',   desc: 'Buster, Arts, or Quick' },
  { icon: '<i class="fa-solid fa-bullseye"></i>', name: 'NP Target', desc: 'Single, AoE, or Support' },
]
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
  max-width: 560px;
  width: 100%;
  max-height: 90vh;
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
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
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

.modal-body {
  overflow-y: auto;
  padding: 1.25rem 1.75rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.intro-text {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.htp-section { }

.section-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
  padding-bottom: 7px;
  border-bottom: 1px solid var(--divider);
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag-badge {
  font-size: 0.65rem;
  background: var(--primary-bg);
  color: var(--primary);
  padding: 2px 8px;
  border-radius: 20px;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
}

.rules-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rules-list li {
  color: var(--text-secondary);
  padding-left: 1.1rem;
  position: relative;
  font-size: 0.875rem;
  line-height: 1.6;
}
.rules-list li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--primary);
  font-weight: 700;
}

.accent { color: var(--primary); }

.hint-intro {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Color examples */
.color-examples { display: flex; flex-direction: column; gap: 8px; }

.color-example {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--surface-1);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.example-cell {
  min-width: 72px;
  height: 52px;
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: 0.75rem;
  flex-shrink: 0;
  border: 1px solid transparent;
}
.example-cell.cell-correct { background: var(--correct-bg); border-color: var(--correct-border); }
.example-cell.cell-partial { background: var(--partial-bg); border-color: var(--partial-border); }
.example-cell.cell-wrong   { background: var(--wrong-bg);   border-color: var(--wrong-border); }

.ex-icon { font-size: 0.6rem; opacity: 0.6; }

.example-info strong { display: block; margin-bottom: 2px; font-size: 0.85rem; }
.example-info p      { color: var(--text-muted); font-size: 0.76rem; }

.correct-label { color: var(--correct-text); }
.partial-label { color: var(--partial-text); }
.wrong-label   { color: var(--wrong-text); }

/* Attrs */
.attr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 7px;
}
.attr-card {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.attr-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
.attr-card strong { font-size: 0.8rem; color: var(--text-primary); display: block; margin-bottom: 2px; }
.attr-card p      { font-size: 0.7rem; color: var(--text-muted); line-height: 1.4; }

/* Mode cards */
.mode-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
@media (max-width: 480px) { .mode-cards { grid-template-columns: 1fr; } }

.mode-card {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 0.875rem;
}
.mode-card-title { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.4rem; }
.mode-card p     { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.4rem; }

.diff-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 6px;
}
.diff-list li {
  font-size: 0.76rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 7px;
}
.diff-tag {
  display: inline-block;
  padding: 1px 8px;
  border-radius: var(--radius-xs);
  font-weight: 600;
  font-size: 0.68rem;
}
.diff-tag.easy   { background: rgba(74,143,86,.15);  color: var(--correct-text); }
.diff-tag.normal { background: rgba(160,113,42,.15); color: var(--partial-text); }
.diff-tag.hard   { background: rgba(155,54,54,.15);  color: #e09090; }

/* Transition */
.modal-fade-enter-active { animation: popIn 0.3s ease; }
.modal-fade-leave-active { transition: opacity 0.18s ease; }
.modal-fade-leave-to    { opacity: 0; }
</style>
