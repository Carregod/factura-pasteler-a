import React, { useState } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { InvoiceItem } from '../types';

interface CartProps {
  items: InvoiceItem[];
  onUpdateQuantity: (index: number, newQuantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: (comments: string, status: string) => void; // Callback para procesar comentarios y estado
}

export const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [comments, setComments] = useState('');
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = (status: string) => {
    onCheckout(comments, status);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Carrito</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">No hay productos en el carrito</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-gray-600">
                    Q{item.product.price.toFixed(2)} c/u
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      onUpdateQuantity(index, Math.max(1, item.quantity - 1))
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Agregar comentarios..."
            ></textarea>
          </div>
          <div className="mt-4 text-right">
            <p className="text-lg font-semibold">
              Total: Q{total.toFixed(2)}
            </p>
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={() => handleCheckout('en espera')}
              className="bg-yellow-500 text-white py-2 px-4 rounded"
            >
              En Espera
            </button>
            <button
              onClick={() => handleCheckout('abono')}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Abonar
            </button>
          </div>
        </>
      )}
    </div>
  );
};
