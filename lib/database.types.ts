export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: 'admin' | 'user'
          company_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          role?: 'admin' | 'user'
          company_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: 'admin' | 'user'
          company_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          company_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          company_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          company_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          created_at?: string
        }
      }
      meeting_rooms: {
        Row: {
          id: string
          name: string
          description: string | null
          capacity: number
          location: string | null
          amenities: string[] | null
          company_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          capacity: number
          location?: string | null
          amenities?: string[] | null
          company_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          capacity?: number
          location?: string | null
          amenities?: string[] | null
          company_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          room_id: string
          user_id: string
          team_id: string | null
          title: string
          description: string | null
          start_time: string
          end_time: string
          status: 'confirmed' | 'cancelled' | 'completed'
          credits_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          team_id?: string | null
          title: string
          description?: string | null
          start_time: string
          end_time: string
          status?: 'confirmed' | 'cancelled' | 'completed'
          credits_used: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          team_id?: string | null
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          status?: 'confirmed' | 'cancelled' | 'completed'
          credits_used?: number
          created_at?: string
          updated_at?: string
        }
      }
      credit_allocations: {
        Row: {
          id: string
          company_id: string
          team_id: string | null
          user_id: string | null
          credits_allocated: number
          credits_used: number
          allocated_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          team_id?: string | null
          user_id?: string | null
          credits_allocated: number
          credits_used?: number
          allocated_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          team_id?: string | null
          user_id?: string | null
          credits_allocated?: number
          credits_used?: number
          allocated_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
