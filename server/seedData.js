const User = require('./models/User');
const Train = require('./models/Train');
const Booking = require('./models/Booking');
const { berthForSeat } = require('./utils/availability');

const dayFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const trains = [
  {
    number: '12951',
    name: 'Mumbai Rajdhani Express',
    source: { name: 'Mumbai Central', code: 'MMCT' },
    destination: { name: 'New Delhi', code: 'NDLS' },
    departureTime: '16:35',
    arrivalTime: '08:35',
    duration: '16h 00m',
    distance: 1386,
    classes: [
      { name: '3A', fare: 2350, totalSeats: 60 },
      { name: '2A', fare: 3350, totalSeats: 40 },
      { name: '1A', fare: 5600, totalSeats: 12 },
    ],
    amenities: ['AC', 'Food Included', 'Wi-Fi', 'Charging Point'],
  },
  {
    number: '12301',
    name: 'Howrah Rajdhani Express',
    source: { name: 'Howrah Junction', code: 'HWH' },
    destination: { name: 'New Delhi', code: 'NDLS' },
    departureTime: '16:50',
    arrivalTime: '10:00',
    duration: '17h 10m',
    distance: 1451,
    classes: [
      { name: '3A', fare: 2450, totalSeats: 65 },
      { name: '2A', fare: 3500, totalSeats: 40 },
      { name: '1A', fare: 5800, totalSeats: 16 },
    ],
    amenities: ['AC', 'Food Included', 'Wi-Fi', 'Charging Point'],
  },
  {
    number: '12009',
    name: 'Shatabdi Express',
    source: { name: 'Chennai Central', code: 'MAS' },
    destination: { name: 'Bengaluru City', code: 'SBC' },
    departureTime: '06:00',
    arrivalTime: '11:10',
    duration: '05h 10m',
    distance: 362,
    classes: [
      { name: 'CC', fare: 1200, totalSeats: 78 },
      { name: 'EC', fare: 2400, totalSeats: 24 },
    ],
    amenities: ['AC', 'Food Included', 'Wi-Fi', 'Reclining Seats'],
  },
  {
    number: '12925',
    name: 'Paschim Express',
    source: { name: 'Mumbai Central', code: 'MMCT' },
    destination: { name: 'Amritsar Junction', code: 'ASR' },
    departureTime: '11:30',
    arrivalTime: '15:45',
    duration: '28h 15m',
    distance: 1810,
    classes: [
      { name: 'SL', fare: 720, totalSeats: 96 },
      { name: '3A', fare: 1900, totalSeats: 60 },
      { name: '2A', fare: 2750, totalSeats: 36 },
      { name: '1A', fare: 4600, totalSeats: 10 },
    ],
    amenities: ['Pantry Car', 'Charging Point', 'RMS'],
  },
  {
    number: '12309',
    name: 'Patna Rajdhani Express',
    source: { name: 'New Delhi', code: 'NDLS' },
    destination: { name: 'Patna Junction', code: 'PNBE' },
    departureTime: '17:25',
    arrivalTime: '06:00',
    duration: '12h 35m',
    distance: 998,
    classes: [
      { name: '3A', fare: 1850, totalSeats: 64 },
      { name: '2A', fare: 2700, totalSeats: 38 },
      { name: '1A', fare: 4550, totalSeats: 12 },
    ],
    amenities: ['AC', 'Food Included', 'Wi-Fi'],
  },
  {
    number: '12627',
    name: 'Karnataka Express',
    source: { name: 'New Delhi', code: 'NDLS' },
    destination: { name: 'Bengaluru City', code: 'SBC' },
    departureTime: '20:00',
    arrivalTime: '05:30',
    duration: '33h 30m',
    distance: 2365,
    classes: [
      { name: 'SL', fare: 900, totalSeats: 96 },
      { name: '3A', fare: 2400, totalSeats: 64 },
      { name: '2A', fare: 3500, totalSeats: 36 },
    ],
    amenities: ['Pantry Car', 'Charging Point', 'RMS'],
  },
  {
    number: '12839',
    name: 'Howrah Mail',
    source: { name: 'Howrah Junction', code: 'HWH' },
    destination: { name: 'Chennai Central', code: 'MAS' },
    departureTime: '22:00',
    arrivalTime: '20:30',
    duration: '22h 30m',
    distance: 1662,
    classes: [
      { name: 'SL', fare: 780, totalSeats: 96 },
      { name: '3A', fare: 2100, totalSeats: 60 },
      { name: '2A', fare: 3050, totalSeats: 32 },
    ],
    amenities: ['Pantry Car', 'Charging Point'],
  },
  {
    number: '12213',
    name: 'Duronto Express',
    source: { name: 'New Delhi', code: 'NDLS' },
    destination: { name: 'Mumbai Central', code: 'MMCT' },
    departureTime: '22:10',
    arrivalTime: '14:00',
    duration: '15h 50m',
    distance: 1386,
    classes: [
      { name: '3A', fare: 2300, totalSeats: 60 },
      { name: '2A', fare: 3300, totalSeats: 40 },
      { name: '1A', fare: 5500, totalSeats: 12 },
    ],
    amenities: ['AC', 'Food Included', 'Wi-Fi', 'Charging Point'],
  },
];

const runSeed = async () => {
  try {
    console.log('🌱 Seeding database...');

    await Promise.all([User.deleteMany({}), Train.deleteMany({}), Booking.deleteMany({})]);

    // The User model hashes plain-text passwords in its pre-save hook.
    await User.create({
      name: 'Railway Admin',
      email: 'admin@railway.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
    });

    const demoUser = await User.create({
      name: 'Aarav Sharma',
      email: 'demo@railway.com',
      password: 'demo123',
      role: 'user',
      phone: '9876543211',
    });

    const createdTrains = await Train.insertMany(trains);

    const bookingSamples = [
      { train: createdTrains[0], date: dayFromNow(3), cls: '3A', seats: [1, 2], pnr: '4829103756', method: 'UPI' },
      { train: createdTrains[2], date: dayFromNow(7), cls: 'CC', seats: [5], pnr: '7391028456', method: 'Card' },
      { train: createdTrains[5], date: dayFromNow(12), cls: 'SL', seats: [11, 12, 13], pnr: '9012847365', method: 'Net Banking' },
    ];

    const sampleNames = [
      ['Aarav Sharma', 'Riya Sharma'],
      ['Aarav Sharma'],
      ['Aarav Sharma', 'Meera Sharma', 'Kabir Sharma'],
    ];
    const sampleAges = [[24, 22], [24], [24, 20, 16]];

    for (let i = 0; i < bookingSamples.length; i += 1) {
      const sample = bookingSamples[i];
      const classInfo = sample.train.classes.find((c) => c.name === sample.cls);
      const reservationCharge = sample.cls === 'SL' ? 40 : 60;
      await Booking.create({
        pnr: sample.pnr,
        user: demoUser._id,
        train: sample.train._id,
        trainSnapshot: {
          number: sample.train.number,
          name: sample.train.name,
          source: sample.train.source,
          destination: sample.train.destination,
          departureTime: sample.train.departureTime,
          arrivalTime: sample.train.arrivalTime,
        },
        journeyDate: sample.date,
        travelClass: sample.cls,
        passengers: sample.seats.map((seat, index) => ({
          name: sampleNames[i][index],
          age: sampleAges[i][index],
          gender: index % 2 === 0 ? 'Male' : 'Female',
          seat,
          berth: berthForSeat(seat),
        })),
        farePerPassenger: classInfo.fare,
        reservationCharge,
        totalFare: classInfo.fare * sample.seats.length + reservationCharge,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: sample.method,
        createdAt: new Date(Date.now() - i * 86400000),
      });
    }

    console.log('✅ Seed complete');
    console.log(`   Trains: ${createdTrains.length}`);
    console.log('   Admin:  admin@railway.com / admin123');
    console.log('   User:   demo@railway.com / demo123');
    console.log('   Sample PNR: 4829103756');
    return createdTrains.length;
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    throw error;
  }
};

module.exports = runSeed;
