//routes/houseRoutes.js
const express = require('express');
const { createHouse, getHouses, getHouse, updateHouse, deleteHouse, searchHouses, getMyHouses } = require('../controllers/houseController.js');
const { protect } = require('../middlewares/authMiddleware.js');
const { allowRoles } = require('../middlewares/roleMiddleware.js');

const router = express.Router();

router.post('/', protect, allowRoles('seller', 'admin'), createHouse);
router.get('/', getHouses);
router.get('/:id', getHouse);
router.patch('/:id', protect, allowRoles('seller', 'admin'), updateHouse);
router.delete('/:id', protect, allowRoles('seller', 'admin'), deleteHouse);
router.post('/search', searchHouses);
router.get('/getMyHouses', protect, allowRoles('seller'), getMyHouses);

module.exports = router;
