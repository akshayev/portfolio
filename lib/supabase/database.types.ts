export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
      };
      about: {
        Row: {
          bio: string;
          created_at: string;
          id: string;
          location: string | null;
          updated_at: string;
        };
        Insert: {
          bio: string;
          created_at?: string;
          id?: string;
          location?: string | null;
          updated_at?: string;
        };
        Update: {
          bio?: string;
          created_at?: string;
          id?: string;
          location?: string | null;
          updated_at?: string;
        };
      };
      certifications: {
        Row: {
          created_at: string;
          credential_url: string | null;
          id: string;
          issued_on: string | null;
          issuer: string;
          position: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          credential_url?: string | null;
          id?: string;
          issued_on?: string | null;
          issuer: string;
          position?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          credential_url?: string | null;
          id?: string;
          issued_on?: string | null;
          issuer?: string;
          position?: number;
          title?: string;
          updated_at?: string;
        };
      };
      education: {
        Row: {
          created_at: string;
          degree: string;
          end_date: string | null;
          field_of_study: string | null;
          id: string;
          institution: string;
          location: string | null;
          position: number;
          start_date: string | null;
          summary: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          degree: string;
          end_date?: string | null;
          field_of_study?: string | null;
          id?: string;
          institution: string;
          location?: string | null;
          position?: number;
          start_date?: string | null;
          summary?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          degree?: string;
          end_date?: string | null;
          field_of_study?: string | null;
          id?: string;
          institution?: string;
          location?: string | null;
          position?: number;
          start_date?: string | null;
          summary?: string | null;
          updated_at?: string;
        };
      };
      experience: {
        Row: {
          company: string;
          created_at: string;
          end_date: string | null;
          id: string;
          link_url: string | null;
          location: string | null;
          position: number;
          role: string;
          start_date: string | null;
          summary: string | null;
          updated_at: string;
        };
        Insert: {
          company: string;
          created_at?: string;
          end_date?: string | null;
          id?: string;
          link_url?: string | null;
          location?: string | null;
          position?: number;
          role: string;
          start_date?: string | null;
          summary?: string | null;
          updated_at?: string;
        };
        Update: {
          company?: string;
          created_at?: string;
          end_date?: string | null;
          id?: string;
          link_url?: string | null;
          location?: string | null;
          position?: number;
          role?: string;
          start_date?: string | null;
          summary?: string | null;
          updated_at?: string;
        };
      };
      hero: {
        Row: {
          created_at: string;
          cta_label: string;
          cta_url: string;
          headline: string;
          id: string;
          portrait_url: string | null;
          subheadline: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          cta_label: string;
          cta_url: string;
          headline: string;
          id?: string;
          portrait_url?: string | null;
          subheadline: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          cta_label?: string;
          cta_url?: string;
          headline?: string;
          id?: string;
          portrait_url?: string | null;
          subheadline?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          created_at: string;
          featured: boolean;
          id: string;
          media_type: string;
          position: number;
          project_url: string | null;
          repo_url: string | null;
          summary: string;
          tech_stack: string[];
          thumbnail_url: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          featured?: boolean;
          id?: string;
          media_type?: string;
          position?: number;
          project_url?: string | null;
          repo_url?: string | null;
          summary: string;
          tech_stack?: string[];
          thumbnail_url?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          featured?: boolean;
          id?: string;
          media_type?: string;
          position?: number;
          project_url?: string | null;
          repo_url?: string | null;
          summary?: string;
          tech_stack?: string[];
          thumbnail_url?: string | null;
          title?: string;
          updated_at?: string;
        };
      };
      publications: {
        Row: {
          created_at: string;
          id: string;
          position: number;
          published_on: string | null;
          publisher: string;
          summary: string | null;
          title: string;
          updated_at: string;
          url: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          position?: number;
          published_on?: string | null;
          publisher: string;
          summary?: string | null;
          title: string;
          updated_at?: string;
          url?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          position?: number;
          published_on?: string | null;
          publisher?: string;
          summary?: string | null;
          title?: string;
          updated_at?: string;
          url?: string | null;
        };
      };
      settings: {
        Row: {
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string;
          id: string;
          location: string | null;
          site_tagline: string | null;
          site_title: string;
          social_github: string | null;
          social_linkedin: string | null;
          social_x: string | null;
          updated_at: string;
          visual_glow_strength: number;
          visual_grain_opacity: number;
        };
        Insert: {
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          id?: string;
          location?: string | null;
          site_tagline?: string | null;
          site_title: string;
          social_github?: string | null;
          social_linkedin?: string | null;
          social_x?: string | null;
          updated_at?: string;
          visual_glow_strength?: number;
          visual_grain_opacity?: number;
        };
        Update: {
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          id?: string;
          location?: string | null;
          site_tagline?: string | null;
          site_title?: string;
          social_github?: string | null;
          social_linkedin?: string | null;
          social_x?: string | null;
          updated_at?: string;
          visual_glow_strength?: number;
          visual_grain_opacity?: number;
        };
      };
      skills: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          position: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          position?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          position?: number;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TableInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TableUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
