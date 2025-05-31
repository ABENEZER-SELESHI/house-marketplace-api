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

const updateHouse = async (req, res) => {
    try {
        const house = await House.findById(req.params.id);
        if (!house) return res.status(404).json({ message: 'House not found' });
        
        // unauthorized user
        if (house.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "user not authorize to update this house." })
        }

        Object.assign(house, req.body);

        await house.save();
        res.status(200).json(house);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteHouse = async (req, res) => {
    try {
        const house = await House.findById(req.params.id);
        if (!house) return res.status(404).json({ message: 'House not found' });
        
        // unauthorized user
        if (house.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "user not authorize to delete this house." })
        }

        await House.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'House deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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

const searchHouses = async (req, res) => {
    try {
        const { district, minPrice, maxPrice } = req.body;
        const filter = {};

        if (district) filter['location.district'] = district;
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) filter.price.$gte = minPrice;
            if (maxPrice !== undefined) filter.price.$lte = maxPrice;
        }

        const houses = await House.find(filter);
        res.json(houses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getMyHouses = async (req, res) => {
    try {
        const userId = req.user._id;

        const houses = await House.find({ owner: userId });
        res.json(houses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createHouse,
    getHouses,
    getHouse,
    updateHouse,
    deleteHouse,
    searchHouses,
    getMyHouses,
};
