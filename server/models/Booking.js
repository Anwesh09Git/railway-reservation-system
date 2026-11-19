const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1, max: 120 },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    seat: { type: Number, default: null },
    berth: { type: String, default: null },
  },
  { _id: false }
);

const snapshotStationSchema = new mongoose.Schema(
  {
    name: String,
    code: String,
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    pnr: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    train: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
    trainSnapshot: {
      number: String,
      name: String,
      source: snapshotStationSchema,
      destination: snapshotStationSchema,
      departureTime: String,
      arrivalTime: String,
    },
    journeyDate: { type: String, required: true },
    travelClass: { type: String, required: true },
    passengers: { type: [passengerSchema], default: [] },
    farePerPassenger: { type: Number, required: true },
    reservationCharge: { type: Number, default: 40 },
    totalFare: { type: Number, required: true },
    status: {
      type: String,
      enum: ['confirmed', 'waitlist', 'cancelled'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'refunded'],
      default: 'paid',
    },
    paymentMethod: { type: String, default: 'UPI' },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

bookingSchema.index({ train: 1, journeyDate: 1, travelClass: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
