const express = require('express');
const Bike = require('../models/bike');
const auth = require('../middleware/auth');
const { validate, validateQuery, createBikeSchema, updateBikeSchema, querySchema } = require('../middleware/validate');

const router = express.Router();

router.post('/', auth, validate(createBikeSchema), async (req, res) => {
  try {
    const { brand, model, year, price, kilometers_driven, location, imageUrl } = req.body;
    
    // Generate unique ID for the bike
    const id = `BIKE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const bike = await Bike.create({
      id,
      brand,
      model,
      year,
      price,
      kilometers_driven,
      location,
      imageUrl,
      sellerId: req.user.sub
    });

    res.status(201).json(bike);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, validate(updateBikeSchema), async (req, res) => {
  try {
    const {id} = req.params
    const { brand, model, year, price, kilometers_driven, location, imageUrl } = req.body;

    const bike = await Bike.findOne({ id });
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }

    if (bike.sellerId !== req.user.sub) {
      return res.status(403).json({ message: 'Access denied. Only the seller can edit this bike.' });
    }

    const updatedBike = await Bike.findOneAndUpdate(
      { id },
      { brand, model, year, price, kilometers_driven, location, imageUrl },
      { new: true, runValidators: true }
    );

    res.json(updatedBike);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const bike = await Bike.findOne({ id });
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }

    if (bike.sellerId !== req.user.sub) {
      return res.status(403).json({ message: 'Access denied. Only the seller can delete this bike.' });
    }

    await Bike.findOneAndDelete({ id });
    res.json({ message: 'Bike deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my-listings', auth, async (req, res) => {
  try {
    const bikes = await Bike.find({ sellerId: req.user.sub }).sort({ createdAt: -1 });
    res.status(200).json(bikes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const bikes = await Bike.find({}).sort({ createdAt: -1 });
    res.status(200).json(bikes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/search', validateQuery(querySchema), async (req, res) => {
  try {
    const {brand, model} = req.query
    const bikes = await Bike.find({brand, model});
    res.status(200).json({"data": bikes});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bike = await Bike.findOne({ id });
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    return res.json(bike);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch bike', error: error.message });
  }
});

module.exports = router;


