<template>
  <Transition name="result-popup">
    <div v-if="store.gameOver" class="result-overlay">
      <div class="result-card" :class="store.won ? 'card-win' : 'card-lose'" @click.stop>
        <!-- Win -->
        <template v-if="store.won">
          <iframe src="https://tenor.com/embed/24133758" class="tenor-gif win-gif" frameBorder="0" scrolling="no"></iframe>
          <h2 class="result-title win-title">Grail Obtained!</h2>
          <p class="result-subtitle">You identified the servant</p>
        </template>

        <!-- Lose -->
        <template v-else>
          <iframe src="https://tenor.com/embed/13991160" class="tenor-gif lose-gif" frameBorder="0" scrolling="no"></iframe>
          <h2 class="result-title lose-title">Rayshift Failed</h2>
          <p class="result-subtitle">The servant was…</p>
        </template>

        <!-- Reveal servant -->
        <div class="answer-card" v-if="store.todayAnswer">
          <img
            :src="store.todayAnswer.face"
            :alt="store.todayAnswer.name"
            class="answer-face"
            @error="(e) => ((e.target as HTMLImageElement).style.opacity = '0.1')"
          />
          <div class="answer-info">
            <p class="answer-name">{{ store.todayAnswer.name }}</p>
            <div class="answer-tags">
              <span class="tag class-tag" :class="'np-' + store.todayAnswer.npCard">
                {{ formatClass(store.todayAnswer.className) }}
              </span>
              <span class="tag rarity-tag" v-html="'<i class=\'fa-solid fa-star\'></i>'.repeat(store.todayAnswer.rarity)"></span>
              <span class="tag">{{ store.todayAnswer.attribute }}</span>
            </div>
          </div>
        </div>

        <div class="result-stats">
          <div class="stat">
            <span class="stat-val">{{ store.guesses.length }}</span>
            <span class="stat-label">Guesses used</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-val">{{ store.maxGuesses }}</span>
            <span class="stat-label">Max allowed</span>
          </div>
        </div>

        <template v-if="store.gameMode === 'daily'">
          <div class="daily-actions">
            <div class="share-row">
              <button class="btn-outlined" @click="store.showStats = true">
                <i class="fa-solid fa-chart-bar"></i> Stats
              </button>
              <button class="btn-outlined" @click="saveResult" :disabled="isSharing">
                {{ isSharing ? 'Wait…' : 'Save' }}
              </button>
              <button class="btn-filled" @click="shareResult" :disabled="isSharing" v-if="canShare">
                {{ isSharing ? 'Wait…' : 'Share' }}
              </button>
            </div>

            <p class="next-info">New servant available tomorrow</p>

            <button class="btn-text-muted" @click="store.startNewGame('unlimited')">Switch to Unlimited mode</button>
          </div>
        </template>
        <template v-else>
          <div class="unlimited-actions">
            <button class="btn-outlined" @click="store.showStats = true"><i class="fa-solid fa-chart-bar"></i> Stats</button>
            <button class="btn-filled" @click="store.playAgain()">Play Again</button>
          </div>
        </template>
      </div>
    </div>
  </Transition>

  <!-- Hidden Share Layout -->
  <div v-show="store.gameOver" class="share-export-container" :data-theme="store.theme">
    <div class="share-card-layout" ref="shareRef">
      
      <div class="share-header">
        <img :src="BASE_URL + 'fgo_diamond.webp'" class="share-logo" />
        <div class="share-title-box">
          <h1 class="share-title">FGO<span class="accent">dle</span></h1>
          <p class="share-date">{{ getShareDate() }}</p>
        </div>
      </div>
      
      <div class="share-result-area">
        <h2 :class="store.won ? 'win-text' : 'lose-text'">
          {{ store.won ? 'Grail Obtained!' : 'Rayshift Failed' }}
        </h2>
        <p class="share-tries">
          I guessed the servant in <strong>{{ store.guesses.length }} / {{ store.maxGuesses }}</strong> tries!
        </p>
      </div>

      <div class="share-footer">
        <QrcodeVue value="https://vermilion10.github.io/fgodle/" :size="70" level="M" class="share-qr" />
        <div class="share-meta">
          <p>Can you guess today's servant?</p>
          <span>vermilion10.github.io/fgodle/</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useServantStore } from '../stores/servantStore'
import html2canvas from 'html2canvas'
import QrcodeVue from 'qrcode.vue'

const store = useServantStore()

const shareRef = ref<HTMLElement | null>(null)
const isSharing = ref(false)
const BASE_URL = import.meta.env.BASE_URL
const canShare = !!navigator.share

function formatClass(cls: string): string {
  const map: Record<string, string> = {
    alterEgo: 'Alter Ego',
    moonCancer: 'Moon Cancer',
  }
  return map[cls] ?? cls.charAt(0).toUpperCase() + cls.slice(1)
}

function getShareDate() {
  return new Date().toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

async function generateCanvas() {
  if (!shareRef.value) return null
  isSharing.value = true
  
  await nextTick()
  await new Promise(r => setTimeout(r, 150))

  try {
    const canvas = await html2canvas(shareRef.value, {
      useCORS: true,
      backgroundColor: store.theme === 'dark' ? '#131318' : '#f0ede6',
      scale: 2,
      logging: false,
      ignoreElements: (node) => node.tagName?.toLowerCase() === 'iframe'
    })
    return canvas.toDataURL('image/png')
  } catch (e) {
    console.error('Error generating image', e)
    return null
  } finally {
    isSharing.value = false
  }
}

async function saveResult() {
  const dataUrl = await generateCanvas()
  if (dataUrl) downloadImage(dataUrl)
}

async function shareResult() {
  const dataUrl = await generateCanvas()
  if (!dataUrl) return
    
  if (navigator.share) {
    try {
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], `fgodle-${new Date().getTime()}.png`, { type: 'image/png' })
      await navigator.share({
        title: 'My FGOdle Result',
        files: [file]
      })
    } catch (err) {
      downloadImage(dataUrl)
    }
  } else {
    downloadImage(dataUrl)
  }
}

function downloadImage(dataUrl: string) {
  const link = document.createElement('a')
  link.download = `fgodle-${new Date().toISOString().split('T')[0]}.png`
  link.href = dataUrl
  link.click()
}
</script>

<style scoped>
.result-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 18, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.result-card {
  background: var(--surface-2, #26263a);
  border-radius: var(--radius-lg);
  padding: 2rem 1.75rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  border: 1px solid var(--border-medium);
  box-shadow: var(--shadow-3);
  animation: popIn 0.4s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.card-win {
  border-top: 2px solid var(--primary);
}

.card-lose {
  border-top: 2px solid var(--danger, #9b3636);
}

.tenor-gif {
  width: 130px;
  max-width: 100%;
  margin: 0 auto 0.75rem;
  border-radius: var(--radius-sm);
  display: block;
}

.win-gif  { aspect-ratio: 1; height: 130px; }
.lose-gif { aspect-ratio: 0.984; height: 132px; }

.result-title {
  font-family: var(--font-title);
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 0.2rem;
}

.win-title  { color: var(--primary); }
.lose-title { color: var(--text-secondary); }

.result-subtitle {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
}

/* Answer card */
.answer-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--surface-1);
  border: 1px solid var(--divider);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  margin-bottom: 1.25rem;
  text-align: left;
}

.answer-face {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
}

.answer-info { flex: 1; }

.answer-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.answer-tags {
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

/* Stats */
.result-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.25rem;
  padding: 1rem 0;
  border-top: 1px solid var(--divider);
  border-bottom: 1px solid var(--divider);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.stat-val {
  font-family: var(--font-title);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 0;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--divider);
}

.daily-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.unlimited-actions {
  display: flex;
  gap: 8px;
  width: 100%;
  margin-top: 0.25rem;
}

.share-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

/* M3-style buttons */
.btn-filled {
  flex: 1;
  padding: 10px 16px;
  background: var(--primary);
  color: var(--on-primary);
  border: none;
  border-radius: var(--radius-xl);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-filled:hover:not(:disabled) { opacity: 0.88; }
.btn-filled:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-outlined {
  flex: 1;
  padding: 10px 16px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-xl);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.btn-outlined:hover:not(:disabled) {
  background: var(--surface-3);
  color: var(--text-primary);
}

.btn-outlined:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-text-muted {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.8rem;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.15s;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: transparent;
}

.btn-text-muted:hover {
  color: var(--text-secondary);
  text-decoration-color: var(--text-muted);
}

.next-info {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.btn-play-again {
  width: 100%;
  margin-top: 0.25rem;
}

/* Transition */
.result-popup-enter-active { animation: popIn 0.35s ease; }
.result-popup-leave-active { transition: opacity 0.18s ease; }
.result-popup-leave-to    { opacity: 0; }

/* Hidden Share Template */
.share-export-container {
  position: absolute;
  top: -9999px;
  left: -9999px;
  pointer-events: none;
}

.share-card-layout {
  background: var(--surface-1);
  border: 1px solid var(--border-medium);
  border-radius: 16px;
  padding: 2.5rem;
  width: 500px;
  color: var(--text-primary);
}

.share-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-medium);
}

.share-logo { width: 44px; height: 44px; }

.share-title-box h1 {
  font-family: var(--font-title);
  font-size: 2rem;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: 1px;
}

.share-title-box .accent { color: var(--primary); }

.share-date { font-size: 0.85rem; color: var(--text-muted); }

.share-result-area {
  text-align: center;
  margin-bottom: 2.5rem;
}

.win-text {
  font-family: var(--font-title);
  color: var(--primary);
  font-size: 1.8rem;
}

.lose-text {
  font-family: var(--font-title);
  color: var(--danger);
  font-size: 1.8rem;
}

.share-tries {
  font-size: 1rem;
  margin-top: 0.5rem;
  color: var(--text-secondary);
}

.share-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  background: var(--surface-2);
  padding: 1.25rem;
  border-radius: 12px;
}

.share-qr { border: 3px solid var(--surface-3); border-radius: 4px; }

.share-meta p { color: var(--primary); font-weight: 600; font-size: 0.95rem; margin-bottom: 0.2rem; }
.share-meta span { color: var(--text-muted); font-size: 0.82rem; }
</style>
