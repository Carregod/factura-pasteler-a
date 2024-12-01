import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Edit2, FileText, XCircle, File } from 'lucide-react';
import { getInvoices, updateInvoiceStatus } from '../services/api';
import { Invoice as InvoiceType, InvoiceStatus } from '../types';
import { Invoice } from './Invoice';

export const InvoiceHistory: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationModal, setShowCancellationModal] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (invoice: InvoiceType, status: InvoiceStatus) => {
    try {
      if (status === 'cancelled') {
        setSelectedInvoice(invoice);
        setShowCancellationModal(true);
        return;
      }

      await updateInvoiceStatus(invoice.id, status);
      await fetchInvoices();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      alert('Error al actualizar el estado de la factura');
    }
  };

  const handleCancelInvoice = async () => {
    if (!selectedInvoice || !cancellationReason) return;

    try {
      await updateInvoiceStatus(selectedInvoice.id, 'cancelled', { cancellationReason });
      resetModals();
      await fetchInvoices();
    } catch (error) {
      console.error('Error cancelling invoice:', error);
      alert('Error al cancelar la factura');
    }
  };

  const resetModals = () => {
    setShowCancellationModal(false);
    setCancellationReason('');
    setSelectedInvoice(null);
  };

  const getStatusBadgeClass = (status: InvoiceStatus) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      partial: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return `${baseClasses} ${statusClasses[status] || ''}`;
  };

  const renderStatusText = (status: InvoiceStatus) => {
    const statusTexts = {
      pending: 'En Espera',
      partial: 'Abonado',
      completed: 'Completado',
      cancelled: 'Cancelado'
    };
    return statusTexts[status];
  };

  if (loading) {
    return <div className="bg-white p-6 rounded-lg shadow-md">Cargando facturas...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Historial de Facturas</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Factura #</th>
              <th className="text-left py-2">Cliente</th>
              <th className="text-left py-2">Fecha</th>
              <th className="text-right py-2">Total</th>
              <th className="text-center py-2">Estado</th>
              <th className="text-left py-2">Motivo de Cancelación</th>
              <th className="text-center py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{invoice.id}</td>
                <td className="py-2">{invoice.customerName}</td>
                <td className="py-2">{format(new Date(invoice.date), 'dd/MM/yyyy HH:mm')}</td>
                <td className="py-2 text-right">${invoice.total.toFixed(2)}</td>
                <td className="py-2 text-center">
                  <span className={getStatusBadgeClass(invoice.status)}>
                    {renderStatusText(invoice.status)}
                  </span>
                </td>
                <td className="py-2 text-left">
                  {invoice.status === 'cancelled' 
                    ? invoice.cancellationReason || 'No especificado' 
                    : 'N/A'}
                </td>
                <td className="py-2">
                  <div className="flex justify-center gap-2">
                    {invoice.status !== 'completed' && invoice.status !== 'cancelled' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(invoice, 'completed')}
                          className="p-1 text-green-500 hover:bg-green-50 rounded"
                          title="Generar Factura"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(invoice, 'cancelled')}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                          title="Cancelar"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowInvoiceModal(true);
                      }}
                      className="p-1 text-purple-500 hover:bg-purple-50 rounded"
                      title="Ver Factura"
                    >
                      <File size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCancellationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Cancelar Factura</h3>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
              rows={3}
              placeholder="Razón de cancelación..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={resetModals}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleCancelInvoice}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <Invoice invoice={selectedInvoice} />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};