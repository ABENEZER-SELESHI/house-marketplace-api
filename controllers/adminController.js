// controllers/adminController.js
const User = require('../models/User.js');
const House = require('../models/House.js');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const changeUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = role;
        await user.save();
        res.status(200).json({ message: 'User role updated', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Houses
const getAllHouses = async (req, res) => {
    try {
        const houses = await House.find().populate('owner', 'email name');
        res.status(200).json(houses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteHouse = async (req, res) => {
    try {
        const house = await House.findByIdAndDelete(req.params.id);
        if (!house) return res.status(404).json({ message: 'House not found' });
        res.status(200).json({ message: 'House deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'admin'
    });

    res.status(201).json({
        message: 'Admin user created successfully',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};


module.exports = {
    getAllUsers,
    changeUserRole,
    deleteUser,
    getAllHouses,
    deleteHouse,
    createAdmin,
};
