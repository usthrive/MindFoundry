import Button from '../ui/Button'
import Card from '../ui/Card'

interface UserTypeSelectionProps {
  onSelectParent: () => void
  onSelectStudent: () => void
  loading?: boolean
}

export default function UserTypeSelection({ onSelectParent, onSelectStudent, loading }: UserTypeSelectionProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to MindFoundry!</h2>
        <p className="text-xl text-gray-600">
          Let's get you started. Are you setting this up for your child or yourself?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Parent Option */}
        <Card variant="elevated" padding="lg" className="hover:shadow-xl transition-shadow">
          <div className="w-full text-center group">
            <div className="text-8xl mb-6 group-hover:scale-110 transition-transform">👨‍👩‍👧‍👦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">I'm a Parent</h3>
            <p className="text-gray-600 mb-6">
              I want to set up math practice for my children
            </p>
            <div className="space-y-2 text-left">
              <p className="text-sm text-gray-500 flex items-start">
                <span className="mr-2">✓</span>
                <span>Create multiple child profiles</span>
              </p>
              <p className="text-sm text-gray-500 flex items-start">
                <span className="mr-2">✓</span>
                <span>Track progress for each child</span>
              </p>
              <p className="text-sm text-gray-500 flex items-start">
                <span className="mr-2">✓</span>
                <span>Manage practice schedules</span>
              </p>
            </div>
            <div className="mt-6">
              <Button
                variant="primary"
                size="lg"
                disabled={loading}
                onClick={onSelectParent}
                className="w-full"
              >
                {loading ? 'Please wait...' : 'Continue as Parent'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Student Option */}
        <Card variant="elevated" padding="lg" className="hover:shadow-xl transition-shadow">
          <div className="w-full text-center group">
            <div className="text-8xl mb-6 group-hover:scale-110 transition-transform">🎓</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">I'm a Student</h3>
            <p className="text-gray-600 mb-6">
              I want to practice math on my own
            </p>
            <div className="space-y-2 text-left">
              <p className="text-sm text-gray-500 flex items-start">
                <span className="mr-2">✓</span>
                <span>Quick setup for independent learning</span>
              </p>
              <p className="text-sm text-gray-500 flex items-start">
                <span className="mr-2">✓</span>
                <span>Track your own progress</span>
              </p>
              <p className="text-sm text-gray-500 flex items-start">
                <span className="mr-2">✓</span>
                <span>Self-paced practice sessions</span>
              </p>
            </div>
            <div className="mt-6">
              <Button
                variant="primary"
                size="lg"
                disabled={loading}
                onClick={onSelectStudent}
                className="w-full"
              >
                {loading ? 'Please wait...' : 'Continue as Student'}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <p className="text-center text-sm text-gray-500 mt-8">
        You can always change this later in your account settings
      </p>
    </div>
  )
}