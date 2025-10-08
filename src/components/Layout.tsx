import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'preact/hooks'
import { route } from 'preact-router'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ children }: { children: any }) {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      route('/login')
    }
  }, [user, loading])

  if (loading) {
    return (
      <div class="flex items-center justify-center min-h-screen">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div class="flex h-screen bg-dark-300 relative overflow-hidden">
      {/* Background Effects */}
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-pink/30 to-transparent wavy-line"></div>
        <div class="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-pink/30 to-transparent wavy-line"></div>
      </div>
      
      <Sidebar />
      <div class="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header />
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-dark-300 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
