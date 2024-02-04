const express = require('express');
const router = express.Router();

router.use('/teams', require('./teams'));
router.use('/', require('./swagger'));

module.exports = router;