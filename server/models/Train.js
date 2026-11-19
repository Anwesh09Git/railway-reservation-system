const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
  },
  { _id: false }
);

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ['SL', '3A', '2A', '1A', 'CC', 'EC'],
    },
    fare: { type: Number, required: true, min: 1 },
    totalSeats: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const trainSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    source: { type: stationSchema, required: true },
    destination: { type: stationSchema, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    duration: { type: String, required: true },
    distance: { type: Number, required: true, min: 1 },
    classes: { type: [classSchema], default: [] },
    amenities: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

trainSchema.index({ 'source.code': 1, 'destination.code': 1 });

module.exports = mongoose.model('Train', trainSchema);
