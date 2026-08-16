<template>
  <div class="guess-grid">
    <!-- Header row -->
    <div class="grid-row header-row">
      <div class="cell cell-servant">Servant</div>
      <div class="cell">Class</div>
      <div class="cell">Rarity</div>
      <div class="cell">Gender</div>
      <div class="cell">NP Card</div>
      <div class="cell">NP Target</div>
      <div class="cell">Attribute</div>
      <div class="cell">Alignment</div>
    </div>

    <template v-for="visualIdx in maxVisualRows" :key="visualIdx - 1">
      <div
        class="grid-row"
        :class="rowClasses(visualIdx - 1)"
      >
        <!-- ── FILLED GUESS ROW ── -->
        <template v-if="store.guesses[visualIdx - 1]">
          <div class="cell cell-servant">
            <img
              :src="store.guesses[visualIdx - 1].servant.face"
              :alt="store.guesses[visualIdx - 1].servant.name"
              class="servant-face" loading="lazy"
              @error="(e) => ((e.target as HTMLImageElement).style.opacity = '0.2')"
            />
            <span class="servant-name">{{ store.guesses[visualIdx - 1].servant.name }}</span>
          </div>
          <div v-for="(col, ci) in columnDefs" :key="col.key"
            class="cell"
            :class="[resultClass(getResult(visualIdx - 1, col.key)), isRevealing(visualIdx - 1) ? 'flip' : '']"
            :style="{ '--flip-delay': (ci * 110) + 'ms' }"
          >
            <component :is="'span'" v-bind="getCellBadgeAttrs(visualIdx - 1, col.key)" class="cell-value" v-html="getCellText(visualIdx - 1, col.key)">
              
            </component>
            <span v-if="col.key === 'rarity' && getResult(visualIdx - 1, col.key) === 'partial'" class="hint-arrow">
              {{ Number(store.guesses[visualIdx - 1].results.rarity.value) < (store.todayAnswer?.rarity ?? 0) ? '▲' : '▼' }}
            </span>
            <span class="result-icon" v-html="resultIcon(getResult(visualIdx - 1, col.key))"></span>
          </div>
        </template>

        <!-- ── PLACEHOLDER / HINT ROW ── -->
        <template v-else>
          <div class="cell cell-servant" :class="isHintRow(visualIdx - 1) ? 'hint-label-cell' : ''">
            <template v-if="isHintRow(visualIdx - 1)">
              <span class="hint-row-icon"><i class="fa-solid fa-lightbulb"></i></span>
              <div class="hint-label-text">
                <div class="hint-row-title">Hint Row</div>
                <div class="hint-row-sub" v-if="isHintActive(visualIdx - 1)">
                  Reveal up to {{ hintMaxReveal(visualIdx - 1) }} cell{{ hintMaxReveal(visualIdx - 1) > 1 ? 's' : '' }}
                </div>
                <div class="hint-row-sub" v-else-if="hintUsed(visualIdx - 1)">Used <i class="fa-solid fa-check"></i></div>
                <div class="hint-row-sub" v-else>Locked</div>
              </div>
            </template>
            <template v-else>
              <div class="servant-face-placeholder"></div>
              <span class="placeholder-text">-</span>
            </template>
          </div>

          <!-- Hint cells (hint row) -->
          <template v-if="isHintRow(visualIdx - 1)">
            <div
              v-for="col in columnDefs"
              :key="col.key"
              class="cell hint-cell"
              :class="hintCellClass(visualIdx - 1, col.key as any)"
              @click="handleHintClick(visualIdx - 1, col.key as any)"
            >
              <template v-if="isHintRevealed(visualIdx - 1, col.key as any) && store.todayAnswer">
                <component :is="'span'" v-bind="getAnswerCellAttrs(col.key)" class="cell-value" v-html="getAnswerText(col.key)">
                  
                </component>
                <span class="hint-check"><i class="fa-solid fa-check"></i></span>
              </template>
              <template v-else>
                <span class="hint-dot"></span>
              </template>
            </div>
          </template>

          <!-- Normal empty cells -->
          <template v-else>
            <div v-for="col in columnDefs" :key="col.key" class="cell empty-cell">
              <span class="placeholder-dash">-</span>
            </div>
          </template>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useServantStore, HINT_ROW_CONFIG } from '../stores/servantStore'
import type { GuessResult, HintableColumn } from '../types/servant'

const store = useServantStore()
const maxVisualRows = computed(() => store.maxGuesses)

const columnDefs = [
  { key: 'className'  },
  { key: 'rarity'    },
  { key: 'gender'    },
  { key: 'npCard'    },
  { key: 'npTarget'  },
  { key: 'attribute' },
  { key: 'alignment' },
]

// ─── Hint row helpers ─────────────────────────────────────────────────────────
function isHintRow(idx: number) {
  return store.gameMode === 'daily' && HINT_ROW_CONFIG.some(c => c.rowIdx === idx)
}

function getHintConfig(idx: number) {
  return HINT_ROW_CONFIG.find(c => c.rowIdx === idx) ?? null
}

function isHintActive(idx: number) {
  return store.activeHintRowIdx === idx
}

function hintUsed(idx: number) {
  const set = store.revealedHints.get(idx)
  return !!set && set.size > 0
}

function hintMaxReveal(idx: number) {
  return getHintConfig(idx)?.maxReveal ?? 0
}

function isHintRevealed(idx: number, col: HintableColumn) {
  return store.revealedHints.get(idx)?.has(col) ?? false
}

function hintCellClass(idx: number, col: HintableColumn) {
  const revealed = isHintRevealed(idx, col)
  const active = isHintActive(idx)
  const canReveal = active && !revealed && !hintMaxReached(idx)
  const spent = hintUsed(idx) && !revealed
  return {
    'hint-revealed': revealed,
    'hint-clickable': canReveal,
    'hint-spent': spent,
    'hint-locked': !active && !revealed,
  }
}

function hintMaxReached(idx: number) {
  const cfg = getHintConfig(idx)
  if (!cfg) return true
  return (store.revealedHints.get(idx)?.size ?? 0) >= cfg.maxReveal
}

function handleHintClick(idx: number, col: HintableColumn) {
  if (!isHintActive(idx)) return
  if (hintMaxReached(idx)) return
  store.revealHint(idx, col)
}

// ─── Row class computation ────────────────────────────────────────────────────
function rowClasses(idx: number) {
  const filled = !!store.guesses[idx]
  const hintRow = isHintRow(idx)
  const hintActive = isHintActive(idx)
  const used = hintUsed(idx)

  return {
    'guess-row': !hintRow,
    'hint-row': hintRow,
    'hint-row-locked': hintRow && !filled && !hintActive,
    'hint-row-active': hintRow && !filled && hintActive,
    'hint-row-used': hintRow && !filled && used && !hintActive,
    'is-revealing': !hintRow && store.revealingRowId === store.guesses[idx]?.servant.id,
  }
}

function isRevealing(idx: number) {
  return store.revealingRowId === store.guesses[idx]?.servant.id
}

// ─── Result helpers ───────────────────────────────────────────────────────────
function getResult(idx: number, key: string): GuessResult {
  const row = store.guesses[idx]
  if (!row) return 'wrong'
  return (row.results as any)[key]?.result ?? 'wrong'
}

function resultClass(result: GuessResult) {
  return {
    'cell-correct': result === 'correct',
    'cell-partial': result === 'partial',
    'cell-wrong':   result === 'wrong',
  }
}

function resultIcon(result: GuessResult) {
  return result === 'correct' ? '<i class="fa-solid fa-check"></i>' : result === 'partial' ? '~' : '<i class="fa-solid fa-xmark"></i>'
}

// ─── Cell content helpers ─────────────────────────────────────────────────────
function getCellText(idx: number, key: string): string {
  const row = store.guesses[idx]
  if (!row) return ''
  const val = String((row.results as any)[key]?.value ?? '')
  return formatValue(key, val)
}

function getCellBadgeAttrs(idx: number, key: string) {
  const row = store.guesses[idx]
  if (!row) return {}
  const val = String((row.results as any)[key]?.value ?? '')
  return getBadgeAttrs(key, val)
}

function getAnswerText(key: string): string {
  const a = store.todayAnswer
  if (!a) return ''
  const map: Record<string, string> = {
    className: a.className,
    rarity:    String(a.rarity),
    gender:    a.gender,
    npCard:    a.npCard,
    npTarget:  a.npTarget,
    attribute: a.attribute,
    alignment: a.alignment,
  }
  return formatValue(key, map[key] ?? '')
}

function getAnswerCellAttrs(key: string) {
  const a = store.todayAnswer
  if (!a) return {}
  const map: Record<string, string> = {
    className: a.className,
    rarity:    String(a.rarity),
    gender:    a.gender,
    npCard:    a.npCard,
    npTarget:  a.npTarget,
    attribute: a.attribute,
    alignment: a.alignment,
  }
  return getBadgeAttrs(key, map[key] ?? '')
}

function getBadgeAttrs(key: string, val: string): Record<string, string> {
  if (key === 'className') return { class: `class-badge np-${val}` }
  if (key === 'npCard')    return { class: `np-badge np-${val}` }
  if (key === 'attribute') return { class: `attr-badge attr-${val}` }
  if (key === 'rarity')    return { class: 'rarity-stars' }
  if (key === 'gender')    return { class: 'gender-icon' }
  if (key === 'npTarget')  return { class: 'np-tar-text' }
  if (key === 'alignment') return { class: 'align-text' }
  return {}
}

function formatValue(key: string, val: string): string {
  if (key === 'rarity')    return '<i class="fa-solid fa-star"></i>'.repeat(Number(val))
  if (key === 'className') return formatClass(val)
  if (key === 'attribute') return formatAttr(val)
  if (key === 'gender')    return formatGender(val)
  if (key === 'npCard')    return val.charAt(0).toUpperCase() + val.slice(1)
  if (key === 'npTarget')  return ({ aoe: 'AoE', single: 'Single', support: 'Support' } as any)[val] ?? val
  return val
}

function formatClass(cls: string): string {
  return ({ alterEgo: 'Alter Ego', moonCancer: 'Moon Cancer', loreGrandCaster: 'Grand Caster' } as any)[cls]
    ?? cls.charAt(0).toUpperCase() + cls.slice(1)
}

function formatAttr(attr: string): string {
  return ({ sky: '<i class="fa-solid fa-sun"></i> Sky', earth: '<i class="fa-solid fa-leaf"></i> Earth', human: '<i class="fa-solid fa-user"></i> Human', star: '<i class="fa-solid fa-star"></i> Star', beast: '<i class="fa-solid fa-fire"></i> Beast' } as any)[attr] ?? attr
}

function formatGender(g: string): string {
  return g === 'female' ? '<i class="fa-solid fa-venus"></i> Female' : g === 'male' ? '<i class="fa-solid fa-mars"></i> Male' : '<i class="fa-solid fa-genderless"></i> Unknown'
}
</script>

<style scoped>
.guess-grid {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.grid-row {
  display: grid;
  grid-template-columns: 220px repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 5px;
  min-width: 860px;
}

/* Header */
.header-row .cell {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--divider);
  color: var(--text-muted);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 6px 10px 8px;
  border-radius: 0;
  text-align: center;
}

/* Base cell */
.cell {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.78rem;
  text-align: center;
  min-height: 70px;
  transition: background 0.25s, border-color 0.25s;
}

/* Result colors */
.cell-correct {
  background: var(--correct-bg);
  border-color: var(--correct-border);
}
.cell-partial {
  background: var(--partial-bg);
  border-color: var(--partial-border);
}
.cell-wrong {
  background: var(--wrong-bg);
  border-color: var(--wrong-border);
}

/* Flip animation */
.cell.flip {
  animation: flipReveal 0.65s ease var(--flip-delay, 0ms) both;
}

@keyframes flipReveal {
  0%   { transform: rotateX(0deg); }
  40%  { transform: rotateX(-90deg); opacity: 0.3; }
  60%  { transform: rotateX(-90deg); opacity: 0.3; }
  100% { transform: rotateX(0deg); }
}

.result-icon {
  font-size: 0.6rem;
  font-weight: 700;
  opacity: 0.6;
}
.cell-correct .result-icon { color: var(--correct-text); }
.cell-partial .result-icon { color: var(--partial-text); }
.cell-wrong   .result-icon { color: var(--wrong-text); }

/* Servant cell */
.cell-servant {
  flex-direction: row !important;
  justify-content: flex-start !important;
  gap: 10px;
  text-align: left !important;
  padding: 8px 12px;
}

.servant-face {
  width: 42px; height: 42px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  background: var(--surface-3);
  flex-shrink: 0;
}

.servant-face-placeholder {
  width: 42px; height: 42px;
  border-radius: var(--radius-sm);
  background: var(--surface-3);
  flex-shrink: 0;
}

.servant-name {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.3;
}

.placeholder-text, .placeholder-dash { color: var(--text-muted); font-size: 0.8rem; }
.hint-arrow { color: var(--partial-text); font-size: 0.75rem; font-weight: 600; }

/* Badges */
.class-badge  { font-size: 0.68rem; padding: 2px 7px; border-radius: var(--radius-xs); font-weight: 500; }
.rarity-stars { color: var(--primary); font-size: 0.72rem; letter-spacing: -1px; }
.attr-badge   { font-size: 0.7rem; font-weight: 500; white-space: nowrap; }
.gender-icon  { font-size: 0.76rem; }
.align-text   { font-size: 0.68rem; text-align: center; color: var(--text-secondary); line-height: 1.3; }
.np-tar-text  { font-size: 0.7rem; font-weight: 600; color: var(--text-primary); }
.np-badge     { font-size: 0.7rem; font-weight: 500; padding: 2px 7px; border-radius: var(--radius-xs); }

.attr-sky   { color: #82b8f5; }
.attr-earth { color: #86c897; }
.attr-human { color: #c5a0d5; }
.attr-star  { color: var(--primary); }
.attr-beast { color: #e07070; }

.np-buster { background: rgba(220,53,69,.15); color: #e87676; }
.np-arts   { background: rgba(70,130,220,.15); color: #82b8f5; }
.np-quick  { background: rgba(60,160,80,.15);  color: #82c896; }

/* Row over limit */
.row-over-limit {
  opacity: 0.2;
  pointer-events: none;
  filter: grayscale(1);
}

/* ========== HINT ROWS ========== */
.hint-row { margin-bottom: 5px; }

.hint-row-locked {
  opacity: 0.3;
  filter: grayscale(0.7);
}

.hint-row-active {
  opacity: 1;
  /* subtle fade-in pulse once - not looping */
  animation: hintAppear 0.4s ease;
}

@keyframes hintAppear {
  from { opacity: 0.4; }
  to   { opacity: 1; }
}

.hint-row-used { opacity: 0.65; }

/* Label cell in hint row */
.hint-label-cell {
  flex-direction: row !important;
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 10px;
  background: rgba(200, 168, 90, 0.05);
  border: 1px solid rgba(200, 168, 90, 0.2) !important;
}

.hint-label-text { display: flex; flex-direction: column; gap: 2px; }

.hint-row-icon   { font-size: 1.2rem; line-height: 1; }
.hint-row-title  { font-size: 0.68rem; font-weight: 600; color: var(--primary); }
.hint-row-sub    { font-size: 0.58rem; color: var(--text-muted); }

/* Normal hint cell */
.hint-cell {
  cursor: default;
  border: 1px solid var(--border-subtle);
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.hint-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--border-medium);
}

/* Clickable when active */
.hint-cell.hint-clickable {
  cursor: pointer;
  background: rgba(200, 168, 90, 0.05);
  border: 1px solid rgba(200, 168, 90, 0.3);
  transition: all 0.15s;
}
.hint-cell.hint-clickable .hint-dot {
  background: rgba(200, 168, 90, 0.5);
}
.hint-cell.hint-clickable:hover {
  background: rgba(200, 168, 90, 0.12);
  border-color: var(--primary-dim);
  transform: translateY(-1px);
}

/* Revealed */
.hint-cell.hint-revealed {
  background: var(--correct-bg);
  border: 1px solid var(--correct-border);
  cursor: default;
  animation: revealPop 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
}
@keyframes revealPop {
  from { transform: scale(0.88); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.hint-cell.hint-spent {
  opacity: 0.2;
  cursor: not-allowed;
}

.hint-check { font-size: 0.6rem; color: var(--correct-text); font-weight: 700; }

/* Mobile */
@media (max-width: 768px) {
  .grid-row {
    grid-template-columns: 120px repeat(7, minmax(60px, 1fr));
    min-width: 610px;
  }
  .header-row .cell { font-size: 0.55rem; padding: 5px 4px 7px; }
  .cell { padding: 6px 4px; font-size: 0.7rem; min-height: 62px; }
  .cell-servant {
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
  }
  .hint-label-cell { flex-direction: column !important; align-items: center !important; }
  .servant-name { font-size: 0.62rem; }
  .hint-row-sub { display: none; }
}
</style>
