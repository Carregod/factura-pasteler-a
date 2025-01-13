// Importaciones necesarias
import React from 'react'; // Biblioteca React para construir componentes
import QRCode from 'qrcode.react'; // Componente para generar un código QR
import { format } from 'date-fns'; // Biblioteca para formatear fechas
import { Invoice as InvoiceType } from '../types'; // Tipo definido para garantizar la estructura de una factura
// import { calculateItemPrice } from '../utils/invoice';

// Definición de las propiedades que recibe el componente
interface InvoiceProps {
  invoice: InvoiceType; // Factura que se va a renderizar
}


export const Invoice: React.FC<InvoiceProps> = ({ invoice }) => {
  const qrData = JSON.stringify({
    id: invoice.id,
    date: invoice.date,
    total: invoice.total,
    customer: invoice.customerName,
    nit: invoice.customerNIT,
    phone: invoice.customerPhone,
    status: invoice.status,
    partialPayment: invoice.partialPayment,
  });

  const remainingBalance = invoice.partialPayment
    ? invoice.total - invoice.partialPayment
    : 0;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Encabezado de la factura */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Pastelería Delicias</h1>
        <p className="text-gray-600">Factura #{invoice.id}</p>
        <p className="text-gray-600">
          {format(new Date(invoice.date), 'dd/MM/yyyy HH:mm')}
        </p>
      </div>

      {/* Información del cliente */}
      <div className="mb-6">
        <h2 className="font-semibold">Cliente:</h2>
        <p>{invoice.customerName}</p>
        <p>Teléfono: {invoice.customerPhone}</p>
        <p>NIT: {invoice.customerNIT}</p>
      </div>

      {/* Tabla con detalles de los productos */}
      <table className="w-full mb-6">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Producto</th>
            <th className="text-right py-2">Porciones</th>
            <th className="text-right py-2">Cantidad</th>
            <th className="text-right py-2">Precio Unitario</th>
            <th className="text-right py-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => {
            // const pricePerUnit = item.portions * item.product.portionPrice;
            // const subtotal = calculateItemPrice(item);

            return (
              <tr key={index} className="border-b">
                <td className="py-2">{item.product.name}</td>
                <td className="text-right py-2">{item.portions}</td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">Q{item.unitPrice?.toFixed(2)}</td>
                <td className="text-right py-2">Q{item.subtotal?.toFixed(2)}</td>
             
              </tr>
            );
          })}
        </tbody>
       <tfoot>
  <tr>
    <td colSpan={4} className="text-right font-semibold py-2">
      Total:
    </td>
    <td className="text-right font-semibold py-2">
      Q{invoice.total.toFixed(2)}
    </td>
  </tr>
  {invoice.partialPayment && (
    <>
      <tr>
        <td colSpan={4} className="text-right py-2">
          Abono:
        </td>
        <td className="text-right py-2 text-green-600">
          Q{invoice.partialPayment.toFixed(2)}
        </td>
      </tr>
      <tr>
        <td colSpan={4} className="text-right py-2">
          Saldo pendiente:
        </td>
        <td className="text-right py-2 text-red-600">
          Q{remainingBalance.toFixed(2)}
        </td>
      </tr>
    </>
  )}
</tfoot>

      </table>

      {/* Comentarios adicionales, si existen */}
      {invoice.comment && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold mb-2">Comentarios:</h3>
          <p className="text-gray-700">{invoice.comment}</p>
        </div>
      )}

      <div className="mb-4 text-center">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            invoice.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : invoice.status === 'partial'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {invoice.status === 'completed'
            ? 'Pagado'
            : invoice.status === 'partial'
            ? 'Abonado'
            : 'Pendiente'}
        </span>
      </div>

      {/* Código QR */}
      <div className="flex justify-center mb-4">
        <QRCode value={qrData} size={128} />
      </div>

      {/* Pie de página */}
      <div className="text-center text-sm text-gray-600">
        <p>¡Gracias por su compra!</p>
        <p>Pastelería Delicias - Tel: (502) 2222-3333</p>
        <p>Ciudad de Guatemala, Guatemala</p>
      </div>
    </div>
  );
};





// import React from 'react';
// import QRCode from 'qrcode.react';
// import { format } from 'date-fns';
// import { Invoice as InvoiceType } from '../types';
// import { calculateItemPrice } from '../utils/invoice';

// interface InvoiceProps {
//   invoice: InvoiceType;
// }

// export const Invoice: React.FC<InvoiceProps> = ({ invoice }) => {
//   const total = invoice.items.reduce(
//     (sum, item) => sum + calculateItemPrice(item),
//     0
//   );
//   const qrData = JSON.stringify({
//     id: invoice.id,
//     date: invoice.date,
//     total,
//     customer: invoice.customerName,
//     nit: invoice.customerNIT,
//     status: invoice.status,
//   });

//   return (
//     <div className="bg-white p-8 rounded-lg shadow-md">
//       <div className="text-center mb-6">
//         <h1 className="text-2xl font-bold">Pastelería Delicias</h1>
//         <p className="text-gray-600">Factura #{invoice.id}</p>
//         <p className="text-gray-600">
//           {format(new Date(invoice.date), 'dd/MM/yyyy HH:mm')}
//         </p>
//       </div>

//       <div className="mb-6">
//         <h2 className="font-semibold">Cliente:</h2>
//         <p>{invoice.customerName}</p>
//         <p>NIT: {invoice.customerNIT}</p>
//       </div>

//       <table className="w-full mb-6">
//         <thead>
//           <tr className="border-b">
//             <th className="text-left py-2">Producto</th>
//             <th className="text-right py-2">Porciones</th>
//             <th className="text-right py-2">Cantidad</th>
//             <th className="text-right py-2">Precio Unitario</th>
//             <th className="text-right py-2">Subtotal</th>
//           </tr>
//         </thead>
//         <tbody>
//           {invoice.items.map((item, index) => {
//             const pricePerUnit = (item.portions * item.product.portionPrice);
//             const subtotal = calculateItemPrice(item);
            
//             return (
//               <tr key={index} className="border-b">
//                 <td className="py-2">{item.product.name}</td>
//                 <td className="text-right py-2">{item.portions}</td>
//                 <td className="text-right py-2">{item.quantity}</td>
//                 <td className="text-right py-2">Q{pricePerUnit.toFixed(2)}</td>
//                 <td className="text-right py-2">Q{subtotal.toFixed(2)}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//         <tfoot>
//           <tr>
//             <td colSpan={4} className="text-right font-semibold py-2">
//               Total:
//             </td>
//             <td className="text-right font-semibold py-2">
//               Q{total.toFixed(2)}
//             </td>
//           </tr>
//         </tfoot>
//       </table>

//       <div className="mb-4 text-center">
//         <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
//           invoice.status === 'completed' ? 'bg-green-100 text-green-800' :
//           invoice.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
//           'bg-gray-100 text-gray-800'
//         }`}>
//           {invoice.status === 'completed' ? 'Pagado' :
//            invoice.status === 'partial' ? 'Abono Pendiente' :
//            'Pendiente'}
//         </span>
//       </div>

//       <div className="flex justify-center mb-4">
//         <QRCode value={qrData} size={128} />
//       </div>

//       <div className="text-center text-sm text-gray-600">
//         <p>¡Gracias por su compra!</p>
//         <p>Pastelería Delicias - Tel: (502) 2222-3333</p>
//         <p>Ciudad de Guatemala, Guatemala</p>
//       </div>
//     </div>
//   );
// };