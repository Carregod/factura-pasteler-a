import React, { useState } from 'react';
import { Cake, History } from 'lucide-react';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';
import { InvoiceForm } from './components/InvoiceForm';
import { Invoice } from './components/Invoice';
import { InvoiceHistory } from './components/InvoiceHistory';
import { Product, InvoiceItem, Invoice as InvoiceType } from './types';
import { saveInvoice } from './services/api';

function App() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerNIT, setCustomerNIT] = useState('');
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceType | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleAddProduct = (product: Product) => {
    const existingIndex = items.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].quantity += 1;
      setItems(newItems);
    } else {
      setItems([...items, { product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    const newItems = [...items];
    newItems[index].quantity = newQuantity;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleGenerateInvoice = async () => {
    if (!customerName || !customerNIT || items.length === 0) {
      alert('Por favor complete los datos del cliente y agregue productos');
      return;
    }

    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const invoice: InvoiceType = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
      items: [...items],
      total,
      customerName,
      customerNIT,
    };

    try {
      await saveInvoice(invoice);
      setCurrentInvoice(invoice);
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error al guardar la factura. Por favor intente nuevamente.');
    }
  };

  const handleNewInvoice = () => {
    setItems([]);
    setCustomerName('');
    setCustomerNIT('');
    setCurrentInvoice(null);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-pink-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cake size={24} />
            <h1 className="text-2xl font-bold">Pastelería Delicias</h1>
          </div>
          {!currentInvoice && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 bg-pink-600 px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
            >
              <History size={20} />
              {showHistory ? 'Nueva Factura' : 'Ver Historial'}
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {currentInvoice ? (
          <div>
            <Invoice invoice={currentInvoice} />
            <div className="mt-6 text-center">
              <button
                onClick={handleNewInvoice}
                className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors"
              >
                Nueva Factura
              </button>
            </div>
          </div>
        ) : showHistory ? (
          <InvoiceHistory />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <InvoiceForm
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerNIT={customerNIT}
                setCustomerNIT={setCustomerNIT}
              />
              <ProductList onAddProduct={handleAddProduct} />
            </div>
            <div>
              <Cart
                items={items}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
              {items.length > 0 && (
                <button
                  onClick={handleGenerateInvoice}
                  className="mt-4 w-full bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors"
                >
                  Generar Factura
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;