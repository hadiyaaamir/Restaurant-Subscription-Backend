const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const EventController = require('../controllers/events');



//Get All Events
router.get('/',  EventController.events_get);

//Get Event Details
router.get('/:eventId',  EventController.get_details);



module.exports = router;