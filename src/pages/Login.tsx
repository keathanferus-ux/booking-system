import { useState } from 'preact/hooks'
import { useAuth } from '../contexts/AuthContext'
import { route } from 'preact-router'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        await signIn(email, password)
        route('/')
      } else {
        // For signup, we need company selection - simplified for now
        await signUp(email, password, {
          firstName,
          lastName,
          companyId: 'temp-company-id', // This should be handled properly
          role: 'user'
        })
        route('/')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="min-h-screen flex items-center justify-center bg-dark-300 relative overflow-hidden">
      {/* Background Effects */}
      <div class="absolute inset-0">
        <div class="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent opacity-30 wavy-line"></div>
        <div class="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent opacity-30 wavy-line"></div>
      </div>
      
      <div class="max-w-md w-full space-y-8 relative z-10">
        <div class="text-center">
          {/* Logo */}
          <div class="mb-8">
            <div class="w-16 h-16 mx-auto bg-white rounded-lg flex items-center justify-center mb-4">
              <span class="text-2xl font-bold text-dark-300">CW</span>
            </div>
            <h1 class="text-3xl font-bold text-white mb-2">Co Work Cape Town</h1>
            <p class="text-neon-pink font-medium">Meeting Room Booking System</p>
          </div>
          
          <h2 class="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Community'}
          </h2>
          <p class="text-gray-400 text-sm">
            {isLogin ? 'Sign in to book your meeting room' : 'Create your account to get started'}
          </p>
        </div>
        
        <form class="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div class="glass-effect rounded-xl p-6 space-y-6">
            {!isLogin && (
              <div class="space-y-4">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-white mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={firstName}
                    onInput={(e) => setFirstName((e.target as HTMLInputElement).value)}
                    class="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent transition-all duration-300"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label for="lastName" class="block text-sm font-medium text-white mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={lastName}
                    onInput={(e) => setLastName((e.target as HTMLInputElement).value)}
                    class="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent transition-all duration-300"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label for="email" class="block text-sm font-medium text-white mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                class="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                class="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div class="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm">
              {error}
            </div>
          )}

          <div class="space-y-4">
            <button
              type="submit"
              disabled={loading}
              class="w-full py-3 px-6 bg-gradient-to-r from-neon-pink to-primary-500 text-white font-semibold rounded-lg hover:from-neon-glow hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:ring-offset-2 focus:ring-offset-dark-300 disabled:opacity-50 transition-all duration-300 glow-effect"
            >
              {loading ? (
                <span class="flex items-center justify-center">
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Loading...
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            <div class="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                class="text-gray-400 hover:text-neon-pink text-sm transition-colors duration-300"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
