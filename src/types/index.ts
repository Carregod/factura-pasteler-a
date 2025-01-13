export interface Product {
  id: number;
  name: string;
  price: number;
  portionPrice?: number;
  category: string;
  minPortions?: number;
  maxPortions?: number;
  description: string;
  image: string;
  unit?: string;
  hasPortion?: boolean;
}
 

export type InvoiceStatus = 'pending' | 'partial' | 'completed' | 'cancelled';

export interface InvoiceItem {
  product: Product;
  quantity: number;
  portions: number;
  unitPrice?: number; // Precio unitario calculado (opcional)
  subtotal?: number;  // Subtotal calculado (opcional)
}

export interface Invoice {
  id: string;
  date: Date;
  items: InvoiceItem[];
  total: number;
  customerName: string;
  customerNIT: string;
  customerPhone: string;
  status: InvoiceStatus;
  partialPayment?: number;
  cancellationReason?: string;
  comment?: string;
  lastModified?: Date;
}

export interface SearchFilters {
  query: string;
  category: string;
  minPrice?: number;
  maxPrice?: number;
}