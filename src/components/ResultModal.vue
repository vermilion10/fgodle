<template>
  <Transition name="result-popup">
    <div v-if="store.gameOver" class="result-overlay">
      <div class="result-card" :class="store.won ? 'card-win' : 'card-lose'">
        <!-- Win -->
        <template v-if="store.won">
          <iframe src="https://tenor.com/embed/24133758" class="tenor-gif win-gif" frameBorder="0" scrolling="no"></iframe>
          <h2 class="result-title win-title">Grail Obtained!</h2>
          <p class="result-subtitle">You identified the servant!</p>
        </template>

        <!-- Lose -->
        <template v-else>
          <iframe src="https://tenor.com/embed/13991160" class="tenor-gif lose-gif" frameBorder="0" scrolling="no"></iframe>
          <h2 class="result-title lose-title">Rayshift Failed</h2>
          <p class="result-subtitle">The servant was...</p>
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
              <span class="tag rarity-tag">{{ '★'.repeat(store.todayAnswer.rarity) }}</span>
              <span class="tag">{{ store.todayAnswer.attribute }}</span>
            </div>
          </div>
        </div>

        <div class="result-stats">
          <div class="stat">
            <span class="stat-val">{{ store.guesses.length }}</span>
            <span class="stat-label">Guesses</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-val">{{ store.maxGuesses }}</span>
            <span class="stat-label">Max Guesses</span>
          </div>
        </div>

        <template v-if="store.gameMode === 'daily'">
          <div class="daily-actions">
            <!-- Share options row -->
            <div class="share-row">
              <button class="btn-action action-save" @click="saveResult" :disabled="isSharing">
                <span v-if="isSharing">Wait...</span>
                <span v-else>Save</span>
              </button>
              <button class="btn-action action-share" @click="shareResult" :disabled="isSharing" v-if="canShare">
                <span v-if="isSharing">Wait...</span>
                <span v-else>Share</span>
              </button>
            </div>

            <p class="next-info">🕐 New servant available tomorrow!</p>

            <div class="switch-mode-box">
               <button class="btn-switch-mode" @click="store.startNewGame('unlimited')">Switch to Unlimited Mode ↻</button>
            </div>
          </div>
        </template>
        <template v-else>
          <button class="btn-play-again" @click="store.playAgain()">Play Again ↻</button>
        </template>
      </div>
    </div>
  </Transition>

  <!-- Hidden Share Layout -->
  <div v-show="store.gameOver" class="share-export-container">
    <div class="share-card-layout" ref="shareRef">
      
      <div class="share-header">
        <img :src="BASE_URL + 'fgo_diamond.webp'" class="share-logo" crossorigin="anonymous" />
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

// References & sharing state
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
      backgroundColor: '#0a0a12',
      scale: 2,
      logging: false
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
  background: rgba(5, 5, 15, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.result-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 2.5rem 2rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-win {
  border-color: var(--gold);
  box-shadow: var(--shadow-gold), var(--shadow-card);
}

.card-lose {
  border-color: var(--red);
}

.tenor-gif {
  width: 140px;
  max-width: 100%;
  margin: 0 auto 0.5rem;
  border-radius: var(--radius-sm);
  display: block;
}

.win-gif { aspect-ratio: 1; height: 140px; }
.lose-gif { aspect-ratio: 0.984; height: 142px; }

.result-title {
  font-family: var(--font-title);
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 0.3rem;
}

.win-title { color: var(--gold); }
.lose-title { color: var(--text-secondary); }

.result-subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

/* Answer card */
.answer-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 14px;
  margin-bottom: 1.5rem;
  text-align: left;
}

.answer-face {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--gold);
  flex-shrink: 0;
}

.answer-info {
  flex: 1;
}

.answer-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
  font-family: var(--font-title);
}

.answer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 20px;
  background: var(--wrong);
  color: var(--text-secondary);
  border: 1px solid var(--wrong-border);
}

.rarity-tag {
  color: var(--gold);
  border-color: rgba(201,168,76,0.4);
}

/* NP Card colors */
.np-buster { background: rgba(220, 53, 69, 0.2); color: #ff5252; border-color: rgba(255, 82, 82, 0.4); }
.np-arts   { background: rgba(13, 110, 253, 0.2); color: #64b5f6; border-color: rgba(100, 181, 246, 0.4); }
.np-quick  { background: rgba(25, 135, 84, 0.2); color: #81c784; border-color: rgba(129, 199, 132, 0.4); }

/* Stats */
.result-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.25rem;
  padding: 1rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-val {
  font-family: var(--font-title);
  font-size: 2rem;
  font-weight: 700;
  color: var(--gold);
  line-height: 1;
}

.stat-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border);
}

.daily-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.share-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.btn-action {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-title);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-save {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.action-save:hover:not(:disabled) {
  border-color: var(--gold);
  color: var(--gold);
}

.action-share {
  background: var(--gold);
  color: #1a1000;
}

.action-share:hover:not(:disabled) {
  background: var(--gold-light);
  box-shadow: 0 0 12px rgba(201, 168, 76, 0.4);
}

.btn-action:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.next-info {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.switch-mode-box {
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  width: 100%;
}

.btn-switch-mode {
  width: 100%;
  padding: 10px;
  background: transparent;
  color: var(--gold);
  border: 1px dashed var(--gold);
  border-radius: var(--radius-sm);
  font-family: var(--font-title);
  font-size: 0.85rem;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.2s;
  text-transform: uppercase;
}

.btn-switch-mode:hover {
  background: rgba(201, 168, 76, 0.1);
}


.btn-play-again {
  padding: 10px 24px;
  background: var(--gold);
  color: #1a1000;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-title);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.btn-play-again:hover {
  background: var(--gold-light);
  box-shadow: var(--shadow-gold);
}

/* Transition */
.result-popup-enter-active { animation: popIn 0.4s ease; }
.result-popup-leave-active { transition: opacity 0.2s ease; }
.result-popup-leave-to { opacity: 0; }

/* Hidden Share Template Styles */
.share-export-container {
  position: absolute;
  top: -9999px;
  left: -9999px;
  pointer-events: none;
}

.share-card-layout {
  background: #0a0a12;
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  width: 500px;
  color: #e0e0e0;
}

.share-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.share-logo {
  width: 48px;
  height: 48px;
}

.share-title-box h1 {
  font-family: var(--font-title);
  font-size: 2.2rem;
  color: #ffffff;
  margin: 0;
  letter-spacing: 2px;
}

.share-title-box .accent {
  color: var(--gold);
}

.share-date {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.share-result-area {
  text-align: center;
  margin-bottom: 2.5rem;
}

.win-text {
  font-family: var(--font-title);
  color: var(--gold);
  font-size: 2rem;
}

.lose-text {
  font-family: var(--font-title);
  color: var(--red);
  font-size: 2rem;
}

.share-tries {
  font-size: 1.1rem;
  margin-top: 0.5rem;
  color: var(--text-secondary);
}

.share-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  background: var(--bg-card);
  padding: 1.25rem;
  border-radius: var(--radius-md);
}

.share-qr {
  border: 4px solid #fff;
  border-radius: 4px;
}

.share-meta p {
  color: var(--gold);
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.2rem;
}

.share-meta span {
  color: var(--text-muted);
  font-size: 0.85rem;
}
</style>
