import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SlimServant, GuessRow, GuessResult } from '../types/servant'

// Load from preprocessed local JSON
const SERVANTS_URL = import.meta.env.BASE_URL + 'fgo-servants.json'

function compareGuess(guessed: SlimServant, answer: SlimServant): GuessRow['results'] {
  const rarityDiff = Math.abs(guessed.rarity - answer.rarity)

  function check(a: unknown, b: unknown, partial?: () => GuessResult): GuessResult {
    if (a === b) return 'correct'
    return partial ? partial() : 'wrong'
  }

  return {
    name: { value: guessed.name, result: check(guessed.name, answer.name) },
    className: { value: guessed.className, result: check(guessed.className, answer.className) },
    rarity: {
      value: guessed.rarity,
      result: guessed.rarity === answer.rarity
        ? 'correct'
        : rarityDiff === 1 ? 'partial' : 'wrong',
    },
    attribute: { value: guessed.attribute, result: check(guessed.attribute, answer.attribute) },
    gender: { value: guessed.gender, result: check(guessed.gender, answer.gender) },
    alignment: { value: guessed.alignment, result: check(guessed.alignment, answer.alignment) },
    npCard: { value: guessed.npCard, result: check(guessed.npCard, answer.npCard) },
    npTarget: { value: guessed.npTarget, result: check(guessed.npTarget, answer.npTarget) },
  }
}

export const useServantStore = defineStore('servant', () => {
  const allServants = ref<SlimServant[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const todayAnswer = ref<SlimServant | null>(null)
  const guesses = ref<GuessRow[]>([])
  const gameOver = ref(false)
  const won = ref(false)
  const maxGuesses = 8

  type GameMode = 'daily' | 'unlimited'
  const gameMode = ref<GameMode>('daily')

  const searchQuery = ref('')

  // Search: match name, aliases, or className prefix
  const filteredServants = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return []
    const guessedIds = new Set(guesses.value.map(g => g.servant.id))
    return allServants.value
      .filter(s => {
        if (guessedIds.has(s.id)) return false
        if (s.name.toLowerCase().includes(q)) return true
        if (s.className.toLowerCase().includes(q)) return true
        if (s.aliases.some(a => a.toLowerCase().includes(q))) return true
        return false
      })
      .slice(0, 12)
  })

  async function fetchServants() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(SERVANTS_URL)
      if (!res.ok) throw new Error(`Failed to load servant data (${res.status})`)
      const data: SlimServant[] = await res.json()
      allServants.value = data
      startNewGame()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  function getDateString() {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  }

  function startNewGame(mode?: GameMode) {
    if (mode) {
      gameMode.value = mode
    }
    
    guesses.value = []
    gameOver.value = false
    won.value = false

    if (gameMode.value === 'daily') {
      const dateStr = getDateString()

      // Load saved state first
      const saved = localStorage.getItem('fgo-wordle-state')
      if (saved) {
        try {
          const state = JSON.parse(saved)
          if (state.date === dateStr) {
            // Restore answer from servant list (avoid stale serialized data)
            const savedAnswer = allServants.value.find(s => s.id === state.answerId)
            if (savedAnswer) {
              todayAnswer.value = savedAnswer
              guesses.value = state.guesses
              gameOver.value = state.gameOver
              won.value = state.won
              return
            }
          }
        } catch { /* ignore */ }
      }

      // Use integer date seed for consistent daily answer
      const [y, m, d] = dateStr.split('-').map(Number)
      const seed = y * 10000 + m * 100 + d
      const idx = seed % allServants.value.length
      todayAnswer.value = allServants.value[idx]
    } else {
      // Unlimited mode
      const idx = Math.floor(Math.random() * allServants.value.length)
      todayAnswer.value = allServants.value[idx]
    }
  }

  function playAgain() {
    startNewGame('unlimited')
  }

  function submitGuess(servant: SlimServant) {
    if (gameOver.value || !todayAnswer.value) return
    if (guesses.value.some(g => g.servant.id === servant.id)) return

    const results = compareGuess(servant, todayAnswer.value)
    guesses.value.push({ servant, results })
    searchQuery.value = ''

    if (servant.id === todayAnswer.value.id) {
      won.value = true
      gameOver.value = true
    } else if (guesses.value.length >= maxGuesses) {
      gameOver.value = true
    }

    if (gameMode.value === 'daily') {
      saveState()
    }
  }

  function saveState() {
    localStorage.setItem('fgo-wordle-state', JSON.stringify({
      date: getDateString(),
      answerId: todayAnswer.value?.id,
      guesses: guesses.value,
      gameOver: gameOver.value,
      won: won.value,
    }))
  }

  return {
    allServants,
    loading,
    error,
    todayAnswer,
    guesses,
    gameOver,
    won,
    maxGuesses,
    gameMode,
    searchQuery,
    filteredServants,
    fetchServants,
    submitGuess,
    startNewGame,
    playAgain,
  }
})
