import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'

interface PastMePacerProps {
  pastStars: number
  thisStars: number
  daysLeft: number
}

export default function PastMePacer({ pastStars, thisStars, daysLeft }: PastMePacerProps) {
  const ahead = thisStars >= pastStars
  const max = Math.max(pastStars, thisStars, 20)
  const pastPct = (pastStars / max) * 100
  const futPct = (thisStars / max) * 100

  return (
    <Card
      padding="md"
      rounded="lg"
      className="border-2"
      style={{
        background: 'linear-gradient(135deg, #EDE9FE, white)',
        borderColor: 'rgba(139,92,246,0.2)',
      }}
    >
      <div className="mb-3">
        <div className="font-display text-[22px] font-bold leading-tight text-text-primary">
          Past-Me Pacer
        </div>
        <div className="mt-1 font-body text-[13px] text-text-secondary">
          A race against last-week-you. Always cheering, never comparing.
        </div>
      </div>

      <div
        aria-label={`You at ${thisStars} stars, Past you at ${pastStars} stars, ${daysLeft} days remaining`}
        className="relative my-2"
        style={{ height: 110 }}
      >
        <div
          className="absolute left-0 right-0 rounded-full bg-white"
          style={{
            top: '50%',
            transform: 'translateY(-50%)',
            height: 12,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
          }}
        />
        <motion.div
          initial={{ left: '0%' }}
          animate={{ left: `${Math.max(0, pastPct - 5)}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute text-center"
          style={{ top: '50%', transform: 'translateY(-50%)', width: 60 }}
        >
          <div className="text-4xl opacity-60">👻</div>
          <div className="-mt-1 font-body text-[10px] font-bold text-text-secondary">
            Past-Me
          </div>
          <div className="font-body text-[11px] font-extrabold text-text-primary">
            {pastStars} ⭐
          </div>
        </motion.div>
        <motion.div
          initial={{ left: '0%' }}
          animate={{ left: `${Math.max(0, futPct - 5)}%` }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute text-center"
          style={{ top: '50%', transform: 'translateY(-50%)', width: 60 }}
        >
          <div className="text-4xl">🧑‍🎓</div>
          <div className="-mt-1 font-body text-[10px] font-bold text-primary">You now</div>
          <div className="font-body text-[11px] font-extrabold text-text-primary">
            {thisStars} ⭐
          </div>
        </motion.div>
      </div>

      <div className="rounded-2xl bg-white p-3 text-center font-body text-[13px] text-text-primary">
        {ahead ? (
          <>
            You're <b style={{ color: '#16A34A' }}>{thisStars - pastStars} ahead</b> of last week.{' '}
            {daysLeft} {daysLeft === 1 ? 'day' : 'days'} to go!
          </>
        ) : (
          <>
            Past-Me is <b style={{ color: '#F97316' }}>{pastStars - thisStars} ahead</b>. You've got{' '}
            <b>
              {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
            </b>{' '}
            to catch up — you've got this!
          </>
        )}
      </div>
    </Card>
  )
}
