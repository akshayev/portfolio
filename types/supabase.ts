export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      about_sections: {
        Row: {
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string | null
          credential_url: string | null
          display_order: number | null
          id: string
          issue_date: string | null
          issuer: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credential_url?: string | null
          display_order?: number | null
          id?: string
          issue_date?: string | null
          issuer: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credential_url?: string | null
          display_order?: number | null
          id?: string
          issue_date?: string | null
          issuer?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_settings: {
        Row: {
          created_at: string | null
          display_order: number | null
          email: string
          id: string
          phone: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          email: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          email?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string | null
          degree: string
          display_order: number | null
          end_date: string | null
          field_of_study: string | null
          id: string
          institution_name: string
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          degree: string
          display_order?: number | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution_name: string
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          degree?: string
          display_order?: number | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution_name?: string
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company_name: string
          created_at: string | null
          description: string | null
          display_order: number | null
          end_date: string | null
          id: string
          is_current: boolean | null
          role_title: string
          start_date: string
          updated_at: string | null
        }
        Insert: {
          company_name: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          role_title: string
          start_date: string
          updated_at?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          role_title?: string
          start_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      github_import_logs: {
        Row: {
          id: string
          imported_at: string | null
          reason: string | null
          repo_full_name: string
          status: string
        }
        Insert: {
          id?: string
          imported_at?: string | null
          reason?: string | null
          repo_full_name: string
          status: string
        }
        Update: {
          id?: string
          imported_at?: string | null
          reason?: string | null
          repo_full_name?: string
          status?: string
        }
        Relationships: []
      }
      github_import_sources: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_imported_at: string | null
          repo_full_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_imported_at?: string | null
          repo_full_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_imported_at?: string | null
          repo_full_name?: string
        }
        Relationships: []
      }
      global_visual_settings: {
        Row: {
          animation_intensity:
            | Database["public"]["Enums"]["animation_intensity"]
            | null
          created_at: string | null
          heavy_3d_enabled: boolean | null
          id: string
          mobile_effects_mode:
            | Database["public"]["Enums"]["mobile_effects_mode"]
            | null
          preloader_enabled: boolean | null
          sounds_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          animation_intensity?:
            | Database["public"]["Enums"]["animation_intensity"]
            | null
          created_at?: string | null
          heavy_3d_enabled?: boolean | null
          id?: string
          mobile_effects_mode?:
            | Database["public"]["Enums"]["mobile_effects_mode"]
            | null
          preloader_enabled?: boolean | null
          sounds_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          animation_intensity?:
            | Database["public"]["Enums"]["animation_intensity"]
            | null
          created_at?: string | null
          heavy_3d_enabled?: boolean | null
          id?: string
          mobile_effects_mode?:
            | Database["public"]["Enums"]["mobile_effects_mode"]
            | null
          preloader_enabled?: boolean | null
          sounds_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hero_sections: {
        Row: {
          created_at: string | null
          cta_link: string | null
          cta_text: string | null
          headline: string
          id: string
          is_active: boolean | null
          subheadline: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          headline: string
          id?: string
          is_active?: boolean | null
          subheadline?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          headline?: string
          id?: string
          is_active?: boolean | null
          subheadline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_links: {
        Row: {
          created_at: string | null
          id: string
          link_title: string
          link_url: string
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          link_title: string
          link_url: string
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          link_title?: string
          link_url?: string
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_links_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_media: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          media_type: string
          media_url: string
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          media_type: string
          media_url: string
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          media_type?: string
          media_url?: string
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          display_order: number | null
          end_date: string | null
          featured: boolean | null
          github_url: string | null
          id: string
          live_url: string | null
          long_description: string | null
          project_type: string
          short_description: string
          slug: string
          source_repo_full_name: string | null
          source_type: Database["public"]["Enums"]["source_type"] | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          tech_stack: string[] | null
          thumbnail_url: string
          title: string
          updated_at: string | null
          visibility: boolean | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          end_date?: string | null
          featured?: boolean | null
          github_url?: string | null
          id?: string
          live_url?: string | null
          long_description?: string | null
          project_type: string
          short_description: string
          slug: string
          source_repo_full_name?: string | null
          source_type?: Database["public"]["Enums"]["source_type"] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          tech_stack?: string[] | null
          thumbnail_url: string
          title: string
          updated_at?: string | null
          visibility?: boolean | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          end_date?: string | null
          featured?: boolean | null
          github_url?: string | null
          id?: string
          live_url?: string | null
          long_description?: string | null
          project_type?: string
          short_description?: string
          slug?: string
          source_repo_full_name?: string | null
          source_type?: Database["public"]["Enums"]["source_type"] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          tech_stack?: string[] | null
          thumbnail_url?: string
          title?: string
          updated_at?: string | null
          visibility?: boolean | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          id: string
          name: string
          resume_url: string | null
          seo_defaults: Json | null
          tagline: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          resume_url?: string | null
          seo_defaults?: Json | null
          tagline?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          resume_url?: string | null
          seo_defaults?: Json | null
          tagline?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string | null
          display_order: number | null
          icon_url: string | null
          id: string
          name: string
          proficiency_level: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          display_order?: number | null
          icon_url?: string | null
          id?: string
          name: string
          proficiency_level?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          display_order?: number | null
          icon_url?: string | null
          id?: string
          name?: string
          proficiency_level?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon_url: string | null
          id: string
          platform: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon_url?: string | null
          id?: string
          platform: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon_url?: string | null
          id?: string
          platform?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
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
      admin_role: "owner" | "admin" | "editor"
      animation_intensity: "low" | "medium" | "high"
      mobile_effects_mode: "adaptive" | "reduced" | "off"
      project_status: "completed" | "in_progress" | "planned"
      source_type: "manual" | "github"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      admin_role: ["owner", "admin", "editor"],
      animation_intensity: ["low", "medium", "high"],
      mobile_effects_mode: ["adaptive", "reduced", "off"],
      project_status: ["completed", "in_progress", "planned"],
      source_type: ["manual", "github"],
    },
  },
} as const

