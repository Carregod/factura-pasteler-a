import { Invoice, InvoiceItem, InvoiceStatus } from '../types';

let lastGeneratedId = "pasvilla00"; // Valor inicial

// Función para generar el nuevo ID de factura
export const generateInvoiceId = (): string => {
  const match = lastGeneratedId.match(/(\d+)$/);
  const newNumber = match ? parseInt(match[1]) + 1 : 1;
  const newId = `pasvilla${newNumber.toString().padStart(3, '0')}`;
  lastGeneratedId = newId; // Actualizamos el último ID generado
  return newId;
};

export const calculateItemPrice = (item: InvoiceItem): number => {
  return ((item.portions || 0) * (item.product.portionPrice || 0)) * (item.quantity || 0);
};

export const calculateTotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + calculateItemPrice(item), 0);   
};

export const createInvoice = (
  items: InvoiceItem[],
  customerName: string,
  customerNIT: string,
  customerPhone: string,
  status: InvoiceStatus,
  invoiceComments: string, // Para los comentarios de la factura
  partialPayment: number | null // Para los abonos parciales
): Invoice => {
  const processedItems = items.map(item => {
    const unitPrice = (item.portions || 0) * (item.product?.portionPrice || 0); // Precio unitario incluyendo porciones
    const subtotal = unitPrice * item.quantity; // Subtotal: Precio unitario * cantidad

    return {
      ...item,
      unitPrice,  // Asignamos el precio unitario calculado
      subtotal    // Asignamos el subtotal calculado
    };
  });

  const total = calculateTotal(items); // Total de la factura

  return {
    id: generateInvoiceId(), // Usamos la nueva función para generar el ID
    date: new Date(),
    items: processedItems,
    total,
    customerName,
    customerNIT,
    customerPhone,
    comment: invoiceComments,  // Agregar comentarios
    status,  // Estado de la factura
    cancellationReason: '',  // Razón de cancelación si existe
    partialPayment: partialPayment || undefined,  // Solo incluir el abono si es diferente de null
  };
};
