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

        <!-- Region toggle -->
        <button class="nav-icon-btn server-toggle" @click="store.setServer(store.server === 'JP' ? 'NA' : 'JP')" :title="'Switch to ' + (store.server === 'JP' ? 'NA' : 'JP') + ' Server'" aria-label="Toggle server">
          <span style="font-size: 0.75rem; font-weight: bold; font-family: var(--font-body)">{{ store.server }}</span>
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

        <router-link to="/" custom v-slot="{ navigate, isExactActive }">
          <button class="nav-btn" :class="{ 'nav-btn-filled': isExactActive }" @click="navigate">Game</button>
        </router-link>
        <router-link to="/archive" custom v-slot="{ navigate, isExactActive }">
          <button class="nav-btn" :class="{ 'nav-btn-filled': isExactActive }" @click="navigate">Archive</button>
        </router-link>
        <button class="nav-btn" @click="store.showAbout = true">About</button>
        <button class="nav-btn nav-btn-filled" @click="store.showHowToPlay = true">How to Play</button>
        <!-- Mobile Menu Toggle -->
        <button class="nav-icon-btn mobile-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen" aria-label="Toggle menu">
          <i class="fa-solid fa-bars" v-if="!isMobileMenuOpen"></i>
          <i class="fa-solid fa-xmark" v-else></i>
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown -->
    <div class="mobile-menu" v-if="isMobileMenuOpen">
      <router-link to="/" custom v-slot="{ navigate, isExactActive }">
        <button class="mobile-nav-btn" :class="{ 'mobile-nav-btn-active': isExactActive }" @click="navigate($event); isMobileMenuOpen = false">Game</button>
      </router-link>
      <router-link to="/archive" custom v-slot="{ navigate, isExactActive }">
        <button class="mobile-nav-btn" :class="{ 'mobile-nav-btn-active': isExactActive }" @click="navigate($event); isMobileMenuOpen = false">Archive</button>
      </router-link>
      <button class="mobile-nav-btn" @click="store.showAbout = true; isMobileMenuOpen = false">About</button>
      <button class="mobile-nav-btn mobile-nav-btn-filled" @click="store.showHowToPlay = true; isMobileMenuOpen = false">How to Play</button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useServantStore } from '../stores/servantStore'
const store = useServantStore()
const isMobileMenuOpen = ref(false)
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

.mobile-toggle {
  display: none;
  font-size: 1.1rem;
}

.mobile-menu {
  display: none;
}

@media (max-width: 600px) {
  .nav-btn {
    display: none;
  }
  .brand-title {
    font-size: 1.15rem;
  }
  .brand-sub {
    font-size: 0.58rem;
    letter-spacing: 0.2px;
  }
  .navbar-inner {
    padding: 0 0.75rem;
  }
  .nav-links {
    gap: 2px;
  }
  .nav-icon-btn {
    width: 32px;
    height: 32px;
  }
  .mobile-toggle {
    display: flex;
  }
  .mobile-menu {
    display: flex;
    flex-direction: column;
    padding: 0.75rem 1rem;
    background: var(--surface-1);
    border-top: 1px solid var(--divider);
    border-bottom: 1px solid var(--divider);
    gap: 4px;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  .mobile-nav-btn {
    width: 100%;
    text-align: left;
    padding: 12px 14px;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-secondary);
    border: none;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.15s, background 0.15s;
  }
  .mobile-nav-btn-active {
    color: var(--primary);
    background: var(--primary-bg);
  }
  .mobile-nav-btn-filled {
    color: var(--primary);
    background: var(--surface-2);
  }
}
</style>
