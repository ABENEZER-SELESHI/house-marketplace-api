//controllers/houseController.js
const House = require('../models/House.js');

const createHouse = async (req, res) => {
    try {
        const house = new House({
            ...req.body,
            owner: req.user.id,
        });
        await house.save();
        res.status(201).json(house);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getHouses = async (req, res) => {
    try {
        const houses = await House.find({ status: 'available' });
        res.status(200).json(houses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getHouse = async (req, res) => {
    try {
        const house = await House.findById(req.params.id);
        if (!house) return res.status(404).json({ message: 'House not found' });
        res.status(200).json(house);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createHouse,
    getHouses,
    getHouse,
};
