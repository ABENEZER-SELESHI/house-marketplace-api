//routes/adminRoutes.js
const express = require('express');
const { protect } = require('../middlewares/authMiddleware.js');
const { adminOnly } = require('../middlewares/roleMiddleware.js');
const {
    getAllUsers,
    changeUserRole,
    deleteUser,
    getAllHouses,
    deleteHouse,
    createAdmin
} = require('../controllers/adminController.js');

const router = express.Router();

router.use(protect, adminOnly);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id/role', changeUserRole);
router.delete('/users/:id', deleteUser);
router.post('/create-admin', protect, adminOnly, createAdmin);

// House management
router.get('/houses', getAllHouses);
router.delete('/houses/:id', deleteHouse);

module.exports = router;
