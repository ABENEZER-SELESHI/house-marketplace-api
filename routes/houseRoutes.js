//routes/houseRoutes.js
const express = require('express');
const { createHouse, getHouses, getHouse } = require('../controllers/houseController.js');
const { protect } = require('../middlewares/authMiddleware.js');


const router = express.Router();

router.post('/', protect, createHouse);
router.get('/', getHouses);
router.get('/:id', getHouse);

module.exports = router;
