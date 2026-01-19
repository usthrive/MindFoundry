/**
 * Achievement Badge Component
 * Displays an achievement with icon and styling
 */

import { motion } from 'framer-motion';
import { AchievementDisplay } from '@/types/achievements';

interface AchievementBadgeProps {
  achievement: AchievementDisplay;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  onClick?: () => void;
}

// Badge icons mapping
const BADGE_ICONS: Record<string, string> = {
  '1': '1️⃣',
  'flame': '🔥',
  'trophy': '🏆',
  'brain': '🧠',
  'perfect': '💯',
  'belt': '🥋',
  'bolt': '⚡',
  'calculator': '🧮',
  'star': '⭐',
  'medal': '🏅',
  'crown': '👑',
  'rocket': '🚀',
};

// Size configurations
const SIZE_CONFIGS = {
  sm: {
    container: 'w-16 h-16',
    icon: 'text-2xl',
    ring: 'w-20 h-20',
  },
  md: {
    container: 'w-24 h-24',
    icon: 'text-4xl',
    ring: 'w-28 h-28',
  },
  lg: {
    container: 'w-32 h-32',
    icon: 'text-5xl',
    ring: 'w-36 h-36',
  },
};

export default function AchievementBadge({
  achievement,
  size = 'md',
  animate = false,
  onClick,
}: AchievementBadgeProps) {
  const sizeConfig = SIZE_CONFIGS[size];
  const icon = BADGE_ICONS[achievement.icon] || '⭐';

  const badgeContent = (
    <div className="relative">
      {/* Animated ring for celebrations */}
      {animate && (
        <motion.div
          className={`absolute -inset-2 rounded-full border-4 border-primary/50 ${sizeConfig.ring}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1.1, 1],
            opacity: [0, 1, 1],
          }}
          transition={{
            duration: 0.6,
            times: [0, 0.6, 1],
          }}
        />
      )}

      {/* Glow effect */}
      {animate && (
        <motion.div
          className={`absolute inset-0 rounded-full ${achievement.badgeColor} blur-xl opacity-50`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Main badge */}
      <motion.div
        className={`
          relative ${sizeConfig.container} rounded-full
          ${achievement.badgeColor}
          flex items-center justify-center
          shadow-lg
          ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
        `}
        initial={animate ? { scale: 0, rotate: -180 } : undefined}
        animate={animate ? { scale: 1, rotate: 0 } : undefined}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
        whileHover={onClick ? { scale: 1.05 } : undefined}
        whileTap={onClick ? { scale: 0.95 } : undefined}
        onClick={onClick}
      >
        {/* Inner circle */}
        <div className="absolute inset-1 rounded-full bg-white/20" />

        {/* Icon */}
        <motion.span
          className={sizeConfig.icon}
          initial={animate ? { scale: 0 } : undefined}
          animate={animate ? { scale: 1 } : undefined}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
            delay: 0.2,
          }}
        >
          {icon}
        </motion.span>
      </motion.div>

      {/* Sparkles for animated badges */}
      {animate && (
        <>
          {[0, 1, 2, 3].map((i) => {
            const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
            const distance = size === 'lg' ? 70 : size === 'md' ? 55 : 40;
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1,
                  delay: 0.5 + i * 0.1,
                  repeat: 2,
                  repeatDelay: 1,
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );

  return badgeContent;
}

// Compact badge for lists
export function AchievementBadgeMini({
  achievement,
  onClick,
}: {
  achievement: AchievementDisplay;
  onClick?: () => void;
}) {
  const icon = BADGE_ICONS[achievement.icon] || '⭐';

  return (
    <button
      className={`
        w-10 h-10 rounded-full flex items-center justify-center
        ${achievement.badgeColor}
        shadow-sm hover:shadow-md transition-shadow
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
      onClick={onClick}
      title={achievement.title}
    >
      <span className="text-lg">{icon}</span>
    </button>
  );
}

// Badge with label
export function AchievementBadgeWithLabel({
  achievement,
  onClick,
}: {
  achievement: AchievementDisplay;
  onClick?: () => void;
}) {
  return (
    <div
      className={`
        flex flex-col items-center gap-2 p-4 rounded-xl bg-white shadow-md
        ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
      `}
      onClick={onClick}
    >
      <AchievementBadge achievement={achievement} size="sm" />
      <div className="text-center">
        <p className="font-semibold text-gray-800 text-sm">{achievement.title}</p>
        <p className="text-xs text-gray-500">
          {new Date(achievement.earnedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
