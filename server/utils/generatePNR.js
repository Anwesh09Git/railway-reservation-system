const Booking = require('../models/Booking');

/** Generate a unique 10 digit PNR number. */
const generatePNR = async () => {
  let pnr;
  let exists = true;

  while (exists) {
    pnr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
    // eslint-disable-next-line no-await-in-loop
    exists = await Booking.exists({ pnr });
  }

  return pnr;
};

module.exports = generatePNR;
