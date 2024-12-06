import React, { useState } from 'react';
import { Invoice } from '../types';
import { updateInvoice } from '../services/api';

interface InvoiceEditProps {
  invoice: Invoice;
  onSave: () => void;
  onCancel: () => void;
}

export const InvoiceEdit: React.FC<InvoiceEditProps> = ({
  invoice,
  onSave,
  onCancel,
}) => {
  const [customerName, setCustomerName] = useState(invoice.customerName);
  const [customerNIT, setCustomerNIT] = useState(invoice.customerNIT);
  const [comment, setComment] = useState(invoice.comment || '');
  const [partialPayment, setPartialPayment] = useState(
    invoice.partialPayment || 0
  );

  const handleSave = async () => {
    try {
      await updateInvoice(invoice.id, {
        customerName,
        customerNIT,
        comment,
        partialPayment: partialPayment || undefined,
      });
      onSave();
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('Error al actualizar la factura');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Editar Factura #{invoice.id}</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Cliente
        </label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          NIT
        </label>
        <input
          type="text"
          value={customerNIT}
          onChange={(e) => setCustomerNIT(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comentario
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          rows={3}
        />
      </div>

      {invoice.status === 'partial' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Abono
          </label>
          <input
            type="number"
            value={partialPayment}
            onChange={(e) => setPartialPayment(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            min="0"
            max={invoice.total}
            step="0.01"
          />
        </div>
      )}

      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};