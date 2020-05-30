const express = require('express');

const mainController = require('../controllers/mainController');

const router = express.Router();

router.route("/").get(mainController.index);
router.route('/blog/:id').get(mainController.showBlog);
router.route('/history').get(mainController.history);

module.exports = router;