import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from "react";
import logoDs from "../assets/logo-ds.png";
import { motion, useSpring } from "motion/react";
import "./LuckyCard.css";
import { calculateCardMetrics, getInitialViewportWidth } from "../utils/cardMetrics";

interface LuckyCardProps {
  prizes: string[];
}

interface Card {
  id: number;
  prize: string;
  flipped: boolean;
}

// Tiltable card wrapper component
function TiltableCard({
  children,
  isActive,
  disableScale,
}: {
  children: ReactNode;
  isActive: boolean;
  disableScale?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { damping: 30, stiffness: 100, mass: 2 });
  const rotateY = useSpring(0, { damping: 30, stiffness: 100, mass: 2 });
  const scale = useSpring(1, { damping: 30, stiffness: 100, mass: 2 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !isActive) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -10;
    const rotationY = (offsetX / (rect.width / 2)) * 10;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
  };

  const handleMouseEnter = () => {
    if (isActive && !disableScale) scale.set(1.05);
  };

  const handleMouseLeave = () => {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="relative h-full w-full"
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

export default function LuckyCard({ prizes }: LuckyCardProps) {
  const [isStacked, setIsStacked] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [viewportWidth, setViewportWidth] = useState<number>(
    getInitialViewportWidth
  );

  const metrics = useMemo(
    () => calculateCardMetrics(viewportWidth),
    [viewportWidth]
  );

  const {
    cardWidth,
    cardHeight,
    gap,
    containerHeight,
    containerMaxWidth,
    wrapperMaxWidth,
    stackedConfigs,
  } = metrics;

  // Initialize 4 cards with random unique prizes
  const initializeCards = useCallback(() => {
    const shuffled = [...prizes].sort(() => Math.random() - 0.5);
    const selectedPrizes = shuffled.slice(0, 4);

    return selectedPrizes.map((prize, index) => ({
      id: index,
      prize,
      flipped: false,
    }));
  }, [prizes]);

  useEffect(() => {
    setCards(initializeCards());
  }, [initializeCards]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSpread = () => {
    setIsAnimating(true);
    setIsStacked(false);

    // Animation complete after stagger delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 4 * 150 + 800);
  };

  const handleCardClick = (cardId: number) => {
    // Prevent interactions during reset
    if (isResetting) return;

    // If stacked, spread the cards first
    if (isStacked) {
      handleSpread();
      return;
    }

    // If already spread and not animating, flip the selected card
    if (isAnimating || selectedCard !== null) return;

    setSelectedCard(cardId);
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, flipped: true } : card
      )
    );
  };

  const handleReset = () => {
    setIsResetting(true);

    // First flip back the current card
    setCards((prev) =>
      prev.map((card) =>
        card.id === selectedCard ? { ...card, flipped: false } : card
      )
    );
    setSelectedCard(null);

    // Wait for flip animation to complete before generating new cards
    setTimeout(() => {
      setIsStacked(true);
      setCards(initializeCards());
      setIsResetting(false);
    }, 800); // Match the flip animation duration
  };

  const totalWidth = cardWidth * 2 + gap;
  const totalHeight = cardHeight * 2 + gap;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const borderRadius = clamp(Math.round(cardWidth * 0.18), 16, 32);
  const borderWidth = Math.max(2, Math.round(cardWidth * 0.018));
  const emblemOuter = clamp(Math.round(cardWidth * 0.44), 48, 118);
  const emblemInner = clamp(Math.round(cardWidth * 0.34), 36, 96);
  const backEmblem = clamp(Math.round(cardWidth * 0.38), 44, 108);
  const backLogo = clamp(Math.round(cardWidth * 0.32), 34, 92);
  const verticalPadding = clamp(Math.round(cardHeight * 0.14), 18, 56);
  const horizontalPadding = clamp(Math.round(cardWidth * 0.16), 18, 64);
  const contentGap = clamp(Math.round(cardHeight * 0.1), 12, 36);
  const prizeFontSize = clamp(cardWidth * 0.16, 16, 24);

  return (
    <div
      className={`relative flex w-full flex-col items-center gap-6 ${
        isStacked ? "justify-center flex-1" : "justify-start pt-8"
      }`}
      style={{ maxWidth: `${wrapperMaxWidth}px` }}
    >
      <div
        className="relative mx-auto w-full"
        style={{
          maxWidth: `${containerMaxWidth}px`,
          height: `${containerHeight}px`,
          perspective: "1000px",
          WebkitPerspective: "1000px",
          MozPerspective: "1000px",
        }}
      >
        {/* {isStacked && (
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-1/2 top-1/2 rounded-[38px] opacity-60 blur-2xl"
              style={{
                width: `${glowSizes.primary.width}px`,
                height: `${glowSizes.primary.height}px`,
                transform: "translate(-55%, -62%)",
                backgroundColor: "rgba(80, 170, 255, 0.5)",
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 rounded-[36px] opacity-70 blur-3xl"
              style={{
                width: `${glowSizes.secondary.width}px`,
                height: `${glowSizes.secondary.height}px`,
                transform: "translate(-5%, -18%)",
                backgroundColor: "rgba(255, 138, 184, 0.45)",
              }}
            />
          </div>
        )} */}

        {cards.map((card, index) => {
          const row = Math.floor(index / 2);
          const col = index % 2;

          const spreadX = col * (cardWidth + gap);
          const spreadY = row * (cardHeight + gap);
          const offsetX = spreadX + cardWidth / 2 - totalWidth / 2;
          const offsetY = spreadY + cardHeight / 2 - totalHeight / 2;

          const transformParts = ["translate(-50%, -50%)"];

          if (isStacked) {
            const config =
              stackedConfigs[index] ??
              stackedConfigs[stackedConfigs.length - 1];

            transformParts.push(
              `translate(${config.translate[0]}px, ${config.translate[1]}px)`
            );
            transformParts.push(`scale(${config.scale})`);
            transformParts.push(`rotate(${config.rotate}deg)`);
            transformParts.push("translateZ(0)");
          } else {
            transformParts.push(`translate(${offsetX}px, ${offsetY}px)`);
            if (card.flipped) {
              transformParts.push("scale(1.18)");
            }
          }

          const positionTransform = transformParts.join(" ");
          const boxShadow = isStacked
            ? stackedConfigs[index]?.shadow
            : card.flipped
            ? "0 45px 120px -50px rgba(255, 196, 58, 0.75)"
            : "0 28px 64px -42px rgba(58, 170, 255, 0.55)";

          const shouldAnimateBorder = !isStacked || card.flipped;

          return (
            <div
              key={card.id}
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                transform: positionTransform,
                transition: "all 0.9s cubic-bezier(0.65, 0, 0.21, 1)",
                transitionDelay: `${isStacked ? index * 80 : index * 120}ms`,
                zIndex: card.flipped ? 20 : index + 1,
                boxShadow,
                borderRadius: `${borderRadius}px`,
              }}
            >
              <div
                className={`relative h-full w-full ${
                  isStacked || (!card.flipped && selectedCard === null)
                    ? "cursor-pointer"
                    : "cursor-default"
                } focus:outline-none`}
                onClick={() => handleCardClick(card.id)}
                tabIndex={
                  isStacked || (!card.flipped && selectedCard === null) ? 0 : -1
                }
                role="button"
                aria-label={isStacked ? "Spread the cards" : "Select a card"}
                style={{
                  perspective: "1200px",
                  WebkitPerspective: "1200px",
                  MozPerspective: "1200px",
                  borderRadius: `${borderRadius}px`,
                }}
              >
                <TiltableCard
                  isActive={
                    !isStacked &&
                    (selectedCard === null || selectedCard === card.id)
                  }
                  disableScale={card.flipped}
                >
                  <motion.div
                    className={`card-rotate relative h-full w-full${
                      shouldAnimateBorder ? " card-rotate--active" : ""
                    }${card.flipped ? " card-rotate--flipped" : ""}`}
                    style={
                      {
                        "--card-radius": `${borderRadius}px`,
                        "--card-border": `${borderWidth}px`,
                        transformStyle: "preserve-3d",
                      } as CSSProperties
                    }
                    animate={{
                      rotateY: card.flipped ? 180 : 0,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.4, 0.0, 0.2, 1],
                    }}
                  >
                    <div aria-hidden className="card-border-glow" />

                    {/* Card Container with 3D transforms */}
                    <div
                      className="relative h-full w-full"
                      style={{
                        borderRadius: `${borderRadius}px`,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Front - Shows only icon */}
                      <motion.div
                        className="absolute inset-0 overflow-hidden bg-slate-900 text-white"
                        style={{
                          borderRadius: "inherit",
                          backfaceVisibility: "hidden",
                          transform: "rotateY(0deg)",
                        }}
                        animate={{
                          opacity: card.flipped ? 0 : 1,
                        }}
                        transition={{
                          duration: 0.6,
                          delay: card.flipped ? 0.2 : 0,
                        }}
                      >
                        <div
                          className="flex h-full items-center justify-center"
                          style={{
                            padding: `${verticalPadding}px ${horizontalPadding}px`,
                          }}
                        >
                          <div
                            style={{
                              width: `${emblemOuter + 20}px`,
                              height: `${emblemOuter + 20}px`,
                              // backgroundColor: "white",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow:
                                "0 8px 32px -12px rgba(255, 255, 255, 0.15)",
                            }}
                          >
                            <img
                              src={logoDs}
                              alt="Devsmith"
                              style={{
                                width: `${emblemInner + 10}px`,
                                height: `${emblemInner + 10}px`,
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>

                      {/* Back - Shows prize result */}
                      <motion.div
                        className="absolute inset-0 overflow-hidden text-slate-900"
                        style={{
                          borderRadius: "inherit",
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                          zIndex: 1,
                          background:
                            "linear-gradient(to bottom right, #fde047, #facc15, #f59e0b)",
                        }}
                        animate={{
                          opacity: card.flipped ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.6,
                          delay: card.flipped ? 0 : 0.2,
                        }}
                      >
                        <div
                          className="flex h-full flex-col items-center justify-center text-center"
                          style={{
                            gap: `${contentGap + 12}px`,
                            padding: `${verticalPadding}px ${horizontalPadding}px`,
                          }}
                        >
                          {/* Prize Display - Clean and simple */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "16px",
                            }}
                          >
                            <div
                              style={{
                                width: `${backEmblem + 16}px`,
                                height: `${backEmblem + 16}px`,
                                backgroundColor: "white",
                                borderRadius: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow:
                                  "0 6px 24px -8px rgba(0, 0, 0, 0.15)",
                              }}
                            >
                              <img
                                src={logoDs}
                                alt="Devsmith"
                                style={{
                                  width: `${backLogo + 8}px`,
                                  height: `${backLogo + 8}px`,
                                }}
                              />
                            </div>

                            <div
                              style={{
                                backgroundColor: "white",
                                borderRadius: "20px",
                                padding: "16px 20px",
                                maxWidth: "90%",
                                minWidth: "180px",
                                boxShadow: "0 4px 16px -4px rgba(0, 0, 0, 0.1)",
                                width: "auto",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: "600",
                                  color: "#1e293b",
                                  textAlign: "center",
                                  fontSize: `${Math.min(
                                    prizeFontSize - 2,
                                    18
                                  )}px`,
                                  lineHeight: 1.4,
                                  wordWrap: "break-word",
                                  overflowWrap: "break-word",
                                  hyphens: "auto",
                                }}
                              >
                                {card.prize}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </TiltableCard>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleReset}
        className="mt-4 rounded-full bg-slate-800 px-10! py-3! text-lg font-semibold text-teal transition-all duration-300 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#44c5bd]"
        aria-label="Try another prize"
        style={
          selectedCard !== null && !isResetting
            ? {
                opacity: 1,
                pointerEvents: "auto",
              }
            : {
                opacity: 0,
                pointerEvents: "none",
              }
        }
      >
        Try Again
      </button>
    </div>
  );
}
