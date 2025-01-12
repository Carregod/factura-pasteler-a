// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//   id: Number,
//   name: String,
//   price: Number,
//   category: String,
//   image: String
// });

// const invoiceItemSchema = new mongoose.Schema({
//   product: productSchema,
//   quantity: Number
// });

// const invoiceSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   items: {
//     type: [invoiceItemSchema],
//     validate: {
//       validator: function (items) {
//         return items.length > 0; // Asegura que haya al menos un ítem en la factura
//       },
//       message: 'An invoice must have at least one item.'
//     }
//   },
//   total: {
//     type: Number,
//     required: true,
//     default: function () {
//       // Calcula el total sumando los subtotales de los ítems
//       return this.items.reduce((acc, item) => acc + item.subtotal, 0);
//     }
//   },
//   customerName: {
//     type: String,
//     required: true
//   },
//   customerNIT: {
//     type: String,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'partial', 'completed', 'cancelled'],
//     default: 'pending'
//   },
//   partialPayment: {
//     type: Number,
//     default: 0,
//     validate: {
//       validator: function (value) {
//         return value <= this.total; // El pago parcial no puede exceder el total
//       },
//       message: 'Partial payment cannot exceed the total amount.'
//     }
//   },
//   cancellationReason: {
//     type: String,
//     required: function () {
//       return this.status === 'cancelled'; // Obligatorio si el estado es "cancelled"
//     }
//   },
//   comment: {
//     type: String, // Puedes usar String u otro tipo según sea necesario
//     default: '' // O establece otro valor predeterminado
//   },
//   lastModified: {
//     type: Date,
//     default: Date.now
//   }
// }, { timestamps: true });


// export default mongoose.model('Invoice', invoiceSchema);

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  portionPrice: Number,
  category: String,
  minPortions: Number,
  maxPortions: Number,
  description: String
});

const invoiceItemSchema = new mongoose.Schema({
  product: productSchema,
  quantity: Number,
  portions: Number,
  unitPrice: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const invoiceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  items: {
    type: [invoiceItemSchema],
    validate: {
      validator: function(items) {
        return items.length > 0;
      },
      message: 'An invoice must have at least one item.'
    }
  },
  total: {
    type: Number,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerNIT: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'cancelled'],
    default: 'pending'
  },
  partialPayment: {
    type: Number,
    default: 0,
    validate: {
      validator: function(value) {
        return value <= this.total;
      },
      message: 'Partial payment cannot exceed the total amount.'
    }
  },
  cancellationReason: {
    type: String,
    required: function() {
      return this.status === 'cancelled';
    }
  },
  comment: String,
  lastModified: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);