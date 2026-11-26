/**
 * Supabase database types.
 *
 * Hand-written to mirror supabase/migrations so the project type-checks before a
 * Supabase project is linked. Once linked, regenerate with `npm run db:types`
 * (output has the same shape, so no call sites change).
 */
import type {
  BonusPeriod,
  BonusStatus,
  BookingStatus,
  ComplaintStatus,
  FundTxnType,
  NotificationType,
  PaymentMethod,
  PaymentStatus,
  RequestStatus,
  UserRole,
  VerificationStatus,
} from '../enums';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/** Build Insert/Update shapes: `Req` keys are required on insert, the rest optional. */
type TableDef<Row, Req extends keyof Row, Rel extends readonly Relationship[] = []> = {
  Row: Row;
  Insert: { [K in Req]: Row[K] } & { [K in Exclude<keyof Row, Req>]?: Row[K] };
  Update: { [K in keyof Row]?: Row[K] };
  Relationships: Rel;
};

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type Rel<
  Name extends string,
  Col extends string,
  Ref extends string,
  RefCol extends string,
  OneToOne extends boolean = false,
> = {
  foreignKeyName: Name;
  columns: [Col];
  isOneToOne: OneToOne;
  referencedRelation: Ref;
  referencedColumns: [RefCol];
};

type Timestamps = { created_at: string; updated_at: string };

// ---------------------------------------------------------------------------
// Row types
// ---------------------------------------------------------------------------
type ProfileRow = {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  city: string | null;
  is_active: boolean;
} & Timestamps;

type WorkerRow = {
  profile_id: string;
  cnic_number: string | null;
  cnic_document_path: string | null;
  skills: string[];
  experience_years: number;
  hourly_rate: number | null;
  service_area: string | null;
  bio: string | null;
  is_available: boolean;
  verification_status: VerificationStatus;
  verification_note: string | null;
  verified_at: string | null;
  tevta_certified: boolean;
  tevta_certificate_path: string | null;
  avg_rating: number;
  total_jobs: number;
} & Timestamps;

type CategoryRow = {
  id: string;
  name: string;
  name_ur: string | null;
  slug: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
} & Timestamps;

type WorkerCategoryRow = {
  worker_id: string;
  category_id: string;
  created_at: string;
};

type BookingRow = {
  id: string;
  customer_id: string;
  worker_id: string;
  category_id: string;
  description: string;
  address: string;
  city: string | null;
  lat: number | null;
  lng: number | null;
  scheduled_at: string;
  status: BookingStatus;
  quoted_amount: number | null;
  final_amount: number | null;
  cancel_reason: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
} & Timestamps;

type PaymentRow = {
  id: string;
  booking_id: string;
  amount: number;
  commission_rate: number;
  commission_amount: number;
  worker_amount: number;
  emergency_fund_amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  provider_ref: string | null;
  paid_at: string | null;
} & Timestamps;

type ReviewRow = {
  id: string;
  booking_id: string;
  customer_id: string;
  worker_id: string;
  rating: number;
  comment: string | null;
} & Timestamps;

type MessageRow = {
  id: string;
  booking_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
} & Timestamps;

type BonusRuleRow = {
  id: string;
  name: string;
  period: BonusPeriod;
  min_jobs: number;
  min_rating: number;
  bonus_amount: number;
  is_active: boolean;
} & Timestamps;

type BonusRow = {
  id: string;
  worker_id: string;
  rule_id: string;
  period_start: string;
  period_end: string;
  jobs_completed: number;
  rating_snapshot: number;
  amount: number;
  status: BonusStatus;
  paid_at: string | null;
} & Timestamps;

type FundRequestRow = {
  id: string;
  worker_id: string;
  reason: string;
  amount_requested: number;
  status: RequestStatus;
  admin_note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
} & Timestamps;

type FundTransactionRow = {
  id: string;
  type: FundTxnType;
  amount: number;
  booking_id: string | null;
  request_id: string | null;
  note: string | null;
  created_by: string | null;
  created_at: string;
};

type ComplaintRow = {
  id: string;
  booking_id: string;
  raised_by: string;
  description: string;
  status: ComplaintStatus;
  resolution: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
} & Timestamps;

type NotificationRow = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: NotificationType;
  data: Json;
  is_read: boolean;
} & Timestamps;

type PlatformSettingsRow = {
  id: boolean;
  commission_rate: number;
  emergency_fund_rate: number;
  updated_by: string | null;
} & Timestamps;

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------
export type Database = {
  public: {
    Tables: {
      profiles: TableDef<ProfileRow, 'id'>;
      workers: TableDef<
        WorkerRow,
        'profile_id',
        [Rel<'workers_profile_id_fkey', 'profile_id', 'profiles', 'id', true>]
      >;
      categories: TableDef<CategoryRow, 'name' | 'slug'>;
      worker_categories: TableDef<
        WorkerCategoryRow,
        'worker_id' | 'category_id',
        [
          Rel<'worker_categories_worker_id_fkey', 'worker_id', 'workers', 'profile_id'>,
          Rel<'worker_categories_category_id_fkey', 'category_id', 'categories', 'id'>,
        ]
      >;
      bookings: TableDef<
        BookingRow,
        'customer_id' | 'worker_id' | 'category_id' | 'description' | 'address' | 'scheduled_at',
        [
          Rel<'bookings_customer_id_fkey', 'customer_id', 'profiles', 'id'>,
          Rel<'bookings_worker_id_fkey', 'worker_id', 'workers', 'profile_id'>,
          Rel<'bookings_category_id_fkey', 'category_id', 'categories', 'id'>,
        ]
      >;
      payments: TableDef<
        PaymentRow,
        | 'booking_id'
        | 'amount'
        | 'commission_rate'
        | 'commission_amount'
        | 'worker_amount'
        | 'method',
        [Rel<'payments_booking_id_fkey', 'booking_id', 'bookings', 'id', true>]
      >;
      reviews: TableDef<
        ReviewRow,
        'booking_id' | 'customer_id' | 'worker_id' | 'rating',
        [
          Rel<'reviews_booking_id_fkey', 'booking_id', 'bookings', 'id', true>,
          Rel<'reviews_customer_id_fkey', 'customer_id', 'profiles', 'id'>,
          Rel<'reviews_worker_id_fkey', 'worker_id', 'workers', 'profile_id'>,
        ]
      >;
      messages: TableDef<
        MessageRow,
        'booking_id' | 'sender_id' | 'content',
        [
          Rel<'messages_booking_id_fkey', 'booking_id', 'bookings', 'id'>,
          Rel<'messages_sender_id_fkey', 'sender_id', 'profiles', 'id'>,
        ]
      >;
      bonus_rules: TableDef<
        BonusRuleRow,
        'name' | 'period' | 'min_jobs' | 'min_rating' | 'bonus_amount'
      >;
      bonuses: TableDef<
        BonusRow,
        'worker_id' | 'rule_id' | 'period_start' | 'period_end' | 'amount',
        [
          Rel<'bonuses_worker_id_fkey', 'worker_id', 'workers', 'profile_id'>,
          Rel<'bonuses_rule_id_fkey', 'rule_id', 'bonus_rules', 'id'>,
        ]
      >;
      emergency_fund_requests: TableDef<
        FundRequestRow,
        'worker_id' | 'reason' | 'amount_requested',
        [
          Rel<'emergency_fund_requests_worker_id_fkey', 'worker_id', 'workers', 'profile_id'>,
          Rel<'emergency_fund_requests_reviewed_by_fkey', 'reviewed_by', 'profiles', 'id'>,
        ]
      >;
      emergency_fund_transactions: TableDef<
        FundTransactionRow,
        'type' | 'amount',
        [
          Rel<'emergency_fund_transactions_booking_id_fkey', 'booking_id', 'bookings', 'id'>,
          Rel<
            'emergency_fund_transactions_request_id_fkey',
            'request_id',
            'emergency_fund_requests',
            'id',
            true
          >,
        ]
      >;
      complaints: TableDef<
        ComplaintRow,
        'booking_id' | 'raised_by' | 'description',
        [
          Rel<'complaints_booking_id_fkey', 'booking_id', 'bookings', 'id'>,
          Rel<'complaints_raised_by_fkey', 'raised_by', 'profiles', 'id'>,
        ]
      >;
      notifications: TableDef<
        NotificationRow,
        'user_id' | 'title' | 'body',
        [Rel<'notifications_user_id_fkey', 'user_id', 'profiles', 'id'>]
      >;
      platform_settings: TableDef<PlatformSettingsRow, never>;
    };
    Views: {
      worker_public_profiles: {
        Row: {
          profile_id: string | null;
          full_name: string | null;
          avatar_url: string | null;
          city: string | null;
          skills: string[] | null;
          experience_years: number | null;
          hourly_rate: number | null;
          service_area: string | null;
          bio: string | null;
          is_available: boolean | null;
          tevta_certified: boolean | null;
          avg_rating: number | null;
          total_jobs: number | null;
          category_ids: string[] | null;
          created_at: string | null;
        };
        Relationships: [];
      };
      emergency_fund_balance: {
        Row: {
          total_contributions: number | null;
          total_payouts: number | null;
          balance: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      current_user_role: { Args: Record<PropertyKey, never>; Returns: UserRole };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_bookable_worker: { Args: { p_worker_id: string }; Returns: boolean };
      transition_booking: {
        Args: {
          p_booking_id: string;
          p_actor_id: string;
          p_status: BookingStatus;
          p_quoted_amount?: number;
          p_final_amount?: number;
          p_reason?: string;
        };
        Returns: BookingRow;
      };
      complete_payment: {
        Args: { p_booking_id: string; p_method: PaymentMethod; p_provider_ref?: string };
        Returns: PaymentRow;
      };
      review_fund_request: {
        Args: { p_request_id: string; p_admin_id: string; p_approve: boolean; p_note?: string };
        Returns: FundRequestRow;
      };
    };
    Enums: {
      user_role: UserRole;
      verification_status: VerificationStatus;
      booking_status: BookingStatus;
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
      bonus_period: BonusPeriod;
      bonus_status: BonusStatus;
      request_status: RequestStatus;
      fund_txn_type: FundTxnType;
      complaint_status: ComplaintStatus;
      notification_type: NotificationType;
    };
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database['public'];

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row'];
export type TablesInsert<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Update'];
export type Views<T extends keyof PublicSchema['Views']> = PublicSchema['Views'][T]['Row'];
export type Enums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T];
