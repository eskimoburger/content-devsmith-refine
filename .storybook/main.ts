import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    // Set base path for GitHub Pages deployment
    config.base = process.env.NODE_ENV === 'production'
      ? '/content-devsmith-refine/storybook/'
      : '/';
    return config;
  },
};
export default config;
