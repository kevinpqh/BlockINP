var express = require('express');
var router = express.Router();
var ctrlBlock = require('../controllers/block');
var ctrlReviews = require('../controllers/reviews');

router.get('/block', ctrlBlock.blockListById);
router.post('/block', ctrlBlock.blockCreate);
router.get('/block/:blockid', ctrlBlock.blockReadOne);
router.put('/block/:blockid', ctrlBlock.blockUpdateOne);
router.delete('/block/:blockid', ctrlBlock.blockDeleteOne);

// reviews
router.post('/block/:blockid/reviews', ctrlReviews.reviewsCreate);
router.get('/block/:blockid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
router.put('/block/:blockid/reviews/:reviewid', ctrlReviews.reviewsUpdateOne);
router.delete('/block/:blockid/reviews/:reviewid', ctrlReviews.reviewsDeleteOne);

module.exports = router;
