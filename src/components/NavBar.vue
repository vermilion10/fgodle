<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <router-link to="/" class="brand">
        <span class="brand-icon"><img src="/fgo_diamond.webp" alt="FGOdle" width="20" height="20"></span>
        <div class="brand-text">
          <span class="brand-title">FGO<span class="brand-accent">dle</span></span>
          <span class="brand-sub">Fate/Grand Order Wordle</span>
        </div>
      </router-link>

      <div class="nav-links">
        <router-link to="/about" class="nav-btn">
          <span>ℹ</span> About
        </router-link>
        <router-link to="/how-to-play" class="nav-btn">
          <span>?</span> How to Play
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
</script>

<style scoped>
.navbar {
  background: linear-gradient(180deg, #0d0d1f 0%, rgba(13,13,31,0.95) 100%);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.brand-icon {
  font-size: 1.6rem;
  color: var(--gold);
  filter: drop-shadow(0 0 8px var(--gold-glow));
  animation: pulse-gold 3s ease-in-out infinite;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-family: var(--font-title);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 1px;
  line-height: 1;
}

.brand-accent {
  color: var(--gold);
}

.brand-sub {
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  color: var(--gold);
  border-color: var(--border-hover);
  background: rgba(201, 168, 76, 0.08);
}

.nav-btn span {
  width: 18px;
  height: 18px;
  background: var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
}
</style>
