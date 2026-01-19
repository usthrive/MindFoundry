/**
 * Celebration Animation
 * Renders confetti and particle effects based on celebration level
 */

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CelebrationLevel, CELEBRATION_CONFIGS } from '@/types/achievements';

interface CelebrationAnimationProps {
  level: CelebrationLevel;
  isActive: boolean;
}

// Confetti colors
const CONFETTI_COLORS = [
  '#00B2A9', // Primary teal
  '#FFD966', // Yellow
  '#FF6F61', // Coral
  '#32CD32', // Green
  '#7C3AED', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Orange
  '#3B82F6', // Blue
];

// Confetti shapes
type ConfettiShape = 'square' | 'circle' | 'star' | 'triangle';

interface Confetti {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  shape: ConfettiShape;
  rotation: number;
  delay: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export default function CelebrationAnimation({ level, isActive }: CelebrationAnimationProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [stars, setStars] = useState<Star[]>([]);

  const config = CELEBRATION_CONFIGS[level];

  // Generate confetti particles
  useEffect(() => {
    if (!isActive) {
      setConfetti([]);
      setStars([]);
      return;
    }

    const shapes: ConfettiShape[] = ['square', 'circle', 'star', 'triangle'];
    const newConfetti: Confetti[] = [];

    for (let i = 0; i < config.confettiCount; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100, // percentage
        y: -10 - Math.random() * 20, // start above viewport
        size: 8 + Math.random() * 12,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * 360,
        delay: Math.random() * (config.duration / 2000), // spread over half duration
      });
    }

    setConfetti(newConfetti);

    // Add stars for major/legendary celebrations
    if (level === 'major' || level === 'legendary') {
      const newStars: Star[] = [];
      const starCount = level === 'legendary' ? 20 : 10;

      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 20 + Math.random() * 40,
          delay: Math.random() * 2,
        });
      }

      setStars(newStars);
    }
  }, [isActive, level, config.confettiCount, config.duration]);

  // Confetti item component
  const ConfettiItem = useMemo(() => {
    return ({ item }: { item: Confetti }) => {
      const shapeStyles = getShapeStyles(item.shape, item.color, item.size);

      return (
        <motion.div
          key={item.id}
          className="absolute pointer-events-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            ...shapeStyles,
          }}
          initial={{
            y: 0,
            x: 0,
            rotate: item.rotation,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 100,
            x: (Math.random() - 0.5) * 200,
            rotate: item.rotation + (Math.random() > 0.5 ? 720 : -720),
            opacity: [1, 1, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: item.delay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        />
      );
    };
  }, []);

  // Star burst component
  const StarBurst = useMemo(() => {
    return ({ item }: { item: Star }) => (
      <motion.div
        key={`star-${item.id}`}
        className="absolute pointer-events-none"
        style={{
          left: `${item.x}%`,
          top: `${item.y}%`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.5, 0],
          opacity: [0, 1, 0],
          rotate: [0, 180],
        }}
        transition={{
          duration: 1.5,
          delay: item.delay,
          repeat: level === 'legendary' ? 2 : 1,
          repeatDelay: 1,
        }}
      >
        <svg
          width={item.size}
          height={item.size}
          viewBox="0 0 24 24"
          fill="#FFD966"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </motion.div>
    );
  }, [level]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      <AnimatePresence>
        {isActive && (
          <>
            {/* Confetti */}
            {confetti.map((item) => (
              <ConfettiItem key={item.id} item={item} />
            ))}

            {/* Star bursts for major/legendary */}
            {stars.map((item) => (
              <StarBurst key={`star-${item.id}`} item={item} />
            ))}

            {/* Center burst effect for moderate+ */}
            {(level === 'moderate' || level === 'major' || level === 'legendary') && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 3, 0],
                  opacity: [0, 0.5, 0],
                }}
                transition={{ duration: 1 }}
              >
                <div className="w-32 h-32 rounded-full bg-gradient-radial from-yellow-300 to-transparent" />
              </motion.div>
            )}

            {/* Legendary extra effects */}
            {level === 'legendary' && (
              <>
                {/* Pulsing rings */}
                {[0, 0.3, 0.6].map((delay, i) => (
                  <motion.div
                    key={`ring-${i}`}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 border-primary"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 8],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: 0.5 + delay,
                      repeat: 3,
                      repeatDelay: 1,
                    }}
                  />
                ))}

                {/* Sparkle particles */}
                {Array.from({ length: 30 }).map((_, i) => {
                  const angle = (i / 30) * Math.PI * 2;
                  const distance = 150 + Math.random() * 100;
                  return (
                    <motion.div
                      key={`sparkle-${i}`}
                      className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-yellow-300"
                      initial={{
                        x: 0,
                        y: 0,
                        opacity: 0,
                        scale: 0,
                      }}
                      animate={{
                        x: Math.cos(angle) * distance,
                        y: Math.sin(angle) * distance,
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.3 + Math.random() * 0.5,
                        repeat: 2,
                        repeatDelay: 2,
                      }}
                    />
                  );
                })}
              </>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function to get shape styles
function getShapeStyles(
  shape: ConfettiShape,
  color: string,
  size: number
): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    width: size,
    height: size,
    backgroundColor: color,
  };

  switch (shape) {
    case 'circle':
      return {
        ...baseStyles,
        borderRadius: '50%',
      };

    case 'triangle':
      return {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${size}px solid ${color}`,
      };

    case 'star':
      // Use SVG for star shape
      return {
        width: size,
        height: size,
        backgroundColor: 'transparent',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(color)}'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E")`,
        backgroundSize: 'contain',
      };

    case 'square':
    default:
      return {
        ...baseStyles,
        borderRadius: 2,
      };
  }
}
