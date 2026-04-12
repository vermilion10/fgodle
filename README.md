# FGOdle (Fate/Grand Order Wordle)

A Wordle-like guessing game specifically tailored for Fate/Grand Order (FGO) servants! Test your knowledge by guessing today's servant or playing infinitely in Unlimited Mode.

## 🌟 Features

- **Daily Mode**: Guess the preset servant of the day! A new servant is carefully selected every day. Your streak and stats are saved locally.
- **Unlimited Mode**: Want to keep guessing? Play in unlimited mode and guess random servants endlessly!
- **Detailed Clues**: Offers comprehensive visual hints (Rarity, Class, NP Card, NP Type, Attribute, Alignment, Gender, and Traits).
- **Share Your Result**: Easily generate a beautiful shareable image of your results, complete with a QR Code for your friends.
- **Always Up to Date**: Data is synchronized automatically from the Japanese server using GitHub Actions and the Atlas Academy API. Fully automated CI/CD pipeline!
- **Mobile Responsive**: The UI automatically shifts and hides redundant clues on mobile screens for a better experience.

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

- **Data Source**: [Atlas Academy API](https://api.atlasacademy.io/) - Provides the extensive FGO databases.
- **Game Concept**: Inspired by the original Wordle and various fandom iterations.
- **Animations**: GIFs provided via [Tenor](https://tenor.com/).
- **Original Developer**: [vermilion10](https://github.com/vermilion10)
