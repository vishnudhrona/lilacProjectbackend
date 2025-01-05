var express = require('express');
var router = express.Router();
const countryController = require('../Controller/countryController')

router.get('/countries',countryController.fetchingCountry)
router.get('/searchingcountries',countryController.searchingCountry)


module.exports = router;
