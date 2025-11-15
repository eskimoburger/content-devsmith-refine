# Lucky Draw Content

An interactive lucky draw application built with React, featuring 3D card animations and tilt effects.

## 🚀 Live Demo

- **Main App**: [https://eskimoburger.github.io/content-devsmith-refine/](https://eskimoburger.github.io/content-devsmith-refine/)
- **Storybook**: [https://eskimoburger.github.io/content-devsmith-refine/storybook/](https://eskimoburger.github.io/content-devsmith-refine/storybook/)

## ✨ Features

- **LuckyCard Component**: Interactive lucky draw with stacked card animations, 3D flip effects, and prize reveal
- **TiltedCard Component**: Reusable 3D tilt card with mouse tracking and customizable effects
- **Responsive Design**: Optimized for different screen sizes
- **Motion Animations**: Powered by Framer Motion for smooth, engaging interactions

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Motion (Framer Motion)** - Animations
- **Vitest** - Testing framework
- **Storybook 10** - Component documentation and development

## 📦 Installation

```bash
npm install
```

## 🏃 Development

```bash
# Start development server
npm run dev

# Run Storybook
npm run storybook

# Run tests
npm run test

# Run tests with UI
npm run test:ui
```

## 🏗️ Build

```bash
# Build for production
npm run build

# Build Storybook
npm run build-storybook

# Preview production build
npm run preview
```

## 📝 Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook for production

## 📖 Storybook

Explore the component library in Storybook to see all available components and their variations:

```bash
npm run storybook
```

Then open [http://localhost:6006](http://localhost:6006) in your browser.

## 🚢 Deployment

The project is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The GitHub Actions workflow builds both the main application and Storybook, making them available at:

- Main app: `/content-devsmith-refine/`
- Storybook: `/content-devsmith-refine/storybook/`

## 📄 License

MIT
