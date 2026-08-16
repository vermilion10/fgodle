<template>
  <main class="how-to-play">
    <div class="container">
      <router-link to="/" class="back-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back
      </router-link>

      <h1 class="page-title">How to Play</h1>
      <p class="page-subtitle">Guess the daily FGO servant in 8 attempts</p>

      <section class="htp-section">
        <h2 class="section-title">Rules</h2>
        <ul class="rules-list">
          <li>Each day a new servant is chosen for <strong class="accent">Daily Mode</strong></li>
          <li>Search and select any servant to make a guess</li>
          <li>You have <strong class="accent">8 attempts</strong> to guess correctly</li>
          <li>After each guess, cells reveal how close you are to the answer</li>
          <li><strong class="accent">Tip:</strong> The servant's Class badge color matches their NP Card type - Red = Buster, Blue = Arts, Green = Quick</li>
          <li>The daily servant resets at midnight every day</li>
        </ul>
      </section>

      <section class="htp-section">
        <h2 class="section-title"><i class="fa-solid fa-lightbulb"></i> Hint Rows <span class="tag-daily">Daily only</span></h2>
        <p class="hint-intro">Rows <strong class="accent">5</strong> and <strong class="accent">8</strong> are special Hint Rows that start locked.</p>
        <ul class="rules-list">
          <li>When you reach <strong class="accent">row 5</strong> (after 4 guesses), it unlocks - click <strong class="accent">1 cell</strong> to peek at the answer's exact value</li>
          <li>When you reach <strong class="accent">row 8</strong> (your final attempt), it unlocks - reveal up to <strong class="accent">3 cells</strong></li>
          <li>Revealing a hint is optional - you can skip and guess directly</li>
          <li>Once you submit on a hint row, it shows normal results like all other rows</li>
        </ul>
      </section>

      <section class="htp-section">
        <h2 class="section-title">Cell Colors</h2>

        <div class="color-example">
          <div class="example-cell cell-correct">
            <span>Saber</span>
            <span class="ex-icon"><i class="fa-solid fa-check"></i></span>
          </div>
          <div class="example-info">
            <strong class="correct-label">Correct</strong>
            <p>This attribute matches the answer exactly</p>
          </div>
        </div>

        <div class="color-example">
          <div class="example-cell cell-partial">
            <span><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></span>
            <span class="ex-icon">~</span>
          </div>
          <div class="example-info">
            <strong class="partial-label">Close - rarity only</strong>
            <p>The rarity is within ±1 star of the answer</p>
          </div>
        </div>

        <div class="color-example">
          <div class="example-cell cell-wrong">
            <span>Lancer</span>
            <span class="ex-icon"><i class="fa-solid fa-xmark"></i></span>
          </div>
          <div class="example-info">
            <strong class="wrong-label">Wrong</strong>
            <p>This attribute does not match the answer</p>
          </div>
        </div>
      </section>

      <section class="htp-section">
        <h2 class="section-title">Attributes Compared</h2>
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

      <section class="htp-section">
        <h2 class="section-title">Game Modes</h2>
        <div class="mode-cards">
          <div class="mode-card">
            <div class="mode-card-title"><i class="fa-solid fa-calendar-day"></i> Daily Mode</div>
            <p>A new servant every day, shared globally. Your progress is saved. Includes Hint Rows at rows 5 and 8.</p>
          </div>
          <div class="mode-card">
            <div class="mode-card-title"><i class="fa-solid fa-infinity"></i> Unlimited Mode</div>
            <p>Guess randomly selected servants endlessly. Choose your difficulty:</p>
            <ul class="diff-list">
              <li><span class="diff-tag easy">Easy</span> 12 guesses, relaxed</li>
              <li><span class="diff-tag normal">Normal</span> 8 guesses, standard</li>
              <li><span class="diff-tag hard">Hard</span> 5 guesses, test your knowledge</li>
            </ul>
          </div>
        </div>
      </section>

      <div class="play-btn-wrapper">
        <router-link to="/" class="play-btn">Start Playing</router-link>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const attributes = [
  { icon: '<i class="fa-solid fa-khanda"></i>', name: 'Class', desc: 'Saber, Archer, Rider, etc.' },
  { icon: '<i class="fa-solid fa-star"></i>', name: 'Rarity', desc: '1–5 stars (orange if within ±1)' },
  { icon: '<i class="fa-solid fa-globe"></i>', name: 'Attribute', desc: 'Sky, Earth, Human, Star, or Beast' },
  { icon: '<i class="fa-solid fa-venus-mars"></i>', name: 'Gender', desc: 'Male, Female, or Unknown' },
  { icon: '<i class="fa-solid fa-scale-balanced"></i>', name: 'Alignment', desc: 'Lawful/Chaotic/Neutral + Good/Evil/Balanced' },
  { icon: '<i class="fa-solid fa-clone"></i>', name: 'NP Card', desc: 'Buster, Arts, or Quick' },
  { icon: '<i class="fa-solid fa-bullseye"></i>', name: 'NP Target', desc: 'Single, AoE, or Support' },
]
</script>

<style scoped>
.how-to-play {
  flex: 1;
  padding: 2rem 1.25rem 4rem;
}

.container {
  max-width: 620px;
  margin: 0 auto;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.85rem;
  margin-bottom: 2rem;
  transition: color 0.15s;
}
.back-btn:hover { color: var(--text-secondary); }

.page-title {
  font-family: var(--font-title);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.35rem;
  letter-spacing: 0.5px;
}

.page-subtitle {
  color: var(--text-muted);
  margin-bottom: 2.5rem;
  font-size: 0.9rem;
}

.htp-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 1rem;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--divider);
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag-daily {
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
  gap: 10px;
}

.rules-list li {
  color: var(--text-secondary);
  padding-left: 1.2rem;
  position: relative;
  font-size: 0.9rem;
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
  margin-bottom: 1rem;
  line-height: 1.6;
}

/* Mode cards */
.mode-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
@media (max-width: 540px) { .mode-cards { grid-template-columns: 1fr; } }

.mode-card {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 1rem;
}
.mode-card-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}
.mode-card p {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.diff-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}
.diff-list li {
  font-size: 0.78rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}
.diff-tag {
  display: inline-block;
  padding: 1px 8px;
  border-radius: var(--radius-xs);
  font-weight: 600;
  font-size: 0.7rem;
}
.diff-tag.easy   { background: rgba(74,143,86,.15); color: var(--correct-text); }
.diff-tag.normal { background: rgba(160,113,42,.15); color: var(--partial-text); }
.diff-tag.hard   { background: rgba(155,54,54,.15); color: #e09090; }

/* Color examples */
.color-example {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  padding: 0.875rem 1rem;
  background: var(--surface-1);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.example-cell {
  min-width: 76px;
  height: 56px;
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: 0.78rem;
  flex-shrink: 0;
  border: 1px solid transparent;
}

.example-cell.cell-correct { background: var(--correct-bg); border-color: var(--correct-border); }
.example-cell.cell-partial { background: var(--partial-bg); border-color: var(--partial-border); }
.example-cell.cell-wrong   { background: var(--wrong-bg); border-color: var(--wrong-border); }

.ex-icon { font-size: 0.65rem; opacity: 0.65; }

.example-info strong { display: block; margin-bottom: 3px; font-size: 0.875rem; }
.example-info p { color: var(--text-muted); font-size: 0.78rem; }

.correct-label { color: var(--correct-text); }
.partial-label { color: var(--partial-text); }
.wrong-label   { color: var(--text-muted); }

/* Attributes grid */
.attr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 8px;
}

.attr-card {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 11px 12px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.attr-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 1px; }

.attr-card strong { font-size: 0.82rem; color: var(--text-primary); display: block; margin-bottom: 2px; }
.attr-card p      { font-size: 0.72rem; color: var(--text-muted); line-height: 1.4; }

/* Play button */
.play-btn-wrapper { text-align: center; margin-top: 2rem; }

.play-btn {
  display: inline-block;
  padding: 11px 32px;
  background: var(--primary);
  color: var(--on-primary);
  border-radius: var(--radius-xl);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: opacity 0.15s;
}

.play-btn:hover { opacity: 0.88; }
</style>
