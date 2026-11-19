const express = require('express');
const Booking = require('../models/Booking');
const Train = require('../models/Train');
const User = require('../models/User');
const generatePNR = require('../utils/generatePNR');
const { getAvailability, berthForSeat } = require('../utils/availability');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const isValidDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || '');
const todayString = () => new Date().toISOString().slice(0, 10);

// @route   POST /api/bookings
router.post('/', protect, async (req, res, next) => {
  try {
    const { trainId, journeyDate, travelClass, passengers, paymentMethod } = req.body;

    if (!trainId || !isValidDate(journeyDate) || !travelClass) {
      return res.status(400).json({
        success: false,
        message: 'Train, journey date and travel class are required',
      });
    }
    if (journeyDate < todayString()) {
      return res.status(400).json({ success: false, message: 'Journey date cannot be in the past' });
    }
    if (!Array.isArray(passengers) || passengers.length === 0 || passengers.length > 6) {
      return res.status(400).json({ success: false, message: 'Add between 1 and 6 passengers' });
    }
    for (const passenger of passengers) {
      if (!passenger.name?.trim() || !passenger.age || !passenger.gender) {
        return res.status(400).json({ success: false, message: 'Each passenger needs name, age and gender' });
      }
    }

    const train = await Train.findById(trainId);
    if (!train) return res.status(404).json({ success: false, message: 'Train not found' });

    const classInfo = train.classes.find((c) => c.name === travelClass);
    if (!classInfo) {
      return res.status(400).json({ success: false, message: 'This class is not available on the train' });
    }

    const availability = await getAvailability(train, journeyDate, travelClass);
    const isWaitlist = passengers.length > availability.availableSeats;
    const assignedSeats = isWaitlist ? [] : availability.freeSeats.slice(0, passengers.length);
    const reservationCharge = travelClass === 'SL' ? 40 : 60;
    const totalFare = classInfo.fare * passengers.length + reservationCharge;

    const booking = await Booking.create({
      pnr: await generatePNR(),
      user: req.user._id,
      train: train._id,
      trainSnapshot: {
        number: train.number,
        name: train.name,
        source: train.source,
        destination: train.destination,
        departureTime: train.departureTime,
        arrivalTime: train.arrivalTime,
      },
      journeyDate,
      travelClass,
      passengers: passengers.map((passenger, index) => ({
        name: passenger.name.trim(),
        age: Number(passenger.age),
        gender: passenger.gender,
        seat: assignedSeats[index] || null,
        berth: assignedSeats[index] ? berthForSeat(assignedSeats[index]) : null,
      })),
      farePerPassenger: classInfo.fare,
      reservationCharge,
      totalFare,
      status: isWaitlist ? 'waitlist' : 'confirmed',
      paymentStatus: isWaitlist ? 'pending' : 'paid',
      paymentMethod: paymentMethod || 'UPI',
    });

    return res.status(201).json({
      success: true,
      message: isWaitlist
        ? 'Ticket added to waitlist. Seats will be allotted as they free up.'
        : 'Ticket booked successfully!',
      booking,
    });
  } catch (error) {
    return next(error);
  }
});

// @route   GET /api/bookings/my
router.get('/my', protect, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    return next(error);
  }
});

// @route   GET /api/bookings/stats (admin)
router.get('/stats', protect, adminOnly, async (req, res, next) => {
  try {
    const [totalBookings, confirmed, cancelled, revenueResult, users, trains] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalFare' } } },
      ]),
      User.countDocuments({ role: 'user' }),
      Train.countDocuments(),
    ]);

    return res.json({
      success: true,
      stats: {
        totalBookings,
        confirmed,
        cancelled,
        waitlist: totalBookings - confirmed - cancelled,
        revenue: revenueResult[0]?.total || 0,
        users,
        trains,
      },
    });
  } catch (error) {
    return next(error);
  }
});

// @route   GET /api/bookings/all (admin)
router.get('/all', protect, adminOnly, async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    return res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    return next(error);
  }
});

// @route   GET /api/bookings/pnr/:pnr
router.get('/pnr/:pnr', async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ pnr: req.params.pnr }).populate('user', 'name');
    if (!booking) return res.status(404).json({ success: false, message: 'No ticket found for this PNR' });
    return res.json({ success: true, booking });
  } catch (error) {
    return next(error);
  }
});

// @route   GET /api/bookings/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }
    return res.json({ success: true, booking });
  } catch (error) {
    return next(error);
  }
});

// @route   PUT /api/bookings/:id/cancel
router.put('/:id/cancel', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'This ticket is already cancelled' });
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancelledAt = new Date();
    await booking.save();

    return res.json({ success: true, message: 'Ticket cancelled. Refund will be processed shortly.', booking });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
