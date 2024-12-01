import React from 'react';
import QRCode from 'qrcode.react';
import { format } from 'date-fns';
import { Invoice as InvoiceType } from '../types';

interface InvoiceProps {
  invoice: InvoiceType;
  comments: string; // Comentarios del cliente
  status: string; // Estado del pedido
}

export const Invoice: React.FC<InvoiceProps> = ({
  invoice,
  comments,
  status,
}) => {
  const qrData = JSON.stringify({
    id: invoice.id,
    date: invoice.date,
    total: invoice.total,
    customer: invoice.customerName,
    nit: invoice.customerNIT,
    comments,
    status,
  });

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Pastelería Delicias</h1>
        <p className="text-gray-600">Factura #{invoice.id}</p>
        <p className="text-gray-600">
          {format(invoice.date, 'dd/MM/yyyy HH:mm')}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold">Cliente:</h2>
        <p>{invoice.customerName}</p>
        <p>NIT: {invoice.customerNIT}</p>
      </div>

      <table className="w-full mb-6">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Producto</th>
            <th className="text-right py-2">Cantidad</th>
            <th className="text-right py-2">Precio</th>
            <th className="text-right py-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{item.product.name}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">
                Q{item.product.price.toFixed(2)}
              </td>
              <td className="text-right py-2">
                Q{(item.product.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="text-right font-semibold py-2">
              Total:
            </td>
            <td className="text-right font-semibold py-2">
              Q{invoice.total.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="mb-6">
        <h2 className="font-semibold">Comentarios:</h2>
        <p>{comments}</p>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold">Estado:</h2>
        <p>{status}</p>
      </div>

      <div className="flex justify-center mb-4">
        <QRCode value={qrData} size={128} />
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>¡Gracias por su compra!</p>
        <p>Pastelería Delicias - Tel: (502) 2222-3333</p>
        <p>Ciudad de Guatemala, Guatemala</p>
      </div>
    </div>
  );
};
