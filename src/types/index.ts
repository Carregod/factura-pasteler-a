export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

export type InvoiceStatus = 'pending' | 'partial' | 'completed' | 'cancelled';

export interface InvoiceItem {
  product: Product;
  quantity: number;
}

export interface Invoice {
  id: string;
  date: Date;
  items: InvoiceItem[];
  total: number;
  customerName: string;
  customerNIT: string;
  status: InvoiceStatus;
  partialPayment?: number;
  cancellationReason?: string;
  lastModified?: Date;
  comment?: string;
}

export interface SearchFilters {
  query: string;
  category: string;
  minPrice?: number;
  maxPrice?: number;
}