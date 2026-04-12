<template>
  <div class="search-wrapper">
    <div class="search-box" :class="{ disabled: store.gameOver }">
      <span class="search-icon">🔍</span>
      <input
        v-if="!store.gameOver"
        id="servant-search"
        v-model="store.searchQuery"
        type="text"
        placeholder="Start typing a servant name..."
        autocomplete="off"
        @keydown.escape="store.searchQuery = ''"
      />
      <div v-else class="search-disabled-text">
        {{ store.won ? '✨ Congratulations!' : '💀 Game Over' }}
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
              <span class="tag">{{ '★'.repeat(servant.rarity) }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useServantStore } from '../stores/servantStore'
import type { SlimServant } from '../types/servant'

const store = useServantStore()

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
  max-width: 620px;
  margin: 0 auto;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border-hover);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-gold);
}

.search-box:not(.disabled):focus-within {
  border-color: var(--gold);
  background: var(--bg-card-hover);
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.15), var(--shadow-gold);
}

.search-box.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  border-color: var(--wrong-border);
}

.search-icon {
  font-size: 1rem;
  flex-shrink: 0;
}


input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 1rem;
  caret-color: var(--gold);
}

input::placeholder { color: var(--text-muted); }

.search-disabled-text {
  flex: 1;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

/* Dropdown */
.suggestions {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-hover);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card), var(--shadow-gold);
  z-index: 50;
  overflow: hidden;
  max-height: 380px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s ease;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.suggestion-item:last-child { border-bottom: none; }

.suggestion-item:hover {
  background: var(--bg-card-hover);
}

.suggestion-face {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border);
  background: var(--wrong);
  flex-shrink: 0;
}

.suggestion-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.suggestion-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
}

.suggestion-tags {
  display: flex;
  gap: 6px;
}

.tag {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 20px;
  background: var(--wrong);
  color: var(--text-secondary);
  border: 1px solid var(--wrong-border);
  letter-spacing: 0.5px;
}

/* NP Card colors */
.np-buster { background: rgba(220, 53, 69, 0.2); color: #ff5252; border-color: rgba(255, 82, 82, 0.4); }
.np-arts   { background: rgba(13, 110, 253, 0.2); color: #64b5f6; border-color: rgba(100, 181, 246, 0.4); }
.np-quick  { background: rgba(25, 135, 84, 0.2); color: #81c784; border-color: rgba(129, 199, 132, 0.4); }

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
