export interface OrderInterface {
  amount: string;
  currency?: string;
  pg?: string;
  pg_pool_id?: string;
  callback_url: string;
  cname: string;
  email: string;
  key: string;
  phone: string;
  receipt_id: string;
  notes?: {
    udf1: string;
    udf2: string;
    udf3: string;
    udf4: string;
    udf5: string;
  };
  billing_address?: {
    firstname?: string;
    lastname?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
  };
  shipping_address?: {
    firstname?: string;
    lastname?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
  };
  hash: string;
}
