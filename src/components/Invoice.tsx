// // Importaciones necesarias
// import React from 'react'; // Biblioteca React para construir componentes
// import QRCode from 'qrcode.react'; // Componente para generar un código QR
// import { format } from 'date-fns'; // Biblioteca para formatear fechas
// import { Invoice as InvoiceType } from '../types'; // Tipo definido para garantizar la estructura de una factura

// // Definición de las propiedades que recibe el componente
// interface InvoiceProps {
//   invoice: InvoiceType; // Factura que se va a renderizar
// }

// // Componente principal para mostrar una factura
// export const Invoice: React.FC<InvoiceProps> = ({ invoice }) => {
//   // Datos que se codificarán en el código QR
//   const qrData = JSON.stringify({
//     id: invoice.id, // ID de la factura
//     date: invoice.date, // Fecha de emisión
//     total: invoice.total, // Total de la factura
//     customer: invoice.customerName, // Nombre del cliente
//     nit: invoice.customerNIT, // NIT del cliente
//   });

//   // Renderiza la factura
//   return (
//     <div className="bg-white p-8 rounded-lg shadow-md">
//       {/* Encabezado de la factura */}
//       <div className="text-center mb-6">
//         <h1 className="text-2xl font-bold">Pastelería Delicias</h1> {/* Nombre de la empresa */}
//         <p className="text-gray-600">Factura #{invoice.id}</p> {/* Número de factura */}
//         <p className="text-gray-600">
//           {format(new Date(invoice.date), 'dd/MM/yyyy HH:mm')} {/* Fecha formateada */}
//         </p>
//       </div>

//       {/* Información del cliente */}
//       <div className="mb-6">
//         <h2 className="font-semibold">Cliente:</h2>
//         <p>{invoice.customerName}</p> {/* Nombre del cliente */}
//         <p>NIT: {invoice.customerNIT}</p> {/* NIT del cliente */}
//       </div>

//       {/* Tabla con detalles de los productos */}
//       <table className="w-full mb-6">
//         <thead>
//           <tr className="border-b">
//             {/* Encabezados de la tabla */}
//             <th className="text-left py-2">Producto</th>
//             <th className="text-right py-2">Cantidad</th>
//             <th className="text-right py-2">Precio</th>
//             <th className="text-right py-2">Subtotal</th>
//           </tr>
//         </thead>
//         <tbody>
//           {/* Detalles de cada producto */}
//           {invoice.items.map((item, index) => (
//             <tr key={index} className="border-b">
//               <td className="py-2">{item.product.name}</td> {/* Nombre del producto */}
//               <td className="text-right py-2">{item.quantity}</td> {/* Cantidad */}
//               <td className="text-right py-2">
//                 Q{item.product.price.toFixed(2)} {/* Precio unitario */}
//               </td>
//               <td className="text-right py-2">
//                 Q{(item.product.price * item.quantity).toFixed(2)} {/* Subtotal */}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//         <tfoot>
//           {/* Total general de la factura */}
//           <tr>
//             <td colSpan={3} className="text-right font-semibold py-2">
//               Total:
//             </td>
//             <td className="text-right font-semibold py-2">
//               Q{invoice.total.toFixed(2)}
//             </td>
//           </tr>
//           {/* Si existe un abono parcial, se muestra */}
//           {invoice.partialPayment && (
//             <tr>
//               <td colSpan={3} className="text-right text-blue-600 py-2">
//                 Abono:
//               </td>
//               <td className="text-right text-blue-600 py-2">
//                 Q{invoice.partialPayment.toFixed(2)}
//               </td>
//             </tr>
//           )}
//         </tfoot>
//       </table>

//       {/* Comentarios adicionales, si existen */}
//       {invoice.comments && (
//         <div className="mb-6 p-4 bg-gray-50 rounded-md">
//           <h3 className="font-semibold mb-2">Comentarios:</h3>
//           <p className="text-gray-700">{invoice.comments}</p> {/* Muestra los comentarios */}
//         </div>
//       )}

//       {/* Código QR */}
//       <div className="flex justify-center mb-4">
//         <QRCode value={qrData} size={128} /> {/* Genera el QR con los datos de la factura */}
//       </div>

//       {/* Pie de página */}
//       <div className="text-center text-sm text-gray-600">
//         <p>¡Gracias por su compra!</p> {/* Mensaje de agradecimiento */}
//         <p>Pastelería Delicias - Tel: (502) 2222-3333</p> {/* Información de contacto */}
//         <p>Ciudad de Guatemala, Guatemala</p> {/* Ubicación */}
//       </div>
//     </div>
//   );
// };



import React from 'react';
import QRCode from 'qrcode.react';
import { format } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import { Invoice as InvoiceType } from '../types';

interface InvoiceProps {
  invoice: InvoiceType;
}

export const Invoice: React.FC<InvoiceProps> = ({ invoice }) => {
  const qrData = JSON.stringify({
    id: invoice.id,
    date: invoice.date,
    total: invoice.total,
    customer: invoice.customerName,
    nit: invoice.customerNIT,
    comment: invoice.comment,
  });

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Pastelería Delicias</h1>
        <p className="text-gray-600">Factura #{invoice.id}</p>
        <p className="text-gray-600">
          {format(new Date(invoice.date), 'dd/MM/yyyy HH:mm')}
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

      {invoice.comment && (
        <div className="mb-6 p-4 bg-pink-50 rounded-md border border-pink-100">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="text-pink-500" size={20} />
            <h3 className="font-semibold text-pink-900">Comentario:</h3>
          </div>
          <p className="text-gray-700 pl-7">{invoice.comment}</p>
        </div>
      )}

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