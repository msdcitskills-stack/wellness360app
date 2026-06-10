export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string
          doctor_id: string
          fee: number
          id: string
          notes: string | null
          patient_id: string
          service_id: string
          slot_end: string
          slot_id: string
          slot_start: string
          status: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          fee: number
          id?: string
          notes?: string | null
          patient_id: string
          service_id: string
          slot_end: string
          slot_id: string
          slot_start: string
          status?: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          fee?: number
          id?: string
          notes?: string | null
          patient_id?: string
          service_id?: string
          slot_end?: string
          slot_id?: string
          slot_start?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "availability_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_slots: {
        Row: {
          created_at: string
          doctor_id: string
          id: string
          is_booked: boolean
          slot_end: string
          slot_start: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          id?: string
          is_booked?: boolean
          slot_end: string
          slot_start: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          id?: string
          is_booked?: boolean
          slot_end?: string
          slot_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          consultation_fee: number
          created_at: string
          experience_years: number
          full_name: string
          id: string
          is_available: boolean
          qualification: string
          rating: number
          reviews_count: number
          service_id: string
          specialty: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          consultation_fee: number
          created_at?: string
          experience_years?: number
          full_name: string
          id?: string
          is_available?: boolean
          qualification: string
          rating?: number
          reviews_count?: number
          service_id: string
          specialty: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          consultation_fee?: number
          created_at?: string
          experience_years?: number
          full_name?: string
          id?: string
          is_available?: boolean
          qualification?: string
          rating?: number
          reviews_count?: number
          service_id?: string
          specialty?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctors_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          id: string
          is_active: boolean
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          category?: string | null
          id?: string
          is_active?: boolean
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          category?: string | null
          id?: string
          is_active?: boolean
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          tagline: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          tagline: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          tagline?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          id: string
          is_active: boolean
          patient_name: string
          patient_role: string | null
          quote: string
          rating: number
          sort_order: number
        }
        Insert: {
          avatar_url?: string | null
          id?: string
          is_active?: boolean
          patient_name: string
          patient_role?: string | null
          quote: string
          rating?: number
          sort_order?: number
        }
        Update: {
          avatar_url?: string | null
          id?: string
          is_active?: boolean
          patient_name?: string
          patient_role?: string | null
          quote?: string
          rating?: number
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
