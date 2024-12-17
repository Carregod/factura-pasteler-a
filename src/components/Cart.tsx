// import React from 'react';
// import { Trash2, Minus, Plus, DollarSign } from 'lucide-react';
// import { InvoiceItem } from '../types';


// interface CartProps {
//   items: InvoiceItem[];
//   onUpdateQuantity: (index: number, newQuantity: number) => void;
//   onRemoveItem: (index: number) => void;
//   onPartialPayment: (index: number) => void; // Nueva prop
// }

// export const Cart: React.FC<CartProps> = ({
//   items,
//   onUpdateQuantity,
//   onRemoveItem,
//   onPartialPayment,
// }) => {
//   const total = items.reduce(
//     (sum, item) => sum + item.product.price * item.quantity,
//     0
//   );

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold mb-4">Carrito</h2>
//       {items.length === 0 ? (
//         <p className="text-gray-500">No hay productos en el carrito</p>
//       ) : (
//         <>
//           <div className="space-y-4">
//             {items.map((item, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between border-b pb-2"
//               >
//                 <div>
//                   <h3 className="font-medium">{item.product.name}</h3>
//                   <p className="text-gray-600">
//                     Q{item.product.price.toFixed(2)} c/u
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() =>
//                       onUpdateQuantity(index, Math.max(1, item.quantity - 1))
//                     }
//                     className="p-1 hover:bg-gray-100 rounded"
//                   >
//                     <Minus size={16} />
//                   </button>
//                   <span className="w-8 text-center">{item.quantity}</span>
//                   <button
//                     onClick={() => onUpdateQuantity(index, item.quantity + 1)}
//                     className="p-1 hover:bg-gray-100 rounded"
//                   >
//                     <Plus size={16} />
//                   </button>
//                   <button
//                     onClick={() => onPartialPayment(index)}
//                     className="p-1 text-blue-500 hover:bg-blue-50 rounded"
//                   >
//                     <DollarSign size={16} />
//                   </button>
//                   <button
//                     onClick={() => onRemoveItem(index)}
//                     className="p-1 text-red-500 hover:bg-red-50 rounded"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="mt-4 text-right">
//             <p className="text-lg font-semibold">
//               Total: Q{total.toFixed(2)}
//             </p>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };




// Importaciones necesarias
import React, { useState } from 'react'; // React y el hook useState para manejar estados locales
import { Trash2, Minus, Plus } from 'lucide-react'; // Iconos para las acciones del carrito
import { InvoiceItem } from '../types'; // Tipo definido para los elementos del carrito

// Definición de las propiedades que recibe el componente
interface CartProps {
  items: InvoiceItem[]; // Lista de productos en el carrito
  onUpdateQuantity: (index: number, newQuantity: number) => void; // Función para actualizar la cantidad de un producto
  onRemoveItem: (index: number) => void; // Función para eliminar un producto del carrito
  onCheckout: (
    status: 'pending' | 'partial', // Estado de la factura: "En Espera" o "Abonado"
    data: { comments: string; partialPayment?: number } // Datos adicionales como comentarios o monto del abono
  ) => void;
}

// Componente principal del carrito
export const Cart: React.FC<CartProps> = ({
  items, // Productos en el carrito
  onUpdateQuantity, // Función para actualizar cantidades
  onRemoveItem, // Función para eliminar productos
  onCheckout, // Función para generar la factura
}) => {
  // Estados locales del componente
  const [partialPayment, setPartialPayment] = useState<string>(''); // Monto del abono parcial
  const [comments, setComments] = useState(''); // Comentarios del usuario
  const [showPartialPayment, setShowPartialPayment] = useState(false); // Controla si se muestra el campo de abono parcial

  // Calcula el total del carrito sumando el precio por cantidad de cada producto
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity, // Precio x Cantidad
    0 // Valor inicial del acumulador
  );

  // Maneja el envío de la factura
  const handleSubmit = () => {
    if (showPartialPayment) {
      // Si se seleccionó "Abonar"
      if (!partialPayment || Number(partialPayment) <= 0) {
        // Validación del monto ingresado
        alert('Por favor ingrese un monto de abono válido'); // Mensaje de error si el abono no es válido
        return;
      }
      // Genera la factura con estado "Abonado"
      onCheckout('partial', {
        comments, // Incluye los comentarios
        partialPayment: Number(partialPayment), // Convierte el abono a número
      });
    } else {
      // Genera la factura con estado "En Espera"
      onCheckout('pending', { comments });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Encabezado del carrito */}
      <h2 className="text-xl font-semibold mb-4">Carrito</h2>

      {/* Si no hay productos, muestra un mensaje */}
      {items.length === 0 ? (
        <p className="text-gray-500">No hay productos en el carrito</p>
      ) : (
        <>
          {/* Lista de productos en el carrito */}
          <div className="space-y-4 mb-6">
            {items.map((item, index) => (
              <div
                key={index} // Identificador único para cada producto
                className="flex items-center justify-between border-b pb-2"
              >
                {/* Detalles del producto */}
                <div>
                  <h3 className="font-medium">{item.product.name}</h3> {/* Nombre del producto */}
                  <p className="text-gray-600">
                    Q{item.product.price.toFixed(2)} c/u {/* Precio unitario */}
                  </p>
                </div>

                {/* Controles para cantidad y eliminación */}
                <div className="flex items-center gap-3">
                  {/* Botón para disminuir la cantidad */}
                  <button
                    onClick={() =>
                      onUpdateQuantity(index, Math.max(1, item.quantity - 1)) // Asegura que la cantidad sea al menos 1
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus size={16} /> {/* Icono para disminuir */}
                  </button>

                  <span className="w-8 text-center">{item.quantity}</span> {/* Cantidad actual */}

                  {/* Botón para aumentar la cantidad */}
                  <button
                    onClick={() => onUpdateQuantity(index, item.quantity + 1)} // Incrementa la cantidad
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus size={16} /> {/* Icono para aumentar */}
                  </button>

                  {/* Botón para eliminar el producto */}
                  <button
                    onClick={() => onRemoveItem(index)} // Llama a la función de eliminación
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} /> {/* Icono de eliminar */}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Campo para agregar comentarios */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comentarios
            </label>
            <textarea
              value={comments} // Valor actual de los comentarios
              onChange={(e) => setComments(e.target.value)} // Actualiza el estado al escribir
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              rows={3}
              placeholder="Agregar comentarios..." // Texto de ayuda para el usuario
            />
          </div>

          {/* Campo para ingresar el monto del abono */}
          {showPartialPayment && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto del Abono
              </label>
              <input
                type="number" // Solo permite números
                value={partialPayment} // Valor actual del abono parcial
                onChange={(e) => setPartialPayment(e.target.value)} // Actualiza el estado al escribir
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Ingrese el monto del abono" // Texto de ayuda
              />
            </div>
          )}

          {/* Total del carrito */}
          <div className="mt-4">
            <p className="text-lg font-semibold mb-4">
              Total: Q{total.toFixed(2)} {/* Total calculado */}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {/* Botón para generar factura en estado "En Espera" */}
              <button
                onClick={() => {
                  setShowPartialPayment(false); // Oculta el campo de abono
                  handleSubmit(); // Genera la factura
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
              >
                En Espera
              </button>

              {/* Botón para habilitar el campo de abono */}
              <button
                onClick={() => setShowPartialPayment(true)} // Muestra el campo de abono
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Abonar
              </button>

              {/* Botón para confirmar el abono */}
              {showPartialPayment && (
                <button
                  onClick={handleSubmit} // Genera la factura con estado "Abonado"
                  className="col-span-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Confirmar Abono
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
