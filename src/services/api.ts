import axios from 'axios';
import { Invoice, InvoiceStatus } from '../types';

const API_URL = 'http://localhost:3000/api';

export const saveInvoice = async (invoice: Invoice) => {
  const response = await axios.post(`${API_URL}/invoices`, invoice);
  return response.data;
};

export const getInvoices = async (status?: InvoiceStatus, search?: string) => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  
  const response = await axios.get(`${API_URL}/invoices?${params.toString()}`);
  return response.data;
};

export const updateInvoiceStatus = async (
  id: string,
  status: InvoiceStatus,
  data?: { partialPayment?: number; cancellationReason?: string }
) => {
  const response = await axios.patch(`${API_URL}/invoices/${id}/status`, {
    status,
    ...data,
  });
  return response.data;
};

export const updateInvoice = async (id: string, invoice: Partial<Invoice>) => {
  const response = await axios.put(`${API_URL}/invoices/${id}`, invoice);
  return response.data;
};