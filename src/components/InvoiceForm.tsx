import React from 'react';

interface InvoiceFormProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  customerNIT: string;
  setCustomerNIT: (nit: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  customerName,
  setCustomerName,
  customerNIT,
  setCustomerNIT,
  customerPhone,
  setCustomerPhone,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Datos del Cliente</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Nombre del cliente"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Teléfono del cliente"
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
            placeholder="NIT del cliente"
          />
        </div>
      </div>
    </div>
  );
};