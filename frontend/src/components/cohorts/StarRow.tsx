import { motion } from 'framer-motion'

interface StarSlotProps {
  filled: boolean
  size?: number
  delay?: number
  sparkle?: boolean
  index?: number
  total?: number
}

export function StarSlot({
  filled,
  size = 32,
  delay = 0,
  sparkle = false,
  index = 0,
  total = 5,
}: StarSlotProps) {
  return (
    <motion.div
      role="img"
      aria-label={`Star ${index + 1} of ${total}, ${filled ? 'filled' : 'empty'}`}
      initial={false}
      animate={filled ? { scale: [0.6, 1.15, 1] } : { scale: 1 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: filled
          ? 'radial-gradient(circle at 30% 30%, #FEF3C7, #FBBF24)'
          : '#F5F1EC',
        border: filled ? '2px solid #FBBF24' : '2px dashed rgba(168,162,158,0.55)',
        color: filled ? '#7c4a03' : '#A8A29E',
        fontSize: size * 0.55,
        fontFamily: 'Verdana, sans-serif',
        flexShrink: 0,
        position: 'relative',
        boxShadow: filled ? '0 2px 6px rgba(251,191,36,0.4)' : 'none',
      }}
    >
      {filled ? '★' : '☆'}
      {sparkle && filled && (
        <motion.span
          aria-hidden
          style={{ position: 'absolute', top: -6, right: -6, fontSize: 10 }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: [0, 1, 0], rotate: 180 }}
          transition={{ duration: 1.2, delay: delay + 0.3, repeat: 2 }}
        >
          ✨
        </motion.span>
      )}
    </motion.div>
  )
}

interface StarRowProps {
  filled: number
  total?: number
  size?: number
  gap?: number
  sparkleLast?: boolean
}

export default function StarRow({
  filled,
  total = 5,
  size = 28,
  gap = 6,
  sparkleLast = false,
}: StarRowProps) {
  return (
    <div className="flex" style={{ gap }}>
      {Array.from({ length: total }).map((_, i) => (
        <StarSlot
          key={i}
          filled={i < filled}
          size={size}
          delay={i * 0.06}
          sparkle={sparkleLast && i === filled - 1}
          index={i}
          total={total}
        />
      ))}
    </div>
  )
}
