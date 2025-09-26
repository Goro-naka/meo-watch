export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      api_usage_logs: {
        Row: {
          created_at: string | null;
          endpoint: string;
          id: string;
          ip_address: unknown | null;
          method: string;
          response_time: number | null;
          status_code: number | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          endpoint: string;
          id?: string;
          ip_address?: unknown | null;
          method: string;
          response_time?: number | null;
          status_code?: number | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          endpoint?: string;
          id?: string;
          ip_address?: unknown | null;
          method?: string;
          response_time?: number | null;
          status_code?: number | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "api_usage_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      competitor_businesses: {
        Row: {
          address: string | null;
          business_name: string;
          business_type: string | null;
          created_at: string | null;
          id: string;
          keyword_id: string | null;
          phone: string | null;
          place_id: string;
          rank_position: number;
          ranking_data_id: string | null;
          rating: number | null;
          review_count: number | null;
          website: string | null;
        };
        Insert: {
          address?: string | null;
          business_name: string;
          business_type?: string | null;
          created_at?: string | null;
          id?: string;
          keyword_id?: string | null;
          phone?: string | null;
          place_id: string;
          rank_position: number;
          ranking_data_id?: string | null;
          rating?: number | null;
          review_count?: number | null;
          website?: string | null;
        };
        Update: {
          address?: string | null;
          business_name?: string;
          business_type?: string | null;
          created_at?: string | null;
          id?: string;
          keyword_id?: string | null;
          phone?: string | null;
          place_id?: string;
          rank_position?: number;
          ranking_data_id?: string | null;
          rating?: number | null;
          review_count?: number | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "competitor_businesses_keyword_id_fkey";
            columns: ["keyword_id"];
            isOneToOne: false;
            referencedRelation: "keywords";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "competitor_businesses_ranking_data_id_fkey";
            columns: ["ranking_data_id"];
            isOneToOne: false;
            referencedRelation: "ranking_data";
            referencedColumns: ["id"];
          },
        ];
      };
      export_logs: {
        Row: {
          created_at: string | null;
          download_url: string | null;
          end_date: string | null;
          expires_at: string | null;
          export_type: string;
          file_path: string | null;
          file_size: number | null;
          id: string;
          include_competitors: boolean | null;
          keyword_ids: string[] | null;
          start_date: string | null;
          status: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          download_url?: string | null;
          end_date?: string | null;
          expires_at?: string | null;
          export_type: string;
          file_path?: string | null;
          file_size?: number | null;
          id?: string;
          include_competitors?: boolean | null;
          keyword_ids?: string[] | null;
          start_date?: string | null;
          status?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          download_url?: string | null;
          end_date?: string | null;
          expires_at?: string | null;
          export_type?: string;
          file_path?: string | null;
          file_size?: number | null;
          id?: string;
          include_competitors?: boolean | null;
          keyword_ids?: string[] | null;
          start_date?: string | null;
          status?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "export_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      job_queue: {
        Row: {
          attempts: number | null;
          completed_at: string | null;
          created_at: string | null;
          error_message: string | null;
          id: string;
          job_type: string;
          max_attempts: number | null;
          payload: Json;
          priority: number | null;
          scheduled_for: string | null;
          started_at: string | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          attempts?: number | null;
          completed_at?: string | null;
          created_at?: string | null;
          error_message?: string | null;
          id?: string;
          job_type: string;
          max_attempts?: number | null;
          payload: Json;
          priority?: number | null;
          scheduled_for?: string | null;
          started_at?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          attempts?: number | null;
          completed_at?: string | null;
          created_at?: string | null;
          error_message?: string | null;
          id?: string;
          job_type?: string;
          max_attempts?: number | null;
          payload?: Json;
          priority?: number | null;
          scheduled_for?: string | null;
          started_at?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      keywords: {
        Row: {
          business_name: string;
          business_place_id: string | null;
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          keyword: string;
          target_location: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          business_name: string;
          business_place_id?: string | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          keyword: string;
          target_location: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          business_name?: string;
          business_place_id?: string | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          keyword?: string;
          target_location?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "keywords_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      ranking_data: {
        Row: {
          created_at: string | null;
          id: string;
          keyword_id: string | null;
          rank_position: number | null;
          search_date: string;
          search_location: string | null;
          total_results: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          keyword_id?: string | null;
          rank_position?: number | null;
          search_date: string;
          search_location?: string | null;
          total_results?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          keyword_id?: string | null;
          rank_position?: number | null;
          search_date?: string;
          search_location?: string | null;
          total_results?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "ranking_data_keyword_id_fkey";
            columns: ["keyword_id"];
            isOneToOne: false;
            referencedRelation: "keywords";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null;
          created_at: string | null;
          current_period_end: string | null;
          current_period_start: string | null;
          id: string;
          plan: Database["public"]["Enums"]["subscription_plan"];
          status: Database["public"]["Enums"]["subscription_status"];
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          cancel_at_period_end?: boolean | null;
          created_at?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          plan?: Database["public"]["Enums"]["subscription_plan"];
          status?: Database["public"]["Enums"]["subscription_status"];
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          cancel_at_period_end?: boolean | null;
          created_at?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          plan?: Database["public"]["Enums"]["subscription_plan"];
          status?: Database["public"]["Enums"]["subscription_status"];
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      system_settings: {
        Row: {
          description: string | null;
          key: string;
          updated_at: string | null;
          value: Json;
        };
        Insert: {
          description?: string | null;
          key: string;
          updated_at?: string | null;
          value: Json;
        };
        Update: {
          description?: string | null;
          key?: string;
          updated_at?: string | null;
          value?: Json;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          avatar_url: string | null;
          business_address: string | null;
          business_name: string | null;
          business_phone: string | null;
          created_at: string | null;
          email: string;
          id: string;
          name: string;
          timezone: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          business_address?: string | null;
          business_name?: string | null;
          business_phone?: string | null;
          created_at?: string | null;
          email: string;
          id: string;
          name: string;
          timezone?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          business_address?: string | null;
          business_name?: string | null;
          business_phone?: string | null;
          created_at?: string | null;
          email?: string;
          id?: string;
          name?: string;
          timezone?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      subscription_plan: "starter" | "business" | "professional";
      subscription_status:
        | "active"
        | "canceled"
        | "past_due"
        | "incomplete"
        | "trialing";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      subscription_plan: ["starter", "business", "professional"],
      subscription_status: [
        "active",
        "canceled",
        "past_due",
        "incomplete",
        "trialing",
      ],
    },
  },
} as const;
