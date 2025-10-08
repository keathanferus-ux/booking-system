import { route } from 'preact-router'
import { 
  Home, 
  Calendar, 
  Building2, 
  Users, 
  Settings,
  LogOut 
} from 'lucide-preact'
import { useAuth } from '../contexts/AuthContext'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Bookings', href: '/bookings', icon: Calendar },
  { name: 'Meeting Rooms', href: '/rooms', icon: Building2 },
  { name: 'Teams', href: '/teams', icon: Users },
]

export default function Sidebar() {
  const { userProfile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    route('/login')
  }

  return (
    <div class="bg-dark-200/50 backdrop-blur-xl border-r border-gray-700/50 w-64 glass-effect">
      <div class="p-6">
        <div class="flex items-center space-x-3 mb-2">
          <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span class="text-lg font-bold text-dark-300">CW</span>
          </div>
          <div>
            <h1 class="text-lg font-bold text-white">Co Work CPT</h1>
            <p class="text-xs text-gray-400">Meeting Rooms</p>
          </div>
        </div>
        <p class="text-sm text-neon-pink font-medium">{userProfile?.companies?.name}</p>
      </div>
      
      <nav class="mt-6">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.name}
              href={item.href}
              class="flex items-center px-6 py-3 text-gray-300 hover:bg-dark-100/50 hover:text-white transition-all duration-300 group"
              onClick={(e) => {
                e.preventDefault()
                route(item.href)
              }}
            >
              <Icon class="w-5 h-5 mr-3 group-hover:text-neon-pink transition-colors" />
              {item.name}
            </a>
          )
        })}
        
        {userProfile?.role === 'admin' && (
          <a
            href="/admin"
            class="flex items-center px-6 py-3 text-gray-300 hover:bg-dark-100/50 hover:text-white transition-all duration-300 group"
            onClick={(e) => {
              e.preventDefault()
              route('/admin')
            }}
          >
            <Settings class="w-5 h-5 mr-3 group-hover:text-neon-pink transition-colors" />
            Admin
          </a>
        )}
      </nav>
      
      <div class="absolute bottom-0 w-64 p-6 border-t border-gray-700/50">
        <button
          onClick={handleSignOut}
          class="flex items-center w-full text-gray-300 hover:text-red-400 transition-colors duration-300 group"
        >
          <LogOut class="w-5 h-5 mr-3 group-hover:text-red-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
