<template>
  <div class="about-page">
    <div class="about-container">
      <h1 class="page-title">FGO<span class="accent">dle</span></h1>

      <section class="rule-section">
        <p class="intro-text">
          A Wordle-like guessing game for Fate/Grand Order servants. Test your knowledge by guessing today's servant or playing endlessly in Unlimited mode.
        </p>
      </section>

      <section class="rule-section">
        <h2 class="section-title">Features</h2>
        <ul class="feature-list">
          <li><strong>Daily Mode</strong> - A new servant every day. Your progress and streak are saved locally.</li>
          <li><strong>Unlimited Mode</strong> - Play with random servants. Choose Easy, Normal, or Hard difficulty.</li>
          <li><strong>Hint Rows</strong> <em>(Daily only)</em> - Rows 5 and 8 let you peek at the answer's attributes before guessing.</li>
          <li><strong>Reveal Animation</strong> - Card-flip reveal column by column, just like classic Wordle.</li>
          <li><strong>Detailed Clues</strong> - Rarity, Class, NP Card, NP Type, Attribute, Alignment, and Gender.</li>
          <li><strong>Share Your Result</strong> - Generate a shareable image with a QR code linking back to FGOdle.</li>
          <li><strong>Always Up to Date</strong> - Servant data synced automatically via GitHub Actions and Atlas Academy API.</li>
          <li><strong>Mobile Responsive</strong> - Fully scrollable grid on any screen size.</li>
        </ul>
      </section>

      <section class="rule-section">
        <h2 class="section-title">Built with</h2>
        <div class="tech-tags">
          <span class="tech-tag">Vue 3</span>
          <span class="tech-tag">TypeScript</span>
          <span class="tech-tag">Vite</span>
          <span class="tech-tag">GitHub Actions</span>
        </div>
      </section>

      <section class="rule-section">
        <h2 class="section-title">Credits</h2>
        <ul class="credit-list">
          <li><strong>Data Source</strong> - <a href="https://api.atlasacademy.io/" target="_blank">Atlas Academy API</a></li>
          <li><strong>Game Concept</strong> - Inspired by the original Wordle and various fandom iterations</li>
          <li><strong>Animations</strong> - GIFs via <a href="https://tenor.com/" target="_blank">Tenor</a></li>
          <li><strong>Developer</strong> - <a href="https://vermilion10.pages.dev/" target="_blank">vermilion10</a></li>
        </ul>
      </section>
      
      <div class="actions">
        <router-link to="/" class="btn-back">← Back to game</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  padding: 2rem 1.25rem 4rem;
  max-width: 720px;
  margin: 0 auto;
}

.about-container {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 2.25rem;
}

.page-title {
  font-family: var(--font-title);
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}

.accent { color: var(--primary); }

.rule-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.875rem;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--divider);
}

.intro-text {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.feature-list, .credit-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature-list li, .credit-list li {
  position: relative;
  padding-left: 16px;
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

.feature-list strong, .credit-list strong {
  color: var(--text-primary);
  font-weight: 600;
}

.credit-list a {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  border-bottom-color: rgba(200, 168, 90, 0.3);
  transition: border-color 0.15s;
}
.credit-list a:hover { border-bottom-color: var(--primary); }

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  background: var(--surface-3);
  color: var(--text-secondary);
  padding: 5px 12px;
  border-radius: var(--radius-xs);
  font-size: 0.82rem;
  font-weight: 500;
}

.actions {
  margin-top: 2rem;
  text-align: center;
}

.btn-back {
  display: inline-block;
  padding: 9px 20px;
  color: var(--text-muted);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-xl);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.15s, background 0.15s;
}

.btn-back:hover {
  color: var(--text-primary);
  background: var(--surface-3);
}

@media (max-width: 600px) {
  .about-container { padding: 1.5rem; }
}
</style>
