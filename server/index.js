import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Invoice from './models/Invoice.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI ,)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Get all invoices with filters
app.get('/api/invoices', async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerNIT: { $regex: search, $options: 'i' } },
        { id: { $regex: search, $options: 'i' } }
      ];
    }
    
    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new invoice
app.post('/api/invoices', async (req, res) => {
  try {
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 }); // Última factura creada
    const lastId = lastInvoice?.id || "pasvilla00";
    const match = lastId.match(/(\d+)$/);
    const newNumber = match ? parseInt(match[1]) + 1 : 1;
    const newId = `pasvilla${newNumber.toString().padStart(2, '0')}`;

    const newInvoice = new Invoice({
      id: newId, // Genera el ID aquí
      date: new Date(),
      items: req.body.items,
      total: req.body.total,
      customerName: req.body.customerName,
      customerNIT: req.body.customerNIT,
      status: req.body.status,
      partialPayment:req.body.partialPayment,
      comment: req.body.comment || '' // Incluye el comentario
    });

    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update invoice status
app.patch('/api/invoices/:id/status', async (req, res) => {
  try {
    const { status, partialPayment, cancellationReason } = req.body;
    const invoice = await Invoice.findOne({ id: req.params.id });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    invoice.status = status;
    invoice.lastModified = new Date();
    
    if (status === 'partial' && partialPayment) {
      invoice.partialPayment = partialPayment;
    }
    
    if (status === 'cancelled' && cancellationReason) {
      invoice.cancellationReason = cancellationReason;
    }
    
    const updatedInvoice = await invoice.save();
    res.json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update invoice
app.put('/api/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ id: req.params.id });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    if (invoice.status === 'completed' || invoice.status === 'cancelled') {
      return res.status(400).json({ 
        message: 'Cannot modify completed or cancelled invoices' 
      });
    }
    
    Object.assign(invoice, req.body, { lastModified: new Date() });
    const updatedInvoice = await invoice.save();
    res.json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});