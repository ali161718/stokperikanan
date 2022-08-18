const express = require('express');
const router = express.Router();

const lib = require('./lib');

router.get('/librange', lib.getAllByRange);
router.get('/libcommodity/:commodity', lib.getAllByCommodity);
router.get('/libid/:id', lib.getAllById);
router.get('/libarea/:prov/:kota', lib.getAllByArea);
router.post('/lib', lib.postRecord);
router.put('/lib/:id', lib.putRecord);
router.delete('/lib/:id', lib.deleteRecord);
router.get('/libmaxprice/commodity/:commodity', lib.getMaxPriceByCommodity);
router.get('/libmostrecord', lib.getMostRecord);

module.exports = router;
