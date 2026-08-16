<template>
  <div class="search-wrapper">

    <!-- Class filter chips -->
    <div class="chip-bar" v-if="!store.gameOver">
      <button
        v-for="cls in classes"
        :key="cls.value ?? 'all'"
        class="chip"
        :class="{ active: store.classFilter === cls.value }"
        @click="setFilter(cls.value)"
      >
        {{ cls.label }}
      </button>
    </div>

    <!-- Search box -->
    <div class="search-box" :class="{ disabled: store.gameOver }">
      <svg class="search-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        v-if="!store.gameOver"
        id="servant-search"
        v-model="store.searchQuery"
        type="text"
        :placeholder="searchPlaceholder"
        autocomplete="off"
        @keydown.escape="store.searchQuery = ''"
      />
      <div v-else class="search-disabled-text">
        {{ store.won ? '<i class="fa-solid fa-wand-magic-sparkles"></i> Correct!' : '<i class="fa-solid fa-skull"></i> Game Over' }}
      </div>
    </div>

    <!-- Dropdown suggestions -->
    <Transition name="dropdown">
      <div v-if="store.filteredServants.length > 0 && !store.gameOver" class="suggestions">
        <div
          v-for="servant in store.filteredServants"
          :key="servant.id"
          class="suggestion-item"
          @click="onSelect(servant)"
        >
          <img :src="servant.face" :alt="servant.name" class="suggestion-face" loading="lazy"
               @error="handleImgError" />
          <div class="suggestion-info">
            <span class="suggestion-name">{{ servant.name }}</span>
            <div class="suggestion-tags">
              <span class="tag class-tag" :class="'np-' + servant.npCard">
                {{ formatClass(servant.className) }}
              </span>
              <span class="tag rarity-tag" v-html="'<i class=\'fa-solid fa-star\'></i>'.repeat(servant.rarity)"></span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useServantStore } from '../stores/servantStore'
import type { SlimServant } from '../types/servant'

const store = useServantStore()

// All available classes as chips
const classes = [
  { label: 'All',        value: null },
  { label: 'Saber',      value: 'saber' },
  { label: 'Archer',     value: 'archer' },
  { label: 'Lancer',     value: 'lancer' },
  { label: 'Rider',      value: 'rider' },
  { label: 'Caster',     value: 'caster' },
  { label: 'Assassin',   value: 'assassin' },
  { label: 'Berserker',  value: 'berserker' },
  { label: 'Ruler',      value: 'ruler' },
  { label: 'Avenger',    value: 'avenger' },
  { label: 'Foreigner',  value: 'foreigner' },
  { label: 'Pretender',  value: 'pretender' },
  { label: 'Alter Ego',  value: 'alterEgo' },
  { label: 'Moon Cancer',value: 'moonCancer' },
  { label: 'Shielder',   value: 'shielder' },
]

function setFilter(val: string | null) {
  store.classFilter = store.classFilter === val ? null : val
}

const searchPlaceholder = computed(() => {
  const cls = classes.find(c => c.value === store.classFilter)
  return cls && cls.value ? `Search ${cls.label} servant…` : 'Search a servant name…'
})

function onSelect(servant: SlimServant) {
  store.submitGuess(servant)
}

function formatClass(cls: string): string {
  return cls.charAt(0).toUpperCase() + cls.slice(1)
}

function handleImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.opacity = '0.3'
}
</script>

<style scoped>
.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

/* ─── Chip bar ──────────────────────────────────────────────────────────────── */
.chip-bar {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}
.chip-bar::-webkit-scrollbar { display: none; }

.chip {
  flex-shrink: 0;
  padding: 5px 12px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-medium);
  background: transparent;
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.chip:hover {
  border-color: var(--primary-dim);
  color: var(--text-secondary);
  background: var(--border-subtle);
}
.chip.active {
  background: var(--primary-bg);
  color: var(--primary);
  border-color: var(--primary-dim);
}

/* ─── Search box ────────────────────────────────────────────────────────────── */
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--surface-2, #262630);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  transition: background 0.15s;
  border: 1px solid var(--border-medium);
}

.search-box:not(.disabled):focus-within {
  background: var(--surface-3);
  border-color: var(--primary);
}

.search-box.disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.search-icon-svg {
  flex-shrink: 0;
  color: var(--text-muted);
}

input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  caret-color: var(--primary);
}
input::placeholder { color: var(--text-muted); }

.search-disabled-text {
  flex: 1;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* ─── Dropdown ───────────────────────────────────────────────────────────────── */
.suggestions {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--surface-3);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-3);
  z-index: 50;
  overflow: hidden;
  max-height: 360px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.1s;
}
.suggestion-item + .suggestion-item { border-top: 1px solid var(--divider); }
.suggestion-item:hover { background: var(--surface-4); }

.suggestion-face {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  background: var(--surface-1);
  flex-shrink: 0;
}

.suggestion-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.suggestion-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

.suggestion-tags { display: flex; gap: 6px; }

.tag {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: var(--radius-xs);
  background: var(--surface-1);
  color: var(--text-muted);
}

.rarity-tag { color: var(--primary); }

.np-buster { background: rgba(220,53,69,.15); color: #e87676; }
.np-arts   { background: rgba(70,130,220,.15); color: #82b8f5; }
.np-quick  { background: rgba(60,160,80,.15); color: #82c896; }

/* Transition */
.dropdown-enter-active, .dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
