export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cards: {
        Row: {
          id: string
          created_at?: string | null
          user_id: string
          front_title: string
          front_text: string
          back_title: string
          back_task: string
          back_text: string
          category: string
        }
        Insert: {
          id?: string
          created_at?: string | null
          user_id: string
          front_title: string
          front_text: string
          back_title: string
          back_task: string
          back_text: string
          category: string
        }
        Update: {
          id?: string
          created_at?: string | null
          user_id?: string
          front_title?: string
          front_text?: string
          back_title?: string
          back_task?: string
          back_text?: string
          category?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_favorites: {
        Row: {
          id: number
          created_at?: string | null
          user_id: string
          card_id: string
        }
        Insert: {
          id?: number
          created_at?: string | null
          user_id: string
          card_id: string
        }
        Update: {
          id?: number
          created_at?: string | null
          user_id?: string
          card_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
