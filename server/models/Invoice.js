import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  category: String,
  image: String
});

const invoiceItemSchema = new mongoose.Schema({
  product: productSchema,
  quantity: Number
});

const invoiceSchema = new mongoose.Schema({
  id: String,
  date: Date,
  items: [invoiceItemSchema],
  total: Number,
  customerName: String,
  customerNIT: String,
  status: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'cancelled'],
    default: 'pending'
  },
  partialPayment: Number,
  cancellationReason: String,
  lastModified: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);