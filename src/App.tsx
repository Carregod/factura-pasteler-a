import { useState } from 'react';
import { Cake, History } from 'lucide-react';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';
import { InvoiceForm } from './components/InvoiceForm';
import { Invoice as InvoiceComponent } from './components/Invoice';
import { InvoiceHistory } from './components/InvoiceHistory';
import { Product, InvoiceItem, Invoice as InvoiceType } from './types';
import { saveInvoice } from './services/api';
import { createInvoice } from './utils/invoice';

function App() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerNIT, setCustomerNIT] = useState('');
  const [customerPhone, setCustomerPhone] = useState(''); // Added phone state
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceType | null>(null);
  const [invoiceComments, setInvoiceComments] = useState('');
  const [checkoutStatus, setCheckoutStatus] = useState<'pending' | 'partial' | null>(null);
  const [partialPayment, setPartialPayment] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleAddProduct = (product: Product, portions: number) => {
    const existingIndex = items.findIndex(
      (item) => item.product.id === product.id && item.portions === portions
    );

    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].quantity += 1;
      setItems(newItems);
    } else {
      setItems([...items, { product, quantity: 1, portions }]);
    }
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newItems = [...items];
    newItems[index].quantity = newQuantity;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCheckout = (
    status: 'pending' | 'partial',
    data: { comments: string; partialPayment?: number }
  ) => {
    setInvoiceComments(data.comments || 'N/A');
    setCheckoutStatus(status);
    setPartialPayment(data.partialPayment || null);
  };

  const handleGenerateInvoice = async () => {
    if (!customerName.trim() || !customerNIT.trim() || !customerPhone.trim() || items.length === 0) {
      alert('Por favor complete los datos del cliente y agregue productos.');
      return;
    }

    if (!checkoutStatus) {
      alert('Por favor seleccione una opción de facturación (En Espera o Abonar).');
      return;
    }

    if (checkoutStatus === 'partial' && (partialPayment === null || partialPayment <= 0)) {
      alert('Por favor ingrese un monto de abono válido.');
      return;
    }

    const invoice = createInvoice(
      items,
      customerName,
      customerNIT,
      customerPhone,
      checkoutStatus,
      invoiceComments,
      partialPayment || null
    );
    
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
    setCustomerPhone('');
    setInvoiceComments('');
    setCheckoutStatus(null);
    setPartialPayment(null);
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
            <InvoiceComponent invoice={currentInvoice} />
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
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
              />
              <ProductList onAddProduct={handleAddProduct} />
            </div>
            <div>
              <Cart
                items={items}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
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


// // Importaciones necesarias
// import { useState } from 'react';
// import { Cake, History } from 'lucide-react';
// import { ProductList } from './components/ProductList';
// import { Cart } from './components/Cart';
// import { InvoiceForm } from './components/InvoiceForm';
// import { Invoice } from './components/Invoice';
// import { InvoiceHistory } from './components/InvoiceHistory';
// import { Product, InvoiceItem, Invoice as InvoiceType } from './types';
// import { saveInvoice } from './services/api';

// // Componente principal de la aplicación
// function App() {
//   const [items, setItems] = useState<InvoiceItem[]>([]);
//   const [customerName, setCustomerName] = useState('');
//   const [customerNIT, setCustomerNIT] = useState('');
//   const [currentInvoice, setCurrentInvoice] = useState<InvoiceType | null>(null);
//   const [invoiceComments, setInvoiceComments] = useState('');
//   const [checkoutStatus, setCheckoutStatus] = useState<'pending' | 'partial' | null>(null);
//   const [partialPayment, setPartialPayment] = useState<number | null>(null);
//   const [showHistory, setShowHistory] = useState(false);

//   // Maneja los comentarios y el estado al generar la factura
//   const handleCheckout = (
//     status: 'pending' | 'partial',
//     data: { comments: string; partialPayment?: number }
//   ): void => {
//     setInvoiceComments(data.comments || 'N/A');
//     setCheckoutStatus(status);
//     setPartialPayment(data.partialPayment || null);
//     console.log(`Estado de facturación: ${status}`);
//   };

//   // Agrega un producto al carrito
//   const handleAddProduct = (product: Product) => {
//     const existingIndex = items.findIndex(
//       (item) => item.product.id === product.id
//     );

//     if (existingIndex >= 0) {
//       const newItems = [...items];
//       newItems[existingIndex].quantity += 1;
//       setItems(newItems);
//     } else {
//       setItems([...items, { product, quantity: 1 }]);
//     }
//   };

//   // Actualiza la cantidad de un producto
//   const handleUpdateQuantity = (index: number, newQuantity: number) => {
//     if (newQuantity < 1) return; // Evita cantidades negativas o cero
//     const newItems = [...items];
//     newItems[index].quantity = newQuantity;
//     setItems(newItems);
//   };

//   // Elimina un producto del carrito
//   const handleRemoveItem = (index: number) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   // Genera una factura
//   const handleGenerateInvoice = async () => {
//     if (!customerName.trim() || !customerNIT.trim() || items.length === 0) {
//       alert('Por favor complete los datos del cliente y agregue productos.');
//       return;
//     }

//     if (!checkoutStatus) {
//       alert('Por favor seleccione una opción de facturación (En Espera o Abonar).');
//       return;
//     }

//     if (checkoutStatus === 'partial' && (partialPayment === null || partialPayment <= 0)) {
//       alert('Por favor ingrese un monto de abono válido.');
//       return;
//     }

//     const total = items.reduce(
//       (sum, item) => sum + item.product.price * item.quantity,
//       0
//     );

//     const invoice: InvoiceType = {
//       id: Math.random().toString(36).substr(2, 9),
//       date: new Date(),
//       items: [...items],
//       total,
//       customerName,
//       customerNIT,
//       comment: invoiceComments,
//       status: checkoutStatus,
//       cancellationReason: '',
//       partialPayment: partialPayment || undefined, // Asegura que solo se incluya si existe
//     };

//     try {
//       await saveInvoice(invoice);
//       setCurrentInvoice(invoice);
//     } catch (error) {
//       console.error('Error saving invoice:', error);
//       alert('Error al guardar la factura. Por favor intente nuevamente.');
//     }
//   };

//   // Reinicia el formulario para una nueva factura
//   const handleNewInvoice = () => {
//     setItems([]);
//     setCustomerName('');
//     setCustomerNIT('');
//     setInvoiceComments('');
//     setCheckoutStatus(null);
//     setPartialPayment(null);
//     setCurrentInvoice(null);
//     setShowHistory(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-pink-500 text-white p-4 shadow-md">
//         <div className="container mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Cake size={24} />
//             <h1 className="text-2xl font-bold">Pastelería Delicias</h1>
//           </div>
//           {!currentInvoice && (
//             <button
//               onClick={() => setShowHistory(!showHistory)}
//               className="flex items-center gap-2 bg-pink-600 px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
//             >
//               <History size={20} />
//               {showHistory ? 'Nueva Factura' : 'Ver Historial'}
//             </button>
//           )}
//         </div>
//       </header>

//       <main className="container mx-auto py-8 px-4">
//         {currentInvoice ? (
//           <div>
//             <Invoice invoice={currentInvoice} />
//             <div className="mt-6 text-center">
//               <button
//                 onClick={handleNewInvoice}
//                 className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors"
//               >
//                 Nueva Factura
//               </button>
//             </div>
//           </div>
//         ) : showHistory ? (
//           <InvoiceHistory />
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               <InvoiceForm
//                 customerName={customerName}
//                 setCustomerName={setCustomerName}
//                 customerNIT={customerNIT}
//                 setCustomerNIT={setCustomerNIT}
//               />
//               <ProductList onAddProduct={handleAddProduct} />
//             </div>
//             <div>
//               <Cart
//                 items={items}
//                 onUpdateQuantity={handleUpdateQuantity}
//                 onRemoveItem={handleRemoveItem}
//                 onCheckout={handleCheckout}
//               />
//               {items.length > 0 && (
//                 <button
//                   onClick={handleGenerateInvoice}
//                   className="mt-4 w-full bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors"
//                 >
//                   Generar Factura
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;
