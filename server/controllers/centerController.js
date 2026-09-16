const Center = require('../models/Center');

const createCenter = async (req, res) => {
  try {
    const { name, address, capacity, facilities } = req.body;
    const center = await Center.create({ name, address, capacity, facilities });
    res.status(201).json({ message: 'Center created', center });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create center', error: error.message });
  }
};

const getAllCenters = async (req, res) => {
  try {
    const centers = await Center.find().sort({ name: 1 });
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch centers', error: error.message });
  }
};

const deleteCenter = async (req, res) => {
  try {
    const center = await Center.findByIdAndDelete(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });
    res.json({ message: 'Center deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete center', error: error.message });
  }
};

module.exports = { createCenter, getAllCenters, deleteCenter };