const express = require('express');
const Train = require('../models/Train');
const { getAvailability } = require('../utils/availability');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const matchesStation = (station, query) => {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  return station.name.toLowerCase().includes(q) || station.code.toLowerCase().includes(q);
};

const withAvailability = async (train, date, requestedClass) => {
  const obj = train.toObject();
  const classes = requestedClass
    ? train.classes.filter((c) => c.name === requestedClass)
    : train.classes;

  obj.availability = {};
  for (const cls of classes) {
    // eslint-disable-next-line no-await-in-loop
    obj.availability[cls.name] = await getAvailability(train, date, cls.name);
  }
  return obj;
};

// @route   GET /api/trains
router.get('/', async (req, res, next) => {
  try {
    const trains = await Train.find({ isActive: true }).sort({ number: 1 });
    return res.json({ success: true, count: trains.length, trains });
  } catch (error) {
    return next(error);
  }
});

// @route   GET /api/trains/stations
router.get('/stations', async (req, res, next) => {
  try {
    const trains = await Train.find({ isActive: true }).select('source destination');
    const stationMap = new Map();
    trains.forEach((train) => {
      stationMap.set(train.source.code, train.source);
      stationMap.set(train.destination.code, train.destination);
    });
    const stations = [...stationMap.values()].sort((a, b) => a.code.localeCompare(b.code));
    return res.json({ success: true, stations });
  } catch (error) {
    return next(error);
  }
});

// @route   GET /api/trains/search
router.get('/search', async (req, res, next) => {
  try {
    const { from, to, date, class: travelClass } = req.query;

    let trains = await Train.find({ isActive: true });
    trains = trains.filter(
      (train) => matchesStation(train.source, from) && matchesStation(train.destination, to)
    );

    if (travelClass) {
      trains = trains.filter((train) => train.classes.some((c) => c.name === travelClass));
    }

    const results = [];
    for (const train of trains) {
      // eslint-disable-next-line no-await-in-loop
      results.push(await withAvailability(train, date, travelClass));
    }

    return res.json({
      success: true,
      count: results.length,
      date: date || null,
      trains: results,
    });
  } catch (error) {
    return next(error);
  }
});

// @route   GET /api/trains/:id
router.get('/:id', async (req, res, next) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) return res.status(404).json({ success: false, message: 'Train not found' });
    const data = await withAvailability(train, req.query.date);
    return res.json({ success: true, train: data });
  } catch (error) {
    return next(error);
  }
});

// @route   POST /api/trains  (admin)
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const train = await Train.create(req.body);
    return res.status(201).json({ success: true, message: 'Train added', train });
  } catch (error) {
    return next(error);
  }
});

// @route   PUT /api/trains/:id  (admin)
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const train = await Train.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!train) return res.status(404).json({ success: false, message: 'Train not found' });
    return res.json({ success: true, message: 'Train updated', train });
  } catch (error) {
    return next(error);
  }
});

// @route   DELETE /api/trains/:id  (admin)
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const train = await Train.findByIdAndDelete(req.params.id);
    if (!train) return res.status(404).json({ success: false, message: 'Train not found' });
    return res.json({ success: true, message: 'Train deleted' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
