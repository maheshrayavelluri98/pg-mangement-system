const mongoose = require('mongoose');

const RentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add rent amount']
  },
  month: {
    type: Number,
    required: [true, 'Please add month (1-12)'],
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: [true, 'Please add year']
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Other'],
  },
  paymentReference: {
    type: String
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure a tenant doesn't have duplicate rent entries for the same month/year
RentSchema.index({ tenantId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Rent', RentSchema);
