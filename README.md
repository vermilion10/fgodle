# FGOdle (Fate/Grand Order Wordle)

A Wordle-like guessing game specifically tailored for Fate/Grand Order (FGO) servants! Test your knowledge by guessing today's servant or playing infinitely in Unlimited Mode.

## 🌟 Features

- **Daily Mode**: Guess the preset servant of the day! A new servant is carefully selected every day. Your progress and streak are saved locally.
- **Unlimited Mode**: Want to keep guessing? Play in unlimited mode with random servants, with selectable difficulty (Easy / Normal / Hard).
- **Hint Rows** *(Daily only)*: Rows 5 and 8 are special hint rows. Row 5 lets you peek at 1 cell; row 8 lets you reveal up to 3 cells — giving you a fighting chance on your toughest guesses.
- **Reveal Animation**: Every submitted guess triggers a smooth card-flip animation column by column, just like the classic Wordle.
- **Detailed Clues**: Offers comprehensive visual hints — Rarity, Class, NP Card, NP Type, Attribute, Alignment, and Gender.
- **Share Your Result**: Generate a beautiful shareable image of your results, complete with a QR code linking back to FGOdle.
- **Always Up to Date**: Servant data is synchronized automatically from the JP server using GitHub Actions and the Atlas Academy API.
- **Mobile Responsive**: Fully scrollable grid works on any screen size.

## 🎮 Game Modes

| Mode | Description |
|------|-------------|
| **Daily** | A new servant every day, shared globally. Includes Hint Rows at rows 5 and 8. |
| **Unlimited — Easy** | 12 guesses, relaxed challenge |
| **Unlimited — Normal** | 8 guesses, standard challenge |
| **Unlimited — Hard** | Only 5 guesses, test your knowledge! |

## 🚀 Technologies

- **Vue 3** (Composition API, `<script setup>`)
- **Vite** (Build Tool)
- **TypeScript**
- **GitHub Actions** (CI/CD Automated Deployment and Data Preprocessing)
- **html2canvas & qrcode.vue** (For sharing results)

## 🛠️ Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Run the preprocessor to fetch the newest data from Atlas API:
   ```bash
   npm run preprocess
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## 📜 Credits

- **Data Source**: [Atlas Academy API](https://api.atlasacademy.io/) — Provides the extensive FGO databases.
- **Game Concept**: Inspired by the original Wordle and various fandom iterations.
- **Animations**: GIFs provided via [Tenor](https://tenor.com/).
- **Original Developer**: [vermilion10](https://github.com/vermilion10)
