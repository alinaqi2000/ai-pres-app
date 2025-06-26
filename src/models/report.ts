export type Report = {
  booking_stats: {
    total: number;
    active: number;
    closed: number;
  };
  payment_stats: {
    total_received?: number;
    total_given?: number;
    total_upcoming: number;
  };
  invoice_stats: {
    total_paid: number;
    total_overdue: number;
  };
  generated_at: string;
  property_count: number;
};
