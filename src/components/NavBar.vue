<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <router-link to="/" class="brand">
        <span class="brand-icon"><img src="/fgo_diamond.webp" alt="FGOdle" width="22" height="22"></span>
        <div class="brand-text">
          <span class="brand-title">FGO<span class="brand-accent">dle</span></span>
          <span class="brand-sub">Fate/Grand Order Wordle</span>
        </div>
      </router-link>

      <div class="nav-links">
        <!-- Stats -->
        <button class="nav-icon-btn" @click="store.showStats = true" title="Battle Records" aria-label="Battle Records">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </button>

        <!-- Theme toggle -->
        <button class="nav-icon-btn" @click="store.toggleTheme()" :title="store.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'" aria-label="Toggle theme">
          <!-- Moon (dark mode active) -->
          <svg v-if="store.theme === 'dark'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <!-- Sun (light mode active) -->
          <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </button>

        <button class="nav-btn" @click="store.showAbout = true">About</button>
        <button class="nav-btn nav-btn-filled" @click="store.showHowToPlay = true">How to Play</button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useServantStore } from '../stores/servantStore'
const store = useServantStore()
</script>

<style scoped>
.navbar {
  background: var(--surface-1);
  border-bottom: 1px solid var(--divider);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 60px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.brand-title {
  font-family: var(--font-title);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.brand-accent { color: var(--primary); }

.brand-sub {
  font-size: 0.62rem;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Icon buttons */
.nav-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.nav-icon-btn:hover {
  color: var(--primary);
  background: var(--primary-bg);
}

/* Text nav buttons */
.nav-btn {
  display: flex;
  align-items: center;
  padding: 7px 14px;
  border-radius: var(--radius-xl);
  color: var(--text-secondary);
  background: transparent;
  border: none;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.nav-btn:hover {
  color: var(--text-primary);
  background: var(--border-subtle);
}

.nav-btn-filled {
  background: var(--primary-bg);
  color: var(--primary);
}

.nav-btn-filled:hover {
  background: rgba(200, 168, 90, 0.16);
  color: var(--primary);
}

[data-theme="light"] .nav-btn-filled:hover {
  background: rgba(138, 104, 32, 0.16);
}
</style>
