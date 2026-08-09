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
      admin_emails: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      admin_login_attempts: {
        Row: {
          attempts: number
          blocked_until: string | null
          first_attempt_at: string
          ip_hash: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          blocked_until?: string | null
          first_attempt_at?: string
          ip_hash: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          blocked_until?: string | null
          first_attempt_at?: string
          ip_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          active: boolean
          id: string
          message: string
          message_en: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          id?: string
          message?: string
          message_en?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          id?: string
          message?: string
          message_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_content: {
        Row: {
          body: string
          button_label: string
          button_url: string
          details: Json
          display_name: string
          greeting: string
          key: string
          preheader: string
          signature: string
          subject: string
          updated_at: string
        }
        Insert: {
          body?: string
          button_label?: string
          button_url?: string
          details?: Json
          display_name: string
          greeting?: string
          key: string
          preheader?: string
          signature?: string
          subject: string
          updated_at?: string
        }
        Update: {
          body?: string
          button_label?: string
          button_url?: string
          details?: Json
          display_name?: string
          greeting?: string
          key?: string
          preheader?: string
          signature?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      guest_communications: {
        Row: {
          created_at: string
          error_message: string | null
          guest_id: string
          id: string
          sent_at: string | null
          status: string
          type: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          guest_id: string
          id?: string
          sent_at?: string | null
          status?: string
          type: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          guest_id?: string
          id?: string
          sent_at?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_communications_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "rsvp_public_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_communications_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "rsvps"
            referencedColumns: ["id"]
          },
        ]
      }
      mensagens: {
        Row: {
          created_at: string
          favorita: boolean
          id: string
          lida: boolean
          mensagem: string
          nome: string
        }
        Insert: {
          created_at?: string
          favorita?: boolean
          id?: string
          lida?: boolean
          mensagem: string
          nome: string
        }
        Update: {
          created_at?: string
          favorita?: boolean
          id?: string
          lida?: boolean
          mensagem?: string
          nome?: string
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          accommodation: string | null
          allergies: string | null
          attending: boolean
          created_at: string
          email: string | null
          family_group: string | null
          guests: number
          id: string
          internal_notes: string | null
          message: string | null
          name: string
          phone: string | null
          song_suggestion: string | null
          table_number: string | null
          transport: string | null
        }
        Insert: {
          accommodation?: string | null
          allergies?: string | null
          attending: boolean
          created_at?: string
          email?: string | null
          family_group?: string | null
          guests?: number
          id?: string
          internal_notes?: string | null
          message?: string | null
          name: string
          phone?: string | null
          song_suggestion?: string | null
          table_number?: string | null
          transport?: string | null
        }
        Update: {
          accommodation?: string | null
          allergies?: string | null
          attending?: boolean
          created_at?: string
          email?: string | null
          family_group?: string | null
          guests?: number
          id?: string
          internal_notes?: string | null
          message?: string | null
          name?: string
          phone?: string | null
          song_suggestion?: string | null
          table_number?: string | null
          transport?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wedding_albums: {
        Row: {
          cover_photo_id: string | null
          created_at: string
          description: string | null
          id: string
          is_preview: boolean
          is_published: boolean
          minimum_contribution_cents: number | null
          requires_contribution: boolean
          slug: string
          sort_order: number
          suggested_contribution_cents: number | null
          title: string
          updated_at: string
        }
        Insert: {
          cover_photo_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_preview?: boolean
          is_published?: boolean
          minimum_contribution_cents?: number | null
          requires_contribution?: boolean
          slug: string
          sort_order?: number
          suggested_contribution_cents?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          cover_photo_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_preview?: boolean
          is_published?: boolean
          minimum_contribution_cents?: number | null
          requires_contribution?: boolean
          slug?: string
          sort_order?: number
          suggested_contribution_cents?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      wedding_photos: {
        Row: {
          album_id: string
          caption: string | null
          created_at: string
          file_name: string | null
          height: number | null
          id: string
          is_preview: boolean
          mime_type: string | null
          size_bytes: number | null
          sort_order: number
          storage_path: string
          watermark_applied: boolean
          width: number | null
        }
        Insert: {
          album_id: string
          caption?: string | null
          created_at?: string
          file_name?: string | null
          height?: number | null
          id?: string
          is_preview?: boolean
          mime_type?: string | null
          size_bytes?: number | null
          sort_order?: number
          storage_path: string
          watermark_applied?: boolean
          width?: number | null
        }
        Update: {
          album_id?: string
          caption?: string | null
          created_at?: string
          file_name?: string | null
          height?: number | null
          id?: string
          is_preview?: boolean
          mime_type?: string | null
          size_bytes?: number | null
          sort_order?: number
          storage_path?: string
          watermark_applied?: boolean
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wedding_photos_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "wedding_albums"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      rsvp_public_messages: {
        Row: {
          created_at: string | null
          id: string | null
          message: string | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          message?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          message?: string | null
          name?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
