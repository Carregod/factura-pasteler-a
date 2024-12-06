import React from 'react';
import { Invoice } from '../types';
import { Invoice as InvoiceComponent } from './Invoice';

interface InvoiceViewProps {
  invoice: Invoice;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ invoice }) => {
  return <InvoiceComponent invoice={invoice} />;
};