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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          workspace_id: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          workspace_id?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_batches: {
        Row: {
          created_at: string
          id: string
          period_end: string
          period_start: string
          status: Database["public"]["Enums"]["billing_batch_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          status?: Database["public"]["Enums"]["billing_batch_status"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          status?: Database["public"]["Enums"]["billing_batch_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      billing_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          payload_json: Json
          stripe_event_id: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          payload_json: Json
          stripe_event_id: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          payload_json?: Json
          stripe_event_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_items: {
        Row: {
          billing_status: string
          client_id: string
          created_at: string | null
          created_by: string | null
          id: string
          invoice_id: string | null
          line_total: number
          missing_rate: boolean
          paid_amount: number | null
          provider_id: string | null
          quantity: number
          rate_amount: number
          remaining_amount: number | null
          service_date: string
          service_record_id: string | null
          service_template_id: string | null
          workspace_id: string
        }
        Insert: {
          billing_status?: string
          client_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          line_total?: number
          missing_rate?: boolean
          paid_amount?: number | null
          provider_id?: string | null
          quantity?: number
          rate_amount?: number
          remaining_amount?: number | null
          service_date: string
          service_record_id?: string | null
          service_template_id?: string | null
          workspace_id: string
        }
        Update: {
          billing_status?: string
          client_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          line_total?: number
          missing_rate?: boolean
          paid_amount?: number | null
          provider_id?: string | null
          quantity?: number
          rate_amount?: number
          remaining_amount?: number | null
          service_date?: string
          service_record_id?: string | null
          service_template_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_items_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_items_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "staff_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_items_service_record_id_fkey"
            columns: ["service_record_id"]
            isOneToOne: true
            referencedRelation: "service_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_items_service_template_id_fkey"
            columns: ["service_template_id"]
            isOneToOne: false
            referencedRelation: "service_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_items_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_logs: {
        Row: {
          campaign_id: string | null
          clicked_at: string | null
          email: string
          id: string
          metadata: Json | null
          opened_at: string | null
          resend_id: string | null
          sent_at: string | null
          sequence_id: string | null
          status: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          clicked_at?: string | null
          email: string
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          resend_id?: string | null
          sent_at?: string | null
          sequence_id?: string | null
          status?: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          clicked_at?: string | null
          email?: string
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          resend_id?: string | null
          sent_at?: string | null
          sequence_id?: string | null
          status?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_logs_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "campaign_sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_sequences: {
        Row: {
          body_html: string
          body_text: string | null
          campaign_id: string | null
          created_at: string | null
          delay_days: number
          enabled: boolean | null
          id: string
          sequence_order: number
          subject: string
          updated_at: string | null
        }
        Insert: {
          body_html: string
          body_text?: string | null
          campaign_id?: string | null
          created_at?: string | null
          delay_days?: number
          enabled?: boolean | null
          id?: string
          sequence_order: number
          subject: string
          updated_at?: string | null
        }
        Update: {
          body_html?: string
          body_text?: string | null
          campaign_id?: string | null
          created_at?: string | null
          delay_days?: number
          enabled?: boolean | null
          id?: string
          sequence_order?: number
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_sequences_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          audience_rules: Json | null
          campaign_type: string
          created_at: string | null
          id: string
          name: string
          sender_identity: string
          status: string
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          audience_rules?: Json | null
          campaign_type: string
          created_at?: string | null
          id?: string
          name: string
          sender_identity?: string
          status?: string
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          audience_rules?: Json | null
          campaign_type?: string
          created_at?: string | null
          id?: string
          name?: string
          sender_identity?: string
          status?: string
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      client_document_versions: {
        Row: {
          created_at: string | null
          document_id: string | null
          file_name: string
          id: string
          mime_type: string | null
          public_url: string | null
          size: number | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          file_name: string
          id?: string
          mime_type?: string | null
          public_url?: string | null
          size?: number | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          file_name?: string
          id?: string
          mime_type?: string | null
          public_url?: string | null
          size?: number | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      client_note_attachments: {
        Row: {
          client_id: string | null
          contact_id: string | null
          created_at: string | null
          file_name: string
          id: string
          mime_type: string | null
          note_id: string | null
          public_url: string | null
          size: number | null
          staff_id: string | null
          storage_path: string
          uploaded_by: string | null
          workspace_id: string | null
        }
        Insert: {
          client_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          file_name: string
          id?: string
          mime_type?: string | null
          note_id?: string | null
          public_url?: string | null
          size?: number | null
          staff_id?: string | null
          storage_path: string
          uploaded_by?: string | null
          workspace_id?: string | null
        }
        Update: {
          client_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          file_name?: string
          id?: string
          mime_type?: string | null
          note_id?: string | null
          public_url?: string | null
          size?: number | null
          staff_id?: string | null
          storage_path?: string
          uploaded_by?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_note_attachments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_note_attachments_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_note_attachments_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "client_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_note_attachments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_note_attachments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      client_notes: {
        Row: {
          attachments: Json | null
          author_id: string | null
          client_id: string | null
          contact_id: string | null
          content: string
          created_at: string | null
          external_id: string | null
          id: string
          note_type: string
          parent_note_id: string | null
          staff_id: string | null
          title: string
          workspace_id: string | null
        }
        Insert: {
          attachments?: Json | null
          author_id?: string | null
          client_id?: string | null
          contact_id?: string | null
          content: string
          created_at?: string | null
          external_id?: string | null
          id?: string
          note_type: string
          parent_note_id?: string | null
          staff_id?: string | null
          title: string
          workspace_id?: string | null
        }
        Update: {
          attachments?: Json | null
          author_id?: string | null
          client_id?: string | null
          contact_id?: string | null
          content?: string
          created_at?: string | null
          external_id?: string | null
          id?: string
          note_type?: string
          parent_note_id?: string | null
          staff_id?: string | null
          title?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_notes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_notes_parent_note_id_fkey"
            columns: ["parent_note_id"]
            isOneToOne: false
            referencedRelation: "client_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_notes_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_notes_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          case_number: string | null
          city: string | null
          created_at: string | null
          date_joined: string | null
          dob: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          external_id: string | null
          first_name: string
          id: string
          language_preference: string | null
          last_name: string
          mailing_city: string | null
          mailing_same_as_physical: boolean | null
          mailing_state: string | null
          mailing_street_address: string | null
          mailing_zip_code: string | null
          password_hash: string | null
          phone: string | null
          preferred_contact_method: string | null
          preferred_name: string | null
          saved_password: string | null
          saved_username: string | null
          state: string | null
          status: Database["public"]["Enums"]["client_status"] | null
          street_address: string | null
          tags: string[] | null
          username: string | null
          workspace_id: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          case_number?: string | null
          city?: string | null
          created_at?: string | null
          date_joined?: string | null
          dob?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          external_id?: string | null
          first_name: string
          id?: string
          language_preference?: string | null
          last_name: string
          mailing_city?: string | null
          mailing_same_as_physical?: boolean | null
          mailing_state?: string | null
          mailing_street_address?: string | null
          mailing_zip_code?: string | null
          password_hash?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          preferred_name?: string | null
          saved_password?: string | null
          saved_username?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["client_status"] | null
          street_address?: string | null
          tags?: string[] | null
          username?: string | null
          workspace_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          case_number?: string | null
          city?: string | null
          created_at?: string | null
          date_joined?: string | null
          dob?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          external_id?: string | null
          first_name?: string
          id?: string
          language_preference?: string | null
          last_name?: string
          mailing_city?: string | null
          mailing_same_as_physical?: boolean | null
          mailing_state?: string | null
          mailing_street_address?: string | null
          mailing_zip_code?: string | null
          password_hash?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          preferred_name?: string | null
          saved_password?: string | null
          saved_username?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["client_status"] | null
          street_address?: string | null
          tags?: string[] | null
          username?: string | null
          workspace_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          active: boolean | null
          address: string | null
          client_id: string | null
          created_at: string | null
          dob: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          external_id: string | null
          first_name: string
          id: string
          language: string | null
          last_name: string
          metadata: Json | null
          organization: string | null
          phone: string | null
          preferred_contact_method: string | null
          relationship: string | null
          workspace_id: string
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          client_id?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          external_id?: string | null
          first_name: string
          id?: string
          language?: string | null
          last_name: string
          metadata?: Json | null
          organization?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          relationship?: string | null
          workspace_id: string
        }
        Update: {
          active?: boolean | null
          address?: string | null
          client_id?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          external_id?: string | null
          first_name?: string
          id?: string
          language?: string | null
          last_name?: string
          metadata?: Json | null
          organization?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          relationship?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_members: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_members_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          name: string | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          name?: string | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          name?: string | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      credentials: {
        Row: {
          created_at: string
          credential_type: string
          document_url: string | null
          expires_at: string | null
          id: string
          issued_at: string | null
          notes: string | null
          person_id: string
          status: Database["public"]["Enums"]["credential_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_type: string
          document_url?: string | null
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          notes?: string | null
          person_id: string
          status?: Database["public"]["Enums"]["credential_status"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_type?: string
          document_url?: string | null
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          notes?: string | null
          person_id?: string
          status?: Database["public"]["Enums"]["credential_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          client_id: string | null
          contact_id: string | null
          created_at: string | null
          effective_date: string | null
          expiration_date: string | null
          external_id: string | null
          file_name: string
          id: string
          mime_type: string | null
          public_url: string | null
          size: number | null
          staff_id: string | null
          status: string | null
          storage_path: string
          uploaded_by: string | null
          workspace_id: string | null
        }
        Insert: {
          category?: string | null
          client_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          effective_date?: string | null
          expiration_date?: string | null
          external_id?: string | null
          file_name: string
          id?: string
          mime_type?: string | null
          public_url?: string | null
          size?: number | null
          staff_id?: string | null
          status?: string | null
          storage_path: string
          uploaded_by?: string | null
          workspace_id?: string | null
        }
        Update: {
          category?: string | null
          client_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          effective_date?: string | null
          expiration_date?: string | null
          external_id?: string | null
          file_name?: string
          id?: string
          mime_type?: string | null
          public_url?: string | null
          size?: number | null
          staff_id?: string | null
          status?: string | null
          storage_path?: string
          uploaded_by?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaign_recipients: {
        Row: {
          campaign_id: string
          clicked_at: string | null
          email: string
          error_message: string | null
          id: string
          name: string | null
          opened_at: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          campaign_id: string
          clicked_at?: string | null
          email: string
          error_message?: string | null
          id?: string
          name?: string | null
          opened_at?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          campaign_id?: string
          clicked_at?: string | null
          email?: string
          error_message?: string | null
          id?: string
          name?: string | null
          opened_at?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_campaign_recipients_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          name: string
          recipient_type: string
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          recipient_type: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          recipient_type?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          category: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          subject: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          body: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          subject: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          body?: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          subject?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: []
      }
      emails_sent: {
        Row: {
          client_id: string | null
          error_message: string | null
          id: string
          recipient: string
          sender_email: string
          sent_at: string | null
          status: string
          subject: string
          template_id: string | null
          template_name: string | null
          workspace_id: string
        }
        Insert: {
          client_id?: string | null
          error_message?: string | null
          id?: string
          recipient: string
          sender_email: string
          sent_at?: string | null
          status: string
          subject: string
          template_id?: string | null
          template_name?: string | null
          workspace_id: string
        }
        Update: {
          client_id?: string | null
          error_message?: string | null
          id?: string
          recipient?: string
          sender_email?: string
          sent_at?: string | null
          status?: string
          subject?: string
          template_id?: string | null
          template_name?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emails_sent_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_sent_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_sent_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      hipaa_acknowledgments: {
        Row: {
          acknowledged_at: string | null
          id: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          id?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          acknowledged_at?: string | null
          id?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hipaa_acknowledgments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      import_job_rows: {
        Row: {
          created_at: string | null
          errors_json: Json | null
          id: string
          job_id: string
          previous_data_snapshot: Json | null
          record_id_created_or_updated: string | null
          row_number: number
          status: string
        }
        Insert: {
          created_at?: string | null
          errors_json?: Json | null
          id?: string
          job_id: string
          previous_data_snapshot?: Json | null
          record_id_created_or_updated?: string | null
          row_number: number
          status: string
        }
        Update: {
          created_at?: string | null
          errors_json?: Json | null
          id?: string
          job_id?: string
          previous_data_snapshot?: Json | null
          record_id_created_or_updated?: string | null
          row_number?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_job_rows_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "import_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      import_jobs: {
        Row: {
          created_at: string | null
          created_by: string
          entity_type: string
          error_report_url: string | null
          failed_count: number | null
          finished_at: string | null
          id: string
          imported_count: number | null
          mapping_profile_id: string | null
          rollback_available: boolean | null
          skipped_count: number | null
          started_at: string | null
          status: string
          total_rows: number | null
          updated_at: string | null
          updated_count: number | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          entity_type: string
          error_report_url?: string | null
          failed_count?: number | null
          finished_at?: string | null
          id?: string
          imported_count?: number | null
          mapping_profile_id?: string | null
          rollback_available?: boolean | null
          skipped_count?: number | null
          started_at?: string | null
          status?: string
          total_rows?: number | null
          updated_at?: string | null
          updated_count?: number | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          entity_type?: string
          error_report_url?: string | null
          failed_count?: number | null
          finished_at?: string | null
          id?: string
          imported_count?: number | null
          mapping_profile_id?: string | null
          rollback_available?: boolean | null
          skipped_count?: number | null
          started_at?: string | null
          status?: string
          total_rows?: number | null
          updated_at?: string | null
          updated_count?: number | null
          workspace_id?: string
        }
        Relationships: []
      }
      invites: {
        Row: {
          created_at: string | null
          email: string | null
          expires_at: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["workspace_role"]
          status: string | null
          token: string
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          expires_at: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["workspace_role"]
          status?: string | null
          token?: string
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          expires_at?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["workspace_role"]
          status?: string | null
          token?: string
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invites_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_lines: {
        Row: {
          description: string | null
          id: string
          invoice_id: string | null
          line_total: number | null
          qty: number | null
          rate: number | null
          service_event_id: string | null
          workspace_id: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          invoice_id?: string | null
          line_total?: number | null
          qty?: number | null
          rate?: number | null
          service_event_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          invoice_id?: string | null
          line_total?: number | null
          qty?: number | null
          rate?: number | null
          service_event_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_lines_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_lines_service_event_id_fkey"
            columns: ["service_event_id"]
            isOneToOne: false
            referencedRelation: "service_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_lines_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number | null
          amount_remaining: number | null
          client_id: string | null
          created_at: string | null
          due_date: string | null
          id: string
          invoice_number: string
          paid_at: string | null
          pdf_url: string | null
          period_end: string | null
          period_start: string | null
          sent_at: string | null
          status: string | null
          subtotal: number | null
          workspace_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          amount_remaining?: number | null
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          paid_at?: string | null
          pdf_url?: string | null
          period_end?: string | null
          period_start?: string | null
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          workspace_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          amount_remaining?: number | null
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          paid_at?: string | null
          pdf_url?: string | null
          period_end?: string | null
          period_start?: string | null
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company_name: string
          contact_person: string
          created_at: string | null
          email: string
          id: string
          notes: string | null
          phone: string | null
          source: string | null
          status: string | null
        }
        Insert: {
          company_name: string
          contact_person: string
          created_at?: string | null
          email: string
          id?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
        }
        Update: {
          company_name?: string
          contact_person?: string
          created_at?: string | null
          email?: string
          id?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
        }
        Relationships: []
      }
      mapping_profiles: {
        Row: {
          created_at: string | null
          entity_type: string
          id: string
          mapping_json: Json
          name: string
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          entity_type: string
          id?: string
          mapping_json: Json
          name: string
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          entity_type?: string
          id?: string
          mapping_json?: Json
          name?: string
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          sender_id: string
          workspace_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          sender_id: string
          workspace_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          sender_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string | null
          reference_id: string | null
          reference_type: string | null
          tenant_id: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          reference_id?: string | null
          reference_type?: string | null
          tenant_id: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          reference_id?: string | null
          reference_type?: string | null
          tenant_id?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payroll_config: {
        Row: {
          created_at: string | null
          default_hourly_rate: number | null
          id: string
          overtime_multiplier: number | null
          overtime_threshold_hours: number | null
          pay_period_type: Database["public"]["Enums"]["pay_period_type"] | null
          quickbooks_company_id: string | null
          quickbooks_connected_at: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_hourly_rate?: number | null
          id?: string
          overtime_multiplier?: number | null
          overtime_threshold_hours?: number | null
          pay_period_type?:
            | Database["public"]["Enums"]["pay_period_type"]
            | null
          quickbooks_company_id?: string | null
          quickbooks_connected_at?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_hourly_rate?: number | null
          id?: string
          overtime_multiplier?: number | null
          overtime_threshold_hours?: number | null
          pay_period_type?:
            | Database["public"]["Enums"]["pay_period_type"]
            | null
          quickbooks_company_id?: string | null
          quickbooks_connected_at?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payroll_item_events: {
        Row: {
          created_at: string | null
          hours_worked: number
          id: string
          is_overtime: boolean | null
          payroll_item_id: string
          rate_applied: number
          service_event_id: string
        }
        Insert: {
          created_at?: string | null
          hours_worked: number
          id?: string
          is_overtime?: boolean | null
          payroll_item_id: string
          rate_applied: number
          service_event_id: string
        }
        Update: {
          created_at?: string | null
          hours_worked?: number
          id?: string
          is_overtime?: boolean | null
          payroll_item_id?: string
          rate_applied?: number
          service_event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_item_events_payroll_item_id_fkey"
            columns: ["payroll_item_id"]
            isOneToOne: false
            referencedRelation: "payroll_items"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_items: {
        Row: {
          created_at: string | null
          event_count: number | null
          hourly_rate: number
          id: string
          notes: string | null
          overtime_hours: number
          overtime_pay: number
          overtime_rate: number | null
          payroll_run_id: string
          provider_id: string
          quickbooks_time_activity_id: string | null
          regular_hours: number
          regular_pay: number
          tenant_id: string
          total_pay: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_count?: number | null
          hourly_rate: number
          id?: string
          notes?: string | null
          overtime_hours?: number
          overtime_pay?: number
          overtime_rate?: number | null
          payroll_run_id: string
          provider_id: string
          quickbooks_time_activity_id?: string | null
          regular_hours?: number
          regular_pay?: number
          tenant_id: string
          total_pay: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_count?: number | null
          hourly_rate?: number
          id?: string
          notes?: string | null
          overtime_hours?: number
          overtime_pay?: number
          overtime_rate?: number | null
          payroll_run_id?: string
          provider_id?: string
          quickbooks_time_activity_id?: string | null
          regular_hours?: number
          regular_pay?: number
          tenant_id?: string
          total_pay?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_items_payroll_run_id_fkey"
            columns: ["payroll_run_id"]
            isOneToOne: false
            referencedRelation: "payroll_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_runs: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          created_by: string
          id: string
          notes: string | null
          period_end: string
          period_start: string
          provider_count: number | null
          quickbooks_batch_id: string | null
          status: Database["public"]["Enums"]["payroll_run_status"] | null
          synced_to_quickbooks_at: string | null
          tenant_id: string
          total_amount: number | null
          total_hours: number | null
          total_overtime_hours: number | null
          total_regular_hours: number | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          notes?: string | null
          period_end: string
          period_start: string
          provider_count?: number | null
          quickbooks_batch_id?: string | null
          status?: Database["public"]["Enums"]["payroll_run_status"] | null
          synced_to_quickbooks_at?: string | null
          tenant_id: string
          total_amount?: number | null
          total_hours?: number | null
          total_overtime_hours?: number | null
          total_regular_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          notes?: string | null
          period_end?: string
          period_start?: string
          provider_count?: number | null
          quickbooks_batch_id?: string | null
          status?: Database["public"]["Enums"]["payroll_run_status"] | null
          synced_to_quickbooks_at?: string | null
          tenant_id?: string
          total_amount?: number | null
          total_hours?: number | null
          total_overtime_hours?: number | null
          total_regular_hours?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      person_documents: {
        Row: {
          created_at: string
          document_type: string | null
          file_name: string
          file_type: string | null
          file_url: string
          id: string
          person_id: string
          tenant_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          document_type?: string | null
          file_name: string
          file_type?: string | null
          file_url: string
          id?: string
          person_id: string
          tenant_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string | null
          file_name?: string
          file_type?: string | null
          file_url?: string
          id?: string
          person_id?: string
          tenant_id?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      person_notes: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          id: string
          person_id: string
          tenant_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          person_id: string
          tenant_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          person_id?: string
          tenant_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      program_facilitators: {
        Row: {
          created_at: string | null
          id: string
          program_id: string
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          program_id: string
          role: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          program_id?: string
          role?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_facilitators_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_facilitators_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      program_instances: {
        Row: {
          client_id: string | null
          created_at: string | null
          end_date: string | null
          id: string
          milestones: Json | null
          name: string
          program_id: string | null
          start_date: string | null
          status: string | null
          workspace_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          milestones?: Json | null
          name: string
          program_id?: string | null
          start_date?: string | null
          status?: string | null
          workspace_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          milestones?: Json | null
          name?: string
          program_id?: string | null
          start_date?: string | null
          status?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_instances_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_instances_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_instances_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      program_milestones: {
        Row: {
          created_at: string | null
          id: string
          program_id: string
          title: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          program_id: string
          title: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          program_id?: string
          title?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_milestones_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_milestones_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_pay_rates: {
        Row: {
          created_at: string | null
          effective_from: string
          effective_to: string | null
          hourly_rate: number
          id: string
          notes: string | null
          provider_id: string
          quickbooks_employee_id: string | null
          service_template_id: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          effective_from: string
          effective_to?: string | null
          hourly_rate: number
          id?: string
          notes?: string | null
          provider_id: string
          quickbooks_employee_id?: string | null
          service_template_id?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          effective_from?: string
          effective_to?: string | null
          hourly_rate?: number
          id?: string
          notes?: string | null
          provider_id?: string
          quickbooks_employee_id?: string | null
          service_template_id?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      queue_entries: {
        Row: {
          created_at: string | null
          created_by_user_id: string | null
          first_name: string
          id: string
          last_name: string
          location_tag: string | null
          phone: string
          source: string | null
          status: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by_user_id?: string | null
          first_name: string
          id?: string
          last_name: string
          location_tag?: string | null
          phone: string
          source?: string | null
          status?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by_user_id?: string | null
          first_name?: string
          id?: string
          last_name?: string
          location_tag?: string | null
          phone?: string
          source?: string | null
          status?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "queue_entries_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      quickbooks_connections: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: string
          id: string
          realm_id: string
          refresh_token: string
          refresh_token_expires_at: string
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at: string
          id?: string
          realm_id: string
          refresh_token: string
          refresh_token_expires_at: string
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          realm_id?: string
          refresh_token?: string
          refresh_token_expires_at?: string
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quickbooks_connections_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      quickbooks_tokens: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: string
          id: string
          realm_id: string
          refresh_token: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at: string
          id?: string
          realm_id: string
          refresh_token: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          realm_id?: string
          refresh_token?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_events: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          client_id: string | null
          created_at: string | null
          date: string
          end_time: string | null
          external_id: string | null
          id: string
          location: string | null
          recurrence_rule: string | null
          recurrence_series_id: string | null
          rejection_reason: string | null
          service_template_id: string | null
          service_type_id: string | null
          staff_user_id: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          submitted_at: string | null
          units: number | null
          workspace_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          client_id?: string | null
          created_at?: string | null
          date: string
          end_time?: string | null
          external_id?: string | null
          id?: string
          location?: string | null
          recurrence_rule?: string | null
          recurrence_series_id?: string | null
          rejection_reason?: string | null
          service_template_id?: string | null
          service_type_id?: string | null
          staff_user_id?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          submitted_at?: string | null
          units?: number | null
          workspace_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          client_id?: string | null
          created_at?: string | null
          date?: string
          end_time?: string | null
          external_id?: string | null
          id?: string
          location?: string | null
          recurrence_rule?: string | null
          recurrence_series_id?: string | null
          rejection_reason?: string | null
          service_template_id?: string | null
          service_type_id?: string | null
          staff_user_id?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          submitted_at?: string | null
          units?: number | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_events_service_template_id_fkey"
            columns: ["service_template_id"]
            isOneToOne: false
            referencedRelation: "service_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_events_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      service_pricing: {
        Row: {
          created_at: string | null
          currency: string
          effective_date: string | null
          id: string
          is_active: boolean
          notes: string | null
          pricing_model: string
          rate_amount: number
          service_template_id: string
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string
          effective_date?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          pricing_model: string
          rate_amount?: number
          service_template_id: string
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string
          effective_date?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          pricing_model?: string
          rate_amount?: number
          service_template_id?: string
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_pricing_service_template_id_fkey"
            columns: ["service_template_id"]
            isOneToOne: false
            referencedRelation: "service_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_pricing_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      service_records: {
        Row: {
          completed_at: string | null
          created_at: string | null
          external_id: string | null
          free_text: string | null
          goals: string | null
          id: string
          interventions: string | null
          next_steps: string | null
          outcome: string | null
          pdf_url: string | null
          performed_duration_minutes: number | null
          record_status: string | null
          service_event_id: string | null
          signed_at: string | null
          staff_signature_name: string | null
          started_at: string | null
          time_in: string | null
          time_out: string | null
          workspace_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          external_id?: string | null
          free_text?: string | null
          goals?: string | null
          id?: string
          interventions?: string | null
          next_steps?: string | null
          outcome?: string | null
          pdf_url?: string | null
          performed_duration_minutes?: number | null
          record_status?: string | null
          service_event_id?: string | null
          signed_at?: string | null
          staff_signature_name?: string | null
          started_at?: string | null
          time_in?: string | null
          time_out?: string | null
          workspace_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          external_id?: string | null
          free_text?: string | null
          goals?: string | null
          id?: string
          interventions?: string | null
          next_steps?: string | null
          outcome?: string | null
          pdf_url?: string | null
          performed_duration_minutes?: number | null
          record_status?: string | null
          service_event_id?: string | null
          signed_at?: string | null
          staff_signature_name?: string | null
          started_at?: string | null
          time_in?: string | null
          time_out?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_records_service_event_id_fkey"
            columns: ["service_event_id"]
            isOneToOne: false
            referencedRelation: "service_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_records_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      service_templates: {
        Row: {
          active: boolean | null
          created_at: string | null
          default_duration: number | null
          default_rate: number | null
          defaults: Json | null
          description: string | null
          documentation_required: boolean | null
          external_id: string | null
          id: string
          name: string
          note_template: string | null
          service_type_id: string | null
          signature_required: boolean | null
          workspace_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          default_duration?: number | null
          default_rate?: number | null
          defaults?: Json | null
          description?: string | null
          documentation_required?: boolean | null
          external_id?: string | null
          id?: string
          name: string
          note_template?: string | null
          service_type_id?: string | null
          signature_required?: boolean | null
          workspace_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          default_duration?: number | null
          default_rate?: number | null
          defaults?: Json | null
          description?: string | null
          documentation_required?: boolean | null
          external_id?: string | null
          id?: string
          name?: string
          note_template?: string | null
          service_type_id?: string | null
          signature_required?: boolean | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_templates_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_templates_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      service_types: {
        Row: {
          created_at: string | null
          id: string
          mode: Database["public"]["Enums"]["service_mode"]
          name: string
          required_fields: Json | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mode: Database["public"]["Enums"]["service_mode"]
          name: string
          required_fields?: Json | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mode?: Database["public"]["Enums"]["service_mode"]
          name?: string
          required_fields?: Json | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_types_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_profiles: {
        Row: {
          active: boolean | null
          address: string | null
          city: string | null
          created_at: string | null
          dob: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          external_id: string | null
          first_name: string | null
          full_name: string | null
          id: string
          language: string | null
          last_name: string | null
          mailing_city: string | null
          mailing_same_as_physical: boolean | null
          mailing_state: string | null
          mailing_street_address: string | null
          mailing_zip_code: string | null
          password_hash: string | null
          phone: string | null
          phone_number: string | null
          preferred_contact_method: string | null
          saved_password: string | null
          saved_username: string | null
          staff_id: string | null
          state: string | null
          street_address: string | null
          title: string | null
          user_id: string | null
          username: string | null
          workspace_id: string | null
          zip_code: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          external_id?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          last_name?: string | null
          mailing_city?: string | null
          mailing_same_as_physical?: boolean | null
          mailing_state?: string | null
          mailing_street_address?: string | null
          mailing_zip_code?: string | null
          password_hash?: string | null
          phone?: string | null
          phone_number?: string | null
          preferred_contact_method?: string | null
          saved_password?: string | null
          saved_username?: string | null
          staff_id?: string | null
          state?: string | null
          street_address?: string | null
          title?: string | null
          user_id?: string | null
          username?: string | null
          workspace_id?: string | null
          zip_code?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          external_id?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          last_name?: string | null
          mailing_city?: string | null
          mailing_same_as_physical?: boolean | null
          mailing_state?: string | null
          mailing_street_address?: string | null
          mailing_zip_code?: string | null
          password_hash?: string | null
          phone?: string | null
          phone_number?: string | null
          preferred_contact_method?: string | null
          saved_password?: string | null
          saved_username?: string | null
          staff_id?: string | null
          state?: string | null
          street_address?: string | null
          title?: string | null
          user_id?: string | null
          username?: string | null
          workspace_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_profiles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          id: string
          plan_key: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          plan_key?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          plan_key?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      system_admins: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      system_audit_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          target_workspace_id: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_workspace_id?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_workspace_id?: string | null
        }
        Relationships: []
      }
      system_campaigns: {
        Row: {
          content_body: string
          created_at: string | null
          id: string
          name: string
          stats: Json | null
          subject: string
          trigger_type: string | null
        }
        Insert: {
          content_body: string
          created_at?: string | null
          id?: string
          name: string
          stats?: Json | null
          subject: string
          trigger_type?: string | null
        }
        Update: {
          content_body?: string
          created_at?: string | null
          id?: string
          name?: string
          stats?: Json | null
          subject?: string
          trigger_type?: string | null
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["workspace_role"]
          status: string | null
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["workspace_role"]
          status?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["workspace_role"]
          status?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          access_state: string | null
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          email_reply_to: string | null
          email_sender_address: string | null
          email_sender_name: string | null
          id: string
          is_check_in_enabled: boolean | null
          is_email_verified: boolean | null
          is_launchpad: boolean | null
          last_activity: string | null
          name: string
          plan_key: string | null
          plan_status: string | null
          resend_api_key: string | null
          slug: string
          state: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          trial_ends_at: string | null
          trial_start_date: string | null
          zip_code: string | null
        }
        Insert: {
          access_state?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          email_reply_to?: string | null
          email_sender_address?: string | null
          email_sender_name?: string | null
          id?: string
          is_check_in_enabled?: boolean | null
          is_email_verified?: boolean | null
          is_launchpad?: boolean | null
          last_activity?: string | null
          name: string
          plan_key?: string | null
          plan_status?: string | null
          resend_api_key?: string | null
          slug: string
          state?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          trial_start_date?: string | null
          zip_code?: string | null
        }
        Update: {
          access_state?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          email_reply_to?: string | null
          email_sender_address?: string | null
          email_sender_name?: string | null
          id?: string
          is_check_in_enabled?: boolean | null
          is_email_verified?: boolean | null
          is_launchpad?: boolean | null
          last_activity?: string | null
          name?: string
          plan_key?: string | null
          plan_status?: string | null
          resend_api_key?: string | null
          slug?: string
          state?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          trial_start_date?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_audit_logs: {
        Args: { retention_days?: number }
        Returns: number
      }
      create_tenant_with_owner_membership: {
        Args: { _name: string; _tenant_type?: string }
        Returns: string
      }
      current_tenant_id: { Args: never; Returns: string }
      current_user_id: { Args: never; Returns: string }
      get_provider_rate: {
        Args: {
          _as_of_date?: string
          _provider_id: string
          _service_template_id?: string
          _tenant_id: string
        }
        Returns: number
      }
      get_user_role: {
        Args: { _tenant_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_workspace_role: {
        Args: { u_id: string; w_id: string }
        Returns: Database["public"]["Enums"]["workspace_role"]
      }
      has_role_or_higher:
        | {
            Args: {
              _min_role: Database["public"]["Enums"]["app_role"]
              _tenant_id: string
            }
            Returns: boolean
          }
        | {
            Args: { _min_role_text: string; _tenant_id: string }
            Returns: boolean
          }
      has_tenant_access: { Args: { _tenant_id: string }; Returns: boolean }
      has_workspace_access: {
        Args: { u_id: string; w_id: string }
        Returns: boolean
      }
      is_org_member:
        | { Args: { _tenant_id: string }; Returns: boolean }
        | { Args: { p_tenant_id: string; p_user_id: string }; Returns: boolean }
      sync_participant_tenant: {
        Args: { p_participant_id: string }
        Returns: undefined
      }
      user_org_ids:
        | { Args: never; Returns: string[] }
        | { Args: { p_user_id: string }; Returns: string[] }
    }
    Enums: {
      app_role: "owner" | "admin" | "manager" | "staff" | "auditor"
      billing_batch_status: "open" | "closed" | "exported"
      billing_item_status:
        | "pending"
        | "paid"
        | "denied"
        | "billed"
        | "in_process"
        | "partially_paid"
      client_status: "ACTIVE" | "INACTIVE" | "PENDING" | "ON_HOLD" | "CLOSED"
      conversation_type: "direct" | "group" | "announcement"
      credential_status: "valid" | "expired" | "pending"
      delivery_model: "hourly" | "session" | "program"
      enrollment_status: "active" | "completed" | "paused"
      event_status:
        | "DRAFT"
        | "SUBMITTED"
        | "APPROVED"
        | "REJECTED"
        | "SCHEDULED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CANCELLED"
        | "NO_SHOW"
      invoice_status: "DRAFT" | "SENT" | "PAID" | "VOID"
      membership_status: "active" | "inactive"
      pay_period_type: "weekly" | "biweekly" | "semi_monthly" | "monthly"
      payroll_run_status: "draft" | "approved" | "synced" | "paid"
      person_type: "recipient" | "provider" | "student" | "staff" | "other"
      service_event_status:
        | "draft"
        | "submitted"
        | "approved"
        | "rejected"
        | "billed"
      service_mode: "HOURLY" | "SESSION" | "PROGRAM"
      status: "pending" | "active" | "archived"
      visibility: "private" | "team" | "public"
      workspace_role:
        | "OWNER"
        | "ADMIN"
        | "MANAGER"
        | "STAFF"
        | "READ_ONLY"
        | "SUPERVISOR"
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
      app_role: ["owner", "admin", "manager", "staff", "auditor"],
      billing_batch_status: ["open", "closed", "exported"],
      billing_item_status: [
        "pending",
        "paid",
        "denied",
        "billed",
        "in_process",
        "partially_paid",
      ],
      client_status: ["ACTIVE", "INACTIVE", "PENDING", "ON_HOLD", "CLOSED"],
      conversation_type: ["direct", "group", "announcement"],
      credential_status: ["valid", "expired", "pending"],
      delivery_model: ["hourly", "session", "program"],
      enrollment_status: ["active", "completed", "paused"],
      event_status: [
        "DRAFT",
        "SUBMITTED",
        "APPROVED",
        "REJECTED",
        "SCHEDULED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
        "NO_SHOW",
      ],
      invoice_status: ["DRAFT", "SENT", "PAID", "VOID"],
      membership_status: ["active", "inactive"],
      pay_period_type: ["weekly", "biweekly", "semi_monthly", "monthly"],
      payroll_run_status: ["draft", "approved", "synced", "paid"],
      person_type: ["recipient", "provider", "student", "staff", "other"],
      service_event_status: [
        "draft",
        "submitted",
        "approved",
        "rejected",
        "billed",
      ],
      service_mode: ["HOURLY", "SESSION", "PROGRAM"],
      status: ["pending", "active", "archived"],
      visibility: ["private", "team", "public"],
      workspace_role: [
        "OWNER",
        "ADMIN",
        "MANAGER",
        "STAFF",
        "READ_ONLY",
        "SUPERVISOR",
      ],
    },
  },
} as const
