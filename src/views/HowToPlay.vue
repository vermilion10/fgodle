<template>
  <main class="how-to-play">
    <div class="container">
      <router-link to="/" class="back-btn">← Back to Game</router-link>

      <h1 class="page-title">⚖ How to Play</h1>
      <p class="page-subtitle">Guess the daily FGO servant in 8 attempts!</p>

      <section class="htp-section">
        <h2 class="section-title">Rules</h2>
        <ul class="rules-list">
          <li>Each day a new servant is chosen</li>
          <li>Search and select any servant to make a guess</li>
          <li>You have <strong class="gold">8 attempts</strong> to guess correctly</li>
          <li>After each guess, cells will reveal how close you are</li>
          <li><strong class="gold">Hint:</strong> The servant's Class badge color matches their NP Card (Red = Buster, Blue = Arts, Green = Quick)</li>
          <li>The same servant refreshes at midnight</li>
        </ul>
      </section>

      <section class="htp-section">
        <h2 class="section-title">Cell Colors</h2>

        <div class="color-example">
          <div class="example-cell cell-correct">
            <span>Saber</span>
            <span class="ex-icon">✓</span>
          </div>
          <div class="example-info">
            <strong style="color: #66bb6a">Green — Correct!</strong>
            <p>This attribute matches the answer exactly</p>
          </div>
        </div>

        <div class="color-example">
          <div class="example-cell cell-partial">
            <span>★★★★</span>
            <span class="ex-icon">~</span>
          </div>
          <div class="example-info">
            <strong style="color: #fb8c00">Orange — Close (Rarity only)</strong>
            <p>The rarity is within ±1 star of the answer</p>
          </div>
        </div>

        <div class="color-example">
          <div class="example-cell cell-wrong">
            <span>Lancer</span>
            <span class="ex-icon">✗</span>
          </div>
          <div class="example-info">
            <strong style="color: #9e9e9e">Grey — Wrong</strong>
            <p>This attribute does not match the answer</p>
          </div>
        </div>
      </section>

      <section class="htp-section">
        <h2 class="section-title">Attributes Compared</h2>
        <div class="attr-grid">
          <div class="attr-card" v-for="attr in attributes" :key="attr.name">
            <span class="attr-icon">{{ attr.icon }}</span>
            <div>
              <strong>{{ attr.name }}</strong>
              <p>{{ attr.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <div class="play-btn-wrapper">
        <router-link to="/" class="play-btn">⚔ Start Playing</router-link>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const attributes = [
  { icon: '⚔', name: 'Class', desc: 'Saber, Archer, Rider, etc.' },
  { icon: '★', name: 'Rarity', desc: '1–5 stars (orange if within ±1)' },
  { icon: '🌐', name: 'Attribute', desc: 'Sky, Earth, Human, Star, or Beast' },
  { icon: '⚥', name: 'Gender', desc: 'Male, Female, or Unknown' },
  { icon: '⚖', name: 'Alignment', desc: 'Lawful/Chaotic/Neutral + Good/Evil/Balanced' },
  { icon: '🃏', name: 'NP Card', desc: 'Buster, Arts, or Quick' },
  { icon: '🎯', name: 'NP Target', desc: 'Single, AoE, or Support' },
]
</script>

<style scoped>
.how-to-play {
  flex: 1;
  padding: 2rem 1.25rem 4rem;
}

.container {
  max-width: 640px;
  margin: 0 auto;
}

.back-btn {
  display: inline-block;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.85rem;
  margin-bottom: 2rem;
  transition: color 0.2s ease;
}
.back-btn:hover { color: var(--gold); }

.page-title {
  font-family: var(--font-title);
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 0.4rem;
  letter-spacing: 2px;
}

.page-subtitle {
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
}

.htp-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-family: var(--font-title);
  font-size: 1rem;
  color: var(--gold);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 1rem;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.rules-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rules-list li {
  color: var(--text-secondary);
  padding-left: 1.5rem;
  position: relative;
  font-size: 0.95rem;
  line-height: 1.6;
}

.rules-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--gold);
}

.gold { color: var(--gold); }

/* Color examples */
.color-example {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.example-cell {
  min-width: 80px;
  height: 60px;
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 1px solid transparent;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.example-cell.cell-correct {
  background: var(--correct-bg);
  border-color: var(--correct-border);
}
.example-cell.cell-partial {
  background: var(--partial-bg);
  border-color: var(--partial-border);
}
.example-cell.cell-wrong {
  background: var(--wrong);
  border-color: var(--wrong-border);
}

.ex-icon {
  font-size: 0.7rem;
  opacity: 0.7;
}

.example-info strong {
  display: block;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.example-info p {
  color: var(--text-muted);
  font-size: 0.8rem;
}

/* Attributes grid */
.attr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

.attr-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 12px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.attr-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.attr-card strong {
  font-size: 0.85rem;
  color: var(--text-primary);
  display: block;
  margin-bottom: 2px;
}

.attr-card p {
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.4;
}

/* Play button */
.play-btn-wrapper {
  text-align: center;
  margin-top: 1.5rem;
}

.play-btn {
  display: inline-block;
  padding: 12px 36px;
  background: linear-gradient(135deg, var(--gold), #a07820);
  color: #1a1000;
  border-radius: var(--radius-md);
  font-family: var(--font-title);
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  letter-spacing: 2px;
  transition: all 0.2s ease;
}

.play-btn:hover {
  background: linear-gradient(135deg, var(--gold-light), var(--gold));
  box-shadow: var(--shadow-gold);
  transform: translateY(-2px);
}
</style>
