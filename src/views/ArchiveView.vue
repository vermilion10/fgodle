<template>
  <main class="page-container archive-page">
    <div class="archive-header">
      <h1 class="page-title">Servant Archive</h1>
      <p class="page-subtitle">Database of all available servants</p>
    </div>

    <!-- Search / Filter -->
    <div class="archive-controls">
      <div class="search-box">
        <i class="fa-solid fa-search search-icon"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search by name, class..." 
          class="search-input"
        />
      </div>
    </div>

    <div class="servant-grid">
      <div 
        v-for="servant in filteredServants" 
        :key="servant.id" 
        class="servant-card"
      >
        <img 
          :src="getProxiedUrl(servant.face)" 
          :alt="servant.name" 
          class="servant-img"
          loading="lazy"
          @error="handleImgError"
        />
        <div class="servant-details">
          <h3 class="servant-name">{{ servant.name }}</h3>
          <div class="servant-tags">
            <span class="tag class-tag" :class="'np-' + servant.npCard">
              {{ formatClass(servant.className) }}
            </span>
            <span class="tag rarity-tag" v-html="'<i class=\'fa-solid fa-star\'></i>'.repeat(servant.rarity)"></span>
            <span class="tag">{{ servant.attribute }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="filteredServants.length === 0" class="no-results">
      No servants found.
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useServantStore } from '../stores/servantStore'

const store = useServantStore()
const searchQuery = ref('')

function normalizeString(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
}

const filteredServants = computed(() => {
  const q = normalizeString(searchQuery.value)
  if (!q) return store.allServants
  return store.allServants.filter(s => {
    if (normalizeString(s.name).includes(q)) return true
    if (normalizeString(s.className).includes(q)) return true
    if (s.aliases.some(a => normalizeString(a).includes(q))) return true
    return false
  })
})

function formatClass(cls: string): string {
  const map: Record<string, string> = {
    alterEgo: 'Alter Ego',
    moonCancer: 'Moon Cancer',
  }
  return map[cls] ?? cls.charAt(0).toUpperCase() + cls.slice(1)
}

function getProxiedUrl(url: string) {
  // Use wsrv.nl to proxy and resize image to 80px width
  const cleanUrl = url.replace(/^https?:\/\//, '')
  return `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}&w=80&q=75&output=webp`
}

function handleImgError(e: Event) {
  (e.target as HTMLImageElement).style.opacity = '0.1'
}
</script>

<style scoped>
.archive-page {
  display: flex;
  flex-direction: column;
  padding-bottom: 3rem;
}

.archive-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-family: var(--font-title);
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.page-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.archive-controls {
  max-width: 600px;
  margin: 0 auto 2rem;
  width: 100%;
}

.search-box {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  background: var(--surface-2);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  padding: 12px 16px 12px 38px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 1rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary-bg);
}

.servant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  width: 100%;
}

.servant-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--surface-1);
  border: 1px solid var(--divider);
  border-radius: var(--radius-md);
  padding: 12px;
  transition: transform 0.15s, border-color 0.15s;
}

.servant-card:hover {
  border-color: var(--border-medium);
  transform: translateY(-2px);
}

.servant-img {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
  background: var(--surface-2);
}

.servant-details {
  flex: 1;
  min-width: 0;
}

.servant-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.servant-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 0.68rem;
  padding: 2px 8px;
  border-radius: var(--radius-xs);
  background: var(--surface-3);
  color: var(--text-muted);
}

.rarity-tag { color: var(--primary); }
.np-buster { background: rgba(220,53,69,.15); color: #e87676; }
.np-arts   { background: rgba(70,130,220,.15); color: #82b8f5; }
.np-quick  { background: rgba(60,160,80,.15); color: #82c896; }

.no-results {
  text-align: center;
  color: var(--text-muted);
  padding: 3rem 0;
  font-size: 1.1rem;
}
</style>
