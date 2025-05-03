const express = require('express');
const router = express.Router();
const MainController = require('../controllers/mainController');
const mainController = new MainController();

// Route for the home page
router.get('/', mainController.getIndex);

// Route for handling errors
router.get('/error', mainController.handleError);

module.exports = router;