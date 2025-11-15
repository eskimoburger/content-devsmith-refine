export interface StackedConfig {
  translate: [number, number];
  rotate: number;
  scale: number;
  shadow: string;
}

export interface CardMetrics {
  cardWidth: number;
  cardHeight: number;
  gap: number;
  containerHeight: number;
  containerMaxWidth: number;
  wrapperMaxWidth: number;
  stackedConfigs: StackedConfig[];
}

export const getInitialViewportWidth = () =>
  typeof window !== "undefined" ? window.innerWidth : 1024;

export function calculateCardMetrics(viewportWidth: number): CardMetrics {
  const width = Number.isFinite(viewportWidth) ? viewportWidth : 1024;
  let cardWidth: number;
  let gap: number;

  if (width <= 360) {
    cardWidth = 138;
    gap = 14;
  } else if (width <= 480) {
    cardWidth = 168;
    gap = 18;
  } else if (width <= 768) {
    cardWidth = 208;
    gap = 22;
  } else {
    cardWidth = 240;
    gap = 24;
  }

  const cardHeight = Math.round(cardWidth * 1.34);
  const rawContainerWidth = cardWidth * 2 + gap + 32;
  const containerMaxWidth = Math.min(width - 16, rawContainerWidth);
  const containerHeight = cardHeight * 2 + gap + 48;
  const wrapperMaxWidth = Math.min(width, containerMaxWidth + 72);

  const stackedConfigs: StackedConfig[] = [
    {
      translate: [-cardWidth * 0.15, cardHeight * 0.18],
      rotate: -12,
      scale: 0.92,
      shadow: "0 28px 60px -32px rgba(76, 180, 255, 0.65)",
    },
    {
      translate: [cardWidth * 0.15, cardHeight * 0.16],
      rotate: 10,
      scale: 0.94,
      shadow: "0 28px 60px -32px rgba(157, 115, 255, 0.55)",
    },
    {
      translate: [0, cardHeight * 0.22],
      rotate: 6,
      scale: 0.96,
      shadow: "0 32px 68px -34px rgba(255, 89, 173, 0.45)",
    },
    {
      translate: [0, 0],
      rotate: 0,
      scale: 1,
      shadow: "0 40px 120px -45px rgba(255, 215, 64, 0.85)",
    },
  ];

  return {
    cardWidth,
    cardHeight,
    gap,
    containerHeight,
    containerMaxWidth,
    wrapperMaxWidth,
    stackedConfigs,
  };
}
