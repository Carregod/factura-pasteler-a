import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { MessageSquare, Eye, Edit2, XCircle, CheckCircle } from 'lucide-react';
import { getInvoices, updateInvoiceStatus } from '../services/api';
import { Invoice } from '../types'; 
import { InvoiceView } from './invoiceView';
import { InvoiceEdit } from './InvoiceEdit';

export const InvoiceHistory: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

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

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const handleCancelInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedInvoice || !cancellationReason.trim()) {
      alert('Por favor ingrese un motivo de cancelación');
      return;
    }

    try {
      await updateInvoiceStatus(selectedInvoice.id, 'cancelled', {
        cancellationReason,
      });
      await fetchInvoices();
      setIsCancelModalOpen(false);
      setCancellationReason('');
      setSelectedInvoice(null);
    } catch (error) {
      console.error('Error cancelling invoice:', error);
      alert('Error al cancelar la factura');
    }
  };

  const handleCompleteInvoice = async (invoice: Invoice) => {
    try {
      await updateInvoiceStatus(invoice.id, 'completed');
      await fetchInvoices();
    } catch (error) {
      console.error('Error completing invoice:', error);
      alert('Error al finalizar la factura');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      partial: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    const statusText = {
      pending: 'En Espera',
      partial: 'Abonado',
      completed: 'Completado',
      cancelled: 'Cancelado',
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          badges[status as keyof typeof badges]
        }`}
      >
        {statusText[status as keyof typeof statusText]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Cargando facturas...</p>
      </div>
    );
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
              <th className="text-left py-2">Estado</th>
              <th className="text-left py-2">Comentario</th>
              <th className="text-left py-2">Motivo Cancelación</th>
              <th className="text-center py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{invoice.id}</td>
                <td className="py-2">{invoice.customerName}</td>
                <td className="py-2">
                  {format(new Date(invoice.date), 'dd/MM/yyyy HH:mm')}
                </td>
                <td className="py-2 text-right">Q{invoice.total.toFixed(2)}</td>
                <td className="py-2">
                  {getStatusBadge(invoice.status)}
                </td>
                <td className="py-2">
                  {invoice.comment && (
                    <div className="flex items-center gap-1">
                      <MessageSquare size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600 truncate max-w-[200px]">
                        {invoice.comment}
                      </span>
                    </div>
                  )}
                </td>
                <td className="py-2">
                  {invoice.cancellationReason && (
                    <span className="text-sm text-red-600 truncate max-w-[200px]">
                      {invoice.cancellationReason}
                    </span>
                  )}
                </td>
                <td className="py-2">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleViewInvoice(invoice)}
                      className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                      title="Ver Factura"
                    >
                      <Eye size={18} />
                    </button>
                    {['pending', 'partial'].includes(invoice.status) && (
                      <>
                        <button
                          onClick={() => handleEditInvoice(invoice)}
                          className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded"
                          title="Editar Factura"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleCompleteInvoice(invoice)}
                          className="p-1 text-green-600 hover:text-green-900 hover:bg-green-100 rounded"
                          title="Finalizar Factura"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleCancelInvoice(invoice)}
                          className="p-1 text-red-600 hover:text-red-900 hover:bg-red-100 rounded"
                          title="Cancelar Factura"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Invoice Modal */}
      {isViewModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <InvoiceView invoice={selectedInvoice} />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedInvoice(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {isEditModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <InvoiceEdit
                invoice={selectedInvoice}
                onSave={async () => {
                  await fetchInvoices();
                  setIsEditModalOpen(false);
                  setSelectedInvoice(null);
                }}
                onCancel={() => {
                  setIsEditModalOpen(false);
                  setSelectedInvoice(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cancel Invoice Modal */}
      {isCancelModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Cancelar Factura</h3>
              <p className="mb-4">
                ¿Está seguro que desea cancelar la factura #{selectedInvoice.id}?
              </p>
              <textarea
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Ingrese el motivo de cancelación"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleConfirmCancel}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
