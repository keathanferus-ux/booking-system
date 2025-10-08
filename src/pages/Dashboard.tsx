import { useState, useEffect } from 'preact/hooks'
import { supabase } from '../lib/supabase'
import { Calendar, Building2, Users, CreditCard } from 'lucide-preact'

interface DashboardStats {
  totalBookings: number
  activeRooms: number
  totalTeams: number
  availableCredits: number
  upcomingBookings: any[]
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    activeRooms: 0,
    totalTeams: 0,
    availableCredits: 0,
    upcomingBookings: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // This is a simplified version - in a real app, you'd create a database function
      // or use multiple queries to get all the stats
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'confirmed')
        .gte('start_time', new Date().toISOString())

      const { data: rooms } = await supabase
        .from('meeting_rooms')
        .select('*')
        .eq('is_active', true)

      const { data: teams } = await supabase
        .from('teams')
        .select('*')

      setStats({
        totalBookings: bookings?.length || 0,
        activeRooms: rooms?.length || 0,
        totalTeams: teams?.length || 0,
        availableCredits: 0, // This would need proper calculation
        upcomingBookings: bookings?.slice(0, 5) || []
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Upcoming Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      glowColor: 'shadow-blue-500/25'
    },
    {
      name: 'Active Rooms',
      value: stats.activeRooms,
      icon: Building2,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      glowColor: 'shadow-green-500/25'
    },
    {
      name: 'Teams',
      value: stats.totalTeams,
      icon: Users,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      glowColor: 'shadow-purple-500/25'
    },
    {
      name: 'Available Credits',
      value: stats.availableCredits,
      icon: CreditCard,
      color: 'bg-gradient-to-br from-neon-pink to-primary-500',
      glowColor: 'shadow-pink-500/25'
    }
  ]

  return (
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p class="text-gray-400">Overview of your meeting room bookings and system status</p>
      </div>

      {/* Stats Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} class="glass-effect overflow-hidden rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group">
              <div class="p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class={`p-4 rounded-xl ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon class="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-400 truncate">
                        {stat.name}
                      </dt>
                      <dd class="text-2xl font-bold text-white">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Upcoming Bookings */}
      <div class="glass-effect rounded-xl border border-gray-700/50">
        <div class="px-6 py-6">
          <h3 class="text-xl leading-6 font-semibold text-white mb-6 flex items-center">
            <Calendar class="w-5 h-5 mr-2 text-neon-pink" />
            Upcoming Bookings
          </h3>
          {stats.upcomingBookings.length > 0 ? (
            <div class="space-y-4">
              {stats.upcomingBookings.map((booking) => (
                <div key={booking.id} class="bg-dark-200/30 border border-gray-600/30 rounded-lg p-4 hover:border-gray-500/50 transition-all duration-300">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-medium text-white mb-1">{booking.title}</h4>
                      <p class="text-sm text-gray-400">{booking.description}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-medium text-white">
                        {new Date(booking.start_time).toLocaleDateString()}
                      </p>
                      <p class="text-sm text-gray-400">
                        {new Date(booking.start_time).toLocaleTimeString()} - {new Date(booking.end_time).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div class="text-center py-12">
              <Calendar class="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <p class="text-gray-500">No upcoming bookings</p>
              <p class="text-sm text-gray-600 mt-2">Book your first meeting room to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
