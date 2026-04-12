<template>
  <div class="about-page">
    <div class="rules-container">
      <h1 class="page-title">About FGO<span class="accent">dle</span></h1>
      
      <section class="rule-section">
        <p class="intro-text">
          A Wordle-like guessing game specifically tailored for Fate/Grand Order (FGO) servants! Test your knowledge by guessing today's servant or playing infinitely in Unlimited Mode.
        </p>
      </section>

      <section class="rule-section">
        <h2>🌟 Features</h2>
        <ul class="feature-list">
          <li><strong>Daily Mode</strong>: Guess the preset servant of the day! A new servant is carefully selected every day. Your streak and stats are saved locally.</li>
          <li><strong>Unlimited Mode</strong>: Want to keep guessing? Play in unlimited mode and guess random servants endlessly!</li>
          <li><strong>Detailed Clues</strong>: Offers comprehensive visual hints (Rarity, Class, NP Card, NP Type, Attribute, Alignment, Gender, and Traits).</li>
          <li><strong>Share Your Result</strong>: Easily generate a beautiful shareable image of your results, complete with a QR Code for your friends.</li>
          <li><strong>Always Up to Date</strong>: Data is synchronized automatically from the Japanese server using GitHub Actions and the Atlas Academy API. Fully automated CI/CD pipeline!</li>
          <li><strong>Mobile Responsive</strong>: The UI automatically shifts and hides redundant clues on mobile screens for a better experience.</li>
        </ul>
      </section>

      <section class="rule-section">
        <h2>🚀 Technologies</h2>
        <p>Built with modern web technologies:</p>
        <div class="tech-tags">
          <span class="tech-tag">Vue 3</span>
          <span class="tech-tag">TypeScript</span>
          <span class="tech-tag">Vite</span>
          <span class="tech-tag">GitHub Actions</span>
        </div>
      </section>

      <section class="rule-section">
        <h2>📜 Credits</h2>
        <ul class="credit-list">
          <li><strong>Data Source</strong>: <a href="https://api.atlasacademy.io/" target="_blank">Atlas Academy API</a> - Provides the extensive FGO databases.</li>
          <li><strong>Game Concept</strong>: Inspired by the original Wordle and various fandom iterations.</li>
          <li><strong>Animations</strong>: GIFs provided via <a href="https://tenor.com/" target="_blank">Tenor</a>.</li>
          <li><strong>Original Developer</strong>: <a href="https://github.com/vermilion10" target="_blank">vermilion10</a></li>
        </ul>
      </section>
      
      <div class="actions">
        <router-link to="/" class="btn-back">← Back to Game</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.rules-container {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  box-shadow: var(--shadow-card);
}

.page-title {
  font-family: var(--font-title);
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-primary);
  letter-spacing: 2px;
}

.accent {
  color: var(--gold);
}

.rule-section {
  margin-bottom: 2rem;
}

.rule-section h2 {
  font-family: var(--font-title);
  font-size: 1.4rem;
  color: var(--gold);
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(201, 168, 76, 0.2);
  padding-bottom: 0.5rem;
  letter-spacing: 1px;
}

.intro-text {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.feature-list, .credit-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-list li, .credit-list li {
  position: relative;
  padding-left: 20px;
  line-height: 1.5;
  color: var(--text-secondary);
}

.feature-list li::before, .credit-list li::before {
  content: '✦';
  position: absolute;
  left: 0;
  color: var(--gold);
}

.feature-list strong, .credit-list strong {
  color: var(--text-primary);
  font-weight: 600;
}

.credit-list a {
  color: var(--gold);
  text-decoration: none;
  border-bottom: 1px dashed var(--gold);
  transition: all 0.2s;
}

.credit-list a:hover {
  color: var(--gold-light);
  border-bottom-style: solid;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 1rem;
}

.tech-tag {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.actions {
  margin-top: 3rem;
  text-align: center;
}

.btn-back {
  display: inline-block;
  padding: 10px 24px;
  background: transparent;
  color: var(--gold);
  border: 1px dashed var(--gold);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-family: var(--font-title);
  font-weight: 600;
  transition: all 0.2s ease;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.btn-back:hover {
  background: rgba(201, 168, 76, 0.1);
}

@media (max-width: 600px) {
  .rules-container {
    padding: 1.5rem;
  }
}
</style>
