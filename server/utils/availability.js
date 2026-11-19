const Booking = require('../models/Booking');

const BERTH_PATTERN = ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];

const berthForSeat = (seat) => BERTH_PATTERN[(seat - 1) % BERTH_PATTERN.length];

/**
 * Returns seat availability for a train on a given date and class.
 * Seats marked on cancelled / waitlisted bookings are released automatically.
 */
const getAvailability = async (train, journeyDate, className) => {
  const classInfo = train.classes.find((c) => c.name === className);
  if (!classInfo) return null;

  const bookings = await Booking.find({
    train: train._id,
    journeyDate,
    travelClass: className,
    status: 'confirmed',
  }).select('passengers.seat');

  const usedSeats = new Set();
  bookings.forEach((booking) => {
    booking.passengers.forEach((passenger) => {
      if (passenger.seat) usedSeats.add(passenger.seat);
    });
  });

  const availableSeats = [];
  for (let seat = 1; seat <= classInfo.totalSeats; seat += 1) {
    if (!usedSeats.has(seat)) availableSeats.push(seat);
  }

  return {
    class: className,
    fare: classInfo.fare,
    totalSeats: classInfo.totalSeats,
    bookedSeats: usedSeats.size,
    availableSeats: availableSeats.length,
    freeSeats: availableSeats,
  };
};

module.exports = { getAvailability, berthForSeat, BERTH_PATTERN };
