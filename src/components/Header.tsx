import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { userProfile } = useAuth()

  return (
    <header class="bg-dark-200/30 backdrop-blur-xl border-b border-gray-700/50 glass-effect">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-white">
              Welcome back, <span class="gradient-text">{userProfile?.first_name}</span>!
            </h2>
            <p class="text-sm text-gray-400">
              {userProfile?.role === 'admin' ? 'Administrator' : 'User'} • {userProfile?.companies?.name}
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-sm font-medium text-white">
                {userProfile?.first_name} {userProfile?.last_name}
              </p>
              <p class="text-xs text-gray-400">{userProfile?.email}</p>
            </div>
            <div class="w-10 h-10 bg-gradient-to-br from-neon-pink to-primary-500 rounded-full flex items-center justify-center glow-effect">
              <span class="text-white font-medium text-sm">
                {userProfile?.first_name?.[0]}{userProfile?.last_name?.[0]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
