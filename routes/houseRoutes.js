//routes/houseRoutes.js
const express = require('express');
const { createHouse, getHouses, getHouse, updateHouse, deleteHouse } = require('../controllers/houseController.js');
const { protect } = require('../middlewares/authMiddleware.js');


const router = express.Router();

router.post('/', protect, createHouse);
router.get('/', getHouses);
router.get('/:id', getHouse);
router.patch('/:id', protect, updateHouse);
router.delete('/:id', protect, deleteHouse);

module.exports = router;
